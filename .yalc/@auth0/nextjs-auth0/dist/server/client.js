import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AccessTokenError, AccessTokenErrorCode, FederatedConnectionAccessTokenErrorCode, FederatedConnectionsAccessTokenError } from "../errors";
import { AuthClient } from "./auth-client";
import { RequestCookies, ResponseCookies } from "./cookies";
import { StatefulSessionStore } from "./session/stateful-session-store";
import { StatelessSessionStore } from "./session/stateless-session-store";
import { TransactionStore } from "./transaction-store";
export class Auth0Client {
    constructor(options = {}) {
        const domain = (options.domain || process.env.AUTH0_DOMAIN);
        const clientId = (options.clientId ||
            process.env.AUTH0_CLIENT_ID);
        const clientSecret = (options.clientSecret ||
            process.env.AUTH0_CLIENT_SECRET);
        const appBaseUrl = (options.appBaseUrl ||
            process.env.APP_BASE_URL);
        const secret = (options.secret || process.env.AUTH0_SECRET);
        const clientAssertionSigningKey = options.clientAssertionSigningKey ||
            process.env.AUTH0_CLIENT_ASSERTION_SIGNING_KEY;
        const clientAssertionSigningAlg = options.clientAssertionSigningAlg ||
            process.env.AUTH0_CLIENT_ASSERTION_SIGNING_ALG;
        const sessionCookieOptions = {
            name: options.session?.cookie?.name ?? "__session",
            secure: options.session?.cookie?.secure ?? false,
            sameSite: options.session?.cookie?.sameSite ?? "lax"
        };
        const transactionCookieOptions = {
            prefix: options.transactionCookie?.prefix ?? "__txn_",
            secure: options.transactionCookie?.secure ?? false,
            sameSite: options.transactionCookie?.sameSite ?? "lax"
        };
        if (appBaseUrl) {
            const { protocol } = new URL(appBaseUrl);
            if (protocol === "https:") {
                sessionCookieOptions.secure = true;
                transactionCookieOptions.secure = true;
            }
        }
        this.transactionStore = new TransactionStore({
            ...options.session,
            secret,
            cookieOptions: transactionCookieOptions
        });
        this.sessionStore = options.sessionStore
            ? new StatefulSessionStore({
                ...options.session,
                secret,
                store: options.sessionStore,
                cookieOptions: sessionCookieOptions
            })
            : new StatelessSessionStore({
                ...options.session,
                secret,
                cookieOptions: sessionCookieOptions
            });
        this.authClient = new AuthClient({
            transactionStore: this.transactionStore,
            sessionStore: this.sessionStore,
            domain,
            clientId,
            clientSecret,
            clientAssertionSigningKey,
            clientAssertionSigningAlg,
            authorizationParameters: options.authorizationParameters,
            pushedAuthorizationRequests: options.pushedAuthorizationRequests,
            appBaseUrl,
            secret,
            signInReturnToPath: options.signInReturnToPath,
            beforeSessionSaved: options.beforeSessionSaved,
            onCallback: options.onCallback,
            routes: options.routes,
            allowInsecureRequests: options.allowInsecureRequests,
            httpTimeout: options.httpTimeout,
            enableTelemetry: options.enableTelemetry
        });
    }
    /**
     * middleware mounts the SDK routes to run as a middleware function.
     */
    middleware(req) {
        return this.authClient.handler.bind(this.authClient)(req);
    }
    /**
     * getSession returns the session data for the current request.
     */
    async getSession(req) {
        if (req) {
            // middleware usage
            if (req instanceof NextRequest) {
                return this.sessionStore.get(req.cookies);
            }
            // pages router usage
            return this.sessionStore.get(this.createRequestCookies(req));
        }
        // app router usage: Server Components, Server Actions, Route Handlers
        return this.sessionStore.get(await cookies());
    }
    /**
     * getAccessToken returns the access token.
     *
     * NOTE: Server Components cannot set cookies. Calling `getAccessToken()` in a Server Component will cause the access token to be refreshed, if it is expired, and the updated token set will not to be persisted.
     * It is recommended to call `getAccessToken(req, res)` in the middleware if you need to retrieve the access token in a Server Component to ensure the updated token set is persisted.
     */
    async getAccessToken(req, res) {
        const session = req ? await this.getSession(req) : await this.getSession();
        if (!session) {
            throw new AccessTokenError(AccessTokenErrorCode.MISSING_SESSION, "The user does not have an active session.");
        }
        const [error, tokenSet] = await this.authClient.getTokenSet(session.tokenSet);
        if (error) {
            throw error;
        }
        // update the session with the new token set, if necessary
        if (tokenSet.accessToken !== session.tokenSet.accessToken ||
            tokenSet.expiresAt !== session.tokenSet.expiresAt ||
            tokenSet.refreshToken !== session.tokenSet.refreshToken) {
            await this.saveToSession({
                ...session,
                tokenSet
            }, req, res);
        }
        return {
            token: tokenSet.accessToken,
            scope: tokenSet.scope,
            expiresAt: tokenSet.expiresAt
        };
    }
    /**
     * Retrieves an access token for a federated connection.
     *
     * This method attempts to obtain an access token for a specified federated connection.
     * It first checks if a session exists, either from the provided request or from cookies.
     * If no session is found, it throws a `FederatedConnectionsAccessTokenError` indicating
     * that the user does not have an active session.
     *
     * @param {GetFederatedConnectionAccessTokenOptions} options - Options for retrieving a federated connection access token.
     * @param {PagesRouterRequest | NextRequest} [req] - An optional request object from which to extract session information.
     * @param {PagesRouterResponse | NextResponse} [res] - An optional response object from which to extract session information.
     *
     * @throws {FederatedConnectionsAccessTokenError} If the user does not have an active session.
     * @throws {Error} If there is an error during the token exchange process.
     *
     * @returns {Promise<{ token: string; expiresAt: number; scope?: string }} An object containing the access token and its expiration time.
     */
    async getFederatedConnectionAccessToken(options, req, res) {
        const session = req ? await this.getSession(req) : await this.getSession();
        if (!session) {
            throw new FederatedConnectionsAccessTokenError(FederatedConnectionAccessTokenErrorCode.MISSING_SESSION, "The user does not have an active session.");
        }
        // Find the federated connection token set in the session
        const existingTokenSet = session.federatedConnectionTokenSets?.find((tokenSet) => tokenSet.connection === options.connection);
        const [error, retrievedTokenSet] = await this.authClient.getFederatedConnectionTokenSet(session.tokenSet, existingTokenSet, options);
        if (error !== null) {
            throw error;
        }
        // If we didnt have a corresponding federated connection token set in the session
        // or if the one we have in the session does not match the one we received
        // We want to update the store incase we retrieved a token set.
        if (retrievedTokenSet &&
            (!existingTokenSet ||
                retrievedTokenSet.accessToken !== existingTokenSet.accessToken ||
                retrievedTokenSet.expiresAt !== existingTokenSet.expiresAt ||
                retrievedTokenSet.scope !== existingTokenSet.scope)) {
            let tokenSets;
            // If we already had the federated connection token set in the session
            // we need to update the item in the array
            // If not, we need to add it.
            if (existingTokenSet) {
                tokenSets = session.federatedConnectionTokenSets?.map((tokenSet) => tokenSet.connection === options.connection
                    ? retrievedTokenSet
                    : tokenSet);
            }
            else {
                tokenSets = [
                    ...(session.federatedConnectionTokenSets || []),
                    retrievedTokenSet
                ];
            }
            await this.saveToSession({
                ...session,
                federatedConnectionTokenSets: tokenSets
            }, req, res);
        }
        return {
            token: retrievedTokenSet.accessToken,
            scope: retrievedTokenSet.scope,
            expiresAt: retrievedTokenSet.expiresAt
        };
    }
    /**
     * updateSession updates the session of the currently authenticated user. If the user does not have a session, an error is thrown.
     */
    async updateSession(reqOrSession, res, sessionData) {
        if (!res) {
            // app router: Server Actions, Route Handlers
            const existingSession = await this.getSession();
            if (!existingSession) {
                throw new Error("The user is not authenticated.");
            }
            const updatedSession = reqOrSession;
            if (!updatedSession) {
                throw new Error("The session data is missing.");
            }
            await this.sessionStore.set(await cookies(), await cookies(), {
                ...updatedSession,
                internal: {
                    ...existingSession.internal
                }
            });
        }
        else {
            const req = reqOrSession;
            if (!sessionData) {
                throw new Error("The session data is missing.");
            }
            if (req instanceof NextRequest && res instanceof NextResponse) {
                // middleware usage
                const existingSession = await this.getSession(req);
                if (!existingSession) {
                    throw new Error("The user is not authenticated.");
                }
                await this.sessionStore.set(req.cookies, res.cookies, {
                    ...sessionData,
                    internal: {
                        ...existingSession.internal
                    }
                });
            }
            else {
                // pages router usage
                const existingSession = await this.getSession(req);
                if (!existingSession) {
                    throw new Error("The user is not authenticated.");
                }
                const resHeaders = new Headers();
                const resCookies = new ResponseCookies(resHeaders);
                const updatedSession = sessionData;
                const reqCookies = this.createRequestCookies(req);
                const pagesRouterRes = res;
                await this.sessionStore.set(reqCookies, resCookies, {
                    ...updatedSession,
                    internal: {
                        ...existingSession.internal
                    }
                });
                for (const [key, value] of resHeaders.entries()) {
                    pagesRouterRes.setHeader(key, value);
                }
            }
        }
    }
    createRequestCookies(req) {
        const headers = new Headers();
        for (const key in req.headers) {
            if (Array.isArray(req.headers[key])) {
                for (const value of req.headers[key]) {
                    headers.append(key, value);
                }
            }
            else {
                headers.append(key, req.headers[key] ?? "");
            }
        }
        return new RequestCookies(headers);
    }
    async saveToSession(data, req, res) {
        if (req && res) {
            if (req instanceof NextRequest && res instanceof NextResponse) {
                // middleware usage
                await this.sessionStore.set(req.cookies, res.cookies, data);
            }
            else {
                // pages router usage
                const resHeaders = new Headers();
                const resCookies = new ResponseCookies(resHeaders);
                const pagesRouterRes = res;
                await this.sessionStore.set(this.createRequestCookies(req), resCookies, data);
                for (const [key, value] of resHeaders.entries()) {
                    pagesRouterRes.setHeader(key, value);
                }
            }
        }
        else {
            // app router usage: Server Components, Server Actions, Route Handlers
            try {
                await this.sessionStore.set(await cookies(), await cookies(), data);
            }
            catch (e) {
                if (process.env.NODE_ENV === "development") {
                    console.warn("Failed to persist the updated token set. `getAccessToken()` was likely called from a Server Component which cannot set cookies.");
                }
            }
        }
    }
}

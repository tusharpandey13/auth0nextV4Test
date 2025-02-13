import type { IncomingMessage, ServerResponse } from "node:http";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next/types";
import { GetFederatedConnectionAccessTokenOptions, SessionData, SessionDataStore } from "../types";
import { AuthorizationParameters, BeforeSessionSavedHook, OnCallbackHook, RoutesOptions } from "./auth-client";
import { SessionConfiguration } from "./session/abstract-session-store";
import { TransactionCookieOptions } from "./transaction-store";
export interface Auth0ClientOptions {
    /**
     * The Auth0 domain for the tenant (e.g.: `example.us.auth0.com`).
     *
     * If it's not specified, it will be loaded from the `AUTH0_DOMAIN` environment variable.
     */
    domain?: string;
    /**
     * The Auth0 client ID.
     *
     * If it's not specified, it will be loaded from the `AUTH0_CLIENT_ID` environment variable.
     */
    clientId?: string;
    /**
     * The Auth0 client secret.
     *
     * If it's not specified, it will be loaded from the `AUTH0_CLIENT_SECRET` environment variable.
     */
    clientSecret?: string;
    /**
     * Additional parameters to send to the `/authorize` endpoint.
     */
    authorizationParameters?: AuthorizationParameters;
    /**
     * If enabled, the SDK will use the Pushed Authorization Requests (PAR) protocol when communicating with the authorization server.
     */
    pushedAuthorizationRequests?: boolean;
    /**
     * Private key for use with `private_key_jwt` clients.
     * This should be a string that is the contents of a PEM file or a CryptoKey.
     */
    clientAssertionSigningKey?: string | CryptoKey;
    /**
     * The algorithm used to sign the client assertion JWT.
     * Uses one of `token_endpoint_auth_signing_alg_values_supported` if not specified.
     * If the Authorization Server discovery document does not list `token_endpoint_auth_signing_alg_values_supported`
     * this property will be required.
     */
    clientAssertionSigningAlg?: string;
    /**
     * The URL of your application (e.g.: `http://localhost:3000`).
     *
     * If it's not specified, it will be loaded from the `APP_BASE_URL` environment variable.
     */
    appBaseUrl?: string;
    /**
     * A 32-byte, hex-encoded secret used for encrypting cookies.
     *
     * If it's not specified, it will be loaded from the `AUTH0_SECRET` environment variable.
     */
    secret?: string;
    /**
     * The path to redirect the user to after successfully authenticating. Defaults to `/`.
     */
    signInReturnToPath?: string;
    /**
     * Configure the session timeouts and whether to use rolling sessions or not.
     *
     * See [Session configuration](https://github.com/auth0/nextjs-auth0#session-configuration) for additional details.
     */
    session?: SessionConfiguration;
    /**
     * Configure the transaction cookie used to store the state of the authentication transaction.
     */
    transactionCookie?: TransactionCookieOptions;
    /**
     * A method to manipulate the session before persisting it.
     *
     * See [beforeSessionSaved](https://github.com/auth0/nextjs-auth0#beforesessionsaved) for additional details
     */
    beforeSessionSaved?: BeforeSessionSavedHook;
    /**
     * A method to handle errors or manage redirects after attempting to authenticate.
     *
     * See [onCallback](https://github.com/auth0/nextjs-auth0#oncallback) for additional details
     */
    onCallback?: OnCallbackHook;
    /**
     * A custom session store implementation used to persist sessions to a data store.
     *
     * See [Database sessions](https://github.com/auth0/nextjs-auth0#database-sessions) for additional details.
     */
    sessionStore?: SessionDataStore;
    /**
     * Configure the paths for the authentication routes.
     *
     * See [Custom routes](https://github.com/auth0/nextjs-auth0#custom-routes) for additional details.
     */
    routes?: RoutesOptions;
    /**
     * Allow insecure requests to be made to the authorization server. This can be useful when testing
     * with a mock OIDC provider that does not support TLS, locally.
     * This option can only be used when NODE_ENV is not set to `production`.
     */
    allowInsecureRequests?: boolean;
    /**
     * Integer value for the HTTP timeout in milliseconds for authentication requests.
     * Defaults to `5000` ms.
     */
    httpTimeout?: number;
    /**
     * Boolean value to opt-out of sending the library name and version to your authorization server
     * via the `Auth0-Client` header. Defaults to `true`.
     */
    enableTelemetry?: boolean;
}
export type PagesRouterRequest = IncomingMessage | NextApiRequest;
export type PagesRouterResponse = ServerResponse<IncomingMessage> | NextApiResponse;
export declare class Auth0Client {
    private transactionStore;
    private sessionStore;
    private authClient;
    constructor(options?: Auth0ClientOptions);
    /**
     * middleware mounts the SDK routes to run as a middleware function.
     */
    middleware(req: NextRequest): Promise<NextResponse>;
    /**
     * getSession returns the session data for the current request.
     *
     * This method can be used in Server Components, Server Actions, and Route Handlers in the **App Router**.
     */
    getSession(): Promise<SessionData | null>;
    /**
     * getSession returns the session data for the current request.
     *
     * This method can be used in middleware and `getServerSideProps`, API routes in the **Pages Router**.
     */
    getSession(req: PagesRouterRequest | NextRequest): Promise<SessionData | null>;
    /**
     * getAccessToken returns the access token.
     *
     * This method can be used in Server Components, Server Actions, and Route Handlers in the **App Router**.
     *
     * NOTE: Server Components cannot set cookies. Calling `getAccessToken()` in a Server Component will cause the access token to be refreshed, if it is expired, and the updated token set will not to be persisted.
     * It is recommended to call `getAccessToken(req, res)` in the middleware if you need to retrieve the access token in a Server Component to ensure the updated token set is persisted.
     */
    getAccessToken(): Promise<{
        token: string;
        expiresAt: number;
    }>;
    /**
     * getAccessToken returns the access token.
     *
     * This method can be used in middleware and `getServerSideProps`, API routes in the **Pages Router**.
     */
    getAccessToken(req: PagesRouterRequest | NextRequest, res: PagesRouterResponse | NextResponse): Promise<{
        token: string;
        expiresAt: number;
    }>;
    /**
     * Retrieves an access token for a federated connection.
     *
     * This method can be used in Server Components, Server Actions, and Route Handlers in the **App Router**.
     *
     * NOTE: Server Components cannot set cookies. Calling `getFederatedConnectionAccessToken()` in a Server Component will cause the access token to be refreshed, if it is expired, and the updated token set will not to be persisted.
     * It is recommended to call `getFederatedConnectionAccessToken(req, res)` in the middleware if you need to retrieve the access token in a Server Component to ensure the updated token set is persisted.
     */
    getFederatedConnectionAccessToken(options: GetFederatedConnectionAccessTokenOptions): Promise<{
        token: string;
        expiresAt: number;
    }>;
    /**
     * Retrieves an access token for a federated connection.
     *
     * This method can be used in middleware and `getServerSideProps`, API routes in the **Pages Router**.
     */
    getFederatedConnectionAccessToken(options: GetFederatedConnectionAccessTokenOptions, req: PagesRouterRequest | NextRequest | undefined, res: PagesRouterResponse | NextResponse | undefined): Promise<{
        token: string;
        expiresAt: number;
    }>;
    /**
     * updateSession updates the session of the currently authenticated user. If the user does not have a session, an error is thrown.
     *
     * This method can be used in middleware and `getServerSideProps`, API routes, and middleware in the **Pages Router**.
     */
    updateSession(req: PagesRouterRequest | NextRequest, res: PagesRouterResponse | NextResponse, session: SessionData): Promise<void>;
    /**
     * updateSession updates the session of the currently authenticated user. If the user does not have a session, an error is thrown.
     *
     * This method can be used in Server Actions and Route Handlers in the **App Router**.
     */
    updateSession(session: SessionData): Promise<void>;
    private createRequestCookies;
    private saveToSession;
}

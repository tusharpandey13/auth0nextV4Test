import { NextResponse, type NextRequest } from "next/server";
import * as jose from "jose";
import { SdkError } from "../errors";
import { FederatedConnectionTokenSet, GetFederatedConnectionAccessTokenOptions, SessionData, TokenSet } from "../types";
import { AbstractSessionStore } from "./session/abstract-session-store";
import { TransactionStore } from "./transaction-store";
export type BeforeSessionSavedHook = (session: SessionData, idToken: string | null) => Promise<SessionData>;
export type OnCallbackContext = {
    returnTo?: string;
};
export type OnCallbackHook = (error: SdkError | null, ctx: OnCallbackContext, session: SessionData | null) => Promise<NextResponse>;
export interface AuthorizationParameters {
    /**
     * The list of scopes to request authorization for.
     *
     * Defaults to `"openid profile email offline_access"`.
     */
    scope?: string;
    /**
     * The maximum amount of time, in seconds, after which a user must reauthenticate.
     */
    max_age?: number;
    /**
     * Additional authorization parameters.
     */
    [key: string]: unknown;
}
export interface Routes {
    login: string;
    logout: string;
    callback: string;
    profile: string;
    accessToken: string;
    backChannelLogout: string;
}
export type RoutesOptions = Partial<Pick<Routes, "login" | "callback" | "logout" | "backChannelLogout">>;
export interface AuthClientOptions {
    transactionStore: TransactionStore;
    sessionStore: AbstractSessionStore;
    domain: string;
    clientId: string;
    clientSecret?: string;
    clientAssertionSigningKey?: string | CryptoKey;
    clientAssertionSigningAlg?: string;
    authorizationParameters?: AuthorizationParameters;
    pushedAuthorizationRequests?: boolean;
    secret: string;
    appBaseUrl: string;
    signInReturnToPath?: string;
    beforeSessionSaved?: BeforeSessionSavedHook;
    onCallback?: OnCallbackHook;
    routes?: RoutesOptions;
    fetch?: typeof fetch;
    jwksCache?: jose.JWKSCacheInput;
    allowInsecureRequests?: boolean;
    httpTimeout?: number;
    enableTelemetry?: boolean;
}
export declare class AuthClient {
    private transactionStore;
    private sessionStore;
    private clientMetadata;
    private clientSecret?;
    private clientAssertionSigningKey?;
    private clientAssertionSigningAlg;
    private domain;
    private authorizationParameters;
    private pushedAuthorizationRequests;
    private appBaseUrl;
    private signInReturnToPath;
    private beforeSessionSaved?;
    private onCallback;
    private routes;
    private fetch;
    private jwksCache;
    private allowInsecureRequests;
    private httpOptions;
    private authorizationServerMetadata?;
    constructor(options: AuthClientOptions);
    handler(req: NextRequest): Promise<NextResponse>;
    handleLogin(req: NextRequest): Promise<NextResponse>;
    handleLogout(req: NextRequest): Promise<NextResponse>;
    handleCallback(req: NextRequest): Promise<NextResponse>;
    handleProfile(req: NextRequest): Promise<NextResponse>;
    handleAccessToken(req: NextRequest): Promise<NextResponse>;
    handleBackChannelLogout(req: NextRequest): Promise<NextResponse>;
    /**
     * getTokenSet returns a valid token set. If the access token has expired, it will attempt to
     * refresh it using the refresh token, if available.
     */
    getTokenSet(tokenSet: TokenSet): Promise<[null, TokenSet] | [SdkError, null]>;
    private discoverAuthorizationServerMetadata;
    private defaultOnCallback;
    private verifyLogoutToken;
    private authorizationUrl;
    private getClientAuth;
    private get issuer();
    /**
     * Exchanges a refresh token for a federated connection access token.
     *
     * This method performs a token exchange using the provided refresh token and connection details.
     * It first checks if the refresh token is present in the `tokenSet`. If not, it returns an error.
     * Then, it constructs the necessary parameters for the token exchange request and performs
     * the request to the authorization server's token endpoint.
     *
     * @returns {Promise<[SdkError, null] | [null, FederatedConnectionTokenSet]>} A promise that resolves to a tuple.
     *          The first element is either an `SdkError` if an error occurred, or `null` if the request was successful.
     *          The second element is either `null` if an error occurred, or a `FederatedConnectionTokenSet` object
     *          containing the access token, expiration time, and scope if the request was successful.
     *
     * @throws {FederatedConnectionsAccessTokenError} If the refresh token is missing or if there is an error during the token exchange process.
     */
    getFederatedConnectionTokenSet(tokenSet: TokenSet, federatedConnectionTokenSet: FederatedConnectionTokenSet | undefined, options: GetFederatedConnectionAccessTokenOptions): Promise<[SdkError, null] | [null, FederatedConnectionTokenSet]>;
}

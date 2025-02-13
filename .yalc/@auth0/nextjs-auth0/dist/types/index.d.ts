export interface TokenSet {
    accessToken: string;
    scope?: string;
    refreshToken?: string;
    expiresAt: number;
}
export interface FederatedConnectionTokenSet {
    accessToken: string;
    scope?: string;
    expiresAt: number;
    connection: string;
    [key: string]: unknown;
}
export interface SessionData {
    user: User;
    tokenSet: TokenSet;
    internal: {
        sid: string;
        createdAt: number;
    };
    federatedConnectionTokenSets?: FederatedConnectionTokenSet[];
    [key: string]: unknown;
}
export interface SessionDataStore {
    /**
     * Gets the session from the store given a session ID.
     */
    get(id: string): Promise<SessionData | null>;
    /**
     * Upsert a session in the store given a session ID and `SessionData`.
     */
    set(id: string, session: SessionData): Promise<void>;
    /**
     * Destroys the session with the given session ID.
     */
    delete(id: string): Promise<void>;
    /**
     * Deletes the session with the given logout token which may contain a session ID or a user ID, or both.
     */
    deleteByLogoutToken?(logoutToken: LogoutToken): Promise<void>;
}
export type LogoutToken = {
    sub?: string;
    sid?: string;
};
export interface User {
    sub: string;
    name?: string;
    nickname?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    email?: string;
    email_verified?: boolean;
    org_id?: string;
    [key: string]: any;
}
export type { Auth0ClientOptions, PagesRouterRequest, PagesRouterResponse } from "../server/client";
export type { AuthorizationParameters, BeforeSessionSavedHook, OnCallbackHook, RoutesOptions, AuthClientOptions, OnCallbackContext, Routes } from "../server/auth-client";
export type { TransactionCookieOptions } from "../server/transaction-store";
export type { SessionConfiguration, SessionCookieOptions, SessionStoreOptions } from "../server/session/abstract-session-store";
export type { CookieOptions, ReadonlyRequestCookies } from "../server/cookies";
export type { TransactionStoreOptions, TransactionState } from "../server/transaction-store";
/**
 * Options for retrieving a federated connection access token.
 */
export interface GetFederatedConnectionAccessTokenOptions {
    /**
     * The connection name for while you want to retrieve the access token.
     */
    connection: string;
    /**
     * An optiona login hint to pass to the authorization server.
     */
    login_hint?: string;
}

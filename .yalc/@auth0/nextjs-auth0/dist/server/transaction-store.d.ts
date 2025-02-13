import type * as jose from "jose";
import * as cookies from "./cookies";
export interface TransactionState extends jose.JWTPayload {
    nonce: string;
    codeVerifier: string;
    responseType: string;
    state: string;
    returnTo: string;
    maxAge?: number;
}
export interface TransactionCookieOptions {
    /**
     * The prefix of the cookie used to store the transaction state.
     *
     * Default: `__txn_{state}`.
     */
    prefix?: string;
    /**
     * The sameSite attribute of the transaction cookie.
     *
     * Default: `lax`.
     */
    sameSite?: "strict" | "lax" | "none";
    /**
     * The secure attribute of the transaction cookie.
     *
     * Default: depends on the protocol of the application's base URL. If the protocol is `https`, then `true`, otherwise `false`.
     */
    secure?: boolean;
}
export interface TransactionStoreOptions {
    secret: string;
    cookieOptions?: TransactionCookieOptions;
}
/**
 * TransactionStore is responsible for storing the state required to successfully complete
 * an authentication transaction. The store relies on encrypted, stateless cookies to store
 * the transaction state.
 */
export declare class TransactionStore {
    private secret;
    private transactionCookiePrefix;
    private cookieConfig;
    constructor({ secret, cookieOptions }: TransactionStoreOptions);
    /**
     * Returns the name of the cookie used to store the transaction state.
     * The cookie name is derived from the state parameter to prevent collisions
     * between different transactions.
     */
    private getTransactionCookieName;
    save(resCookies: cookies.ResponseCookies, transactionState: TransactionState): Promise<void>;
    get(reqCookies: cookies.RequestCookies, state: string): Promise<(TransactionState & jose.JWTPayload) | null>;
    delete(resCookies: cookies.ResponseCookies, state: string): Promise<void>;
}

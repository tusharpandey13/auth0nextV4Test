import type { SessionData, SessionDataStore } from "../../types";
import { CookieOptions, ReadonlyRequestCookies, RequestCookies, ResponseCookies } from "../cookies";
export interface SessionCookieOptions {
    /**
     * The name of the session cookie.
     *
     * Default: `__session`.
     */
    name?: string;
    /**
     * The sameSite attribute of the session cookie.
     *
     * Default: `lax`.
     */
    sameSite?: "strict" | "lax" | "none";
    /**
     * The secure attribute of the session cookie.
     *
     * Default: depends on the protocol of the application's base URL. If the protocol is `https`, then `true`, otherwise `false`.
     */
    secure?: boolean;
}
export interface SessionConfiguration {
    /**
     * A boolean indicating whether rolling sessions should be used or not.
     *
     * When enabled, the session will continue to be extended as long as it is used within the inactivity duration.
     * Once the upper bound, set via the `absoluteDuration`, has been reached, the session will no longer be extended.
     *
     * Default: `true`.
     */
    rolling?: boolean;
    /**
     * The absolute duration after which the session will expire. The value must be specified in seconds..
     *
     * Once the absolute duration has been reached, the session will no longer be extended.
     *
     * Default: 3 days.
     */
    absoluteDuration?: number;
    /**
     * The duration of inactivity after which the session will expire. The value must be specified in seconds.
     *
     * The session will be extended as long as it was active before the inactivity duration has been reached.
     *
     * Default: 1 day.
     */
    inactivityDuration?: number;
    /**
     * The options for the session cookie.
     */
    cookie?: SessionCookieOptions;
}
export interface SessionStoreOptions extends SessionConfiguration {
    secret: string;
    store?: SessionDataStore;
    cookieOptions?: SessionCookieOptions;
}
export declare abstract class AbstractSessionStore {
    secret: string;
    sessionCookieName: string;
    private rolling;
    private absoluteDuration;
    private inactivityDuration;
    store?: SessionDataStore;
    cookieConfig: CookieOptions;
    constructor({ secret, rolling, absoluteDuration, // 3 days in seconds
    inactivityDuration, // 1 day in seconds
    store, cookieOptions }: SessionStoreOptions);
    abstract get(reqCookies: RequestCookies | ReadonlyRequestCookies): Promise<SessionData | null>;
    /**
     * save adds the encrypted session cookie as a `Set-Cookie` header. If the `iat` property
     * is present on the session, then it will be used to compute the `maxAge` cookie value.
     */
    abstract set(reqCookies: RequestCookies | ReadonlyRequestCookies, resCookies: ResponseCookies, session: SessionData, isNew?: boolean): Promise<void>;
    abstract delete(reqCookies: RequestCookies | ReadonlyRequestCookies, resCookies: ResponseCookies): Promise<void>;
    /**
     * epoch returns the time since unix epoch in seconds.
     */
    epoch(): number;
    /**
     * calculateMaxAge calculates the max age of the session based on createdAt and the rolling and absolute durations.
     */
    calculateMaxAge(createdAt: number): number;
}

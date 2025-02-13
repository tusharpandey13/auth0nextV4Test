import { SessionData } from "../types";
export type GenerateSessionCookieConfig = {
    /**
     * The secret used to derive an encryption key for the session cookie.
     *
     * **IMPORTANT**: you must use the same value as in the SDK configuration.
     */
    secret: string;
};
export declare const generateSessionCookie: (session: Partial<SessionData>, config: GenerateSessionCookieConfig) => Promise<string>;

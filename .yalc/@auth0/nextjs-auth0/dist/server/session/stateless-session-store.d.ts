import { FederatedConnectionTokenSet, SessionData } from "../../types";
import * as cookies from "../cookies";
import { AbstractSessionStore, SessionCookieOptions } from "./abstract-session-store";
interface StatelessSessionStoreOptions {
    secret: string;
    rolling?: boolean;
    absoluteDuration?: number;
    inactivityDuration?: number;
    cookieOptions?: SessionCookieOptions;
}
export declare class StatelessSessionStore extends AbstractSessionStore {
    federatedConnectionTokenSetsCookieName: string;
    constructor({ secret, rolling, absoluteDuration, inactivityDuration, cookieOptions }: StatelessSessionStoreOptions);
    get(reqCookies: cookies.RequestCookies): Promise<{
        federatedConnectionTokenSets?: FederatedConnectionTokenSet[];
        user: import("../../types").User;
        tokenSet: import("../../types").TokenSet;
        internal: {
            sid: string;
            createdAt: number;
        };
        iss?: string;
        sub?: string;
        aud?: string | string[];
        jti?: string;
        nbf?: number;
        exp?: number;
        iat?: number;
    } | null>;
    /**
     * save adds the encrypted session cookie as a `Set-Cookie` header.
     */
    set(reqCookies: cookies.RequestCookies, resCookies: cookies.ResponseCookies, session: SessionData): Promise<void>;
    delete(reqCookies: cookies.RequestCookies, resCookies: cookies.ResponseCookies): Promise<void>;
    private storeInCookie;
    private getFederatedConnectionTokenSetsCookies;
}
export {};

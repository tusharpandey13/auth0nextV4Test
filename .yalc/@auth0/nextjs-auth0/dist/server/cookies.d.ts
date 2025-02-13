import { RequestCookies, ResponseCookies } from "@edge-runtime/cookies";
import * as jose from "jose";
export declare function encrypt(payload: jose.JWTPayload, secret: string): Promise<string>;
export declare function decrypt<T>(cookieValue: string, secret: string): Promise<T & jose.JWTPayload>;
export interface CookieOptions {
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none";
    secure: boolean;
    path: string;
    maxAge?: number;
}
export type ReadonlyRequestCookies = Omit<RequestCookies, "set" | "clear" | "delete"> & Pick<ResponseCookies, "set" | "delete">;
export { ResponseCookies };
export { RequestCookies };

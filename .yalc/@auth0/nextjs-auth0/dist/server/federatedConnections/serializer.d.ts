/**
 * Represents the response containing an access token from a federated connection.
 */
import { JWTPayload } from "jose";
import { SessionData } from "../../types";
import { EncryptAndSetCookieOptions, RequestCookies, ResponseCookies } from "../cookies";
export declare const FCAT_PREFIX = "__FC";
export declare const FCAT_DELIMITER = "|";
export interface FederatedConnectionTokenSet extends JWTPayload {
    /**
     * The access token issued by the federated connection.
     */
    accessToken: string;
    /**
     * The timestamp (in seconds since epoch) when the access token expires.
     */
    expiresAt: number;
    /**
     * Optional. The scope of the access token.
     */
    scope?: string;
    /**
     * The name of the federated connection.
     */
    connection: string;
}
/**
 * Generates the FCAT cookie name based on the provided connection.
 *
 * @param connection - The name of the connection.
 * @returns The generated FCAT cookie name.
 */
export declare const getFCCookieName: (connection: string) => string;
/**
 * Adds or updates a federated token in the session data.
 *
 * @param session - The session data object where the federated token will be added or updated.
 * @param fcat - The federated connection token set containing the access token, expiration time, and scope.
 * @returns The updated session data object.
 */
export declare const addOrUpdateFederatedTokenToSession: (session: SessionData, fcat: FederatedConnectionTokenSet) => SessionData;
/**
 * Serializes federated tokens and stores them in cookies.
 *
 * @param fcTokenSetMap - A map of federated connection token sets.
 * @param options - Options for storing the tokens in cookies.
 *
 * @returns A promise that resolves when all tokens have been stored in cookies.
 */
export declare const serializeFederatedTokens: (fcTokenSetMap: FederatedConnectionTokenSet[], options: EncryptAndSetCookieOptions) => Promise<void>;
/**
 * Deserializes federated tokens from cookies and returns a map of federated connections.
 *
 * @param cookies - The cookies object, which can be either `RequestCookies` or `ResponseCookies`.
 * @returns A promise that resolves to a `FederatedConnectionMap` containing the deserialized federated tokens.
 */
export declare const deserializeFederatedTokens: (cookies: RequestCookies | ResponseCookies, secret: string) => Promise<FederatedConnectionTokenSet[]>;
export declare const findFederatedToken: (session: SessionData, connection: string) => FederatedConnectionTokenSet | undefined;
export declare const deleteFCATCookies: (reqCookies: RequestCookies, resCookies: ResponseCookies) => Promise<void>;

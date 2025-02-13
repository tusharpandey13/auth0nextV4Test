import { decrypt, encryptAndSet, } from "../cookies";
export const FCAT_PREFIX = "__FC";
export const FCAT_DELIMITER = "|";
/**
 * Generates the FCAT cookie name based on the provided connection.
 *
 * @param connection - The name of the connection.
 * @returns The generated FCAT cookie name.
 */
export const getFCCookieName = (connection) => {
    return [FCAT_PREFIX, connection].join(FCAT_DELIMITER);
};
/**
 * Adds or updates a federated token in the session data.
 *
 * @param session - The session data object where the federated token will be added or updated.
 * @param fcat - The federated connection token set containing the access token, expiration time, and scope.
 * @returns The updated session data object.
 */
export const addOrUpdateFederatedTokenToSession = (session, fcat) => {
    // check if federatedConnectionTokenSets exists
    // check if connection same as fcat exists in federatedConnectionTokenSets
    //    if exists, replace
    //    if not exists, exit loop, push new element
    if (!session.federatedConnectionTokenSets)
        session.federatedConnectionTokenSets = [];
    const existingFederatedConnectionTokenSet = session.federatedConnectionTokenSets.find(tokenSet => tokenSet.connection === fcat.connection);
    if (existingFederatedConnectionTokenSet) {
        session.federatedConnectionTokenSets.map((tokenSet) => (tokenSet.connection === fcat.connection) ? fcat : tokenSet);
    }
    else {
        session.federatedConnectionTokenSets = [
            ...(session.federatedConnectionTokenSets || []),
            fcat
        ];
    }
    return session;
};
/**
 * Serializes federated tokens and stores them in cookies.
 *
 * @param fcTokenSetMap - A map of federated connection token sets.
 * @param options - Options for storing the tokens in cookies.
 *
 * @returns A promise that resolves when all tokens have been stored in cookies.
 */
export const serializeFederatedTokens = async (fcTokenSetMap, options) => {
    let counter = 0;
    for (const tokenSet of fcTokenSetMap) {
        await encryptAndSet({
            ...options,
            payload: tokenSet,
            cookieName: getFCCookieName(counter.toString()),
            maxAge: tokenSet.expiresAt,
        });
        counter++;
    }
};
const getFederatedConnectionTokenSetsCookies = (cookies) => {
    return cookies
        .getAll()
        .filter((cookie) => cookie.name.startsWith(FCAT_PREFIX));
};
/**
 * Deserializes federated tokens from cookies and returns a map of federated connections.
 *
 * @param cookies - The cookies object, which can be either `RequestCookies` or `ResponseCookies`.
 * @returns A promise that resolves to a `FederatedConnectionMap` containing the deserialized federated tokens.
 */
export const deserializeFederatedTokens = async (cookies, secret) => {
    const decryptFCCookie = async (cookie) => {
        return await decrypt(cookie.value, secret);
    };
    const filterExpired = (tokenSet) => !tokenSet || tokenSet.expiresAt <= Date.now() / 1000;
    const allCookies = await Promise.all(getFederatedConnectionTokenSetsCookies(cookies)
        .map(decryptFCCookie));
    const res = allCookies; // Map each cookie to an FCMapping object
    // .filter(filterExpired); // Filter out expired token sets
    return res;
};
export const findFederatedToken = (session, connection) => {
    if (!session.federatedConnectionTokenSets)
        return undefined;
    for (const tokenSet of Object.values(session.federatedConnectionTokenSets)) {
        if (tokenSet.connection === connection) {
            return tokenSet;
        }
    }
    return undefined;
};
export const deleteFCATCookies = async (reqCookies, resCookies) => {
    getFederatedConnectionTokenSetsCookies(reqCookies).forEach((x) => reqCookies.delete(x.name));
    getFederatedConnectionTokenSetsCookies(resCookies).forEach((x) => resCookies.delete(x.name));
};

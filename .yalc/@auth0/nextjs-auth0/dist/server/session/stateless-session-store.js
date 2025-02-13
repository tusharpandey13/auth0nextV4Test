import * as cookies from "../cookies";
import { AbstractSessionStore } from "./abstract-session-store";
export class StatelessSessionStore extends AbstractSessionStore {
    constructor({ secret, rolling, absoluteDuration, inactivityDuration, cookieOptions }) {
        super({
            secret,
            rolling,
            absoluteDuration,
            inactivityDuration,
            cookieOptions
        });
        this.federatedConnectionTokenSetsCookieName = "__FC";
    }
    async get(reqCookies) {
        const cookieValue = reqCookies.get(this.sessionCookieName)?.value;
        if (!cookieValue) {
            return null;
        }
        const originalSession = await cookies.decrypt(cookieValue, this.secret);
        // As federated connection access tokens are stored in seperate cookies,
        // we need to get all cookies and only use those that are prefixed with `this.federatedConnectionTokenSetsCookieName`
        const federatedConnectionTokenSets = await Promise.all(this.getFederatedConnectionTokenSetsCookies(reqCookies).map((fcatCookie) => cookies.decrypt(fcatCookie.value, this.secret)));
        return {
            ...originalSession,
            // Ensure that when there are no federated connection token sets, we omit the property.
            ...(federatedConnectionTokenSets.length
                ? { federatedConnectionTokenSets }
                : {})
        };
    }
    /**
     * save adds the encrypted session cookie as a `Set-Cookie` header.
     */
    async set(reqCookies, resCookies, session) {
        const { federatedConnectionTokenSets, ...originalSession } = session;
        const maxAge = this.calculateMaxAge(session.internal.createdAt);
        await this.storeInCookie(reqCookies, resCookies, originalSession, this.sessionCookieName, maxAge);
        // Store federated connection access tokens, each in its own cookie
        if (federatedConnectionTokenSets?.length) {
            await Promise.all(federatedConnectionTokenSets.map((federatedConnectionTokenSet, index) => this.storeInCookie(reqCookies, resCookies, federatedConnectionTokenSet, `${this.federatedConnectionTokenSetsCookieName}_${index}`, maxAge)));
        }
    }
    async delete(reqCookies, resCookies) {
        resCookies.delete(this.sessionCookieName);
        this.getFederatedConnectionTokenSetsCookies(reqCookies).forEach((cookie) => resCookies.delete(cookie.name));
    }
    async storeInCookie(reqCookies, resCookies, session, cookieName, maxAge) {
        const jwe = await cookies.encrypt(session, this.secret);
        const cookieValue = jwe.toString();
        resCookies.set(cookieName, jwe.toString(), {
            ...this.cookieConfig,
            maxAge
        });
        // to enable read-after-write in the same request for middleware
        reqCookies.set(cookieName, cookieValue);
        // check if the session cookie size exceeds 4096 bytes, and if so, log a warning
        const cookieJarSizeTest = new cookies.ResponseCookies(new Headers());
        cookieJarSizeTest.set(cookieName, cookieValue, {
            ...this.cookieConfig,
            maxAge
        });
        if (new TextEncoder().encode(cookieJarSizeTest.toString()).length >= 4096) {
            // if the cookie is the session cookie, log a warning with additional information about the claims and user profile.
            if (cookieName === this.sessionCookieName) {
                console.warn(`The ${cookieName} cookie size exceeds 4096 bytes, which may cause issues in some browsers. ` +
                    "Consider removing any unnecessary custom claims from the access token or the user profile. " +
                    "Alternatively, you can use a stateful session implementation to store the session data in a data store.");
            }
            else {
                console.warn(`The ${cookieName} cookie size exceeds 4096 bytes, which may cause issues in some browsers. ` +
                    "You can use a stateful session implementation to store the session data in a data store.");
            }
        }
    }
    getFederatedConnectionTokenSetsCookies(cookies) {
        return cookies
            .getAll()
            .filter((cookie) => cookie.name.startsWith(this.federatedConnectionTokenSetsCookieName));
    }
}

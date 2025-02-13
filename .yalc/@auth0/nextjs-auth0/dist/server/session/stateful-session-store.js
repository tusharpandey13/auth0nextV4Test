import * as cookies from "../cookies";
import { AbstractSessionStore } from "./abstract-session-store";
const generateId = () => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
};
export class StatefulSessionStore extends AbstractSessionStore {
    constructor({ secret, store, rolling, absoluteDuration, inactivityDuration, cookieOptions }) {
        super({
            secret,
            rolling,
            absoluteDuration,
            inactivityDuration,
            cookieOptions
        });
        this.store = store;
    }
    async get(reqCookies) {
        const cookieValue = reqCookies.get(this.sessionCookieName)?.value;
        if (!cookieValue) {
            return null;
        }
        const { id } = await cookies.decrypt(cookieValue, this.secret);
        return this.store.get(id);
    }
    async set(reqCookies, resCookies, session, isNew = false) {
        // check if a session already exists. If so, maintain the existing session ID
        let sessionId = null;
        const cookieValue = reqCookies.get(this.sessionCookieName)?.value;
        if (cookieValue) {
            const sessionCookie = await cookies.decrypt(cookieValue, this.secret);
            sessionId = sessionCookie.id;
        }
        // if this is a new session created by a new login we need to remove the old session
        // from the store and regenerate the session ID to prevent session fixation.
        if (sessionId && isNew) {
            await this.store.delete(sessionId);
            sessionId = generateId();
        }
        if (!sessionId) {
            sessionId = generateId();
        }
        const jwe = await cookies.encrypt({
            id: sessionId
        }, this.secret);
        const maxAge = this.calculateMaxAge(session.internal.createdAt);
        resCookies.set(this.sessionCookieName, jwe.toString(), {
            ...this.cookieConfig,
            maxAge
        });
        await this.store.set(sessionId, session);
        // to enable read-after-write in the same request for middleware
        reqCookies.set(this.sessionCookieName, jwe.toString());
    }
    async delete(reqCookies, resCookies) {
        const cookieValue = reqCookies.get(this.sessionCookieName)?.value;
        await resCookies.delete(this.sessionCookieName);
        if (!cookieValue) {
            return;
        }
        const { id } = await cookies.decrypt(cookieValue, this.secret);
        await this.store.delete(id);
    }
}

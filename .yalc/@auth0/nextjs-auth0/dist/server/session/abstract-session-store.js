const SESSION_COOKIE_NAME = "__session";
export class AbstractSessionStore {
    constructor({ secret, rolling = true, absoluteDuration = 60 * 60 * 24 * 3, // 3 days in seconds
    inactivityDuration = 60 * 60 * 24 * 1, // 1 day in seconds
    store, cookieOptions }) {
        this.secret = secret;
        this.rolling = rolling;
        this.absoluteDuration = absoluteDuration;
        this.inactivityDuration = inactivityDuration;
        this.store = store;
        this.sessionCookieName = cookieOptions?.name ?? SESSION_COOKIE_NAME;
        this.cookieConfig = {
            httpOnly: true,
            sameSite: cookieOptions?.sameSite ?? "lax",
            secure: cookieOptions?.secure ?? false,
            path: "/"
        };
    }
    /**
     * epoch returns the time since unix epoch in seconds.
     */
    epoch() {
        return (Date.now() / 1000) | 0;
    }
    /**
     * calculateMaxAge calculates the max age of the session based on createdAt and the rolling and absolute durations.
     */
    calculateMaxAge(createdAt) {
        if (!this.rolling) {
            return this.absoluteDuration;
        }
        const updatedAt = this.epoch();
        const expiresAt = Math.min(updatedAt + this.inactivityDuration, createdAt + this.absoluteDuration);
        const maxAge = expiresAt - this.epoch();
        return maxAge > 0 ? maxAge : 0;
    }
}

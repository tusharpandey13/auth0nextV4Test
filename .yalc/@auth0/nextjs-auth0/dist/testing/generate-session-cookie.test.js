import { describe, expect, it } from "vitest";
import { decrypt } from "../server/cookies";
import { generateSecret } from "../test/utils";
import { generateSessionCookie } from "./generate-session-cookie";
describe("generateSessionCookie", async () => {
    it("should use the session data provided", async () => {
        const createdAt = Math.floor(Date.now() / 1000);
        const session = {
            user: { sub: "user_123" },
            tokenSet: {
                accessToken: "at_123",
                refreshToken: "rt_123",
                expiresAt: 123456
            },
            internal: {
                sid: "auth0-sid",
                createdAt
            }
        };
        const secret = await generateSecret(32);
        const config = {
            secret
        };
        const sessionCookie = await generateSessionCookie(session, config);
        expect(sessionCookie).toEqual(expect.any(String));
        expect(await decrypt(sessionCookie, secret)).toEqual({
            user: {
                sub: "user_123"
            },
            tokenSet: {
                accessToken: "at_123",
                refreshToken: "rt_123",
                expiresAt: 123456
            },
            internal: {
                sid: "auth0-sid",
                createdAt: createdAt
            }
        });
    });
    it("should populate the internal property if it was not provided", async () => {
        const session = {
            user: { sub: "user_123" },
            tokenSet: {
                accessToken: "at_123",
                refreshToken: "rt_123",
                expiresAt: 123456
            }
        };
        const secret = await generateSecret(32);
        const config = {
            secret
        };
        const sessionCookie = await generateSessionCookie(session, config);
        expect(sessionCookie).toEqual(expect.any(String));
        expect(await decrypt(sessionCookie, secret)).toEqual({
            user: {
                sub: "user_123"
            },
            tokenSet: {
                accessToken: "at_123",
                refreshToken: "rt_123",
                expiresAt: 123456
            },
            internal: {
                sid: "auth0-sid",
                createdAt: expect.any(Number)
            }
        });
    });
    it("should not populate the internal property if a null was provided", async () => {
        const session = {
            user: { sub: "user_123" },
            tokenSet: {
                accessToken: "at_123",
                refreshToken: "rt_123",
                expiresAt: 123456
            },
            // @ts-expect-error intentionally testing with null (invalid type for internal)
            internal: null
        };
        const secret = await generateSecret(32);
        const config = {
            secret
        };
        const sessionCookie = await generateSessionCookie(session, config);
        expect(sessionCookie).toEqual(expect.any(String));
        expect(await decrypt(sessionCookie, secret)).toEqual({
            user: {
                sub: "user_123"
            },
            tokenSet: {
                accessToken: "at_123",
                refreshToken: "rt_123",
                expiresAt: 123456
            },
            internal: null
        });
    });
    it("should not populate the internal property if a undefine was provided", async () => {
        const session = {
            user: { sub: "user_123" },
            tokenSet: {
                accessToken: "at_123",
                refreshToken: "rt_123",
                expiresAt: 123456
            },
            internal: undefined
        };
        const secret = await generateSecret(32);
        const config = {
            secret
        };
        const sessionCookie = await generateSessionCookie(session, config);
        expect(sessionCookie).toEqual(expect.any(String));
        expect(await decrypt(sessionCookie, secret)).toEqual({
            user: {
                sub: "user_123"
            },
            tokenSet: {
                accessToken: "at_123",
                refreshToken: "rt_123",
                expiresAt: 123456
            },
            internal: undefined
        });
    });
});

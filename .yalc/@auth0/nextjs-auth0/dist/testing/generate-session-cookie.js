import { encrypt } from "../server/cookies";
export const generateSessionCookie = async (session, config) => {
    if (!("internal" in session)) {
        session.internal = {
            sid: "auth0-sid",
            createdAt: Math.floor(Date.now() / 1000)
        };
    }
    return encrypt(session, config.secret);
};

import { RequestCookies, ResponseCookies } from "@edge-runtime/cookies";
import hkdf from "@panva/hkdf";
import * as jose from "jose";
const ENC = "A256GCM";
const ALG = "dir";
const DIGEST = "sha256";
const BYTE_LENGTH = 32;
const ENCRYPTION_INFO = "JWE CEK";
export async function encrypt(payload, secret) {
    const encryptionSecret = await hkdf(DIGEST, secret, "", ENCRYPTION_INFO, BYTE_LENGTH);
    const encryptedCookie = await new jose.EncryptJWT(payload)
        .setProtectedHeader({ enc: ENC, alg: ALG })
        .encrypt(encryptionSecret);
    return encryptedCookie.toString();
}
export async function decrypt(cookieValue, secret) {
    const encryptionSecret = await hkdf(DIGEST, secret, "", ENCRYPTION_INFO, BYTE_LENGTH);
    const cookie = await jose.jwtDecrypt(cookieValue, encryptionSecret, {});
    return cookie.payload;
}
export { ResponseCookies };
export { RequestCookies };

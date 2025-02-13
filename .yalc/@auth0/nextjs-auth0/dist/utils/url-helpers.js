export function toSafeRedirect(dangerousRedirect, safeBaseUrl) {
    let url;
    try {
        url = new URL(dangerousRedirect, safeBaseUrl);
    }
    catch (e) {
        return undefined;
    }
    if (url.origin === safeBaseUrl.origin) {
        return url.toString();
    }
    return undefined;
}

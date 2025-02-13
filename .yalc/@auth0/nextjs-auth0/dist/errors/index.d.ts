export declare abstract class SdkError extends Error {
    abstract code: string;
}
/**
 * Errors that come from Auth0 in the `redirect_uri` callback may contain reflected user input via the OpenID Connect `error` and `error_description` query parameter.
 * You should **not** render the error `message`, or `error` and `error_description` properties without properly escaping them first.
 */
export declare class OAuth2Error extends SdkError {
    code: string;
    constructor({ code, message }: {
        code: string;
        message?: string;
    });
}
export declare class DiscoveryError extends SdkError {
    code: string;
    constructor(message?: string);
}
export declare class MissingStateError extends SdkError {
    code: string;
    constructor(message?: string);
}
export declare class InvalidStateError extends SdkError {
    code: string;
    constructor(message?: string);
}
export declare class AuthorizationError extends SdkError {
    code: string;
    cause: OAuth2Error;
    constructor({ cause, message }: {
        cause: OAuth2Error;
        message?: string;
    });
}
export declare class AuthorizationCodeGrantError extends SdkError {
    code: string;
    cause: OAuth2Error;
    constructor({ cause, message }: {
        cause: OAuth2Error;
        message?: string;
    });
}
export declare class BackchannelLogoutError extends SdkError {
    code: string;
    constructor(message?: string);
}
export declare enum AccessTokenErrorCode {
    MISSING_SESSION = "missing_session",
    MISSING_REFRESH_TOKEN = "missing_refresh_token",
    FAILED_TO_REFRESH_TOKEN = "failed_to_refresh_token"
}
export declare class AccessTokenError extends SdkError {
    code: string;
    constructor(code: string, message: string);
}
/**
 * Enum representing error codes related to federated connection access tokens.
 */
export declare enum FederatedConnectionAccessTokenErrorCode {
    /**
     * The session is missing.
     */
    MISSING_SESSION = "missing_session",
    /**
     * The refresh token is missing.
     */
    MISSING_REFRESH_TOKEN = "missing_refresh_token",
    /**
     * Failed to exchange the refresh token.
     */
    FAILED_TO_EXCHANGE = "failed_to_exchange_refresh_token"
}
/**
 * Error class representing an access token error for federated connections.
 * Extends the `SdkError` class.
 */
export declare class FederatedConnectionsAccessTokenError extends SdkError {
    /**
     * The error code associated with the access token error.
     */
    code: string;
    /**
     * Constructs a new `FederatedConnectionsAccessTokenError` instance.
     *
     * @param code - The error code.
     * @param message - The error message.
     */
    constructor(code: string, message: string);
}

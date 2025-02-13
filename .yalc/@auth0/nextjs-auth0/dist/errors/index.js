export class SdkError extends Error {
}
/**
 * Errors that come from Auth0 in the `redirect_uri` callback may contain reflected user input via the OpenID Connect `error` and `error_description` query parameter.
 * You should **not** render the error `message`, or `error` and `error_description` properties without properly escaping them first.
 */
export class OAuth2Error extends SdkError {
    constructor({ code, message }) {
        super(message ??
            "An error occured while interacting with the authorization server.");
        this.name = "OAuth2Error";
        this.code = code;
    }
}
export class DiscoveryError extends SdkError {
    constructor(message) {
        super(message ?? "Discovery failed for the OpenID Connect configuration.");
        this.code = "discovery_error";
        this.name = "DiscoveryError";
    }
}
export class MissingStateError extends SdkError {
    constructor(message) {
        super(message ?? "The state parameter is missing.");
        this.code = "missing_state";
        this.name = "MissingStateError";
    }
}
export class InvalidStateError extends SdkError {
    constructor(message) {
        super(message ?? "The state parameter is invalid.");
        this.code = "invalid_state";
        this.name = "InvalidStateError";
    }
}
export class AuthorizationError extends SdkError {
    constructor({ cause, message }) {
        super(message ?? "An error occured during the authorization flow.");
        this.code = "authorization_error";
        this.cause = cause;
        this.name = "AuthorizationError";
    }
}
export class AuthorizationCodeGrantError extends SdkError {
    constructor({ cause, message }) {
        super(message ??
            "An error occured while trying to exchange the authorization code.");
        this.code = "authorization_code_grant_error";
        this.cause = cause;
        this.name = "AuthorizationCodeGrantError";
    }
}
export class BackchannelLogoutError extends SdkError {
    constructor(message) {
        super(message ??
            "An error occured while completing the backchannel logout request.");
        this.code = "backchannel_logout_error";
        this.name = "BackchannelLogoutError";
    }
}
export var AccessTokenErrorCode;
(function (AccessTokenErrorCode) {
    AccessTokenErrorCode["MISSING_SESSION"] = "missing_session";
    AccessTokenErrorCode["MISSING_REFRESH_TOKEN"] = "missing_refresh_token";
    AccessTokenErrorCode["FAILED_TO_REFRESH_TOKEN"] = "failed_to_refresh_token";
})(AccessTokenErrorCode || (AccessTokenErrorCode = {}));
export class AccessTokenError extends SdkError {
    constructor(code, message) {
        super(message);
        this.name = "AccessTokenError";
        this.code = code;
    }
}
/**
 * Enum representing error codes related to federated connection access tokens.
 */
export var FederatedConnectionAccessTokenErrorCode;
(function (FederatedConnectionAccessTokenErrorCode) {
    /**
     * The session is missing.
     */
    FederatedConnectionAccessTokenErrorCode["MISSING_SESSION"] = "missing_session";
    /**
     * The refresh token is missing.
     */
    FederatedConnectionAccessTokenErrorCode["MISSING_REFRESH_TOKEN"] = "missing_refresh_token";
    /**
     * Failed to exchange the refresh token.
     */
    FederatedConnectionAccessTokenErrorCode["FAILED_TO_EXCHANGE"] = "failed_to_exchange_refresh_token";
})(FederatedConnectionAccessTokenErrorCode || (FederatedConnectionAccessTokenErrorCode = {}));
/**
 * Error class representing an access token error for federated connections.
 * Extends the `SdkError` class.
 */
export class FederatedConnectionsAccessTokenError extends SdkError {
    /**
     * Constructs a new `FederatedConnectionsAccessTokenError` instance.
     *
     * @param code - The error code.
     * @param message - The error message.
     */
    constructor(code, message) {
        super(message);
        this.name = "FederatedConnectionAccessTokenError";
        this.code = code;
    }
}

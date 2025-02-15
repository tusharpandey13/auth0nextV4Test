import * as oauth from "oauth4webapi";
import { FederatedConnectionAccessTokenErrorCode, FederatedConnectionsAccessTokenError, } from "../../errors";
import { AuthServerMetadata, } from "../authServerMetadata";
/**
 * A constant representing the grant type for federated connection access token exchange.
 *
 * This grant type is used in OAuth token exchange scenarios where a federated connection
 * access token is required. It is specific to Auth0's implementation and follows the
 * "urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token" format.
 */
export const GRANT_TYPE_FEDERATED_CONNECTION_ACCESS_TOKEN = "urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token";
/**
 * Constant representing the subject type for a refresh token.
 * This is used in OAuth 2.0 token exchange to specify that the token being exchanged is a refresh token.
 *
 * @see {@link https://tools.ietf.org/html/rfc8693#section-3.1 RFC 8693 Section 3.1}
 */
export const SUBJECT_TYPE_REFRESH_TOKEN = "urn:ietf:params:oauth:token-type:refresh_token";
/**
 * A constant representing the token type for federated connection access tokens.
 * This is used to specify the type of token being requested from Auth0.
 *
 * @constant
 * @type {string}
 */
export const REQUESTED_TOKEN_TYPE_FEDERATED_CONNECTION_ACCESS_TOKEN = "http://auth0.com/oauth/token-type/federated-connection-access-token";
export default class FederatedConnections {
    constructor(federatedConnectionsOptions) {
        this.authServerMetadata = new AuthServerMetadata();
        this.federatedConnectionsOptions = federatedConnectionsOptions;
    }
    async federatedConnectionTokenExchange({ tokenSet, connection, login_hint,
    // existingTokenSet
     }, clientAuth) {
        // if(existingTokenSet){
        //   console.log(`tokenset already exists`)
        //   return [null, existingTokenSet];
        // }
        if (!tokenSet.refreshToken) {
            return [
                new FederatedConnectionsAccessTokenError(FederatedConnectionAccessTokenErrorCode.MISSING_REFRESH_TOKEN, "A refresh token was not present, Federated Connection Access Token requires a refresh token. The user needs to re-authenticate."),
                null,
            ];
        }
        const params = new URLSearchParams();
        params.append("connection", connection);
        params.append("subject_token_type", SUBJECT_TYPE_REFRESH_TOKEN);
        params.append("subject_token", tokenSet.refreshToken);
        params.append("requested_token_type", REQUESTED_TOKEN_TYPE_FEDERATED_CONNECTION_ACCESS_TOKEN);
        if (login_hint) {
            params.append("login_hint", login_hint);
        }
        const [discoveryError, authorizationServerMetadata] = await this.authServerMetadata.discover(this.federatedConnectionsOptions.metadataDiscoverOptions);
        if (discoveryError) {
            console.error(discoveryError);
            return [discoveryError, null];
        }
        const { clientMetadata } = this.federatedConnectionsOptions;
        const httpResponse = await oauth.genericTokenEndpointRequest(authorizationServerMetadata, clientMetadata, clientAuth, GRANT_TYPE_FEDERATED_CONNECTION_ACCESS_TOKEN, params, {
            [oauth.customFetch]: this.federatedConnectionsOptions.metadataDiscoverOptions.fetch,
            [oauth.allowInsecureRequests]: this.federatedConnectionsOptions.metadataDiscoverOptions
                .allowInsecureRequests,
        });
        let tokenEndpointResponse;
        try {
            tokenEndpointResponse = await oauth.processGenericTokenEndpointResponse(authorizationServerMetadata, clientMetadata, httpResponse);
        }
        catch (err) {
            console.error(err);
            return [
                new FederatedConnectionsAccessTokenError(FederatedConnectionAccessTokenErrorCode.FAILED_TO_EXCHANGE, "There was an error trying to exchange the refresh token for a federated connection access token. Check the server logs for more information."),
                null,
            ];
        }
        return [
            null,
            {
                accessToken: tokenEndpointResponse.access_token,
                expiresAt: Math.floor(Date.now() / 1000) +
                    Number(tokenEndpointResponse.expires_in),
                scope: tokenEndpointResponse.scope,
                connection,
            },
        ];
    }
}

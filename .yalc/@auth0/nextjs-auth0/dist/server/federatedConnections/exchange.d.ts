import * as oauth from "oauth4webapi";
import { SdkError } from "../../errors";
import { TokenSet } from "../../types";
import { MetadataDiscoverOptions } from "../authServerMetadata";
import { FederatedConnectionTokenSet } from "./serializer";
/**
 * A constant representing the grant type for federated connection access token exchange.
 *
 * This grant type is used in OAuth token exchange scenarios where a federated connection
 * access token is required. It is specific to Auth0's implementation and follows the
 * "urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token" format.
 */
export declare const GRANT_TYPE_FEDERATED_CONNECTION_ACCESS_TOKEN: string;
/**
 * Constant representing the subject type for a refresh token.
 * This is used in OAuth 2.0 token exchange to specify that the token being exchanged is a refresh token.
 *
 * @see {@link https://tools.ietf.org/html/rfc8693#section-3.1 RFC 8693 Section 3.1}
 */
export declare const SUBJECT_TYPE_REFRESH_TOKEN: string;
/**
 * A constant representing the token type for federated connection access tokens.
 * This is used to specify the type of token being requested from Auth0.
 *
 * @constant
 * @type {string}
 */
export declare const REQUESTED_TOKEN_TYPE_FEDERATED_CONNECTION_ACCESS_TOKEN: string;
export type FederatedConnectionTokenExchangeOptions = {
    /**
     * The set of tokens to be exchanged.
     */
    tokenSet: TokenSet;
    /**
     * The name of the federated connection.
     */
    connection: string;
    /**
     * Optional hint for login.
     */
    login_hint?: string;
};
export type FederatedConnectionsOptions = {
    /**
     * Options for metadata discovery.
     */
    metadataDiscoverOptions: MetadataDiscoverOptions;
    /**
     * Metadata for the OAuth client.
     */
    clientMetadata: oauth.Client;
};
/**
 * Represents the output of a federated connection token exchange operation.
 *
 * This type is a union of two possible tuples:
 * - A tuple containing an `SdkError` and `null`, indicating an error occurred.
 * - A tuple containing `null` and a `FederatedConnectionAccessTokenResponse`, indicating a successful token exchange.
 */
export type FederatedConnectionTokenExchangeOutput = [SdkError, null] | [null, FederatedConnectionTokenSet];
export default class FederatedConnections {
    private readonly authServerMetadata;
    private readonly federatedConnectionsOptions;
    constructor(federatedConnectionsOptions: FederatedConnectionsOptions);
    federatedConnectionTokenExchange({ tokenSet, connection, login_hint, }: FederatedConnectionTokenExchangeOptions, clientAuth: oauth.ClientAuth): Promise<FederatedConnectionTokenExchangeOutput>;
}

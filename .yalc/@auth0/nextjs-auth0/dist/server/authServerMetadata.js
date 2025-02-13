import * as oauth from "oauth4webapi";
import { DiscoveryError } from "../errors";
export class AuthServerMetadata {
    /**
     * Discovers the authorization server metadata.
     *
     * @param {MetadataDiscoverOptions} options - The options for metadata discovery.
     * @returns {Promise<MetadataDiscoverResult>} A promise that resolves to a tuple containing either an error or the authorization server metadata.
     *
     * @throws {DiscoveryError} If the discovery request fails.
     *
     * @example
     * ```typescript
     * const [error, metadata] = await discover(options);
     * if (error) {
     *   console.error('Discovery failed:', error);
     * } else {
     *   console.log('Authorization Server Metadata:', metadata);
     * }
     * ```
     */
    async discover({ issuer, httpOptions, allowInsecureRequests, fetch, }) {
        try {
            if (this.authorizationServerMetadata) {
                return [null, this.authorizationServerMetadata];
            }
            const issuerUrl = typeof issuer === "string" ? new URL(issuer) : issuer;
            const authorizationServerMetadata = await oauth
                .discoveryRequest(issuerUrl, {
                ...httpOptions(),
                [oauth.customFetch]: fetch,
                [oauth.allowInsecureRequests]: allowInsecureRequests,
            })
                .then((response) => oauth.processDiscoveryResponse(issuerUrl, response));
            this.authorizationServerMetadata = authorizationServerMetadata;
            return [null, authorizationServerMetadata];
        }
        catch (e) {
            console.error(`An error occurred while performing the discovery request. Please make sure the AUTH0_DOMAIN environment variable is correctly configured — the format must be 'example.us.auth0.com'. issuer=${issuer.toString()}, error:`, e);
            return [
                new DiscoveryError("Discovery failed for the OpenID Connect configuration."),
                null,
            ];
        }
    }
}

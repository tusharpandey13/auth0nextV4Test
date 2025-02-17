import * as oauth from "oauth4webapi";
import { SdkError } from "../errors";
/**
 * Options for discovering metadata for authentication.
 */
export type MetadataDiscoverOptions = {
    /**
     * The issuer URL or string.
     */
    issuer: string | URL;
    /**
     * A function that returns HTTP request options for the OAuth requests.
     */
    httpOptions: () => oauth.HttpRequestOptions<"GET" | "POST">;
    /**
     * A fetch function to make HTTP requests.
     *
     * @param input - The URL or request object.
     * @param init - Optional request initialization options.
     * @returns A promise that resolves to a Response object.
     */
    fetch: (input: string | URL | globalThis.Request, init?: any) => Promise<Response>;
    /**
     * A flag to allow insecure requests.
     */
    allowInsecureRequests: boolean;
};
export type MetadataDiscoverResult = [null, oauth.AuthorizationServer] | [SdkError, null];
export declare class AuthServerMetadata {
    private authorizationServerMetadata?;
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
    discover({ issuer, httpOptions, allowInsecureRequests, fetch, }: MetadataDiscoverOptions): Promise<MetadataDiscoverResult>;
}

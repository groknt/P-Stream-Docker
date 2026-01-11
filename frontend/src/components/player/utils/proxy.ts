import { getLoadbalancedProxyUrl } from "@/backend/providers/fetchers";
import { getProxyUrls } from "@/utils/proxyUrls";

/**
 * Creates a proxied URL
 * @param url - The target URL
 * @param headers - Headers to include with the request
 * @returns The proxied response
 */
export function createProxyUrl(
  url: string,
  headers: Record<string, string> = {},
  download: boolean = false,
): string {
  const proxyBaseUrl = getLoadbalancedProxyUrl();

  if (!proxyBaseUrl) {
    console.warn("No proxy URLs available in configuration");
    return url; // Fallback to original URL
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedHeaders = encodeURIComponent(JSON.stringify(headers));
  return `${proxyBaseUrl}/proxy?url=${encodedUrl}${headers ? `&headers=${encodedHeaders}` : ""}${download ? "&download=true" : ""}`;
}

/**
 * Creates a proxied M3U8 URL for HLS streams using a random proxy from config
 * @param url - The original M3U8 URL to proxy
 * @param headers - Headers to include with the request
 * @returns The proxied M3U8 URL
 */
export function createM3U8ProxyUrl(
  url: string,
  headers: Record<string, string> = {},
  download: boolean = false,
): string {
  // Get a random M3U8 proxy URL from the configuration
  const proxyBaseUrl = getLoadbalancedProxyUrl();

  if (!proxyBaseUrl) {
    console.warn("No M3U8 proxy URLs available in configuration");
    return url; // Fallback to original URL
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedHeaders = encodeURIComponent(JSON.stringify(headers));
  return `${proxyBaseUrl}/proxy.m3u8?type=hls&url=${encodedUrl}${headers ? `&headers=${encodedHeaders}` : ""}${download ? "&download=true" : ""}`;
}

/**
 * TODO: Creates a proxied MP4 URL for MP4 streams
 * @param url - The original MP4 URL to proxy
 * @param headers - Headers to include with the request
 * @returns The proxied MP4 URL
 */
export function createMP4ProxyUrl(
  url: string,
  _headers: Record<string, string> = {},
): string {
  // TODO: Implement MP4 proxy for protected streams
  // This would need a separate MP4 proxy service that can handle headers
  // For now, return the original URL
  console.warn("MP4 proxy not yet implemented - using original URL");
  return url;
}

/**
 * Checks if a URL is already using one of the configured M3U8 proxy services
 * @param url - The URL to check
 * @returns True if the URL is already proxied, false otherwise
 */
export function isUrlAlreadyProxied(url: string): boolean {
  // Check if URL contains the proxy.m3u8 pattern (Airplay format)
  if (url.includes("/proxy.m3u8?type=hls&url=")) {
    return true;
  }

  // Check if URL contains the /proxytype=web&url= pattern (Chromecast format)
  if (url.includes("/proxy?type=web&url=")) {
    return true;
  }

  // Also check if URL starts with any of the configured proxy URLs
  const proxyUrls = getProxyUrls();
  return proxyUrls.some((proxyUrl) => url.startsWith(proxyUrl));
}

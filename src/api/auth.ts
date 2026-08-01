export async function getAuthHeaders(): Promise<HeadersInit> {
  const apiKey = import.meta.env.VITE_PODCAST_API_KEY || '';
  const apiSecret = import.meta.env.VITE_PODCAST_API_SECRET || '';
  const apiHeaderTime = Math.round(Date.now() / 1000).toString();

  const payload = apiKey + apiSecret + apiHeaderTime;
  const bytes = new TextEncoder().encode(payload);
  const digets = await crypto.subtle.digest('SHA-1', bytes);

  const hex = [...new Uint8Array(digets)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    'User-Agent': 'podcast-player/1.0.0',
    'X-Auth-Key': apiKey,
    'X-Auth-Date': apiHeaderTime,
    Authorization: hex,
  };
}

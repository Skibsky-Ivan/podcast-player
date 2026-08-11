import { getAuthHeaders } from './auth.ts';
import { mapFeedToPodcast, mapItemToEpisode } from '../utils/mappers.ts';
import type { Podcast, Episode } from '../types/types.ts';

const BASE_URL = 'https://api.podcastindex.org/api/1.0';

export async function getBasePodcasts(
  limit: number = 20,
  signal?: AbortSignal,
): Promise<Podcast[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/podcasts/trending?max=${limit}`, {
    headers,
    signal,
  });
  if (!response.ok) throw new Error('Failed to fetch trending podcasts');
  const data = await response.json();
  return (data.feeds || []).map(mapFeedToPodcast);
}

export async function getSearchPodcasts(
  query: string,
  limit: number = 20,
  signal?: AbortSignal,
): Promise<Podcast[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${BASE_URL}/search/byterm?q=${encodeURIComponent(query)}&max=${limit}`,
    { headers, signal },
  );
  if (!response.ok) throw new Error('Search request failed');
  const data = await response.json();
  return (data.feeds || []).map(mapFeedToPodcast);
}

export async function getPodcastById(
  feedId: string,
  signal?: AbortSignal,
): Promise<Podcast> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/podcasts/byfeedid?id=${feedId}`, {
    headers,
    signal,
  });
  if (!response.ok) throw new Error('Failed to fetch podcast details');
  const data = await response.json();
  return mapFeedToPodcast(data.feed);
}

export async function getEpisodesByFeedId(
  feedId: string,
  limit: number = 50,
  signal?: AbortSignal,
): Promise<Episode[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${BASE_URL}/episodes/byfeedid?id=${feedId}&max=${limit}`,
    {
      headers,
      signal,
    },
  );
  if (!response.ok) throw new Error('Failed to fetch episodes');
  const data = await response.json();
  return (data.items || []).map(mapItemToEpisode);
}

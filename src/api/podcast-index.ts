import { getAuthHeaders } from './auth.ts';
import { formatDuration } from '../utils/format-time.ts'
import type { Podcast, Episode } from '../types/podcast.ts';

const BASE_URL = 'https://api.podcastindex.org/api/1.0';

export async function getBasePodcasts(limit: number = 20): Promise<Podcast[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/podcasts/trending?max=${limit}`, {
    headers,
  });
  if (!response.ok) throw new Error('Failed to fetch trending podcasts');
  const data = await response.json();
  return data.feeds.map(
    (feed: any): Podcast => ({
      id: String(feed.id),
      title: feed.title || 'Без названия',
      author: feed.author || feed.ownerName || 'Неизвестен',
      coverUrl: feed.artwork || feed.image || '',
      numberEpisode: String(feed.episodeCount || 0),
    }),
  );
}

export async function getSearchPodcasts(query: string): Promise<Podcast[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${BASE_URL}/search/byterm?q=${encodeURIComponent(query)}`,
    { headers },
  );
  if (!response.ok) throw new Error('Search request failed');
  const data = await response.json();
  return data.feeds.map(
    (feed: any): Podcast => ({
      id: String(feed.id),
      title: feed.title || 'Без названия',
      author: feed.author || feed.ownerName || 'Неизвестен',
      coverUrl: feed.artwork || feed.image || '',
      numberEpisode: String(feed.episodeCount || 0),
    }),
  );
}

export async function getEpisodesByFeedId(feedId: string): Promise<Episode[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/episodes/byfeedid?id=${feedId}`, {
    headers,
  });
  if (!response.ok) throw new Error('Failed to fetch episodes');
  const data = await response.json();
  return data.items.map((item: any): Episode => ({
    id: String(item.id),
    title: item.title || 'Без названия',
    author: item.feedAuthor || item.author || 'Неизвестен',
    duration: formatDuration(item.duration),
  }));
}

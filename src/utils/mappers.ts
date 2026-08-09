import { Podcast, Episode } from '../types/types.ts';
import { formatDuration } from '../utils/format-time.ts';

export function mapFeedToPodcast(podcast: any): Podcast {
  return {
    id: String(podcast?.id ?? ''),
    title: podcast?.title || 'Без названия',
    author: podcast?.author || 'Неизвестен',
    coverUrl: podcast?.artwork || podcast?.image || '',
  };
}

export function mapItemToEpisode(episode: any): Episode {
  const durationSec = Number(episode?.duration) || null;

  return {
    id: String(episode?.id ?? ''),
    title: episode?.title || 'Без названия',
    duration: formatDuration(durationSec),
    durationSec,
    pubDate: episode?.datePublished
      ? new Date(episode.datePublished * 1000).toLocaleDateString('ru-RU')
      : '—',
    audioUrl: episode?.enclosureUrl || '',
    coverUrl: episode?.image || episode?.feedImage || '',
    podcastId: String(episode?.feedId ?? ''),
  };
}

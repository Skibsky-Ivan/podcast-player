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
  return {
    id: String(episode?.id ?? ''),
    title: episode?.title || 'Без названия',
    duration: formatDuration(episode?.duration),
    audioUrl: episode?.enclosureUrl || '',
    coverUrl: episode?.image || episode?.feedImage || '',
  };
}
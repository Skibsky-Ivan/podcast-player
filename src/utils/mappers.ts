import { Podcast, Episode } from '../types/types.ts';
import { formatDuration } from '../utils/format-time.ts';

export function mapFeedToPodcast(feed: any): Podcast {
  return {
    id: String(feed.id),
    title: feed.title || 'Без названия',
    author: feed.author || feed.ownerName || 'Неизвестен',
    coverUrl: feed.artwork || feed.image || '',
    numberEpisode: String(feed.episodeCount || 0),
  };
}

export function mapItemToEpisode(item: any): Episode {
  return {
    id: String(item.id),
    title: item.title || 'Без названия',
    author: item.feedAuthor || item.author || 'Неизвестен',
    duration: formatDuration(item.duration),
  };
}

export interface Podcast {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
}

export interface Episode {
  id: string;
  title: string;
  duration: string;
  durationSec: number | null;
  pubDate: string;
  audioUrl: string;
  coverUrl: string;
}

export interface PlaylistItem {
  episode: Episode;
  podcastId: string;
  podcastTitle: string;
  podcastCoverUrl: string;
}

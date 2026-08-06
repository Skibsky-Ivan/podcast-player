export interface Podcast {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  episodeCount: string;
}

export interface Episode {
  id: string;
  title: string;
  author: string;
  duration: string;
  audioUrl: string;
}
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
  audioUrl: string;
  coverUrl: string;
}
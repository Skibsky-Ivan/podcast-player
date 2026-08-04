import { Podcast, Episode } from '../types/types';

export interface GlobalState {
  podcasts: Podcast[];
  currPodcast: Podcast | null;
  episodes: Episode[];
  currEpisode: Episode | null;
  isPlaying: boolean;
}

type Listiner = (state: GlobalState) => void;

class State {
  private state: GlobalState = {
    podcasts: [],
    currPodcast: null,
    episodes: [],
    currEpisode: null,
    isPlaying: false,
  };

  private listiners: Listiner[] = [];

  public getState(): Readonly<GlobalState> {
    return this.state;
  }

  public setState(newState: Partial<GlobalState>) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  public getPodcastById(id: string): Podcast | undefined {
    return this.state.podcasts.find((p) => String(p.id) === id);
  }

  public subscribe(listener: Listiner): () => void {
    this.listiners.push(listener);
    return () => {
      this.listiners = this.listiners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listiners.forEach((l) => l(this.state));
  }
}

export const store = new State();

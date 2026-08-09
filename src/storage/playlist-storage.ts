import { PlaylistItem } from '../types/types';

const POSITIONS_KEY = 'podcast-positions';
const PLAYLIST_KEY = 'podcast-playlist';

interface PositionMap {
  [episodeId: string]: number;
}

function getPositions(): PositionMap {
  try {
    const raw = localStorage.getItem(POSITIONS_KEY);
    if (!raw) return {}
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function getSavedPosition(episodeId: string): number | null {
  const positions = getPositions();
  const pos = positions[episodeId];
  return typeof pos === 'number' && pos > 0 ? pos : null;
}

export function savePosition(episodeId: string, seconds: number): void {
  const positions = getPositions();
  positions[episodeId] = Math.floor(seconds);
  localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
}

export function clearPosition(episodeId: string): void {
  const positions = getPositions();
  delete positions[episodeId];
  localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
}

export function getPlaylist(): PlaylistItem[] {
  try {
    const raw = localStorage.getItem(PLAYLIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch (e) {
    return [];
  }
}

export function addToPlaylist(item: PlaylistItem): void {
  const playlist = getPlaylist();
  if (playlist.some((p) => p.episode.id === item.episode.id)) return;
  const updatedPlaylist = [item, ...playlist];
  localStorage.setItem(PLAYLIST_KEY, JSON.stringify(updatedPlaylist));
}

export function removeFromPlaylist(episodeId: string) {
  const playlist = getPlaylist();
  const updatedPlaylist = playlist.filter(
    (item) => item.episode.id !== episodeId,
  );
  localStorage.setItem(PLAYLIST_KEY, JSON.stringify(updatedPlaylist));
}

export function isInPlaylist(episodeId: string): boolean {
  const playlist = getPlaylist();
  return playlist.some((item) => item.episode.id === episodeId);
}

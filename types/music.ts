export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  uri: string;
  artwork?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: Date;
}

export interface MusicPlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  position: number;
  isLoading: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
  playlist: Song[];
  currentIndex: number;
}

export interface MusicPlayerContextType extends MusicPlayerState {
  play: (song: Song) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setVolume: (volume: number) => void;
  nextSong: () => void;
  previousSong: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToPlaylist: (song: Song) => void;
  removeFromPlaylist: (songId: string) => void;
  loadPlaylist: (songs: Song[], startIndex?: number) => void;
}
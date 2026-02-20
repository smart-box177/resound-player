import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MusicPlayerContextType, Song, MusicPlayerState } from '@/types/music';

type MusicPlayerAction = 
  | { type: 'SET_CURRENT_SONG'; payload: Song | null }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_POSITION'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_REPEAT_MODE'; payload: 'none' | 'one' | 'all' }
  | { type: 'SET_SHUFFLE'; payload: boolean }
  | { type: 'SET_PLAYLIST'; payload: Song[] }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'ADD_TO_PLAYLIST'; payload: Song }
  | { type: 'REMOVE_FROM_PLAYLIST'; payload: string };

const initialState: MusicPlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 1.0,
  duration: 0,
  position: 0,
  isLoading: false,
  repeatMode: 'none',
  isShuffled: false,
  playlist: [],
  currentIndex: -1,
};

function musicPlayerReducer(state: MusicPlayerState, action: MusicPlayerAction): MusicPlayerState {
  switch (action.type) {
    case 'SET_CURRENT_SONG':
      return { ...state, currentSong: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_POSITION':
      return { ...state, position: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    case 'SET_SHUFFLE':
      return { ...state, isShuffled: action.payload };
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload };
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload };
    case 'ADD_TO_PLAYLIST':
      return { ...state, playlist: [...state.playlist, action.payload] };
    case 'REMOVE_FROM_PLAYLIST':
      return { 
        ...state, 
        playlist: state.playlist.filter(song => song.id !== action.payload) 
      };
    default:
      return state;
  }
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicPlayerReducer, initialState);
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);

  useEffect(() => {
    loadSavedState();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadSavedState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('musicPlayerState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'SET_VOLUME', payload: parsed.volume || 1.0 });
        dispatch({ type: 'SET_REPEAT_MODE', payload: parsed.repeatMode || 'none' });
        dispatch({ type: 'SET_SHUFFLE', payload: parsed.isShuffled || false });
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  };

  const saveState = async () => {
    try {
      const stateToSave = {
        volume: state.volume,
        repeatMode: state.repeatMode,
        isShuffled: state.isShuffled,
      };
      await AsyncStorage.setItem('musicPlayerState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const play = async (song: Song) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.uri },
        { 
          volume: state.volume,
          shouldPlay: true,
        }
      );

      setSound(newSound);
      dispatch({ type: 'SET_CURRENT_SONG', payload: song });
      dispatch({ type: 'SET_PLAYING', payload: true });
      dispatch({ type: 'SET_LOADING', payload: false });

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          dispatch({ type: 'SET_POSITION', payload: status.positionMillis });
          dispatch({ type: 'SET_DURATION', payload: status.durationMillis || 0 });
          
          if (status.didJustFinish && !status.isLooping) {
            handleSongEnd();
          }
        }
      });

    } catch (error) {
      console.error('Error playing song:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
      dispatch({ type: 'SET_PLAYING', payload: false });
    }
  };

  const resume = async () => {
    if (sound) {
      await sound.playAsync();
      dispatch({ type: 'SET_PLAYING', payload: true });
    }
  };

  const stop = async () => {
    if (sound) {
      await sound.stopAsync();
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_POSITION', payload: 0 });
    }
  };

  const seekTo = async (position: number) => {
    if (sound) {
      await sound.setPositionAsync(position);
      dispatch({ type: 'SET_POSITION', payload: position });
    }
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
    if (sound) {
      sound.setVolumeAsync(volume);
    }
    saveState();
  };

  const handleSongEnd = () => {
    if (state.repeatMode === 'one') {
      if (sound && state.currentSong) {
        sound.replayAsync();
      }
    } else if (state.repeatMode === 'all' || state.currentIndex < state.playlist.length - 1) {
      nextSong();
    } else {
      stop();
    }
  };

  const nextSong = () => {
    if (state.playlist.length === 0) return;
    
    let nextIndex;
    if (state.isShuffled) {
      nextIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
      nextIndex = (state.currentIndex + 1) % state.playlist.length;
    }
    
    if (nextIndex !== state.currentIndex || state.repeatMode === 'all') {
      const nextSong = state.playlist[nextIndex];
      play(nextSong);
      dispatch({ type: 'SET_CURRENT_INDEX', payload: nextIndex });
    }
  };

  const previousSong = () => {
    if (state.playlist.length === 0) return;
    
    let prevIndex;
    if (state.isShuffled) {
      prevIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
      prevIndex = state.currentIndex > 0 ? state.currentIndex - 1 : state.playlist.length - 1;
    }
    
    const prevSong = state.playlist[prevIndex];
    play(prevSong);
    dispatch({ type: 'SET_CURRENT_INDEX', payload: prevIndex });
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch({ type: 'SET_REPEAT_MODE', payload: nextMode });
    saveState();
  };

  const toggleShuffle = () => {
    dispatch({ type: 'SET_SHUFFLE', payload: !state.isShuffled });
    saveState();
  };

  const addToPlaylist = (song: Song) => {
    dispatch({ type: 'ADD_TO_PLAYLIST', payload: song });
  };

  const removeFromPlaylist = (songId: string) => {
    dispatch({ type: 'REMOVE_FROM_PLAYLIST', payload: songId });
  };

  const loadPlaylist = (songs: Song[], startIndex: number = 0) => {
    dispatch({ type: 'SET_PLAYLIST', payload: songs });
    dispatch({ type: 'SET_CURRENT_INDEX', payload: startIndex });
    if (songs.length > 0) {
      play(songs[startIndex]);
    }
  };

  const contextValue: MusicPlayerContextType = {
    ...state,
    play,
    pause,
    resume,
    stop,
    seekTo,
    setVolume,
    nextSong,
    previousSong,
    toggleRepeat,
    toggleShuffle,
    addToPlaylist,
    removeFromPlaylist,
    loadPlaylist,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}
import Playlist from '@/components/music-player/Playlist';
import { ThemedView } from '@/components/themed-view';
import { MusicLibraryService } from '@/services/musicLibraryService';
import { Song } from '@/types/music';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function PlaylistScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const requestPermissionAndLoadSongs = async () => {
      try {
        const hasPermission = await MusicLibraryService.requestPermissions();
        if (hasPermission) {
          setHasPermission(true);
          await loadSongsFromDevice();
        } else {
          console.log('Media library permission denied');
        }
      } catch (error) {
        console.error('Error requesting media library permission:', error);
      }
    };

    requestPermissionAndLoadSongs();
  }, []);

  const loadSongsFromDevice = async () => {
    try {
      const deviceSongs = await MusicLibraryService.getAllSongs();
      setSongs(deviceSongs);
    } catch (error) {
      console.error('Error loading songs from device:', error);
    }
  };

  // Sample data for testing if no permission
  const sampleSongs: Song[] = [
    {
      id: '1',
      title: 'Sample Song 1',
      artist: 'Sample Artist 1',
      album: 'Sample Album 1',
      duration: 180000, // 3 minutes
      uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      artwork: undefined,
    },
    {
      id: '2',
      title: 'Sample Song 2',
      artist: 'Sample Artist 2',
      album: 'Sample Album 2',
      duration: 240000, // 4 minutes
      uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      artwork: undefined,
    },
    {
      id: '3',
      title: 'Sample Song 3',
      artist: 'Sample Artist 3',
      album: 'Sample Album 3',
      duration: 200000, // 3:20 minutes
      uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      artwork: undefined,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Playlist songs={hasPermission ? songs : sampleSongs} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
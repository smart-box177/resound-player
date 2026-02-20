import MusicPlayer from '@/components/music-player/MusicPlayer';
import { ThemedView } from '@/components/themed-view';
import { MusicPlayerProvider } from '@/hooks/music/useMusicPlayer';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function PlayerScreen() {
  return (
    <MusicPlayerProvider>
      <ThemedView style={styles.container}>
        <MusicPlayer />
      </ThemedView>
    </MusicPlayerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
import MusicPlayer from '@/components/music-player/MusicPlayer';
import { MusicPlayerProvider } from '@/hooks/music/useMusicPlayer';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function PlayerScreen() {
  return (
    <MusicPlayerProvider>
      <MusicPlayer />
    </MusicPlayerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMusicPlayer } from '@/hooks/music/useMusicPlayer';
import { formatTime } from '@/utils/timeUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    duration,
    position,
    isLoading,
    repeatMode,
    isShuffled,
    pause,
    resume,
    nextSong,
    previousSong,
    toggleRepeat,
    toggleShuffle,
  } = useMusicPlayer();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentSong) {
      resume();
    }
  };

  if (!currentSong) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No song selected</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Album Artwork */}
      <View style={styles.artworkContainer}>
        {currentSong.artwork ? (
          <Image source={{ uri: currentSong.artwork }} style={styles.artwork} />
        ) : (
          <View style={styles.placeholderArtwork}>
            <Ionicons name="musical-notes" size={80} color="#666" />
          </View>
        )}
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <ThemedText style={styles.songTitle} numberOfLines={1}>
          {currentSong.title}
        </ThemedText>
        <ThemedText style={styles.artistName} numberOfLines={1}>
          {currentSong.artist}
        </ThemedText>
        {currentSong.album && (
          <ThemedText style={styles.albumName} numberOfLines={1}>
            {currentSong.album}
          </ThemedText>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar} />
        <View style={styles.timeContainer}>
          <ThemedText style={styles.timeText}>{formatTime(position)}</ThemedText>
          <ThemedText style={styles.timeText}>{formatTime(duration)}</ThemedText>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={toggleShuffle} style={styles.controlButton}>
          <Ionicons 
            name={isShuffled ? "shuffle" : "shuffle-outline"} 
            size={24} 
            color={isShuffled ? "#007AFF" : "#666"} 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={previousSong} style={styles.controlButton}>
          <Ionicons name="play-back" size={32} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handlePlayPause} 
          style={[styles.playButton, isLoading && styles.disabledButton]}
          disabled={isLoading}
        >
          {isLoading ? (
            <Ionicons name="hourglass" size={32} color="#FFF" />
          ) : (
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={32} 
              color="#FFF" 
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={nextSong} style={styles.controlButton}>
          <Ionicons name="play-forward" size={32} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleRepeat} style={styles.controlButton}>
          <Ionicons 
            name={repeatMode === 'one' ? "repeat" : repeatMode === 'all' ? "repeat" : "repeat-outline"} 
            size={24} 
            color={repeatMode !== 'none' ? "#007AFF" : "#666"} 
          />
          {repeatMode === 'one' && (
            <ThemedText style={styles.repeatOneText}>1</ThemedText>
          )}
        </TouchableOpacity>
      </View>

      {/* Volume Control */}
      <View style={styles.volumeContainer}>
        <Ionicons name="volume-low" size={20} color="#666" />
        <View style={styles.volumeSlider} />
        <Ionicons name="volume-high" size={20} color="#666" />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  artwork: {
    width: 250,
    height: 250,
    borderRadius: 15,
  },
  placeholderArtwork: {
    width: 250,
    height: 250,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  albumName: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    width: '100%',
    height: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 5,
    position: 'relative',
  },
  playButton: {
    backgroundColor: '#007AFF',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  repeatOneText: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeSlider: {
    width: 200,
    marginHorizontal: 10,
  },
});
import { ThemedText } from '@/components/themed-text';
import { useMusicPlayer } from '@/hooks/music/useMusicPlayer';
import { formatTime } from '@/utils/timeUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    duration,
    position,
    isLoading,
    repeatMode,
    pause,
    resume,
    nextSong,
    previousSong,
    toggleRepeat,
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
      <View style={[styles.container, styles.centerContent]}>
        <ThemedText style={{ color: '#FFF' }}>No song playing</ThemedText>
      </View>
    );
  }

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="chevron-down" size={28} color="#FFF" />
            </TouchableOpacity>

            <ThemedText style={styles.headerTitle}>Now Playing</ThemedText>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton}>
                <View style={styles.notificationBadge}>
                  <ThemedText style={styles.notificationText}>12</ThemedText>
                </View>
                <Ionicons name="notifications-outline" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="heart-outline" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Artwork */}
            <View style={styles.artworkContainer}>
              {currentSong.artwork ? (
                <Image source={{ uri: currentSong.artwork }} style={styles.artwork} />
              ) : (
                <View style={[styles.artwork, styles.placeholderArtwork]}>
                  <Ionicons name="musical-notes" size={80} color="#666" />
                </View>
              )}
            </View>

            {/* Song Info */}
            <View style={styles.infoContainer}>
              <ThemedText style={styles.songTitle} numberOfLines={1}>{currentSong.title}</ThemedText>
              <ThemedText style={styles.artistName} numberOfLines={1}>{currentSong.artist}</ThemedText>
            </View>

            {/* Lyrics Placeholder */}
            <View style={styles.lyricsContainer}>
              <ThemedText style={styles.lyricsText}>
                Whispers in the midnight breeze,
              </ThemedText>
              <ThemedText style={[styles.lyricsText, styles.activeLyric]}>
                Carrying dreams across the seas,
              </ThemedText>
              <ThemedText style={styles.lyricsText}>
                I close my eyes let go and drift away.
              </ThemedText>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                <View style={[styles.progressKnob, { left: `${progressPercent}%` }]} />
              </View>
              <View style={styles.timeContainer}>
                <ThemedText style={styles.timeText}>{formatTime(position)}</ThemedText>
                <ThemedText style={styles.timeText}>{formatTime(duration)}</ThemedText>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity onPress={toggleRepeat} style={styles.secondaryControl}>
                <Ionicons
                  name={repeatMode === 'one' ? "repeat" : "repeat"}
                  size={22}
                  color={repeatMode !== 'none' ? "#D6A3E4" : "#888"}
                />
                {repeatMode === 'one' && <View style={styles.repeatBadge} />}
              </TouchableOpacity>

              <TouchableOpacity onPress={previousSong} style={styles.mainControl}>
                <Ionicons name="play-back" size={32} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePlayPause}
                style={styles.playPauseButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Ionicons name="hourglass" size={32} color="#000" />
                ) : (
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={36}
                    color="#000"
                    style={{ marginLeft: isPlaying ? 0 : 4 }}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={nextSong} style={styles.mainControl}>
                <Ionicons name="play-forward" size={32} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryControl}>
                <Ionicons name="list" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F', // Dark background for the whole screen
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    opacity: 0.9,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#D6A3E4',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: 2,
  },
  notificationText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 40,
  },
  artworkContainer: {
    shadowColor: '#D6A3E4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  artwork: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2, // Circular
    backgroundColor: '#2A2A2A',
  },
  placeholderArtwork: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 32,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  artistName: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  lyricsContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 40,
  },
  lyricsText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  activeLyric: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#D6A3E4', // Purple-ish accent from design
    borderRadius: 2,
  },
  progressKnob: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#D6A3E4',
    borderRadius: 6,
    marginLeft: -6, // Center the knob on the end of the bar
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 32,
  },
  mainControl: {
    padding: 12,
  },
  secondaryControl: {
    padding: 8,
  },
  playPauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D6A3E4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D6A3E4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  repeatBadge: {
    position: 'absolute',
    top: 8,
    right: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D6A3E4',
  },
});
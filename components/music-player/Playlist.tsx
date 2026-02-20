import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMusicPlayer } from '@/hooks/music/useMusicPlayer';
import { Song } from '@/types/music';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface PlaylistProps {
  songs: Song[];
  onSongSelect?: (song: Song, index: number) => void;
}

export default function Playlist({ songs, onSongSelect }: PlaylistProps) {
  const { currentSong, isPlaying, loadPlaylist } = useMusicPlayer();

  const handleSongPress = (song: Song, index: number) => {
    if (onSongSelect) {
      onSongSelect(song, index);
    } else {
      loadPlaylist(songs, index);
    }
  };

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => {
    const isCurrentSong = currentSong?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.songItem, isCurrentSong && styles.currentSongItem]}
        onPress={() => handleSongPress(item, index)}
      >
        <View style={styles.songArtwork}>
          {item.artwork ? (
            <Image source={{ uri: item.artwork }} style={styles.artwork} />
          ) : (
            <View style={styles.placeholderArtwork}>
              <Ionicons name="musical-note" size={24} color="#666" />
            </View>
          )}
        </View>
        
        <View style={styles.songInfo}>
          <ThemedText 
            style={[styles.songTitle, isCurrentSong && styles.currentSongText]}
            numberOfLines={1}
          >
            {item.title}
          </ThemedText>
          <ThemedText 
            style={[styles.artistName, isCurrentSong && styles.currentSongText]}
            numberOfLines={1}
          >
            {item.artist}
          </ThemedText>
          {item.album && (
            <ThemedText 
              style={[styles.albumName, isCurrentSong && styles.currentSongText]}
              numberOfLines={1}
            >
              {item.album}
            </ThemedText>
          )}
        </View>

        {isCurrentSong && isPlaying && (
          <View style={styles.playingIndicator}>
            <Ionicons name="volume-high" size={20} color="#007AFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="musical-notes" size={64} color="#CCC" />
      <ThemedText style={styles.emptyText}>No songs in playlist</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  currentSongItem: {
    backgroundColor: '#F0F8FF',
  },
  songArtwork: {
    marginRight: 12,
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  placeholderArtwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  artistName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  albumName: {
    fontSize: 12,
    color: '#999',
  },
  currentSongText: {
    color: '#007AFF',
  },
  playingIndicator: {
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 78,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
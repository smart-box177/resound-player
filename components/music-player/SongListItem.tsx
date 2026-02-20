import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type SongListItemProps = {
    title: string;
    artist: string;
    artwork?: string | null;
    duration?: number; // in seconds
    isPlaying?: boolean;
    onPress?: () => void;
};

export function SongListItem({ title, artist, artwork, isPlaying, onPress }: SongListItemProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            {/* Artwork */}
            <View style={styles.artworkContainer}>
                {artwork ? (
                    <Image source={{ uri: artwork }} style={styles.artwork} />
                ) : (
                    <View style={[styles.artwork, styles.placeholderArtwork]}>
                        <Ionicons name="musical-notes" size={24} color="#666" />
                    </View>
                )}
                {/* Playing Overlay */}
                {isPlaying && (
                    <View style={styles.playingOverlay}>
                        <Ionicons name="stats-chart" size={16} color="#D7FC70" />
                    </View>
                )}
            </View>

            {/* Info */}
            <View style={styles.infoContainer}>
                <ThemedText style={[styles.title, isPlaying && styles.activeText]} numberOfLines={1}>
                    {title}
                </ThemedText>
                <ThemedText style={styles.artist} numberOfLines={1}>
                    By {artist} • 24 Songs
                </ThemedText>
            </View>

            {/* Play Button Action */}
            <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={16} color="#FFF" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    artworkContainer: {
        position: 'relative',
        marginRight: 16,
    },
    artwork: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#333',
    },
    placeholderArtwork: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    playingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    activeText: {
        color: '#D7FC70',
    },
    artist: {
        fontSize: 14,
        color: '#888',
    },
    playButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#252525',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

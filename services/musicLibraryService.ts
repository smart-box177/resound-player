import { Song } from '@/types/music';
import * as MediaLibrary from 'expo-media-library';

export class MusicLibraryService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  }

  static async getAllSongs(): Promise<Song[]> {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 1000, // Get up to 1000 songs
        sortBy: MediaLibrary.SortBy.default,
      });

      return media.assets.map((asset) => ({
        id: asset.id,
        title: asset.filename.replace(/\.[^/.]+$/, ''), // Remove file extension
        artist: 'Unknown Artist', // You might want to extract this from metadata
        album: undefined, // You might want to extract this from metadata
        duration: asset.duration * 1000 || 0, // Convert to milliseconds
        uri: asset.uri,
        artwork: undefined, // You might want to extract album art
      }));
    } catch (error) {
      console.error('Error loading songs from device:', error);
      return [];
    }
  }

  static async searchSongs(query: string): Promise<Song[]> {
    try {
      const allSongs = await this.getAllSongs();
      const lowerQuery = query.toLowerCase();
      
      return allSongs.filter(song => 
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery) ||
        (song.album && song.album.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching songs:', error);
      return [];
    }
  }

  static async getAlbums(): Promise<any[]> {
    try {
      const albums = await MediaLibrary.getAlbumsAsync();
      return albums;
    } catch (error) {
      console.error('Error loading albums:', error);
      return [];
    }
  }

  static async getArtists(): Promise<any[]> {
    try {
      // Note: getArtistsAsync is not available in all versions of expo-media-library
      // For now, we'll extract unique artists from songs
      const songs = await this.getAllSongs();
      const artists = [...new Set(songs.map(song => song.artist))];
      return artists.map(name => ({ name, id: name }));
    } catch (error) {
      console.error('Error loading artists:', error);
      return [];
    }
  }

  static async getSongMetadata(assetId: string): Promise<any> {
    try {
      const asset = await MediaLibrary.getAssetInfoAsync(assetId);
      return asset;
    } catch (error) {
      console.error('Error getting song metadata:', error);
      return null;
    }
  }
}
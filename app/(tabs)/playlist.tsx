import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SongListItem } from "@/components/music-player/SongListItem";
import { ThemedText } from "@/components/themed-text";
import { FilterChip } from "@/components/ui/FilterChip";

export default function PlaylistScreen() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
    get: true,
    request: false,
  });
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  // We'll add this to the hook later, for now just mock or ignore
  // const { play } = useMusicPlayer();

  useEffect(() => {
    async function getMusic() {
      if (permissionResponse?.status !== "granted") {
        // Try to request permission directly using the MediaLibrary API
        try {
          const { status } = await MediaLibrary.requestPermissionsAsync(false);
          if (status !== "granted") {
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error requesting permission:", error);
          setIsLoading(false);
          return;
        }
      }

      try {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
          first: 500, // Limit for now
          sortBy: MediaLibrary.SortBy.creationTime,
        });

        setAssets(media.assets);
      } catch (error) {
        console.error("Error loading media:", error);
      }
      setIsLoading(false);
    }

    if (permissionResponse) {
      getMusic();
    }
  }, [permissionResponse]);

  const filters = ["All", "Playlists", "Liked Songs", "Downloaded"];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>My Music</ThemedText>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            isSelected={activeFilter === filter}
            onPress={() => setActiveFilter(filter)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="musical-note" size={64} color="#333" />
      <ThemedText style={styles.emptyStateText}>
        {isLoading ? "Scanning for music..." : "No music found on this device."}
      </ThemedText>
      {!permissionResponse?.granted && !isLoading && (
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <ThemedText style={styles.permissionButtonText}>
            Grant Permission
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {renderHeader()}

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#D6A3E4" />
          </View>
        ) : (
          <FlatList
            data={assets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SongListItem
                title={item.filename.replace(/\.[^/.]+$/, "")} // Remove extension
                artist="Unknown Artist" // MediaLibrary sometimes doesn't give metadata easily without ID3 parsing
                duration={item.duration}
                onPress={() => console.log("Play", item.uri)}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  iconButton: {
    padding: 8,
    backgroundColor: "#252525",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  filterContainer: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for bottom tab bar
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyStateText: {
    color: "#888",
    marginTop: 16,
    fontSize: 16,
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: "#D6A3E4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  permissionButtonText: {
    color: "#000",
    fontWeight: "600",
  },
});

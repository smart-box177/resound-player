import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#1C1C1E', // Dark background for the pill
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 10,
          paddingBottom: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Now Playing',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "musical-notes" : "musical-notes-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="player"
        options={{
          title: 'Player',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? activeColor : 'transparent',
              padding: 8,
              borderRadius: 20,
              marginBottom: 20, // Pop up effect
              shadowColor: focused ? activeColor : undefined,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: focused ? 8 : 0,
            }}>
              <Ionicons
                name={focused ? "play" : "play-outline"}
                size={30}
                color={focused ? '#FFF' : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "list" : "list-outline"} size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}


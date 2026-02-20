// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
};

function TabIcon({ name, focused, color }: TabIconProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.18 : 1, {
      damping: 15,
      stiffness: 200,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons
        name={focused ? name : `${name}-outline` as any}
        size={26}
        color={color}
      />
    </Animated.View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D6A3E4',     // your accent color (purple-ish)
        tabBarInactiveTintColor: '#8E8E93',   // subtle gray
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? '#F2F2F7' : '#121212',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: Platform.OS === 'ios' ? '#C6C6C8' : '#272729',
          height: 66 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          elevation: 0,           // remove shadow on Android
          shadowOpacity: 0,       // remove shadow on iOS
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -4,
        },
        // Optional: nice active background + indicator
        tabBarActiveBackgroundColor: Platform.OS === 'ios'
          ? 'rgba(214, 163, 228, 0.12)'
          : 'rgba(214, 163, 228, 0.18)',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Now Playing',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="musical-notes" focused={focused} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="player"
        options={{
          title: 'Player',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="play-circle" focused={focused} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="playlist"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="list" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
import * as React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

export default function Navbar() {
  const insets = useSafeAreaInsets(); // Handle safe area for bottom padding
  const router = useRouter(); // For navigation
  const pathname = usePathname(); // To determine the current route

  return (
    <View
      className="flex-row justify-around items-center bg-[#191919] rounded-t-xl"
      style={{
        paddingBottom: insets.bottom, // Respect bottom safe area
        paddingTop: 10,
        paddingHorizontal: 20,
        height: 80 + insets.bottom, // Fixed height plus safe area
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* To Do Button */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => router.push('/todo')}
      >
        <Ionicons
          name="list"
          size={24}
          color={pathname === '/todo' ? '#ccc' : '#403D39'} 
        />
        <Text
          className={`text-xs mt-1 font-medium ${
            pathname === '/todo' ? 'text-[#ccc]' : 'text-[#403D39]'
          }`}
        >
          TO DO
        </Text>
        {pathname === '/todo' && (
          <View className="w-6 h-0.5 bg-[#007AFF] mt-1 rounded-full" />
        )}
      </TouchableOpacity>

      {/* Completed Button */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => router.push('/completed')}
      >
        <Ionicons
          name="checkmark-done"
          size={24}
          color={pathname === '/completed' ? '#ccc' : '#403D39'}
        />
        <Text
          className={`text-xs mt-1 font-medium ${
            pathname === '/completed' ? 'text-[#ccc]' : 'text-[#403D39]'
          }`}
        >
          COMPLETED
        </Text>
        {pathname === '/completed' && (
          <View className="w-6 h-0.5 bg-[#007AFF] mt-1 rounded-full" />
        )}
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => router.push('/profile')}
      >
        <Ionicons
          name="person"
          size={24}
          color={pathname === '/profile' ? '#ccc' : '#403D39'}
        />
        <Text
          className={`text-xs mt-1 font-medium ${
            pathname === '/profile' ? 'text-[#ccc]' : 'text-[#403D39]'
          }`}
        >
          PROFILE
        </Text>
        {pathname === '/profile' && (
          <View className="w-6 h-0.5 bg-[#007AFF] mt-1 rounded-full" />
        )}
      </TouchableOpacity>
    </View>
  );
}
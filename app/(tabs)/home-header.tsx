import * as React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const showBackButton = pathname !== '/todo';

  return (
    <View
      className="flex-row items-center absolute top-0 left-0 right-0 z-10 px-5 pb-3.5 min-h-[60px]"
      style={{ paddingTop: insets.top || 20 }}
    >
      {/* Back button (shown conditionally) */}
      {/* {showBackButton ? (
        <TouchableOpacity
          className="w-10 h-10 justify-center items-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View className="w-10 h-10" /> // Empty space when no back button
      )} */}

      {/* Main content container */}
      <View className="flex-1 flex-row justify-center items-center left-5">
        {/* Logo in the center */}
        <Image
          source={require('./logo.png')}
          style={{ height: 25 }}
          resizeMode="contain"
        />
      </View>

      {/* Profile picture on the right */}
      <TouchableOpacity className="ml-2.5 w-10 h-10 justify-center items-center">
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          className="w-10 h-10 rounded-full border border-white"
        />
      </TouchableOpacity>
    </View>
  );
}
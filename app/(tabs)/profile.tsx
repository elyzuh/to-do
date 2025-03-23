import * as React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './home-header';
import Navbar from './navbar';

export default function Profile() {
  const insets = useSafeAreaInsets();

  const headerHeight = insets.top + 15 + 40; 
  const navbarHeight = 80 + insets.bottom;

  return (
    <View className="flex-1 bg-[#252422]">
      <Header />
      <View
        className="flex-1 justify-center items-center"
        style={{
          paddingTop: headerHeight, 
          paddingBottom: navbarHeight,
          paddingHorizontal: 20,
        }}
      >
        <Text className="text-[#ccc] text-lg font-bold">
          PROFILE PAGE
        </Text>
      </View>
      <Navbar />
    </View>
  );
}
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#121212] items-center justify-center px-5">
      <Image 
        source={require("./logo.png")} 
        style={{ height: 50, marginBottom: 40 }}
        resizeMode="contain"
      />
      <TouchableOpacity
        className="w-full h-[50px] bg-[#2F80ED] justify-center items-center rounded-lg mt-2.5"
        onPress={() => router.push("./signin")}
      >
        <Text className="text-white text-lg font-bold">Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-full h-[50px] bg-[#F5F5F5] justify-center items-center rounded-lg mt-2.5"
        onPress={() => router.push("./signup")}
      >
        <Text className="text-black text-lg font-bold">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#121212] items-center justify-center px-5">
      <Image 
        source={require("./logo.png")} 
        style={{ height: 50, marginBottom: 40 }}
        resizeMode="contain"
      />

      <Text className="self-start text-white text-base mb-1 ml-1">Username</Text>
      <TextInput
        className="w-full h-[50px] bg-[#1e1e1e] text-white rounded-lg px-4 mb-3.5 text-base border border-[#333]"
        placeholder="John Doe"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="words"
      />

      <Text className="self-start text-white text-base mb-1 ml-1">Email Address</Text>
      <TextInput
        className="w-full h-[50px] bg-[#1e1e1e] text-white rounded-lg px-4 mb-3.5 text-base border border-[#333]"
        placeholder="name@email.com"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="self-start text-white text-base mb-1 ml-1">Password</Text>
      <TextInput
        className="w-full h-[50px] bg-[#1e1e1e] text-white rounded-lg px-4 mb-3.5 text-base border border-[#333]"
        placeholder="create password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text className="self-start text-white text-base mb-1 ml-1">Password</Text>
      <TextInput
        className="w-full h-[50px] bg-[#1e1e1e] text-white rounded-lg px-4 mb-3.5 text-base border border-[#333]"
        placeholder="confirm password"
        placeholderTextColor="#888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        className="w-full h-[50px] bg-[#F5F5F5] justify-center items-center rounded-lg mt-2.5"
        onPress={() => console.log("Sign Up pressed")}
      >
        <Text className="text-black text-lg font-bold">Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="w-full h-[50px] bg-[#2F80ED] justify-center items-center rounded-lg mt-2.5"
        onPress={() => router.push("/signin")}
      >
        <Text className="text-white text-lg font-bold">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
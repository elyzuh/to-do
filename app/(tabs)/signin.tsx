import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import TodoScreen from "./todo";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter();
  const [uID, setuID] = useState()

  const handleSignIn = async() => {
    try {
      const response = await fetch(`https://todo-list.dcism.org/signin_action.php?email=${email}&password=${password}`);
      const result  = await response.json();

      if(result.status === 200) {
        console.log("Login Success:", result.data);
        <TodoScreen userID={result.data.id}/>
      } else {
        setError(result.message || "Invalid Credentials");
      }
    } catch (error) {
      console.log("Sign in failed", error)
    }
  }

  // const handleSignIn = () => {
  //   const validEmail = "test@gmail.com";
  //   const validPassword = "test";

  //   if (email === validEmail && password === validPassword) {
  //     setError("");
  //     router.push("./todo");
  //   } else {
  //     setError("Invalid email or password. Please use test@gmail.com and password 'test'.");
  //   }
  // };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View className="flex-1 bg-[#121212] items-center justify-center px-5">
        {/* Logo */}
        <Image 
          source={require("./logo.png")} 
          style={{ height: 50, marginBottom: 40 }}
          resizeMode="contain"
        />

        {/* Email Input */}
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

        {/* Password Input */}
        <Text className="self-start text-white text-base mb-1 ml-1">Password</Text>
        <View className="relative w-full">
          <TextInput
            className="w-full h-[50px] bg-[#1e1e1e] text-white rounded-lg px-4 pr-12 mb-3.5 text-base border border-[#333]"
            placeholder="password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword} // Toggle visibility
          />
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={toggleShowPassword}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error ? (
          <Text className="text-red-500 text-sm mb-3 self-start ml-1">{error}</Text>
        ) : null}

        {/* Sign In Button */}
        <TouchableOpacity 
          className="w-full h-[50px] bg-[#2F80ED] justify-center items-center rounded-lg mt-2.5"
          onPress={handleSignIn}
        >
          <Text className="text-white text-lg font-bold">Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity 
          className="w-full h-[50px] bg-[#F5F5F5] justify-center items-center rounded-lg mt-2.5 mb-5"
          onPress={() => router.push("./signup")}
        >
          <Text className="text-black text-lg font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
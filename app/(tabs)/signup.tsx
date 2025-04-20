import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    setError("");
  
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    const bodyData = new URLSearchParams();
    bodyData.append("first_name", firstName);
    bodyData.append("last_name", lastName);
    bodyData.append("email", email);
    bodyData.append("password", password);
    bodyData.append("confirm_password", confirmPassword);
  
    try {
      const response = await fetch("https://todo-list.dcism.org/signup_action.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyData.toString()
      });
  
      const rawText = await response.text();
  
      // Try to extract the JSON portion from the raw response
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}') + 1;
      const jsonSlice = rawText.slice(jsonStart, jsonEnd);
  
      let result;
      try {
        result = JSON.parse(jsonSlice);
      } catch (err) {
        console.error("Failed to parse JSON from response:", jsonSlice);
        setError("Server returned unreadable response.");
        return;
      }
  
      console.log("Parsed API result:", result);
  
      if (result.status === 200) {
        Alert.alert("Success", result.message);
        router.push("/signin");
      } else {
        setError(`(${result.status}) ${result.message}`);
      }
  
    } catch (err) {
      console.error("Network or fetch error:", err);
      setError("Network error. Please try again later.");
    }
  };
  
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View className="flex-1 bg-[#121212] px-5 justify-center">
        <View className="items-center mb-5">
          <Image
            source={require("./logo.png")}
            style={{ height: 50, width: 150 }}
            resizeMode="contain"
          />
        </View>

        <View className="space-y-3">
          <View>
            <Text className="text-white text-base mb-1">First Name</Text>
            <TextInput
              className="w-full h-[45px] bg-[#1e1e1e] text-white rounded-lg px-4 border border-[#333]"
              placeholder="John"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View>
            <Text className="text-white text-base mb-1">Last Name</Text>
            <TextInput
              className="w-full h-[45px] bg-[#1e1e1e] text-white rounded-lg px-4 border border-[#333]"
              placeholder="Doe"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          <View>
            <Text className="text-white text-base mb-1">Email Address</Text>
            <TextInput
              className="w-full h-[45px] bg-[#1e1e1e] text-white rounded-lg px-4 border border-[#333]"
              placeholder="name@email.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-white text-base mb-1">Password</Text>
            <TextInput
              className="w-full h-[45px] bg-[#1e1e1e] text-white rounded-lg px-4 border border-[#333]"
              placeholder="create password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-white text-base mb-1">Confirm Password</Text>
            <TextInput
              className="w-full h-[45px] bg-[#1e1e1e] text-white rounded-lg px-4 border border-[#333]"
              placeholder="confirm password"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {error ? <Text className="text-red-500 text-sm">{error}</Text> : null}

          <TouchableOpacity
            className="w-full h-[45px] bg-[#F5F5F5] justify-center items-center rounded-lg"
            onPress={handleSignUp}
          >
            <Text className="text-black text-lg font-bold">Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full h-[45px] bg-[#2F80ED] justify-center items-center rounded-lg"
            onPress={() => router.push("/signin")}
          >
            <Text className="text-white text-lg font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

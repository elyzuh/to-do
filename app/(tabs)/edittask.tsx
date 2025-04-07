import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Touchable,
  TouchableOpacity,
} from "react-native";
import Navbar from "./navbar";
import Header from "./home-header";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function edittask() {
  const insets = useSafeAreaInsets();

  const headerHeight = insets.top + 15 + 40;
  const navbarHeight = 80 + insets.bottom;

  return (
    <View
      className="bg-[#252422] flex-1 pt-5"
      style={{
        paddingTop: headerHeight,
        paddingBottom: navbarHeight,
        paddingHorizontal: 20,
      }}
    >
      <Header />
      <View className="flex-1 justify-start border-red-600">
        <View className="flex flex-col w-full border-blue-600">
          <Text className="text-[#FFFCF2] font-normal text-base text-[10px]">
            Title
          </Text>
          <TextInput className="rounded-2xl h-[39px] p-2 bg-[#403D39] text-[#FFFCF2]" />
        </View>

        <View>
          <View>
            <Text className="text-[#FFFCF2] font-normal text-base text-[10px]">
              Description
            </Text>
            <TextInput
              className="rounded-2xl h-[184px] p-2 bg-[#403D39] text-[#FFFCF2] text-[12px] items-start"
              multiline={true}
              numberOfLines={6}
            />
          </View>

          <View className="flex-1 border-red-600 items-center text-white mt-2">
            <TouchableOpacity className="bg-[#00C75A] w-full items-center rounded-[12px] h-[39px] justify-center mb-2" onPress={() => {}}>
              Update
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#3772FF] w-full items-center rounded-[12px] h-[39px] justify-center mb-2" onPress={() => {}}>
              Complete
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#CF1B27] w-full items-center rounded-[12px] h-[39px] justify-center" onPress={() => {}}>
              Delete
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Navbar />
    </View>
  );
}

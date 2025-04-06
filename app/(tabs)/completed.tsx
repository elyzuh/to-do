import * as React from "react";
import { useState, useEffect } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "./home-header";
import Navbar from "./navbar";

export default function Completed() {
  const [placeholder, setPlaceholder] = useState(false);

  const insets = useSafeAreaInsets();

  const headerHeight = insets.top + 15 + 40;
  const navbarHeight = 80 + insets.bottom;

  const fakeList = [{name: "Task 1", desc: "Do conceptual framework"}, {name: "Task 2", desc: "Thesis task"}];


  useEffect(() => {
    {
      fakeList.length === 0 ? setPlaceholder(true) : setPlaceholder(false);
    }
  }, [fakeList]);

  return (
    <View className="pt-5 flex-1 bg-[#252422]">
      <Header />
      <View
        className="flex-1 justify-center items-center"
        style={{
          paddingTop: headerHeight,
          paddingBottom: navbarHeight,
          paddingHorizontal: 20,
        }}
      >
        {placeholder && (
          <Text className="text-[#ccc] text-lg font-bold">
            NO COMPLETED TASKS
          </Text>
        )}
        {!placeholder && (
          <View className="w-full h-full">
            <View>
              {fakeList.map((index) => {
                return (
                  <View
                    className={`flex-row items-center rounded-lg p-4 border-b border-[#403D39] rounded-none
                    }`}
                  >
                    <TouchableOpacity>
                      <Ionicons
                        name={"checkmark-circle"}
                        size={24}
                        color={"#403D39"}
                        className="mr-3.5"
                      />
                    </TouchableOpacity>
                    <View className="flex-1">
                      <Text
                        className={`text-base font-bold text-[#403D39] line-through`}
                      >
                        {index.name}
                      </Text>
                      <Text className={`text-sm text-[#403D39] line-through`}>
                        {index.desc}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
      <Navbar />
    </View>
  );
}

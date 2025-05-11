import * as React from "react";
import { Text, View, FlatList, TouchableOpacity, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./home-header";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import Navbar from "./navbar";

interface Task {
  id: string;
  item_name: string;
  item_description: string;
  user_id: number;
}

export default function TodoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [swipedTaskId, setSwipedTaskId] = React.useState<string | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [error, setError] = React.useState<Error | null>(null);

  // ✅ Fetch tasks from the server
  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "https://todo-list.dcism.org/getItems_action.php?status=active&user_id=3"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data: Task[] = await response.json();
        console.log("Fetched data:", data);
        setTasks(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err);
      }
    };

    fetchTasks();
  }, []);

  // ✅ Handle adding new task from URL param
  React.useEffect(() => {
    if (params.newTask && typeof params.newTask === "string") {
      try {
        const newTaskData = JSON.parse(params.newTask);

        const addTaskToServer = async () => {
          try {
            const response = await fetch("https://todo-list.dcism.org/additem_action.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                item_name: newTaskData.title,
                item_description: newTaskData.description,
                user_id: 3,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to add task");
            }

            // Optionally fetch updated list from server:
            const refreshed = await fetch(
              "https://todo-list.dcism.org/getItems_action.php?status=active&user_id=3"
            );
            const data: Task[] = await refreshed.json();
            setTasks(data);

            // Clear param
            router.setParams({ newTask: undefined });
          } catch (error) {
            console.error("Add task error:", error);
          }
        };

        addTaskToServer();
      } catch (error) {
        console.error("Invalid task JSON:", error);
      }
    }
  }, [params.newTask]);

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setSwipedTaskId(null);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      className="justify-center items-center w-[60px] rounded-lg bg-red-500/20"
      onPress={() => deleteTask(id)}
    >
      <Ionicons name="trash" size={24} color="#CF1B27" />
    </TouchableOpacity>
  );

  const renderTask = ({ item }: { item: Task }) => {
    const isSwiped = swipedTaskId === item.id;

    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item.id)}
        overshootRight={false}
        onSwipeableWillOpen={() => setSwipedTaskId(item.id)}
        onSwipeableClose={() => setSwipedTaskId(null)}
      >
        <View
          className={`flex-row items-center rounded-lg p-4 border-b border-[#403D39] ${isSwiped ? "bg-[#403D39]" : "bg-[#252422]"}`}
        >
          <Ionicons name="ellipse-outline" size={24} color="#fff" className="mr-3.5" />
          <TouchableOpacity
            className="flex-1"
            onPress={() => router.push("/edittask")}
          >
            <Text className="text-base font-bold text-white">
              {item.item_name}
            </Text>
            <Text className="text-sm text-[#ccc]">
              {item.item_description}
            </Text>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  const headerHeight = insets.top + 15 + 40;

  return (
    <View className="flex-1 bg-[#252422] pt-5">
      <Header />
      {error ? (
        <Text className="text-red-400 text-center mt-4">
          Failed to load tasks: {error.message}
        </Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingTop: headerHeight,
            paddingBottom: insets.bottom + 80,
            paddingHorizontal: 20,
          }}
        />
      )}
      <TouchableOpacity
        className="absolute right-5 bg-[#007AFF] w-[60px] h-[60px] mb-20 rounded-full justify-center items-center shadow-lg"
        style={{ bottom: insets.bottom + 20 }}
        onPress={() => router.push("/addtodo")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      <Navbar />
    </View>
  );
}

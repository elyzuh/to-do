import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoItem from "../../components/TodoItem";
import { todoService } from "../../services/todoService";
import { TodoItem as TodoItemType } from "../../types";

const Tasks = () => {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        router.replace("/LoginPage");
        return;
      }
      const response = await todoService.getTodos("active", userId);
      if (response.status === 200) {
        const todosArray = response.data ? Object.values(response.data) : [];
        setTodos(todosArray as TodoItemType[]);
      } else {
        setError(response.message || "Failed to load todos");
      }
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("An error occurred while fetching todos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTodos();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ToDo</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#E94560"
            style={styles.loader}
          />
        ) : todos.length > 0 ? (
          todos.map((todo) => (
            <TodoItem
              key={todo.item_id}
              id={todo.item_id}
              title={todo.item_name}
              description={todo.item_description}
              onStatusChange={(id) => todoService.changeTodoStatus(todo.item_id, todo.status)}
              onDelete={(id) => todoService.deleteTodo(id)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No active tasks. Add one below!</Text>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/addToDo")}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    color: "#E94560",
    marginBottom: 10,
    fontWeight: "bold",
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: "#E94560",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: "center",
    color: "#FFF",
    marginTop: 50,
    marginBottom: 30,
    fontSize: 16,
  },
  errorText: {
    color: "#F37272",
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
});

export default Tasks;

import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { todoService } from "../services/todoService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditToDoScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    item_id: string;
    currentTitle: string;
    currentDescription: string;
  }>();

  const [itemId, setItemId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const currentParamItemId = params.item_id ? parseInt(params.item_id, 10) : null;
    if (currentParamItemId && (itemId === null || itemId !== currentParamItemId)) {
      setItemId(currentParamItemId);
      setTitle(params.currentTitle || "");
      setDescription(params.currentDescription || "");
    }
  }, [params.item_id, params.currentTitle, params.currentDescription, itemId]);
  
  const handleUpdate = async () => {
    setMessage(null);
    setMessageType(null);
    
    if (!itemId) {
      setMessage("Item ID is missing.");
      setMessageType("error");
      return;
    }
    
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    
    if (!trimmedTitle && !trimmedDescription) {
      setMessage("Title and description cannot be empty.");
      setMessageType("error");
      return;
    }
    if (!trimmedTitle) {
      setMessage("Title cannot be empty.");
      setMessageType("error");
      return;
    }
    if (!trimmedDescription) {
      setMessage("Description cannot be empty.");
      setMessageType("error");
      return;
    }
    
    setLoading(true);
    
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      const response = await todoService.updateTodo({
        item_id: itemId,
        item_name: trimmedTitle,
        item_description: trimmedDescription,
        user_id: userId
      });
      
      if (response.status === 200) {
        setMessage("Task updated successfully.");
        setMessageType("success");
        setTimeout(() => router.back(), 1000);
      } else {
        setMessage(response.message || "Failed to update task.");
        setMessageType("error");
      }
    } catch (err: any) {
      console.error("Error updating task:", err);
      setMessage(err.message || "An error occurred while updating the task.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Edit Task</Text>
        {/* --- Re-introduce JSX for inline messages --- */}
        {message && (
          <Text
            style={[
              styles.messageText,
              messageType === "success" ? styles.successText : styles.errorText,
            ]}
          >
            {message}
          </Text>
        )}
        {/* --- End re-introduction --- */}
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.detailsInput]}
        />
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.updateButtonText}>Update Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    elevation: 2,
  },
  detailsInput: {
    height: 100,
    textAlignVertical: "top",
  },
  updateButton: {
    backgroundColor: "#007aff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  messageText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  errorText: {
    color: "#ff3b30",
  },
  successText: {
    color: "#28a745",
  },
});

export default EditToDoScreen;
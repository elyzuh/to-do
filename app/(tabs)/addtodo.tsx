import * as React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import Header from './header';
import { useRouter } from 'expo-router';

export default function AddTodoScreen() {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleAddTask = () => {
    if (title.trim() === '') return;
    
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
    };
    
    console.log('Navigating with newTask:', JSON.stringify(newTask)); // Debug log
    router.push({
      pathname: '/todo',
      params: { newTask: JSON.stringify(newTask) },
    });
  };

  return (
    <View className="flex-1 bg-[#252422] px-5 pt-5">
      <Header />
      <View className="flex-1 px-2 pt-4">
        <Text className="text-2xl font-bold text-white mb-6">Add Task</Text>
        
        <Text className="text-base font-medium text-gray-300 mb-2">Title</Text>
        <TextInput
          className="rounded-lg p-3 text-base mb-5 text-white bg-[#403D39]"
          placeholder="Enter task title"
          placeholderTextColor="#666"
          value={title}
          onChangeText={setTitle}
        />
        
        <Text className="text-base font-medium text-gray-300 mb-2">Description</Text>
        <TextInput
          className="rounded-lg p-3 text-base mb-5 text-white bg-[#403D39] h-24"
          placeholder="Enter task description"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        
        <TouchableOpacity 
          className="bg-[#007AFF] p-4 rounded-lg items-center mt-6"
          onPress={handleAddTask}
        >
          <Text className="text-white text-base font-semibold">Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
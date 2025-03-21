import * as React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './header';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';

// Sample data for the tasks
const initialTasks = [
  { id: '1', title: 'be radiant in valo', description: 'first step to being pro', completed: false },
  { id: '2', title: 'thesis deliverables', description: 'papasara mi palihug', completed: true },
  { id: '3', title: 'play valorant', description: 'daily routine ', completed: false },
  { id: '4', title: 'data anal', description: 'kalmahi sa sir g pls', completed: false },
  { id: '5', title: 'adto skewl', description: 'kaundangon naman ko', completed: false },
  { id: '6', title: 'buy smiski', description: 'for my mental health', completed: false },
];

export default function TodoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [tasks, setTasks] = React.useState(initialTasks);

  React.useEffect(() => {
    console.log('Params received in TodoScreen:', params);
    if (params.newTask && typeof params.newTask === 'string' && params.newTask !== 'undefined') {
      try {
        const newTask = JSON.parse(params.newTask);
        console.log('Parsed newTask:', newTask);
        setTasks(prevTasks => [newTask, ...prevTasks]);
        router.setParams({ newTask: undefined });
      } catch (error) {
        console.error('Error parsing newTask:', error);
      }
    } else {
      console.log('No valid newTask param found');
    }
  }, [params.newTask, router]);

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      className="justify-center items-center w-[60px] h-full rounded-lg rounded-bl-none rounded-br-none"
      onPress={() => deleteTask(id)}
    >
      <Ionicons name="trash" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderTask = ({ item }: { item: typeof initialTasks[0] }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
    >
      <View className="flex-row items-center rounded-lg p-4 mb-2.5 border-b border-[#403D39] rounded-bl-none rounded-br-none">
        <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={item.completed ? '#4CAF50' : '#fff'}
            className="mr-3.5"
          />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className={`text-base font-bold ${item.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
            {item.title}
          </Text>
          <Text className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-[#ccc]'}`}>
            {item.description}
          </Text>
        </View>
      </View>
    </Swipeable>
  );

  const headerHeight = insets.top + 15 + 40;

  return (
    <View className="flex-1 bg-[#252422] pt-5">
      <Header />
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: 20,
        }}
      />
      <TouchableOpacity
        className="absolute right-5 bg-[#007AFF] w-[60px] h-[60px] rounded-full justify-center items-center shadow-lg"
        style={{ bottom: insets.bottom + 20 }}
        onPress={() => router.push('/addtodo')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
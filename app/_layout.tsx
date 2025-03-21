import { Stack } from 'expo-router';
import 'react-native-reanimated';
import '@/global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Welcome" }} />
      <Stack.Screen name="signin" options={{ title: "Sign In" }} />
      <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
      <Stack.Screen name="todo" options={{ title: "To Do Page" }} />
      <Stack.Screen name="addtodo" options={{ title: "Add Task" }} />
    </Stack>
    </GestureHandlerRootView>
  );
}
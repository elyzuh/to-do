import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TodoProvider } from '@/context/TodoContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Check authentication
        const userId = await AsyncStorage.getItem('userId');
        setIsAuthenticated(!!userId);
      } catch (e) {
        console.warn('Error loading app:', e);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, [loaded]);

  // Show loading screen while checking authentication and loading fonts
  if (isLoading || !loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TodoProvider>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ headerShown: false }} 
            redirect={!isAuthenticated}
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="LoginPage" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="SignupPage" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="addToDo" 
            options={{ 
              headerTitle: "Add Task",
              headerShown: true 
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </TodoProvider>
    </ThemeProvider>
  );
}
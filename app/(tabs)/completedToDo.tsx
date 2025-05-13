import { FlatList, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import TodoItem from '../../components/TodoItem';
import { todoService } from '../../services/todoService';
import { TodoItem as TodoItemType } from '../../types';

const CompletedTasks = () => {
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
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        router.replace('/LoginPage');
        return;
      }
      const response = await todoService.getTodos('inactive', userId);
      if (response.status === 200) {
        const todosArray = response.data ? Object.values(response.data) : [];
        setTodos(todosArray as TodoItemType[]);
      } else {
        setError(response.message || 'Failed to load completed todos');
      }
    } catch (err) {
      console.error('Error fetching completed todos:', err);
      setError('An error occurred while fetching completed todos');
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
      <Text style={styles.header}>Completed Tasks</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#E94560" style={styles.loader} />
      ) : todos.length > 0 ? (
        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <TodoItem
              id={item.item_id}
              title={item.item_name}
              description={item.item_description}
            />
          )}
          keyExtractor={item => item.item_id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.emptyText}>No completed tasks yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
    backgroundColor: '#1A1A2E',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#E94560',
  },
  emptyText: {
    textAlign: 'center',
    color: '#FFF',
    marginTop: 50,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    color: '#F37272',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default CompletedTasks;

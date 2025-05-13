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

  useFocusEffect(
    useCallback(() => {
      console.log('Completed ToDo screen in focus, refreshing todos');
      fetchTodos();
      return () => {
        // Cleanup function when screen goes out of focus (optional)
      };
    }, [])
  );

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        console.log('No user ID found, redirecting to login');
        router.replace('/LoginPage');
        return;
      }

      const response = await todoService.getTodos('inactive', userId);
      
      if (response.status === 200) {
        // Convert object of objects to array if needed
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

  const handleStatusChange = async (itemId: number) => {
    try {
      console.log('Changing status to active for item:', itemId);

      const response = await todoService.changeTodoStatus(itemId, 'active');
      
      if (response.status === 200) {
        // Remove the reactivated todo from the completed list
        setTodos(todos.filter(todo => todo.item_id !== itemId));
      } else {
        setError(response.message || 'Failed to update todo status');
      }
    } catch (err) {
      console.error('Error updating todo status:', err);
      setError('An error occurred while updating todo status');
    }
  };

  const handleDelete = async (itemId: number) => {
    try {
      console.log('Deleting item:', itemId);

      const response = await todoService.deleteTodo(itemId);
      
      if (response.status === 200) {
        // Remove the deleted todo from the list
        setTodos(todos.filter(todo => todo.item_id !== itemId));
      } else {
        setError(response.message || 'Failed to delete todo');
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('An error occurred while deleting todo');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTodos();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Completed Tasks</Text>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
      ) : todos.length > 0 ? (
        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <TodoItem
              id={item.item_id}
              title={item.item_name}
              description={item.item_description}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
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
    backgroundColor: '#f3f6fb',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
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
    color: '#ff3b30',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default CompletedTasks;
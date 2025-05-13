import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoItem from '../../components/TodoItem';
import { todoService } from '../../services/todoService';
import { TodoItem as TodoItemType } from '../../types';

const Tasks = () => {
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
      console.log('Current ToDo screen in focus, refreshing todos');
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

      const response = await todoService.getTodos('active', userId);
      
      if (response.status === 200) {
        // Convert object of objects to array if needed
        const todosArray = response.data ? Object.values(response.data) : [];
        setTodos(todosArray as TodoItemType[]);
      } else {
        setError(response.message || 'Failed to load todos');
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('An error occurred while fetching todos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (itemId: number) => {
    try {
      console.log('Changing status to inactive for item:', itemId);

      const response = await todoService.changeTodoStatus(itemId, 'inactive');
      
      if (response.status === 200) {
        // Remove the completed todo from the current list
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
      <Text style={styles.header}>ToDo</Text>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
        ) : todos.length > 0 ? (
          todos.map(todo => (
            <TodoItem
              key={todo.item_id}
              id={todo.item_id}
              title={todo.item_name}
              description={todo.item_description}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No active tasks. Add one below!</Text>
        )}
        
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/addToDo')}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#007aff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 50,
    marginBottom: 30,
    fontSize: 16,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
});

export default Tasks;
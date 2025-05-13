import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { todoService, TodoItem, User } from '../services/todoService';

interface TodoContextType {
  user: User | null;
  activeTodos: TodoItem[];
  inactiveTodos: TodoItem[];
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  addTodo: (todo: Omit<TodoItem, 'item_id' | 'status' | 'timemodified'>) => Promise<void>;
  updateTodo: (todo: Pick<TodoItem, 'item_id' | 'item_name' | 'item_description'>) => Promise<void>;
  changeTodoStatus: (itemId: number, status: 'active' | 'inactive') => Promise<void>;
  deleteTodo: (itemId: number) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTodos, setActiveTodos] = useState<TodoItem[]>([]);
  const [inactiveTodos, setInactiveTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        await refreshTodos();
      }
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const refreshTodos = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [activeResponse, inactiveResponse] = await Promise.all([
        todoService.getTodos('active', user.id),
        todoService.getTodos('inactive', user.id)
      ]);
      setActiveTodos(Object.values(activeResponse.data));
      setInactiveTodos(Object.values(inactiveResponse.data));
    } catch (err) {
      setError('Failed to load todos');
      console.error('Error refreshing todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await todoService.signIn(email, password);
      if (response.status === 200) {
        setUser(response.data);
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        await refreshTodos();
      } else {
        setError(response.message ?? 'An unknown error occurred');
      }
    } catch (err) {
      setError('Failed to sign in');
      console.error('Error signing in:', err);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: any) => {
    try {
      setLoading(true);
      const response = await todoService.signUp(data);
      if (response.status === 200) {
        await signIn(data.email, data.password);
      } else {
        setError(response.message ?? 'An unknown error occurred');
      }
    } catch (err) {
      setError('Failed to sign up');
      console.error('Error signing up:', err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setActiveTodos([]);
      setInactiveTodos([]);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const addTodo = async (todo: Omit<TodoItem, 'item_id' | 'status' | 'timemodified'>) => {
    try {
      setLoading(true);
      await todoService.addTodo(todo);
      await refreshTodos();
    } catch (err) {
      setError('Failed to add todo');
      console.error('Error adding todo:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (todo: Pick<TodoItem, 'item_id' | 'item_name' | 'item_description'>) => {
    try {
      setLoading(true);
      await todoService.updateTodo(todo);
      await refreshTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    } finally {
      setLoading(false);
    }
  };

  const changeTodoStatus = async (itemId: number, status: 'active' | 'inactive') => {
    try {
      setLoading(true);
      await todoService.changeTodoStatus(itemId, status);
      await refreshTodos();
    } catch (err) {
      setError('Failed to change todo status');
      console.error('Error changing todo status:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (itemId: number) => {
    try {
      setLoading(true);
      await todoService.deleteTodo(itemId);
      await refreshTodos();
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        user,
        activeTodos,
        inactiveTodos,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        addTodo,
        updateTodo,
        changeTodoStatus,
        deleteTodo,
        refreshTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}; 
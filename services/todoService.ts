import axios from 'axios';
import { TodoItem, User, SignUpData, ApiResponse } from '../types';

const BASE_URL = 'https://todo-list.dcism.org';

// Helper function for consistent API request handling
const makePostRequest = async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  });
  
  const responseText = await response.text();
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error(`Failed to parse response from ${endpoint}:`, responseText);
    throw new Error('Invalid server response');
  }
};

export const todoService = {
  // Authentication
  signUp: async (data: SignUpData): Promise<ApiResponse> => {
    return makePostRequest('signup_action.php', data);
  },

  signIn: async (email: string, password: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${BASE_URL}/signin_action.php?email=${email}&password=${password}`, {
      method: 'GET',
    });
    return response.json();
  },

  // Todo Operations
  getTodos: async (status: 'active' | 'inactive', userId: string | number): Promise<ApiResponse<Record<string, TodoItem>>> => {
    const response = await fetch(`${BASE_URL}/getItems_action.php?status=${status}&user_id=${userId}`, { 
      method: 'GET'
    });
    return response.json();
  },

  addTodo: async (todo: Pick<TodoItem, 'item_name' | 'item_description'> & { user_id: string | number }): Promise<ApiResponse<TodoItem>> => {
    return makePostRequest('addItem_action.php', todo);
  },

  updateTodo: async (todo: Pick<TodoItem, 'item_id' | 'item_name' | 'item_description'>) => {
    const response = await axios.put(`${BASE_URL}/editItem_action.php`, todo);
    return response.data;
  },

  changeTodoStatus: async (itemId: number, status: 'active' | 'inactive'): Promise<ApiResponse> => {
    const data = { 
      status, 
      item_id: itemId 
    };
    return makePostRequest('statusItem_action.php', data);
  },

  deleteTodo: async (itemId: number): Promise<ApiResponse> => {
    const response = await fetch(`${BASE_URL}/deleteItem_action.php?item_id=${itemId}`, {
      method: 'POST',
    });
    return response.json();
  }  
};

export type { TodoItem, User };
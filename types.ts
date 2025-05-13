// Shared types for the application

// Todo item model
export interface TodoItem {
  item_id: number;
  item_name: string;
  item_description: string;
  status: 'active' | 'inactive';
  user_id: number;
  timemodified: string;
}

// User model
export interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
  timemodified: string;
}

// Sign up request data
export interface SignUpData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

// API response
export interface ApiResponse<T = any> {
  status: number;
  data: T;
  message?: string;
} 
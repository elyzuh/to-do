import { Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { todoService } from '../services/todoService';

const Add = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router = useRouter();

  const handleAdd = async () => {
    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();
  
    if (!trimmedTitle && !trimmedDetails) {
      setError('Please input both fields.');
      setMessageType('error');
      return;
    }
  
    if (!trimmedTitle) {
      setError('Please input title.');
      setMessageType('error');
      return;
    }
  
    if (!trimmedDetails) {
      setError('Please input details.');
      setMessageType('error');
      return;
    }
  
    setLoading(true);
    setError(null);
    setMessageType(null);
  
    try {
      const userId = await AsyncStorage.getItem('userId');
  
      if (!userId) {
        console.log('No user ID found, redirecting to login');
        router.replace('/LoginPage');
        return;
      }
  
      const response = await todoService.addTodo({
        item_name: trimmedTitle,
        item_description: trimmedDetails,
        user_id: userId,
      });
  
      if (response.status === 200) {
        setError('Added new task.');
        setMessageType('success');
        setTitle('');
        setDetails('');
        setTimeout(() => router.back(), 1000);
      } else {
        setError(response.message || 'Failed to add todo');
        setMessageType('error');
      }
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('An error occurred while adding the todo');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.header}>Add New Task</Text>
      
      {error && (
        <Text style={[
          styles.messageText,
          messageType === 'success' ? styles.successText : styles.errorText
        ]}>
          {error}
        </Text>
      )}
      
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.detailsInput]}
      />
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleAdd}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.addButtonText}>Add</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#1A1A2E',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#E94560',
  },
  input: {
    backgroundColor: '#16213E',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  detailsInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#E94560',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#F37272',
    marginBottom: 12,
    textAlign: 'center',
  },
  messageText: {
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  successText: {
    color: '#53D769',
  },
});

export default Add;

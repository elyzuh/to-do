import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');

  const router = useRouter();

  const handleLogin = async () => {
    setMessage('');
    setMessageType('');

    if (!email || !password) {
      setMessage('Please fill out all fields.');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch(
        `https://todo-list.dcism.org/signin_action.php?email=${email}&password=${password}`,
        {
          method: 'GET',
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        setMessage('Success.');
        setMessageType('success');

        try {
          await AsyncStorage.setItem('userId', data.data.id.toString());
          await AsyncStorage.setItem('firstName', data.data.fname);
          await AsyncStorage.setItem('lastName', data.data.lname);
          await AsyncStorage.setItem('email', data.data.email);
          await AsyncStorage.setItem('user', JSON.stringify(data.data));
        } catch (storageError) {
          console.error('Failed to save user data to storage', storageError);
        }

        setTimeout(() => {
          router.replace('/(tabs)/currentToDo');
        }, 1000);
        return;
      }

      if (data.message?.toLowerCase().includes('not exist')) {
        setMessage('Account does not exist.');
      } else if (data.message?.toLowerCase().includes('password')) {
        setMessage('Passwords do not match.');
      } else {
        setMessage('Invalid username or password.');
      }
      setMessageType('error');
    } catch (error) {
      console.error('Login Error:', error);
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    }
  };

  const navigateToSignUp = () => {
    router.push('/SignupPage');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/toDoIcon.png')}
        style={styles.profileImage}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#777"
      />

      {message !== '' && (
        <Text style={messageType === 'error' ? styles.errorText : styles.successText}>
          {message}
        </Text>
      )}

      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>

      <Text style={styles.footer}>
        Don't have an account?{' '}
        <Pressable onPress={navigateToSignUp}>
          <Text style={styles.link}>Sign Up</Text>
        </Pressable>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A2E',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E94560',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#16213E',
    borderWidth: 1,
    borderColor: '#0F3460',
    borderRadius: 8,
    color: '#FFF',
  },
  footer: {
    marginTop: 16,
    color: '#FFF',
  },
  link: {
    color: '#53D769',
    fontWeight: '600',
  },
  profileImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 60,
  },
  errorText: {
    color: '#F37272',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    color: '#53D769',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#E94560',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});

export default Login;
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

        // Store user data
        try {
          await AsyncStorage.setItem('userId', data.data.id.toString());
          await AsyncStorage.setItem('firstName', data.data.fname);
          await AsyncStorage.setItem('lastName', data.data.lname);
          await AsyncStorage.setItem('email', data.data.email);
          // Store the entire user object for convenience
          await AsyncStorage.setItem('user', JSON.stringify(data.data));
          console.log('User data stored successfully');
        } catch (storageError) {
          console.error('Failed to save user data to storage', storageError);
          // Continue with login even if storage fails
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
    } catch (error: any) {
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {message !== '' && (
        <Text style={messageType === 'error' ? styles.errorText : styles.successText}>
          {message}
        </Text>
      )}

      <Button title="Login" onPress={handleLogin} />

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
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  footer: {
    marginTop: 16,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 60,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  successText: {
    color: 'green',
    fontSize: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
});

export default Login;
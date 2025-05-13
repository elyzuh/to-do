import React, { useState } from 'react';
import { View,  Text,  TextInput,  TouchableOpacity,  StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SignUp = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');

  const handleSignUp = async () => {
    setMessage('');
    setMessageType('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setMessage('Please fill out all fields.');
      setMessageType('error');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch(`https://todo-list.dcism.org/signup_action.php/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          confirm_password: confirmPassword
        }),
      });

      const data = await response.json();

      if (data.status !== 200) {
        setMessage(data.message || 'Failed to sign up.');
        setMessageType('error');
        return;
      }

      setMessage('Account created successfully.');
      setMessageType('success');

      setTimeout(() => {
        router.replace('/LoginPage');
      }, 1500);

    } catch (error) {
      console.error('Signup Error:', error);
      setMessage('Failed to sign up.');
      setMessageType('error');
    }
  };

  const goToLogin = () => {
    router.replace('/LoginPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#777"
      />

      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#777"
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#777"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#777"
      />

      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#777"
      />

      {message !== '' && (
        <Text style={messageType === 'error' ? styles.errorText : styles.successText}>
          {message}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToLogin}>
        <Text style={styles.loginLink}>
          Already have an account? Log in here.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#1A1A2E',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    alignSelf: 'center',
    color: '#E94560',
  },
  input: {
    backgroundColor: '#16213E',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#0F3460',
    borderWidth: 1,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#E94560',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  loginLink: {
    color: '#53D769',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#F37272',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    color: '#53D769',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default SignUp;

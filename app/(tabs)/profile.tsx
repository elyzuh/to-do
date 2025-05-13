import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('email');
        if (userEmail) {
          setEmail(userEmail);
        }
      } catch (error) {
        console.error('Failed to load user email:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove([
        'userId',
        'firstName',
        'lastName',
        'email',
        'user'
      ]);
      router.replace('/LoginPage');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/toDoIcon.png')}
        style={styles.profileImage}
        resizeMode="contain"
      />

      <Text style={styles.info}>Email: {email || 'Loading...'}</Text>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
        disabled={isLoading}
      >
        <Text style={styles.logoutButtonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1A1A2E',
  },
  profileImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 60,
  },
  info: {
    fontSize: 18,
    marginBottom: 32,
    color: '#FFF',
  },
  logoutButton: {
    backgroundColor: '#E94560',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Profile;

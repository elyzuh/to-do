import * as React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from './home-header';
import Navbar from './navbar';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const headerHeight = insets.top + 60; // Adjust based on Header height (min-h-[60px] + padding)
  const navbarHeight = 80 + insets.bottom;

  const handleLogOut = () => {
    try {
      // Navigate to sign-in page
      router.push('/signin');
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View
        style={[
          styles.content,
          {
            paddingTop: headerHeight, // Prevent overlap with absolute-positioned Header
            paddingBottom: navbarHeight,
            paddingHorizontal: 20,
          },
        ]}
      >
        {/* Profile picture in the center */}
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          style={styles.profileImage}
        />
        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogOut}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252422',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 10,
  },
  logoutButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
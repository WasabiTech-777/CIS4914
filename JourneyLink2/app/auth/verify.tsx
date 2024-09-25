import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebase/firebaseConfig'; // Importing auth from your firebase.ts
import { useRouter } from 'expo-router';

export default function VerifyScreen(){
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Function to check email verification status
    const checkEmailVerification = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          await user.reload(); // Reload user data to check verification status
          if (user.emailVerified) {
            setIsEmailVerified(true);
            clearInterval(interval); // Stop the interval when verified
            router.push('/(tabs)') // Navigate to the tabs screen
          }
        }
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    };

    // Set interval to check every 5 seconds
    const interval = setInterval(() => {
      checkEmailVerification();
    }, 5000); // 5 seconds

    // Cleanup function to clear the interval when the component unmounts or email is verified
    return () => clearInterval(interval);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>
        Please verify your email using the link sent to your inbox.
      </Text>
      <Text style={styles.statusText}>
        Waiting for email verification...
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#D3D3D3', // Grey background
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    headingText: {
      fontSize: 18,
      color: '#0000FF', // Blue font color
      marginBottom: 20,
      textAlign: 'center',
    },
    statusText: {
      fontSize: 16,
      color: '#0000FF', // Blue font color
      textAlign: 'center',
    },
  });


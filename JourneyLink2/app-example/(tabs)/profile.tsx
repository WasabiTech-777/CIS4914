import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function TabFourScreen() {
  const handleSignOut = () => {
    // Logic for signing out (e.g., clearing tokens, navigating to a sign-in screen, etc.)
    console.log('Sign out button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>John Doe</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>johndoe@example.com</Text>
      </View>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: '#666',
  },
  value: {
    fontSize: 20,
    fontWeight: '500',
  },
});

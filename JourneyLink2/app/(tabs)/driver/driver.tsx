import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getDriverStatus } from '@/services/driverService'; // Import your driver eligibility logic

export default function DriverScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDriverEligible, setIsDriverEligible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkDriverEligibility() {
      const eligible = await getDriverStatus();
      setIsDriverEligible(eligible);
      setIsLoading(false);
    }

    checkDriverEligibility();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isDriverEligible) {
        // Redirect to the driver form if not eligible
        router.replace('/auth/driverform');
      }
    }
  }, [isLoading, isDriverEligible]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

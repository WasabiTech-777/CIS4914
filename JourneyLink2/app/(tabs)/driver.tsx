import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { getDriverStatus, getUpcomingDrives } from '@/services/driverService'; // Import your driver eligibility logic and upcoming drives

export default function DriverScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDriverEligible, setIsDriverEligible] = useState(false);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function checkDriverEligibility() {
      const eligible = await getDriverStatus();
      setIsDriverEligible(eligible);
      if (eligible) {
        const drives = await getUpcomingDrives();
      }
      setIsLoading(false);
    }

    checkDriverEligibility();
  }, []);

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
      {isDriverEligible ? (
        <View style={styles.drivesContainer}>
          <Text style={styles.title}>Upcoming Drives</Text>
        </View>
      ) : (
        <View style={styles.notEligibleContainer}>
          <Text style={styles.message}>You are not yet eligible to be a driver.</Text>
          <Button
            title="Complete Driver Form"
            onPress={() => router.push('/auth/driverform')}
          />
        </View>
      )}
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
    marginBottom: 20,
  },
  notEligibleContainer: {
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  drivesContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 16,
  },
});
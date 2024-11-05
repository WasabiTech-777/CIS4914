import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { getDriverStatus, getUpcomingDrives } from '@/services/driverService';


type Drive = {
  id: string;
  title: string;
  details: string;
};

export default function DriverScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDriverEligible, setIsDriverEligible] = useState(false);
  const [upcomingDrives, setUpcomingDrives] = useState<Drive[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function checkDriverEligibility() {
      const eligible = await getDriverStatus();
      setIsDriverEligible(eligible);
      if (eligible) {
        const drives = await getUpcomingDrives();
        setUpcomingDrives(drives);
      }
      setIsLoading(false);
    }

    checkDriverEligibility();
  }, []);

  const handleCompleteDriverForm = () => {
    router.push('/auth/driverform');
  };

  const handlePostRide = () => {
    router.push('../auth/postRide/postride');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Checking driver eligibility...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {isDriverEligible ? (
          <>
            <TouchableOpacity style={styles.postButton} onPress={handlePostRide}>
              <Text style={styles.buttonText}>Post a RIDE</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Upcoming Drives</Text>
            {upcomingDrives.length > 0 ? (
              <FlatList
                data={upcomingDrives}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDetail}>{item.details}</Text>
                  </View>
                )}
              />
            ) : (
              <RideCard message="No upcoming drives available..." />
            )}
          </>
        ) : (
          <>
            <Text style={styles.message}>You are not yet eligible to be a driver.</Text>
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteDriverForm}>
              <Text style={styles.buttonText}>Complete Driver Form</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const RideCard = ({ message } : { message: string }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'grey',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: 'orange',
    fontWeight: 'bold',
  },
  card: {
    width: '100%',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  message: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
  },
  postButton: {
    backgroundColor: '#3498db',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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

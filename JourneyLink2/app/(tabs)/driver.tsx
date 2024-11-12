import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import { getDriverStatus, getUpcomingDrives, Drive } from '@/services/driverService';
import { useAuth } from '../../hooks/useAuth';

export default function DriverScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDriverEligible, setIsDriverEligible] = useState(false);
  const [upcomingDrives, setUpcomingDrives] = useState<Drive[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function checkDriverEligibility() {
      if (!user || !user.uid) {
        console.log("User not available, ending check early");
        setIsLoading(false);
        return;
      }
  
      console.log("Checking driver status for user:", user.uid);
      try {
        const eligible = await getDriverStatus(user.uid);
        console.log("Driver eligibility result:", eligible);
        setIsDriverEligible(eligible);
  
        if (eligible) {
          console.log("Fetching upcoming drives for user:", user.uid);
          const drives = await getUpcomingDrives(user.uid);
          console.log("Upcoming drives:", drives);
          setUpcomingDrives(drives);
        }
      } catch (error) {
        console.error("Error checking driver eligibility or fetching drives:", error);
      } finally {
        setIsLoading(false);
      }
    }
  
    if (user) {
      checkDriverEligibility();
    } else {
      console.log("User not authenticated");
      setIsLoading(false);
    }
  }, [user]);

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
    <View style={{ flex: 1 }}>
    <View style={styles.container}>
      {isDriverEligible ? (
        <>
          <TouchableOpacity style={styles.postButton} onPress={handlePostRide}>
            <Text style={styles.buttonText}>Post a RIDE</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Upcoming Drives</Text>
          {upcomingDrives.length > 0 ? (
            <FlatList
              contentContainerStyle={styles.scrollContainer}
              data={upcomingDrives}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                let departureDate = item.departureDate;

              // Check if the departureDate has the properties of a Firestore Timestamp
                if (departureDate && typeof departureDate === 'object' && 'seconds' in departureDate && 'nanoseconds' in departureDate) {
                  departureDate = new Date(departureDate.seconds * 1000).toLocaleString(); // Convert Firestore timestamp to human-readable date
                }
                return (
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>Ride to {item.endAddress}</Text>
                    <Text style={styles.cardDetail}>Cost per Rider: ${item.costPerRider}</Text>
                    <Text style={styles.cardDetail}>Departure: {departureDate}</Text>
                    <Text style={styles.cardDetail}>Seats Available: {item.seatsAvailable}</Text>
                    <Text style={styles.cardDetail}>Start Address: {item.startAddress}</Text>
                  </View>
                );
              }}
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
    </View>
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
  },
  container: {
    flex: 1,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginTop: 40,  // Add this line to provide space above the button
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


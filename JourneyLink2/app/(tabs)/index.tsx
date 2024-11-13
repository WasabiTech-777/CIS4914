import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { getUpcomingRides } from '@/services/riderService';
import { getDriverStatus, getUpcomingDrives, Drive } from '@/services/driverService';
import { Timestamp } from 'firebase/firestore';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDriverEligible, setIsDriverEligible] = useState(false);
  const [upcomingDrives, setUpcomingDrives] = useState<Drive[]>([]);
  const [upcomingRides, setUpcomingRides] = useState<Drive[]>([]);
  const { user } = useAuth();

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

    async function fetchUpcomingRides() {
      if (!user || !user.uid) {
        console.log("User not available, ending ride fetch early");
        setIsLoading(false);
        return;
      }
      try {
        console.log("Fetching upcoming rides for user:", user.uid);
        const rides = await getUpcomingRides(user.uid);
        console.log("Upcoming rides:", rides);
        setUpcomingRides(rides);
      } catch (error) {
        console.error("Error fetching upcoming rides:", error);
      }
    }
  
    if (user) {
      checkDriverEligibility();
      fetchUpcomingRides();
    } else {
      console.log("User not authenticated");
      setIsLoading(false);
    }
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {isDriverEligible && (
        <View style={styles.container}>
          <Text style={styles.title}>Upcoming Drives</Text>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : upcomingDrives.length > 0 ? (
            <FlatList
              data={upcomingDrives}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <RideCard ride={item} />}
            />
          ) : (
            <RideCard message="No upcoming drives found." />
          )}
        </View>
      )}

      <View style={styles.container}>
        <Text style={styles.title}>Upcoming Rides</Text>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : upcomingRides.length > 0 ? (
          <FlatList
            data={upcomingRides}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RideCard ride={item} />}
          />
        ) : (
          <RideCard message="No upcoming rides found. Book a Ride!!" />
        )}
      </View>
    </ScrollView>
  );
}

const RideCard = ({ ride, message }: { ride?: Drive; message?: string }) => {
  return (
    <View style={styles.card}>
      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <>
          <Text style={styles.cardTitle}>{`From: ${ride?.startAddress}`}</Text>
          <Text style={styles.cardTitle}>{`To: ${ride?.endAddress}`}</Text>
          <Text style={styles.cardDetail}>{`Cost per rider: $${ride?.costPerRider}`}</Text>
          <Text style={styles.cardDetail}>{`Departure Date: ${ride?.departureDate instanceof Timestamp ? ride?.departureDate.toDate().toLocaleString() : ride?.departureDate}`}</Text>
          <Text style={styles.cardDetail}>{`Seats Available: ${ride?.seatsAvailable}`}</Text>
        </>
      )}
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
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
});

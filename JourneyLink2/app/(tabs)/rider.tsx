import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth'; // Assuming this hook provides authentication context
import useRides from '../../hooks/useRides'; // Assuming this hook fetches ride data
import { Ride } from '../../hooks/useRides'; // Import the Ride interface
import { router } from 'expo-router';

export default function RiderScreen() {
  const { user } = useAuth(); // Get the user and loading state
  const userId = user ? user.uid : null; // Safely get the user ID

  // Use the useRides hook to fetch rides
  const { upcomingRides, previousRides, suggestedRides } = useRides(userId); 

  // Function to handle navigation to the Book Ride page
  const handleBookRide = () => {
    // Navigate to the ride-finding page (adjust this based on your navigation setup)
    router.push('/booking/findRide');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookRide}>
          <Text style={styles.buttonText}>Book a RIDE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Upcoming Rides</Text>
        {upcomingRides.length > 0 ? (
          upcomingRides.map((ride: Ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))
        ) : (
          <RideCard message="No upcoming rides available..." />
        )}
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Previous Rides</Text>
        {previousRides.length > 0 ? (
          previousRides.map((ride: Ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))
        ) : (
          <RideCard message="No previous rides available..." />
        )}
      </View>
    </ScrollView>
  );
}

const RideCard = ({ ride, message }: { ride?: Ride; message?: string }) => {
  return (
    <View style={styles.card}>
      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <>
          <Text>{ride?.address}</Text>
          <Text>{ride?.createdAt?.toString()}</Text>
          <Text>{ride?.distance} miles</Text>
          <Text>{ride?.duration} minutes</Text>
          <Text>${ride?.price}</Text>
          {/* Add more ride details as needed */}
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
  bookButton: {
    backgroundColor: '#3498db', // Blue background
    borderRadius: 25, // Circular shape
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    alignItems: 'center', // Center the text
  },
  buttonText: {
    color: 'white', // White text color
    fontWeight: 'bold', // Bold text
    fontSize: 16, // Font size
  },
});

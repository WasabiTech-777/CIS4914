import React from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import useRides from '../../hooks/useRides';
import { Ride } from '../../hooks/useRides'; // Import the Ride interface

export default function Home() {
  const { user } = useAuth(); // Destructure loading state if available
  const userId = user ? user.uid : "null"; // Safely get the user ID
  const { upcomingRides, previousRides, suggestedRides } = useRides(userId); // Pass userId to the hook

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Upcoming Rides</Text>
        {upcomingRides.length > 0 ? (
          upcomingRides.map((ride: Ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))
        ) : (
          <RideCard message="Upcoming rides will be displayed here..." />
        )}
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Previous Rides</Text>
        {previousRides.length > 0 ? (
          previousRides.map((ride: Ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))
        ) : (
          <RideCard message="Previous rides will be displayed here..." />
        )}
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Suggested Rides</Text>
        {suggestedRides.length > 0 ? (
          suggestedRides.map((ride: Ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))
        ) : (
          <RideCard message="Suggested rides will be displayed here..." />
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
          <Text>{ride?.title}</Text>
          <Text>{ride?.date?.toString()}</Text>
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
});

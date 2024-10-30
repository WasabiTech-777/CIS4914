import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSearchResults } from '../../hooks/useSearchResults'; // Assuming this hook fetches search results based on user's query
import { SearchResult } from '../../hooks/useSearchResults'; // Import the SearchResult interface
import { router } from 'expo-router';

export default function SearchResultsScreen() {
  // Use the useSearchResults hook to fetch search results
  const { searchResults } = useSearchResults();

  // Function to handle navigation back to the Find Ride page
  const handleFindRide = () => {
    // Navigate to the ride-finding page (adjust this based on your navigation setup)
    router.push('/booking/findRide');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.findRideButton} onPress={handleFindRide}>
          <Text style={styles.buttonText}>Find Another Ride</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Search Results</Text>
        {searchResults.length > 0 ? (
          searchResults.map((result: SearchResult) => (
            <RideCard key={result.id} result={result} />
          ))
        ) : (
          <RideCard message="No rides available for the selected route..." />
        )}
      </View>
    </ScrollView>
  );
}

const RideCard = ({ result, message }: { result?: SearchResult; message?: string }) => {
  return (
    <View style={styles.card}>
      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <>
          <Text style={styles.rideTitle}>{result?.title}</Text>
          <Text>Cost: ${result?.cost}</Text>
          <Text>Start Time: {result?.startTime?.toString()}</Text>
          <Text>End Time: {result?.endTime?.toString()}</Text>
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
  rideTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  findRideButton: {
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

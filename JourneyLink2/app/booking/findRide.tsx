import React, { useState, useEffect } from 'react';
import { View, Button, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import useRides from '../../hooks/useRides'; // Import the useRides hook
import { Ride } from '../../hooks/useRides'; // Import the Ride interface

export default function FindRidePage() {
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Use the useRides hook to fetch rides
  const { upcomingRides, loading, error } = useRides(null); // Pass null or appropriate userId if needed

  useEffect(() => {
    if (showPicker) {
      Alert.alert('Please select a time at least one hour in the future.');
    }
  }, [showPicker]);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    const currentDate = date || selectedDate;
    setShowPicker(false);
    if (currentDate >= new Date(Date.now() + 60 * 60 * 1000)) { // At least 1 hour in the future
      setSelectedDate(currentDate);
    } else {
      Alert.alert('Invalid Date', 'Please select a time at least one hour in the future.');
    }
  };

  const handleSearch = () => {
    if (!startingPoint || !destination) {
      Alert.alert('Missing Information', 'Please enter both a starting point and destination.');
      return [];
    }

    // Filter rides based on user input
    const filteredRides = upcomingRides.filter((ride: Ride) => 
      startingPoint === startingPoint &&
      destination === destination
    );

    return filteredRides;
  };

  const filteredRides = handleSearch();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Starting Point</Text>
      <GooglePlacesAutocomplete
        placeholder="Enter starting point"
        onPress={(data, details = null) => {
          setStartingPoint(data.description);
        }}
        query={{
          key: 'YOUR_GOOGLE_API_KEY',
          language: 'en',
        }}
        styles={{
          textInput: styles.input,
        }}
      />

      <Text style={styles.label}>Destination</Text>
      <GooglePlacesAutocomplete
        placeholder="Enter destination"
        onPress={(data, details = null) => {
          setDestination(data.description);
        }}
        query={{
          key: 'YOUR_GOOGLE_API_KEY',
          language: 'en',
        }}
        styles={{
          textInput: styles.input,
        }}
      />

      <Button title="Select Date & Time" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Button title="Search Rides" onPress={handleSearch} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}

      {filteredRides && filteredRides.length > 0 ? (
        <View style={styles.resultsContainer}>
          {filteredRides.map((ride) => (
            <View key={ride.id} style={styles.rideCard}>
              <Text>Address: {ride.address}</Text>
              <Text>Created At: {ride.createdAt.toLocaleString()}</Text>
              <Text>Status: {ride.status}</Text>
              <Text>Price: ${ride.price}</Text>
              <Text>Distance: {ride.distance} km</Text>
              <Text>Duration: {ride.duration} mins</Text>
            </View>
          ))}
        </View>
      ) : (
        !loading && <Text style={styles.noResults}>No rides found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginVertical: 16,
    textAlign: 'center',
  },
  resultsContainer: {
    marginTop: 16,
  },
  rideCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  noResults: {
    marginVertical: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

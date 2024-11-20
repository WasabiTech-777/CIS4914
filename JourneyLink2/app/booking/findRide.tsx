import React, { useState, useEffect } from 'react';
import { View, Button, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import useRides from '../../hooks/useRides'; // Import the useRides hook
import { Ride } from '../../hooks/useRides'; // Import the Ride interface

export default function FindRidePage() {
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { upcomingRides, loading, error } = useRides(null);

  const calculateDistance = async () => {
    if (!startingPoint || !destination) {
      Alert.alert('Missing Information', 'Please enter both a starting point and destination.');
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
          startingPoint
        )}&destinations=${encodeURIComponent(destination)}&key=AIzaSyAglgYN2wQodQMJIESUf12mOX6xAZLPSl0`
      );
      const data = await response.json();
      if (data.rows[0].elements[0].status === 'OK') {
        setDistance(data.rows[0].elements[0].distance.text);
        setDuration(data.rows[0].elements[0].duration.text);
      } else {
        Alert.alert('Error', 'Unable to calculate distance. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch distance data. Check your internet connection.');
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    const currentDate = date || selectedDate;
    setShowPicker(false);
  
    if (currentDate >= new Date(Date.now() + 60 * 60 * 1000)) {
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

    calculateDistance();

    const filteredRides = upcomingRides.filter(
      (ride: Ride) => ride.startLocation === startingPoint && ride.endLocation === destination
    );

    return filteredRides;
  };

  const handleBookRide = () => {
    Alert.alert(
      'Booking Confirmation',
      `Your ride from ${startingPoint} to ${destination} has been booked for ${selectedDate.toLocaleString()}. Distance: ${distance}, Duration: ${duration}`
    );
  };

  const filteredRides = handleSearch();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Starting Point</Text>
      <GooglePlacesAutocomplete
        placeholder="Enter starting point"
        onPress={(data, details = null) => setStartingPoint(data.description)}
        query={{
          key: 'AIzaSyAglgYN2wQodQMJIESUf12mOX6xAZLPSl0',
          language: 'en',
        }}
        styles={{
          textInput: styles.input,
        }}
      />

      <Text style={styles.label}>Destination</Text>
      <GooglePlacesAutocomplete
        placeholder="Enter destination"
        onPress={(data, details = null) => setDestination(data.description)}
        query={{
          key: 'AIzaSyAglgYN2wQodQMJIESUf12mOX6xAZLPSl0',
          language: 'en',
        }}
        styles={{
          textInput: styles.input,
        }}
      />

      <Button title="Calculate Distance" onPress={calculateDistance} />
      {distance && duration ? (
        <View style={styles.distanceInfo}>
          <Text>Distance: {distance}</Text>
          <Text>Duration: {duration}</Text>
        </View>
      ) : null}

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
      <Button title="Book Ride" onPress={handleBookRide} />

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
  distanceInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  noResults: {
    marginVertical: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { db, auth } from '../../../firebase/firebaseConfig'; // Adjust import based on your Firebase config file location
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, Timestamp, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { router } from 'expo-router';

export default function PostRide() {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [costPerRider, setCostPerRider] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [seatsAvailable, setSeatsAvailable] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const userId = auth.currentUser?.uid;

  const handlePostRide = async () => {
    if (!userId) {
      Alert.alert("Error", "User is not authenticated");
      return;
    }

    if (!startAddress || !endAddress || !costPerRider || !seatsAvailable) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (departureDate <= new Date()) {
      Alert.alert("Error", "Please select a future departure date and time.");
      return;
    }

    try {
      const rideRef = await addDoc(collection(db, 'rides'), {
        driverId: userId,
        startAddress,
        endAddress,
        costPerRider: parseFloat(costPerRider),
        departureDate: Timestamp.fromDate(departureDate),
        seatsAvailable: parseInt(seatsAvailable, 10),
        riders: [], // empty array for riders
        createdAt: Timestamp.now()
      });

      // Add the ride ID to the user's upcomingRides array
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        upcomingDrives: arrayUnion(rideRef.id)
      });

      Alert.alert("Success", "Ride posted successfully!");
      router.push('/(tabs)/driver');
    } catch (error) {
      console.error("Error posting ride: ", error);
      Alert.alert("Error", "Failed to post the ride. Please try again.");
    }
  };

const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || departureDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDepartureDate(currentDate);
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post a Ride</Text>
      
      <TextInput
        placeholder="Start Address"
        value={startAddress}
        onChangeText={setStartAddress}
        style={styles.input}
        placeholderTextColor="black"
      />
      
      <TextInput
        placeholder="End Address"
        value={endAddress}
        onChangeText={setEndAddress}
        style={styles.input}
        placeholderTextColor="black"
      />
      
      <TextInput
        placeholder="Cost per Rider"
        value={costPerRider}
        onChangeText={setCostPerRider}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="black"
      />
      
      <TextInput
        placeholder="Seats Available"
        value={seatsAvailable}
        onChangeText={setSeatsAvailable}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="black"
      />

      <View style={{ marginVertical: 8 }}>
      <TouchableOpacity style={styles.postButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Select Departure Date & Time</Text>
        </TouchableOpacity>
          {showDatePicker && (
          <DateTimePicker
            value={departureDate}
            mode="datetime"
            display="default"
            onChange={onDateChange}
            {...(Platform.OS === 'android' ? { is24Hour: true } : {})}
          />
        )}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handlePostRide}>
        <Text style={styles.nextButtonText}>Post Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  nextButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  postButton: {
    backgroundColor: '#3498db',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

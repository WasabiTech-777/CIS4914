import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function DriverForm() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [seats, setSeats] = useState('');
  const router = useRouter();

  const handleNext = () => {
    // Pass the vehicle details to the next page (can use params or store globally)
    router.push({
      pathname: '/auth/imageUpload/registration',
      params: { make, model, year, seats },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Vehicle Information</Text>

      <TextInput
        placeholder="Make"
        value={make}
        onChangeText={setMake}
        placeholderTextColor="black"
        style={styles.input}
      />

      <TextInput
        placeholder="Model"
        value={model}
        onChangeText={setModel}
        style={styles.input}
        placeholderTextColor="black"
      />

      <TextInput
        placeholder="Year"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="black"
      />

      <TextInput
        placeholder="Number of Seats"
        value={seats}
        onChangeText={setSeats}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="black"
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
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
});

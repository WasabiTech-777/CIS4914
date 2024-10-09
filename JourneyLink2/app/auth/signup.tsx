import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db } from '../../firebase/firebaseConfig'; // Import Firebase storage and db
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

// Your Driver Form component
export default function DriverForm() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [seats, setSeats] = useState('');
  const [registrationImage, setRegistrationImage] = useState<string | null>(null);
  const [insuranceImage, setInsuranceImage] = useState<string | null>(null);
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
    
  const pickImage = async (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setter(result.assets[0].uri); // Set the selected image URI
    }
  };

  // Helper function to upload images to Firebase Storage
  const uploadImageToStorage = async (uri: string, path: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, path); // Use Firebase storage reference
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef); // Return the download URL after uploading
  };

  // Submit the form data
  const handleSubmit = async () => {
    try {
      // Upload images to Firebase Storage and get URLs
      const registrationImageUrl = registrationImage
        ? await uploadImageToStorage(registrationImage, `drivers/registration_${Date.now()}.jpg`)
        : null;

      const insuranceImageUrl = insuranceImage
        ? await uploadImageToStorage(insuranceImage, `drivers/insurance_${Date.now()}.jpg`)
        : null;

      const licenseImageUrl = licenseImage
        ? await uploadImageToStorage(licenseImage, `drivers/license_${Date.now()}.jpg`)
        : null;

      // Firestore document ID (driverId)
      const driverId = 12345;

      // Save driver data to Firestore
      await setDoc(doc(db, 'drivers', driverId.toString()), {
        createdAt: Timestamp.fromDate(new Date('2024-09-05T11:57:06-04:00')),
        driverId,
        insuranceImage: insuranceImageUrl || '',
        licenseImage: licenseImageUrl || '',
        licenseNumber: 'abc',
        rating: 5,
        registrationImage: registrationImageUrl || '',
        totalTrips: 1,
        vehicle: `${make} ${model} ${year}`,
      });

      console.log('Driver data successfully submitted!');
    } catch (error) {
      console.error('Error submitting driver data:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enter Vehicle Information</Text>

      <TextInput
        placeholder="Make"
        value={make}
        onChangeText={setMake}
        style={styles.input}
      />

      <TextInput
        placeholder="Model"
        value={model}
        onChangeText={setModel}
        style={styles.input}
      />

      <TextInput
        placeholder="Year"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Number of Seats"
        value={seats}
        onChangeText={setSeats}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text>Upload Registration</Text>
      <TouchableOpacity style={styles.signupButton} onPress={() => pickImage(setRegistrationImage)}>
        <Text style={styles.signupButtonText}>Pick Registration Image</Text>
      </TouchableOpacity>
      {registrationImage && <Image source={{ uri: registrationImage }} style={{ width: 100, height: 100 }} />}

      <Text>Upload Insurance</Text>
      <TouchableOpacity style={styles.signupButton} onPress={() => pickImage(setInsuranceImage)}>
        <Text style={styles.signupButtonText}>Pick Insurance Image</Text>
      </TouchableOpacity>
      {insuranceImage && <Image source={{ uri: insuranceImage }} style={{ width: 100, height: 100 }} />}

      <Text>Upload Driver's License</Text>
      <TouchableOpacity style={styles.signupButton} onPress={() => pickImage(setLicenseImage)}>
        <Text style={styles.signupButtonText}>Pick License Image</Text>
      </TouchableOpacity>
      {licenseImage && <Image source={{ uri: licenseImage }} style={{ width: 100, height: 100 }} />}

      <TouchableOpacity style={styles.signupButton} onPress={handleSubmit}>
        <Text style={styles.signupButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Add styles for the Driver Form
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'grey',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'orange',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  signupButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    borderColor: '#3498db',
    borderWidth: 2,
  },
  loginButtonText: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

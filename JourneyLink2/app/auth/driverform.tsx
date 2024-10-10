import React, { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db } from '../../firebase/firebaseConfig'; // Import Firebase storage and db
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import { useRouter } from 'expo-router';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

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

  const uploadImageToStorage = async (uri: string, path: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, path); // Use Firebase storage reference
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef); // Return the download URL after uploading
  };

  const handleSubmit = async () => {
    const auth = getAuth(); // Get the currently logged-in user
    const user = auth.currentUser; // Retrieve the current user
    const router = useRouter(); // For redirecting after submission
  
    if (!user) {
      console.error('No user is currently logged in');
      return;
    }
  
    const driverId = user.uid; // Use the user's UID as the driverId
  
    try {
      const registrationImageUrl = registrationImage
        ? await uploadImageToStorage(registrationImage, `drivers/registration_${Date.now()}.jpg`)
        : null;
  
      const insuranceImageUrl = insuranceImage
        ? await uploadImageToStorage(insuranceImage, `drivers/insurance_${Date.now()}.jpg`)
        : null;
  
      const licenseImageUrl = licenseImage
        ? await uploadImageToStorage(licenseImage, `drivers/license_${Date.now()}.jpg`)
        : null;
  
      await setDoc(doc(db, 'drivers', driverId), {
        createdAt: Timestamp.now(),
        driverId,
        insuranceImage: insuranceImageUrl || '',
        licenseImage: licenseImageUrl || '',
        licenseNumber: 'abc', // Replace with actual licenseNumber input from the form
        rating: 5,
        registrationImage: registrationImageUrl || '',
        totalTrips: 1,
        vehicle: `${make} ${model} ${year}`,
      });
  
      await setDoc(
        doc(db, 'users', driverId),
        { driverCheck: true },
        { merge: true } // Merge with existing fields
      );
  
      router.replace('/(tabs)/driver');
  
      console.log('Driver data successfully submitted!');
    } catch (error) {
      console.error('Error submitting driver data:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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
        {registrationImage && <Image source={{ uri: registrationImage }} style={styles.image} />}

        <Text>Upload Insurance</Text>
        <TouchableOpacity style={styles.signupButton} onPress={() => pickImage(setInsuranceImage)}>
          <Text style={styles.signupButtonText}>Pick Insurance Image</Text>
        </TouchableOpacity>
        {insuranceImage && <Image source={{ uri: insuranceImage }} style={styles.image} />}

        <Text>Upload Driver's License</Text>
        <TouchableOpacity style={styles.signupButton} onPress={() => pickImage(setLicenseImage)}>
          <Text style={styles.signupButtonText}>Pick License Image</Text>
        </TouchableOpacity>
        {licenseImage && <Image source={{ uri: licenseImage }} style={styles.image} />}

        <TouchableOpacity style={styles.signupButton} onPress={handleSubmit}>
          <Text style={styles.signupButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Updated styles for the Driver Form
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'grey',  // Keep the same background color as before
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
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
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

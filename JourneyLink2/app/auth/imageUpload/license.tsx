import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { uploadImageToStorage } from './uploadHelper';
import { db } from '../../../firebase/firebaseConfig'; // Import Firebase Firestore
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../../../hooks/useAuth';

export default function LicenseUpload() {
  const {user} = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { make, model, year, seats, registrationImageUrl, insuranceImageUrl } = useLocalSearchParams();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (image) {
      setUploading(true);
      try {
        if (user) {
          const imageUrl = await uploadImageToStorage(image, 'license', user.uid);
          console.log('License image uploaded:', imageUrl);
          const driverId = user.uid;

          // Submit all data to Firestore
          await setDoc(doc(db, 'drivers', driverId), {
            createdAt: Timestamp.now(),
            driverId,
            vehicle: `${make} ${model} ${year}`,
            seats: seats,
            registrationImage: registrationImageUrl,
            insuranceImage: insuranceImageUrl,
            licenseImage: imageUrl,
          });

          console.log('Driver data successfully submitted to Firestore');
          const userRef = doc(db, 'users', driverId);
          await setDoc(userRef, { driverCheck: true }, { merge: true });
          console.log('driverCheck attribute set to true in users collection');
          // Navigate back to driver dashboard
          router.replace('/(tabs)/driver');
        } else {
          console.error('No user logged in');
        }
      } catch (error) {
        console.error('Error submitting driver data:', error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please select an image');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Driver's License</Text>
      <Text style={styles.description}>
        Please upload an image of your driver's license.
      </Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Pick Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
        <Text style={styles.submitButtonText}>{uploading ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles (same as before)
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'grey',
      justifyContent: 'center',
      padding: 20,
    },
    uploadButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignItems: 'center',
      },
      uploadButtonText: {
        color: '#fff',
        fontSize: 18,
      },
    title: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    submitButton: {
      backgroundColor: '#3498db',
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 25,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 18,
    },
    image: {
      width: 100,
      height: 100,
      marginVertical: 20,
    },
    nextButton: {
      backgroundColor: '#2ecc71',
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

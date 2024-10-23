import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { uploadImageToStorage } from './uploadHelper';
import { db } from '../../../firebase/firebaseConfig'; // Import Firebase Firestore
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function LicenseUpload() {
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
        const licenseImageUrl = await uploadImageToStorage(image, `drivers/license_${Date.now()}.jpg`);
        console.log('License image uploaded:', licenseImageUrl);

        // Get the current authenticated user
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const driverId = user.uid;

          // Submit all data to Firestore
          await setDoc(doc(db, 'drivers', driverId), {
            createdAt: Timestamp.now(),
            driverId,
            vehicle: `${make} ${model} ${year}`,
            seats: seats,
            registrationImage: registrationImageUrl,
            insuranceImage: insuranceImageUrl,
            licenseImage: licenseImageUrl,
          });

          console.log('Driver data successfully submitted to Firestore');
          
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

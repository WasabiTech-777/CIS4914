import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { uploadImageToStorage } from './uploadHelper'; // Helper function for image upload

export default function RegistrationUpload() {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { make, model, year, seats } = useLocalSearchParams();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri); // Set the image URI
    }
  };

  const handleNext = async () => {
    if (image) {
      setUploading(true);
      try {
        if (user) {
          const imageUrl = await uploadImageToStorage(image, 'registration', user.uid);
          console.log('Registration image uploaded:', imageUrl);
        
        // Navigate to the insurance page, passing along the image URL
          router.push({
            pathname: '/auth/imageUpload/insurance',
            params: { make, model, year, seats, registrationImageUrl: imageUrl },
          }); 
        }
      } catch (error) {
        console.error('Error uploading registration image:', error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please select an image');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Registration Image</Text>
      <Text style={styles.description}>
        Please upload an image of your vehicle registration.
      </Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Pick Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={uploading}>
        <Text style={styles.nextButtonText}>{uploading ? 'Uploading...' : 'Next'}</Text>
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

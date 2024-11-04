import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseConfig';

export const uploadImageToStorage = async (uri: string, folder: string, userId: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Constructing a dynamic path with the specified folder
    console.log('Uploading image to Firebase Storage:', folder, userId);
    const path = `${folder}/${userId}/${Date.now()}.jpg`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    throw error;
  }
};

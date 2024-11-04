import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseConfig'; // Adjust the path as necessary

export const uploadImageToStorage = async (uri: string, path: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  const storageRef = ref(storage, path); // Firebase storage reference
  await uploadBytes(storageRef, blob);
  
  return getDownloadURL(storageRef); // Return the download URL after uploading
};



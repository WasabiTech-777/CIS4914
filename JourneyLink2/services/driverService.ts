import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';  // Adjust the path as needed

export async function getDriverStatus() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User is not logged in');
    }

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const { driverCheck } = userDoc.data();
      return driverCheck === true;
    } else {
      console.error('No such document!');
      return false;
    }
  } catch (error) {
    console.error('Error fetching driver status:', error);
    return false;
  }
}

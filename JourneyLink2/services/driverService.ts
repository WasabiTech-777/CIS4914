import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';  // Adjust the path as needed

export async function getDriverStatus() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User is not logged in');
    }

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    console.log('User ID:', user.uid);

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
export async function getUpcomingDrives() {
  try {
    // Simulate hardcoded upcoming drives
    return [
      {
        id: '1',
        title: 'Drive to Downtown',
        details: 'Departure: 10:00 AM, Destination: Downtown',
      },
      {
        id: '2',
        title: 'Airport Pickup',
        details: 'Departure: 2:00 PM, Destination: Airport',
      },
    ];
  } catch (error) {
    console.error('Error fetching upcoming drives:', error);
    return [];
  }
}

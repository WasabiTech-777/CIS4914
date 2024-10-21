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
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User is not logged in');
    }

    const ridesCollectionRef = collection(db, 'rides');
    const q = query(ridesCollectionRef, where('driverID', '==', user.uid));
    const querySnapshot = await getDocs(q);

    const upcomingDrives = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return upcomingDrives;
  } catch (error) {
    console.error('Error fetching upcoming drives:', error);
    return [];
  }
}

import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';  // Adjust the path as needed
import { Timestamp } from 'firebase/firestore';
import { Drive } from '@/services/driverService';

export async function getUpcomingRides(userId: string): Promise<Drive[]> {
  try {
    if (!userId) {
      throw new Error('User ID is not provided');
    }

    // Step 1: Get upcoming ride IDs from the 'users' collection
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const { upcomingRides } = userDoc.data();
      if (upcomingRides && upcomingRides.length > 0) {
        // Step 2: Fetch ride documents from the 'rides' collection
        const ridesCollectionRef = collection(db, "rides");
        const ridesQuery = query(ridesCollectionRef, where("__name__", "in", upcomingRides));
        const ridesSnapshot = await getDocs(ridesQuery);

        // Step 3: Map the documents to the upcomingDrives array
        const ridesData = ridesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Drive[];

        return ridesData;
      } else {
        console.log("No upcoming rides found.");
        return [];
      }
    } else {
      console.error("User document does not exist.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching upcoming drives:", error);
    return [];
  }
};
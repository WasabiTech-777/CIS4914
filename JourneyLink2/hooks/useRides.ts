// src/hooks/useRides.ts
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define the Ride interface
export interface Ride {
  id: string;
  title: string; // Adjust properties as needed
  date: Date;
  userId: string;
}

// Hook to fetch rides
const useRides = (userId: string | null) => {
  const [upcomingRides, setUpcomingRides] = useState<Ride[]>([]);
  const [previousRides, setPreviousRides] = useState<Ride[]>([]);
  const [suggestedRides, setSuggestedRides] = useState<Ride[]>([]);

  useEffect(() => {
    const fetchRides = async () => {
      if (!userId) return; // Exit if no userId

      try {
        // Fetch upcoming rides
        const upcomingQuery = query(
          collection(db, 'rides'),
          where('driverId', '==', userId),
          where('date', '>=', new Date())
        );
        const upcomingSnapshot = await getDocs(upcomingQuery);
        setUpcomingRides(upcomingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride)));

        // Fetch previous rides
        const previousQuery = query(
          collection(db, 'rides'),
          where('userId', '==', userId),
          where('date', '<', new Date())
        );
        const previousSnapshot = await getDocs(previousQuery);
        setPreviousRides(previousSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride)));

        // Fetch suggested rides based on drives
        const suggestedSnapshot = await getDocs(collection(db, 'drives'));
        setSuggestedRides(suggestedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride)));
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, [userId]);

  return { upcomingRides, previousRides, suggestedRides }; // Ensure you are returning these properly
};

export default useRides; // Make sure this is a default export

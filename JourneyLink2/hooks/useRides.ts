// src/hooks/useRides.ts
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

// Define the Ride interface
export interface Ride {
  id: string;
  address: string;
  completedAt: Date | null;
  createdAt: Date;
  distance: number;
  driverRating: number | null;
  duration: number;
  latitude: number;
  longitude: number;
  price: number;
  riderRating: number | null;
  status: string;
}

// Hook to fetch rides
const useRides = (userId: string | null) => {
  const [upcomingRides, setUpcomingRides] = useState<Ride[]>([]);
  const [previousRides, setPreviousRides] = useState<Ride[]>([]);
  const [suggestedRides, setSuggestedRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRides = async () => {
      if (!userId) {
        setLoading(false);
        return; // Exit if no userId
      }

      try {
        // Helper function to fetch ride details
        const fetchRideDetails = async (rideDocId: string) => {
          const rideDocRef = doc(db, 'rides', rideDocId, 'pickupLocation', rideDocId);
          const rideDocSnap = await getDoc(rideDocRef);
          if (rideDocSnap.exists()) {
            return { id: rideDocId, ...rideDocSnap.data() } as Ride;
          }
          return null;
        };

        // Fetch upcoming rides
        const upcomingQuery = query(
          collection(db, 'rides'),
          where('userId', '==', userId),
          where('date', '>=', new Date())
        );
        const upcomingSnapshot = await getDocs(upcomingQuery);
        const upcomingRidesData = await Promise.all(
          upcomingSnapshot.docs.map(async (doc) => {
            return await fetchRideDetails(doc.id);
          })
        );
        setUpcomingRides(upcomingRidesData.filter((ride) => ride !== null) as Ride[]);

        // Fetch previous rides
        const previousQuery = query(
          collection(db, 'rides'),
          where('userId', '==', userId),
          where('date', '<', new Date())
        );
        const previousSnapshot = await getDocs(previousQuery);
        const previousRidesData = await Promise.all(
          previousSnapshot.docs.map(async (doc) => {
            return await fetchRideDetails(doc.id);
          })
        );
        setPreviousRides(previousRidesData.filter((ride) => ride !== null) as Ride[]);

        // Fetch suggested rides based on drives
        const suggestedSnapshot = await getDocs(collection(db, 'drives'));
        const suggestedRidesData = await Promise.all(
          suggestedSnapshot.docs.map(async (doc) => {
            return await fetchRideDetails(doc.id);
          })
        );
        setSuggestedRides(suggestedRidesData.filter((ride) => ride !== null) as Ride[]);

        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching rides:", error);
        setError("Failed to load rides.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [userId]);

  return { upcomingRides, previousRides, suggestedRides, loading, error };
};

export default useRides;

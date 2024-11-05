// src/hooks/useSearchResults.ts
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

// Hook to fetch search results
const useSearchResults = (searchCriteria: any) => {
  const [searchResults, setSearchResults] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // Construct the query based on search criteria
        const searchQuery = query(
          collection(db, 'rides'),
          where('status', '==', searchCriteria.status) // Example criteria
          // Add more criteria as needed
        );

        const searchSnapshot = await getDocs(searchQuery);
        const searchResultsData = await Promise.all(
          searchSnapshot.docs.map(async (rideDoc) => {
            const rideDocRef = doc(db, 'rides', rideDoc.id, 'pickupLocation', rideDoc.id);
            const rideDocSnap = await getDoc(rideDocRef);
            if (rideDocSnap.exists()) {
              const rideData = rideDocSnap.data();
              return { id: rideDoc.id, ...rideData } as Ride;
            }
            return null;
          })
        );

        setSearchResults(searchResultsData.filter((ride) => ride !== null) as Ride[]);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to load search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchCriteria]);

  return { searchResults, loading, error };
};

export default useSearchResults;

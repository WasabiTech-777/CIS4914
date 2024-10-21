import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Query Firestore for user's data
import { db } from '../../firebase/firebaseConfig';
import { useAuth } from '../../hooks/useAuth'; // Import the useAuth hook

// Static placeholder data
const placeholderDrives = [
  { id: '1', date: '2023-09-10', location: 'New York to Boston', duration: '4 hrs' },
  { id: '2', date: '2023-08-21', location: 'Los Angeles to San Francisco', duration: '6 hrs' },
];

const placeholderRides = [
  { id: '1', date: '2023-09-08', location: 'Chicago to Detroit', duration: '5 hrs' },
  { id: '2', date: '2023-08-19', location: 'Miami to Orlando', duration: '4 hrs' },
];

const placeholderReviews = [
  { id: '1', user: 'Alex Johnson', comment: 'Amazing ride, very comfortable!', rating: 5 },
  { id: '2', user: 'Sara Williams', comment: 'Smooth driving and arrived on time.', rating: 4 },
];

const AccountScreen = () => {
  const { user } = useAuth(); // Use the useAuth hook to get the authenticated user
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [firestoreUserData, setFirestoreUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        console.log('User object:', user); // Log the entire user object
        console.log('User UID:', user.uid); // Log the user's UID

        try {
          // Query Firestore to find a document where 'uid' matches the logged-in user's UID
          const q = query(collection(db, 'users'), where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              console.log('Firestore user data:', userData); // Log the fetched user data
              setFirestoreUserData(userData);

              // Log profile image or fallback
              if (userData.profileImage) {
                console.log('Profile image URL:', userData.profileImage);
              } else {
                console.log('No profile image found, using fallback image.');
              }

              setMessage('User data loaded successfully!');
            });
          } else {
            setMessage('No user data found.');
            console.log('No user data found for UID:', user.uid);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setMessage('Failed to load user data.');
        } finally {
          setLoading(false);
        }
      } else {
        setMessage('User not signed in.');
        console.log('No user is signed in.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]); // Depend on `user` to fetch data only when the user is logged in

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
    <Image
      source={{ uri: firestoreUserData?.profileImage || 'https://your-profile-image-url.com' }} // Use user's profile image if available
      style={styles.profilePicture}
    />
    <Text style={styles.name}>
      {firestoreUserData?.firstName && firestoreUserData?.lastName 
        ? `${firestoreUserData.firstName} ${firestoreUserData.lastName}` 
        : 'Guest'}
    </Text>
  
    {firestoreUserData?.email && (
      <Text style={styles.detailsText}>Email: {String(firestoreUserData.email)}</Text> // Ensure email is a string
    )}
    {firestoreUserData?.phoneNumber && (
      <Text style={styles.detailsText}>Phone: {String(firestoreUserData.phoneNumber)}</Text> // Ensure phoneNumber is a string
    )}
  
    <View style={styles.starContainer}>
      {[...Array(5)].map((_, i) => (
        <FontAwesome key={i} name="star" size={24} color="gold" />
      ))}
    </View>
  </View>

      <Text>{String(message)}</Text>

      {/* Drive History */}
      <Text style={styles.sectionTitle}>Drive History</Text>
      <FlatList
        data={placeholderDrives}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.date}</Text>
            <Text style={styles.cardText}>{item.location}</Text>
            <Text style={styles.cardText}>Duration: {item.duration}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardContainer}
      />

      {/* Ride History */}
      <Text style={styles.sectionTitle}>Ride History</Text>
      <FlatList
        data={placeholderRides}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.date}</Text>
            <Text style={styles.cardText}>{item.location}</Text>
            <Text style={styles.cardText}>Duration: {item.duration}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardContainer}
      />

      {/* Reviews */}
      <Text style={styles.sectionTitle}>Reviews</Text>
      <FlatList
        data={placeholderReviews}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.user}</Text>
            <Text style={styles.cardText}>{item.comment}</Text>
            <View style={styles.starContainer}>
              {[...Array(item.rating)].map((_, i) => (
                <FontAwesome key={i} name="star" size={16} color="gold" />
              ))}
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  starContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 200,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default AccountScreen;

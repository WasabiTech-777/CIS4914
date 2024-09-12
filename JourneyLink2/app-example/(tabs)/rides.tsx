import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, ListRenderItem } from 'react-native';

interface Ride {
  id: string;
  destination: string;
  date: string;
  time: string;
}

const upcomingRides: Ride[] = [
  { id: '1', destination: 'Central Park', date: '2024-09-10', time: '10:00 AM' },
  { id: '2', destination: 'Times Square', date: '2024-09-12', time: '2:00 PM' },
  // Add more rides here
];

export default function TabThreeScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    // Implement search logic here
    console.log(`Searching for: ${searchQuery}`);
  };

  const renderItem: ListRenderItem<Ride> = ({ item }) => (
    <View style={styles.rideItem}>
      <Text style={styles.destination}>{item.destination}</Text>
      <Text style={styles.dateTime}>{item.date} at {item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Rides</Text>
      <FlatList
        data={upcomingRides}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.list}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search for new rides"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    marginBottom: 20,
  },
  rideItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  destination: {
    fontSize: 18,
    fontWeight: '500',
  },
  dateTime: {
    fontSize: 16,
    color: '#666',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

import { View, Text, StyleSheet } from 'react-native';

export default function RiderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

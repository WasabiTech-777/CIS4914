import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useNavigation } from '@react-navigation/native';
import { getSavedPaymentMethods } from '../services/paymentService';

const PaymentPage = () => {
  const navigation = useNavigation();
  const [cardDetails, setCardDetails] = useState(null);
  const [savedMethods, setSavedMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    const fetchSavedMethods = async () => {
      const methods = await getSavedPaymentMethods();
      setSavedMethods(methods);
    };
    fetchSavedMethods();
  }, []);

  const handleNext = () => {
    if (selectedMethod || cardDetails?.complete) {
      navigation.navigate('TransactionDetails', {
        selectedMethod,
        cardDetails,
      });
    } else {
      alert('Please complete the card details or select a payment method.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Payment Method</Text>
      <FlatList
        data={savedMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedMethod?.id === item.id && styles.selectedMethod,
            ]}
            onPress={() => setSelectedMethod(item)}
          >
            <Text>{item.card.brand} ending in {item.card.last4}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.orText}>Or add a new card</Text>
      <CardField
        postalCodeEnabled={true}
        placeholders={{ number: '4242 4242 4242 4242' }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
      />
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentMethod: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedMethod: {
    borderColor: '#007AFF',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#efefef',
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentPage;

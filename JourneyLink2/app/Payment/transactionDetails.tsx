import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useNavigation } from '@react-navigation/native';
import { savePaymentMethod, processPayment } from '../services/paymentService';

const TransactionDetails = ({ route }) => {
  const { selectedMethod, cardDetails } = route.params;
  const { confirmPayment } = useStripe();
  const navigation = useNavigation();

  const handlePay = async () => {
    if (selectedMethod) {
      // Use a saved payment method
      processPayment(selectedMethod.id);
    } else if (cardDetails?.complete) {
      // Use a new card
      const { paymentMethod } = await confirmPayment('client_secret_from_backend', {
        type: 'Card',
        billingDetails: {},
      });
      if (paymentMethod) {
        await savePaymentMethod(paymentMethod);
        processPayment(paymentMethod.id);
      }
    } else {
      alert('Please complete the card details or select a payment method.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction Details</Text>
      <Text style={styles.detailsText}>Amount: $50.00</Text>
      {selectedMethod && (
        <Text style={styles.detailsText}>Using: {selectedMethod.card.brand} ending in {selectedMethod.card.last4}</Text>
      )}
      {!selectedMethod && cardDetails && (
        <Text style={styles.detailsText}>Using new card details</Text>
      )}
      <TouchableOpacity style={styles.payButton} onPress={handlePay}>
        <Text style={styles.payButtonText}>Pay Now</Text>
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
  detailsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TransactionDetails;

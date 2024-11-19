import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs, Timestamp, updateDoc, arrayUnion, addDoc } from 'firebase/firestore';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { auth, db, storage } from '@/firebase/firebaseConfig';

const PaymentPage = ({ senderId, receiverId, amount }: { senderId: string; receiverId: string; amount: number }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isLoading, setIsLoading] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');

  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const { savedPaymentMethods } = userDoc.data();
            if (savedPaymentMethods) {
              setSavedCards(savedPaymentMethods);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching saved cards: ', error);
      }
    };

    fetchSavedCards();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const stripeSecretKey = 'sk_test_YOUR_SECRET_KEY'; // Replace with your actual Stripe Secret Key
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: (amount * 100).toString(), // Stripe expects amount in cents
          currency: 'usd',
        }).toString(),
      });
      const responseData = await response.json();
      return responseData.client_secret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return null;
    }
  };

  const saveCardToUser = async (paymentMethodId: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            savedPaymentMethods: arrayUnion(paymentMethodId),
        });
      }
    } catch (error) {
      console.error('Error saving card to user: ', error);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Create payment intent using Stripe API
      const clientSecret = await createPaymentIntent();
      if (!clientSecret) {
        setIsLoading(false);
        return;
      }

      // Initialize Payment Sheet
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Your App Name',
      });

      if (error) {
        console.error('Error initializing payment sheet: ', error);
        setIsLoading(false);
        return;
      }

      // Present Payment Sheet to user
      const { error: paymentSheetError } = await presentPaymentSheet();

      if (paymentSheetError) {
        console.error('Error presenting payment sheet: ', paymentSheetError);
      } else {
        // Update payment record
        const payRef = await addDoc(collection(db, 'payments'), {
          senderId: senderId,
          receiverId: receiverId,
          amount: amount,
          timestamp: new Date(),
        });
        alert('Payment Successful!');
      }
    } catch (e) {
      console.error('Error in payment process: ', e);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {savedCards.length > 0 && (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Saved Card:</Text>
          <Picker
            selectedValue={selectedCard}
            onValueChange={(itemValue) => setSelectedCard(itemValue)}
          >
            <Picker.Item label="Select a card" value="" />
            {savedCards.map((card: string, index) => (
            <Picker.Item key={index} label={`Card ending in ${card.slice(-4)}`} value={card} />
            ))}
          </Picker>
        </View>
      )}

      {selectedCard === '' && (
        <>
          <Text style={styles.label}>Enter Card Details:</Text>
          <CardField
            postalCodeEnabled={true}
            style={styles.cardField}
            onCardChange={(cardDetails) => {
              console.log(cardDetails);
            }}
          />
        </>
      )}
      <Button
        title="Pay"
        onPress={handlePayment}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  pickerContainer: {
    marginBottom: 16,
  },
});

export default PaymentPage;

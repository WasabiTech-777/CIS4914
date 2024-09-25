import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';  // Import Firebase auth functions
import { auth } from '../firebase/firebaseConfig'; 

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  // Function to validate the password
  const validatePassword = (password: string) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const lowerCaseRegex = /[a-z]/;
    const upperCaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const minLength = password.length >= 8;

    return (
      specialCharRegex.test(password) &&
      lowerCaseRegex.test(password) &&
      upperCaseRegex.test(password) &&
      numberRegex.test(password) &&
      minLength
    );
  };

  async function handleSignup(){
    // Check if the passwords match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    // Check if the password meets the criteria
    if (!validatePassword(password)) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 8 characters long and include a special character, a lowercase letter, an uppercase letter, and a number."
      );
      return;
    }

    // Proceed with signup logic if everything is valid
    console.log({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      referenceCode,
    });

    // You can now proceed with the signup logic (e.g., send data to backend)
    try {
      // Proceed with Firebase signup
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user){
        await sendEmailVerification(user);
        router.push('./verify');
      }
      // If signup is successful, navigate to the /(tabs) route
    } catch (error) {
      // Handle signup error (e.g., email already in use)
      Alert.alert("Signup Error", "Email is already in use. Please try again.");
    }
  };
  const handleLogin = () => {
    router.push('./login'); // Navigate to the signup page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up for JourneyLink</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="University Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Reference Code (Optional)"
        value={referenceCode}
        onChangeText={setReferenceCode}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'grey',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'orange',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  signupButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    borderColor: '#3498db',
    borderWidth: 2,
  },
  loginButtonText: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

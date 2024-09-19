import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';  // Import Firebase auth functions
import { auth } from '../firebase/firebaseConfig';  // Import Firebase auth instance

export default function LoginScreen() {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });
  const router = useRouter();

  // Handle login using Firebase Authentication
  async function handleLogin() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      Alert.alert("Error", "Email and password are mandatory.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);
      // If login is successful, navigate to the /(tabs) route
      router.push('/(tabs)');
    } catch (error) {
      // Handle login error (e.g., incorrect email or password)
      Alert.alert("Login Error", "Email or password not recognized. Please try again.");
    }
  }

  const handleSignup = () => {
    router.push('/auth/signup'); // Navigate to the signup page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Into JourneyLink</Text>

      <TextInput
        style={styles.input}
        placeholder="University Email"
        value={value.email}
        onChangeText={(text) => setValue({ ...value, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={value.password}
        onChangeText={(text) => setValue({ ...value, password: text })}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Custom Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Custom Signup Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
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
  loginButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
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
  signupButtonText: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

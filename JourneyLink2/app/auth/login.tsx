import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Logic for login can be added here
    console.log('Login clicked with email:', email);
  };

  const handleSignup = () => {
    router.push('./signup'); // Navigate to the signup page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Into JourneyLink</Text>

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
    borderRadius: 5,  // Rounded edges for input
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,  // Rounded edges for the button
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
    backgroundColor: '#fff',  // White background for the sign-up button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,  // Rounded edges for the button
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    borderColor: '#3498db',  // Blue border
    borderWidth: 2,
  },
  signupButtonText: {
    color: '#3498db',  // Blue text for the sign-up button
    fontSize: 18,
    fontWeight: 'bold',
  },
});

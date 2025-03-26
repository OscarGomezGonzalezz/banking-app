// app/screens/register.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from "../services/authService";
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state to show a loading indicator while submitting
  const [error, setError] = useState('');
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  // Clear token when the page loads
  useEffect(() => {
    const removeToken = async () => {
      try {
        await SecureStore.deleteItemAsync('token'); // Securely remove token
        console.log('Token removed');
      } catch (error) {
        console.error('Error removing token', error);
      }
    };

    removeToken(); // Call the function to remove the token

  }, []); // Empty dependency array ensures it runs only once, on mount

  // Storing a token
  const storeToken = async (token) => {
    try {
      await SecureStore.setItemAsync('token', token); // Securely store the token
      console.log('Token stored');
    } catch (error) {
      console.error('Error storing token', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

     if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return
    }
     // Check if passwords match
     if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true); // Set loading to true while the request is being made
    console.log('Registering with:', email, password);

    try {
      const data = await registerUser(email, password);
      storeToken(data.token);
      console.log("token", data.token);
      router.push('/index');
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
      }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm your Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Text>
      {error ? <Text style={styles.errorText}>{error}</Text> :  null}
      </Text>
      <Button title={loading ? 'Registering...' : 'Register'} onPress={handleRegister} disabled={loading} />
      <Toast visible={showToast} message="Successful registration!" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

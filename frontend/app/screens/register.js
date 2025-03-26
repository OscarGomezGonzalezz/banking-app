// app/screens/register.js
import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state to show a loading indicator while submitting
  const [error, setError] = useState('');
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const handleRegister = async () => {
    if(!email || !password){
      setError('Please fill all fields')
      return;// Prevent submitting the form if fields are empty
    }
    setError(''); // Clear any previous errors


    setLoading(true); // Set loading to true while the request is being made
    console.log('Registering with:', email, password);

    try{
      const response = await fetch('http://localhost:3500/api/auth/register',{
        method:"POST",
        headers:{
          "Content-type": "application/json"
        },
        body: JSON.stringify({ username: email, password })
      })
      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        setError("Registration failed");
      } else {
        console.log("Succesful registration");
        setShowToast(true)
        // Show a success toast
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Registration Successful',
          text2: 'You have successfully registered!',
        });

        // Optionally, navigate to the home screen after the toast
        router.push('/screens/index');

      }
    }catch(error){
      console.error('Error:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
    router.push('/screens/index'); // Navigate back to the home screen after registration
  };

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

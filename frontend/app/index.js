import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/screens/login');
  };

  const goToRegister = () => {
    router.push('/screens/register');
  };

  const goToHome = () => {
    router.push('/screens/home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BankApp</Text>
      <Button title="Login" onPress={goToLogin} />
      <Button title="Register" onPress={goToRegister} />
      <Button title="Home" onPress={goToHome} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

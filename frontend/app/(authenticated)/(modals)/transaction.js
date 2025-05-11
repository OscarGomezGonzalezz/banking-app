import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-react'; 
import { useRouter } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import db from '../../../firebase/firebaseConfig';
import { CustomButton } from '../../index';
import Colors from '../../../constants/Colors';

const CreateTransaction = () => {
  const { user } = useUser();
  const router = useRouter();
  const userId = user.id;
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [methodOfPayment, setMethodOfPayment] = useState('Credit Card');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!amount || !description || !methodOfPayment) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "users", userId, "transactions"), {
        amount: parseFloat(amount),
        description,
        methodOfPayment,
        date: Timestamp.now(),
      });

      Alert.alert('Success', 'Transaction saved successfully.');
      router.replace('/screens/(authenticated)/(tabs)/wallet');
    } catch (error) {
      console.error("Error saving transaction:", error);
      Alert.alert('Error', 'There was a problem saving the transaction.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Transaction</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={styles.input}
          placeholder="Method of payment (e.g. Credit Card)"
          value={methodOfPayment}
          onChangeText={setMethodOfPayment}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.footer}>
        <CustomButton title="Save Transaction" onPress={handleSubmit} isRegister />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    marginTop: 50,
    marginBottom: 20,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  form: {
    marginVertical: 20,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 16,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 10,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CreateTransaction;

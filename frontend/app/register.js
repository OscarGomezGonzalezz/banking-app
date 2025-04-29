import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSignUp, isClerkAPIResponseError } from "@clerk/clerk-expo";
import Colors from '../constants/Colors';
import { CustomButton } from './index';

export default function Register() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState("+34");
  const [error, setError] = useState('');
  const router = useRouter();
  const { signUp } = useSignUp();

  const onSignUp = async () => {

     const fullPhoneNumber = `${countryCode}${phoneNumber}`
     try {
       await signUp.create({
         phoneNumber: fullPhoneNumber
       });
       signUp.preparePhoneNumberVerification();
       //router.push('screens/auth/[phone]')
       router.navigate(`/auth/${fullPhoneNumber}/${true}`);
   } catch(e){
     console.log('error', JSON.stringify(e, null, 2));
        if (isClerkAPIResponseError(e)) {
          if (e.errors[0].code === "form_identifier_exists" ||
            e.errors[0].code === "form_param_format_invalid"
           ) {
            setError(e.errors[0].longMessage);
            Alert.alert('Error', e.errors[0].message);
          }
        }

   }
}

  return (
    //Keyboard.. allows us to continue seeing the register button, in spite of opening the keyboard
    <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={80}>
    <View style={styles.container}>

      <Text style={styles.title}>Let's get started!</Text>
      <Text style={styles.subtitle}>Enter your phone number. We will send you a confirmation code there</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Country Code"
          placeholderTextColor={Colors.gray}
          keyboardType='numeric'
          value={countryCode}
          onChangeText={setCountryCode}
        />
        <TextInput
          style={[styles.input, {flex: 1}]}//We expand phone input range
          placeholder="Phone number"
          placeholderTextColor={Colors.gray}
          keyboardType='numeric'
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <View style={{alignSelf: 'center', marginTop: 20}}>
        {error ? <Text style={{ color: "red", fontSize: 15 }}>{error}</Text> : null}
      </View>
      <TouchableOpacity style={styles.button}
            onPress={() => router.push('screens/login')}
          >
            <Text style={styles.buttonText}>Already registered? Go log in</Text>
      
      </TouchableOpacity>
      <View style={styles.buttons}>
      
      <CustomButton title="Register" onPress={() => onSignUp()} isDisabled={phoneNumber === ''} />
      </View>

      
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.background
  },
  title: {
      fontSize: 40,
      marginTop: 20,
      fontWeight: 'bold',
      color: Colors.dark,
    },
    subtitle:{
      marginTop: 20,
      marginBottom: 40,
      color: Colors.gray,
      fontSize: 16,
      fontWeight: '500'

    },
  inputContainer: {
    flexDirection: 'row'
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 50
  },
  button:{
    flex: 1,
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
      color: Colors.secondary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    enabled: {
      backgroundColor: Colors.primary,
    },
    disabled: {
      backgroundColor: Colors.primaryMuted,}
});

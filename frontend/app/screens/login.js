import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import Colors from '../constants/Colors';
import { CustomButton } from '../index';
import { useSignIn, isClerkAPIResponseError } from "@clerk/clerk-expo";

import { Ionicons } from "@expo/vector-icons";

const SignInType = {
  Phone: 'Phone',
  Email: 'Email',
  Google: 'Google'
};
export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState("+34");
  const [loading, setLoading] = useState(false); // Loading state to show a loading indicator while submitting
  const [error, setError] = useState('');
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const { signIn } = useSignIn();

  const onSignIn = async (type) => {
    if(type === SignInType.Phone) {
      try{  
      const fullPhoneNumber = `${countryCode}${phoneNumber}`
      const { supportedFirstFactors } = await signIn.create({
        identifier: fullPhoneNumber,
      });
      
      const firstPhoneFactor = supportedFirstFactors.find((factor) => {
        return factor.strategy === "phone_code";
      });
      
      const { phoneNumberId } = firstPhoneFactor;
      
      await signIn.prepareFirstFactor({
        strategy: "phone_code",
        phoneNumberId,
      });
      router.push(`screens/auth/${fullPhoneNumber}&signin=true`)
      
      } catch(error){
        console.log('error', JSON.stringify(err, null, 2));
        if (isClerkAPIResponseError(err)) {
          if (err.errors[0].code === 'form_identifier_not_found') {
            Alert.alert('Error', err.errors[0].message);
          }
        }
      }
    }
  }

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

  return (
    //Keyboard.. allows us to continue seeing the register button, in spite of opening the keyboard
    <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={80}>
    <View style={styles.container}>

      <Text style={styles.title}>It's good to see you again!</Text>
      <Text style={styles.subtitle}>Enter the phone number associated with your account</Text>
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

      <View style={styles.buttons}>
      <CustomButton title="Continue" onPress={() => handleLogin(SignInType.Phone)} isRegister isDisabled={phoneNumber === ''} />
      </View>
      <View style={styles.socialButtons}>
        <View style={styles.stripe}></View>
        <Text style={{color: Colors.gray, fontSize: 20}}>or</Text>
        <View style={styles.stripe}></View>
      </View>

      <TouchableOpacity style={styles.button} onPress={()=>handleLogin(SignInType.Email)}>
        <Ionicons name="mail" size={24} color={"black"}></Ionicons>
        <Text style={styles.buttonText}>Continue with email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={()=>handleLogin(SignInType.Google)}>
        <Ionicons name="logo-google" size={24} color={"black"}></Ionicons>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      
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
    marginTop: 30,
    marginBottom: 20
  },
  button:{
    flexDirection: 'row',
    gap: 15,
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    marginTop: 15
  },
  buttonText: {
      color: Colors.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    enabled: {
      backgroundColor: Colors.primary,
    },
    disabled: {
      backgroundColor: Colors.primaryMuted,
    },
    socialButtons:{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16

    },
    stripe:{
      flex: 1,
      height:StyleSheet.hairlineWidth,//even finer than 1
      backgroundColor: Colors.gray
    }
});

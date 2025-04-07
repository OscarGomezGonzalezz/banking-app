import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { CustomButton } from '../index';
import { useSignIn, isClerkAPIResponseError, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser'

//This is included in clerk docs: customflows/oauth-connectiona
export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}
// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

const SignInType = {
  Phone: 'Phone',
  Password: 'Password'
};

export default function Login() {
  useWarmUpBrowser()//explained above
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState("+34");
  const [error, setError] = useState('');
  const router = useRouter();
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
        console.log('error', JSON.stringify(error, null, 2));
        if (isClerkAPIResponseError(error)) {
          if (error.errors[0].code === 'form_identifier_not_found') {
            setError(error.errors[0].message);
            Alert.alert('Error', error.errors[0].message);
          }
        }
      }
    } else if(type === SignInType.FaceId){
      authenticateWithBiometrics();
    } else if(type === SignInType.Email){
      authenticateWithEmail();
    }
  }


  
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
      <View style={{alignSelf: 'center', marginTop: 20}}>
        {error ? <Text style={{ color: "red", fontSize: 18 }}>{error}</Text> : null}
      </View>
      <View style={styles.buttons}>
        <CustomButton title="Continue" onPress={() => onSignIn(SignInType.Phone)} isRegister isDisabled={phoneNumber === ''} />
      </View>
      <View style={styles.socialButtons}>
        <View style={styles.stripe}></View>
        <Text style={{color: Colors.gray, fontSize: 20}}>or</Text>
        <View style={styles.stripe}></View>
      </View>

      <TouchableOpacity style={styles.button} onPress={()=>onSignIn(SignInType.Password)}>
        <Ionicons name="lock-closed-outline" size={28} color="black"/>
        <Text style={styles.buttonText}>Access with username and password</Text>
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

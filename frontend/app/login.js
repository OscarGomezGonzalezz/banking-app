import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { CustomButton } from './index';
import { useSignIn, isClerkAPIResponseError } from "@clerk/clerk-expo";
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

export default function Login() {
  useWarmUpBrowser()//explained above
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState("+34");
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn, setActive } = useSignIn();
  const [signInPhone, setSignInPhone] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const onSignIn = async () => {
    if(signInPhone) {
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
        
       router.navigate(`/auth/${fullPhoneNumber}/${false}`);
      
      } catch(error){
        console.log('error', JSON.stringify(error, null, 2));
        if (isClerkAPIResponseError(error)) {
            setError(error.errors[0].message);
            Alert.alert('Error', error.errors[0].message);
          
        }
      }
    } else {
      console.log("login con user y password");
      try {
        const signInAttempt = await signIn.create({
          identifier: username,
          password,
        })
        // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        try {
          await setActive({ session: signInAttempt.createdSessionId });
          console.log('Successful login');
          router.navigate('/home')
        } catch (error) {
          console.error('Error setting active session:', error);
        }
      } else {
        console.log('failed during sign in')
      }
      } catch (err) {
        console.log("Sign-in error", JSON.stringify(err, null, 2));
          if (isClerkAPIResponseError(err)) {
            setError(err.errors[0].message);
            Alert.alert("Error", err.errors[0].message);
          }
        console.error(JSON.stringify(err, null, 2))
      }
    }
  }


  
  return (
    //Keyboard.. allows us to continue seeing the register button, in spite of opening the keyboard
    <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={80}>
    <View style={styles.container}>

      <Text style={styles.title}>It's good to see you again!</Text>
      {signInPhone &&(
        <>
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
        <CustomButton title="Continue" onPress={() => onSignIn()} isRegister isDisabled={phoneNumber === ''} />
      </View>
      <View style={styles.socialButtons}>
        <View style={styles.stripe}></View>
        <Text style={{color: Colors.gray, fontSize: 20}}>or</Text>
        <View style={styles.stripe}></View>
      </View>

      <TouchableOpacity style={styles.button} onPress={()=>setSignInPhone(false)}>
        <Ionicons name="lock-closed-outline" size={28} color="black"/>
        <Text style={styles.buttonText}>Access with username and password</Text>
      </TouchableOpacity>
      </>
    )}
    {!signInPhone &&(
     <>
     <View>
      <Text style={[styles.subtitle,{marginBottom: 20}]}>Enter your previous created credentials</Text>
      <View style={{flex: 'column'}}>
      <TextInput
        style={[styles.input, {margin: 7}]}
        placeholderTextColor={Colors.gray}
        keyboardType='numeric'
        value={username}
        placeholder="username"
        onChangeText={(username) => setUsername(username)}
      />
      <TextInput
        style={[styles.input, {margin: 7, marginBottom: 0}]}
        value={password}
        placeholder='password'
        placeholderTextColor={Colors.gray}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      </View>
 
      <View style={{alignSelf: 'center', marginTop: 20}}>
        {error ? <Text style={{ color: "red", fontSize: 18 }}>{error}</Text> : null}
      </View>
      <View style={styles.buttons}>
        <CustomButton title="Continue" onPress={() => onSignIn()} isRegister isDisabled={phoneNumber === ''} />
      </View>
      <View style={styles.socialButtons}>
        <View style={styles.stripe}></View>
        <Text style={{color: Colors.gray, fontSize: 20}}>or</Text>
        <View style={styles.stripe}></View>
      </View>
      <TouchableOpacity style={styles.button} onPress={()=>setSignInPhone(true)}>
        <Ionicons name="call-outline" size={26} color="black"/>
        <Text style={styles.buttonText}>Access with your phone number</Text>
      </TouchableOpacity>
    </View>
     </> 
    )}
      
    
      
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

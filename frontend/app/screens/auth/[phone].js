import { useLocalSearchParams } from "expo-router";
import Colors from "../../constants/Colors";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect, Fragment } from 'react';
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell,} from 'react-native-confirmation-code-field';
import {useRouter} from 'expo-router';
const CELL_COUNT = 6;

const PhoneScreen = () => {
  const { phone, signin } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();
  const router = useRouter();
  console.log(phone); 
  console.log(signin); 


  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if(code.length===6){
        verifyCode();
    }

  }, [code]);

  const verifyCode = async () => {
    try {
      // Try signing in first
      await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });
      await setActive({ session: signIn.createdSessionId });
  
    } catch (err) {
      console.log("signIn error", err);
  
      // If the error indicates that the user is not found, try signing up instead
      if (err) {
        console.log("User not found, proceeding with sign-up...");
  
        try {
          await signUp.attemptPhoneNumberVerification({ code });
          await setActive({ session: signUp.createdSessionId });
  
        } catch (signupErr) {
          console.log("Sign-up error", JSON.stringify(signupErr, null, 2));
          if (isClerkAPIResponseError(signupErr)) {
            Alert.alert("Error", signupErr.errors[0].message);
          }
        }
  
      } else if (isClerkAPIResponseError(err)) {
        Alert.alert("Error", err.errors[0].message);
      }
    }
  };

  const printedPhone = phone.split("&")
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>6-digit code</Text>
      <Text style={styles.subtitle}>Enter the code sent to {printedPhone[0]} </Text>

      <CodeField
      //this whole element import from github of react-native-confirmation-code-field,
      // as well as its styles, just adding a separator
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Fragment key={index}>
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}>
              <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
            </View>
            {index === 2 ? <View key={`separator-${index}`} style={styles.separator} /> : null}
          </Fragment>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => router.push('screens/login')}>
        <Text style={styles.buttonText}>Already registered? Go log in</Text>
      </TouchableOpacity>

      

    </View>
  );
};

const styles = StyleSheet.create({
    codeFieldRoot: {
        marginVertical: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        gap: 12,
      },
      cellRoot: {
        width: 45,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
      },
      cellText: {
        color: '#000',
        fontSize: 36,
        textAlign: 'center',
      },
      focusCell: {
        paddingBottom: 8,
      },
      separator: {
        height: 2,
        width: 10,
        backgroundColor: Colors.gray,
        alignSelf: 'center',
      },
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

export default PhoneScreen;

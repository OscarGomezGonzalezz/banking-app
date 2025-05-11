import {StyleSheet,Text,TextInput,TouchableOpacity,View,} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { CustomButton } from '../index';
  
const CompleteYourAccountScreen = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');

  
  useEffect(() => {
    if (!isLoaded || !user) return;
  }, [isLoaded, user]);
  
  const onCompleteCredentials = async () => {
    if (!isLoaded) return;
  
    if (!username || !password) {
      setError("Please, fill in both fields");
      return;
    } else if (username.length < 4){
      setError("Username must be between 4 and 64 characters long.");
      return;
    } else if(!/[^0-9]/.test(username)){
      setError("Username must contain one non-number character.");
      return;
    }
  
    try {
     

       //WARNIGN TESTING: if user already has a passwird, it reports an error
      await user.updatePassword({ 
        newPassword: password, 
        //according to clerk documentation in configure/email,username and password:
        // As we have setted the option password for users: Passwords are required during
        // sign up unless the user signs up with a social connection or a Web3 wallet.
        currentPassword: 'changethispassword3.14' });


      //we need test first all posible errors of username, cause other way we wont be able
      //to execute both operations(update user and update password) at rhe smae time
      await user.update({ username });

      router.replace('screens/(authenticated)/(tabs)/home');
  
    } catch (e) {
      console.log("Error:", JSON.stringify(e, null, 2));
  
      if (e?.errors && Array.isArray(e.errors)) {
        const firstError = e.errors[0];
        const message = firstError?.longMessage || firstError?.message || "An error occurred.";
        setError(message);
      } else {
        setError("Unexpected error while updating credentials.");
      }
    }
  };
  
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please, complete your credentials</Text>
        <View style={{flex: 'column'}}>
        <TextInput
          style={[styles.input, {margin: 7}]}
          placeholderTextColor={Colors.gray}
          keyboardType='default'
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
        <View style={styles.button}>
          <CustomButton title="Continue" onPress={() => onCompleteCredentials()} isRegister isDisabled={password === '' || username === ''} />
        </View>
    </View>
    );
  };
  
export default CompleteYourAccountScreen;

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
      marginBottom: 30
    },
  inputContainer: {
    marginTop: 20,
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
  button: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 30,
    marginBottom:0
  },
});


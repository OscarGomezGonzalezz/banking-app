import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from "react-native";
  import { useRouter } from "expo-router";
  import { useUser } from "@clerk/clerk-expo";
  import { useEffect, useState } from "react";
  
  const CompleteYourAccountScreen = () => {
    const { user, isLoaded } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
    const onSignUpPress = async () => {
      if (!isLoaded) return
  
      console.log(username, password)
  
      // Start sign-up process using email and password provided
      // try {
      //   await signUp.create({
      //     username,
      //     password,
      //   })
      // } catch (err) {
      //   // See https://clerk.com/docs/custom-flows/error-handling
      //   // for more info on error handling
      //   console.error(JSON.stringify(err, null, 2))
      // }
    }
  
    useEffect(() => {
      if (!isLoaded || !user) return;
    }, [isLoaded, user]);
  
    return (
      <View
        style={
          styles.container}
      >
      </View>
    );
  };
  
  export default CompleteYourAccountScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      padding: 20,
      gap: 20,
    },
    headingContainer: {
      width: "100%",
      gap: 5,
    },
    label: {
      fontSize: 20,
      fontWeight: "bold",
    },
    description: {
      fontSize: 16,
      color: "gray",
    },
    formContainer: {
      width: "100%",
      marginTop: 20,
      gap: 20,
    },
    textIput: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "gray",
      borderRadius: 5,
      padding: 10,
      width: "100%",
    },
    button: {
      width: "100%",
      backgroundColor: "blue",
      padding: 10,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
    },
    buttonText: {
      color: "white",
    },
  });
  
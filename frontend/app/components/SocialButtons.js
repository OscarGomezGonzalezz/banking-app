import { useUser, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import React, { useCallback, useEffect, useState } from 'react'
import Colors from "../constants/Colors";

import * as AuthSession from 'expo-auth-session'

const SocialLoginButton = ({ strategy }) => {

  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const buttonText = () => {
    if (isLoading) {
      return "Loading...";
    }

    if (strategy === "oauth_facebook") {
      return "Continue with Facebook";
    } else if (strategy === "oauth_google") {
      return "Continue with Google";
    } else if (strategy === "oauth_apple") {
      return "Continue with Apple";
    }
  };

  const buttonIcon = () => {
    if (strategy === "oauth_facebook") {
      return <Ionicons name="logo-facebook" size={24} color="#1977F3" />;
    } else if (strategy === "oauth_google") {
      return <Ionicons name="logo-google" size={24} color="#DB4437" />;
    } else if (strategy === "oauth_apple") {
      return <Ionicons name="logo-apple" size={24} color="black" />;
    }
  };


  const { startSSOFlow } = useSSO()

  const onSocialLoginPress = useCallback(async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      if (createdSessionId) {
        console.log("Session created", createdSessionId);
        setActive && setActive({ session: createdSessionId });
        await user?.reload();
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={onSocialLoginPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        buttonIcon()
      )}
      <Text style={styles.buttonText}>{buttonText()}</Text>
      <View />
    </TouchableOpacity>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
    button:{
        flexDirection: 'row',
        gap: 10,
        padding: 20,
        borderRadius: 30,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        marginTop: 15
      },
    buttonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
      },
});

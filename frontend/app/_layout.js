import { Stack, useSegments } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import Colors from "./constants/Colors";
import { useEffect } from 'react';
import { router, Link} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import * as SplashScreen from 'expo-splash-screen';



const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
//show the screen

const Layout = ()=>{

  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();//used for knowing in which step of our app we are

  useEffect(() => {
    if (!isLoaded) return;
    console.log('isSignedIn', isSignedIn)

    const inAuthGroup = segments[0] === '(authenticated)';

    if (isSignedIn && !inAuthGroup) {
      router.push('screens/(authenticated)/(tabs)/home');
    } else if (!isSignedIn) {
      router.push('screens/');//returning user to welcome page if not registered
    }
  }, [isSignedIn]);

  if(!isLoaded){
    return <Text>Loading...</Text>
  } else{
    SplashScreen.hideAsync();
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="screens/register"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="screens/login"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href={"screens/help"} asChild>
            <TouchableOpacity>
              <Ionicons name="help-circle-outline" size={34} color={Colors.dark} />
            </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="screens/help" options={{title: "Help", presentation:"modal"}}/>
      <Stack.Screen
        name="screens/auth/[phone]"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="screens/(authenticated)/(tabs)" options={{headerShown: false}}/>
    </Stack>
  );
}
const RootLayoutNav = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
            <Layout/>
    </ClerkProvider>
  );
};

export default RootLayoutNav;
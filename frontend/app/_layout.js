import { Stack, useSegments } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import Colors from "../constants/Colors";
import { useEffect } from 'react';
import { useRouter, Link} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo'
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
  const {user} = useUser()
  const segments = useSegments();//used for knowing in which step of our app we are
  const router = useRouter();
  useEffect(() => {
    if (!isLoaded) return;
  
   
      console.log('isSignedIn', isSignedIn);
      console.log("segments:",segments); // ["screens", "(authenticated)", "(tabs)", "home"]
  
      const inAuthGroup = segments[1] === '(authenticated)';
      const needsToCompleteAccount = !user?.username || !user?.passwordEnabled;
      console.log(!user?.username, !user?.passwordEnabled);
  
      if (isSignedIn) {
        if (needsToCompleteAccount) {
          router.navigate('/auth/completeAccount');
        } else if (!inAuthGroup) {
          const timeout = setTimeout(() => {
            router.navigate('/home');
          }, 1000); // 1 segundo
    
          return () => clearTimeout(timeout); // Limpieza del timeout si cambia el estado
        }
      } else {
        router.navigate('/');
      }// 1000 ms = 1 second of delay for visualizing purposes
    //in the completeAccount Page(completePage will be fetched instantly
    //  after succesful registration and we dont want that)
  
  }, [isSignedIn, user?.username, user?.passwordEnabled]);
  

  if(!isLoaded){
    return <Text>Loading...</Text>
  } else{
    SplashScreen.hideAsync();
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="register"
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
        name="login"
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
            <Link href={"/help"} asChild>
            <TouchableOpacity>
              <Ionicons name="help-circle-outline" size={34} color={Colors.dark} />
            </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="help" options={{
        title: "Help",
        presentation:"modal",
        headerStyle: { backgroundColor: Colors.secondary },  // Custom header background
        headerTintColor: '#fff',  // Text color in header
        headerTitleStyle: { fontWeight: 'bold' }, // Title style
        }}/>
      <Stack.Screen name="correspondences" options={{ 
        title: "Correspondences", 
        presentation: "modal",
        headerStyle: { backgroundColor: Colors.secondary },  // Custom header background
        headerTintColor: '#fff',  // Text color in header
        headerTitleStyle: { fontWeight: 'bold' }, // Title style
      }} />
      <Stack.Screen
        name="auth/[phone]/[isRegister]"
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
        name="auth/completeAccount"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
        }}
      />
      <Stack.Screen name="(authenticated)/(tabs)" options={{headerShown: false}}/>
      <Stack.Screen name="(authenticated)/(modals)" options={{headerShown: false}}/>

{/* expo router removes the group routes(the ones between parenthesis) from the target route, but 
we have to define these routes with their group parts of the route in layout 

DOC: https://docs.expo.dev/router/basics/notation/
*/}
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
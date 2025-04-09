import { Stack, useSegments } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import Colors from "./constants/Colors";
import { use, useEffect } from 'react';
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
    console.log('isSignedIn', isSignedIn)

    console.log(segments)//["screens", "(authenticated)", "(tabs)", "home"]
    const inAuthGroup = segments[1] === '(authenticated)';

    if (isSignedIn)
       {
        //if(user) console.log(user);
        const needsToCompleteAccount = !user?.username || !user?.passwordEnabled;
        console.log(!user?.username, !user?.passwordEnabled)//user.password does not exist in clerk users
        if(needsToCompleteAccount) {
          router.replace('/screens/auth/completeAccount')
        }else if (!needsToCompleteAccount && !inAuthGroup) {
          router.replace('/screens/(authenticated)/(tabs)/home');
        }
      
        } else {
      router.replace('/');//returning user to welcome page if not registered
    }
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
      <Stack.Screen name="screens/help" options={{
        title: "Help",
        presentation:"modal",
        headerStyle: { backgroundColor: Colors.secondary },  // Custom header background
        headerTintColor: '#fff',  // Text color in header
        headerTitleStyle: { fontWeight: 'bold' }, // Title style
        }}/>
      <Stack.Screen name="screens/correspondences" options={{ 
        title: "Correspondences", 
        presentation: "modal",
        headerStyle: { backgroundColor: Colors.secondary },  // Custom header background
        headerTintColor: '#fff',  // Text color in header
        headerTitleStyle: { fontWeight: 'bold' }, // Title style
      }} />
      <Stack.Screen
        name="screens/auth/[phone]/[isRegister]"
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
      <Stack.Screen
        name="screens/(authenticated)/(modals)/profile"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          title: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="close-outline" size={34} color={'white'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="screens/(authenticated)/(modals)/walletModal"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          title: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="close-outline" size={34} color={'white'} />
            </TouchableOpacity>
          ),
        }}
      />
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
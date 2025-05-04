import { Stack } from 'expo-router';
import {TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

const Layout = () => {
    const router = useRouter();

  return (
    <Stack screenOptions={{ 
        presentation: 'transparentModal',
        animation: 'fade',
        headerTransparent: true,
        title: ''
        }}>
      {/* Cualquier pantalla dentro de (modals) se comporta como modal */}
      <Stack.Screen
        name="profile"
        options={{
          headerLeft: () => (
            // router.navigate('home') instead of router back needed when pressing back after veryfing identity after changing full nmae
            // Besides, it has to be envolved in a function instead of in a callback, as it returns a promise
            <TouchableOpacity onPress={() => router.replace('/home')}>
              <Ionicons name="close-outline" size={34} color={'white'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="walletModal"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="close-outline" size={34} color={'white'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="verifyIdentity"
      />
    </Stack>
    
  );
};

export default Layout;


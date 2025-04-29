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
            <TouchableOpacity onPress={router.back}>
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


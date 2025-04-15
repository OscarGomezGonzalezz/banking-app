import { Tabs } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import { BlurView } from 'expo-blur';
import CustomHeader from '../../../components/CustomHeader';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Layout = () => {
  const router = useRouter();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.secondary,
          tabBarIconStyle: {
            marginTop: 8,
          },
          tabBarBackground: () => (
            <BlurView
              intensity={60}
              tint={'extraLight'}
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
            />
          ),
          tabBarStyle: {
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 10,
            left: 10,
            right: 10,
            elevation: 0,
            borderTopWidth: 0,
            borderRadius: 30,
            height: 70,
            overflow: 'hidden',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <FontAwesome5 name="home" size={size} color={color} />
            ),
            header: () => <CustomHeader />,
            headerTransparent: true,
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: 'Expenses',
            tabBarIcon: ({ size, color }) => (
              <FontAwesome5 name="credit-card" size={size} color={color} />
            ),
            headerTransparent: true,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            tabBarIcon: ({ size, color }) => (
              <FontAwesome5 name="wallet" size={size} color={color} />
            ),
            headerTransparent: true,
            headerShown: false,
          }}
        />
      </Tabs>

      {/* Floating Action Button at top-right of TabBar */}
      <Pressable onPress={() => router.push('/create')} style={styles.fab}>
        <Ionicons name="add" size={28} color="white" />
      </Pressable>
    </>
  );
};

export default Layout;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 90, // Higher than the tab bar (70 height + some space)
    right: 25,  // Align to the right with some margin
    backgroundColor: Colors.secondary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});

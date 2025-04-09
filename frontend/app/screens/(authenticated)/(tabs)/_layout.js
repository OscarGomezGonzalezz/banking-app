import { Tabs } from 'expo-router';
import {FontAwesome5} from '@expo/vector-icons'
import Colors from '../../../constants/Colors';
import {BlurView} from 'expo-blur';
import CustomHeader from '../../../components/CustomHeader';;
const Layout = ()=>{
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.secondary,
            tabBarIconStyle: {
                marginTop: 8, // margin for icons
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
              tabBarStyle:{//padding
                backgroundColor: 'transparent',
                position: 'absolute',
                bottom: 10,
                left: 10,
                right: 10,
                elevation: 0,
                borderTopWidth: 0,
                borderRadius: 30,
                height: 70,
                overflow: 'hidden', // para que el blur no sobresalga
              }
        }}>
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
                header: () => <CustomHeader />,
                headerTransparent: true,
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                title: 'Wallet',
                tabBarIcon: ({ size, color }) => (
                    <FontAwesome5 name="wallet" size={size} color={color} />
                ),
                header: () => <CustomHeader />,
                headerTransparent: true,
                }}
            />
        </Tabs>
    )
}
export default Layout
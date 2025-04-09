import { Tabs } from 'expo-router';
import {FontAwesome5} from '@expo/vector-icons'
import Colors from '../../../constants/Colors';
import {BlurView} from 'expo-blur';
import CustomHeader from '../../../components/CustomHeader';;
const Layout = ()=>{
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.secondary,
            tabBarBackground: () => (
                <BlurView
                 intensity={100}
                 tint={'extraLight'}
                 style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                }} 
                  
                />
              ),
              tabBarStyle:{
                backgroundColor: 'transparent',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                elevation: 0,
                borderTopWidth: 0,
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
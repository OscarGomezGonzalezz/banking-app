import { Tabs } from 'expo-router';
import {FontAwesome} from '@expo/vector-icons'
import Colors from '../../../constants/Colors';
const Layout = ()=>{
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.secondary
        }}>
            <Tabs.Screen
                name="home"
                options={{
                title: 'Home',
                tabBarIcon: ({ size, color }) => (
                    <FontAwesome name="home" size={size} color={color} />
                ),
                }}
            />
            <Tabs.Screen
                name="expenses"
                options={{
                title: 'Expenses',
                tabBarIcon: ({ size, color }) => (
                    <FontAwesome name="credit-card" size={size} color={color} />
                ),
                }}
            />
            <Tabs.Screen
                name="transfers"
                options={{
                title: 'Transfers',
                tabBarIcon: ({ size, color }) => (
                    <FontAwesome name="exchange" size={size} color={color} />
                ),
                }}
            />
        </Tabs>
    )
}
export default Layout
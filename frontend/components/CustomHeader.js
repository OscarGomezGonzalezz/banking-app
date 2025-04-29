import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { BlurView } from 'expo-blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import Colors from '../constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import {router, Link} from 'expo-router'


const CustomHeader = ()=>{

    const { top }=useSafeAreaInsets();//we use this measure instead of a fixed number, which vary from devices
    return (
        <BlurView intensity={80} tint='extraLight' style={{
            paddingTop: top
        }}>
            <View style={styles.container}>
                <Link href={'/profile'} asChild>
                <TouchableOpacity style={styles.profilebutton} >
                <Ionicons name="person" style={{padding:10}} size={20} color={Colors.dark}></Ionicons>
                </TouchableOpacity>
                </Link>

                <View style={styles.search}>
                    <Ionicons name="search" style={{padding:10}} size={20} color={Colors.dark}></Ionicons>
                    <TextInput style={styles.searchBar} placeholder="Search" placeholderTextColor={Colors.dark} />
                </View>
                <View style={[styles.profilebutton,{backgroundColor: Colors.lightGray}]}>
                    <TouchableOpacity onPress={() => router.navigate('/correspondences')}>
                    <Ionicons name={'mail'} size={20} color={Colors.dark} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.profilebutton, {backgroundColor: Colors.lightGray}]}>
                    <TouchableOpacity onPress={() => router.navigate('/help')}>
                        <Ionicons name={'help-circle'} size={20} color={Colors.dark} />
                    </TouchableOpacity>
                </View>
              
            </View>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        gap: 10,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    profilebutton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },buttonText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: "center",
        color: 'white'
      },
      search: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: 30,
      },
      searchBar: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        color: Colors.dark,
        borderRadius: 30,
      },
})
export default CustomHeader
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
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
                
                <TouchableOpacity style={styles.profilebutton} onPress={() => router.push('/profile')} >
                <Ionicons name="person" style={{padding:10}} size={20} color={Colors.dark}></Ionicons>
                </TouchableOpacity>
                

                <View style={styles.search}>
                    <Image
    source={require('../assets/UNIWALLET.png')}
    style={[{ width: 100, height: 100, resizeMode: 'contain'}, styles.searchBar]}
  />
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
        marginLeft: 50,
        alignSelf: 'center',
        justifyContent: "center",
        borderRadius: 30,
        alignItems: 'center',

        backgroundColor: 'transparent'
      },
})
export default CustomHeader
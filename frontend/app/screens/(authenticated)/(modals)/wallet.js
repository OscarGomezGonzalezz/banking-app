import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../../constants/Colors';
import { useHeaderHeight } from '@react-navigation/elements';
import { BlurView } from 'expo-blur';
const Wallet = ()=>{
    const headerHeight = useHeaderHeight();

    return (
        <BlurView intensity={80} tint='dark' style={{flex:1, paddingTop:100,backgroundColor:Colors.gray}}>
            <View style={{ alignItems: 'center' }}>
                
            </View>
        </BlurView>
    )
}
const styles = StyleSheet.create({
    account: {
        margin: 80,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    balance: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    currency: {
        fontSize: 20,
        fontWeight: 500,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    }
});
export default Wallet
import Colors from '../constants/Colors';


import {View , Text, ScrollView, StyleSheet, Button} from 'react-native';

const Page = () => {

    const balance = 1420;
    return (
        <ScrollView style={{backgroundColor: Colors.background}}>
            <View style={styles.account}>
            
            <View style={styles.row}>
            <Text style={styles.balance}>{balance}</Text>
            <Text style={styles.currency}>€</Text>
            
            </View>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    account: {
        margin: 80,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    balance: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    currency: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Page;
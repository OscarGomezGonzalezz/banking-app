//import RoundBtn from '../components/RoundBtn';
import Colors from "../../../constants/Colors";
import { useHeaderHeight } from '@react-navigation/elements';

import {View , Text, ScrollView, StyleSheet, Button} from 'react-native';

const Page = () => {

    const balance = 1420;
    const headerHeight = useHeaderHeight();

    const onAddMoney = () => {
        console.log('Add money');
    }

    
    return (
        <ScrollView style={{backgroundColor: Colors.background}}
        contentContainerStyle={{
            paddingTop: headerHeight,//we get the height from our custom header in order not to colapse elements
          }}>
            <View style={styles.account}>
            
            <View style={styles.row}>
            <Text style={styles.balance}>{balance}</Text>
            <Text style={styles.currency}>€</Text>
            </View>
            <Text>
                put total balance, recent transactions from 2 and create transactions
                choosing specific account
            </Text>
            </View>
            <View style={styles.actionRow}>
            {/* <RoundBtn icon={'add'} text={'Add money'} onPress={onAddMoney}/>
            <RoundBtn icon={'refresh'} text={'Exchange'}/>
            <RoundBtn icon={'list'} text={'Details'}/> */}
            
           
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

export default Page;
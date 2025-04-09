import {View, Text, ScrollView, StyleSheet} from 'react-native';
import Colors from '../../../constants/Colors';
import { useHeaderHeight } from '@react-navigation/elements';
const Page = ()=>{

    return (
        <ScrollView style={{backgroundColor: Colors.background}}
                contentContainerStyle={{
                    paddingTop: 65,//we get the height from our custom header in order not to colapse elements
                  }}>
            <View style={styles.account}>    
                    <Text>
                        widgets expenses from 1
                    </Text>
                    
                   
            </View>
        </ScrollView>
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
export default Page
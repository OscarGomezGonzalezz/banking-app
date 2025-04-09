import {ScrollView,View, Text, StyleSheet, TextInput} from 'react-native';
import Colors from '../../../constants/Colors';
import { BlurView } from 'expo-blur';
import {useEffect, useState}from 'react'
import { CustomButton } from '../../../index';
import { useLocalSearchParams } from 'expo-router';
const WalletModal = ()=>{
    const [account,  setAccount] = useState("");

    const oldAccount = useLocalSearchParams();

    useEffect(()=>{
        if(oldAccount?.beneficiary){//do with its id
            setAccount({
                beneficiary: oldAccount.beneficiary,
                IBAN: oldAccount.IBAN,
                BIC: oldAccount.BIC,
            })
        }
    }, [])

    return (
        <BlurView intensity={80} tint='dark' style={{flex:1, paddingTop:100,backgroundColor:Colors.gray}}>
            <View style={styles.header}>
                <Text style={styles.title}>Account Details</Text>
            </View>
            <ScrollView contentContainerStyle={styles.form}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Beneficiary"
                        placeholderTextColor={Colors.gray}
                        keyboardType='numeric'
                        value={account.beneficiary}
                        onChangeText={setAccount}
                    />
                    <TextInput
                        style={[styles.input, {flex: 1}]}//We expand phone input range
                        placeholder="IBAN"
                        placeholderTextColor={Colors.gray}
                        keyboardType='numeric'
                        value={account.IBAN}
                        onChangeText={setAccount}
                    />
                    <TextInput
                        style={[styles.input, {flex: 1}]}//We expand phone input range
                        placeholder="BIC"
                        placeholderTextColor={Colors.gray}
                        keyboardType='numeric'
                        value={account.BIC}
                        onChangeText={setAccount}
                    />
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <CustomButton title="Add bank account" onPress={()=>console.log('d')} isRegister/>
            </View>
        </BlurView>
    )
}
const styles = StyleSheet.create({
    footer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: "center",
        width: '85%',
        marginTop: 100,
        marginBottom: 35,
        gap: 20,
        marginHorizontal: 20
    },
    title: {
        fontSize: 30,
        marginBottom: 10,
        fontWeight: 'bold',
        color: Colors.background,
      },
      header: {
        marginTop: 0,
        padding: 20,
        alignSelf: 'center'
      },
      form:{

      },
      inputContainer: {
          flex: 'column',
          margin: 7
        },
        input: {
          backgroundColor: Colors.lightGray,
          padding: 20,
          borderRadius: 16,
          fontSize: 20,
          margin: 10
        },
});
export default WalletModal
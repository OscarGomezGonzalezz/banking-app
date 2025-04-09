import {ScrollView,View, Text, StyleSheet, TextInput} from 'react-native';
import Colors from '../../../constants/Colors';
import { BlurView } from 'expo-blur';
import {useEffect, useState}from 'react'
import { CustomButton } from '../../../index';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-react';
import db from '../../../firebase/firebaseConfig'
import { collection, addDoc, doc } from "firebase/firestore"; 
import { useRouter } from 'expo-router';

const WalletModal = ()=>{
    const [account,  setAccount] = useState({});
    const oldAccount = useLocalSearchParams();
    console.log(oldAccount.IBAN);
    const { user } = useUser();
    const userId = user.id; 
    const router = useRouter();


    // useEffect(()=>{
    //     if(oldAccount?.IBAN){//if the account has been already created...
    //         setAccount({
    //             //and also an automatic created accountID
    //             beneficiary: oldAccount.beneficiary,
    //             IBAN: oldAccount.IBAN,
    //             BIC: oldAccount.BIC,
    //         })
    //     }
    // }, [oldAccount])

    const saveBankAccount = async () => {
        try {
            // Generate a random quantity between 700 and 4000
            const randomQuantity = Math.floor(Math.random() * (4000 - 700 + 1)) + 700;

            // Add the random quantity to the account object
            const accountWithQuantity = { ...account, quantity: randomQuantity };

            // Reference to the 'accounts' collection for this user
            const userAccountsRef = collection(doc(db, "users", userId)//This references a specific document for the user based on the userId
            , "accounts");//This references the accounts sub-collection inside the user's document.
            
            // Save the account information in the 'accounts' collection
            const docRef = await addDoc(userAccountsRef, accountWithQuantity);
    
            console.log("Bank account saved with ID: ", docRef.id);
            console.log('Bank account saved successfully!');
            router.back();
        } catch (error) {
            console.error("Error saving bank account: ", error);
        }
    };

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
                        onChangeText={(text) => setAccount({ ...account, beneficiary: text })}
                        // we are updating only the specific property (beneficiary, IBAN, or BIC) using the 
                        // spread operator (...account). This ensures the rest of the properties of account
                        //  remain intact while only the modified one gets updated.
                    />
                    <TextInput
                        style={[styles.input, {flex: 1}]}//We expand phone input range
                        placeholder="IBAN"
                        placeholderTextColor={Colors.gray}
                        keyboardType='numeric'
                        value={account.IBAN}
                        onChangeText={(text) => setAccount({ ...account, IBAN: text })}
                    />
                    <TextInput
                        style={[styles.input, {flex: 1}]}//We expand phone input range
                        placeholder="BIC"
                        placeholderTextColor={Colors.gray}
                        keyboardType='numeric'
                        value={account.BIC}
                        onChangeText={(text) => setAccount({ ...account, BIC: text })}
                    />
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <CustomButton title="Save bank account" onPress={()=>saveBankAccount()} isRegister/>
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
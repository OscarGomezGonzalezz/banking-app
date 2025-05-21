import {ScrollView,View, Text, StyleSheet, TextInput} from 'react-native';
import Colors from '../../../constants/Colors';
import { BlurView } from 'expo-blur';
import {useEffect, useState}from 'react'
import { CustomButton } from '../../index';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-react';
import db from '../../../firebase/firebaseConfig'
import { updateDoc,collection, addDoc, doc, deleteDoc, getDocs } from "firebase/firestore"; 
import { useRouter } from 'expo-router';

const WalletModal = ()=>{
    const oldAccount = useLocalSearchParams();
    const { user } = useUser();
    const mandatoryBeneficiary = `${user.firstName} ${user.lastName}`;
    const [account,  setAccount] = useState({beneficiary: mandatoryBeneficiary});
    const userId = user.id; 
    const router = useRouter();
    const [error, setError] = useState('');


    useEffect(()=>{
         if(oldAccount?.accountID){//if the account has been already created...
            console.log(oldAccount);
            setAccount({
                //and also an automatic created accountID
                accountID: oldAccount.accountID,
                beneficiary: oldAccount.beneficiary,
                IBAN: oldAccount.IBAN,
                BIC: oldAccount.BIC,
                quantity: Number(oldAccount.quantity),//otherway total will be undefined
            })
        }
    }, [])

    const saveBankAccount = async () => {
      // Reference to the 'accounts' collection for this user
           
      
        try {
           
              if (!account.beneficiary || account.beneficiary.trim().length < 3) {
                setError("Enter the first and last name of the beneficiary");
                return;
              }
              if (account.beneficiary !== mandatoryBeneficiary) {
                setError("The beneficiary name of any bank accounts added must exactly match your full name indicated in the identity verification process");
                return;
              }

        if (!oldAccount.IBAN) {
              // Validar formato IBAN
              if (!account.IBAN || !/^([A-Z]{2})(\d{2})([A-Z0-9]{1,30})$/.test(account.IBAN)) {
                setError("Please enter a valid IBAN.");
                return;
              }

              // Verificar si el IBAN ya existe para este usuario
              const userAccountsRef = collection(doc(db, "users", userId), "accounts");
              const snapshot = await getDocs(userAccountsRef);
              const ibanExists = snapshot.docs.some(doc => doc.data().IBAN === account.IBAN);

              if (ibanExists) {
                setError("Account already exists with this IBAN.");
                return;
              }
            }

              if (!account.BIC || account.BIC.trim().length < 2) {
                setError("BIC number must contain at least 2 characters.");
                return;
              }
              const userAccountsRef = collection(doc(db, "users", userId)//This references a specific document for the user based on the userId
            , "accounts");//This references the accounts sub-collection inside the user's document.
            const snapshot = await getDocs(userAccountsRef);
            console.log(snapshot);
            if (snapshot.size >= 5) {
              setError("You have reached the most number of account enabled");
              return;
            }
          
          
            // Generate a random quantity between 700 and 4000
            const randomQuantity = Math.floor(Math.random() * (4000 - 700 + 1)) + 700;
            
            //WE DONT TAKE INTO ACCOUNTS CURRENCIES, AS WE SUPPOSE THEY WILL BE AUTOMATICALLY TRANSLATED TO EUROS(WE WORK INITIALLY IN EUROPE)
            // Add the random quantity to the account object
            
            account.quantity = randomQuantity;

            if (oldAccount?.accountID) {
                //UPDATE EXISTING ACCOUNT
                const accountRef = doc(db, "users", userId, "accounts", oldAccount.accountID);
                
                //If IBAN is changed, then the quantity of the account will be different
                if(oldAccount.IBAN !== account.IBAN) {
                    setError('You can not change the IBAN of your account')
                    return;
                } else{
                    await updateDoc(accountRef, {IBAN: account.IBAN});
                }
    
                console.log("Bank account updated with ID:", oldAccount.accountID);
            } else {
                 
            // Create empty document to get the ID
            const docRef = await addDoc(userAccountsRef, {});

            
            //acountID is created by firebase, but we will have to storage it manually in the db
            await updateDoc(docRef, {
              ...account,
              accountID: docRef.id, // <-- Save the document ID inside the document
            });
    
            console.log("Bank account saved with ID: ", docRef.id);
            console.log('Bank account saved successfully!');

            }
            
            router.replace('/wallet');
        } catch (error) {
            console.error("Error saving bank account: ", error);
        }
    };
    const deleteBankAccount = async () => {
        try {
          if (oldAccount?.accountID) {
            const accountRef = doc(db, "users", userId, "accounts", oldAccount.accountID);
            await deleteDoc(accountRef);
            console.log("Bank account deleted with ID:", oldAccount.accountID);
            router.back();
          } else {
            console.warn("No account to delete: accountID is missing.");
          }
        } catch (error) {
          console.error("Error deleting bank account:", error);
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
                        placeholder={mandatoryBeneficiary}
                        placeholderTextColor={Colors.gray}
                        keyboardType='default'
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
                        keyboardType='default'
                        value={account.IBAN}
                        onChangeText={(text) => setAccount({ ...account, IBAN: text })}
                    />
                    <TextInput
                        style={[styles.input, {flex: 1}]}//We expand phone input range
                        placeholder="BIC"
                        placeholderTextColor={Colors.gray}
                        keyboardType='default'
                        value={account.BIC}
                        onChangeText={(text) => setAccount({ ...account, BIC: text })}
                    />
                </View>
                <View style={{alignSelf: 'center', marginTop: 20, paddingHorizontal: 20}}>
                    {error ? <Text style={{ color: "red", fontSize: 18 }}>{error}</Text> : null}
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <CustomButton title="Save bank account" onPress={()=>saveBankAccount()} isRegister/>
                {oldAccount?.accountID && (
                <>
                <CustomButton title="Delete bank account" onPress={()=>deleteBankAccount()} isDelete/> 
                </>
                )}
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
        gap: 10,
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
//import RoundBtn from '../components/RoundBtn';
import Colors from "../../../constants/Colors";
import { useHeaderHeight } from '@react-navigation/elements';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { collection, getDocs } from "firebase/firestore"; 
import db from '../../../firebase/firebaseConfig'; 

import {View , Text, ScrollView, StyleSheet, Button} from 'react-native';
import HomeCard from "../../../components/HomeCard";
import TransactionList from "../../../components/TransactionList";

const Page = () => {
    const [wallet, setWallet] = useState([]);
    const { user } = useUser();
    const [total, setTotal] = useState(0);
    const [transactions, setTransactions] = useState([]); // State to hold all transactions
    
    console.log("home");
  
    useEffect(() => {
        async function fetchWalletBalance() {
            if (user?.id) { // Ensure the user is logged in
              try {
                const querySnapshot = await getDocs(collection(db, "users", user.id, "accounts"));
                const accounts = [];
                let totalBalance = 0;
                querySnapshot.forEach((doc) => {
                totalBalance += doc.data().quantity;
                  accounts.push(doc.data());
                });
                setTotal(totalBalance); 
                setWallet(accounts); // Set the accounts data to state

      
              } catch (error) {
                console.error("Error fetching accounts:", error);
              }
            }
          }
      
          fetchWalletBalance(); // Fetch accounts on component mount
      }, [wallet]); // Run when refreshing the window



  useEffect(() => {
      async function fetchAllTransactions() {
        if (user?.id) {
          try {
            const accountsRef = collection(db, "users", user.id, "accounts");
            const accountsSnapshot = await getDocs(accountsRef);

            const allTransactions = [];

            // Recorre cada cuenta
            for (const accountDoc of accountsSnapshot.docs) {
              const accountId = accountDoc.id;

              const transactionsRef = collection(db, "users", user.id, "accounts", accountId, "transactions");
              const transactionsSnapshot = await getDocs(transactionsRef);

              transactionsSnapshot.forEach((txDoc) => {
                console.log("Transaction data:", txDoc.data());
                allTransactions.push({
                  //id: txDoc.id,
                  //accountId, // para saber de qué cuenta viene
                  ...txDoc.data()
                });
              });
            }

            setTransactions(allTransactions); // Guarda todo en el estado
          } catch (error) {
            console.error("Error fetching all transactions:", error);
          }
        }
      }

      fetchAllTransactions();
}, []);



    const headerHeight = useHeaderHeight();


    
    return (
        <ScrollView style={{backgroundColor: Colors.background}}
        contentContainerStyle={{
            paddingTop: headerHeight,//we get the height from our custom header in order not to colapse elements
          }}>

            <View style={styles.account}>
            
           <HomeCard/>

            
            <Text>
                put total balance, recent transactions from 2 and create transactions
                choosing specific account
            </Text>
           

            </View>

            <View style={styles.actionRow}>
               <TransactionList data={transactions} />
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
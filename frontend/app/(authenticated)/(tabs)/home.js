//import RoundBtn from '../components/RoundBtn';
import Colors from "../../../constants/Colors";
import { useHeaderHeight } from '@react-navigation/elements';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { collection, getDocs } from "firebase/firestore"; 
import db from '../../../firebase/firebaseConfig'; 

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import {View, ScrollView, StyleSheet, Button} from 'react-native';
import HomeCard from "../../../components/HomeCard";
import TransactionList from "../../../components/TransactionList";


const Page = () => {
    const { user } = useUser();
    const [total, setTotal] = useState(0);
    const [transactions, setTransactions] = useState([]); // State to hold all transactions
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [accountsLoaded, setAccountsLoaded] = useState(false); // Estado para controlar la carga de cuentas

    
    console.log("home");
    useFocusEffect(
  useCallback(() => {
    let isActive = true;

    async function fetchWalletAndTransactions() {
      if (!user?.id || !isActive) return;
      try {
        // 1. Load accounts
        const accountsSnap = await getDocs(
          collection(db, "users", user.id, "accounts")
        );
        let baseBalance = 0;
        for (const account of accountsSnap.docs) {
          console.log(account.data());
          baseBalance += account.data().quantity || 0;
        }

        // 2. Load transactions for all accounts
        let totalIncome = 0;
        let totalExpenses = 0;
        const allTx = [];
        for (const acct of accountsSnap.docs) {
          const txSnap = await getDocs(
            collection(db, "users", user.id, "accounts", acct.id, "transactions")
          );
          txSnap.forEach(doc => {
            const amt = parseFloat(doc.data().amount) || 0;
            if (amt > 0) totalIncome += amt;
            else totalExpenses += Math.abs(amt);
            allTx.push({ id: doc.id, accountId: acct.id, ...doc.data() });
          });
        }

        // 3. Set state exactly once
        if (isActive) {
          setAccountsLoaded(true);
          setTransactions(allTx);
          setTotal(baseBalance);
          setTotalIncome(totalIncome);
          setTotalExpenses(totalExpenses);
        }
      } catch (err) {
        console.error("Error fetching wallet + transactions:", err);
      } 
    }

    fetchWalletAndTransactions();

    return () => {
      isActive = false;
    };
  }, [user?.id])
);
;


    const headerHeight = useHeaderHeight();

       
    
    return (
        <ScrollView style={{backgroundColor: Colors.background}}
        contentContainerStyle={{
            paddingTop: headerHeight,//we get the height from our custom header in order not to colapse elements
          }}>

            <View style={styles.account}>
           <HomeCard total={total} expenses={totalExpenses} incomes={totalIncome} />
            </View>

            <View style={styles.actionRow}>
            <TransactionList data={transactions} /> 
            </View>
         
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    account: {
        marginTop: 80,
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
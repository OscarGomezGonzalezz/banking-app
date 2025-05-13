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
import { set } from "date-fns";


const Page = () => {
    const { user } = useUser();
    const [total, setTotal] = useState(0);
    const [transactions, setTransactions] = useState([]); // State to hold all transactions
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [accountsLoaded, setAccountsLoaded] = useState(false); // Estado para controlar la carga de cuentas

    
    console.log("home");
<<<<<<< HEAD
    
    
  //This is necessary for using router.back(), which is more stetic than router.replace().
    //I think this could be solved by using .onSnapShot =>{}, but as this already works smoothly, we wont change it
=======
   

>>>>>>> 116fa6983dcdd617aca593bef2f5661069300044
    useFocusEffect(
      useCallback(() => {
        let isActive = true;
        setAccountsLoaded(false); // Reiniciar el estado de carga de cuentas al entrar en la pantalla
  
        async function fetchWalletBalance() {
          if (!user?.id || !isActive) return;
          try {
            const querySnapshot = await getDocs(collection(db, "users", user.id, "accounts"));
            let totalBalance = 0;
            querySnapshot.forEach((doc) => {
              totalBalance += doc.data().quantity;
            });
            if (isActive) {
              setTotal(totalBalance);
              setAccountsLoaded(true); // Marcar como cargadas las cuentas
            }
          } catch (error) {
            console.error("Error fetching accounts:", error);
          }
        }
  
        fetchWalletBalance();
  
        return () => {
          // cuando la pantalla pierde foco, evitamos actualizar estado
          isActive = false;
        };
      }, [user?.id])
    );

    
  useEffect(() => {
     if (!accountsLoaded) return; // Esperar hasta que las cuentas estén cargadas

      async function fetchAllTransactions() {
        if (user?.id) {
          try {
            const accountsRef = collection(db, "users", user.id, "accounts");
            const accountsSnapshot = await getDocs(accountsRef);

            const allTransactions = [];
             let totalIncome = 0;
              let totalExpenses = 0;
           

            // Recorre cada cuenta
            for (const accountDoc of accountsSnapshot.docs) {
              const accountId = accountDoc.id;

              const transactionsRef = collection(db, "users", user.id, "accounts", accountId, "transactions");
              const transactionsSnapshot = await getDocs(transactionsRef);

              transactionsSnapshot.forEach((txDoc) => {
                console.log("Transaction data:", txDoc.data());
                
                 const data = txDoc.data();
                 const amount = parseFloat(data.amount);

                    if (!isNaN(amount)) {
                      if (amount > 0) {
                        totalIncome += amount;
                      } else {
                        totalExpenses += Math.abs(amount);
                      }
                    }

                allTransactions.push({
                  //id: txDoc.id,
                  //accountId, // para saber de qué cuenta viene
                  ...txDoc.data()
                });
              });
            }

            setTransactions(allTransactions); // Guarda todo en el estado
          
            let totalIn = total;
            totalIn = totalIn + totalIncome - totalExpenses;

            setTotal(totalIn);
            setTotalIncome(totalIncome);
            setTotalExpenses(totalExpenses);
          } catch (error) {
            console.error("Error fetching all transactions:", error);
          }
        }
      }

      fetchAllTransactions();
}, [accountsLoaded]);


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
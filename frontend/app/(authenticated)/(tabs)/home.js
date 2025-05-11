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

const sampleData = [
      {
        id: 1,
        description: 'Salary',
        amount: 1500,
        methodOfPayment: 'Bank Transfer',
        date: '2025-04-10T00:00:00Z'
      },
      {
        id: 2,
        description: 'Supermarket',
        amount: -250,
        methodOfPayment: 'Credit Card',
        date: '2025-04-12T00:00:00Z'
      },
      {
        id: 3,
        description: 'Rent',
        amount: -800,
        methodOfPayment: 'Bank Transfer',
        date: '2025-04-01T00:00:00Z'
      },
      {
        id: 4,
        description: 'Freelance Work',
        amount: 600,
        methodOfPayment: 'PayPal',
        date: '2025-04-05T00:00:00Z'
      }
    ];
const Page = () => {
    const { user } = useUser();
    const [total, setTotal] = useState(0);
    console.log("home");
    
    

    useFocusEffect(
      useCallback(() => {
        let isActive = true;
  
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

    const headerHeight = useHeaderHeight();


    
    return (
        <ScrollView style={{backgroundColor: Colors.background}}
        contentContainerStyle={{
            paddingTop: headerHeight,//we get the height from our custom header in order not to colapse elements
          }}>

            <View style={styles.account}>
            
           <HomeCard total={total}/>
           

            </View>

            <View style={styles.actionRow}>
            <TransactionList data={sampleData} /> 
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
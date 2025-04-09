import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs } from "firebase/firestore"; 
import { useUser } from '@clerk/clerk-react'; // Use Clerk's hook to get user details
import db from '../firebase/firebaseConfig'; 

function ListAccounts() {
  const [wallet, setWallet] = useState([]);
  const [account, setAccount] = useState({});
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function fetchAccounts() {
      if (user?.id) { // Ensure the user is logged in
        try {
          const querySnapshot = await getDocs(collection(db, "users", user.id, "accounts"));
          const accounts = [];
          querySnapshot.forEach((doc) => {
            accounts.push(doc.data());
          });
          setWallet(accounts); // Set the accounts data to state

        } catch (error) {
          console.error("Error fetching accounts:", error);
        }
      }
    }

    fetchAccounts(); // Fetch accounts on component mount
  }, [wallet]); // Only run this effect when wallet changes

  const getAssociatedBank = (BIC) => {
    switch (BIC?.toUpperCase()) {
      case 'BSCHESMMXXX': // Santander
      case 'BSCHESMM':    // Algunas veces sin XXX
        return 'Banco Santander';
  
      case 'CAIXESBBXXX': // CaixaBank
      case 'CAIXESBB':
        return 'CaixaBank';
  
      case 'CHASDEFX':    // JPMorgan Alemania
      case 'CHASUS33':    // JPMorgan USA
        return 'JPMorgan Chase';
  
      case 'TRREDEMMXXX': // Trade Republic
      case 'TRREDEMM':
        return 'Trade Republic';
  
      default:
        return 'Unknown Bank';
    }
  };

  const openWallet = async (item) => {
    try {
        router.push({
            pathname: 'screens/(authenticated)/(modals)/walletModal',
            params:{
                beneficiary: item.beneficiary,
                IBAN: item.IBAN,
                BIC: item.BIC,
            }
        })
    } catch (error) {
      console.error("Error loading wallet", error);
    }
  }; 
  

  return (
    <View style={{ gap: 12 , marginTop: 20}}>
      {wallet
        .map(item => (
          <TouchableOpacity
            key={item.IBAN}
            onPress={()=>openWallet(item)}
            style={styles.account}
          >
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {getAssociatedBank(item.BIC)}
                </Text>
                <Text style={{ fontSize: 14, color: 'gray', marginTop: 2 }}>
                    {item.IBAN}
                </Text>
            </View>
            <View style={styles.balanceQuantity}>
                <Text style={styles.balance}>{item.quantity?.toFixed(2)}</Text>
                <Text style={styles.currency}>€</Text>
            </View>

            <Ionicons style={{marginLeft: 20}} name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
    </View>
  );
}
const styles = StyleSheet.create({
    account: {
        backgroundColor: 'white',
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      balanceQuantity: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    balance: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'green'
    },
    currency: {
        fontSize: 20,
        fontWeight: 500,
        color: 'green'
    },
});
export default ListAccounts;


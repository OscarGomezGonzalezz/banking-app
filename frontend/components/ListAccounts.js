import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-react'; // Use Clerk's hook to get user details

function ListAccounts({wallet}) {
  const router = useRouter();

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
    console.log(item)
    try {
        router.push({//it has to be push in order to can do .back() then
            pathname: '/walletModal',
            params:{
                accountID: item.accountID,
                beneficiary: item.beneficiary,
                IBAN: item.IBAN,
                BIC: item.BIC,
                quantity: item.quantity
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


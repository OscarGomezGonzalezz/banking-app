import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../../constants/Colors';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ListAccounts from '../../../components/ListAccounts';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { collection, getDocs } from "firebase/firestore"; 
import db from '../../../firebase/firebaseConfig'; 


const Page = ()=>{
    const router = useRouter();
    const headerHeight = useHeaderHeight();
    const [total, setTotal] = useState(0);
    const [wallet, setWallet] = useState([]);
    const { user } = useUser();

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
        async function fetchTotalBalance() {
            if (user?.id) { // Ensure the user is logged in
                try {
                const querySnapshot = await getDocs(collection(db, "users", user.id, "accounts"));
                let totalBalance = 0;
                console.log(querySnapshot)
                querySnapshot.forEach((doc) => {
                    console.log("data", doc.data());
                    totalBalance += doc.data().quantity;
                });
                console.log("totalbalance:",totalBalance);
                setTotal(totalBalance); // Set the accounts data to state
                
                } catch (error) {
                console.error("Error fetching accounts:", error);
                }
            }
        }
        fetchAccounts()
        fetchTotalBalance(); 
      }, []); // Run when refreshing the window
    

    return (
        <ScrollView style={{backgroundColor: Colors.background, flex:1}}
                contentContainerStyle={{
                    paddingTop: headerHeight,//we get the height from our custom header in order not to colapse elements
                    flexGrow: 1, //needed so that wallet container fill the screen down                  
                  }}>

            <View style={styles.container}>    
                <View style={styles.balanceContainer}>
                    <View style={styles.balanceQuantity}>
                        <Text style={styles.balance}>{total?.toFixed(2)}</Text>
                        <Text style={styles.currency}>€</Text>
                    </View>
                    <Text style={styles.subtitle}>Your total balance</Text>
                </View>

                <View style={styles.wallet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>My Wallet</Text>
                        <TouchableOpacity style={styles.roundButton} 
                        onPress={() => router.push('screens/(authenticated)/(modals)/walletModal')}>
                            <Ionicons name="add" size={20} color="white"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listAccounts}>
                        <ListAccounts/>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    paddingHorizontal: 20,
    },
    balanceQuantity: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    balanceContainer: {
        marginTop:10,
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 30

    },
    balance: {
        fontSize: 45,
        fontWeight: 'bold',
    },
    currency: {
        fontSize: 20,
        fontWeight: 500,
    },
    subtitle:{
        marginTop: 5,
        color: Colors.gray,
        fontSize: 16,
    },
    wallet:{
        flex: 1,
        padding: 20,
        paddingTop: 10,
        backgroundColor: Colors.lightGray,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20
    },
    title: {
        fontSize: 20,
        color: Colors.dark,
        fontWeight: "500"
    },
    roundButton: {
        backgroundColor: Colors.secondary, // azul iOS, puedes cambiarlo
        width: 30,
        height: 30,
        borderRadius: 30, // mitad del ancho/alto → círculo perfecto
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    listAccounts:{

    }

    
});
export default Page
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Colors from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ListAccounts from '../../../components/ListAccounts';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { collection, getDocs } from "firebase/firestore"; 
import db from '../../../firebase/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const Page = ()=>{
    const router = useRouter();
    const [total, setTotal] = useState(0);
    const [wallet, setWallet] = useState([]);
    const { user } = useUser();
    const [idDocument, setIdDocument] = useState(user?.unsafeMetadata?.idDocument);
    
    
    //This is necessary for using router.back(), which is more stetic than router.replace().
    //I think this could be solved by using .onSnapShot =>{}, but as this already works smoothly, we wont change it
    useFocusEffect(
  useCallback(() => {
    let isActive = true;

    async function fetchData() {
      if (!user?.id || !isActive) return;

      try {
        // 1️⃣ Fetch accounts and compute base balance
        const snap = await getDocs(collection(db, "users", user.id, "accounts"));
        const accounts = [];
        let baseBalance = 0;

        snap.forEach(docSnap => {
          const data = docSnap.data();
          accounts.push({ id: docSnap.id, ...data });
          baseBalance += data.quantity || 0;
        });

        // 2️⃣ Fetch transactions for each account
        let totalIncome = 0;
        let totalExpenses = 0;

        for (const acct of accounts) {
          const txSnap = await getDocs(
            collection(db, "users", user.id, "accounts", acct.id, "transactions")
          );

          txSnap.forEach(txDoc => {
            const amt = parseFloat(txDoc.data().amount) || 0;
            if (amt > 0) totalIncome += amt;
            else totalExpenses += Math.abs(amt);
          });
        }

        // 3️⃣ Update state once, with adjusted total
        if (isActive) {
          setWallet(accounts);
          setTotal(baseBalance);
        }
      } catch (e) {
        console.error("Error fetching accounts or transactions:", e);
      }
    }

    fetchData();

    return () => {
      isActive = false;
    };
  }, [user?.id])
);

    const handleAddAccount = () => {
        if (!idDocument || idDocument === '' ) {
            router.navigate('/verifyIdentity');
            
        } else {
            router.navigate('/walletModal');
        }
    };

    return (
        <ScrollView style={{ backgroundColor: Colors.background, flex: 1 }}
        contentContainerStyle={{ paddingTop: 60, flexGrow: 1 }}
         >
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
                        <TouchableOpacity style={styles.roundButton} onPress={handleAddAccount}>
                            <Ionicons name="add" size={20} color="white"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listAccounts}>
                        <ListAccounts wallet={wallet}/>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

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
        marginTop: 25,
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
    subtitle: {
        marginTop: 20,
        color: Colors.gray,
        fontSize: 28,
        fontWeight: '500',
        alignSelf: 'center'
    },
    wallet: {
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
        fontSize: 40,
        marginTop: 0,
        fontWeight: 'bold',
        color: Colors.dark,
        marginBottom: 30
    },
    roundButton: {
        backgroundColor: Colors.secondary,
        width: 30,
        height: 30,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    input: {
        backgroundColor: Colors.lightGray,
        padding: 20,
        borderRadius: 16,
        fontSize: 20,
        marginRight: 10,
        marginTop: 10,
        borderWidth: 0
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: "center",
        width: '100%',
        marginTop: 100,
        marginBottom: 35,
        gap: 10,
    },
    countryButton: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: Colors.lightGray,
        borderRadius: 10,
    },
    selectedCountry: {
        backgroundColor: Colors.secondary,
    },
    countryText: {
        fontSize: 18,
    },
    
});

export default Page;

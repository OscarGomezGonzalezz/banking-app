import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput} from 'react-native';

import db from '../../../firebase/firebaseConfig'; 
import { collection, getDocs, getDoc, doc } from "firebase/firestore"; 
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../../constants/Colors';
import WidgetList from '../../../components/SortableList/WidgetList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-react';

const Page = () => {
  const { user } = useUser();
  const [limit, setLimit] = useState(user?.unsafeMetadata?.limit);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [expensesByAccount, setExpensesByAccount] = useState({}); 
  const [expensesByCategory, setExpensesByCategory] = useState({}); 
  const [accountsLoaded, setAccountsLoaded] = useState(false); // Estado para controlar la carga de cuentas
  const [step, setStep] = useState(() => (limit > 0 ? 2 : 0));
  // step 0 = setAlert btn, 1 = input, 2 = progress circle

  const progress = limit > 0 ? totalExpenses / limit : 0;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchSpent() {
        if (!user?.id || !isActive) return;

        try {
          const accountsSnap = await getDocs(
            collection(db, "users", user.id, "accounts")
          );

          let globalExpenses = 0;
          const perAccount = {};
          const perCategory = {};

          for (const acctDoc of accountsSnap.docs) {
            const acctId = acctDoc.id;
            const accountRef = doc(db, 'users', user.id, 'accounts', acctId);
            const accountSnap = await getDoc(accountRef);
            if (!accountSnap.exists()) {
              setError('Selected account not found.');
              return;
            }
          const iban = accountSnap.data().IBAN;
            let acctExpenses = 0;

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);


            const txSnap = await getDocs(
              collection(db, "users", user.id, "accounts", acctId, "transactions")
            );

            txSnap.forEach(txDoc => {
              const amount = parseFloat(txDoc.data().amount) || 0;
              const txDate = txDoc.data().date?.toDate?.(); // Firestore Timestamp → JS Date
              if (amount < 0 && txDate && txDate >= startOfMonth && txDate <= endOfMonth) {
                const absAmt = Math.abs(amount);
                acctExpenses += absAmt;
                globalExpenses += absAmt;
                
                const category = txDoc.data().category || 'Uncategorized';
                if (!perCategory[category]) {
                  perCategory[category] = 0;
                }
                perCategory[category] += absAmt;
              
              }
            });

            perAccount[iban] = acctExpenses;
          }

          if (isActive) {
            setExpensesByAccount(perAccount);
            setTotalExpenses(globalExpenses);
            setExpensesByCategory(perCategory); 
            setAccountsLoaded(true);
          }
        } catch (err) {
          console.error("Error fetching expenses:", err);
        }
      }

      fetchSpent();


      return () => {
        isActive = false;
      };
    }, [user?.id])
  );


  return (
    <GestureHandlerRootView style={{ flex: 1, paddingHorizontal:10 }}>
      <ScrollView
        style={{ backgroundColor: Colors.background }}
        contentContainerStyle={{
          paddingTop: 60,
          flexGrow: 1,
          paddingHorizontal: 10,
          justifyContent: 'center',
        }}
      >
        {step === 0 && (
          <TouchableOpacity
            onPress={() => setStep(1)}
            style={[styles.centered, {marginBottom: 105}]}
          >
            <Text style={styles.title}>Set an expense alert</Text>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        )}

        {step === 1 && (
          <View style={styles.centered}>
            <Text style={styles.inputLabel}>Insert your budget:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500"
              keyboardType="numeric"
              value={limit > 0 ? String(limit) : ''}
              onChangeText={text => setLimit(Number(text))}
            />
            <View style={styles.buttons}>
            <TouchableOpacity
              onPress={ async () => {
                if (limit > 0){
                    try{
                        await user?.update({
                            unsafeMetadata: {
                            ...user.unsafeMetadata,  // valores previos
                            limit,}
                        });
                        setStep(2);
                    } catch (e){
                        console.error(e);
                    }

                } 
              }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if(limit > 0){

                    setStep(2);
                } else{
                    setStep(0);
                }
              }}
              style={[styles.saveButton, {backgroundColor: Colors.secondary}]}
            >
              <Text style={styles.saveButtonText}>Cancel</Text>
            </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.centered}>
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={Math.min(progress, 1) * 100}
              tintColor={progress >= 1 ? 'red' : '#00e0ff'}
              backgroundColor="#e0e0e0"
            >
              {() => (
                <Text style={styles.percentText}>
                  {Math.round(progress * 100)}%
                </Text>
              )}
            </AnimatedCircularProgress>
            <Text style={styles.statusText}>
              You've spent {totalExpenses}€ of {limit}€
            </Text>
            <TouchableOpacity
              onPress={() => {
                setStep(1);
              }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Modify your budget</Text>
            </TouchableOpacity>
            {progress >= 1 && (
              <Text style={styles.warningText}>
                ⚠️ You've reached your spending limit!
              </Text>
            )}
          </View>
        )}

        <View style={{ flex: 1}}>
          <WidgetList spent={totalExpenses} expensesByAccount={expensesByAccount} expensesByCategory={expensesByCategory}/>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.dark,
    fontWeight: 'bold',
  },
  input: {
    width: '60%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  saveButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignSelf: 'center'
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  percentText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.dark,
    fontWeight: 'bold',
  },
  warningText: {
    marginTop: 8,
    color: 'red',
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  }
});

export default Page;

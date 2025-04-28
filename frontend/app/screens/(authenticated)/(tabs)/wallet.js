import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert } from 'react-native';
import Colors from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ListAccounts from '../../../components/ListAccounts';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { collection, getDocs } from "firebase/firestore"; 
import { SelectList } from 'react-native-dropdown-select-list'
import db from '../../../firebase/firebaseConfig'; 
import { CustomButton } from '../../../index';

const Page = ()=>{
    const router = useRouter();
    const [total, setTotal] = useState(0);
    const [wallet, setWallet] = useState([]);
    const { user } = useUser();
    const [idDocument, setIdDocument] = useState(user?.unsafeMetadata?.idDocument);
    const [firstName, setFirstName] = useState(user?.firstName);//in case there is username...
    const [lastName, setLastName] = useState(user?.lastName);

    const [country, setCountry] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const data = [
        {key:'Spain', value:'Spain'},
        {key:'Germany', value:'Germany'},
        {key:'France', value:'France'},
        {key:'Passport', value:'Passport'},
        
    ]

    const publicMetadata = user.publicMetadata;

    useEffect(() => {
        async function fetchWalletBalance() {

            if (user?.id) {
              try {
                const querySnapshot = await getDocs(collection(db, "users", user.id, "accounts"));
                const accounts = [];
                let totalBalance = 0;
                querySnapshot.forEach((doc) => {
                totalBalance += doc.data().quantity;
                  accounts.push(doc.data());
                });
                setTotal(totalBalance); 
                setWallet(accounts);
              } catch (error) {
                console.error("Error fetching accounts:", error);
              }
            }
        }
        fetchWalletBalance();
    }, [wallet]);

    function validateDocument() {
        console.log(country)
        switch (country.toLowerCase()) {
            case 'spain':
                return validateSpanishDNI();
            case 'germany':
                return validateGermanID();
            case 'france':
                return validateFrenchID();
            case 'passport':
                return validatePassport();
            default:
                return false; 
        }
    }

    function validateSpanishDNI() {
        const dniRegex = /^\d{8}[A-Z]$/i;
        return dniRegex.test(idDocument);
    }

    function validateGermanID() {
        const germanIdRegex = /^[0-9]{10}$/;
        return germanIdRegex.test(idDocument);
    }

    function validateFrenchID() {
        const frenchIdRegex = /^[0-9A-Z]{12}$/i;
        return frenchIdRegex.test(idDocument);
    }

    function validatePassport() {
        const passportRegex = /^[A-Z0-9]{6,9}$/i;
        return passportRegex.test(idDocument);
    }

    const handleAddAccount = () => {
        if (!idDocument) {
            setModalVisible(true);
        } else {
            router.push('screens/(authenticated)/(modals)/walletModal');
        }
    };
    const saveUser = async () => {
        try {
            //PUBLIC AND PRIVATE METADATA CAN ONLY BE MODIFIED FROM THE BACKEND API, SO
            // AS WE OUR APP DEALS WITH FICTICIOUS DATA WE WILL USE UNSAFE METADATA, WHICH 
            // IS ABLE TO BE MODIFIED IN FRONTEND
            // SOURCE: https://clerk.com/docs/references/javascript/user

            await user?.update({
                 firstName: firstName,
                 lastName: lastName,
                 unsafeMetadata: { idDocument: idDocument },
                });
            

            setModalVisible(false);
            router.push('screens/(authenticated)/(modals)/walletModal');
          } catch (error) {
            console.error(error);
          } finally {
            setModalVisible(false);
            router.push('screens/(authenticated)/(modals)/walletModal');
          }
    }
    const handleSubmitDocument = () => {
        if (!country || country.trim().length === 0) {
            setError('Please select the country of your document');
            return;
        }
        if (!idDocument || idDocument.trim().length === 0) {
            setError('Please, enter a valid id');
            return;
        }
        if (!validateDocument()) {
            setError('The document format is invalid. Make sure it complies with regulations');
            return;
        }

        if (!firstName || firstName.trim().length < 3 && !lastName || lastName.trim().length < 3) {
            setError("Enter the first and last name of the beneficiary");
            return;
        }
        saveUser();
        //VER SI NOS PIDE VERIFICAR CON BASE DE DATOS FICTICIA

    };

    return (
        <ScrollView style={{ backgroundColor: Colors.background, flex: 1 }} contentContainerStyle={{ paddingTop: 60, flexGrow: 1 }}>
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
                        <ListAccounts />
                    </View>
                </View>
            </View>

            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View style={{ flex: 1, paddingTop: 100, backgroundColor: 'white', paddingHorizontal: 20 }}>
                    <Text style={styles.title}>We need first to verify your identity</Text>
                    <SelectList 
                        setSelected={(value) => setCountry(value)} 
                        data={data} 
                        save="value"
                        placeholder='Select the country of your document'
                        dropdownStyles={{
                            backgroundColor: Colors.lightGray, // color de fondo del menú desplegable
                        }}
                        boxStyles={styles.input} // Se lo aplicas aquí
                        inputStyles={{
                            fontSize: 18, // porque el tamaño del texto va aparte
                            color: '#000' // opcional, para el color del texto
                        }}
                        
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Enter your ID document number"
                        placeholderTextColor={Colors.gray}
                        value={idDocument}
                        onChangeText={setIdDocument}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="First name"
                        placeholderTextColor={Colors.gray}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Last name"
                        placeholderTextColor={Colors.gray}
                        value={lastName}
                        onChangeText={setLastName}
                    />

                    <View style={{ alignSelf: 'center', marginTop: 20 }}>
                        {error ? <Text style={{ color: "red", fontSize: 18 }}>{error}</Text> : null}
                    </View>

                    <Text style={styles.subtitle}>
                        <Ionicons name="information-circle" size={28} color={Colors.gray} />
                        Attention 
                    </Text>
                    <Text style={[styles.subtitle, { fontSize: 16 }]}>
                        Your full name must match exactly with the beneficiary name of any bank accounts added in this app.
                        This helps to ensure security and prevent fraudulent activity.
                    </Text>

                    <View style={styles.footer}>
                        <CustomButton title="Continue" onPress={handleSubmitDocument} isRegister isDisabled={idDocument === ''} />
                        <CustomButton title="Cancel" onPress={() => setModalVisible(false)} isRegister isDelete />
                    </View>
                </View>
            </Modal>
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

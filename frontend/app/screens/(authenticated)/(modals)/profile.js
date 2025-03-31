import {View, Text, TouchableOpacity, StyleSheet, Image, TextInput} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useState } from 'react';
import { BlurView } from 'expo-blur';
import Colors from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Profile = ()=>{
    const { user } = useUser();
    const { signOut } = useAuth();
    const [firstName, setFirstName] = useState(user?.firstName);//in case there is username...
    const [lastName, setLastName] = useState(user?.lastName);
    const [edit, setEdit] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        try {
          await signOut()
          router.push("/screens");

        } catch (err) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(err, null, 2))
        }
      }

  const onSaveUser = async () => {
    try {
      await user?.update({ firstName: firstName, lastName: lastName });
      setEdit(false);
    } catch (error) {
      console.error(error);
    } finally {
      setEdit(false);
    }
  };
 
    return (
        <BlurView intensity={80} tint='dark' style={{flex:1, paddingTop:100,backgroundColor:Colors.gray}}>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={{}} style={styles.captureBtn}>
                    {user?.imageUrl &&//the imageUrl is fetched from Clerk, as its a inherent property of each user
                     <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />}
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', gap: 6}}>
                    {!edit && (
                        <View style={styles.noEdit}>
                            <Text style={{ fontSize: 26, color: 'white' }}>
                                {firstName} {lastName}
                            </Text>
                            <TouchableOpacity onPress={() => setEdit(true)}>
                                <Ionicons name="create-outline" size={24} color={'white'} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {edit && (//if we press the box (setEdit = true), we display the following
                        <View style={styles.editRow}>
                        <TextInput
                            placeholder="First Name"
                            value={firstName || ''}
                            onChangeText={setFirstName}
                            style={[styles.inputField]}
                        />
                        <TextInput
                            placeholder="Last Name"
                            value={lastName || ''}
                            onChangeText={setLastName}
                            style={[styles.inputField]}
                        />
                        <TouchableOpacity onPress={onSaveUser}>
                            <Ionicons name="checkmark-outline" size={24} color={'white'} />
                        </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.actions}>
                

                <TouchableOpacity style={styles.btn}>
                    <Ionicons name="shield-checkmark-outline" size={24} color={'#fff'} />
                    <Text style={{ color: '#fff', fontSize: 18 }}>Consents and rights</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn}>
                    <Ionicons name="document-text-outline" size={24} color={'#fff'} />
                    <Text style={{ color: '#fff', fontSize: 18 }}>Privacy policy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn}>
                    <Ionicons name="bulb" size={24} color={'#fff'} />
                    <Text style={{ color: '#fff', fontSize: 18 }}>Learn</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn}>
                    <Ionicons name="megaphone" size={24} color={'#fff'} />
                    <Text style={{ color: '#fff', fontSize: 18, flex: 1 }}>Inbox</Text>
                    <View
                        style={{
                        backgroundColor: Colors.secondary,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        justifyContent: 'center',
                        }}>
                        <Text style={{ color: '#fff', fontSize: 12 }}>5</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, {backgroundColor: '#855050'}]} onPress={() => handleSignOut()}>
                    <Ionicons name="log-out" size={24} color={'#fff'} />
                    <Text style={{ color: '#fff', fontSize: 18 }}>Log out</Text>
                </TouchableOpacity>
            </View>

      <View style={styles.actions}>
      </View>
        </BlurView>
    )
}
const styles = StyleSheet.create({
    noEdit:{
        justifyContent: "center",
        flexDirection: "column",
        gap: 10,
        marginTop: 20,
        alignItems: "center",
    },
    editRow: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: Colors.gray,
    },
    captureBtn: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: Colors.gray,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputField: {
      width: 140,
      height: 44,
      borderWidth: 1,
      borderColor: Colors.gray,
      borderRadius: 8,
      padding: 10,
      backgroundColor: '#fff',
    },
    actions: {
      backgroundColor: 'rgba(256, 256, 256, 0.1)',
      borderRadius: 16,
      gap: 0,
      margin: 20,
    },
    btn: {
      padding: 14,
      flexDirection: 'row',
      gap: 20,
    },
  });
export default Profile
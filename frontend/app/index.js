import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';

export default function App() {
  const [ovpnFiles, setOvpnFiles] = useState([]); // Store the .ovpn files
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch the .ovpn files from the backend API
    const fetchOvpnFiles = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/ovpn');
        const data = await response.json();
        setOvpnFiles(data); // Set the .ovpn files to state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching .ovpn files:', error);
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchOvpnFiles(); // Call the function to fetch data
  }, []);

  const handleConnectToVpn = (id) => {
    // Logic to handle connecting to the selected VPN file (e.g., via react-native-simple-openvpn)
    console.log('Connecting to VPN file with ID:', id);
  };

  return (
    <View style={styles.container}>
      <Text>OpenVPN Files</Text>
      
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={ovpnFiles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.fileContainer}>
              <Text>{item.filename}</Text>
              <Button
                title="Connect"
                onPress={() => handleConnectToVpn(item._id)}
              />
            </View>
          )}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});
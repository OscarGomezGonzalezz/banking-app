import { View, Text, ScrollView } from 'react-native';

const Correspondences = () => {
  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#F5F5F5' }}>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Your Correspondences</Text>

      <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Account Activity Notification</Text>
        <Text style={{ color: '#555' }}>
          We noticed a recent login to your account from a new device. If this wasn't you, please update your password immediately.
        </Text>
      </View>

      <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Your Recent Transfer</Text>
        <Text style={{ color: '#555' }}>
          Your recent transfer of $500 to John Doe was successful. The transaction ID is #12345.
        </Text>
      </View>

      <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Balance Update</Text>
        <Text style={{ color: '#555' }}>
          Your account balance has been updated. Your current balance is $2,350.
        </Text>
      </View>

      <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Fraud Alert</Text>
        <Text style={{ color: '#555' }}>
          We detected suspicious activity on your account. Please verify recent transactions to ensure they were authorized.
        </Text>
      </View>

      <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Security Update</Text>
        <Text style={{ color: '#555' }}>
          A security update was successfully applied to your account. No further action is required from your side.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Correspondences;

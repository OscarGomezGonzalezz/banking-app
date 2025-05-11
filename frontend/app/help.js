import { View, Text, ScrollView } from 'react-native';

const Help = () => {

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#F5F5F5' }}>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Help & Support</Text>

      <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Can I hold bank accounts from other people?</Text>
        <Text style={{ color: '#555' }}>
          No, you just can manage bank accounts where you are the beneficiary. This helps ensure security and prevent fraudulent activity
        </Text>
      </View>

      <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>What should I do if I detect suspicious activity?</Text>
        <Text style={{ color: '#555' }}>
          Contact our support team immediately through the app or call our emergency hotline at 123-456-789.
        </Text>
      </View>

      <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>How can I update my personal information?</Text>
        <Text style={{ color: '#555' }}>
          You can update your first and last name in the Profile section. For changing your phone number contact with support
        </Text>
      </View>

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Need more help?</Text>
      <Text style={{ color: '#555', marginBottom: 5 }}>Contact us at support@bankapp.com or call +1 800 123 4567.</Text>
    </ScrollView>
  );
};

export default Help;

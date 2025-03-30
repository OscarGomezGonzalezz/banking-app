import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const PhoneScreen = () => {
  const { phone, signin } = useLocalSearchParams();
  console.log(phone); // "123456789"
  console.log(signin); // "true"

  return (
    <View>
      <Text>Número de teléfono: {phone}</Text>
    </View>
  );
};

export default PhoneScreen;

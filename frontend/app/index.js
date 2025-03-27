import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from './constants/Colors';
import { ResizeMode, Video } from 'expo-av';

export const CustomButton = ({ title, onPress, isRegister, isDisabled }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isRegister && styles.registerButton, // Register button color
        isHovered && styles.hovered, // Hover effect
        isDisabled && styles.disabled,//set disbled unless an action is performed
      ]}
      onPress={onPress}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/indexVideo.mp4')}
        resizeMode={ResizeMode.COVER}
        isMuted
        isLooping
        shouldPlay
        style={styles.video}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to your BankApp</Text>
        <View style={styles.buttons}>
          <CustomButton title="Login" onPress={() => router.push('screens/login')} />
          <CustomButton title="Register" onPress={() => router.push('screens/register')} isRegister />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    marginBottom: 10,
    fontWeight: 'bold',
    color: Colors.background,
  },
  header: {
    marginTop: 70,
    padding: 20,
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top:0,
    left:0
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 450,
    gap: 20,
  },
  button: {
    flex: 1,
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center',
    backgroundColor: Colors.primary, // Default button color

  },
  registerButton: {
    backgroundColor: Colors.secondary, // Special color for Register
  },
  hovered: {
    backgroundColor: Colors.primaryMuted, // Change color on hover
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});
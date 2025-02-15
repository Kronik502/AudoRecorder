// RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    const newCredentials = { username, password };
    try {
      await AsyncStorage.setItem('userCredentials', JSON.stringify(newCredentials));
      Alert.alert('Success', 'Registration successful');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Failed to save credentials', error);
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.toggleText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#000', // Black background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#FF5722', // White text
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff', // White border
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#333', // Dark background for inputs
    color: '#fff', // White text
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF5722', // Red button
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleText: {
    textAlign: 'center',
    color: '#FF5722', // Red text
    marginTop: 12,
    fontSize: 16,
  },
});

export default RegisterScreen;

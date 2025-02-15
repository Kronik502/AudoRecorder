// LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [storedCredentials, setStoredCredentials] = useState(null);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem('userCredentials');
        if (savedCredentials) {
          setStoredCredentials(JSON.parse(savedCredentials));
        }
      } catch (error) {
        console.error('Failed to load credentials', error);
      }
    };
    loadCredentials();
  }, []);

  const handleLogin = () => {
    if (
      storedCredentials &&
      username === storedCredentials.username &&
      password === storedCredentials.password
    ) {
      Alert.alert('Success', `Welcome, ${username}!`);
      navigation.navigate('RecordingScreen');
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.toggleText}>Don't have an account? Register</Text>
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

export default LoginScreen;

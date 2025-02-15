import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Switch, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LetterAvatar from 'react-native-letter-avatar';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem('userCredentials');
        if (storedCredentials) {
          const { username, password, phoneNumber, isOnline, isDarkMode } = JSON.parse(storedCredentials);
          setUsername(username);
          setPassword(password);
          setPhoneNumber(phoneNumber);
          setIsOnline(isOnline);
          setIsDarkMode(isDarkMode);
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isEditing ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isEditing]);

  const handleUpdate = async () => {
    if (!username || !password || !phoneNumber) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const updatedCredentials = { username, password, phoneNumber, isOnline, isDarkMode };
    try {
      await AsyncStorage.setItem('userCredentials', JSON.stringify(updatedCredentials));
      Alert.alert('Success', 'Profile updated!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
      <Text style={styles.title}>{isEditing ? 'Edit Profile' : 'Profile'}</Text>

      {/* Avatar and Username */}
      <View style={styles.avatarContainer}>
        <LetterAvatar name={username} size={60} />
        <Text style={styles.username}>{username}</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileDetails}>
        {isEditing ? (
          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#bbb" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#bbb" secureTextEntry value={password} onChangeText={setPassword} />
            <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#bbb" value={phoneNumber} onChangeText={setPhoneNumber} />
          </Animated.View>
        ) : (
          <View>
            <Text style={styles.infoText}>👤 Username: {username}</Text>
            <Text style={styles.infoText}>🔒 Password: ****</Text>
            <Text style={styles.infoText}>📞 Phone: {phoneNumber}</Text>
          </View>
        )}
      </View>

      {/* Switches */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {isOnline ? 'Online' : 'Offline'}</Text>
        <Switch value={isOnline} onValueChange={setIsOnline} />
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      {/* Edit & Save Button */}
      <TouchableOpacity style={styles.button} onPress={isEditing ? handleUpdate : () => setIsEditing(true)}>
        <Text style={styles.buttonText}>{isEditing ? 'Save Changes' : 'Edit Profile'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// 🎨 **Styles for a sleek modern UI**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  darkMode: {
    backgroundColor: '#1E1E1E',
  },
  lightMode: {
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#f77d2b',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
  },
  profileDetails: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: '#fff',
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#f77d2b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProfileScreen;

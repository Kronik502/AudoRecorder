import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RecordingScreen from './screens/RecordingScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="RecordingScreen"
          component={RecordingScreen}
          options={({ navigation }) => ({
            title: 'Recording',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                <Icon name="person-circle" size={30} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: 'Register' }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

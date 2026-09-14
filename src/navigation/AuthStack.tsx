import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import PinEntryScreen from '../screens/Auth/PinEntryScreen';

const Stack = createNativeStackNavigator();

const AuthStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="PinEntry" component={PinEntryScreen} options={{ animation: 'slide_from_bottom' }} />
  </Stack.Navigator>
);

export default AuthStack;

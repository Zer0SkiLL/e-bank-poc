import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import AccountListScreen from '../screens/Accounts/AccountListScreen';
import AccountDetailsScreen from '../screens/Accounts/AccountDetailsScreen';
import TransactionListScreen from '../screens/Transactions/TransactionListScreen';
import TransactionDetailScreen from '../screens/Transactions/TransactionDetailScreen';
import SendMoneyScreen from '../screens/Payments/SendMoneyScreen';
import PaymentConfirmationScreen from '../screens/Payments/PaymentConfirmationScreen';
import PaymentSuccessScreen from '../screens/Payments/PaymentSuccessScreen';
import PaymentFailedScreen from '../screens/Payments/PaymentFailedScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

import { View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();
const AccountsStack = createNativeStackNavigator();
const TransactionsStack = createNativeStackNavigator();
const PaymentsStack = createNativeStackNavigator();
const SettingsStackNav = createNativeStackNavigator();

const screenOptions = { headerShown: false };

const DashboardStackScreen = () => (
  <DashboardStack.Navigator screenOptions={screenOptions}>
    <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
  </DashboardStack.Navigator>
);

const AccountsStackScreen = () => (
  <AccountsStack.Navigator screenOptions={screenOptions}>
    <AccountsStack.Screen name="AccountList" component={AccountListScreen} />
    <AccountsStack.Screen name="AccountDetails" component={AccountDetailsScreen} />
  </AccountsStack.Navigator>
);

const TransactionsStackScreen = () => (
  <TransactionsStack.Navigator screenOptions={screenOptions}>
    <TransactionsStack.Screen name="TransactionList" component={TransactionListScreen} />
    <TransactionsStack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
  </TransactionsStack.Navigator>
);

const PaymentsStackScreen = () => (
  <PaymentsStack.Navigator screenOptions={screenOptions}>
    <PaymentsStack.Screen name="SendMoney" component={SendMoneyScreen} />
    <PaymentsStack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
    <PaymentsStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
    <PaymentsStack.Screen name="PaymentFailed" component={PaymentFailedScreen} />
  </PaymentsStack.Navigator>
);

const SettingsStackScreen = () => (
  <SettingsStackNav.Navigator screenOptions={screenOptions}>
    <SettingsStackNav.Screen name="SettingsMain" component={SettingsScreen} />
  </SettingsStackNav.Navigator>
);

const MainTabs: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          switch (route.name) {
            case 'Home': iconName = 'home'; break;
            case 'Accounts': iconName = 'credit-card'; break;
            case 'Payments': iconName = 'send'; break;
            case 'Transactions': iconName = 'list'; break;
            case 'Settings': iconName = 'settings'; break;
          }
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBackground,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardStackScreen} />
      <Tab.Screen name="Accounts" component={AccountsStackScreen} />
      <Tab.Screen name="Payments" component={PaymentsStackScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View style={[styles.paymentsIcon, { backgroundColor: focused ? colors.primary : colors.tabInactive, width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }]}>
              <Feather name="send" size={22} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tab.Screen name="Transactions" component={TransactionsStackScreen} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  paymentsIcon: {},
});

export default MainTabs;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { accountService } from '../../services/accountService';
import { Account, AccountsStackParamList } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Spacing, Typography } from '../../constants';

import AccountCard from '../../components/AccountCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import BalanceCard from '../../components/BalanceCard';

type AccountListNavProp = NativeStackNavigationProp<AccountsStackParamList, 'AccountList'>;

const AccountListScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<AccountListNavProp>();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleAccountPress = (account: Account) => {
    navigation.navigate('AccountDetails', { account });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Accounts</Text>
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AccountCard account={item} onPress={() => handleAccountPress(item)} />
        )}
        ListHeaderComponent={
          <BalanceCard totalBalance={totalBalance} accountCount={accounts.length} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="credit-card"
            message="No accounts found"
            subMessage="Your accounts will appear here"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});

export default AccountListScreen;

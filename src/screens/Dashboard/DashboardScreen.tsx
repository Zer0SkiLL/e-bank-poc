import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import { Account, Transaction, DashboardStackParamList } from '../../types';
import { getGreeting } from '../../utils/formatters';
import { Spacing, Typography } from '../../constants';

import BalanceCard from '../../components/BalanceCard';
import QuickAction from '../../components/QuickAction';
import AccountCard from '../../components/AccountCard';
import TransactionItem from '../../components/TransactionItem';
import SectionHeader from '../../components/SectionHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

type DashboardNavProp = NativeStackNavigationProp<DashboardStackParamList>;

const DashboardScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<DashboardNavProp>();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [accountsData, transactionsData] = await Promise.all([
        accountService.getAccounts(),
        transactionService.getTransactions(undefined, 1, 5),
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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
    // Navigate to Accounts tab with AccountDetails screen
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Accounts', { screen: 'AccountDetails', params: { account } });
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Transactions', { screen: 'TransactionDetail', params: { transaction } });
    }
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.firstName || 'User'} 👋
            </Text>
          </View>
        </View>

        {/* Balance Card */}
        <BalanceCard totalBalance={totalBalance} accountCount={accounts.length} />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction
            icon="send"
            label="Send"
            color="#6C63FF"
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('Payments', { screen: 'SendMoney' });
              }
            }}
          />
          <QuickAction
            icon="download"
            label="Receive"
            color="#00C9A7"
            onPress={() => {
              Alert.alert('Receive', 'Share your account details to receive money.');
            }}
          />
          <QuickAction
            icon="credit-card"
            label="Pay"
            color="#F59E0B"
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('Payments');
              }
            }}
          />
          <QuickAction
            icon="maximize"
            label="Scan"
            color="#8B5CF6"
            onPress={() => {
              Alert.alert('Scan', 'QR Scanner coming soon.');
            }}
          />
        </View>

        {/* Accounts Section */}
        <SectionHeader
          title="Accounts"
          actionLabel="See All"
          onAction={() => {
            // Navigate to Accounts tab - use parent navigator
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('Accounts');
            }
          }}
        />

        {accounts.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accountsScroll}
          >
            {accounts.map((account) => (
              <View key={account.id} style={styles.accountCardWrapper}>
                <AccountCard
                  account={account}
                  onPress={() => handleAccountPress(account)}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <EmptyState icon="credit-card" message="No accounts found" />
        )}

        {/* Recent Transactions Section */}
        <SectionHeader
          title="Recent Transactions"
          actionLabel="See All"
          onAction={() => {
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('Transactions');
            }
          }}
        />

        {transactions.length > 0 ? (
          <View style={[styles.transactionsCard, { backgroundColor: colors.card }]}>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction)}
              />
            ))}
          </View>
        ) : (
          <EmptyState icon="list" message="No recent transactions" />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  greeting: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
    marginBottom: 2,
  },
  userName: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  accountsScroll: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.sm,
  },
  accountCardWrapper: {
    width: 300,
    marginRight: Spacing.sm,
  },
  transactionsCard: {
    marginHorizontal: Spacing.base,
    borderRadius: 14,
    overflow: 'hidden',
  },
  bottomPadding: {
    height: Spacing.lg,
  },
});

export default DashboardScreen;

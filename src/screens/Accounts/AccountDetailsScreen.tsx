import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import { AccountsStackParamList, Transaction, BalanceHistory } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Spacing, BorderRadius, Typography, Shadows } from '../../constants';

import TransactionItem from '../../components/TransactionItem';
import SectionHeader from '../../components/SectionHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import CustomBarChart from '../../components/CustomBarChart';

type AccountDetailsNavProp = NativeStackNavigationProp<AccountsStackParamList, 'AccountDetails'>;
type AccountDetailsRouteProp = RouteProp<AccountsStackParamList, 'AccountDetails'>;

const AccountDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<AccountDetailsNavProp>();
  const route = useRoute<AccountDetailsRouteProp>();
  const { account } = route.params;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [transactionsData, historyData] = await Promise.all([
        transactionService.getTransactionsByAccount(account.id),
        accountService.getBalanceHistory(account.id),
      ]);
      setTransactions(transactionsData.slice(0, 5));
      setBalanceHistory(historyData);
    } catch (error) {
      console.error('Failed to load account details:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [account.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTransactionPress = (transaction: Transaction) => {
    // Placeholder - will be handled in Transactions phase
  };

  const handleSendMoney = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Payments');
    }
  };

  const handleViewAllTransactions = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Transactions');
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'checking': return '#6C63FF';
      case 'savings': return '#00C9A7';
      case 'credit': return '#F59E0B';
      case 'investment': return '#8B5CF6';
      default: return colors.textSecondary;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  const chartData = balanceHistory.map((h) => ({
    date: h.date,
    value: h.balance,
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Account Details</Text>
        <View style={styles.backButton} />
      </View>

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
        {/* Account Info Card */}
        <View style={[styles.accountCard, { backgroundColor: colors.card }, Shadows.md]}>
          <View style={styles.accountHeader}>
            <View style={[styles.iconCircle, { backgroundColor: (account.color || colors.primary) + '15' }]}>
              <Feather
                name={account.icon as keyof typeof Feather.glyphMap || 'credit-card'}
                size={24}
                color={account.color || colors.primary}
              />
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: colors.text }]}>{account.name}</Text>
              <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(account.type) + '15' }]}>
                <Text style={[styles.typeText, { color: getTypeBadgeColor(account.type) }]}>
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>
            {formatCurrency(account.balance, account.currency)}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.accountMeta}>
            <Text style={[styles.metaLabel, { color: colors.textLight }]}>Account Number</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{account.number}</Text>
          </View>
        </View>

        {/* Balance History Chart */}
        <SectionHeader title="Balance History" />

        {chartData.length > 0 ? (
          <View style={[styles.chartCard, { backgroundColor: colors.card }, Shadows.sm]}>
            <CustomBarChart data={chartData} height={160} />
          </View>
        ) : (
          <EmptyState icon="bar-chart" message="No balance history available" />
        )}

        {/* Recent Transactions */}
        <SectionHeader title="Recent Transactions" />

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
          <EmptyState icon="list" message="No transactions yet" />
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={handleSendMoney}
            activeOpacity={0.8}
          >
            <Feather name="send" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Send Money</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={handleViewAllTransactions}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              View All Transactions
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  accountCard: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  typeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  balanceLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: Typography.sizes['4xl'],
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.base,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.base,
  },
  accountMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
  },
  metaValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
  },
  chartCard: {
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  transactionsCard: {
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  actions: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  bottomPadding: {
    height: Spacing.lg,
  },
});

export default AccountDetailsScreen;

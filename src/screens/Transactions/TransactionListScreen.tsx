import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { transactionService } from '../../services/transactionService';
import {
  Transaction,
  TransactionFilter,
  TransactionCategory,
  TransactionType,
  TransactionsStackParamList,
} from '../../types';
import { getTransactionDateGroup } from '../../utils/formatters';
import { Spacing, Typography } from '../../constants';

import SearchBar from '../../components/SearchBar';
import FilterChip from '../../components/FilterChip';
import TransactionItem from '../../components/TransactionItem';
import SectionHeader from '../../components/SectionHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

type TransactionListNavProp = NativeStackNavigationProp<TransactionsStackParamList, 'TransactionList'>;
type TransactionListRouteProp = RouteProp<TransactionsStackParamList, 'TransactionList'>;

const CATEGORY_FILTERS: { label: string; value?: TransactionCategory }[] = [
  { label: 'All' },
  { label: 'Food', value: 'food' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Transport', value: 'transport' },
  { label: 'Bills', value: 'bills' },
  { label: 'Transfer', value: 'transfer' },
  { label: 'Entertainment', value: 'entertainment' },
];

const TYPE_FILTERS: { label: string; value?: TransactionType }[] = [
  { label: 'All Types' },
  { label: 'Income', value: 'credit' },
  { label: 'Expense', value: 'debit' },
];

interface SectionData {
  title: string;
  data: Transaction[];
}

const TransactionListScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<TransactionListNavProp>();
  const route = useRoute<TransactionListRouteProp>();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | undefined>(
    route.params?.filter?.category
  );
  const [selectedType, setSelectedType] = useState<TransactionType | undefined>(
    route.params?.filter?.type
  );

  const filter: TransactionFilter = useMemo(() => ({
    search: searchText || undefined,
    category: selectedCategory,
    type: selectedType,
    accountId: route.params?.accountId,
  }), [searchText, selectedCategory, selectedType, route.params?.accountId]);

  const loadTransactions = useCallback(async () => {
    try {
      const data = await transactionService.getTransactions(filter);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    setIsLoading(true);
    loadTransactions();
  }, [loadTransactions]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTransactions();
  }, [loadTransactions]);

  const sections: SectionData[] = useMemo(() => {
    const groupMap: Record<string, Transaction[]> = {};
    const groupOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Earlier'];

    for (const txn of transactions) {
      const group = getTransactionDateGroup(txn.date);
      if (!groupMap[group]) {
        groupMap[group] = [];
      }
      groupMap[group].push(txn);
    }

    return groupOrder
      .filter((title) => groupMap[title] && groupMap[title].length > 0)
      .map((title) => ({
        title,
        data: groupMap[title],
      }));
  }, [transactions]);

  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate('TransactionDetail', { transaction });
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Transactions</Text>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search transactions..."
      />

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {CATEGORY_FILTERS.map((chip) => (
          <FilterChip
            key={chip.label}
            label={chip.label}
            isActive={chip.value === undefined ? !selectedCategory : selectedCategory === chip.value}
            onPress={() => setSelectedCategory(chip.value)}
          />
        ))}
      </ScrollView>

      {/* Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {TYPE_FILTERS.map((chip) => (
          <FilterChip
            key={chip.label}
            label={chip.label}
            isActive={chip.value === undefined ? !selectedType : selectedType === chip.value}
            onPress={() => setSelectedType(chip.value)}
          />
        ))}
      </ScrollView>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <EmptyState
          icon="search"
          message="No transactions found"
          subMessage="Try adjusting your filters or search terms"
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onPress={() => handleTransactionPress(item)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={title} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
  },
  filterRow: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});

export default TransactionListScreen;

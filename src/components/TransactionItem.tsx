import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius, Typography } from '../constants';
import { Transaction } from '../types';
import { getCategoryIcon, getCategoryColor, formatCurrency } from '../utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
  onPress: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const { colors } = useTheme();
  const isCredit = transaction.type === 'credit';
  const amountColor = isCredit ? colors.success : colors.error;
  const prefix = isCredit ? '+' : '-';
  const categoryColor = getCategoryColor(transaction.category);
  const categoryName = getCategoryIcon(transaction.category);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: categoryColor + '15' }]}>
        <Feather
          name={categoryName as keyof typeof Feather.glyphMap}
          size={18}
          color={categoryColor}
        />
      </View>

      <View style={styles.details}>
        <Text style={[styles.description, { color: colors.text }]} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={[styles.dateTime, { color: colors.textLight }]}>
          {transaction.date} · {transaction.time}
        </Text>
      </View>

      <Text style={[styles.amount, { color: amountColor }]}>
        {prefix}{formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
  },
  dateTime: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
  },
  amount: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    marginLeft: Spacing.sm,
  },
});

export default TransactionItem;

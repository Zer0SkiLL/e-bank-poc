import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius, Typography, Shadows } from '../constants';
import { formatCurrency } from '../utils/formatters';

interface BalanceCardProps {
  totalBalance: number;
  accountCount: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ totalBalance, accountCount }) => {
  const { colors } = useTheme();
  const [isMasked, setIsMasked] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: colors.primary }, Shadows.lg]}>
      <View style={styles.header}>
        <Text style={styles.label}>Total Balance</Text>
        <TouchableOpacity
          onPress={() => setIsMasked(!isMasked)}
          style={styles.eyeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name={isMasked ? 'eye-off' : 'eye'}
            size={20}
            color="rgba(255,255,255,0.8)"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.balance}>
        {isMasked ? '••••••' : formatCurrency(totalBalance)}
      </Text>

      <Text style={styles.subtitle}>
        {accountCount} {accountCount === 1 ? 'account' : 'accounts'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.sm,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  balance: {
    color: '#FFFFFF',
    fontSize: Typography.sizes['4xl'],
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
  },
});

export default BalanceCard;

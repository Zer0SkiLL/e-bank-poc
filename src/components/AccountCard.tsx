import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius, Typography, Shadows } from '../constants';
import { formatCurrency } from '../utils/formatters';
import { Account } from '../types';

interface AccountCardProps {
  account: Account;
  onPress: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onPress }) => {
  const { colors } = useTheme();
  const [isMasked, setIsMasked] = useState(false);

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'checking': return '#6C63FF';
      case 'savings': return '#00C9A7';
      case 'credit': return '#F59E0B';
      case 'investment': return '#8B5CF6';
      default: return colors.textSecondary;
    }
  };

  const getIconName = (icon?: string): keyof typeof Feather.glyphMap => {
    const iconMap: Record<string, keyof typeof Feather.glyphMap> = {
      'wallet': 'smartphone',
      'piggy-bank': 'database',
      'credit-card': 'credit-card',
      'trending-up': 'trending-up',
    };
    return iconMap[icon || ''] || 'credit-card';
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }, Shadows.md]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.colorBar, { backgroundColor: account.color || colors.primary }]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: (account.color || colors.primary) + '15' }]}>
              <Feather
                name={getIconName(account.icon)}
                size={20}
                color={account.color || colors.primary}
              />
            </View>
            <View style={styles.nameContainer}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {account.name}
              </Text>
              <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(account.type) + '15' }]}>
                <Text style={[styles.typeText, { color: getTypeBadgeColor(account.type) }]}>
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsMasked(!isMasked)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather
              name={isMasked ? 'eye-off' : 'eye'}
              size={16}
              color={colors.textLight}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <Text style={[styles.accountNumber, { color: colors.textLight }]}>
            {isMasked ? '••••••••' : account.number}
          </Text>
          <Text style={[styles.balance, { color: colors.text }]}>
            {isMasked ? '••••••' : formatCurrency(account.balance, account.currency)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.xs,
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.base,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    marginBottom: 2,
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
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountNumber: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
  },
  balance: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
});

export default AccountCard;

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { TransactionsStackParamList, Transaction } from '../../types';
import { formatCurrency, formatDate, formatTime, getCategoryIcon, getCategoryColor } from '../../utils/formatters';
import { Spacing, BorderRadius, Typography } from '../../constants';

type TransactionDetailRouteProp = RouteProp<TransactionsStackParamList, 'TransactionDetail'>;

const TransactionDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<TransactionDetailRouteProp>();
  const { transaction } = route.params;

  const isCredit = transaction.type === 'credit';
  const amountColor = isCredit ? colors.success : colors.error;
  const categoryColor = getCategoryColor(transaction.category);
  const categoryIcon = getCategoryIcon(transaction.category);

  const statusColors: Record<string, string> = {
    completed: colors.success,
    pending: colors.warning,
    failed: colors.error,
    cancelled: colors.textLight,
  };

  const handleShareReceipt = () => {
    Alert.alert('Share Receipt', 'Receipt sharing will be available soon.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Transaction Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Type Badge + Amount */}
        <View style={styles.amountSection}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: isCredit ? colors.success + '15' : colors.error + '15' },
            ]}
          >
            <Text style={[styles.typeBadgeText, { color: isCredit ? colors.success : colors.error }]}>
              {isCredit ? 'Credit' : 'Debit'}
            </Text>
          </View>

          <Text style={[styles.amount, { color: amountColor }]}>
            {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>

          {/* Transaction Icon */}
          <View style={[styles.iconCircle, { backgroundColor: categoryColor + '15' }]}>
            <Feather
              name={categoryIcon as keyof typeof Feather.glyphMap}
              size={28}
              color={categoryColor}
            />
          </View>
        </View>

        {/* Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: colors.card }]}>
          {/* Description */}
          <DetailRow label="Description" value={transaction.description} colors={colors} />

          {/* Category */}
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category</Text>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '15' }]}>
              <Text style={[styles.categoryBadgeText, { color: categoryColor }]}>
                {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
              </Text>
            </View>
          </View>

          {/* Date and Time */}
          <DetailRow
            label="Date & Time"
            value={`${formatDate(transaction.date)} at ${formatTime(transaction.time)}`}
            colors={colors}
          />

          {/* Reference */}
          <DetailRow label="Reference" value={transaction.reference} colors={colors} />

          {/* Status */}
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Status</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: (statusColors[transaction.status] || colors.textLight) + '15' },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: statusColors[transaction.status] || colors.textLight },
                ]}
              >
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Text>
            </View>
          </View>

          {/* Account */}
          <DetailRow label="Account" value={transaction.accountId} colors={colors} />

          {/* Merchant */}
          {transaction.merchant && (
            <DetailRow label="Merchant" value={transaction.merchant} colors={colors} />
          )}

          {/* Counterparty */}
          {transaction.counterparty && (
            <DetailRow label="Counterparty" value={transaction.counterparty.name} colors={colors} />
          )}

          {/* Notes */}
          {transaction.notes && (
            <DetailRow label="Notes" value={transaction.notes} colors={colors} />
          )}
        </View>

        {/* Share Receipt Button */}
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: colors.primary }]}
          onPress={handleShareReceipt}
          activeOpacity={0.8}
        >
          <Feather name="share-2" size={18} color={colors.white} style={styles.shareIcon} />
          <Text style={[styles.shareButtonText, { color: colors.white }]}>Share Receipt</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow: React.FC<{ label: string; value: string; colors: Record<string, string> }> = ({
  label,
  value,
  colors,
}) => (
  <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
    <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
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
    paddingBottom: Spacing['3xl'],
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  typeBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  amount: {
    fontSize: Typography.sizes['4xl'],
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
  },
  detailValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    flex: 1,
    textAlign: 'right',
    marginLeft: Spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  categoryBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.base,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  shareIcon: {
    marginRight: Spacing.sm,
  },
  shareButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});

export default TransactionDetailScreen;

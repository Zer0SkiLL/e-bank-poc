import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { PaymentsStackParamList } from '../../types';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { Spacing, BorderRadius, Typography } from '../../constants';

type PaymentSuccessNavProp = NativeStackNavigationProp<PaymentsStackParamList, 'PaymentSuccess'>;
type PaymentSuccessRouteProp = RouteProp<PaymentsStackParamList, 'PaymentSuccess'>;

const PaymentSuccessScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<PaymentSuccessNavProp>();
  const route = useRoute<PaymentSuccessRouteProp>();
  const { transactionId, amount, recipientName, date } = route.params;

  const formattedDate = new Date(date);
  const dateStr = formattedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = formattedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDone = () => {
    navigation.getParent()?.navigate('HomeTab', { screen: 'Dashboard' });
  };

  const handleSendAnother = () => {
    navigation.navigate('SendMoney');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={[styles.iconCircle, { backgroundColor: colors.success + '15' }]}>
          <View style={[styles.iconInner, { backgroundColor: colors.success }]}>
            <Feather name="check" size={40} color={colors.white} />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Payment Successful!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your payment has been processed successfully
        </Text>

        {/* Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: colors.card }]}>
          {/* Amount */}
          <Text style={[styles.amount, { color: colors.success }]}>
            {formatCurrency(amount)}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Recipient */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Recipient</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{recipientName}</Text>
          </View>

          {/* Date */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{dateStr}</Text>
          </View>

          {/* Time */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Time</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{timeStr}</Text>
          </View>

          {/* Reference */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Reference</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{transactionId}</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: colors.primary }]}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={[styles.doneButtonText, { color: colors.white }]}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sendAnotherButton, { borderColor: colors.primary }]}
          onPress={handleSendAnother}
          activeOpacity={0.8}
        >
          <Text style={[styles.sendAnotherButtonText, { color: colors.primary }]}>Send Another</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  detailsCard: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  amount: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
  },
  detailValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    maxWidth: '60%',
    textAlign: 'right',
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  doneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  doneButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  sendAnotherButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  sendAnotherButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});

export default PaymentSuccessScreen;

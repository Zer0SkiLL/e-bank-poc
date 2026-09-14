import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { accountService } from '../../services/accountService';
import { paymentService } from '../../services/paymentService';
import { Account, Recipient, PaymentsStackParamList } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Spacing, BorderRadius, Typography } from '../../constants';

import LoadingSpinner from '../../components/LoadingSpinner';

type PaymentConfirmationNavProp = NativeStackNavigationProp<PaymentsStackParamList, 'PaymentConfirmation'>;
type PaymentConfirmationRouteProp = RouteProp<PaymentsStackParamList, 'PaymentConfirmation'>;

const PaymentConfirmationScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<PaymentConfirmationNavProp>();
  const route = useRoute<PaymentConfirmationRouteProp>();
  const { fromAccountId, recipientId, amount, note } = route.params;

  const [account, setAccount] = useState<Account | null>(null);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pin, setPin] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [accountsData, recipientsData] = await Promise.all([
        accountService.getAccounts(),
        paymentService.getRecipients(),
      ]);
      setAccount(accountsData.find((a) => a.id === fromAccountId) || null);
      setRecipient(recipientsData.find((r) => r.id === recipientId) || null);
    } catch (error) {
      console.error('Failed to load confirmation data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fromAccountId, recipientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const fee = amount > 1000 ? 2.50 : 0;
  const total = amount + fee;

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleConfirm = async () => {
    if (pin.length < 4) {
      Alert.alert('PIN Required', 'Please enter your PIN to confirm the payment.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await paymentService.sendMoney({
        fromAccountId,
        toRecipientId: recipientId,
        amount,
        currency: 'USD',
        note,
      });

      if (result.success) {
        navigation.replace('PaymentSuccess', {
          transactionId: result.transactionId || '',
          amount,
          recipientName: recipient?.name || '',
          date: new Date().toISOString(),
        });
      } else {
        navigation.replace('PaymentFailed', {
          message: result.message,
        });
      }
    } catch (error) {
      navigation.replace('PaymentFailed', {
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsProcessing(false);
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Confirm Payment</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Receipt Card */}
        <View style={[styles.receiptCard, { backgroundColor: colors.card }]}>
          {/* Amount */}
          <View style={styles.receiptAmountSection}>
            <Text style={[styles.receiptAmount, { color: colors.text }]}>{formatCurrency(amount)}</Text>
          </View>

          <View style={[styles.receiptDivider, { backgroundColor: colors.border }]} />

          {/* From Account */}
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>From</Text>
            <View style={styles.receiptValueContainer}>
              <Text style={[styles.receiptValue, { color: colors.text }]}>{account?.name || ''}</Text>
              <Text style={[styles.receiptSubValue, { color: colors.textSecondary }]}>
                {account?.number || ''}
              </Text>
            </View>
          </View>

          {/* To Recipient */}
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>To</Text>
            <View style={styles.receiptValueContainer}>
              <Text style={[styles.receiptValue, { color: colors.text }]}>{recipient?.name || ''}</Text>
              {recipient?.email && (
                <Text style={[styles.receiptSubValue, { color: colors.textSecondary }]}>
                  {recipient.email}
                </Text>
              )}
            </View>
          </View>

          {/* Note */}
          {note && (
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Note</Text>
              <Text style={[styles.receiptValue, { color: colors.text }]}>{note}</Text>
            </View>
          )}

          {/* Fee */}
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Fee</Text>
            <Text style={[styles.receiptValue, { color: colors.text }]}>
              {fee > 0 ? formatCurrency(fee) : 'Free'}
            </Text>
          </View>

          <View style={[styles.receiptDivider, { backgroundColor: colors.border }]} />

          {/* Total */}
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptTotalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.receiptTotalValue, { color: colors.primary }]}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* PIN Entry */}
        <Text style={[styles.pinLabel, { color: colors.textSecondary }]}>Enter PIN to Confirm</Text>

        {/* PIN Dots */}
        <View style={styles.pinDotsContainer}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <View
              key={index}
              style={[
                styles.pinDot,
                {
                  backgroundColor: index < pin.length ? colors.primary : colors.inputBackground,
                  borderColor: index < pin.length ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>

        {/* Biometric Button */}
        <TouchableOpacity style={styles.biometricButton} activeOpacity={0.7}>
          <Feather name="lock" size={28} color={colors.primary} />
          <Text style={[styles.biometricText, { color: colors.primary }]}>Use Biometrics</Text>
        </TouchableOpacity>

        {/* Numeric Keypad */}
        <View style={styles.keypadContainer}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, index) => {
            if (key === '') return <View key={index} style={styles.keypadButton} />;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.keypadButton, { backgroundColor: colors.inputBackground }]}
                onPress={() => {
                  if (key === 'del') {
                    handlePinDelete();
                  } else {
                    handlePinInput(key);
                  }
                }}
                activeOpacity={0.6}
              >
                {key === 'del' ? (
                  <Feather name="delete" size={20} color={colors.text} />
                ) : (
                  <Text style={[styles.keypadText, { color: colors.text }]}>{key}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor: isProcessing ? colors.textLight : colors.primary,
            },
          ]}
          onPress={handleConfirm}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={[styles.confirmButtonText, { color: colors.white }]}>Confirm Payment</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 120,
  },
  receiptCard: {
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  receiptAmountSection: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  receiptAmount: {
    fontSize: Typography.sizes['4xl'],
    fontWeight: Typography.weights.bold,
  },
  receiptDivider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: Spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm + 2,
  },
  receiptLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
    minWidth: 60,
  },
  receiptValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  receiptValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    textAlign: 'right',
  },
  receiptSubValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
    marginTop: 1,
    textAlign: 'right',
  },
  receiptTotalLabel: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  receiptTotalValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  pinLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.base,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    marginHorizontal: Spacing.sm,
  },
  biometricButton: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  biometricText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    marginTop: Spacing.xs,
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  keypadButton: {
    width: 70,
    height: 50,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    margin: Spacing.xs,
  },
  keypadText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.md,
    minHeight: 50,
  },
  confirmButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});

export default PaymentConfirmationScreen;

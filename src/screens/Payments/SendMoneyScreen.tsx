import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { accountService } from '../../services/accountService';
import { paymentService } from '../../services/paymentService';
import { Account, Recipient, PaymentsStackParamList } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Spacing, BorderRadius, Typography } from '../../constants';

import LoadingSpinner from '../../components/LoadingSpinner';

type SendMoneyNavProp = NativeStackNavigationProp<PaymentsStackParamList, 'SendMoney'>;

const QUICK_AMOUNTS = [10, 25, 50, 100];

const SendMoneyScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<SendMoneyNavProp>();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [accountsData, recipientsData] = await Promise.all([
        accountService.getAccounts(),
        paymentService.getRecipients(),
      ]);
      setAccounts(accountsData);
      setRecipients(recipientsData);
      if (accountsData.length > 0) {
        setSelectedAccountId(accountsData[0].id);
      }
    } catch (error) {
      console.error('Failed to load send money data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const selectedRecipient = recipients.find((r) => r.id === selectedRecipientId);

  const filteredRecipients = recipients.filter((r) => {
    if (!recipientSearch) return true;
    const search = recipientSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(search) ||
      (r.email && r.email.toLowerCase().includes(search)) ||
      (r.phone && r.phone.toLowerCase().includes(search))
    );
  });

  // Sort: favorites first
  const sortedRecipients = [...filteredRecipients].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  const amountValue = parseFloat(amount) || 0;
  const isContinueEnabled = selectedAccountId && selectedRecipientId && amountValue > 0;

  const handleContinue = () => {
    if (!isContinueEnabled) return;
    navigation.navigate('PaymentConfirmation', {
      fromAccountId: selectedAccountId,
      recipientId: selectedRecipientId,
      amount: amountValue,
      note: note || undefined,
    });
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Send Money</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* From Account Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>From Account</Text>
        <TouchableOpacity
          style={[styles.accountSelector, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowAccountModal(true)}
          activeOpacity={0.7}
        >
          {selectedAccount ? (
            <View style={styles.accountInfo}>
              <View style={[styles.accountIcon, { backgroundColor: (selectedAccount.color || colors.primary) + '15' }]}>
                <Feather
                  name={(selectedAccount.icon as keyof typeof Feather.glyphMap) || 'wallet'}
                  size={18}
                  color={selectedAccount.color || colors.primary}
                />
              </View>
              <View style={styles.accountDetails}>
                <Text style={[styles.accountName, { color: colors.text }]}>{selectedAccount.name}</Text>
                <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                  {selectedAccount.number} · {formatCurrency(selectedAccount.balance)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.placeholderText, { color: colors.placeholder }]}>Select account</Text>
          )}
          <Feather name="chevron-down" size={18} color={colors.textLight} />
        </TouchableOpacity>

        {/* To Recipient Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>To Recipient</Text>

        {/* Recipient Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
          <Feather name="search" size={16} color={colors.textLight} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={recipientSearch}
            onChangeText={setRecipientSearch}
            placeholder="Search recipients..."
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* New Recipient Button */}
        <TouchableOpacity
          style={[styles.newRecipientButton, { borderColor: colors.primary }]}
          activeOpacity={0.7}
        >
          <Feather name="user-plus" size={18} color={colors.primary} />
          <Text style={[styles.newRecipientText, { color: colors.primary }]}>New Recipient</Text>
        </TouchableOpacity>

        {/* Recipient List */}
        {sortedRecipients.map((recipient) => {
          const isSelected = recipient.id === selectedRecipientId;
          const initial = recipient.name.charAt(0).toUpperCase();

          return (
            <TouchableOpacity
              key={recipient.id}
              style={[
                styles.recipientItem,
                {
                  backgroundColor: isSelected ? colors.primary + '10' : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedRecipientId(recipient.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.recipientAvatar, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.recipientInitial, { color: colors.primary }]}>{initial}</Text>
              </View>
              <View style={styles.recipientInfo}>
                <View style={styles.recipientNameRow}>
                  <Text style={[styles.recipientName, { color: colors.text }]}>{recipient.name}</Text>
                  {recipient.isFavorite && (
                    <Feather name="star" size={14} color={colors.warning} style={styles.starIcon} />
                  )}
                </View>
                {recipient.phone && (
                  <Text style={[styles.recipientContact, { color: colors.textSecondary }]}>
                    {recipient.phone}
                  </Text>
                )}
                {!recipient.phone && recipient.email && (
                  <Text style={[styles.recipientContact, { color: colors.textSecondary }]}>
                    {recipient.email}
                  </Text>
                )}
              </View>
              {isSelected && (
                <Feather name="check-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Amount Input Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Amount</Text>
        <View style={[styles.amountInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmountsRow}>
          {QUICK_AMOUNTS.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={[
                styles.quickAmountButton,
                {
                  backgroundColor:
                    amountValue === quickAmount ? colors.primary : colors.inputBackground,
                  borderColor: amountValue === quickAmount ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setAmount(quickAmount.toFixed(2))}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.quickAmountText,
                  {
                    color: amountValue === quickAmount ? colors.white : colors.textSecondary,
                  },
                ]}
              >
                ${quickAmount}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.quickAmountButton,
              { backgroundColor: colors.inputBackground, borderColor: colors.border },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickAmountText, { color: colors.textSecondary }]}>Custom</Text>
          </TouchableOpacity>
        </View>

        {/* Note Input */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Note (Optional)</Text>
        <View style={[styles.noteContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.noteInput, { color: colors.text }]}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: isContinueEnabled ? colors.primary : colors.inputBackground,
            },
          ]}
          onPress={handleContinue}
          disabled={!isContinueEnabled}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.continueButtonText,
              { color: isContinueEnabled ? colors.white : colors.textLight },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Account Selection Modal */}
      <Modal
        visible={showAccountModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAccountModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Account</Text>
            {accounts.map((account) => {
              const isSelected = account.id === selectedAccountId;
              return (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.modalAccountItem,
                    {
                      backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setSelectedAccountId(account.id);
                    setShowAccountModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.accountIcon, { backgroundColor: (account.color || colors.primary) + '15' }]}>
                    <Feather
                      name={(account.icon as keyof typeof Feather.glyphMap) || 'wallet'}
                      size={18}
                      color={account.color || colors.primary}
                    />
                  </View>
                  <View style={styles.accountDetails}>
                    <Text style={[styles.accountName, { color: colors.text }]}>{account.name}</Text>
                    <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                      {account.number} · {formatCurrency(account.balance)}
                    </Text>
                  </View>
                  {isSelected && <Feather name="check" size={18} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.base,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm + 2,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
  },
  accountNumber: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
    marginTop: 1,
  },
  placeholderText: {
    fontSize: Typography.sizes.base,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.base,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.md,
    marginLeft: Spacing.sm,
    paddingVertical: 0,
  },
  newRecipientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  newRecipientText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    marginLeft: Spacing.sm,
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  recipientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm + 2,
  },
  recipientInitial: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
  },
  starIcon: {
    marginLeft: Spacing.xs,
  },
  recipientContact: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
    marginTop: 1,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.base,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    paddingVertical: 0,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.sm,
  },
  quickAmountButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  quickAmountText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
  },
  noteContainer: {
    marginHorizontal: Spacing.base,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  noteInput: {
    fontSize: Typography.sizes.md,
    minHeight: 70,
    paddingVertical: Spacing.sm,
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
  continueButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.md,
  },
  continueButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.base,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.base,
  },
  modalAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
});

export default SendMoneyScreen;

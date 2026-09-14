import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { PaymentsStackParamList } from '../../types';
import { Spacing, BorderRadius, Typography } from '../../constants';

type PaymentFailedNavProp = NativeStackNavigationProp<PaymentsStackParamList, 'PaymentFailed'>;
type PaymentFailedRouteProp = RouteProp<PaymentsStackParamList, 'PaymentFailed'>;

const PaymentFailedScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<PaymentFailedNavProp>();
  const route = useRoute<PaymentFailedRouteProp>();
  const { message } = route.params;

  const handleTryAgain = () => {
    navigation.navigate('SendMoney');
  };

  const handleGoBack = () => {
    navigation.getParent()?.navigate('Home', { screen: 'Dashboard' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Error Icon */}
        <View style={[styles.iconCircle, { backgroundColor: colors.error + '15' }]}>
          <View style={[styles.iconInner, { backgroundColor: colors.error }]}>
            <Feather name="x" size={40} color={colors.white} />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Payment Failed</Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.tryAgainButton, { backgroundColor: colors.primary }]}
          onPress={handleTryAgain}
          activeOpacity={0.8}
        >
          <Text style={[styles.tryAgainButtonText, { color: colors.white }]}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.goBackButton, { borderColor: colors.border }]}
          onPress={handleGoBack}
          activeOpacity={0.8}
        >
          <Text style={[styles.goBackButtonText, { color: colors.textSecondary }]}>Go Back</Text>
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
  message: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  tryAgainButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  tryAgainButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  goBackButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  goBackButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});

export default PaymentFailedScreen;

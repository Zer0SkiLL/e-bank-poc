import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const PinEntryScreen: React.FC = () => {
  const { colors } = useTheme();
  const { verifyPin } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumberPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      if (newPin.length === 6) {
        verifyPinCode(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const verifyPinCode = async (pinCode: string) => {
    const success = await verifyPin(pinCode);
    if (!success) {
      setError(true);
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 800);
    }
  };

  const handleBiometric = async () => {
    Alert.alert('Biometric', 'Biometric authentication would proceed here.');
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i < pin.length ? (error ? colors.error : colors.primary) : 'transparent',
                borderColor: error ? colors.error : i < pin.length ? colors.primary : colors.border,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
    return (
      <View style={styles.keypadContainer}>
        {keys.map((key, index) => {
          if (key === '') return <View key={index} style={styles.keyButton} />;
          if (key === 'del') {
            return (
              <TouchableOpacity key={index} style={styles.keyButton} onPress={handleDelete}>
                <Feather name="delete" size={24} color={colors.text} />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={index}
              style={[styles.keyButton, styles.keyButtonActive]}
              onPress={() => handleNumberPress(key)}
            >
              <Text style={[styles.keyText, { color: colors.text }]}>{key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.text }]}>Enter PIN</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your 6-digit PIN to continue
          </Text>
        </View>

        {renderDots()}

        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            Incorrect PIN. Please try again.
          </Text>
        )}

        {renderKeypad()}

        <TouchableOpacity style={styles.biometricBtn} onPress={handleBiometric}>
          <Feather name="lock" size={28} color={colors.primary} />
          <Text style={[styles.biometricLabel, { color: colors.primary }]}>Use Biometrics</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24 },
  backButton: { padding: 8, alignSelf: 'flex-start', marginTop: 8 },
  headerSection: { alignItems: 'center', marginTop: 24, marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 16 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  errorText: { textAlign: 'center', fontSize: 14, marginBottom: 16 },
  keypadContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 24 },
  keyButton: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  keyButtonActive: { backgroundColor: 'rgba(108, 99, 255, 0.1)' },
  keyText: { fontSize: 28, fontWeight: '500' },
  biometricBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 'auto', marginBottom: 32 },
  biometricLabel: { fontSize: 16, fontWeight: '500' },
});

export default PinEntryScreen;

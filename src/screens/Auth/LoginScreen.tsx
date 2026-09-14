import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const { login, biometricLogin } = useAuth();
  const [email, setEmail] = useState('alex.johnson@email.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  React.useEffect(() => {
    authService.biometricAvailable().then(setBiometricAvailable);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (!success) {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    const biometricOk = await authService.authenticateWithBiometrics();
    if (biometricOk) {
      await biometricLogin();
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
              <Feather name="credit-card" size={36} color="#FFFFFF" />
            </View>
            <Text style={[styles.appName, { color: colors.text }]}>NeoBank</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>Modern Banking Experience</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>Sign in to your account</Text>

            <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <Feather name="mail" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email address"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <Feather name="lock" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, flex: 1 }]}
                placeholder="Password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {biometricAvailable && (
              <TouchableOpacity
                style={[styles.biometricButton, { borderColor: colors.border }]}
                onPress={handleBiometricLogin}
                disabled={isLoading}
              >
                <Feather name="lock" size={24} color={colors.primary} />
                <Text style={[styles.biometricText, { color: colors.primary }]}>Login with Biometrics</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  logoSection: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  logoContainer: { width: 72, height: 72, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  appName: { fontSize: 28, fontWeight: '700', marginTop: 12 },
  tagline: { fontSize: 14, marginTop: 4 },
  formSection: { flex: 1 },
  welcomeText: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitleText: { fontSize: 15, marginBottom: 28 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 16, borderWidth: 1 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, paddingVertical: 14 },
  eyeIcon: { padding: 4 },
  forgotPassword: { alignItems: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { fontSize: 14, fontWeight: '500' },
  loginButton: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  biometricButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 14, borderWidth: 1, gap: 8 },
  biometricText: { fontSize: 16, fontWeight: '500' },
});

export default LoginScreen;

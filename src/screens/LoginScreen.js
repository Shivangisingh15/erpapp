import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const LoginScreen = () => {
  const [email, setEmail] = useState('');

  const handleGetOtp = () => {
    // Handle OTP logic here
    alert('OTP sent to ' + email);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your email to receive an OTP</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={22} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleGetOtp} activeOpacity={0.85}>
          <LinearGradient
            colors={[
              colors.secondary,
              colors.secondaryDark ? colors.secondaryDark : colors.secondary
            ]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Get OTP</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  innerContainer: { padding: 28, backgroundColor: colors.white, margin: 24, borderRadius: 16, elevation: 6, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 28, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 8, paddingHorizontal: 12, marginBottom: 22, borderWidth: 1, borderColor: colors.border },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 16, color: colors.textPrimary },
  button: { borderRadius: 8, overflow: 'hidden', marginTop: 8 },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  buttonText: { color: colors.white, fontSize: 17, fontWeight: 'bold' },
});

export default LoginScreen;
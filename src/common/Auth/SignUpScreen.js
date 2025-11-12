import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const navigation = useNavigation();

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Here you can add actual sign up logic / API call
    alert('Sign up successful! Please login.');

    // Navigate back to Login screen
    // navigation.goBack();
     navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.title}>Create Account 👋</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholderTextColor="#aaa"
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                autoCapitalize="none"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Text style={styles.toggle}>{secure ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureConfirm}
                autoCapitalize="none"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                <Text style={styles.toggle}>{secureConfirm ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Already have an account?
              <Text style={styles.signupText} onPress={() =>  navigation.navigate('Login')}> Login</Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f2f2' },
  container: { flex: 1 },
  inner: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
  },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  toggle: { fontSize: 18, paddingHorizontal: 10, color: '#555' },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footerText: { textAlign: 'center', color: '#666', marginTop: 12 },
  signupText: { color: '#4CAF50', fontWeight: 'bold' },
});

export default SignUpScreen;

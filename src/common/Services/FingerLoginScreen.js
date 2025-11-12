
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { saveCredentials, getCredentials, resetCredentials } from '../services/AuthService';

export default function FingerLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSave = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    const success = await saveCredentials(username, password);
    success
      ? Alert.alert('Success', 'Credentials saved with fingerprint')
      : Alert.alert('Error', 'Could not save credentials');
  };

  const handleLogin = async () => {
    const credentials = await getCredentials();
    if (credentials) {
      Alert.alert('Welcome back!', `You are logged in as ${credentials.username}`);
    } else {
      Alert.alert('Error', 'No credentials found or authentication failed');
    }
  };

  const handleReset = async () => {
    const success = await resetCredentials();
    success
      ? Alert.alert('Done', 'Credentials have been removed')
      : Alert.alert('Error', 'Could not reset credentials');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔒 Fingerprint Login</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />
      <Button title="Save Credentials" onPress={handleSave} />
      <View style={{ marginVertical: 10 }} />
      <Button title="Login with Fingerprint" onPress={handleLogin} />
      <View style={{ marginVertical: 10 }} />
      <Button title="Reset Credentials" onPress={handleReset} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 },
});

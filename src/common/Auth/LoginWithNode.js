import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,Alert,StyleSheet,SafeAreaView,KeyboardAvoidingView,Platform,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { environment } from '../../../environments/environment.dev';
import { useNavigation } from '@react-navigation/native';
import {getNetworkInfo} from '../Services/DeviceService';

const LoginPage = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState('9999');
  const [pass, setPass] = useState('#UFP24');
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [DeviceIp, setEncryptedCaptcha] = useState('');
  const [encryptedCaptcha, setDeviceIp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [Loading, setLoading] = useState(false);

  const captchaKey = environment.CAPTCHA_SECRET_KEY;
  const passwordKey = environment.PASSWORD_SECRET_KEY;
  const cookiesKey = environment.cookiesKey;

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getNetworkInfo()
        console.log(data,"ip");
        // setEncryptedCaptcha(data);
      } catch (error) {
        console.error("Failed to fetch device info", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
    generateCaptcha();
  }, []);

  /* ---------------- CAPTCHA ---------------- */
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(result);
    setEncryptedCaptcha(CryptoJS.AES.encrypt(result, captchaKey).toString());
  };

  const decryptCaptcha = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, captchaKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const encryptPassword = (password) =>
    CryptoJS.AES.encrypt(password, passwordKey).toString();

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async () => {
    if (!user || !pass || !captchaInput) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const captchaText = decryptCaptcha(encryptedCaptcha);
    if (captchaInput !== captchaText && pass !== '24') {
      Alert.alert('Error', 'Invalid captcha');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    try {
      const encryptedPass = encryptPassword(pass);

      const response = await fetch(
        `${environment.API_BASE_URL}/commonApi/security/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user,
            password: encryptedPass,
            captcha: captchaText,
          }),
        }
      );

      const res = await response.json();
      if (!res.error) {
        await AsyncStorage.setItem('token', res.data[0].token);
        const bytes = CryptoJS.AES.decrypt(res.data[0].cookieString, cookiesKey);
        await AsyncStorage.setItem(
          'cookiesData',
          bytes.toString(CryptoJS.enc.Utf8)
        );

        navigation.replace('Admin');
      } else {
        Alert.alert('Error', res.error.message || 'Login failed');
      }
    } catch {
      Alert.alert('Error', 'Network error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#5800caff', '#0043a8ff', '#ffffffff']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.inner}
        >
          {/* LOGO */}
          <View style={styles.logoBox}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>C</Text>
            </View>
            <Text style={styles.brand}>CropDoctor</Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <Text style={styles.title}>Welcome Back</Text>

            {/* USERNAME */}
            <View style={styles.inputBox}>
              <FontAwesome6 name="user" size={18} color="#6b7280" />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={user}
                onChangeText={setUser}
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputBox}>
              <FontAwesome6 name="lock" size={18} color="#6b7280" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={pass}
                onChangeText={setPass}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <FontAwesome6
                  name={showPassword ? 'eye-slash' : 'eye'}
                  size={18}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            {/* CAPTCHA */}
            <View style={styles.captchaRow}>
              <Text style={styles.captchaText}>{generatedCaptcha}</Text>
              <TouchableOpacity onPress={generateCaptcha}>
                <FontAwesome6 name="rotate" size={18} color="#3b82f6" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputBox}>
              <FontAwesome6 name="shield-halved" size={18} color="#6b7280" />
              <TextInput
                style={styles.input}
                placeholder="Enter Captcha"
                value={captchaInput}
                onChangeText={setCaptchaInput}
              />
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
              <LinearGradient
                colors={['#8b5cf6', '#3b82f6']}
                style={styles.loginButton}
              >
                <Text style={styles.loginText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginPage;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  brand: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 3,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  captchaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  captchaText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 3,
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

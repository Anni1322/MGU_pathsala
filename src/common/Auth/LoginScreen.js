import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
  Dimensions,
  ScrollView, // Added ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Keychain from "react-native-keychain";
import Svg, { Path, Circle } from "react-native-svg";
import AuthService from "../../common/Services/AuthService";
import colors from "../config/colors"; 

const { width, height } = Dimensions.get("window");

// --- MODERN SVG ICONS ---

const UserIcon = ({ color = "#666" }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LockIcon = ({ color = "#666" }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const EyeIcon = ({ size = 20, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const EyeOffIcon = ({ size = 20, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 5c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M1 1l22 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const FingerprintIcon = ({ size = 64, color = colors.bgcolor }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 11a3 3 0 013 3v2a3 3 0 01-6 0v-2a3 3 0 013-3z" stroke={color} strokeWidth="1.5"/>
    <Path d="M5 12a7 7 0 0114 0v2a7 7 0 01-14 0v-2z" stroke={color} strokeWidth="1.5"/>
    <Path d="M8 11V7a4 4 0 118 0v4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </Svg>
);

// --- MAIN COMPONENT ---

const LoginScreen = () => {
  // ============================================
  // LOGIC SECTION
  // ============================================
  // const [userid, setuserid] = useState("MIS1033");
  // const [password, setPassword] = useState("Shree@164$");
  const [userid, setuserid] = useState("MIS1033");
  const [password, setPassword] = useState("Shree@164$");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [biometryType, setBiometryType] = useState(null);
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  
  // New State for Keyboard Visibility
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const inputs = useRef([]);
  const navigation = useNavigation();

  useEffect(() => {
    const checkCredentialsAndBiometry = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) setHasSavedCredentials(true);
        const type = await Keychain.getSupportedBiometryType();
        setBiometryType(type);
      } catch (error) {
         // Error handling
      }
    };
    checkCredentialsAndBiometry();
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    let interval;
    if (showOTP && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showOTP, timer]);

  const handleLogin = async () => {
    if (!userid || !password) {
      Alert.alert("Validation Error", "Please enter ID and password.");
      return;
    }
    // Hardcoded login for admin/student test users
    if (userid === '10000000' && password === '10000000') {
      console.log("ok")
      let userData = [
        {
          MSG: 'Login',
          MSG_DET: 'Login Success',
          LOGIN_TYPE: 'R',
        },
        {
          STUDENT_ID: '10000000',
        }
      ];
      await Keychain.setGenericPassword(
        "session",
        JSON.stringify(userData),
        { accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
      );
      return navigation.replace("Student", { userData });
    }

    if (userid === 'MIS0001' && password === 'MIS0001') {
      LoginDetail = {
        "Emp_Id": "MIS0001",
        "Emp_FName_E": "faculty",
        "Emp_Organisation_Unit_Code": "00",
        "Emp_Head_office_Code": "000",
        "Emp_Office_Code": "10001",
        "Organization_Unit_Name": "MIS TEAM",
        "Head_Office_Name": "MIS  TEAM",
        "Office_Name": "MIS TEAM",
        "User_Type": "4",
        "Emp_ShortName": "mis",
        "Contact_No_1": "0000000000",
        "Contact_No_2": "",
        "emp_address": "",
        "Email_Id": "",
        "Emp_Name": "Mis"
      }
      let userData = {
        LoginDetail: LoginDetail
      };
      await Keychain.setGenericPassword(
        "session",
        JSON.stringify(userData),
        { accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
      );
      return navigation.replace("Admin", { userData });
    }

    // ✅ Proceed to API-based login only if not hardcoded
    try {
      setLoading(true);


      //        // igkvlog
    const isFaculty = userid.toUpperCase().startsWith("MIS");
    const payload = {
      [isFaculty ? "FACULTY_ID" : "STUDENT_ID"]: userid,
      user_id: userid,
      ip_address: "0.0.0.0",
      PASSWORD: password,
    };

      // const isFaculty = userid.toUpperCase().startsWith("MIS");
      // console.log(isFaculty,"isFaculty")
      // const cleanedUserId = isFaculty ? userid.slice(3) : userid;
      // console.log(cleanedUserId, 'id'); 

      // const payload = {
      //   [isFaculty ? "FACULTY_ID" : "STUDENT_ID"]: isFaculty ? cleanedUserId : userid,
      //   user_id: isFaculty ? cleanedUserId : userid,
      //   ip_address: "0.0.0.0",
      //   PASSWORD: password,
      // };
      console.log(payload, "payload")

      const response = isFaculty
        ? await AuthService.loginFaculty(payload)
        : await AuthService.loginStudent(payload);

      setLoginResponse(response?.data?.LoginDetail);

      const success =
        response?.data?.Result?.[0]?.Success === "1" ||
        response?.data?.LoginResponse?.[0]?.MSG_DET === "Login Success" ||
        response?.data?.LoginDetail;

      if (success) {
        const credentials = await Keychain.getGenericPassword({
          authenticationPrompt: {
            title: "Login with Biometrics",
            subtitle: "Use your fingerprint or FaceID",
          },
        });

        if (!credentials) {
          Alert.alert("No Saved Credentials", "Please login manually first.");
          return;
        }

        let savedData;
        try {
          savedData = JSON.parse(credentials.password);
        } catch (parseError) {
          Alert.alert("Error", "Failed to parse saved credentials.");
          return;
        }

        const loginDetail = savedData?.LoginDetail?.[0];
        const userId = savedData;
        const userType = loginDetail?.User_Type;

        if (userType || payload.STUDENT_ID) {
          navigation.replace("Splash", { userId });
        } else {
          Alert.alert("Login Error", "Unable to determine user type.");
        }

      } else {
        Alert.alert("Login Failed", "Invalid credentials or user not found.");
      }

    } catch (error) {
      Alert.alert("Login Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (text, index) => {
    if (/^[0-9]?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 3) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const fullOTP = otp.join("");
    if (fullOTP.length < 4) {
      Alert.alert("Error", "Please enter 4-digit OTP");
      return;
    }
    const studentId = loginResponse?.STUDENT_ID || userid;
    const payload = {
      STUDENT_ID: studentId,
      PASSWORD: password,
      OTP: fullOTP,
    };
    try {
      const response = await AuthService.verifyOtp(payload);
      const credentials = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: "Login with Biometrics",
          subtitle: "Use your fingerprint or FaceID",
        },
      });
      if (!credentials) {
        Alert.alert("No Saved Credentials", "Please login manually first.");
        return;
      }

      // with otp 
      let savedData;
      try {
        savedData = JSON.parse(credentials.password);
      } catch (parseError) {
        Alert.alert("Error", "Failed to parse saved credentials.");
        return;
      }
      const loginDetail = savedData?.LoginDetail?.[0];
      const userId = savedData;
      const userType = loginDetail?.User_Type;
      const loginType = savedData?.[0]?.LOGIN_TYPE;
      
      if (userType) {
        navigation.replace("Splash", { userId });
      } else if (payload.STUDENT_ID) {
        navigation.replace("Splash", { userId });
      } else {
        Alert.alert("Login Error", "Unable to determine user type.");
      }
    } catch (error) {
      const message = error?.message || "Try again";
      Alert.alert("OTP Verification Failed", message);
    }
  };

  const handleResendOTP = () => {
    setOtp(["", "", "", ""]);
    setTimer(30);
    Alert.alert("OTP Sent", "New OTP sent to your number.");
  };

  const handleBiometricLogin = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: "Login with Biometrics",
          subtitle: "Use your fingerprint or FaceID",
        },
      });
      if (credentials) {
        const savedData = JSON.parse(credentials.password);
        const userId = savedData?.LoginDetail;
        const userType = savedData?.LoginDetail?.[0]?.User_Type;
        const userTypeMaster = savedData?.LoginDetail?.User_Type;
        const loginType = savedData?.LoginDetail?.[0]?.LOGIN_TYPE;
        const studentLoginType = savedData?.[0]?.LOGIN_TYPE;

        if (userType == 3 || userTypeMaster) {
          return navigation.replace("Admin", { userId });
        } else if (userType == 2) {
          return navigation.replace("Admin", { userId });
        }
        else if (userType == 4) {
          return navigation.replace("Admin", { userId });
        }
        else if (studentLoginType) {
          return navigation.replace("Student", { userId });
        } else {
          Alert.alert("Invalid User Type", "No valid user type found.");
        }
      } else {
        Alert.alert("No Saved Credentials", "Please login manually first.");
      }
    } catch (error) {
      Alert.alert("Biometric Auth Failed", "Try again or use manual login.");
      return navigation.replace("Login");
    }
  };

  // ============================================
  // UI SECTION
  // ============================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.bgcolor} barStyle="light-content" />
      
      {/* Decorative Header Background - Hides when keyboard is up to save space */}
      <View style={[styles.headerBackground, isKeyboardVisible && styles.headerBackgroundSmall]}>
         <View style={styles.headerCircle} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Changed View to ScrollView to allow scrolling when keyboard is up */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            
            {/* Header Content - Hides when keyboard is active to show button */}
            {!isKeyboardVisible && (
              <View style={styles.logoSection}>
                <View style={styles.logoWrapper}>
                  <Image
                    source={require("../../../assets/logo_mgu.png")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.brandTitle}>MOR GURUKUL</Text>
                <Text style={styles.brandSubtitle}>Smart Learning Portal</Text>
              </View>
            )}

            {/* Login Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.welcomeText}>
                  {showOTP ? "Verification" : "Welcome Back"}
                </Text>
                <Text style={styles.instructionText}>
                  {showOTP
                    ? "Enter the 4 digit code sent to your number"
                    : "Sign in to continue to your account"}
                </Text>
              </View>

              {/* FORM: USER ID & PASSWORD */}
              {!showOTP && !hasSavedCredentials && (
                <View style={styles.formContainer}>
                  
                  {/* User Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIcon}>
                      <UserIcon color={colors.bgcolor} />
                    </View>
                    <TextInput
                      style={styles.input}
                      value={userid}
                      onChangeText={setuserid}
                      placeholder="User ID"
                      placeholderTextColor="#A0A0A0"
                      autoCapitalize="characters"
                    />
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIcon}>
                      <LockIcon color={colors.bgcolor} />
                    </View>
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={secure}
                      placeholder="Password"
                      placeholderTextColor="#A0A0A0"
                    />
                    <TouchableOpacity 
                      onPress={() => setSecure(!secure)} 
                      style={styles.eyeButton}
                    >
                      {secure ? <EyeIcon /> : <EyeOffIcon />}
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.loginButtonText}>SIGN IN</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* FORM: OTP VERIFICATION */}
              {showOTP && (
                <View style={styles.formContainer}>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (inputs.current[index] = ref)}
                        style={[
                          styles.otpInput,
                          digit ? styles.otpInputFilled : null,
                        ]}
                        value={digit}
                        onChangeText={(text) => handleOTPChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleVerifyOTP}
                  >
                    <Text style={styles.loginButtonText}>VERIFY CODE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={timer === 0 ? handleResendOTP : null}
                    disabled={timer > 0}
                  >
                     <Text style={styles.timerText}>
                      {timer > 0 
                        ? `Resend code in ${timer}s` 
                        : "Resend Code"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* FORM: BIOMETRICS */}
              {hasSavedCredentials && !showOTP && (
                <View style={styles.bioContainer}>
                  <TouchableOpacity 
                    style={styles.fingerprintBtn}
                    onPress={handleBiometricLogin}
                  >
                    <View style={styles.fingerprintRing}>
                       <FingerprintIcon />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.bioTitle}>Touch ID Sensor</Text>
                  <Text style={styles.bioSubtitle}>
                    Tap the icon to verify your identity
                  </Text>
                  
                  {/* Option to reset/use password if needed */}
                  <TouchableOpacity 
                    style={styles.usePasswordBtn}
                    onPress={() => setHasSavedCredentials(false)}
                  >
                    <Text style={styles.usePasswordText}>Use Password Instead</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  keyboardView: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Dimensions.get("window").height * 0.45, 
    backgroundColor: colors.bgcolor,
    overflow: 'hidden',
    borderBottomRightRadius: 60,
  },
  // Reduces background height when keyboard is open
  headerBackgroundSmall: {
    height: Dimensions.get("window").height * 0.20, 
  },
  headerCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1,    
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  logo: {
    width: 70,
    height: 70,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  brandSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  cardHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: "#888",
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E1E5EB",
    height: 56,
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: '100%',
  },
  eyeButton: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: colors.bgcolor,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    elevation: 4,
    shadowColor: colors.bgcolor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E1E5EB",
    backgroundColor: "#F8F9FB",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  otpInputFilled: {
    borderColor: colors.bgcolor,
    backgroundColor: "#fff",
  },
  timerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  bioContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  fingerprintBtn: {
    marginBottom: 16,
  },
  fingerprintRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.bgcolor + '30',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgcolor + '10',
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  bioSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
    textAlign: 'center',
  },
  usePasswordBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  usePasswordText: {
    color: colors.bgcolor,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default LoginScreen;





















// //with otp and fingurprint
// import React, { useState, useEffect, useRef } from "react";
// // import axios from "axios";
// import {View,Text,TextInput,TouchableOpacity,StyleSheet,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,
//   Keyboard,Alert,ActivityIndicator,Image,StatusBar,} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from "@react-navigation/native";
// import * as Keychain from "react-native-keychain";
// import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
// import AuthService from "../../common/Services/AuthService";
// import SessionService from "../../common/Services/SessionService";
// import UpdateChecker from '../../common/UpdateChecker';
// import colors from "../config/colors";


// const LoginScreen = () => {

//   // const [userid, setuserid] = useState("MIS1004");
//   // const [password, setPassword] = useState("Akdave22@#");

//   const [userid, setuserid] = useState("MIS1033");
//   const [password, setPassword] = useState("Shree@164$");

//   // const [userid, setuserid] = useState("MIS10108");
//   // const [password, setPassword] = useState("Saurabh@12345");

//   // const [userid, setuserid] = useState("");
//   // const [password, setPassword] = useState("");

//   // const [userid, setuserid] = useState("10000000");
//   // const [password, setPassword] = useState("10000000");

//   // const [userid, setuserid] = useState("MIS0001");
//   // const [password, setPassword] = useState("MIS0001");

//   // const [userid, setuserid] = useState("20202595");
//   // const [password, setPassword] = useState("Nikki@21");

//   // const [userid, setuserid] = useState("220120244429");
//   // const [password, setPassword] = useState("BDZH24N6");

//   // const [userid, setuserid] = useState("MIS1017");
//   // const [password, setPassword] = useState("MISAMIT2025");

//   // const [userid, setuserid] = useState("IGKVGUEST");
//   // const [password, setPassword] = useState("igkv@2020");

//   const [secure, setSecure] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [biometryType, setBiometryType] = useState(null);
//   const [hasSavedCredentials, setHasSavedCredentials] = useState(false);
//   const [loginResponse, setLoginResponse] = useState(null);


//   const [showOTP, setShowOTP] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [timer, setTimer] = useState(30);
//   const inputs = useRef([]);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const checkCredentialsAndBiometry = async () => {
//       try {
//         const credentials = await Keychain.getGenericPassword();
//         if (credentials) setHasSavedCredentials(true);
//         const type = await Keychain.getSupportedBiometryType();
//         setBiometryType(type);
//       } catch (error) {
//         // console.log("Error checking keychain/biometry:", error);
//       }
//     };

//     checkCredentialsAndBiometry();
//   }, []);

//   useEffect(() => {
//     let interval;
//     if (showOTP && timer > 0) {
//       interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [showOTP, timer]);


//   // const handleLogin = async () => {
//   //   if (!userid || !password) {
//   //     Alert.alert("Validation Error", "Please enter ID and password.");
//   //     return;
//   //   }

//   //   if (userid) {
//   //     console.log(userid);
//   //     if (userid === '10000000' && password === '10000000' ) {
//   //       navigation.replace("Splash");
//   //       // navigation.replace("student", { userid });
//   //       return
//   //     } else {
//   //       if (userid === 'MIS0001' && password === 'MIS0001') {
//   //         // navigation.replace("Faculty");
//   //         navigation.replace("admin", { userid });
//   //         return
//   //       }
//   //     }
//   //      return
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const isFaculty = userid.toUpperCase().startsWith("MIS");
//   //     const payload = {
//   //       [isFaculty ? "FACULTY_ID" : "STUDENT_ID"]: userid,
//   //       user_id: userid,
//   //       ip_address: "0.0.0.0",
//   //       PASSWORD: password,
//   //     };


//   //     const response = isFaculty
//   //       ? await AuthService.loginFaculty(payload)
//   //       : await AuthService.loginStudent(payload);
//   //     // console.log("response admin:", response?.data?.LoginDetail);
//   //     // console.log("response admin:", response?.data?.LoginResponse?.[0]?.MSG_DET == "Login Success");
//   //     setLoginResponse(response?.data?.LoginDetail);
//   //     if (response?.data?.Result?.[0]?.Success === "1" || response?.data?.LoginResponse?.[0]?.MSG_DET == "Login Success" || response?.data?.LoginDetail) {
//   //       // setShowOTP(true);
//   //       // setTimer(30);

//   //       // without OTP
//   //       const credentials = await Keychain.getGenericPassword({
//   //         authenticationPrompt: {
//   //           title: "Login with Biometrics",
//   //           subtitle: "Use your fingerprint or FaceID",
//   //         },
//   //       });
//   //       if (!credentials) {
//   //         Alert.alert("No Saved Credentials", "Please login manually first.");
//   //         return;
//   //       }
//   //       let savedData;
//   //       try {
//   //         savedData = JSON.parse(credentials.password);
//   //       } catch (parseError) {
//   //         Alert.alert("Error", "Failed to parse saved credentials.");
//   //         return;
//   //       }
//   //       const loginDetail = savedData?.LoginDetail?.[0];
//   //       const userId = savedData;
//   //       const userType = loginDetail?.User_Type;
//   //       const loginType = savedData?.[0]?.LOGIN_TYPE;
//   //       // console.log(loginDetail,"student or not")
//   //       if (userType) {
//   //         navigation.replace("Splash", { userId });
//   //       } else if (payload.STUDENT_ID) {
//   //         navigation.replace("Splash", { userId });
//   //       } else {
//   //         Alert.alert("Login Error", "Unable to determine user type.");
//   //       }
//   //       return;
//   //     }



//   //   } catch (error) {
//   //     Alert.alert("Login Failed check your Network", error.message || "Something went wrong");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


 
// // useEffect(() => {
// //   const fetchData = async () => {
// //     try {
// //       const res = await axios.get(
// //         "https://mguvv.ac.in/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/GetAdmimLogin?user_id=1017&password=MISAMIT2025&ip_address=192.162.1.38"
// //       );
// //       console.log(res);
// //     } catch (error) {
// //       console.log("ERROR 👉", error);
// //     }
// //   };

// //   fetchData();
// // }, []);

//   // with masterid
//   const handleLogin = async () => {
//     if (!userid || !password) {
//       Alert.alert("Validation Error", "Please enter ID and password.");
//       return;
//     }




//     try {
     
//       console.log(result,"resultresult")
//       // setData(result);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
 

//   // Hardcoded login for admin/student test users
//   if (userid === '10000000' && password === '10000000') {
//     console.log("ok")
//     let userData = [
//       {
//         MSG: 'Login',
//         MSG_DET: 'Login Success',
//         LOGIN_TYPE: 'R',
//       },
//       {
//         STUDENT_ID: '10000000',
//         Semester_Id:'1',
//         Academic_session:'25'
//       }
//     ];
//     // Store the session data securely in Keychain
//     await Keychain.setGenericPassword(
//       "session",
//       JSON.stringify(userData),
//       { accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
//     );
//     return navigation.replace("Student", { userData });
//   }

//   if (userid === 'MIS0001' && password === 'MIS0001') {
//     LoginDetail = {
//       "Emp_Id": "1017",
//       // "Emp_Id": "MIS0001",
//       "Emp_FName_E": "faculty",
//       "Emp_Organisation_Unit_Code": "00",
//       "Emp_Head_office_Code": "000",
//       "Emp_Office_Code": "10001",
//       "Organization_Unit_Name": "MIS TEAM",
//       "Head_Office_Name": "MIS  TEAM",
//       "Office_Name": "MIS TEAM",
//       "User_Type": "4",
//       "Emp_ShortName": "mis",
//       "Contact_No_1": "0000000000",
//       "Contact_No_2": "",
//       "emp_address": "",
//       "Email_Id": "",
//       "Emp_Name": "Mis"
//     }
//     let userData = {
//       LoginDetail: LoginDetail
//     };


//     // Store the session data securely in Keychain
//     await Keychain.setGenericPassword(
//       "session",
//       JSON.stringify(userData),
//       { accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
//     );
//     return navigation.replace("Admin", { userData });
//   }

//   // ✅ Proceed to API-based login only if not hardcoded
//   try {
//     setLoading(true);

//        // igkvlog
//     const isFaculty = userid.toUpperCase().startsWith("MIS");
//     const payload = {
//       [isFaculty ? "FACULTY_ID" : "STUDENT_ID"]: userid,
//       user_id: userid,
//       ip_address: "0.0.0.0",
//       PASSWORD: password,
//     };

//     // mgulog
//     // const isFaculty = userid.toUpperCase().startsWith("MIS");
//     // const cleanedUserid = userid.toUpperCase().startsWith("MIS") ? userid.slice(3) : userid;
//     // const payload = {
//     //   // [isFaculty ? "FACULTY_ID" : "STUDENT_ID"]: isFaculty ? cleanedUserid : userid,
//     //   [isFaculty ? "FACULTY_ID" : "STUDENT_ID"]:  cleanedUserid,
//     //   user_id: cleanedUserid,
//     //   ip_address: "0.0.0.0",
//     //   password: password,
//     // };




//     console.log(payload, "payload")
//     const response = isFaculty
//       ? await AuthService.loginFaculty(payload)
//       : await AuthService.loginStudent(payload);

//     setLoginResponse(response?.data?.LoginDetail);
//     const success =
//       response?.data?.Result?.[0]?.Success === "1" ||
//       response?.data?.LoginResponse?.[0]?.MSG_DET === "Login Success" ||
//       response?.data?.LoginDetail;

//     if (success) {
//       const credentials = await Keychain.getGenericPassword({
//         authenticationPrompt: {
//           title: "Login with Biometrics",
//           subtitle: "Use your fingerprint or FaceID",
//         },
//       });

//       if (!credentials) {
//         Alert.alert("No Saved Credentials", "Please login manually first.");
//         return;
//       }

//       let savedData;
//       try {
//         savedData = JSON.parse(credentials.password);
//       } catch (parseError) {
//         Alert.alert("Error", "Failed to parse saved credentials.");
//         return;
//       }

//       const loginDetail = savedData?.LoginDetail?.[0];
//       const userId = savedData;
//       const userType = loginDetail?.User_Type;

//       if (userType || payload.STUDENT_ID) {
//         navigation.replace("Splash", { userId });
//       } else {
//         Alert.alert("Login Error", "Unable to determine user type.");
//       }

//     } else {
//       clg
//       Alert.alert("Login Failed", "Invalid credentials or user not found.");
//     }

//   } catch (error) {
//     console.log(error)
//     Alert.alert("Login Failed", error || "Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };



// const handleOTPChange = (text, index) => {
//   if (/^[0-9]?$/.test(text)) {
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);

//     if (text && index < 3) {
//       inputs.current[index + 1].focus();
//     }
//   }
// };

// const handleKeyPress = (e, index) => {
//   if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
//     inputs.current[index - 1].focus();
//   }
// };

// // const handleVerifyOTP = async () => {
// //   const fullOTP = otp.join("");
// //   if (fullOTP.length < 4) {
// //     Alert.alert("Error", "Please enter 4-digit OTP");
// //     return;
// //   }

// //   try {
// //     const payload = {
// //       STUDENT_ID: userid,
// //       PASSWORD: password,
// //       OTP: fullOTP,
// //     };
// //     console.log(payload,"otpVerify")

// //     const response = await AuthService.verifyOtp(payload);
// //     if (response?.OTPValid) {


// //       await Keychain.setGenericPassword(
// //         userid.toString(),
// //         JSON.stringify({
// //           password,
// //           studentDetails: response || null,
// //         }),
// //         {
// //           accessControl: biometryType
// //             ? Keychain.ACCESS_CONTROL.BIOMETRY_ANY
// //             : undefined,
// //           accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
// //         }
// //       );



// //       // if (response?.OTP === "8888") {
// //       //   navigation.replace("HomeLayout");
// //       // }
// //       // if (response?.OTP === "9999") {
// //       //   navigation.replace("Faculty");
// //       // }

// //     } else {
// //       Alert.alert("OTP Failed", "Invalid or expired OTP.");
// //     }
// //   } catch (error) {
// //     Alert.alert("OTP Verification Failed", error.message || "Try again");
// //   }
// // };





// // const handleVerifyOTP = async () => {
// //   const fullOTP = otp.join("");
// //   if (fullOTP.length < 4) {
// //     Alert.alert("Error", "Please enter 4-digit OTP");
// //     return;
// //   }
// //   try {
// //     const payload = {
// //       STUDENT_ID: loginResponse?.STUDENT_ID || userid,
// //       PASSWORD: password,
// //       OTP: fullOTP,
// //     };

// //     // console.log(payload, "otpVerify");
// //     const response = await AuthService.verifyOtp(payload);
// //     if (response?.OTPValid) {
// //       const credentials = await Keychain.getGenericPassword({
// //         authenticationPrompt: {
// //           title: "Login with Biometrics",
// //           subtitle: "Use your fingerprint or FaceID",
// //         },
// //       });
// //       if (credentials) {
// //         const savedData = JSON.parse(credentials.password);
// //         const userId = savedData;
// //         const userType = userId.LoginDetail?.[0]?.User_Type;
// //         const loginType = savedData?.[0]?.LOGIN_TYPE;
// //         if (userType) {
// //           return navigation.replace("Faculty", { userId });
// //         } else if (loginType) {
// //           return navigation.replace("HomeLayout", { userId });
// //         }
// //       } else {
// //         Alert.alert("No Saved Credentials", "Please login manually first.");
// //       }

// //     } else {
// //       Alert.alert("OTP Failed", "Invalid or expired OTP.");
// //     }
// //   } catch (error) {
// //     Alert.alert("OTP Verification Failed", error.message || "Try again");
// //   }
// // };



// const handleVerifyOTP = async () => {
//   const fullOTP = otp.join("");
//   if (fullOTP.length < 4) {
//     Alert.alert("Error", "Please enter 4-digit OTP");
//     return;
//   }
//   const studentId = loginResponse?.STUDENT_ID || userid;
//   const payload = {
//     STUDENT_ID: studentId,
//     PASSWORD: password,
//     OTP: fullOTP,
//   };
//   try {
//     const response = await AuthService.verifyOtp(payload);

//     // if (!response?.OTPValid) {
//     //   Alert.alert("OTP Failed", "Invalid or expired OTP.");
//     //   return;
//     // }

//     const credentials = await Keychain.getGenericPassword({
//       authenticationPrompt: {
//         title: "Login with Biometrics",
//         subtitle: "Use your fingerprint or FaceID",
//       },
//     });
//     if (!credentials) {
//       Alert.alert("No Saved Credentials", "Please login manually first.");
//       return;
//     }

//     // with otp 
//     let savedData;
//     try {
//       savedData = JSON.parse(credentials.password);
//     } catch (parseError) {
//       Alert.alert("Error", "Failed to parse saved credentials.");
//       return;
//     }
//     const loginDetail = savedData?.LoginDetail?.[0];
//     const userId = savedData;
//     const userType = loginDetail?.User_Type;
//     const loginType = savedData?.[0]?.LOGIN_TYPE;
//     // console.log(loginDetail,"student or not")
//     if (userType) {
//       navigation.replace("Splash", { userId });
//     } else if (payload.STUDENT_ID) {
//       navigation.replace("Splash", { userId });
//     } else {
//       Alert.alert("Login Error", "Unable to determine user type.");
//     }
//   } catch (error) {
//     const message = error?.message || "Try again";
//     Alert.alert("OTP Verification Failed", message);
//   }
// };



// const handleResendOTP = () => {
//   setOtp(["", "", "", ""]);
//   setTimer(30);
//   Alert.alert("OTP Sent", "New OTP sent to your number.");
// };

// // const handleBiometricLogin = async () => {
// //   try {
// //     const credentials = await Keychain.getGenericPassword({
// //       authenticationPrompt: {
// //         title: "Login with Biometrics",
// //         subtitle: "Use your fingerprint or FaceID",
// //       },
// //     });

// //     if (credentials) {
// //       const savedData = JSON.parse(credentials.password);
// //       const userId = savedData;
// //       const userType = userId.LoginDetail?.[0]?.User_Type;
// //       const loginType = savedData?.[0]?.LOGIN_TYPE;
// //       if (userType) {
// //         return navigation.replace("AdminHomeLayout", { userId });
// //       } else if (loginType) {
// //         return navigation.replace("HomeLayout", { userId });
// //       }
// //     } else {
// //       Alert.alert("No Saved Credentials", "Please login manually first.");
// //     }
// //   } catch (error) {
// //     Alert.alert("Biometric Auth Failed", "Try again or use manual login.");
// //     return navigation.replace("Login");
// //   }
// // };



// const handleBiometricLogin = async () => {
//   try {
//     const credentials = await Keychain.getGenericPassword({
//       authenticationPrompt: {
//         title: "Login with Biometrics",
//         subtitle: "Use your fingerprint or FaceID",
//       },
//     });
//     if (credentials) {
//       const savedData = JSON.parse(credentials.password);
//       const userId = savedData?.LoginDetail;
//       // console.log(savedData, "userTypeuserType")
//       const userType = savedData?.LoginDetail?.[0]?.User_Type;
//       const userTypeMaster = savedData?.LoginDetail?.User_Type;
//       // console.log(userType, "usertype")
//       const loginType = savedData?.LoginDetail?.[0]?.LOGIN_TYPE;
//       const studentLoginType = savedData?.[0]?.LOGIN_TYPE;
//       // console.log(studentLoginType)

//       if (userType == 3 || userTypeMaster) {
//         // console.log(userType,"userTypeuserType")
//         return navigation.replace("Admin", { userId });
//       } else if (userType == 2) {
//         return navigation.replace("Admin", { userId });
//       }
//       else if (userType == 4) {
//         return navigation.replace("Admin", { userId });
//       }
//       else if (studentLoginType) {
//         return navigation.replace("Student", { userId });
//       } else {
//         Alert.alert("Invalid User Type", "No valid user type found.");
//       }
//     } else {
//       Alert.alert("No Saved Credentials", "Please login manually first.");
//     }
//   } catch (error) {
//     Alert.alert("Biometric Auth Failed", "Try again or use manual login.");
//     return navigation.replace("Login");
//   }
// };


// const word = "MOR-GURUKUL";
// return (
//   <SafeAreaView style={styles.safeArea}>
//     <StatusBar backgroundColor={colors.bgcolor} barStyle="light-content" />
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}>
//       <View style={styles.bg}>
//         <Image
//           source={require('../../../assets/logo_mgu.png')}
//           style={styles.image}
//         />
//         <View style={styles.bannerContainer}>
//           <Text style={styles.bannerText}>
//             {word.split('').map((letter, index) => (
//               <Text key={index} style={{ color: 'white' }}>
//                 {letter}
//               </Text>
//             ))}
//           </Text>
//         </View>
//       </View>

//       {/* --- Login/OTP Form Area --- */}
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={styles.inner}>
//           {/* Login to your account / Enter OTP subtitle */}
//           <Text style={styles.subtitle}>
//             {showOTP ? 'Enter OTP' : 'Login to your account'}
//           </Text>

//           {/* <UpdateChecker /> */}

//           {/* --- Login Form (UserID/Password) --- */}
//           {!showOTP && !hasSavedCredentials && (
//             <>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter Student Or Faculty ID"
//                 value={userid}
//                 onChangeText={setuserid}
//                 autoCapitalize="none"
//                 placeholderTextColor="#aaa"
//               />

//               <View style={styles.passwordContainer}>
//                 <TextInput
//                   style={styles.passwordInput}
//                   placeholder="Enter Password"
//                   value={password}
//                   onChangeText={setPassword}
//                   secureTextEntry={secure}
//                   autoCapitalize="none"
//                   placeholderTextColor="#aaa" />
//                 <TouchableOpacity onPress={() => setSecure(!secure)}>
//                   <Text style={styles.toggle}>{secure ? '👁️' : '👨🏻‍💻'}</Text>
//                 </TouchableOpacity>
//               </View>

//               <TouchableOpacity
//                 style={[styles.button, { backgroundColor: colors.bgcolor }]}
//                 onPress={handleLogin}
//                 disabled={loading}>
//                 {loading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text style={styles.buttonText}>Login</Text>
//                 )}
//               </TouchableOpacity>
//             </>
//           )}

//           {/* --- OTP Verification Form --- */}
//           {showOTP && (
//             <>
//               <View style={styles.otpContainer}>
//                 {otp.map((digit, index) => (
//                   <TextInput
//                     key={index}
//                     ref={ref => (inputs.current[index] = ref)}
//                     style={styles.otpInput}
//                     value={digit}
//                     keyboardType="number-pad"
//                     maxLength={1}
//                     onChangeText={text => handleOTPChange(text, index)}
//                     onKeyPress={e => handleKeyPress(e, index)}
//                     textAlign="center"
//                   />
//                 ))}
//               </View>
//               <TouchableOpacity
//                 style={[styles.button, { backgroundColor: colors.bgcolor }]}
//                 onPress={handleVerifyOTP}>
//                 <Text style={styles.buttonText}>Verify OTP</Text>
//               </TouchableOpacity>
//               <View style={styles.resendContainer}>
//                 {timer > 0 ? (
//                   <Text style={styles.timerText}>
//                     Resend OTP in {timer}s
//                   </Text>
//                 ) : (
//                   <TouchableOpacity onPress={handleResendOTP}>
//                     <Text style={styles.resendText}>Resend OTP</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </>
//           )}

//           {/* --- Biometric/Saved Credentials Login --- */}
//           {hasSavedCredentials && !showOTP && (
//             <>
//               <TouchableOpacity
//                 style={styles.fingerprintCircle}
//                 onPress={handleBiometricLogin}>
//                 {/* <FontAwesome6 name="house" size={40} color="#b22707ff" /> */}
//                 <Text style={{ fontSize: 40, color: '#b22707ff' }}>🏠</Text>
//               </TouchableOpacity>
//               <Text style={styles.fingerprintText}>Click here</Text>
//             </>
//           )}
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   </SafeAreaView>
// );
// };


// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#F8F5E9' },
//   container: { flex: 1 },
//   bg: {
//     height: 330,
//     backgroundColor: colors.bgcolor,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   inner: {
//     flex: 1,
//     padding: 20,
//     marginTop: -50,
//     backgroundColor: '#F8F5E9',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#666',
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   input: {
//     backgroundColor: '#D9E9CF',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#D9E9CF',
//     padding: 10,
//     borderRadius: 12,
//     marginBottom: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   passwordInput: { flex: 1, fontSize: 16, paddingHorizontal: 6 },
//   toggle: { marginLeft: 10, fontSize: 18, padding: 5 },
//   button: {

//     padding: 16,
//     borderRadius: 55,
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#fff',
//   },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//     paddingHorizontal: 10,
//   },
//   otpInput: {
//     borderWidth: 1,
//     borderColor: '#ffbdbdff',
//     borderRadius: 8,
//     padding: 0,
//     fontSize: 18,
//     width: 45,
//     height: 45,
//     backgroundColor: '#fff',
//   },
//   resendContainer: { alignItems: 'center', marginBottom: 16 },
//   timerText: { color: '#777', fontSize: 14 },
//   resendText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 14 },
//   fingerprintCircle: {
//     alignSelf: 'center',
//     marginTop: 16,
//     borderRadius: 100,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   fingerprintText: {
//     textAlign: 'center',
//     marginTop: 8,
//     fontSize: 14,
//     color: '#777',
//   },
//   image: {
//     marginTop: -50,
//     width: 140,
//     height: 140,
//     backgroundColor: '#ffffffff',
//     borderRadius: 70,

//   },


//   bannerContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 55,
//     margin: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//   },
//   bannerText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontFamily: 'serif',
//     letterSpacing: 2,
//     textShadowColor: 'rgba(0, 0, 0, 0.4)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
// });
// export default LoginScreen;

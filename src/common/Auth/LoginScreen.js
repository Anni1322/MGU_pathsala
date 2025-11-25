//with otp and fingurprint
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Keychain from "react-native-keychain";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AuthService from "../../common/Services/AuthService";
import SessionService from "../../common/Services/SessionService";
import UpdateChecker from '../../common/UpdateChecker';


const LoginScreen = () => {

  // const [userid, setuserid] = useState("MIS1004");
  // const [password, setPassword] = useState("Akdave22@#");

  const [userid, setuserid] = useState("MIS1033");
  const [password, setPassword] = useState("Shree@164$");

  // const [userid, setuserid] = useState("MIS10108");
  // const [password, setPassword] = useState("Saurabh@12345");

  // const [userid, setuserid] = useState("");
  // const [password, setPassword] = useState("");

  // const [userid, setuserid] = useState("10000000");
  // const [password, setPassword] = useState("10000000");

  // const [userid, setuserid] = useState("MIS0001");
  // const [password, setPassword] = useState("MIS0001");

  // const [userid, setuserid] = useState("20202595");
  // const [password, setPassword] = useState("Nikki@21");

  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [biometryType, setBiometryType] = useState(null);
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);


  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
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
        // console.log("Error checking keychain/biometry:", error);
      }
    };

    checkCredentialsAndBiometry();
  }, []);

  useEffect(() => {
    let interval;
    if (showOTP && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showOTP, timer]);


  // const handleLogin = async () => {
  //   if (!userid || !password) {
  //     Alert.alert("Validation Error", "Please enter ID and password.");
  //     return;
  //   }

  //   if (userid) {
  //     console.log(userid);
  //     if (userid === '10000000' && password === '10000000' ) {
  //       navigation.replace("Splash");
  //       // navigation.replace("student", { userid });
  //       return
  //     } else {
  //       if (userid === 'MIS0001' && password === 'MIS0001') {
  //         // navigation.replace("Faculty");
  //         navigation.replace("admin", { userid });
  //         return
  //       }
  //     }
  //      return
  //   }

  //   try {
  //     setLoading(true);

  //     const isFaculty = userid.toUpperCase().startsWith("MIS");
  //     const payload = {
  //       [isFaculty ? "FACULTY_ID" : "STUDENT_ID"]: userid,
  //       user_id: userid,
  //       ip_address: "0.0.0.0",
  //       PASSWORD: password,
  //     };


  //     const response = isFaculty
  //       ? await AuthService.loginFaculty(payload)
  //       : await AuthService.loginStudent(payload);
  //     // console.log("response admin:", response?.data?.LoginDetail);
  //     // console.log("response admin:", response?.data?.LoginResponse?.[0]?.MSG_DET == "Login Success");
  //     setLoginResponse(response?.data?.LoginDetail);
  //     if (response?.data?.Result?.[0]?.Success === "1" || response?.data?.LoginResponse?.[0]?.MSG_DET == "Login Success" || response?.data?.LoginDetail) {
  //       // setShowOTP(true);
  //       // setTimer(30);

  //       // without OTP
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
  //       const loginType = savedData?.[0]?.LOGIN_TYPE;
  //       // console.log(loginDetail,"student or not")
  //       if (userType) {
  //         navigation.replace("Splash", { userId });
  //       } else if (payload.STUDENT_ID) {
  //         navigation.replace("Splash", { userId });
  //       } else {
  //         Alert.alert("Login Error", "Unable to determine user type.");
  //       }
  //       return;
  //     }



  //   } catch (error) {
  //     Alert.alert("Login Failed check your Network", error.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // with masterid
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
      // Store the session data securely in Keychain
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


      // Store the session data securely in Keychain
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

      const isFaculty = userid.toUpperCase().startsWith("MIS");
      const payload = {
        [isFaculty ? "FACULTY_ID" : "STUDENT_ID"]: userid,
        user_id: userid,
        ip_address: "0.0.0.0",
        PASSWORD: password,
      };

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

  // const handleVerifyOTP = async () => {
  //   const fullOTP = otp.join("");
  //   if (fullOTP.length < 4) {
  //     Alert.alert("Error", "Please enter 4-digit OTP");
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       STUDENT_ID: userid,
  //       PASSWORD: password,
  //       OTP: fullOTP,
  //     };
  //     console.log(payload,"otpVerify")

  //     const response = await AuthService.verifyOtp(payload);
  //     if (response?.OTPValid) {


  //       await Keychain.setGenericPassword(
  //         userid.toString(),
  //         JSON.stringify({
  //           password,
  //           studentDetails: response || null,
  //         }),
  //         {
  //           accessControl: biometryType
  //             ? Keychain.ACCESS_CONTROL.BIOMETRY_ANY
  //             : undefined,
  //           accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  //         }
  //       );



  //       // if (response?.OTP === "8888") {
  //       //   navigation.replace("HomeLayout");
  //       // }
  //       // if (response?.OTP === "9999") {
  //       //   navigation.replace("Faculty");
  //       // }

  //     } else {
  //       Alert.alert("OTP Failed", "Invalid or expired OTP.");
  //     }
  //   } catch (error) {
  //     Alert.alert("OTP Verification Failed", error.message || "Try again");
  //   }
  // };





  // const handleVerifyOTP = async () => {
  //   const fullOTP = otp.join("");
  //   if (fullOTP.length < 4) {
  //     Alert.alert("Error", "Please enter 4-digit OTP");
  //     return;
  //   }
  //   try {
  //     const payload = {
  //       STUDENT_ID: loginResponse?.STUDENT_ID || userid,
  //       PASSWORD: password,
  //       OTP: fullOTP,
  //     };

  //     // console.log(payload, "otpVerify");
  //     const response = await AuthService.verifyOtp(payload);
  //     if (response?.OTPValid) {
  //       const credentials = await Keychain.getGenericPassword({
  //         authenticationPrompt: {
  //           title: "Login with Biometrics",
  //           subtitle: "Use your fingerprint or FaceID",
  //         },
  //       });
  //       if (credentials) {
  //         const savedData = JSON.parse(credentials.password);
  //         const userId = savedData;
  //         const userType = userId.LoginDetail?.[0]?.User_Type;
  //         const loginType = savedData?.[0]?.LOGIN_TYPE;
  //         if (userType) {
  //           return navigation.replace("Faculty", { userId });
  //         } else if (loginType) {
  //           return navigation.replace("HomeLayout", { userId });
  //         }
  //       } else {
  //         Alert.alert("No Saved Credentials", "Please login manually first.");
  //       }

  //     } else {
  //       Alert.alert("OTP Failed", "Invalid or expired OTP.");
  //     }
  //   } catch (error) {
  //     Alert.alert("OTP Verification Failed", error.message || "Try again");
  //   }
  // };



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

      // if (!response?.OTPValid) {
      //   Alert.alert("OTP Failed", "Invalid or expired OTP.");
      //   return;
      // }

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
      // console.log(loginDetail,"student or not")
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
  //       const userId = savedData;
  //       const userType = userId.LoginDetail?.[0]?.User_Type;
  //       const loginType = savedData?.[0]?.LOGIN_TYPE;
  //       if (userType) {
  //         return navigation.replace("AdminHomeLayout", { userId });
  //       } else if (loginType) {
  //         return navigation.replace("HomeLayout", { userId });
  //       }
  //     } else {
  //       Alert.alert("No Saved Credentials", "Please login manually first.");
  //     }
  //   } catch (error) {
  //     Alert.alert("Biometric Auth Failed", "Try again or use manual login.");
  //     return navigation.replace("Login");
  //   }
  // };



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
        // console.log(savedData, "userTypeuserType")
        const userType = savedData?.LoginDetail?.[0]?.User_Type;
        const userTypeMaster = savedData?.LoginDetail?.User_Type;
        // console.log(userType, "usertype")
        const loginType = savedData?.LoginDetail?.[0]?.LOGIN_TYPE;
        const studentLoginType = savedData?.[0]?.LOGIN_TYPE;
        // console.log(studentLoginType)


        if (userType == 3 || userTypeMaster) {
          // console.log(userType,"userTypeuserType")
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


  const colors = [
    // '#FF5733',   
    // '#33FF57',   
    // '#3357FF',   
    // '#FF33A1',   
    // '#e98101ff',   
    // '#8A2BE2',   
    // '#FFFF00',   
    // '#FF1493',  
    // '#00BFFF',  
    // '#8B0000',   
    // '#FFB823',   
    '#612e07ff',
    // '#FFF6DA',   
  ];



  const word = "MOR-GURUKUL";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>

            {/* <Image
          source={require('../../../assets/signin.png')}
          width={300}
          height={300}
           >

          </Image> */}


            {/* <View style={styles.textContainer}> */}
            <View style={styles.card}>
              <Text style={styles.bannerText}>
                {word.split('').map((letter, index) => (
                  <Text key={index} style={{ color: colors[index % colors.length] }}>
                    {letter}
                  </Text>
                ))}
              </Text>
            </View>
            {/* </View> */}


            {/* <Text style={styles.title}>MOR-GURUKUL</Text> */}

            {/* <Text style={styles.subtitle}>
              {showOTP ? "Enter OTP" : "Login to your account"}
            </Text> */}

            <UpdateChecker />
            {!showOTP && !hasSavedCredentials && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Student / Faculty ID"
                  value={userid}
                  onChangeText={setuserid}
                  // keyboardType="numeric"
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
                    <Text style={styles.toggle}>{secure ? "👁️" : "🙈"}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {showOTP && (
              <>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (inputs.current[index] = ref)}
                      style={styles.otpInput}
                      value={digit}
                      keyboardType="number-pad"
                      maxLength={1}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      textAlign="center"
                    />
                  ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
                  <Text style={styles.buttonText}>Verify OTP</Text>
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                  {timer > 0 ? (
                    <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
                  ) : (
                    <TouchableOpacity onPress={handleResendOTP}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>

              </>
            )}

            {/* {hasSavedCredentials && biometryType && !showOTP && ( */}
            {hasSavedCredentials && !showOTP && (
              <>
                <TouchableOpacity
                  style={styles.fingerprintCircle}
                  onPress={handleBiometricLogin}
                >
                  <FontAwesome6 name="house" size={40} color="#b22707ff" />

                </TouchableOpacity>
                <Text style={styles.fingerprintText}>
                  Click here{" "}
                  {/* Tap to login with{" "} */}
                  {/* {biometryType === "FaceID" ? "Face ID" : "Fingerprint"} */}
                </Text>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F5E9" },
  container: { flex: 1 },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "stretch",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
    fontStyle: "italic",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
    marginBottom: 50
  },

  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#D9E9CF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ffffffff'
  },
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#D9E9CF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#ffffffff'
  },
  passwordInput: { flex: 1, fontSize: 16 },
  toggle: { marginLeft: 10, fontSize: 18 },
  button: {
    backgroundColor: "#007E6E",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffffffff'
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ffbdbdff",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    width: 50,
    height: 50,
    backgroundColor: "#fff",
  },
  resendContainer: { alignItems: "center", marginBottom: 16 },
  timerText: { color: "#777", fontSize: 14 },
  resendText: { color: "#4CAF50", fontWeight: "bold", fontSize: 14 },
  fingerprintCircle: {
    alignSelf: "center",
    marginTop: 16,
    borderRadius: 100,
    padding: 20,
    backgroundColor: "#fff",
  },
  fingerprintText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#777",
  },
  card:{
    // backgroundColor:'#fff',
    borderRadius:10,
  },

   textContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white for a card-like effect
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,  
  },
  bannerText: {
    color: '#FF9800',  
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'serif', 
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    padding:20
  },
});

export default LoginScreen;

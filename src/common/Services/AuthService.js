// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { HttpService } from "./HttpService";
// import { Alert } from "react-native";

// export const AuthService = {
//   login: async (payload) => {
//     Alert.alert("Payload received"); // Debugging alert
//     console.log("Login Payload:", payload);

//     try {
//       const data = await HttpService.post("/auth/login", {
//         username: payload.misId,
//         password: payload.password,
//         otp: payload.otp,
//       });

//       // Save token for future requests
//       if (data?.token) {
//         await AsyncStorage.setItem("token", data.token);
//       }

//       return data;
//     } catch (error) {
//       console.error("Login failed:", error.response?.data || error.message);
//       throw error;
//     }
//   },

//   logout: async () => {
//     try {
//       await AsyncStorage.removeItem("token");
//       return true;
//     } catch (error) {
//       console.error("Logout failed:", error);
//       return false;
//     }
//   },

//   getToken: async () => {
//     return await AsyncStorage.getItem("token");
//   },

//   isLoggedIn: async () => {
//     const token = await AsyncStorage.getItem("token");
//     return !!token;
//   },
// };

// import { HttpService } from "../Api/HttpService";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const AuthService = {
//   login: async (payload) => {
//     try {
//       console.log(" AuthService.login() sending:", payload);

//       const response = await HttpService.post("/auth/login", payload);

//       // response structure: { token, user }
//       if (response?.token) {
//         await AsyncStorage.setItem("token", response.token); // store token
//         await AsyncStorage.setItem("role", payload.role); // store role
//         await AsyncStorage.setItem("user", JSON.stringify(response.user)); // store user
//       }

//       return response;
//     } catch (error) {
//       console.error("❌ Login failed:", error.response?.data || error.message);
//       throw error;
//     }
//   },

//   logout: async () => {
//     await AsyncStorage.removeItem("token");
//     await AsyncStorage.removeItem("role");
//     await AsyncStorage.removeItem("user");
//   },
//   getUser: async () => {
//     const user = await AsyncStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
//   },
//   getToken: async () => {
//     return await AsyncStorage.getItem("token");
//   },
// };

// export default AuthService;

// import { Alert } from "react-native";
// import { HttpService } from "../Services/HttpService";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const AuthService = {
//   login: async (payload) => {
//     try {
//       console.log("🔑 AuthService.login payload:", payload);

//         // const response = {
//         //   "LoginResponse": [
//         //     { "MSG": "Login", "MSG_DET": "Login Success", "LOGIN_TYPE": "R" }
//         //   ]
//         // };

//       const response = await HttpService.post("/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetLoginEncr", payload);

//       // Response example: { token, user: { id, name, email, role } }

//       // if (response?.token) {
//       //   await AsyncStorage.setItem("token", response.token);
//       //   await AsyncStorage.setItem("role", response.user.role);
//       //   await AsyncStorage.setItem("user", JSON.stringify(response.user));
//       // }

//       return response;
//     } catch (error) {
//         Alert.alert("❌  Login Failed", error.response?.data || error.message);
//       console.error("Login failed:", error.response?.data || error.message);
//       Alert
//       throw error;
//     }
//   },

//   logout: async () => {
//     await AsyncStorage.removeItem("token");
//     await AsyncStorage.removeItem("role");
//     await AsyncStorage.removeItem("user");
//   },

//   getUser: async () => {
//     const user = await AsyncStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
//   },

//   getToken: async () => {
//     return await AsyncStorage.getItem("token");
//   },
// };

// export default AuthService;




// import { Alert } from "react-native";
// import { HttpService } from "../Services/HttpService";
// import * as Keychain from "react-native-keychain";

// const AuthService = {
//   login: async (payload) => {
//     try {
//       //  Don't log password in production!
//       if (__DEV__) console.log("AuthService.login payload:", { ...payload, PASSWORD: "********" });

//       const response = await HttpService.post(
//         "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetLoginEncr",
//         payload
//       );

//       // Expect server to return token + user data
//       if (response?.token) {
//         await Keychain.setGenericPassword("authToken", response.token, {
//           accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
//         });
//       }

//     // Manually add extra details to the response
//     const modifiedResponse = {
//       ...response,
//       studentDetails: {
//         name: response?.student_name ?? "Nikki",
//         rollNumber: response?.roll_number ?? "2025CS001",
//         address: response?.address ?? "Raipur, Chhattisgarh",
//         semester: response?.semester ?? "5th",
//         department: response?.department ?? "Computer Science",
//         email: response?.email ?? "john.doe@example.com",
//         mobile: response?.mobile ?? "9876543210",
//       },
//       loginTime: new Date().toISOString(),
//     };

// //  const empty = null
// //       return empty;
//       return modifiedResponse;
//       // return response;
//     } catch (error) {
//       Alert.alert("Login Failed", error?.message || "Something went wrong");
//       console.error("Login failed:", error?.message);
//       throw error;
//     }
//   },

//   logout: async () => {
//     await Keychain.resetGenericPassword();
//   },

//   getToken: async () => {
//     const credentials = await Keychain.getGenericPassword();
//     return credentials ? credentials.password : null;
//   },
// };

// export default AuthService;








// dynamic api list
import { Alert } from 'react-native';
import { HttpService } from '../Services/HttpService';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getApiList from '../../student/config/Api/ApiList';
import getAdminApiList from '../../admin/config/Api/adminApiList';
import SessionService from '../../common/Services/SessionService';



const AuthService = {

  loginStudent: async (payload) => {
    // console.log("login payload", payload);

    try {
      const apiList = getApiList();
      const loginApi = apiList?.login;
      const response = await HttpService.post(loginApi, payload);
      console.log("loginStudent response", response.data);
      console.log("authservice response", response?.data.LoginResponse);

      if (response?.data?.LoginResponse?.[0]?.MSG_DET === "Login Success") {
        let userData = {
          ...response?.data.LoginResponse,
          STUDENT_ID: payload?.STUDENT_ID,
        };
        console.log("sessionObject", userData);
        await Keychain.setGenericPassword(
          "session",
          JSON.stringify(userData),
          { accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
        );

        // const currentSession = await SessionService.getSession();
        // console.log(currentSession,"currentSession")

        // await AsyncStorage.setItem("userProfile", JSON.stringify(userData));
        // return {
        //   ...response?.data,
        //   loginTime: new Date().toISOString(),
        // };

        return response
      }
      Alert.alert("Login Failed", "Invalid credentials");
      return null;

    } catch (error) {
      Alert.alert("Login Failed", error?.message || "Something went wrong");
      // console.error("Login failed:", error?.message);
      throw error;
    }
  },


  loginFaculty: async (payload) => {
    // console.log("loginFaculty payload", payload);
    try {
      const adminApiList = getAdminApiList();
      const loginApi = adminApiList.login;
      const response = await HttpService.get(loginApi, payload);
      console.log(response)
      // console.log(response?.data?.Result?.[0]?.Success === "1")
      if (response?.data?.Result?.[0]?.Success === "1") {
        let userData = {
          LoginDetail: response?.data?.LoginDetail
        };
        // console.log("sessionObject", userData);

        await Keychain.setGenericPassword(
          "session",
          JSON.stringify(userData),
          { accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
        );

        return response;

        // get session code
        // try {
        //     const credentials = await Keychain.getGenericPassword();
        //     if (credentials && credentials.username === 'session') {
        //       const userData = JSON.parse(credentials.password);
        //       console.log(userData)
        //       return userData;
        //     } else {
        //       // No session found
        //       return null;
        //     }
        //   } catch (error) {
        //     console.error("Error getting session data:", error);
        //     return null;
        //   }



        // await AsyncStorage.setItem("userProfile", JSON.stringify(userData));
        // return {
        //   ...response?.data,
        //   loginTime: new Date().toISOString(),
        // };
      }

      // Alert.alert("Login Failed", "Invalid credentials");
      // return null;

    } catch (error) {
      Alert.alert("Login Failed", error?.message || "Something went wrong");
      console.error("Login failed:", error?.message);
      throw error;
    }
  },





  logout: async () => {
    await Keychain.resetGenericPassword();
    await AsyncStorage.removeItem('userProfile');
  },

  getToken: async () => {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  },

  verifyOtp: async (payload) => {
    // console.log(payload)
    const studentOTP = "8888";
    const facultyOTP = "9999";
    try {
      const response = {
        OTPValid: payload.OTP === dummyOTP,
        // studentDetails: {
        //   role: "mguvv",
        //   name: "mguvv Raipur",
        // },
      };
      if (!response || typeof response.OTPValid === "undefined") {
        const isValid = payload.OTP === dummyOTP;
        return {
          OTPValid: isValid,
          // studentDetails: {
          //   role: "student",
          //   name: "Static Test User",
          // },
        };
      }

      return response;
    } catch (error) {
      const isValid = payload.OTP === studentOTP || payload.OTP === facultyOTP;
      return {
        OTPValid: isValid,
        OTP: payload.OTP
        // studentDetails: {
        //   role: "student",
        //   name: "Offline Test User",
        // },
      };
    }
  },
};

export default AuthService;


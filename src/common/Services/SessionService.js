import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Keychain from "react-native-keychain";

const SessionService = {
  getSession: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      // console.log(credentials,"credentials")
      if (credentials) {
        return JSON.parse(credentials.password);
      }

      // Fallback to AsyncStorage
      const storedProfile = await AsyncStorage.getItem("userProfile");
      if (storedProfile !== null) {
        return JSON.parse(storedProfile);
      }

      return null;  
    } catch (error) {
      console.error("Failed to get session:", error);
      return null;
    }
  },

// saveSession: async (data) => {
//   try {
//     console.log("Saving session data:", data);  // <-- ADD THIS
//     await Keychain.setGenericPassword(
//       "session",
//       JSON.stringify(data),
//       { accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
//     );
//     await AsyncStorage.setItem("userProfile", JSON.stringify(data));
//   } catch (error) {
//     console.error("Failed to save session:", error);
//   }
// },


saveSession: async (data) => {
  try {
    // console.log("Saving session data:", data);  // for debugging
    await Keychain.setGenericPassword(
      "session",
      JSON.stringify(data),
      { accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
    );
    await AsyncStorage.setItem("userProfile", JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
},



  clearSession: async () => {
    try {
      await Keychain.resetGenericPassword();
      await AsyncStorage.removeItem("userProfile");
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  },
};

export default SessionService;

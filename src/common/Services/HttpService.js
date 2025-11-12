// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import qs from "qs";

// const API_BASE_URL = "http://igkv.ac.in";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });


// api.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.warn("Error reading token:", error);
//     }
//     return config;
//   });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized - Logging out...");
//       await AsyncStorage.removeItem("token");
//       // Optionally, redirect to login screen here

//     }
//     return Promise.reject(error);
//   }
// );

// export const HttpService = {
//   get: async (path, params = {}) => {
//     try {
//       const response = await api.get(path, { params });
//       return response.data;
//     } catch (error) {
//       console.error(`❌ GET ${path} failed:`, error.response?.data || error.message);
//       throw error.response?.data || error;
//     }
//   },

//   // post: async (path, data = {}) => {
//   //   try {
//   //     console.log("Api",path,data)
//   //     const response = await api.post(path, data);
//   //     return response.data;
//   //   } catch (error) {
//   //     console.error(`❌ POST ${path} failed:`, error.response?.data || error.message);
//   //     throw error.response?.data || error;
//   //   }
//   // },


//   post: async (path, data = {}) => {
//     try {
//       console.log("Api POST:", path, data);
//       const response = await api.post(path, qs.stringify(data), {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error(`❌ POST ${path} failed:`, error.response?.data || error.message);
//       throw error.response?.data || error;
//     }
//   },

//   put: async (path, data = {}) => {
//     try {
//       const response = await api.put(path, data);
//       return response.data;
//     } catch (error) {
//       console.error(`❌ PUT ${path} failed:`, error.response?.data || error.message);
//       throw error.response?.data || error;
//     }
//   },

//   delete: async (path, params = {}) => {
//     try {
//       const response = await api.delete(path, { params });
//       return response.data;
//     } catch (error) {
//       console.error(`❌ DELETE ${path} failed:`, error.response?.data || error.message);
//       throw error.response?.data || error;
//     }
//   },
// };





import axios from "axios";
import * as Keychain from "react-native-keychain";
import qs from "qs";
import { API_BASE_URL } from '../../common/config/BaseUrl';

//  export const API_BASE_URL = "https://igkv.ac.in";  

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// api.interceptors.request.use(async (config) => {
//   try {
//     const credentials = await Keychain.getGenericPassword();
//     if (credentials && credentials.password) {
//       config.headers.Authorization = `Bearer ${credentials.password}`;
//     }
//   } catch (error) {
//     console.warn("⚠️ Error reading token:", error);
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       console.warn("⚠️ Unauthorized - Token may be expired");
//       await Keychain.resetGenericPassword();
//       // Optionally navigate to login screen here
//     }
//     return Promise.reject(error);
//   }
// );

export const HttpService = {
  get: async (path, params = {}) => {
    // console.log(params);
    try {
      const response = await api.get(path, { params });
      // console.log(response,"responseresponseresponseresponse")
      return response;
    } catch (error) {
      // console.error(`GET ${path} failed:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },




  // post: async (path, data = {}) => {
  //   try {
  //     console.log(data)
  //     const response = await api.post(path, qs.stringify(data), {
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     });
  //     console.log(response,"responseresponse");
  //     return response;
  //   } catch (error) {
  //     console.error(`POST ${path} failed:`, error.response?.data || error.message);
  //     throw error.response?.data || error;
  //   }
  // },


  post: async (path, data = {}) => {
    try {
      // console.log(data);

      // Check if data is FormData (for file uploads)
      const isFormData = data instanceof FormData;

      const config = {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }  
          : { "Content-Type": "application/x-www-form-urlencoded" },
      };

      // Only stringify if not FormData
      const payload = isFormData ? data : qs.stringify(data);
      const response = await api.post(path, payload, config);
      // console.log(response, "responseresponse ok");
      return response;
    } catch (error) {
      // console.error(`POST ${path} failed:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  put: async (path, data = {}) => {
    try {
      const response = await api.put(path, data);
      return response.data;
    } catch (error) {
      console.error(` PUT ${path} failed:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  delete: async (path, params = {}) => {
    try {
      const response = await api.delete(path, { params });
      return response.data;
    } catch (error) {
      console.error(`❌ DELETE ${path} failed:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },
};

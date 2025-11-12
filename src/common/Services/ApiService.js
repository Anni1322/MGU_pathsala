import {HttpService} from './HttpService';  
import { Alert } from 'react-native';

const ApiService = {
  request: async ({ endpoint, payload = {}, method = 'POST' }) => {
    try {
      if (!endpoint) throw new Error('API endpoint not provided.');

      let response;

      if (method === 'POST') {
        response = await HttpService.post(endpoint, payload);
      } else if (method === 'GET') {
        response = await HttpService.get(endpoint, payload);  
      } else {
        throw new Error('Unsupported HTTP method');
      }

      // Since HttpService returns only response.data, no need to check response.status here
      if (!response) {
        throw new Error('Request failed with empty response');
      }

      return response; // response is already the data
    } catch (error) {
      console.error('API Request Failed:', error);
      Alert.alert('API Error', error?.message || 'Something went wrong');
      throw error;
    }
  }
};

export default ApiService;

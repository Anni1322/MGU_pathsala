import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

const DeviceService = {
  // Synchronous info (Available immediately)
  getBasicInfo: () => {
    return {
      brand: DeviceInfo.getBrand(),
      model: DeviceInfo.getModel(),
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      bundleId: DeviceInfo.getBundleId(),
      isTablet: DeviceInfo.isTablet(),
    };
  },

  // Asynchronous info (Requires 'await')
  getFullDeviceDetails: async () => {
    try {
      return {
        uniqueId: await DeviceInfo.getUniqueId(),
        deviceId: DeviceInfo.getDeviceId(), // Sync
        apiLevel: await DeviceInfo.getApiLevel(),
        carrier: await DeviceInfo.getCarrier(),
        totalMemory: await DeviceInfo.getTotalMemory(),
        isEmulator: await DeviceInfo.isEmulator(),
        batteryLevel: await DeviceInfo.getBatteryLevel(),
      };
    } catch (error) {
      console.error("Error fetching device info:", error);
      return null;
    }
  },

  getNetworkInfo: async () => {
    try {
      console.log( DeviceInfo.getIpAddress,"await DeviceInfo.getIpAddress()");
      return {
        ipAddress: await DeviceInfo.getIpAddress(),
        macAddress: await DeviceInfo.getMacAddress(), // Requires specific permissions
        isWifiEnabled: await DeviceInfo.isWifiEnabled(),
      };
    } catch (error) {
      console.error("Error fetching network info:", error);
      return { ipAddress: 'Unavailable' };
    }
  },
};

export default DeviceService;
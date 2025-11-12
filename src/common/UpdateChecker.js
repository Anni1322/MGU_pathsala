import React, { useEffect } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check'; 

const UpdateChecker = () => {
  const checkForUpdate = async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();
      const currentBuild = DeviceInfo.getBuildNumber();

      // console.log('Device Current Version:', currentVersion);
      // console.log('Device Current Build:', currentBuild);

      // Fetch latest version from Play Store (or App Store for iOS)
      const latestVersion = await VersionCheck.getLatestVersion({
        provider: Platform.OS === 'ios' ? 'appStore' : 'playStore',
        packageName: 'igkvmis.igkv', 
      });

      // console.log('Store Latest Version:', latestVersion);

      // Explicit check: If device version matches store version, do not show alert
      if (currentVersion === latestVersion) {
        // console.log('Device and store versions are the same. No update needed. Alert not shown.');
        return; 
      }

      if (VersionCheck.needUpdate({ currentVersion, latestVersion })) {
        // Example: force update if major version differs or for specific versions.
        const forceUpdate = false; // Set to true if mandatory (e.g., if latestVersion starts with '2.')

        Alert.alert(
          'Update Available',
          forceUpdate
            ? 'A new version is required to continue using the app.'
            : 'A new version is available. Please update for the best experience.',
          [
            !forceUpdate && {
              text: 'Later',
              style: 'cancel',
            },
            {
              text: 'Update Now',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('itms-apps://itunes.apple.com/app/idYOUR_IOS_APP_ID');
                } else {
                  Linking.openURL('market://details?id=igkvmis.igkv');
                }
              },
            },
          ].filter(Boolean), 
          { cancelable: !forceUpdate }
        );
      } else {
        console.log('App is up to date. No alert shown.');
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  };
  useEffect(() => {
    checkForUpdate();
  }, []);

  return null;
};

export default UpdateChecker;


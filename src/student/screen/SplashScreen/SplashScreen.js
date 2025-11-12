// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// export default function SplashScreen({ navigation }) {
//   useEffect(() => {
//     setTimeout(() => navigation.replace('Login'), 2000);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.logo}>🌱 eKrishi Pathshala</Text>
//       <ActivityIndicator size="large" color="#4CAF50" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5E9' },
//   logo: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32' }
// });



import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌱 eKrishi Pathshala</Text>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5E9' },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32', marginBottom: 20 }
});

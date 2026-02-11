import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size) => (SCREEN_WIDTH / 375) * size;
const PrivacyPolicy = ({ navigation }) => {
  const universityName = "Mahatma Gandhi University";
  
  const PolicyCard = ({ title, content, bullets = [] }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {content ? <Text style={styles.cardText}>{content}</Text> : null}
      {bullets.map((item, index) => (
        <View key={index} style={styles.bulletRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      
      {/* Responsive Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backCircle}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>{universityName} MIS</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollPadding}
      >
        <Text style={styles.introText}>
          We value your privacy. This document outlines how we handle your data across the Student and Admin domains.
        </Text>

        <PolicyCard 
          title="1. Data Collection" 
          content="To provide academic and administrative services, we collect the following:"
          bullets={[
            "Profile: Name, Enrollment Number, and Academic History.",
            "Biometrics: Local device encryption for secure login.",
            // "Hardware: Camera for QR attendance and handwriting detection."
          ]}/>

        <PolicyCard 
          title="2. Usage of Information" 
          content="The data collected is used solely for university operations, including:"
          bullets={[
            "Examination integrity and automated grading.",
            "Digital issuance of admint card, fee receipts etc.",
            "E-Grievance tracking and support resolution."
          ]}
        />

        <PolicyCard 
          title="3. Security Standards" 
          content="Your data is protected using industry-standard encryption. We use Secure Keychain for credentials and SSL-pinned API calls to our Node.js servers."
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            For account deletion or data portability requests, please contact the IT Helpdesk.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => Linking.openURL('https://mguvv.ac.in/angular/about/overview')}
        >
          <Text style={styles.primaryButtonText}>Read More</Text>
        </TouchableOpacity>

        <Text style={styles.versionInfo}>Version 1.0.2 • February 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  header: {
    backgroundColor: '#1A237E',
    paddingHorizontal: '5%',
    paddingTop: Platform.OS === 'ios' ? 50 : scale(45),
    paddingBottom: scale(25),
    borderBottomLeftRadius: scale(25),
    borderBottomRightRadius: scale(25),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  backCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
  },
  backArrow: {
    color: '#FFF',
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: scale(12),
    color: '#C5CAE9',
    fontWeight: '500',
  },
  scrollPadding: {
    paddingHorizontal: '5%',
    paddingBottom: scale(40),
    paddingTop: scale(20),
  },
  introText: {
    fontSize: scale(14),
    color: '#5C6BC0',
    lineHeight: scale(20),
    marginBottom: scale(20),
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: scale(16),
    padding: scale(18),
    marginBottom: scale(16),
    width: '100%',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: scale(16),
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: scale(6),
  },
  cardText: {
    fontSize: scale(13),
    color: '#455A64',
    lineHeight: scale(18),
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Better for multi-line bullets
    marginTop: scale(8),
  },
  bulletPoint: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#3949AB',
    marginRight: scale(10),
    marginTop: scale(6), // Aligns with first line of text
  },
  bulletText: {
    fontSize: scale(13),
    color: '#607D8B',
    flex: 1,
    lineHeight: scale(18),
  },
  infoBox: {
    backgroundColor: '#E8EAF6',
    padding: scale(15),
    borderRadius: scale(12),
    borderLeftWidth: 4,
    borderLeftColor: '#3F51B5',
    marginVertical: scale(10),
  },
  infoBoxText: {
    fontSize: scale(12),
    color: '#283593',
    fontStyle: 'italic',
  },
  primaryButton: {
    backgroundColor: '#1A237E',
    paddingVertical: scale(15),
    borderRadius: scale(12),
    alignItems: 'center',
    marginTop: scale(20),
    width: '100%',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: scale(15),
    fontWeight: 'bold',
  },
  versionInfo: {
    textAlign: 'center',
    marginTop: scale(25),
    fontSize: scale(10),
    color: '#90A4AE',
    letterSpacing: 1,
  },
});

export default PrivacyPolicy;











// import React from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   SafeAreaView,
//   TouchableOpacity,
//   Linking,
//   StatusBar,
// } from 'react-native';

// const PrivacyPolicy = ({ navigation }) => {
//   const universityName = "Mahatma Gandhi University";
  
//   // Custom Card Component for sections
//   const PolicyCard = ({ title, content, bullets = [] }) => (
//     <View style={styles.card}>
//       <Text style={styles.cardTitle}>{title}</Text>
//       {content ? <Text style={styles.cardText}>{content}</Text> : null}
//       {bullets.map((item, index) => (
//         <View key={index} style={styles.bulletRow}>
//           <View style={styles.bulletPoint} />
//           <Text style={styles.bulletText}>{item}</Text>
//         </View>
//       ))}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      
//       {/* Modern Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.backCircle}
//         >
//           <Text style={styles.backArrow}>←</Text>
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.headerTitle}>Privacy Policy</Text>
//           <Text style={styles.headerSubtitle}>{universityName} MIS</Text>
//         </View>
//       </View>

//       <ScrollView 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollPadding}
//       >
//         <Text style={styles.introText}>
//           We value your privacy. This document outlines how we handle your data across the Student and Admin domains.
//         </Text>

//         <PolicyCard 
//           title="1. Data Collection" 
//           content="To provide academic and administrative services, we collect the following:"
//           bullets={[
//             "Profile: Name, Enrollment Number, and Academic History.",
//             "Biometrics: Local device encryption for secure login.",
//             "Hardware: Camera for QR attendance and handwriting detection."
//           ]}
//         />

//         <PolicyCard 
//           title="2. Usage of Information" 
//           content="The data collected is used solely for university operations, including:"
//           bullets={[
//             "Examination integrity and automated grading.",
//             "Digital issuance of transcripts and fee receipts.",
//             "E-Grievance tracking and support resolution."
//           ]}
//         />

//         <PolicyCard 
//           title="3. Security Standards" 
//           content="Your data is protected using industry-standard encryption. We use Secure Keychain for credentials and SSL-pinned API calls to our Node.js servers."
//         />

//         <View style={styles.infoBox}>
//           <Text style={styles.infoBoxText}>
//             For account deletion or data portability requests, please contact the IT Helpdesk.
//           </Text>
//         </View>

//         <TouchableOpacity 
//           style={styles.primaryButton}
//           onPress={() => Linking.openURL('https://mguvv.ac.in/Website/about.aspx')}
//         >
//           <Text style={styles.primaryButtonText}>Read Full Policy Online</Text>
//         </TouchableOpacity>

//         <Text style={styles.versionInfo}>Version 1.0.2 • February 2026</Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FE', // Light gray-blue background
//   },
//   header: {
//     backgroundColor: '#1A237E', // Deep Navy Professional
//     paddingHorizontal: 20,
//     paddingVertical: 25,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 10,
//   },
//   backCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   backArrow: {
//     color: '#FFF',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: '#FFF',
//     letterSpacing: 0.5,
//   },
//   headerSubtitle: {
//     fontSize: 13,
//     color: '#C5CAE9',
//     fontWeight: '500',
//   },
//   scrollPadding: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   introText: {
//     fontSize: 15,
//     color: '#5C6BC0',
//     lineHeight: 22,
//     marginBottom: 20,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#1A237E',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#1A237E',
//     marginBottom: 8,
//   },
//   cardText: {
//     fontSize: 14,
//     color: '#455A64',
//     lineHeight: 20,
//   },
//   bulletRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   bulletPoint: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#3949AB',
//     marginRight: 10,
//   },
//   bulletText: {
//     fontSize: 13,
//     color: '#607D8B',
//     flex: 1,
//   },
//   infoBox: {
//     backgroundColor: '#E8EAF6',
//     padding: 15,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#3F51B5',
//     marginVertical: 10,
//   },
//   infoBoxText: {
//     fontSize: 13,
//     color: '#283593',
//     fontStyle: 'italic',
//   },
//   primaryButton: {
//     backgroundColor: '#1A237E',
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 20,
//     shadowColor: '#1A237E',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   primaryButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   versionInfo: {
//     textAlign: 'center',
//     marginTop: 25,
//     fontSize: 11,
//     color: '#90A4AE',
//     letterSpacing: 1,
//   },
// });

// export default PrivacyPolicy;
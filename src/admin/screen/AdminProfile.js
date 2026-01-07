import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// Your existing imports
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import SessionService from "../../common/Services/SessionService";
import colors from "../../common/config/colors";

const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define internal colors for the helper component
  const themeColors = {
    primary: "#32208d",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    indigoLight: "#EEF2FF",
    border: "#F3F4F6",
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const sessionData = await SessionService.getSession();
        const profile = sessionData?.LoginDetail?.[0];
        setProfileData(profile);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#32208d" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.loaderContainer}>
        <Text>No profile data available.</Text>
      </View>
    );
  }

  // Updated InfoRow with flex constraints to prevent text overflow
  const InfoRow = ({ icon, label, value, showArrow = false }) => (
    <View style={styles.infoRowContainer}>
      <View style={styles.infoRowLeft}>
        <View style={styles.iconCircle}>
          <FontAwesome6 name={icon} size={14} color={themeColors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value || "-"}</Text>
        </View>
      </View>
      {showArrow && (
        <View style={styles.arrowContainer}>
          <FontAwesome6 name="chevron-right" size={12} color="#D1D5DB" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#32208d" />
      <Header />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Profile Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>MR. {profileData.Emp_Name?.toUpperCase()}</Text>
            <Text style={styles.userRole}>{profileData.Organization_Unit_Name_no || "Admin"}</Text>

            {/* Quick Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionCircle}><FontAwesome6 name="envelope" size={16} color="#FFF" /></TouchableOpacity>
              <TouchableOpacity style={styles.actionCircle}><FontAwesome6 name="phone" size={16} color="#FFF" /></TouchableOpacity>
              <View style={styles.actionDivider} />
              <TouchableOpacity style={styles.actionCircle}><FontAwesome6 name="comment-dots" size={16} color="#FFF" /></TouchableOpacity>
              <TouchableOpacity style={styles.actionCircle}><FontAwesome6 name="star" size={16} color="#FFF" /></TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Details Content */}
        <View style={styles.detailsContent}>
          <Text style={styles.sectionTitle}>Basic Detail</Text>
          <InfoRow icon="id-card" label="MIS ID" value={profileData.Emp_Id} />
          <InfoRow icon="building" label="Office Name" value={profileData.Office_Name} />

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Contact Detail</Text>
          <InfoRow icon="envelope" label="Official Email" value={profileData.Email_Id} />
          <InfoRow icon="phone" label="Mobile Number" value={profileData.Contact_No_1} />
          <InfoRow icon="location-dot" label="Address" value={profileData.emp_address} />

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Posting Detail</Text>
          <InfoRow icon="sitemap" label="Head Office" value={profileData.Head_Office_Name} showArrow />
          <InfoRow icon="map-pin" label="Current Posting" value={profileData.Office_Name} showArrow />

          {/* Bottom Padding for Footer */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCard: {
    backgroundColor: colors.footercolor,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  userRole: {
    color: '#C7D2FE',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 25,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  actionDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 10,
  },
  detailsContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 18,
  },
  infoRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%', // Ensure it takes full width
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Crucial: allows this section to grow/shrink
  },
  textContainer: {
    flex: 1, // Crucial: forces text to stay within available space
    paddingRight: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flexWrap: 'wrap', // Allows wrapping
  },
  arrowContainer: {
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
    marginBottom: 20,
  },
});

export default AdminProfile;














// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   Image
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from "@react-navigation/native";

// import Header from "../layout/Header/Header";
// import Footer from "../layout/Footer/Footer";
// import SessionService from "../../common/Services/SessionService";
// import LinearGradient from 'react-native-linear-gradient';
// import colors from "../../common/config/colors";

// const AdminProfile = () => {
//   const navigation = useNavigation();
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSession = async () => {
//       try {
//         setLoading(true);
//         const sessionData = await SessionService.getSession();
//         const profile = sessionData?.LoginDetail?.[0];
//         setProfileData(profile);
//       } catch (error) {
//         console.error("Error loading profile:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSession();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#006d33ff" />
//         <Text style={{ marginTop: 10 }}>Loading profile...</Text>
//       </View>
//     );
//   }

//   if (!profileData) {
//     return (
//       <View style={styles.loaderContainer}>
//         <Text>No profile data available.</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header  />
//       {/* <Header title="Admin Profile" /> */}

//       <LinearGradient
//         colors={['#fffbe1ff', '#fee8deff']}
//         style={styles.cardd}
//       >

//         <View style={styles.cardhead}>
//           <View style={styles.header}>
//             {/* <View style={styles.profileCircle} /> */}
//             <Image source={{
//               uri:"https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
//             }} style={styles.profileCircle} />

//             <Text style={styles.profileText}>Profile</Text>
//             <Text style={styles.name}>MR. {profileData.Emp_Name?.toUpperCase()}</Text>
//           </View>
//         </View>

//         <ScrollView contentContainerStyle={styles.contentContainer}>

//           {/* Basic Detail */}
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Basic Detail</Text>
//             <Text style={styles.item}><Text style={styles.label}>MIS ID :</Text> {profileData.Emp_Id || "-"}</Text>
//             <Text style={styles.item}><Text style={styles.label}>Office Name :</Text> {profileData.Office_Name || "-"}</Text>
//             <Text style={styles.item}><Text style={styles.label}>Designation :</Text> {profileData.Organization_Unit_Name_no || "-"}</Text>
//           </View>

//           {/* Contact Detail */}
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Contact Detail</Text>
//             <Text style={styles.item}><Text style={styles.label}>Address :</Text> {profileData.emp_address || "-"}</Text>
//             <Text style={styles.item}><Text style={styles.label}>Mobile :</Text> {profileData.Contact_No_1 || "-"}</Text>
//             <Text style={styles.item}><Text style={styles.label}>Email Id :</Text> {profileData.Email_Id || "-"}</Text>
//           </View>

//           {/* Posting Detail */}
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Posting Detail</Text>
//             <View style={styles.tableHeader}>
//               <Text style={styles.tableCellHeader}>OFFICE</Text>
//               <Text style={styles.tableCellHeader}>POSTING</Text>
//             </View>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>{profileData.Head_Office_Name || "-"}</Text>
//               <Text style={styles.tableCell}>{profileData.Office_Name || "-"}</Text>
//             </View>
//           </View>
//         </ScrollView>
//       </LinearGradient>
//       <Footer/>
//     </SafeAreaView>
//   );
// };

// export default AdminProfile;



// // Styling
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ECEDF2",
//   },
//   header: {
//     marginTop: 25,
//     backgroundColor: '#AEDEFC',
//     alignItems: "center",
//     borderRadius: 10,
//     // borderBottomLeftRadius: 50,
//     // borderBottomRightRadius: 50,
//     shadowColor: "#ffffffff",
//     shadowOpacity: 15,
//     elevation: 30
//   },
//   profileCircle: {
//     width: 100,
//     height: 100,
//     backgroundColor: "#FFF8DE",
//     borderRadius: 50,
//     shadowOpacity: 1.5,
//     shadowRadius: 10,
//     marginTop: -25,
//     shadowColor: "#ffffffff",
//     shadowOpacity: 15,
//     elevation: 30
//   },
//   profileText: {
//     color: "#ffffffff",
//     marginTop: 10,
//     fontSize: 16,
//   },
//   contentContainer: {
//     padding: 20,
//   },
//   name: {
//     textAlign: "center",
//     fontWeight: "bold",
//     fontSize: 16,
//     color: "#050d69ff",
//     marginBottom: 10,
//   },

//   cardhead: {
//     backgroundColor: "#FFFFFF",
//     marginHorizontal: 5,
//     marginVertical: 2,
//     padding: 5,
//     // borderRadius: 12,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     shadowColor: "#000",
//     shadowOpacity: 1.5,
//     shadowRadius: 10,

//   },


//   card: {
//     backgroundColor: "#FFFFFF",
//     // marginHorizontal: 5,
//     marginVertical: 5,
//     padding: 5,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOpacity: 1.5,
//     shadowRadius: 10,
//     // borderWidth:1,
//     // borderColor:'#3cc8ffff',
//     elevation: 1,
//     // borderLeftWidth: 4,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ff922b",

//   },



//   cardTitle: {
//     backgroundColor: "#1eb5f1ff",
//     color: "#fff",
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   item: {
//     fontSize: 16,
//     marginVertical: 2,
//   },
//   label: {
//     fontWeight: "bold",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//   },
//   tableCellHeader: {
//     flex: 1,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#555",
//   },
//   tableRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//   },
//   tableCell: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 15,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });










// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// const Card = ({ title, subtitle, time, color, status, statusColor }) => (
//   <View style={[styles.card, { borderTopColor: color }]}>
//     <View style={styles.cardContent}>
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.subtitle}>{subtitle}</Text>
//       <Text style={[styles.time, { color }]}>{time}</Text>
//       <View style={[styles.statusTag, { backgroundColor: statusColor }]}>
//         <Text style={styles.statusText}>{status}</Text>
//       </View>
//     </View>
//   </View>
// );

// const AdminProfile = () => {
//   return (
//     <LinearGradient colors={['#9b59b6', '#e74c3c']} style={styles.header}>
//       <Text style={styles.headerText}>eHRMS</Text>
//       <ScrollView style={styles.container}>
//         <Card
//           title="Check In"
//           subtitle="Today's arrival time"
//           time="09:30 AM"
//           color="#27ae60"
//           status="On Time"
//           statusColor="#d4efdf"
//         />
//         <Card
//           title="Check Out"
//           subtitle="Expected departure"
//           time="06:30 PM"
//           color="#e74c3c"
//           status="Pending"
//           statusColor="#f9e79f"
//         />
//         <Card
//           title="Duration"
//           subtitle="Time worked today"
//           time="2h 45m"
//           color="#3498db"
//           status="Active"
//           statusColor="#d6eaf8"
//         />
//         <Card
//           title="Status"
//           subtitle="Current work status"
//           time="Active"
//           color="#f1c40f"
//           status="Available"
//           statusColor="#fcf3cf"
//         />
//       </ScrollView>
//     </LinearGradient>
//   );
// };


// const styles = StyleSheet.create({
//   header: {
//     paddingTop: 50,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   container: {
//     backgroundColor: '#f4f6f7',
//     paddingHorizontal: 10,
//     paddingTop: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 5,
//     borderTopWidth: 4,
//   },
//   cardContent: {
//     alignItems: 'flex-start',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 12,
//     color: '#7f8c8d',
//     marginBottom: 10,
//   },
//   time: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   statusTag: {
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 20,
//   },
//   statusText: {
//     fontSize: 12,
//     color: '#34495e',
//   },
// });

// export default AdminProfile;













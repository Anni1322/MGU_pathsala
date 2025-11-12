import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import Header from "../layout/Header/Header";
import SessionService from "../../common/Services/SessionService";
import LinearGradient from 'react-native-linear-gradient';

const AdminProfile = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <ActivityIndicator size="large" color="#006d33ff" />
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Admin Profile" />

      {/* <LinearGradient
        colors={['#c9ceffff', '#d6f5ffff']}
        style={styles.card}
      > */}

      <View style={styles.cardhead}>
        <View style={styles.header}>
          <View style={styles.profileCircle} />
          <Text style={styles.profileText}>Profile</Text>
        </View>
      </View>
      {/* </LinearGradient> */}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.name}>MR. {profileData.Emp_Name?.toUpperCase()}</Text>

        {/* Basic Detail */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Detail</Text>
          <Text style={styles.item}><Text style={styles.label}>MIS ID :</Text> {profileData.Emp_Id || "-"}</Text>
          <Text style={styles.item}><Text style={styles.label}>Office Name :</Text> {profileData.Office_Name || "-"}</Text>
          <Text style={styles.item}><Text style={styles.label}>Designation :</Text> {profileData.Organization_Unit_Name_no || "-"}</Text>
        </View>

        {/* Contact Detail */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Detail</Text>
          <Text style={styles.item}><Text style={styles.label}>Address :</Text> {profileData.emp_address || "-"}</Text>
          <Text style={styles.item}><Text style={styles.label}>Mobile :</Text> {profileData.Contact_No_1 || "-"}</Text>
          <Text style={styles.item}><Text style={styles.label}>Email Id :</Text> {profileData.Email_Id || "-"}</Text>
        </View>

        {/* Posting Detail */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Posting Detail</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>OFFICE</Text>
            <Text style={styles.tableCellHeader}>POSTING</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{profileData.Head_Office_Name || "-"}</Text>
            <Text style={styles.tableCell}>{profileData.Office_Name || "-"}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminProfile;

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECEDF2",
  },
  header: {
    // backgroundColor: "#4B55C1",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 1.5
  },
  profileCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#e6eeffff",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 1.5,
    shadowRadius: 10,
  },
  profileText: {
    color: "#590034ff",
    marginTop: 10,
    fontSize: 16,
  },
  contentContainer: {
    padding: 20,
  },
  name: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#2F3241",
    marginBottom: 10,
  },

  cardhead: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 5,
    marginVertical: 2,
    padding: 5,
    // borderRadius: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 1.5,
    shadowRadius: 10,
  },


  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 1.5,
    shadowRadius: 10,
    // borderWidth:1,
    // borderColor:'#008136ff',
    // elevation: 1,
    // borderLeftWidth: 4,
    // borderBottomWidth:1,
    // borderBottomColor: "#ff922b",

  },



  cardTitle: {
    backgroundColor: "#007362ff",
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    marginVertical: 2,
  },
  label: {
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableCellHeader: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    color: "#555",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});










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













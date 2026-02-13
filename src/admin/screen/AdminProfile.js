import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,ActivityIndicator,ScrollView,Image,TouchableOpacity,StatusBar,Linking,Alert,Platform,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import SessionService from "../../common/Services/SessionService";
import colors from "../../common/config/colors";

const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // --- Action Handlers ---

  const handleCall = (number) => {
    if (!number) return Alert.alert("Error", "Phone number not available");
    // Standard tel: link
    Linking.openURL(`tel:${number}`);
  };

  const handleSMS = (number) => {
    if (!number) return Alert.alert("Error", "Phone number not available");
    // Standard sms: link
    Linking.openURL(`sms:${number}`);
  };

  const handleWhatsApp = async (number) => {
    if (!number) return Alert.alert("Error", "Phone number not available");
    const cleanNumber = number.replace(/\D/g, "");
    const url = `https://wa.me/${cleanNumber}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "WhatsApp is not installed on this device");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const handleEmail = (email) => {
    if (!email) return Alert.alert("Error", "Email not available");
    Linking.openURL(`mailto:${email}`);
  };

  // --- Helper Components ---
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
              {/* Message/SMS */}
              <TouchableOpacity 
                style={styles.actionCircle} 
                onPress={() => handleSMS(profileData.Contact_No_1)}
              >
                <FontAwesome6 name="comment-dots" size={16} color="#FFF" />
              </TouchableOpacity>

              {/* Phone Call */}
              <TouchableOpacity 
                style={styles.actionCircle} 
                onPress={() => handleCall(profileData.Contact_No_1)}
              >
                <FontAwesome6 name="phone" size={16} color="#FFF" />
              </TouchableOpacity>

              <View style={styles.actionDivider} />

              {/* WhatsApp */}
              <TouchableOpacity 
                style={styles.actionCircle} 
                onPress={() => handleWhatsApp(profileData.Contact_No_1)}
              >
                <FontAwesome6 name="whatsapp" size={18} color="#FFF" />
              </TouchableOpacity>

              {/* Email */}
              <TouchableOpacity 
                style={styles.actionCircle} 
                onPress={() => handleEmail(profileData.Email_Id)}
              >
                <FontAwesome6 name="envelope" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
    marginTop: Platform.OS === 'ios' ? 0 : -39,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCard: {
    backgroundColor: colors.bgcolor || "#32208d",
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
    marginBottom: 10,
  },
  infoRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    flex: 1,
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
    flexWrap: 'wrap',
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





 








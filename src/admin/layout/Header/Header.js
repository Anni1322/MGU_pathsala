import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Dimensions, Animated, Image, Modal, } from 'react-native';  // Added Modal and Image imports
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../common/config/colors';
import AuthService from "../../../common/Services/AuthService";
import alertService from "../../../common/Services/alert/AlertService";
import AdminSidemenu from "../Sidebar/SidebarMenu";
import SessionService from "../../../common/Services/SessionService";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

export default function Header({ title, backgroundColor }) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [profileData, setProfileData] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? -SIDEBAR_WIDTH : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setIsMounted(true);
    const fetchSession = async () => {
      const sessionData = await SessionService.getSession();
      const data = sessionData?.LoginDetail[0];
      if (!data || !isMounted) return;
      setProfileData(data);
      console.log(data)
    };

    fetchSession();
    return () => {
      setIsMounted(false);
    };
  }, []);

  const logout = () => {
    setModalVisible(false)
    alertService.show({
      title: "Logout",
      message: "Are you sure you want to logout?",
      type: "warn",
      buttonText: "Yes",
      cancelText: "No",
      onPress: async () => {
        await AuthService.logout();
        navigation.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        });
      },
      onCancel: () => console.log("Logout cancelled"),
    });
  };

  // Function to toggle modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const dynamicBgColor = backgroundColor || colors.lite2;
  return (
    <>
      <StatusBar backgroundColor={dynamicBgColor} barStyle="light-content" />
      <AdminSidemenu sidebarX={slideAnim} />
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar} />
      )}
      <View style={[styles.header, { backgroundColor: dynamicBgColor }]}>
        {canGoBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()}
            style={{
              padding: 10,
              backgroundColor: 'transparent',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FontAwesome6 name="chevron-left" size={26} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={toggleSidebar}>
            <EvilIcons name="navicon" size={30} color={colors.white} />
          </TouchableOpacity>
        )}

        <Text style={[styles.headerTitle, canGoBack ? styles.childTitle : styles.parentTitle,]}>
          {title || 'MOR 🧑🏻‍🎓 GURUKUL'}
        </Text>

        <View style={styles.headerRight}>
          {/* Changed: Now toggles modal instead of navigating */}
          <TouchableOpacity onPress={toggleModal}>
            <FontAwesome6 name="user" size={24} color={colors.white} />
          </TouchableOpacity>

          {/* <View
            style={[styles.notificationDot, { backgroundColor: colors.white }]}
          /> */}
        </View>
      </View>

      {/* New: Modal for Admin Profile */}
      <Modal
        visible={isModalVisible}
        animationType="slide"  // Slides up from bottom
        transparent={true}
        onRequestClose={toggleModal}  // For Android back button
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleModal}  // Close modal when tapping outside
        >
          <View style={styles.modalContent}>
            {/* Close button */}
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <FontAwesome6 name="xmark" size={24} color={colors.danger} />
            </TouchableOpacity>

            {/* Profile content */}
            <View style={styles.profileContainer}>
              {/* <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={styles.profileImage}
              /> */}
              <Text style={styles.profileName}>{profileData?.Emp_Name || 'faculty Name'}</Text>
              <Text style={styles.profileEmail}>{profileData?.emp_address || 'No mail address found'}</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('AdminProfile')}>
                <Text style={styles.optionText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => logout()}>
                <Text style={styles.optionText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Existing styles...
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  parentTitle: {
    color: colors.white,
    fontSize: 20,
    backgroundColor: '#f0a3a31e',
    borderRadius: 7,
    padding: 10
  },
  childTitle: {
    color: colors.white,
    fontSize: 18,
  },
  headerRight: {
    marginLeft: 10,
    flexDirection: 'row',
    position: 'relative',
    gap: 10,
  },
  notificationDot: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 5,
  },

  // New styles for modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',  // Positions modal at bottom
    backgroundColor: 'rgba(0,0,0,0.5)',  // Semi-transparent background
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.gray,
  },
  optionsContainer: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionButton: {
    padding: 15,
    backgroundColor: colors.lite2,  // Or any light color
    borderRadius: 15,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: colors.white,
  },
});

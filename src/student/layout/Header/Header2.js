import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Dimensions, Animated, Modal, Image } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../../../common/config/BaseUrl';
import colors from '../../../common/config/colors';
import AuthService from "../../../common/Services/AuthService";
import alertService from "../../../common/Services/alert/AlertService";
import MenuScreen from "../Sidebar/MenuScreen";
import SessionService from "../../../common/Services/SessionService";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

export default function Header({ title, backgroundColor }) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [profileData, setProfileData] = useState(null);
  const [profilephoto, setprofilephoto] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? -SIDEBAR_WIDTH : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setSidebarOpen(!isSidebarOpen);
  };
  // Function to toggle modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  useEffect(() => {
    setIsMounted(true);
    const fetchSession = async () => {
      console.log("ok")
      const sessionData = await SessionService.getSession();
      console.log(sessionData, "data")
      const data = sessionData?.student;

      const rawPath = data.Student_Photo;
      const cleanedPath = rawPath?.replace("../", "/");
      const profileUrl = cleanedPath ? API_BASE_URL + cleanedPath : null;
      console.log(profileUrl,"profileUrl")

      if (!data || !isMounted) return;
      setProfileData(data);
      setprofilephoto(profileUrl)
      // console.log(data)
    };

    fetchSession();
    return () => {
      setIsMounted(false);
    };
  }, []);


  // const dynamicBgColor = backgroundColor || colors.primary;
  const dynamicBgColor = backgroundColor || colors.whiteD;

  return (
    <>
      <StatusBar backgroundColor={dynamicBgColor} color={dynamicBgColor} barStyle="dark-content" />
      <MenuScreen sidebarX={slideAnim} />
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
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
            }}
          >
            <FontAwesome6 name="chevron-left" size={26} color={colors.footercolor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={toggleSidebar}>
            <EvilIcons name="navicon" size={40} color={colors.footercolor} />
          </TouchableOpacity>
        )}
        {/* <Text
          style={[
            styles.headerTitle,
            canGoBack ? styles.childTitle : styles.parentTitle,
          ]}
        >
          {title || 'MOR GURUKUL'}
        </Text> */}

        <Text style={[styles.headerTitle, canGoBack ? styles.childTitle : styles.parentTitle,]}>
          {title || 'MOR 🧑🏻‍🎓 GURUKUL'}

          {/* <Image
            source={require('../../../../assets/morgurukul.png')}
            style={styles.image}
            resizeMode='cover'
          /> */}

        </Text>

        <View style={styles.headerRight}>

          <TouchableOpacity onPress={toggleModal}>
            <FontAwesome6 name="user" size={28} color={colors.footercolor} />
          </TouchableOpacity>


          {/* <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <FontAwesome6 name="bell" size={30} color={colors.footercolor} />
          </TouchableOpacity>
          <View
            style={[styles.notificationDot, { backgroundColor: colors.footercolor }]}
          /> */}
        </View>
      </View>


      {/* New: Modal for  Profile */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleModal}
        >
          <View style={styles.modalContent}>
            {/* Close button */}
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <FontAwesome6 name="xmark" size={24} color={colors.danger} />
            </TouchableOpacity>

            {/* Profile content */}
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: profilephoto || "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }}
                style={styles.avatar}
              />
              <Text style={styles.profileName}>{profileData?.Name || 'Student Name'}</Text>
              <Text style={styles.profileEmail}>{profileData?.Student_ID || 'No Student ID found'}</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Profile')}>
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
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    elevation: 55,
    shadowColor: '#000000ff'
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },

  parentTitle: {
    color: colors.footercolor,
    fontSize: 20,
  },
  childTitle: {
    color: colors.footercolor,
    fontSize: 18,
  },
  headerRight: {
    flexDirection: 'row',
    position: 'relative',
    gap: 10,
    marginRight: 10
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    avatar: {
    width: 100, height: 100, borderRadius: 55, marginRight: 10
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

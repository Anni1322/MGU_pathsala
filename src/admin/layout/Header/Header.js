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
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  
  const [profileData, setProfileData] = useState(null);
  const [profilephoto, setprofilephoto] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Animation for Sidebar
  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? -SIDEBAR_WIDTH : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


    const handleLogout = () => {
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


  // useEffect(() => {
  //   setIsMounted(true);
  //   const fetchSession = async () => {
  //     try {
  //       const sessionData = await SessionService.getSession();
  //       const data = sessionData?.student;

  //       if (data) {
  //         const rawPath = data.Student_Photo;
  //         const cleanedPath = rawPath?.replace("../", "/");
  //         const profileUrl = cleanedPath ? API_BASE_URL + cleanedPath : null;

  //         if (isMounted) {
  //           setProfileData(data);
  //           setprofilephoto(profileUrl);
  //         }
  //       }
  //     } catch (e) {
  //       console.error("Header Session Error", e);
  //     }
  //   };

  //   fetchSession();
  //   return () => {
  //     setIsMounted(false);
  //   };
  // }, []);


    useEffect(() => {
    setIsMounted(true);
    const fetchSession = async () => {
      const sessionData = await SessionService.getSession();
      console.log(sessionData,"sessionData")
      const data = sessionData?.LoginDetail[0];
      console.log(data,"data")
      if (!data || !isMounted) return;
      setProfileData(data);
      console.log(data)
    };

    fetchSession();
    return () => {
      setIsMounted(false);
    };
  }, []);


  return (
    <>
      {/* Status bar matches the header color for a seamless look */}
      <StatusBar translucent={true} backgroundColor={colors.bgcolor} barStyle="light-content" />
      
      {/* Sidebar Component */}
      <AdminSidemenu sidebarX={slideAnim} />
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}

      {/* --- VIBRANT HEADER --- */}
      <View style={[styles.headerContainer, { backgroundColor: colors.bgcolor }]}>
        
        {/* Decorative Glow (Adds Texture) */}
        <View style={styles.glowCircle} />

        <View style={styles.headerContent}>
          
          {/* Left Icon (Glass Effect) */}
          <TouchableOpacity 
            onPress={canGoBack ? () => navigation.goBack() : toggleSidebar}
            style={styles.glassButton}
          >
            {canGoBack ? (
              <FontAwesome6 name="chevron-left" size={18} color="#fff" />
            ) : (
              <FontAwesome6 name="bars-staggered" size={18} color="#fff" />
            )}
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title || 'MOR GURUKUL'}
            </Text>
            {!title && (
               <Text style={styles.headerSubtitle}>Admin PORTAL</Text>
            )}
          </View>

          {/* Right Icon (Profile Avatar with Ring) */}
          <TouchableOpacity onPress={toggleModal} style={styles.profileBtnWrapper}>
             {profilephoto ? (
                <Image source={{ uri: profilephoto }} style={styles.headerAvatar} />
             ) : (
                <View style={styles.placeholderAvatar}>
                   <FontAwesome6 name="user" size={16} color={colors.bgcolor} />
                </View>
             )}
          </TouchableOpacity>
        </View>
      </View>

      {/* --- BOTTOM SHEET MODAL --- */}
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
            {/* Drag Handle */}
            <View style={styles.dragHandle} />
            
            {/* Close Button */}
            <TouchableOpacity onPress={toggleModal} style={styles.closeIconBtn}>
               <FontAwesome6 name="xmark" size={20} color="#999" />
            </TouchableOpacity>

            {/* Profile Info */}
            <View style={styles.profileSection}>
              <View style={styles.avatarShadow}>
                <Image
                  source={{ uri: profilephoto || "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }}
                  style={styles.modalAvatar}
                />
              </View>
              
              <Text style={styles.modalName}>
                {profileData?.Emp_Name || 'Faculty Name'}
              </Text>
              
              <View style={styles.idBadge}>
                 <Text style={styles.idText}>
               <Text style={styles.profileEmail}>{profileData?.emp_address || 'No mail address found'}</Text>
                 </Text>
              </View>
            </View>

            {/* Menu Options */}
            <View style={styles.menuContainer}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { toggleModal(); navigation.navigate('AdminProfile'); }}
              >
                <View style={[styles.menuIconBox, { backgroundColor: '#F0F8FF' }]}>
                  <FontAwesome6 name="user" size={18} color={colors.bgcolor} />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.menuTitle}>My Profile</Text>
                    <Text style={styles.menuSub}>View and edit details</Text>
                </View>
                <FontAwesome6 name="chevron-right" size={14} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={handleLogout}
              >
                <View style={[styles.menuIconBox, { backgroundColor: '#FFF0F0' }]}>
                  <FontAwesome6 name="power-off" size={18} color={colors.danger} />
                </View>
                <View style={{flex: 1}}>
                    <Text style={[styles.menuTitle, { color: colors.danger }]}>Logout</Text>
                    <Text style={styles.menuSub}>Sign out of account</Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // --- Vibrant Header Styles ---
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 50: 0, 
    // paddingBottom: 10,
    overflow: 'hidden', 
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    zIndex: 10,
  },
 
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  
  // "Glass" Buttons (Semi-transparent white)
  glassButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.15)', // Glass effect
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff', // White text pops on brand color
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 2,
  },
  
  profileBtnWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)', // Ring around avatar
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  placeholderAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- Overlay ---
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 5,
  },

  // --- Modal (Bottom Sheet) ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    minHeight: 350,
    // Deep shadow for pop
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 20,
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  closeIconBtn: {
      position: 'absolute',
      top: 25,
      right: 25,
      zIndex: 10,
      padding: 5
  },
  
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarShadow: {
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  idBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  idText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  
  // Menu
  menuContainer: {
    gap: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Subtle lift
    elevation: 2, 
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  menuSub: {
      fontSize: 12,
      color: '#999'
  }
});















// old ui

// import React, { useState, useRef, useEffect } from 'react';
// import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Dimensions, Animated, Image, Modal, } from 'react-native';  // Added Modal and Image imports
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import { useNavigation } from '@react-navigation/native';
// import colors from '../../../common/config/colors';
// import AuthService from "../../../common/Services/AuthService";
// import alertService from "../../../common/Services/alert/AlertService";
// import AdminSidemenu from "../Sidebar/SidebarMenu";
// import SessionService from "../../../common/Services/SessionService";

// const SCREEN_WIDTH = Dimensions.get("window").width;
// const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

// export default function Header({ title, backgroundColor }) {
//   const navigation = useNavigation();
//   const canGoBack = navigation.canGoBack();
//   const [isMounted, setIsMounted] = useState(false);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
//   const [profileData, setProfileData] = useState(null);
//   const [isModalVisible, setModalVisible] = useState(false);
//   const toggleSidebar = () => {
//     Animated.timing(slideAnim, {
//       toValue: isSidebarOpen ? -SIDEBAR_WIDTH : 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//     setSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     setIsMounted(true);
//     const fetchSession = async () => {
//       const sessionData = await SessionService.getSession();
//       const data = sessionData?.LoginDetail[0];
//       if (!data || !isMounted) return;
//       setProfileData(data);
//       console.log(data)
//     };

//     fetchSession();
//     return () => {
//       setIsMounted(false);
//     };
//   }, []);

//   const logout = () => {
//     setModalVisible(false)
//     alertService.show({
//       title: "Logout",
//       message: "Are you sure you want to logout?",
//       type: "warn",
//       buttonText: "Yes",
//       cancelText: "No",
//       onPress: async () => {
//         await AuthService.logout();
//         navigation.reset({
//           index: 0,
//           routes: [{ name: "Auth" }],
//         });
//       },
//       onCancel: () => console.log("Logout cancelled"),
//     });
//   };

//   // Function to toggle modal
//   const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//   };

//   const dynamicBgColor = backgroundColor || colors.tablerow;
//   return (
//     <>
//       <StatusBar backgroundColor={dynamicBgColor} barStyle="dark-content" />
//       <AdminSidemenu sidebarX={slideAnim} />
//       {isSidebarOpen && (
//         <TouchableOpacity
//           style={styles.overlay}
//           activeOpacity={1}
//           onPress={toggleSidebar} />
//       )}
//       <View style={[styles.header, { backgroundColor: dynamicBgColor }]}>
//         {canGoBack ? (
//           <TouchableOpacity onPress={() => navigation.goBack()}
//             style={{
//               padding: 10,
//               backgroundColor: 'transparent',
//               borderRadius: 8,
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//             <FontAwesome6 name="chevron-left" size={26} color={colors.bgcolor} />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity onPress={toggleSidebar}>
//             <EvilIcons name="navicon" size={30} color={colors.bgcolor} />
//           </TouchableOpacity>
//         )}


//         <Text style={[styles.headerTitle, canGoBack ? styles.childTitle : styles.parentTitle,]}>
//           {title || 'MOR 🧑🏻‍🎓 GURUKUL'}

//           {/* <Image
//             source={require('../../../../assets/morgurukul.png')}
//             style={styles.image}
//             resizeMode='cover'
//           /> */}

//         </Text>

//         <View style={styles.headerRight}>
//           {/* Changed: Now toggles modal instead of navigating */}
//           <TouchableOpacity onPress={toggleModal}>
//             <FontAwesome6 name="user" size={24} color={colors.bgcolor} />
//           </TouchableOpacity>

//           {/* <View
//             style={[styles.notificationDot, { backgroundColor: colors.white }]}
//           /> */}
//         </View>
//       </View>

//       {/* New: Modal for Admin Profile */}
//       <Modal
//         visible={isModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={toggleModal}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={toggleModal}
//         >
//           <View style={styles.modalContent}>
//             {/* Close button */}
//             <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
//               <FontAwesome6 name="xmark" size={24} color={colors.danger} />
//             </TouchableOpacity>

//             {/* Profile content */}
//             <View style={styles.profileContainer}>
//               {/* <Image
//                 source={{ uri: 'https://via.placeholder.com/100' }}
//                 style={styles.profileImage}
//               /> */}
//               <Text style={styles.profileName}>{profileData?.Emp_Name || 'Faculty Name'}</Text>
//               <Text style={styles.profileEmail}>{profileData?.emp_address || 'No mail address found'}</Text>
//             </View>

//             {/* Options */}
//             <View style={styles.optionsContainer}>
//               <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('AdminProfile')}>
//                 <Text style={styles.optionText}>Profile</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.optionButton} onPress={() => logout()}>
//                 <Text style={styles.optionText}>Logout</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   // Existing styles...
//   image: {
//     width: 110,
//     height: 60,
//     // borderRadius: 40,
//     // marginBottom: 10,
//   },
//   header: {
//     height: 80,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 1,
//     alignItems: 'center',
//     paddingTop: 20,
//     paddingLeft: 10,
//     elevation:65,
    
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   parentTitle: {
//     color: colors.bgcolor,
//     fontSize: 20,
//     // backgroundColor: '#f0a3a307',
//     borderRadius: 7,
//     padding: 10,
//   },
//   childTitle: {
//     color: colors.bgcolor,
//     fontSize: 18,
//   },
//   headerRight: {
//     padding:10,
//     marginRight: 10
//     // marginLeft: 0,
//     // flexDirection: 'row',
//     // position: 'relative',
//     // gap: 10,
//   },
//   notificationDot: {
//     position: 'absolute',
//     right: -2,
//     top: -2,
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: SCREEN_WIDTH,
//     height: '100%',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     zIndex: 5,
//   },

//   // New styles for modal
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',  // Positions modal at bottom
//     backgroundColor: 'rgba(0,0,0,0.5)',  // Semi-transparent background
//   },
//   modalContent: {
//     backgroundColor: colors.white,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     minHeight: 300,
//   },
//   closeButton: {
//     alignSelf: 'flex-end',
//     marginBottom: 10,
//   },
//   profileContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 10,
//   },
//   profileName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: colors.black,
//   },
//   profileEmail: {
//     fontSize: 16,
//     color: colors.gray,
//   },
//   optionsContainer: {
//     gap: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   optionButton: {
//     padding: 15,
//     backgroundColor: colors.lite2,  // Or any light color
//     borderRadius: 15,
//     alignItems: 'center',
//   },
//   optionText: {
//     fontSize: 16,
//     color: colors.white,
//   },
// });

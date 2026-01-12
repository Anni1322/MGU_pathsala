import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View, Text, FlatList, Dimensions, StyleSheet, Image, 
  Animated, Platform, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView 
} from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import getAdminApiList from '../../config/Api/adminApiList';
import { HttpService } from "../../../common/Services/HttpService";

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const BirthdaySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderData, setSliderData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [wishMessage, setWishMessage] = useState("");
  
  const flatListRef = useRef(null);

  const getProfileDetails = useCallback(async () => {
    try {
      const profileApi = getAdminApiList().getTodayBirhtList;
      const response = await HttpService.get(profileApi);
      setSliderData(response?.data?.UserBirthDayList || []);
    } catch (error) {
      setSliderData([
        { id: 1, name: "Rahul Sharma", designation: "Faculty of Horticulture" },
        { id: 2, name: "Sneha Gupta", designation: "Administrative Officer" }
      ]);
    }
  }, []);

  useEffect(() => { getProfileDetails(); }, []);

  const openWishModal = (user) => {
    setSelectedUser(user);
    setWishMessage(`Happy Birthday ${user.name}! Hope you have a fantastic day!`);
    setModalVisible(true);
  };

  const handleSendWish = () => {
    // Add your API logic here to save the wish
    console.log(`Sending to ${selectedUser.name}: ${wishMessage}`);
    setModalVisible(false);
    setWishMessage("");
  };

  const renderItem = ({ item }) => {
    const imageUri = item?.PhotoString || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => openWishModal(item)} 
        style={styles.cardContainer}
      >
        <View style={styles.cardFrame}>
          <View style={StyleSheet.absoluteFill}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <Defs>
                <SvgGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#1e3c72" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#2a5298" stopOpacity="1" />
                </SvgGradient>
              </Defs>
              <Path d="M0 0 H100 V100 C70 85 30 115 0 100 Z" fill="url(#grad)" />
            </Svg>
          </View>

          <View style={styles.innerContent}>
            <View style={styles.avatarSection}>
              <Image source={{ uri: imageUri }} style={styles.avatar} />
              <View style={styles.floatingBadge}><Text>🎉</Text></View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.tagText}>TODAY'S BIRTHDAY</Text>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userDesignation}>{item.designation}</Text>
              <Text style={styles.clickAction}>Tap to send a wish ✨</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <FlatList
        ref={flatListRef}
        data={sliderData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      />

      {/* --- WISH MODAL --- */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Birthday Wish</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.recipientInfo}>
               <Text style={styles.toLabel}>To: <Text style={styles.toName}>{selectedUser?.name}</Text></Text>
            </View>

            <TextInput
              style={styles.wishInput}
              multiline
              numberOfLines={4}
              value={wishMessage}
              onChangeText={setWishMessage}
              placeholder="Write your message here..."
            />

            <TouchableOpacity style={styles.sendBtn} onPress={handleSendWish}>
              <Text style={styles.sendBtnText}>Send Message 🚀</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { marginVertical: 15, alignItems: 'center' },
  cardContainer: { width: width, alignItems: 'center', justifyContent: 'center' },
  cardFrame: { 
    width: CARD_WIDTH, height: 160, borderRadius: 24, overflow: 'hidden', 
    backgroundColor: '#FFF', elevation: 10, shadowOpacity: 0.15 
  },
  innerContent: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  avatarSection: { position: 'relative', marginRight: 15 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  floatingBadge: { 
    position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', 
    width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 5 
  },
  infoSection: { flex: 1 },
  tagText: { fontSize: 9, fontWeight: '900', color: '#FFF', opacity: 0.7, marginBottom: 4 },
  userName: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  userDesignation: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  clickAction: { fontSize: 10, color: '#FFD700', fontWeight: '700', marginTop: 10 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContainer: { 
    backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, 
    padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1 
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1e3c72' },
  closeBtn: { fontSize: 22, color: '#999', padding: 5 },
  recipientInfo: { marginBottom: 15 },
  toLabel: { fontSize: 14, color: '#666' },
  toName: { fontWeight: '700', color: '#333' },
  wishInput: { 
    backgroundColor: '#F3F4F6', borderRadius: 15, padding: 15, 
    fontSize: 15, color: '#333', textAlignVertical: 'top', height: 100, marginBottom: 20 
  },
  sendBtn: { 
    backgroundColor: '#1e3c72', height: 55, borderRadius: 15, 
    justifyContent: 'center', alignItems: 'center', elevation: 4 
  },
  sendBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});

export default BirthdaySlider;







// //  BirthdaySlider.js
// import React, { useCallback, useRef, useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Dimensions,
//   StyleSheet,
//   ImageBackground,
//   Image,
//   Alert
// } from 'react-native';


// // import AuthService from "../../../common/Services/AuthService";
// // import alertService from "../../../common/Services/alert/AlertService";
// import SessionService from "../../../common/Services/SessionService";


// import getAdminApiList from '../../config/Api/adminApiList';
// import { HttpService } from "../../../common/Services/HttpService";
// import LinearGradient from 'react-native-linear-gradient';

// const { width } = Dimensions.get('window');

// const CARD_WIDTH = width - 150;

// const BirthdaySlider = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [sliderData, setSliderData] = useState([]);
//   const flatListRef = useRef(null);
//   const intervalRef = useRef(null);

//   const onViewRef = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       setCurrentIndex(viewableItems[0].index);
//     }
//   });

//   const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

//   const getProfileDetails = useCallback(async () => {
//     try {
//       const profileApi = getAdminApiList().getTodayBirhtList;
//       if (!profileApi) throw new Error("Profile API endpoint not found.");
//       const response = await HttpService.get(profileApi);
//       const birthdayList = response?.data?.UserBirthDayList || [];
//       setSliderData(birthdayList);
//     } catch (error) {
//       Alert.alert("Failed to Load Birthdays", error?.message || "Something went wrong");
//       console.error("Birthday fetch error:", error);
//     }
//   }, []);

//   useEffect(() => {
//     getProfileDetails();
//   }, []);

//   useEffect(() => {
//     if (!sliderData || sliderData.length === 0) return;

//     intervalRef.current = setInterval(() => {
//       let nextIndex = currentIndex + 1;
//       if (nextIndex >= sliderData.length) {
//         nextIndex = 0;
//       }

//       flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
//       setCurrentIndex(nextIndex);
//     }, 5000);

//     return () => {
//       clearInterval(intervalRef.current);
//     };
//   }, [sliderData, currentIndex]);

//   const renderItem = ({ item }) => {
//     const fallbackImage = "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg";
//     const imageUri = item?.PhotoString || fallbackImage;

//     return (
//       <View style={styles.cardWrapper}>
//         {/* <ImageBackground
//           source={{ uri: imageUri }}
//           style={styles.card}
//           imageStyle={styles.cardImage}
//         > */}
//         <LinearGradient
//           colors={['rgba(255, 255, 255, 1)', 'rgba(168, 230, 255, 0.38)']}
//           style={styles.gradientOverlay}
//         />


//         <View style={styles.content}>
//           <Image
//             source={{ uri: imageUri }}
//             style={styles.avatar}
//           />
//           <View style={styles.textBox}>
//             <Text style={styles.name}>{item.name || "Unnamed User"}</Text>
//             <Text style={styles.designation}>{item.designation || "No designation"}</Text>
//           </View>
//         </View>
//         {/* </ImageBackground> */}
//       </View>
//     );
//   };

//   return (
//     <View>
//       <FlatList
//         ref={flatListRef}
//         data={sliderData}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onViewableItemsChanged={onViewRef.current}
//         viewabilityConfig={viewConfigRef.current}
//       />
//       <View style={styles.dotContainer}>
//         {sliderData?.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.dot,
//               currentIndex === index ? styles.activeDot : null,
//             ]}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   cardWrapper: {
//     backgroundColor: 'red',
//     marginBottom: 25,
//     width: CARD_WIDTH,
//     marginHorizontal: 10,
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   card: {
//     // height: CARD_WIDTH * 0.6,
//     justifyContent: 'flex-end',
//     borderRadius: 20,
//   },
//   cardImage: {
//     borderRadius: 20,
//     backgroundColor: 'red'
//   },
//   gradientOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     borderRadius: 20,

//     backgroundColor: "#FFFFFF",
//     marginHorizontal: 10,
//     marginVertical: 4,
//     padding: 5,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     // elevation: 3,
//     // borderLeftWidth: 4,
//     // borderBottomWidth:5,
//     // borderBottomColor: "#004738ff",
//   },
//   content: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     zIndex: 2,
//   },
//   avatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     borderWidth: 2,
//     borderColor: '#fff',
//     marginRight: 16,
//     backgroundColor: '#ccc',
//   },
//   textBox: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 16,
//     color: '#720000ff',
//     fontWeight: '470',
//   },
//   designation: {
//     fontSize: 14,
//     color: '#2e006bff',
//     marginTop: 4,
//   },
//   dotContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 12,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#bbb',
//     marginHorizontal: 4,
//     opacity: 0.5,
//   },
//   activeDot: {
//     width: 16,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#ff4081',
//     opacity: 1,
//   },
// });

// export default BirthdaySlider;


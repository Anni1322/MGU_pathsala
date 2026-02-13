import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Alert, RefreshControl, Dimensions, StatusBar, Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
 
import Header from '../../layout/Header/Header2';
import Footer from '../../layout/Footer/Footer';
import { pathshalaMenu, studentMenu } from '../../config/Menu/MenuLiist';
import getApiList from '../../config/Api/ApiList';
import Slider from '../../layout/Sliders/Slider';
import { HttpService } from "../../../common/Services/HttpService";
import SessionService from "../../../common/Services/SessionService";
import { API_BASE_URL } from '../../../common/config/BaseUrl'
import colors from '../../../common/config/colors';

const { width } = Dimensions.get('window');

const HomeLayout = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [profileData, setProfileData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const getProfileDetails = useCallback(async (payload) => {
    try {
      const profileApi = getApiList().profile;
      if (!profileApi) throw new Error("Profile API endpoint not found.");
      const response = await HttpService.post(profileApi, payload);
      if (response?.status !== 200) throw new Error("Failed.");
      return response.data;
    } catch (error) {
      Alert.alert("Error", error?.message);
      return null;
    }
  }, []);

  const fetchSession = useCallback(async () => {
    const sessionData = await SessionService.getSession();
    const payload = {
      LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
      STUDENT_ID: sessionData?.STUDENT_ID,
    };

    const data = await getProfileDetails(payload);
    if (!data) return;

    const lastProfile = data?.StudentProfile[0] || {};
    const updatedProfile = {
      ...lastProfile,
      student_name: lastProfile["Student Name"] || "Student",
    };

    const rawPath = data.Profile_Photo?.[0]?.ProfilePhotoPath;
    const cleanedPath = rawPath?.replace("../", "/");
    const profileUrl = cleanedPath ? API_BASE_URL + cleanedPath : null;

    setProfileData(updatedProfile);
    setProfilePhoto(profileUrl);
  }, [getProfileDetails]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSession();
    setRefreshing(false);
  };

  // --- Render Item Logic ---
  // const renderGridItem = (item) => (
  //   <TouchableOpacity 
  //     key={item.id}
  //     style={styles.gridItemWrapper}
  //     onPress={() => navigation.navigate(item.screen)}
  //     activeOpacity={0.8}
  //   >
  //     <View style={[styles.iconCard, { shadowColor: item.color || colors.footercolor }]}>
  //       <FontAwesome6 name={item.icon} size={25} color={item.color || colors.footercolor} />
  //     </View>
  //     <Text style={styles.gridLabel} numberOfLines={1}>{item.name}</Text>
  //   </TouchableOpacity>
  // );



const renderGridItem = (item, index) => {
const liteColors = [
  '#F0F7FF',   
  '#F5F3FF',   
  '#F0FDFA',   
  '#FFF7ED'   
];

const iconColors = [
  '#2563EB',   
  '#7C3AED',   
  '#0D9488',  
  '#F97316'    
];

  
    const bgColor = item.bgColor || liteColors[index % 4];
    const accentColor = item.color || iconColors[index % 4];
  
    return (
      <TouchableOpacity 
        key={item.id}
        style={styles.gridItemWrapper}
        onPress={() => navigation.navigate(item.screen, { data: item.data })}
        activeOpacity={0.9}>
        
        <View style={[styles.iconCard, { backgroundColor: bgColor }]}>
          {/* TOP ROW: Icon and Badge */}
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
              <FontAwesome6 name={item.icon} size={35} color={accentColor} />
            </View>
            
            {item?.count > 0 && (
              <View style={[styles.badgeCount, { backgroundColor: accentColor }]}>
                <Text style={styles.badgeCountText}>{item.count}</Text>
              </View>
            )}
          </View>
  
          {/* BOTTOM ROW: Label */}
          <View style={styles.cardFooter}>
            <Text style={styles.gridLabel} numberOfLines={2}>{item.name}</Text>
            {/* Optional: Add a placeholder value like 'Check' or 'View' */}
            <FontAwesome6 name="chevron-right" size={10} color={accentColor} style={{opacity: 0.5}} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  





  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.footercolor} barStyle="light-content" />
      <Header />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.footercolor]}
            tintColor="#fff"
            progressViewOffset={40} 
          />
        }
      >
        {/* --- DECORATIVE BACKGROUND --- */}
        <View style={styles.decorativeHeader}>
           <View style={styles.decorativeCircle} />
        </View>

        {/* --- PROFILE CARD (Floating) --- */}
        <View style={styles.profileContainer}>
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.profileTextContainer}>
                <Text style={styles.greetingText}>Hello,</Text>
                <Text style={styles.nameText} numberOfLines={1}>
                  {profileData?.student_name || "Scholar"}
                </Text>
                <View style={styles.badgeContainer}>
                   <Text style={styles.badgeText}>
                     {profileData?.Semester_Name || "Sem N/A"}
                   </Text>
                </View>
              </View>
              <View style={styles.imageWrapper}>
                <Image 
                  source={{
                    uri: profilePhoto || "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
                  }} 
                  style={styles.profileImage} 
                />
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.degreeRow}>
              <FontAwesome6 name="school" size={16} color="#666" />
              <Text style={styles.degreeText} numberOfLines={1}>
                 {profileData?.Degree_Programme_Name || "Degree Programme"}
              </Text>
            </View>
          </View>
        </View>

        {/* --- SLIDER --- */}
        <View style={styles.sliderWrapper}>
           <Slider />
        </View>

        {/* --- STUDENT CORNER --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.headerRow}>
            <View style={styles.titleWrapper}>
               <View style={styles.verticalBar} />
               <Text style={styles.sectionTitle}>Student Corner</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ViewAllScreen', { title: 'Student Corner', menuData: pathshalaMenu })}>
              {/* <Text style={styles.viewAllText}>View All</Text> */}
            </TouchableOpacity>
          </View>
          
          <View style={styles.gridContainer}>
            {pathshalaMenu.slice(0, 4)?.map(renderGridItem)}
          </View>
        </View>

        {/* --- SERVICES --- */}
        <View style={[styles.sectionContainer_serice, { paddingBottom: 40 }]}>
          <View style={styles.headerRow}>
             <View style={styles.titleWrapper}>
               <View style={[styles.verticalBar, { backgroundColor: '#FF8C00' }]} />
               <Text style={styles.sectionTitle}>Services</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ViewAllScreen', { title: 'Services', menuData: studentMenu })}>
              {/* <Text style={styles.viewAllText}>View All</Text> */}
            </TouchableOpacity>
          </View>
          
          <View style={styles.gridContainer}>
            {studentMenu.slice(0, 8)?.map(renderGridItem)}
          </View>
        </View>

      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e4e5e9', 
  },
  content: {
    flex: 1,
  },
  
  decorativeHeader: {
    backgroundColor: colors.bgcolor,  
    height: 180,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  decorativeCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // --- Profile Card ---
  profileContainer: {
    paddingHorizontal: 20,
    marginTop: 20, 
    zIndex: 1,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    // Deep Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  greetingText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    fontWeight: '500',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a', // Almost black
    marginBottom: 8,
  },
  badgeContainer: {
    backgroundColor: '#E3F2FD', // Light Blue Pill
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.footercolor,
    fontWeight: '700',
    fontSize: 11,
  },
  imageWrapper: {
    // Add a ring effect
    padding: 3,
    backgroundColor: '#fff',
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  degreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  degreeText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },

  // --- Slider ---
  sliderWrapper: {
    marginTop: 10,
    marginBottom: 10,
    zIndex: 1,
  },

  // --- Sections ---
  sectionContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  sectionContainer_serice: {
    marginTop: 15,
    paddingHorizontal: 20,
     marginBottom: 38,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalBar: {
    width: 4,
    height: 20,
    backgroundColor: colors.bgcolor,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.3,
  },
  viewAllText: {
    color: colors.dangerD, // Red/Orange
    fontWeight: '700',
    fontSize: 13,
  },



  // --- Grid ---
  // gridContainer: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-between', // Ensures even spacing
  //   marginBottom:0
  // },


  // gridItemWrapper: {
  //   width: '23%', // Fits 4 items
  //   alignItems: 'center',
  //   marginBottom: 25,
  // },
  // iconCard: {
  //   width: 55,
  //   height: 55,
  //   borderRadius: 20, // Soft "Squircle"
  //   backgroundColor: '#ffffff',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 10,
  //   // Soft Float Shadow
  //   shadowOffset: { width: 0, height: 8 },
  //   shadowOpacity: 0.08,
  //   shadowRadius: 8,
  //   elevation: 6,
  // },
  // gridLabel: {
  //   fontSize: 11,
  //   color: '#555',
  //   textAlign: 'center',
  //   fontWeight: '600',
  //   width: '100%',
  // },




  
gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingTop: 5 ,
    paddingBottom:55,
 
  },
  gridItemWrapper: { 
    width: '48%',  
    marginBottom: 16 
  },
  iconCard: {
    width: '100%', 
    height: 120,  
    borderRadius: 22, 
    padding: 16, 
    justifyContent: 'space-between',
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridLabel: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#2C3E50', 
    flex: 1,
    marginRight: 5
  },
  badgeCount: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 22,
    alignItems: 'center',
  },
  badgeCountText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: '900' 
  },

});

export default HomeLayout;


















 
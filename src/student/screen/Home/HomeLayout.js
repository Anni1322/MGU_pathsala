import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Alert, RefreshControl
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Header from '../../layout/Header/Header2';
import Footer from '../../layout/Footer/Footer';
import { pathshalaMenu, studentMenu } from '../../config/Menu/MenuLiist';
import getApiList from '../../config/Api/ApiList';
import Slider from '../../layout/Sliders/Slider';
import { HttpService } from "../../../common/Services/HttpService";
import SessionService from "../../../common/Services/SessionService";
import { API_BASE_URL } from '../../../common/config/BaseUrl'
import colors from '../../../common/config/colors';

// Memoized IconText component
const IconText = React.memo(({
  label,
  iconLib = 'MaterialIcons',
  iconName,
  iconSize = 25,
  color = 'green',
}) => {
  const IconComponent = useMemo(() => {
    switch (iconLib) {
      case 'EvilIcons':
        return <EvilIcons name={iconName} size={iconSize} color={color} />;
      case 'FontAwesome6':
        return <FontAwesome6 name={iconName} size={iconSize} color={color} />;
      default:
        return <MaterialIcons name={iconName} size={iconSize} color={color} />;
    }
  }, [iconLib, iconName, iconSize, color]);

  return (
    <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
      {IconComponent}
      <Text style={{ color: 'navy', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
});


const HomeLayout = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const student = route.params;

  const [profileData, setProfileData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const getProfileDetails = useCallback(async (payload) => {
    try {
      const profileApi = getApiList().profile;
      if (!profileApi) throw new Error("Profile API endpoint not found.");

      const response = await HttpService.post(profileApi, payload);
      // console.log(response, "response session home");
      if (response?.status !== 200)
        throw new Error("Failed to fetch profile details.");

      return response.data;
    } catch (error) {
      Alert.alert("Profile Fetch Failed", error?.message || "Something went wrong Contact mis");
      // console.error("Profile fetch failed:", error);
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
    // const lastProfile = data.StudentProfile?.slice(-1)[0] || {};

    const updatedProfile = {
      ...lastProfile,
      student_name: lastProfile["Student Name"] || "No Name available",
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

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
            title="Refreshing..."
          />
        }
      >
        {/* User Info */}
        <View style={styles.infocard}>
          <View style={styles.userInfo}>
            <Image source={{
              uri: profilePhoto || "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
            }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{profileData?.student_name} 👋</Text>
              <Text style={styles.userHandle} >
                {profileData?.Semester_Name || "Semester Info"} , {profileData?.Degree_Programme_Name || "Not Available"}
              </Text>
            </View>
          </View>
        </View>

        {/* Slider */}
        <Slider />



    // {/* Pathshala Menu */}
        <View style={[styles.cardmain, { marginBottom: -25 }]}>
          {/* Student E-Corner */}
          <View style={[styles.texthead, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.sectionTitle}>Student Corner</Text>
            <TouchableOpacity
              style={styles.all}
              onPress={() => navigation.navigate('ViewAllScreen', { title: 'Student Corner', menuData: pathshalaMenu })}>
              <Text style={styles.all}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.eCornerContainer}>
            <View style={styles.gridContainer}>
              {pathshalaMenu.slice(0, 4)?.map((item) => (
                <TouchableOpacity key={item.id}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate(item.screen)}>
                  <View style={{ alignItems: "center" }}>
                    <View style={styles.iconRectangle}>
                      <FontAwesome6 name={item.icon} size={28} color={item.color} />
                    </View>
                    <Text style={styles.iconLabel}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.cardmain}>
          {/* Student E-Corner */}
          <View style={[styles.texthead, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.sectionTitle}>Services</Text>
            <TouchableOpacity
              style={styles.all}
              onPress={() => navigation.navigate('ViewAllScreen', { title: 'Services', menuData: studentMenu })}>
              <Text style={styles.all}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.eCornerContainer}>
            <View style={styles.gridContainer}>
              {studentMenu.slice(0,8)?.map((item) => (
                <TouchableOpacity key={item.id}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate(item.screen)}>
                  <View style={{ alignItems: "center" }}>
                    <View style={styles.iconRectangle}>
                      <FontAwesome6 name={item.icon} size={28} color={item.color} />
                    </View>
                    <Text style={styles.iconLabel}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffdfdff' },
  content: { flex: 1, padding: 15 },
  infocard: {
    marginLeft: -20,
    marginRight: -15,
    marginTop: -5,
    marginBottom: 10,
    backgroundColor: colors.footercolor,
    // borderTopLeftRadius:60,
    // borderTopRightRadius: 80,
    // borderBottomRightRadius: 80,
  },
  cardmain: {
    // marginRight: -15,
    // marginRight: 155,
    // marginTop: 25,
    // marginBottom: 10,
    backgroundColor: '#ffffffff',
    // borderTopLeftRadius: 80,
    // borderBottomLeftRadius: 80,

  },
  userInfo: {
    margin: 15,
    // padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25, marginRight: 10
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.background
  },
  userHandle: { color: colors.background, fontSize: 12 },
  greeting: { color: 'darkred', fontWeight: '600' },


  texthead: {
    color: colors.footercolor,
    fontWeight: 'bold',
    flexDirection: 'row',
    // alignContent: 'space-around'

  },
  all: {
    color: colors.dangerD,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 4,
    marginTop: 8,
    marginRight: 10,
  },
  sectionTitle: {
    color: colors.footercolor,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
    marginTop: 8,
    marginRight: 10,
  },
  sectionTitlestudent: {
    color: colors.footercolor,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
    marginTop: 8,
    marginRight: 10,
    // textAlign: 'right',
    fontFamily: 'Arial'
  },

  iconCircle: {
    backgroundColor: '#006d33ff',
    width: 50,
    height: 50,
    // borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  iconRectangle: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 0.4,
    borderRadius: 15,
    // backgroundColor:'red'

    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
    // elevation: 0.1,
    // backgroundColor: '#fff',
  },

  iconLabel: {
    fontSize: 13,
    color: '#003109ff',
    textAlign: 'center',
    fontFamily: 'Arial'
  },

  card1: {
    padding: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 20,
    justifyContent: 'space-around',
    justifyContent: 'flex-start',
    marginBottom: 15
  },
  gridItem: {
    width: '25%',
    marginBottom: 15,
  },
});

export default HomeLayout;

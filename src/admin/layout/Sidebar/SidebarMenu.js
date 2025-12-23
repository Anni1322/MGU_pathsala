import React, { useState, useEffect } from "react";
import {View,Text,TouchableOpacity,StyleSheet,Animated,Switch,ScrollView,Dimensions,Linking,Alert} from "react-native";
import { useNavigation } from '@react-navigation/native';

import AuthService from "../../../common/Services/AuthService";
import alertService from "../../../common/Services/alert/AlertService";
import SessionService from "../../../common/Services/SessionService";

import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';


const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7; // 80% of screen width


const menuSections = [
  {
    title: "MAIN MENU",
    items: [
      // { id: 1, title: "Home", icon: "🏠", screen: "AdminHomeLayout" },
      // { id: 2, title: "Examination", icon: "💼", screen: "Maintenance" },
      // { id: 3, title: "Save Old Question Paper", icon: "📂", screen: "OldQuestionPapers" },
      { id: 4, title: "Website", icon: "🌐", screen: "Website", link: "https://mguvv.ac.in/" },
      { id: 5, title: "Tell your friends", icon: "🤹🏻‍♂️", screen: "ShareApp", link: "https://play.google.com/store/apps/details?id=mguvvmis.mguvv" },
      // { id: 6, title: "User Manual", icon: "📄", screen: "UserManual" },
      { id: 7, title: "Like MOR GURUKUL ? Rate it!", icon: "⭐", screen: "RateUs", link: "https://play.google.com/store/apps/details?id=mguvvmis.mguvv" },
      // { id: 8, title: "More Apps", icon: "📱", screen: "MoreApps", link: "https://play.google.com/store/apps/developer?id=MGUVV" },
    ]
  },

  // {
  //   title: "faculty",
  //   items: [
  //     { id: 9, title: "My Course", icon: "👨‍🎓", screen: "MyCourse" },
  //     { id: 9, title: "My Students", icon: "👨‍🎓", screen: "MyStudents" },
  //     // { id: 10, title: "Change theme", icon: "🎨", screen: "Maintenance" },
  //     // { id: 11, title: "Set App Lock", icon: "🔒", screen: "Maintenance" },
  //   ]
  // },

  {
    // title: "SETTINGS",
    items: [
      // { id: 9, title: "My Students", icon: "👨‍🎓", screen: "MyStudents" },
      // { id: 10, title: "Change theme", icon: "🎨", screen: "Maintenance" },
      // { id: 11, title: "Set App Lock", icon: "🔒", screen: "Maintenance" },
    ]
  },
  {
    title: "ABOUT",
    items: [
      { id: 12, title: "Team Member", icon: "👥", screen: "Maintenance" },
    ]
  },
  {
    title: "",
    items: [
      { id: 14, title: "Logout", icon: "🚪", screen: "Logout" },
    ]
  },
  {
    title: "Privacy Policy",
    items: [
      { id: 15, title: "Privacy Policy", icon: "📃", screen: "Privacy Policy", link: 'https://mguvv.ac.in/' },
    ]
  },
];


export default function SidebarMenu({ sidebarX }) {
  const navigation = useNavigation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeItem, setActiveItem] = useState("My Purchases");
  const [profileData, setProfileData] = useState(null);

  const handleLogoutPress = () => {


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


  // const handleMenuItemPress = (item) => {

  //   // if (!item.hasSwitch && !item.isLogout) {
  //   //   setActiveItem(item.title);
  //   // }

  //   // console.log(`Pressed: ${item.title}`);

  //   // if (item.isLogout) {
  //   //   console.log("Logout pressed");
  //   //   // TODO: Add logout logic here
  //   //   return;
  //   // }

  //   if (item.screen) {
  //     if (item.screen == 'Logout') {
  //       handleLogoutPress();
  //       return
  //     }
  //     if (item.link) {
  //       Linking.openURL(item.link).catch(err =>
  //         console.error('Failed to open link:', err)
  //       );
  //       return;
  //     }

  //     navigation.navigate(item.screen);
  //   }
  // };



  const handleMenuItemPress = (item) => {
    if (item.screen) {
      console.log("ok", item.screen)
      if (item.screen == 'Logout') {
        handleLogoutPress();
        return;
      }

      if (item.link) {
        if (item.title === 'Tell your friends') {
          const message = `Check out this awesome app: ${item.link}`;

          const shareOptions = {
            title: 'Share via',
            message: message,
            url: item.link,
          };

          // Open the share sheet allowing the user to choose the app
          Share.open(shareOptions)
            .then((res) => console.log('Shared successfully!', res))
            .catch((err) => console.error('Error sharing: ', err));

          return;
        } else {
          // If not the "Tell your friends" item, just open the link normally
          Linking.openURL(item.link).catch((err) =>
            console.error('Failed to open link:', err)
          );
          return;
        }
      }

      // Navigate to the screen if there's no link or specific action
      navigation.navigate(item.screen);
    }
  };


  const toggleDarkMode = (value) => {
    setIsDarkMode(value);
  };

  useEffect(() => {
    // console.log("useEffect running");  
    let isMounted = true;
    const fetchSession = async () => {
      const sessionData = await SessionService.getSession();
      const data = sessionData?.LoginDetail[0];
      // console.log(data, "updatedProfileupdatedProfile");
      const updatedProfile = {
        ...data,
      };
      // console.log(updatedProfile,sessionData,"updatedProfile")
      if (!data || !isMounted) return;
      if (isMounted) {
        setProfileData(updatedProfile);
      }
    };

    fetchSession();
    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <Animated.View
      style={[
        styles.sidebar,
        { transform: [{ translateX: sidebarX }] },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        <TouchableOpacity
          style={styles.profileSectionWrapper} onPress={() => handleMenuItemPress(menuSections[0].items)} >
          <LinearGradient
             colors={['#ffffffff', '#e4efffff', '#d4f1ffff', '#ffd1faff']}
            // colors={['#f0caffff', '#c1e0ffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.profileSection}
          >
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profileData?.Emp_Name}</Text>
              {/* <Text style={styles.profileSubtitle}>
                {profileData?.Organization_Unit_Name || ''}
              </Text> */}
              <View style={styles.userInfo}></View>
            </View>
            <Text style={styles.chevron}>›</Text>

          </LinearGradient>

        </TouchableOpacity>


        {menuSections?.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            {section.title ? (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            ) : null}

            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  activeItem === item.title && styles.activeMenuItem,
                  item.isLogout && styles.logoutItem
                ]}
                onPress={() => handleMenuItemPress(item)}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <Text style={[
                    styles.menuItemText,
                    item.isLogout && styles.logoutText
                  ]}>
                    {item.title}
                  </Text>

                  {item.title === "Online Degree" && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>New</Text>
                    </View>
                  )}
                </View>

                <View style={styles.menuItemRight}>
                  {item.hasSwitch ? (
                    <Switch
                      value={isDarkMode}
                      onValueChange={toggleDarkMode}
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={isDarkMode ? "#3a2d75" : "#f4f3f4"}
                    />
                  ) : item.hasChevron ? (
                    <Text style={styles.chevron}>›</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: "#e7ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
  },

  scrollView: {
    flex: 1,
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    // backgroundColor: "#ffffff",
    // borderBottomWidth: 1,
    // borderBottomColor: "#940000ff",
    marginBottom: 10,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },


  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3a2d75",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileIconText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  profileSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  chevron: {
    fontSize: 20,
    color: "#999",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    paddingHorizontal: 20,
    paddingVertical: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activeMenuItem: {
    backgroundColor: "#f0f2f5",
    borderLeftWidth: 4,
    borderLeftColor: "#3a2d75",
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    marginTop: 10,
    backgroundColor: "#fff8f8",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemRight: {
    marginLeft: 10,
  },
  itemIcon: {
    fontSize: 18,
    marginRight: 15,
    width: 24,
    textAlign: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  logoutText: {
    color: "#dc3545",
    fontWeight: "600",
  },
  newBadge: {
    backgroundColor: "#28a745",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  newBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
});


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Switch,
  ScrollView,
  Dimensions,
  Linking,
  StatusBar,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';

import AuthService from "../../../common/Services/AuthService";
import alertService from "../../../common/Services/alert/AlertService";
import SessionService from "../../../common/Services/SessionService";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75; // 75% for better reach

const menuSections = [
  {
    title: "Main Explorer",
    items: [
      // { id: 4, title: "Official Website", icon: "🌐", screen: "WebsiteScreen", link: "https://mguvv.ac.in/angular/" },
      { id: 4, title: "Official Website", icon: "🌐", screen: "WebsiteScreen",},
      { id: 5, title: "Refer to Friends", icon: "🎁", screen: "ShareApp", link: "https://play.google.com/store/apps/details?id=mguvvmis.mguvv" },
      { id: 7, title: "Rate Our App", icon: "⭐", screen: "RateUs", link: "https://play.google.com/store/apps/details?id=mguvvmis.mguvv" },
    ]
  },
  {
    title: "Discovery",
    items: [
      // { id: 12, title: "Meet the Team", icon: "👥", screen: "TeamMembers" },
      { id: 12, title: "Meet the Team", icon: "👥", screen: "Maintenance" },
      { id: 15, title: "Privacy Policy", icon: "🛡️", screen: "PrivacyPolicy" },
    ]
  },
  {
    title: "System",
    items: [
      { id: 14, title: "Sign Out", icon: "🚀", screen: "Logout", isLogout: true },
    ]
  },
];

export default function SidebarMenu({ sidebarX }) {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSession = async () => {
      const sessionData = await SessionService.getSession();
      const data = sessionData?.LoginDetail[0];
      if (!data || !isMounted) return;
      setProfileData(data);
    };
    fetchSession();
    return () => { isMounted = false; };
  }, []);

  const handleLogoutPress = () => {
    alertService.show({
      title: "Sign Out",
      message: "Are you ready to leave your session?",
      type: "warn",
      buttonText: "Logout",
      cancelText: "Stay",
      onPress: async () => {
        await AuthService.logout();
        navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
      },
    });
  };

  const handleMenuItemPress = (item) => {
    if (item.isLogout) return handleLogoutPress();
    if (item.link) {
      if (item.id === 5) {
        Share.open({ message: `Level up your education with Mor Gurukul: ${item.link}` }).catch(() => {});
      } else {
        Linking.openURL(item.link).catch(() => {});
      }
      return;
    }
    navigation.navigate(item.screen);
  };

  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarX }] }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Dynamic Profile Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.profileCard}
        >
          <View style={styles.avatarGlow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {profileData?.Emp_Name?.charAt(0) || 'S'}
              </Text>
            </View>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.userName} numberOfLines={1}>
              {profileData?.Emp_Name || "Student Name"}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminProfile')}>
              <Text style={styles.viewProfileLabel}>Profile ›</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {menuSections.map((section, idx) => (
          <View key={idx} style={styles.sectionGroup}>
            <Text style={styles.sectionHeading}>{section.title}</Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.navItem, item.isLogout && styles.logoutNav]}
                onPress={() => handleMenuItemPress(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, item.isLogout && styles.logoutIconBox]}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <Text style={[styles.navLabel, item.isLogout && styles.logoutLabel]}>
                  {item.title}
                </Text>
                {item.id === 4 && (
                  <View style={styles.liveBadge}><Text style={styles.liveText}>Live</Text></View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.sidebarFooter}>
        <Text style={styles.footerVersion}>MGUVV • v1.0.3 build 2026</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: "#e8eaebff", // Clean Slate background
    zIndex: 1000,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
   
  },
  headerContainer: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFF',
    borderBottomRightRadius: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#334155',
  },
  avatarGlow: {
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profileTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  viewProfileLabel: {
    fontSize: 12,
    color: '#38BDF8',
    marginTop: 4,
    fontWeight: '600',
  },
  scrollBody: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionGroup: {
    marginTop: 25,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    paddingLeft: 10,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 36,
    height: 36,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 16,
  },
  navLabel: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  liveBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutNav: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
    marginTop: 20,
  },
  logoutIconBox: {
    backgroundColor: '#FFE4E6',
  },
  logoutLabel: {
    color: '#E11D48',
  },
  sidebarFooter: {
    padding: 25,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerVersion: {
    fontSize: 10,
    color: '#CBD5E1',
    fontWeight: '700',
    letterSpacing: 1,
  },
});










// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   Switch,
//   ScrollView,
//   Dimensions,
//   Linking,
// } from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import Share from 'react-native-share';

// import AuthService from "../../../common/Services/AuthService";
// import alertService from "../../../common/Services/alert/AlertService";
// import SessionService from "../../../common/Services/SessionService";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");
// const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7;

// const menuSections = [
//   {
//     title: "MAIN MENU",
//     items: [
//       { id: 4, title: "Website", icon: "🌐", screen: "Website", link: "https://mguvv.ac.in/" },
//       { id: 5, title: "Tell your friends", icon: "🤹🏻‍♂️", screen: "ShareApp", link: "https://play.google.com/store/apps/details?id=mguvvmis.mguvv" },
//       { id: 7, title: "Like MOR GURUKUL ? Rate it!", icon: "⭐", screen: "RateUs", link: "https://play.google.com/store/apps/details?id=mguvvmis.mguvv" },
//     ]
//   },
//   {
//     title: "ABOUT",
//     items: [
//       { id: 12, title: "Team Member", icon: "👥", screen: "Maintenance" },
//     ]
//   },
//   {
//     title: "ACCOUNT",
//     items: [
//       { id: 14, title: "Logout", icon: "🚪", screen: "Logout", isLogout: true },
//     ]
//   },
//   {
//     title: "LEGAL",
//     items: [
//       { id: 15, title: "Privacy Policy", icon: "📃", screen: "Privacy Policy", link: 'https://mguvv.ac.in/' },
//     ]
//   },
// ];

// export default function SidebarMenu({ sidebarX }) {
//   const navigation = useNavigation();
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [activeItem, setActiveItem] = useState(null);
//   const [profileData, setProfileData] = useState(null);

//   useEffect(() => {
//     let isMounted = true;
//     const fetchSession = async () => {
//       const sessionData = await SessionService.getSession();
//       const data = sessionData?.LoginDetail[0];
//       if (!data || !isMounted) return;
//       setProfileData(data);
//     };
//     fetchSession();
//     return () => { isMounted = false; };
//   }, []);

//   const handleLogoutPress = () => {
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
//     });
//   };

//   const handleMenuItemPress = (item) => {
//     if (!item || !item.screen) return;
//     setActiveItem(item.title);

//     if (item.screen === 'Logout') {
//       handleLogoutPress();
//       return;
//     }

//     if (item.link) {
//       if (item.title === 'Tell your friends') {
//         Share.open({
//           title: 'Share via',
//           message: `Check out this awesome app: ${item.link}`,
//           url: item.link,
//         }).catch((err) => console.log(err));
//       } else {
//         Linking.openURL(item.link).catch((err) => console.error('Link Error', err));
//       }
//       return;
//     }

//     navigation.navigate(item.screen);
//   };

//   return (
//     <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarX }] }]}>
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
//         {/* Profile Header */}
//         <TouchableOpacity 
//           activeOpacity={0.8} 
//           style={styles.profileSectionWrapper}
//           onPress={() => navigation.navigate('Profile')} // Navigates to a profile screen
//         >
//           <LinearGradient
//             colors={['#ffffff', '#e4efff', '#d4f1ff']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.profileSection}
//           >
//             <View style={styles.profileAvatarPlaceholder}>
//                <Text style={styles.avatarText}>
//                  {profileData?.Emp_Name?.charAt(0) || 'U'}
//                </Text>
//             </View>
//             <View style={styles.profileInfo}>
//               <Text style={styles.profileName} numberOfLines={1}>
//                 {profileData?.Emp_Name || "User Name"}
//               </Text>
//               <Text style={styles.profileSubtitle}>View Profile</Text>
//             </View>
//             <Text style={styles.chevron}>›</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Menu Sections */}
//         {menuSections.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={styles.section}>
//             {section.title ? <Text style={styles.sectionTitle}>{section.title}</Text> : null}

//             {section.items.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={[
//                   styles.menuItem,
//                   activeItem === item.title && styles.activeMenuItem,
//                   item.isLogout && styles.logoutItem
//                 ]}
//                 onPress={() => handleMenuItemPress(item)}
//               >
//                 <View style={styles.menuItemLeft}>
//                   <Text style={styles.itemIcon}>{item.icon}</Text>
//                   <Text style={[
//                     styles.menuItemText,
//                     item.isLogout && styles.logoutText
//                   ]}>
//                     {item.title}
//                   </Text>
                  
//                   {item.title === "Online Degree" && (
//                     <View style={styles.newBadge}>
//                       <Text style={styles.newBadgeText}>New</Text>
//                     </View>
//                   )}
//                 </View>

//                 <View style={styles.menuItemRight}>
//                   {item.hasSwitch && (
//                     <Switch
//                       value={isDarkMode}
//                       onValueChange={setIsDarkMode}
//                       trackColor={{ false: "#cbd5e1", true: "#81b0ff" }}
//                     />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         ))}
//       </ScrollView>
      
//       <View style={styles.footer}>
//         <Text style={styles.versionText}>Version 1.0.4</Text>
//       </View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   sidebar: {
//     position: "absolute",
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: SIDEBAR_WIDTH,
//     backgroundColor: "#fff",
//     zIndex: 100,
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 2, height: 0 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   scrollView: { flex: 1 },
//   profileSectionWrapper: {
//     overflow: 'hidden',
//     borderBottomRightRadius: 30,
//   },
//   profileSection: {
//     paddingTop: 60,
//     paddingBottom: 25,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileAvatarPlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 15,
//     backgroundColor: '#3b82f6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
//   profileInfo: { flex: 1 },
//   profileName: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
//   profileSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
//   chevron: { fontSize: 24, color: '#94a3b8' },
//   section: { marginTop: 20 },
//   sectionTitle: {
//     fontSize: 11,
//     fontWeight: '800',
//     color: '#94a3b8',
//     paddingHorizontal: 20,
//     marginBottom: 10,
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//     flexWrap:'wrap'
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     marginHorizontal: 10,
//     borderRadius: 12,
//   },
//   activeMenuItem: { backgroundColor: '#f1f5f9' },
//   menuItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
//   itemIcon: { fontSize: 18, marginRight: 12, width: 25, textAlign: 'center' },
//   menuItemText: { fontSize: 15, color: '#334155', fontWeight: '600' },
//   menuItemRight: { flexDirection: 'row', alignItems: 'center' },
//   newBadge: {
//     backgroundColor: '#3b82f6',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 6,
//     marginLeft: 8,
//   },
//   newBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
//   logoutItem: { marginTop: 10, backgroundColor: '#fff1f2' },
//   logoutText: { color: '#e11d48' },
//   footer: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#f1f5f9',
//     alignItems: 'center',
//   },
//   versionText: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
// });























// import React, { useState, useEffect } from "react";
// import {View,Text,TouchableOpacity,StyleSheet,Animated,Switch,ScrollView,Dimensions,Linking,Alert} from "react-native";
// import { useNavigation } from '@react-navigation/native';

// import AuthService from "../../../common/Services/AuthService";
// import alertService from "../../../common/Services/alert/AlertService";
// import SessionService from "../../../common/Services/SessionService";

// import LinearGradient from 'react-native-linear-gradient';
// import Share from 'react-native-share';


// const { width: SCREEN_WIDTH } = Dimensions.get("window");
// const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7; // 80% of screen width


// const menuSections = [
//   {
//     title: "MAIN MENU",
//     items: [
//       // { id: 1, title: "Home", icon: "🏠", screen: "AdminHomeLayout" },
//       // { id: 2, title: "Examination", icon: "💼", screen: "Maintenance" },
//       // { id: 3, title: "Save Old Question Paper", icon: "📂", screen: "OldQuestionPapers" },
//       { id: 4, title: "Website", icon: "🌐", screen: "Website", link: "https://mguvv.ac.in/" },
//       { id: 5, title: "Tell your friends", icon: "🤹🏻‍♂️", screen: "ShareApp", link: "https://play.google.com/store/apps/details?id=mguvvmis.mguvv" },
//       // { id: 6, title: "User Manual", icon: "📄", screen: "UserManual" },
//       { id: 7, title: "Like MOR GURUKUL ? Rate it!", icon: "⭐", screen: "RateUs", link: "https://play.google.com/store/apps/details?id=mguvvmis.mguvv" },
//       // { id: 8, title: "More Apps", icon: "📱", screen: "MoreApps", link: "https://play.google.com/store/apps/developer?id=MGUVV" },
//     ]
//   },

//   // {
//   //   title: "faculty",
//   //   items: [
//   //     { id: 9, title: "My Course", icon: "👨‍🎓", screen: "MyCourse" },
//   //     { id: 9, title: "My Students", icon: "👨‍🎓", screen: "MyStudents" },
//   //     // { id: 10, title: "Change theme", icon: "🎨", screen: "Maintenance" },
//   //     // { id: 11, title: "Set App Lock", icon: "🔒", screen: "Maintenance" },
//   //   ]
//   // },

//   {
//     // title: "SETTINGS",
//     items: [
//       // { id: 9, title: "My Students", icon: "👨‍🎓", screen: "MyStudents" },
//       // { id: 10, title: "Change theme", icon: "🎨", screen: "Maintenance" },
//       // { id: 11, title: "Set App Lock", icon: "🔒", screen: "Maintenance" },
//     ]
//   },
//   {
//     title: "ABOUT",
//     items: [
//       { id: 12, title: "Team Member", icon: "👥", screen: "Maintenance" },
//     ]
//   },
//   {
//     title: "",
//     items: [
//       { id: 14, title: "Logout", icon: "🚪", screen: "Logout" },
//     ]
//   },
//   {
//     title: "Privacy Policy",
//     items: [
//       { id: 15, title: "Privacy Policy", icon: "📃", screen: "Privacy Policy", link: 'https://mguvv.ac.in/' },
//     ]
//   },
// ];


// export default function SidebarMenu({ sidebarX }) {
//   const navigation = useNavigation();

//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [activeItem, setActiveItem] = useState("My Purchases");
//   const [profileData, setProfileData] = useState(null);

//   const handleLogoutPress = () => {
      

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


//   // const handleMenuItemPress = (item) => {

//   //   // if (!item.hasSwitch && !item.isLogout) {
//   //   //   setActiveItem(item.title);
//   //   // }

//   //   // console.log(`Pressed: ${item.title}`);

//   //   // if (item.isLogout) {
//   //   //   console.log("Logout pressed");
//   //   //   // TODO: Add logout logic here
//   //   //   return;
//   //   // }

//   //   if (item.screen) {
//   //     if (item.screen == 'Logout') {
//   //       handleLogoutPress();
//   //       return
//   //     }
//   //     if (item.link) {
//   //       Linking.openURL(item.link).catch(err =>
//   //         console.error('Failed to open link:', err)
//   //       );
//   //       return;
//   //     }

//   //     navigation.navigate(item.screen);
//   //   }
//   // };



//   const handleMenuItemPress = (item) => {
//     if (item.screen) {
//       console.log("ok", item.screen)
//       if (item.screen == 'Logout') {
//         handleLogoutPress();
//         return;
//       }

//       if (item.link) {
//         if (item.title === 'Tell your friends') {
//           const message = `Check out this awesome app: ${item.link}`;

//           const shareOptions = {
//             title: 'Share via',
//             message: message,
//             url: item.link,
//           };

//           // Open the share sheet allowing the user to choose the app
//           Share.open(shareOptions)
//             .then((res) => console.log('Shared successfully!', res))
//             .catch((err) => console.error('Error sharing: ', err));

//           return;
//         } else {
//           // If not the "Tell your friends" item, just open the link normally
//           Linking.openURL(item.link).catch((err) =>
//             console.error('Failed to open link:', err)
//           );
//           return;
//         }
//       }

//       // Navigate to the screen if there's no link or specific action
//       navigation.navigate(item.screen);
//     }
//   };


//   const toggleDarkMode = (value) => {
//     setIsDarkMode(value);
//   };

//   useEffect(() => {
//     // console.log("useEffect running");  
//     let isMounted = true;
//     const fetchSession = async () => {
//       const sessionData = await SessionService.getSession();
//       const data = sessionData?.LoginDetail[0];
//       // console.log(data, "updatedProfileupdatedProfile");
//       const updatedProfile = {
//         ...data,
//       };
//       // console.log(updatedProfile,sessionData,"updatedProfile")
//       if (!data || !isMounted) return;
//       if (isMounted) {
//         setProfileData(updatedProfile);
//       }
//     };

//     fetchSession();
//     return () => {
//       isMounted = false;
//     };
//   }, []);


//   return (
//     <Animated.View
//       style={[
//         styles.sidebar,
//         { transform: [{ translateX: sidebarX }] },
//       ]}
//     >
//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//       >

//         <TouchableOpacity
//           style={styles.profileSectionWrapper} onPress={() => handleMenuItemPress(menuSections[0].items)} >
//           <LinearGradient
//              colors={['#ffffffff', '#e4efffff', '#d4f1ffff', '#ffd1faff']}
//             // colors={['#f0caffff', '#c1e0ffff']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.profileSection}
//           >
//             <View style={styles.profileInfo}>
//               <Text style={styles.profileName}>{profileData?.Emp_Name}</Text>
//               {/* <Text style={styles.profileSubtitle}>
//                 {profileData?.Organization_Unit_Name || ''}
//               </Text> */}
//               <View style={styles.userInfo}></View>
//             </View>
//             <Text style={styles.chevron}>›</Text>

//           </LinearGradient>

//         </TouchableOpacity>


//         {menuSections?.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={styles.section}>
//             {section.title ? (
//               <Text style={styles.sectionTitle}>{section.title}</Text>
//             ) : null}

//             {section.items.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={[
//                   styles.menuItem,
//                   activeItem === item.title && styles.activeMenuItem,
//                   item.isLogout && styles.logoutItem
//                 ]}
//                 onPress={() => handleMenuItemPress(item)}
//               >
//                 <View style={styles.menuItemLeft}>
//                   <Text style={styles.itemIcon}>{item.icon}</Text>
//                   <Text style={[
//                     styles.menuItemText,
//                     item.isLogout && styles.logoutText
//                   ]}>
//                     {item.title}
//                   </Text>

//                   {item.title === "Online Degree" && (
//                     <View style={styles.newBadge}>
//                       <Text style={styles.newBadgeText}>New</Text>
//                     </View>
//                   )}
//                 </View>

//                 <View style={styles.menuItemRight}>
//                   {item.hasSwitch ? (
//                     <Switch
//                       value={isDarkMode}
//                       onValueChange={toggleDarkMode}
//                       trackColor={{ false: "#767577", true: "#81b0ff" }}
//                       thumbColor={isDarkMode ? "#3a2d75" : "#f4f3f4"}
//                     />
//                   ) : item.hasChevron ? (
//                     <Text style={styles.chevron}>›</Text>
//                   ) : null}
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         ))}
//       </ScrollView>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   sidebar: {
//     position: "absolute",
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: SIDEBAR_WIDTH,
//     backgroundColor: "#e7ffffff",
//     shadowColor: "#000",
//     shadowOffset: { width: 2, height: 0 },
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     elevation: 10,
//     zIndex: 10,
//   },

//   scrollView: {
//     flex: 1,
//   },

//   profileSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 20,
//     paddingHorizontal: 25,
//     // backgroundColor: "#ffffff",
//     // borderBottomWidth: 1,
//     // borderBottomColor: "#940000ff",
//     marginBottom: 10,
//     borderBottomRightRadius: 20,
//     borderBottomLeftRadius: 20,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },


//   profileIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#3a2d75",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 15,
//   },
//   profileIconText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 2,
//   },
//   profileSubtitle: {
//     fontSize: 14,
//     color: "#666",
//   },
//   chevron: {
//     fontSize: 20,
//     color: "#999",
//     fontWeight: "bold",
//   },
//   section: {
//     marginBottom: 5,
//   },
//   sectionTitle: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#999",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   activeMenuItem: {
//     backgroundColor: "#f0f2f5",
//     borderLeftWidth: 4,
//     borderLeftColor: "#3a2d75",
//   },
//   logoutItem: {
//     borderTopWidth: 1,
//     borderTopColor: "#e9ecef",
//     marginTop: 10,
//     backgroundColor: "#fff8f8",
//   },
//   menuItemLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   menuItemRight: {
//     marginLeft: 10,
//   },
//   itemIcon: {
//     fontSize: 18,
//     marginRight: 15,
//     width: 24,
//     textAlign: "center",
//   },
//   menuItemText: {
//     fontSize: 16,
//     color: "#333",
//     fontWeight: "500",
//     flex: 1,
//   },
//   logoutText: {
//     color: "#dc3545",
//     fontWeight: "600",
//   },
//   newBadge: {
//     backgroundColor: "#28a745",
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     marginLeft: 10,
//   },
//   newBadgeText: {
//     fontSize: 10,
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Switch,
  ScrollView,
  Dimensions,
  Linking
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import alertService from "../../../common/Services/alert/AlertService";
import AuthService from "../../../common/Services/AuthService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7; // 80% of screen width

export default function MenuScreen({ sidebarX }) {
  const navigation = useNavigation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeItem, setActiveItem] = useState("My Purchases");


  const menuSections = [
    {
      title: "Profile",
      items: [
        { id: 1, title: "Hi,", subtitle: "My profile", icon: "👤", hasChevron: true, screen: "Profile" },
      ]
    },
    {
      title: "Student E Corner",
      items: [
        { id: 2, title: "Admit Card", icon: "🎟️", screen: "AdmitCard" },
        { id: 3, title: "Fee Receipt", icon: "🧾", screen: "FeeReceipt" },
        { id: 4, title: "Registration Card", icon: "🆔", screen: "RegistraionCardList" },
        { id: 5, title: "SRC", icon: "👥", screen: "SRC" },
        { id: 7, title: "Admit card", icon: "👥", screen: "Maintenance" },
        { id: 6, title: "Syllabus", icon: "📘", screen: "Syllabus" },
        // { id: 7, title: "Test Series", icon: "📝", screen: "TestSeries" },   
        // { id: 8, title: "Online Degree", icon: "🎓", screen: "OnlineDegree" },   
      ]
    },
    {
      title: "CONTENT",
      items: [
        { id: 9, title: "Library", icon: "📖", screen: "Library", link: 'https://igkv.ac.in/library/' },
        // { id: 10, title: "My Downloads", icon: "⬇️", screen: "Downloads" },
      ]
    },
    {
      title: "SUPPORT",
      items: [
        { id: 12, title: "Complaint", icon: "ℹ️", screen: "ComplaintScreen" },
        // { id: 12, title: "About Us", icon: "ℹ️", screen: "AboutUs" },
        // { id: 13, title: "Contact Us", icon: "📞", screen: "ContactUs" },
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
        { id: 15, title: "Privacy Policy", icon: "📃", screen: "Privacy Policy", link: 'https://igkv.ac.in/site/#/' },
      ]
    },

    // {
    //   // title: "Version",
    //   items: [
    //     { id: 15, title: "Version 5.0.1", icon: "", },
    //   ]
    // },

    // {
    //   title: "                          NIC",
    //   items: [
    //     { id: 14, title: "IGKV, Raipur (C.G.) | Designed & Developed By: National Informatics Centre Chhattisgarh State Centre, Raipur", }, 
    //   ]
    // }

  ];


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




  const handleMenuItemPress = (item) => {
    // if (!item.hasSwitch && !item.isLogout) {
    //   setActiveItem(item.title);
    // }

    // console.log(`Pressed: ${item.title}`);

    // if (item.isLogout) {
    //   console.log("Logout pressed");
    //   // TODO: Add logout logic here
    //   return;
    // }

    if (item.screen) {
      if (item.screen == 'Logout') {
        handleLogoutPress();
        return
      }
      if (item.link) {
        Linking.openURL(item.link).catch(err =>
          console.error('Failed to open link:', err)
        );
        return;
      }

      navigation.navigate(item.screen);
    }

  };

  const toggleDarkMode = (value) => {
    setIsDarkMode(value);
  };

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
          style={styles.profileSection}
          onPress={() => handleMenuItemPress(menuSections[0].items[0])}
        >
          {/* <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}></Text>
          </View> */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileSubtitle}>View profile</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>


        {menuSections.slice(1).map((section, sectionIndex) => (
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
    backgroundColor: "#f0f0f0ff",
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
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    marginBottom: 10,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2000b1ff",
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
    fontSize: 18,
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

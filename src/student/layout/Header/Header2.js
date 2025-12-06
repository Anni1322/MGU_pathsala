import React, { useState, useRef } from 'react';
import { View,StyleSheet,TouchableOpacity,Text,StatusBar,Dimensions,Animated,} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
 
import colors from '../../../common/config/colors';
import AuthService from "../../../common/Services/AuthService";
import alertService from "../../../common/Services/alert/AlertService";
import MenuScreen from "../Sidebar/MenuScreen";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

export default function Header({ title, backgroundColor }) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? -SIDEBAR_WIDTH : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setSidebarOpen(!isSidebarOpen);
  };

  // const dynamicBgColor = backgroundColor || colors.primary;
  const dynamicBgColor = backgroundColor || colors.whiteD;

  return (
    <>
      <StatusBar backgroundColor={dynamicBgColor} barStyle="light-content" />
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
            <EvilIcons name="navicon" size={30} color={colors.footercolor} />
          </TouchableOpacity>
        )}
        <Text
          style={[
            styles.headerTitle,
            canGoBack ? styles.childTitle : styles.parentTitle,
          ]}
        >
          {title || 'MOR GURUKUL'}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <FontAwesome6 name="bell" size={24} color={colors.footercolor} />
          </TouchableOpacity>
          <View
            style={[styles.notificationDot, { backgroundColor: colors.footercolor }]}
          />
        </View>
      </View>
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
    elevation:55,
    shadowColor:'#000000ff'
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
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
});

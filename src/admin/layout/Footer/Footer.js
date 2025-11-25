import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../common/config/colors';

// --- Menu Data Definition ---
const menuItems = [
  {
    key: 'profile',
    iconName: 'user',
    label: 'My Profile',
    routeName: 'AdminProfile',
    isHome: false,
  },
  {
    key: 'assignment',
    iconName: 'book',
    label: 'Assignment',
    routeName: 'Maintenance',
    isHome: false,
  },
  {
    key: 'home',
    iconName: 'house',
    label: '',
    routeName: 'AdminHomeLayout',
    isHome: true, 
  },
  {
    key: 'qrscanner',
    iconName: 'camera',
    label: 'QRScanner',
    routeName: 'Maintenance',
    isHome: false,
  },
  {
    key: 'examination',
    iconName: 'pen-to-square',
    label: 'Examination',
    routeName: 'Maintenance',
    isHome: false,
  },
];
// ----------------------------

export default function FooterNav() {
  const navigation = useNavigation();

  const renderMenuItem = (item) => {
    const buttonStyle = item.isHome ? styles.homeBtn : styles.bottomNavItem;
    const navAction = item.isHome ? 
      () => navigation.replace(item.routeName) : 
      () => navigation.navigate(item.routeName);

    if (item.isHome) {
      return (
        <TouchableOpacity
          key={item.key}
          style={buttonStyle}
          onPress={navAction}
        >
          <View style={[styles.homeBtnCircle, { backgroundColor: colors.white }]}>
            <FontAwesome6 name={item.iconName} size={30} color={colors.primary} />
          </View>
          <Text style={[styles.bottomNavText, { color: colors.background, marginTop: 6 }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={item.key}
        style={buttonStyle}
        onPress={navAction}>
        <FontAwesome6 name={item.iconName} size={24} color={colors.background} />
        <Text style={[styles.bottomNavText, { color: colors.background }]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.bottomNav, { backgroundColor: colors.lite2 }]}>
      {menuItems.map(renderMenuItem)}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    // position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingHorizontal: 10,
    borderTopWidth:2,
    borderEndWidth:2,
    borderStartWidth:2,
    borderColor:"#ffffffff"
  },
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottomNavText: {
    fontSize: 11,
    marginTop: 2,
  },
  homeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:50
    // marginBottom: 20,
  },
  homeBtnCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
});
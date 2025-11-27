import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,   ImageBackground} from 'react-native';
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

  /**
   * Renders a single menu item based on its properties.
   * @param {object} item - The menu item object.
   */
  const renderMenuItem = (item) => {
    // Determine the style and navigation action based on the 'isHome' flag
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
          <View style={[styles.homeBtnCircle, { backgroundColor: colors.dangerD , borderWidth:1, borderColor:'white'}]}>
            <FontAwesome6 name={item.iconName} size={30} color={colors.white} />
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

  
   <ImageBackground
    source={require('../../../../assets/footer1.png')}
    style={styles.bottomNav}
    resizeMode="stretch" // or 'cover' depending on your design
  >
    {menuItems.map(renderMenuItem)}
  </ImageBackground>
 
    // <View style={[styles.bottomNav, { backgroundColor: colors.footercolor }]}>
    //   {menuItems.map(renderMenuItem)}
    // </View>

  );
}

const styles = StyleSheet.create({

  mainImagehead: {
    width: '90%',
    // height: 120,
    // marginTop: -50,
    // backgroundColor:'#fff',
  },
  bottomNav: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 105,
    // width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffffff',

    // borderTopLeftRadius: 85,    
    // borderTopRightRadius: 85,   
    // backgroundColor: '#f3faf9d7',
    // shadowColor: colors.secondary,
    // shadowOffset: { width: 0, height: -1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 38,
    
    paddingHorizontal: 10,
  },

  bottomNavItem: {
    alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
    bottom: -18,
  },
  bottomNavText: {
    fontSize: 11,
    marginTop: 2,
  },
  homeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 18,
    // marginBottom: 20,
    
  },
  homeBtnCircle: {
    width: 78,
    height: 78,
    borderRadius: 59,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
});
// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import { useNavigation } from '@react-navigation/native';
// import colors from '../../../common/config/colors';

// export default function FooterNav() {
//   const navigation = useNavigation();

//   return (
//     <View style={[styles.bottomNav, { backgroundColor: colors.primary }]}>
//       <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Syllabus')}>
//         <FontAwesome6 name="book-open" size={24} color={colors.background} />
//         <Text style={[styles.bottomNavText, { color: colors.background }]}>Syllabus</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.bottomNavItem}onPress={() => navigation.navigate('FeeReceipt')}>
//         <FontAwesome6 name="file-invoice-dollar" size={24} color={colors.background} />
//         <Text style={[styles.bottomNavText, { color: colors.background }]}>Fees Receipt</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.replace('HomeLayout')}>
//         <View style={[styles.homeBtnCircle, { backgroundColor: colors.white }]}>
//           <FontAwesome6 name="graduation-cap" size={30} color={colors.primary} />
//         </View>
//         <Text style={[styles.bottomNavText, { color: colors.background, marginTop: 6 }]}>Home</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Profile')}>
//         <FontAwesome6 name="user" size={24} color={colors.background} />
//         <Text style={[styles.bottomNavText, { color: colors.background }]}>My Profile</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Transcript')}>
//         <FontAwesome6 name="file-alt" size={24} color={colors.background} />
//         <Text style={[styles.bottomNavText, { color: colors.background }]}>Transcript</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   bottomNav: {
//     // position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 70,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     shadowColor: colors.secondary,
//     shadowOffset: { width: 0, height: -1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 8,
//     paddingHorizontal: 10,
//   },
//   bottomNavItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//   },
//   bottomNavText: {
//     fontSize: 11,
//     marginTop: 2,
//   },
//   homeBtn: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   homeBtnCircle: {
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: colors.secondary,
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.6,
//     shadowRadius: 8,
//     elevation: 8,
//   },
// });



import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../common/config/colors';

// --- Menu Data Definition ---
const menuItems = [
  {
    key: 'Syllabus',
    iconName: 'book-open',
    label: 'Syllabus',
    routeName: 'Syllabus',
    isHome: false,
  },
  {
    key: 'FeeReceipt',
    iconName: 'book',
    label: 'FeeReceipt',
    routeName: 'FeeReceipt',
    isHome: false,
  },
  {
    key: 'home',
    iconName: 'house',
    label: '',
    routeName: 'HomeLayout',
    isHome: true, 
  },
  {
    key: 'My Profile',
    iconName: 'user',
    label: 'My Profile',
    routeName: 'Profile',
    isHome: false,
  },
  {
    key: 'Transcript',
    iconName: 'file-alt',
    label: 'Transcript',
    routeName: 'Transcript',
    isHome: false,
  },
];
// ----------------------------

export default function FooterNav() {
  const navigation = useNavigation();

 
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
          <View style={[styles.homeBtnCircle, { backgroundColor: colors.background }]}>
            <FontAwesome6 name={item.iconName} size={30} color={colors.secondary} />
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
    <View style={[styles.bottomNav, { backgroundColor: colors.lite }]}>
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
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingHorizontal: 10,
    borderWidth: 5,
    borderColor: '#ffffffff',
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
    marginBottom: -20,
  },
  homeBtnCircle: {
    width: 58,
    height: 58,
    borderRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
});
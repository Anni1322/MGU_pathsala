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



// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import { useNavigation } from '@react-navigation/native';
// import colors from '../../../common/config/colors';

// // --- Menu Data Definition ---
// const menuItems = [
//   {
//     key: 'Syllabus',
//     iconName: 'book-open',
//     label: 'Syllabus',
//     routeName: 'Syllabus',
//     isHome: false,
//   },
//   {
//     key: 'FeeReceipt',
//     iconName: 'book',
//     label: 'FeeReceipt',
//     routeName: 'FeeReceipt',
//     isHome: false,
//   },
//   {
//     key: 'home',
//     iconName: 'house',
//     label: '',
//     routeName: 'HomeLayout',
//     isHome: true,
//   },
//   {
//     key: 'My Profile',
//     iconName: 'user',
//     label: 'My Profile',
//     routeName: 'Profile',
//     isHome: false,
//   },
//   {
//     key: 'Transcript',
//     iconName: 'file-alt',
//     label: 'Transcript',
//     routeName: 'Transcript',
//     isHome: false,
//   },
// ];
// // ----------------------------

// export default function FooterNav() {
//   const navigation = useNavigation();


//   const renderMenuItem = (item) => {
//     // Determine the style and navigation action based on the 'isHome' flag
//     const buttonStyle = item.isHome ? styles.homeBtn : styles.bottomNavItem;
//     const navAction = item.isHome ?
//       () => navigation.replace(item.routeName) :
//       () => navigation.navigate(item.routeName);

//     if (item.isHome) {
//       return (
//         <TouchableOpacity
//           key={item.key}
//           style={buttonStyle}
//           onPress={navAction}
//         >
//           <View style={[styles.homeBtnCircle, { backgroundColor: colors.dangerD, borderWidth:1, borderColor:'white' }]}>
//             <FontAwesome6 name={item.iconName} size={30} color={colors.white} />
//           </View>
//           <Text style={[styles.bottomNavText, { color: colors.background, marginTop: 6 }]}>
//             {item.label}
//           </Text>
//         </TouchableOpacity>
//       );
//     }

//     return (
//       <TouchableOpacity
//         key={item.key}
//         style={buttonStyle}
//         onPress={navAction}>
//         <FontAwesome6 name={item.iconName} size={24} color={colors.background} />
//         <Text style={[styles.bottomNavText, { color: colors.background }]}>
//           {item.label}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (

//     <ImageBackground
//       source={require('../../../../assets/footer1.png')}
//       style={styles.bottomNav}
//       resizeMode="stretch" 
//     >
//       {menuItems.map(renderMenuItem)}
//     </ImageBackground>

//     // <View style={[styles.bottomNav, { backgroundColor: colors.lite }]}>
//     //   {menuItems.map(renderMenuItem)}
//     // </View>
//   );
// }

// const styles = StyleSheet.create({
//   // bottomNav: {
//   //   // position: 'absolute',
//   //   bottom: 0,
//   //   left: 0,
//   //   right: 0,
//   //   height: 65,
//   //   flexDirection: 'row',
//   //   justifyContent: 'space-around',
//   //   alignItems: 'center',
//   //   borderTopLeftRadius: 20,
//   //   borderTopRightRadius: 20,
//   //   borderBottomLeftRadius: 20,
//   //   borderBottomRightRadius: 20,
//   //   shadowColor: colors.secondary,
//   //   shadowOffset: { width: 0, height: -1 },
//   //   shadowOpacity: 0.1,
//   //   shadowRadius: 8,
//   //   elevation: 8,
//   //   paddingHorizontal: 10,
//   //   borderWidth: 5,
//   //   borderColor: '#ffffffff',
//   // },

//   bottomNav: {
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 105,
//     // width:'100%',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: '#ffffffff',

//     // borderTopLeftRadius: 85,    
//     // borderTopRightRadius: 85,   
//     // backgroundColor: '#f3faf9d7',
//     // shadowColor: colors.secondary,
//     // shadowOffset: { width: 0, height: -1 },
//     // shadowOpacity: 0.1,
//     // shadowRadius: 8,
//     // elevation: 38,
//     paddingHorizontal: 10,
//   },


//   bottomNavItem: {
//     alignItems: 'center',
//     // justifyContent: 'center',
//     flex: 1,
//     bottom: -18,
//   },
//   bottomNavText: {
//     fontSize: 11,
//     marginTop: 2,
//   },
//   homeBtn: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     bottom: 18,
//     // marginBottom: -20,
//   },
//   homeBtnCircle: {
//     width: 78,
//     height: 78,
//     borderRadius: 39,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: colors.background,
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.6,
//     shadowRadius: 8,
//     elevation: 8,
//   },
// });






import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, useNavigationState } from '@react-navigation/native'; // Added useNavigationState
import Svg, { Path } from 'react-native-svg';
import colors from '../../../common/config/colors';

const { width } = Dimensions.get('window');

// Define colors here for easy adjustment
const ACTIVE_COLOR = '#ffa600f1'; // Yellow/Gold for active state
const INACTIVE_COLOR = '#FFFFFF';

const menuItems = [
  { key: 'Syllabus', iconName: 'book-open', label: 'Syllabus', routeName: 'Syllabus' },
  { key: 'FeeReceipt', iconName: 'file-invoice', label: 'FeeReceipt', routeName: 'FeeReceipt' },
  { key: 'home', iconName: 'house', label: '', routeName: 'HomeLayout', isHome: true },
  { key: 'My Profile', iconName: 'user-large', label: 'My Profile', routeName: 'Profile' },
  { key: 'Transcript', iconName: 'file-lines', label: 'Transcript', routeName: 'Transcript' },
];

const bg = colors.bgcolor

export default function FooterNav() {
  const navigation = useNavigation();

  // Get the current route name from the navigation state
  const currentRouteName = useNavigationState((state) => 
    state?.routes[state.index]?.name
  );

  return (
    <View style={styles.container}>
      <Svg
        height="110"
        width={width}
        viewBox={`0 0 ${width} 110`}
        style={styles.svgBackground}
      >
        <Path
          d={`M0 60 Q${width / 2} 0 ${width} 60 L${width} 110 L0 110 Z`}
          fill={bg}
        />
        <Path
          d={`M0 60 Q${width / 2} 0 ${width} 60`}
          fill="none"
          stroke="#ffffffff"
          strokeWidth="8"
        />
      </Svg>

      <View style={styles.contentWrapper}>
        {menuItems.map((item) => {
          const isHome = item.isHome;
          const isActive = currentRouteName === item.routeName;
          
          const navAction = () => navigation.navigate(item.routeName);

          if (isHome) {
            return (
              <TouchableOpacity key={item.key} style={styles.homeBtnContainer} onPress={navAction} activeOpacity={0.9}>
                <View style={[
                  styles.homeBtnCircle, 
                  isActive && { borderColor: ACTIVE_COLOR, borderWidth: 5 } 
                ]}>
                  <FontAwesome6 name={item.iconName} size={30} color="#ffffffff" />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity key={item.key} style={styles.navItem} onPress={navAction}>
              <FontAwesome6 
                name={item.iconName} 
                size={22} 
                color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR} 
              />
              <Text style={[
                styles.navText, 
                { color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR }
              ]} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 110,
    backgroundColor: 'transparent',
  },
  svgBackground: {
    position: 'absolute',
    bottom: 0,
  },
  contentWrapper: {
    flexDirection: 'row',
    width: '100%',
    height: 120,
    alignItems: 'flex-end',
    paddingBottom: 5,
    zIndex: 2,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  homeBtnContainer: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
  },
  homeBtnCircle: {
    width: 70,
    height: 70,
    borderRadius: 38,
    backgroundColor: '#cececeff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
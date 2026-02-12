import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import colors from '../../../common/config/colors';

const { width } = Dimensions.get('window');

// Define colors here for easy adjustment
const ACTIVE_COLOR = '#ffa600f1'; // Yellow/Gold for active state
const INACTIVE_COLOR = '#FFFFFF';
const BG_COLOR = colors.bgcolor || '#3D365C'; // Fallback to your primary admin theme color

const menuItems = [
  {
    key: 'Profile',
    iconName: 'user',
    label: 'My Profile',
    routeName: 'AdminProfile',
    isHome: false,
  },
  {
    key: 'MyStudents',
    iconName: 'book',
    label: 'My Students',
    routeName: 'MyStudents',
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
    key: 'MyCourses',
    iconName:'users',
    label: 'My Courses',
    routeName: 'MyCourses',
    isHome: false,
  },
  {
    key: 'Study Material',
    iconName: 'pen-to-square',
    label: 'Examination',
    routeName: 'Maintenance',
    isHome: false,
  },
];

export default function FooterNav() {
  const navigation = useNavigation();

  // Get the current route name from the navigation state to handle active highlights
  const currentRouteName = useNavigationState((state) => 
    state?.routes[state.index]?.name
  );

  return (
    <View style={styles.container}>
      {/* Modern Curved SVG Background */}
      <Svg
        height="110"
        width={width}
        viewBox={`0 0 ${width} 110`}
        style={styles.svgBackground}
      >
        <Path
          d={`M0 60 Q${width / 2} 0 ${width} 60 L${width} 110 L0 110 Z`}
          fill={BG_COLOR}
        />
        <Path
          d={`M0 60 Q${width / 2} 0 ${width} 60`}
          fill="none"
          stroke="rgb(255, 255, 255)"
          strokeWidth="10"
          opacity={1.2}  
        />
      </Svg>

      <View style={styles.contentWrapper}>
        {menuItems.map((item) => {
          const isHome = item.isHome;
          const isActive = currentRouteName === item.routeName;
          
          // Use .replace for Home to reset stack, .navigate for others
          const navAction = isHome ? 
            () => navigation.replace(item.routeName) : 
            () => navigation.replace(item.routeName);

          if (isHome) {
            return (
              <TouchableOpacity 
                key={item.key} 
                style={styles.homeBtnContainer} 
                onPress={navAction} 
                activeOpacity={0.9}
              >
                <View style={[
                  styles.homeBtnCircle, 
                  { backgroundColor: colors.backgroundlite || colors.primary },
                  isActive && { borderColor: ACTIVE_COLOR, borderWidth: 5 } 
                ]}>
                  <FontAwesome6 name={item.iconName} size={30} color="#4c60d1" />
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
    fontSize: 10, // Slightly smaller for Admin labels (more text)
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
    borderRadius: 35,
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



















// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet,   ImageBackground} from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import { useNavigation } from '@react-navigation/native';
// import colors from '../../../common/config/colors';

// //^ --- Menu Data Definition ---
// const menuItems = [
//   {
//     key: 'profile',
//     iconName: 'user',
//     label: 'My Profile',
//     routeName: 'AdminProfile',
//     isHome: false,
//   },
//   {
//     key: 'assignment',
//     iconName: 'book',
//     label: 'Assignment',
//     routeName: 'Maintenance',
//     isHome: false,
//   },
//   {
//     key: 'home',
//     iconName: 'house',
//     label: '',
//     routeName: 'AdminHomeLayout',
//     isHome: true,
//   },
//   {
//     key: 'qrscanner',
//     iconName: 'camera',
//     label: 'QRScanner',
//     routeName: 'Maintenance',
//     isHome: false,
//   },
//   {
//     key: 'examination',
//     iconName: 'pen-to-square',
//     label: 'Examination',
//     routeName: 'Maintenance',
//     isHome: false,
//   },
// ];
// // ----------------------------

// export default function FooterNav() {
//   const navigation = useNavigation();
//   const renderMenuItem = (item) => {
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
//           <View style={[styles.homeBtnCircle, { backgroundColor: colors.dangerD , borderWidth:1, borderColor:'white'}]}>
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

  
//    <ImageBackground
//     source={require('../../../../assets/footer1.png')}
//     style={styles.bottomNav}
//     resizeMode="stretch" // or 'cover' depending on your design
//   >
//     {menuItems.map(renderMenuItem)}
//   </ImageBackground>
 
//     // <View style={[styles.bottomNav, { backgroundColor: colors.footercolor }]}>
//     //   {menuItems.map(renderMenuItem)}
//     // </View>

//   );
// }

// const styles = StyleSheet.create({

//   mainImagehead: {
//     width: '90%',
//     // height: 120,
//     // marginTop: -50,
//     // backgroundColor:'#fff',
//   },
//   bottomNav: {
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 105,
//     // width:'100%',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     // backgroundColor: '#ffffffff',

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
//     // marginBottom: 20,
    
//   },
//   homeBtnCircle: {
//     width: 78,
//     height: 78,
//     borderRadius: 59,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: colors.danger,
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.6,
//     shadowRadius: 8,
//     elevation: 8,
//   },
// });
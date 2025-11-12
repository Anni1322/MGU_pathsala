import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../common/config/colors';


export default function FooterNav() {
  const navigation = useNavigation();
  return (
    <View style={[styles.bottomNav, { backgroundColor: colors.primary }]}>
      <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('AdminProfile')}>
        <FontAwesome6 name="user" size={24} color={colors.background} />
        <Text style={[styles.bottomNavText, { color: colors.background }]}>My Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Maintenance')}>
        <FontAwesome6 name="book" size={24} color={colors.background} />
        <Text style={[styles.bottomNavText, { color: colors.background }]}>Assignment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.replace('AdminHomeLayout')}>
        <View style={[styles.homeBtnCircle, { backgroundColor: colors.white }]}>
          <FontAwesome6 name="graduation-cap" size={30} color={colors.primary} />
        </View>
        <Text style={[styles.bottomNavText, { color: colors.background, marginTop: 6 }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Maintenance')}>
        <FontAwesome6 name="camera" size={24} color={colors.background} />
        <Text style={[styles.bottomNavText, { color: colors.background }]}>QRScanner</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Maintenance')}>
        <FontAwesome6 name="pen-to-square" size={24} color={colors.background} />
        <Text style={[styles.bottomNavText, { color: colors.background }]}>Examination</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
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

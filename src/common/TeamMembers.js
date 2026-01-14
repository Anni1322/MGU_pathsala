import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  SafeAreaView, Animated, Dimensions, Image, FlatList, 
  StatusBar
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const TEAM_DATA = [
  { id: '1', name: 'Dr. A.K. Sharma', role: 'Vice Chancellor', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Dr. Rajesh Kumar', role: 'Dean Horticulture', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Dr. Sunita Verma', role: 'Head of Forestry', image: 'https://via.placeholder.com/150' },
  { id: '4', name: 'Dr. Manoj Singh', role: 'Research Director', image: 'https://via.placeholder.com/150' },
];

const TeamMember = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderMember = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.memberCard, 
        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.profileImg} />
      </View>
      <Text style={styles.memberName}>{item.name}</Text>
      <Text style={styles.memberRole}>{item.role}</Text>
      
      <TouchableOpacity style={styles.contactBtn}>
        <FontAwesome6 name="envelope" size={14} color="#1B4332" />
        <Text style={styles.contactText}>Contact</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" transparent translucent />
      
      {/* Nature Background Decorations */}
      <View style={styles.bgOverlay}>
        <Svg height={height} width={width}>
          <Circle cx={width * 0.1} cy={height * 0.1} r="150" fill="rgba(67, 233, 123, 0.1)" />
          <Circle cx={width * 0.9} cy={height * 0.4} r="100" fill="rgba(27, 67, 50, 0.05)" />
        </Svg>
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome6 name="arrow-left" size={20} color="#1B4332" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Team</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <FlatList
        data={TEAM_DATA}
        renderItem={renderMember}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listPadding}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FFF7' },
  bgOverlay: { ...StyleSheet.absoluteFillObject, zIndex: -1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1B4332' },
  backBtn: { padding: 10, backgroundColor: '#FFF', borderRadius: 12, elevation: 2 },
  listPadding: { paddingHorizontal: 15, paddingBottom: 30 },
  columnWrapper: { justifyContent: 'space-between' },
  memberCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: width * 0.44,
    borderRadius: 25,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    elevation: 4,
    shadowColor: '#1B4332',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    padding: 3,
    borderWidth: 2,
    borderColor: '#52B788',
    marginBottom: 12,
  },
  profileImg: { width: '100%', height: '100%', borderRadius: 40 },
  memberName: { fontSize: 16, fontWeight: '700', color: '#1B4332', textAlign: 'center' },
  memberRole: { fontSize: 12, color: '#40916C', marginTop: 4, textAlign: 'center' },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: 'rgba(82, 183, 136, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  contactText: { fontSize: 12, fontWeight: '600', color: '#1B4332' },
});

export default TeamMember;
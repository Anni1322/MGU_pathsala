import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../common/config/colors';

const ViewAllScreen = ({ route, navigation }) => {
  const { title, menuData } = route.params;
  
  const screenWidth = Dimensions.get('window').width;
  const minItemWidth = 90; // Minimum width per item (icon 70 + margins)
  const numColumns = Math.max(2, Math.min(6, Math.floor(screenWidth / minItemWidth))); // Responsive columns: min 2, max 6
  
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.gridItem, { width: screenWidth / numColumns }]} 
      onPress={() => navigation.navigate(item.screen)}>
      <View style={{ alignItems: "center" }}>
        <View style={styles.iconRectangle}>
          <FontAwesome6 name={item.icon} size={28} color={item.color} />
        </View>
        <Text style={styles.iconLabel}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{title}</Text>
        
        <FlatList
          data={menuData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    // padding: 10,
    backgroundColor: '#fffdfdff' 
  },
  content: { 
    // flex: 1, 
    padding: 10, 
    margin:-10 
  
  },
  sectionTitle: {
    color: colors.background,  
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,  
    textAlign: 'center',
    padding:10,
    margin:10,
    borderRadius:10,
    backgroundColor:colors.footercolor
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 20,
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  gridItem: {
    marginBottom: 15,
    alignItems: 'center', 
  },
  iconRectangle: {
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 0.7,
  },
  iconLabel: {
    fontSize: 13,
    color: '#003109ff',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
});

export default ViewAllScreen;

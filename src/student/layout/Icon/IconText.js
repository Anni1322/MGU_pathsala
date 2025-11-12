import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IconText = ({ icon, label, image, iconColor = 'white', textStyle = {}, iconSize = 25 }) => (
  <View style={{ alignItems: 'center' }}>
    {image ? (
      <Image source={image} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
    ) : (
      <Icon name={icon} size={iconSize} color={iconColor} />
    )}
    <Text style={[styles.label, textStyle]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    color: 'white',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default IconText;

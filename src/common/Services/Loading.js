import React from 'react';
import { View, ActivityIndicator, StyleSheet, Animated, Easing } from 'react-native';

const Loading = ({ size = 'large', color = '#3498db', style = {} }) => {
  const rotation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,  
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.overlay, style]}>
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <ActivityIndicator size={size} color={color} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,  
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 999,  
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    elevation: 5,  
    shadowColor: '#000',  
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default Loading;

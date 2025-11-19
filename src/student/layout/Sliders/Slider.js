import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity, ImageBackground, } from 'react-native';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

const sliderData = [
  {
    id: '0',
    title: 'MGUVV Durg',
    subtitle: 'Mahatma Gandhi Udyanikee Evam Vanikee Vishwavidyalaya, Durg',
    video: 'https://mguvv.ac.in/angular/assets/video/home_video.mp4',
    color: '#6a9f66db',  
  },
  {
    id: '1',
    title: 'MGUVV Durg: Pioneering Excellence',
    subtitle: 'Mahatma Gandhi University of Horticulture and Forestry',
    color: '#001168db', 
  },
  {
    id: '2',
    title: 'Focus on Horticulture & Forestry',
    subtitle: 'Specialized Academic Programs for Green Careers',
    color: '#228B22', 
  },
  {
    id: '3',
    title: 'Committed to Academic Excellence',
    subtitle: 'Dedicated Faculty & State-of-the-Art Research Facilities',
    color: '#837211ff',  
  },
  {
    id: '4',
    title: 'Promoting Sustainable Practices',
    subtitle: 'Research and Education for Environmental Stewardship',
    color: '#128312ff',  
  },
  {
    id: '5',
    title: 'Central Chhattisgarh Location',
    subtitle: 'Excellent Connectivity & Vibrant University Life in Durg',
    color: '#8c2b1aff', // Tomato red for vibrancy
  },
  {
    id: '6',
    title: 'Hands-on Learning',
    subtitle: 'Practical Field Exposure and Experiential Education',
    color: '#8A2BE2', // Blue violet for hands-on
  },
  {
    id: '7',
    title: 'Empowering Rural Economy',
    subtitle: 'Research Focused on Farmers and Local Producers',
    color: '#DAA520', // Goldenrod for rural/economy
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= sliderData.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => {
    const cardColor = item.color || '#6a9f66db'; // Fallback to default green if no color is provided

    if (item.video) {
      return (
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Video
            source={{ uri: item.video }}
            style={styles.video}
            resizeMode="cover"
            repeat
            paused={false}
          />
          <View style={styles.overlay} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        </View>
      );
    }

    // For non-video cards, use the dynamic color
    return (
      <View style={[styles.card, styles.userCard, { backgroundColor: cardColor }]}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={sliderData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      <View style={styles.dotContainer}>
        {sliderData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    width: width - 50,
    height: width * 0.45,
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  card: {
    // backgroundColor removed - now dynamic
    width: width - 50,
    borderRadius: 20,
    marginHorizontal: 8,
    marginTop: 1,
    padding: width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: width * 0.45,
    position: 'relative',
    overflow: 'hidden',
  },
  userCard: {
    // backgroundColor removed - now dynamic
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'green',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
    marginTop: 90,
    paddingRight: 5,
    zIndex: 2, // above overlay
  },
  title: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#d0d0d0',
    marginTop: 5,
    fontSize: width * 0.035,
  },
  arrowButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    zIndex: 2,
  },
  arrow: {
    fontSize: 20,
    color: '#002B34',
    fontWeight: 'bold',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#000',
  },
});

export default Slider;

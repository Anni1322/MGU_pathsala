import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import colors from '../../../common/config/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;

const sliderData = [
  { id: '1', title: 'MGUVV Durg: Pioneering Excellence', subtitle: 'Mahatma Gandhi University of Horticulture and Forestry' },
  { id: '2', title: 'Focus on Horticulture & Forestry', subtitle: 'Specialized Academic Programs for Green Careers' },
  { id: '3', title: 'Committed to Academic Excellence', subtitle: 'Dedicated Faculty & State-of-the-Art Research Facilities' },
  { id: '4', title: 'Promoting Sustainable Practices', subtitle: 'Research and Education for Environmental Stewardship' },
  { id: '5', title: 'Central Chhattisgarh Location', subtitle: 'Excellent Connectivity & Vibrant University Life in Durg' },
  { id: '6', title: 'Hands-on Learning', subtitle: 'Practical Field Exposure and Experiential Education' },
  { id: '7', title: 'Empowering Rural Economy', subtitle: 'Research Focused on Farmers and Local Producers' },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % sliderData.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {/* Modern SVG Background Shape */}
        <View style={StyleSheet.absoluteFill}>
          <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#001168" stopOpacity="1" />
                <Stop offset="100%" stopColor="#0033cc" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Path 
              d="M0 0 H100 V100 Q75 85 50 100 Q25 115 0 100 Z" 
              fill="url(#grad)" 
            />
          </Svg>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={sliderData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.dotContainer}>
        {sliderData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index ? styles.activeDot : null]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 15,
  },
  cardContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: 160,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: '#001168',
  },
  textContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: '#FFD700', // Gold accent
    marginVertical: 10,
    borderRadius: 2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    height: 6,
    backgroundColor: '#001168',
    borderRadius: 3,
  },
});

export default Slider;









// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity, ImageBackground, } from 'react-native';
// import colors from '../../../common/config/colors';

// const { width } = Dimensions.get('window');

// const sliderData = [
//   {
//     id: '1',
//     title: 'MGUVV Durg: Pioneering Excellence',
//     subtitle: 'Mahatma Gandhi University of Horticulture and Forestry',
//     // image: require('../../../../assets/icons/mguvv_logo.jpg'), // Placeholder for MGUVV Durg logo/image
//   },
//   {
//     id: '2',
//     title: 'Focus on Horticulture & Forestry',
//     subtitle: 'Specialized Academic Programs for Green Careers',
//     // image: require('../../assets/icons/horticulture.png'),
//   },
//   {
//     id: '3',
//     title: 'Committed to Academic Excellence',
//     subtitle: 'Dedicated Faculty & State-of-the-Art Research Facilities',
//     // image: require('../../assets/icons/excellence.png'),
//   },
//   {
//     id: '4',
//     title: 'Promoting Sustainable Practices',
//     subtitle: 'Research and Education for Environmental Stewardship',
//     // image: require('../../assets/icons/sustainability.png'),
//   },
//   {
//     id: '5',
//     title: 'Central Chhattisgarh Location',
//     subtitle: 'Excellent Connectivity & Vibrant University Life in Durg',
//     // image: require('../../assets/icons/durg_campus.png'),
//   },
//   {
//     id: '6',
//     title: 'Hands-on Learning',
//     subtitle: 'Practical Field Exposure and Experiential Education',
//     // image: require('../../assets/icons/field_work.png'),
//   },
//   {
//     id: '7',
//     title: 'Empowering Rural Economy',
//     subtitle: 'Research Focused on Farmers and Local Producers',
//     // image: require('../../assets/icons/farmer_support.png'),
//   },
// ];

// const Slider = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef(null);
//   const onViewRef = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       setCurrentIndex(viewableItems[0].index);
//     }
//   });

//   const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
//   useEffect(() => {
//     const interval = setInterval(() => {
//       let nextIndex = currentIndex + 1;
//       if (nextIndex >= sliderData.length) {
//         nextIndex = 0;
//       }
//       flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
//       setCurrentIndex(nextIndex);
//     }, 5000); // 5 seconds

//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   const renderItem = ({ item }) => {
//     if (item.image) {
//       return (
//         <ImageBackground
//           source={item.image}
//           style={styles.card}
//           imageStyle={{ borderRadius: 20 }}
//           resizeMode="contain"
//         >
//           <View style={styles.overlay} />
//           <View style={styles.textContainer}>
//             <Text style={styles.title} numberOfLines={2}>
//               {item.title}
//             </Text>
//             <Text style={styles.subtitle} numberOfLines={2}>
//               {item.subtitle}
//             </Text>
//           </View>

//           {/* <TouchableOpacity style={styles.arrowButton}>
//             <Text style={styles.arrow}>→</Text>
//           </TouchableOpacity> */}

//         </ImageBackground>
//       );
//     } else {
//       return (
//         // <View style={[styles.card, { backgroundColor: '#001168db' }]}>
//         <View style={[styles.card, styles.userCard]}>
//           <View style={styles.textContainer}>
//             <Text style={styles.title} numberOfLines={2}>
//               {item.title}
//             </Text>
//             <Text style={styles.subtitle} numberOfLines={2}>
//               {item.subtitle}
//             </Text>
//           </View>

//           {/* <TouchableOpacity style={styles.arrowButton}>
//             <Text style={styles.arrow}>→</Text>
//           </TouchableOpacity> */}

//         </View>
//       );
//     }
//   };

//   return (
//     <View>
//       <FlatList
//         ref={flatListRef}
//         data={sliderData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         horizontal
//         // pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onViewableItemsChanged={onViewRef.current}
//         viewabilityConfig={viewConfigRef.current}
//       />

//       <View style={styles.dotContainer}>
//         {sliderData.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.dot,
//               currentIndex === index ? styles.activeDot : null,
//             ]}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#096800db',
//     width: width * 0.95,
//     borderRadius: 20,
//     marginHorizontal: 8,
//     marginTop: 1,
//     padding: width * 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: width * 0.40,
//     // minHeight: width * 0.15,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   userCard: {
//     backgroundColor: '#1a04503f',
//     padding: 10,
//     borderRadius: 15,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     // borderWidth: 5,
//     borderColor: 'green'
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     borderRadius: 20,
//   },
//   textContainer: {
//     flex: 1,
//     // marginTop:70,
//     paddingRight: 5,
//     zIndex: 2, // above overlay
//   },
//   title: {
//     color: colors.textPrimary,
//     fontSize: width * 0.045,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     color: colors.textPrimary,
//     marginTop: 5,
//     fontSize: width * 0.035,
//   },
//   arrowButton: {
//     position: 'absolute',
//     right: 20,
//     top: '50%',
//     transform: [{ translateY: -12 }],
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     zIndex: 2,
//   },
//   arrow: {
//     fontSize: 20,
//     color: '#002B34',
//     fontWeight: 'bold',
//   },
//   dotContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     // marginTop: 10,
//     // backgroundColor:colors.dangerD,
//     padding: 8,
//     marginLeft: 40,
//     marginRight: 40,
//     borderRadius: 5
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 6,
//     backgroundColor: '#e76949ff',
//     marginHorizontal: 5,
//   },
//   activeDot: {
//     width: 20,
//     backgroundColor: '#000',
//   },
// });

// export default Slider;

import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const sliderData = [
  {
    id: '0',
    title: 'MGUVV Durg',
    subtitle: 'Mahatma Gandhi Udyanikee Evam Vanikee Vishwavidyalaya, Durg',
    video: 'https://mguvv.ac.in/angular/assets/video/home_video.mp4',
  },
  {
    id: '1',
    title: 'MGUVV Durg: Pioneering Excellence',
    subtitle: 'Mahatma Gandhi University of Horticulture and Forestry',
    color: '#001168',
  },
];

// Default data if sliderData is empty
const defaultData = [
  {
    id: 'default',
    title: 'Welcome to MGUVV',
    subtitle: 'No current updates available at the moment.',
    color: '#4CAF50',
  }
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const dataToShow = sliderData.length > 0 ? sliderData : defaultData;

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= dataToShow.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, dataToShow.length]);

  const renderItem = ({ item }) => {
    const cardColor = item.color || '#001168';

    return (
      <View style={styles.card}>
        {/* SVG Background Layer */}
        <View style={StyleSheet.absoluteFill}>
          <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={cardColor} stopOpacity="1" />
                <Stop offset="100%" stopColor="#dfdfdfff" stopOpacity="0.8" />
              </LinearGradient>
            </Defs>
            {/* Abstract Background Shape */}
            <Path
              d="M0 0 L100 0 L100 100 Q75 80 50 100 Q25 120 0 100 Z"
              fill="url(#grad)"
            />
          </Svg>
        </View>

        {/* Video Layer (If exists) */}
        {item.video && (
          <>
            <Video
              source={{ uri: item.video }}
              style={styles.video}
              resizeMode="cover"
              repeat
              muted
              paused={false}
            />
            <View style={styles.overlay} />
          </>
        )}

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dataToShow}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.dotContainer}>
        {dataToShow.map((_, index) => (
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
  container: {
    marginVertical: 10,
  },
  card: {
    width: width * 0.94,
    height: width * 0.5,
    marginHorizontal: width * 0.03,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
    borderWidth:0.5,
    // elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textContainer: {
    padding: 20,
    zIndex: 2,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  subtitle: {
    color: '#e0e0e0',
    marginTop: 5,
    fontSize: 13,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 18,
    backgroundColor: '#001168',
  },
});

export default Slider;






// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity, ImageBackground, } from 'react-native';
// import Video from 'react-native-video';
// import colors from '../../../common/config/colors';

// const { width } = Dimensions.get('window');

// const sliderData = [
//   {
//     id: '0',
//     title: 'MGUVV Durg',
//     subtitle: 'Mahatma Gandhi Udyanikee Evam Vanikee Vishwavidyalaya, Durg',
//     video: 'https://mguvv.ac.in/angular/assets/video/home_video.mp4',
//     // color: '#001168db',
//   },
//   {
//     id: '1',
//     title: 'MGUVV Durg: Pioneering Excellence',
//     subtitle: 'Mahatma Gandhi University of Horticulture and Forestry',
//     // color: '#001168db',
//   },
//   // {
//   //   id: '2',
//   //   title: 'Focus on Horticulture & Forestry',
//   //   subtitle: 'Specialized Academic Programs for Green Careers',
//   //   // color: '#001168db',
//   // },
//   // {
//   //   id: '3',
//   //   title: 'Committed to Academic Excellence',
//   //   subtitle: 'Dedicated Faculty & State-of-the-Art Research Facilities',
//   //   // color: '#837211ff',
//   // },
//   // {
//   //   id: '4',
//   //   title: 'Promoting Sustainable Practices',
//   //   subtitle: 'Research and Education for Environmental Stewardship',
//   //   // color: '#128312ff',
//   // },
//   // {
//   //   id: '5',
//   //   title: 'Central Chhattisgarh Location',
//   //   subtitle: 'Excellent Connectivity & Vibrant University Life in Durg',
//   //   // color: '#8c2b1aff', // Tomato red for vibrancy
//   // },
//   // {
//   //   id: '6',
//   //   title: 'Hands-on Learning',
//   //   subtitle: 'Practical Field Exposure and Experiential Education',
//   //   // color: '#8A2BE2', // Blue violet for hands-on
//   // },
//   // {
//   //   id: '7',
//   //   title: 'Empowering Rural Economy',
//   //   subtitle: 'Research Focused on Farmers and Local Producers',
//   //   // color: '#DAA520', // Goldenrod for rural/economy
//   // },
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
//     const cardColor = item.color || '#6a9f66db';

//     if (item.video) {
//       return (
//         <View style={[styles.card, { backgroundColor: cardColor }]}>
//           <Video
//             source={{ uri: item.video }}
//             style={styles.video}
//             resizeMode="cover"
//             repeat
//             paused={false}
//           />
//           <View style={styles.overlay} />
//           <View style={styles.textContainer}>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.subtitle}>{item.subtitle}</Text>
//           </View>
//         </View>
//       );
//     }

//     // For non-video cards, use the dynamic color
//     return (
//       <View style={[styles.card, styles.userCard, { backgroundColor: cardColor }]}>
//         <View style={styles.textContainer}>
//           <Text style={styles.title}>{item.title}</Text>
//           <Text style={styles.subtitle}>{item.subtitle}</Text>
//         </View>
//       </View>
//     );
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
//         viewabilityConfig={viewConfigRef.current} />

//       <View style={[styles.cardDot,]}>
//         <View style={styles.dotContainer}>
//           {sliderData.map((_, index) => (
//             <View key={index}
//               style={[styles.dot, currentIndex === index ? styles.activeDot : null,]} />
//           ))}
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   video: {
//     width: width - 24,
//     height: width * 0.55,
//     borderRadius: 20,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 1,
//   },
//   card: {
//     width: width * 0.9,
//     borderRadius: 20,
//     height: width * 0.45,
//     marginHorizontal: 8,
//     marginTop: 1,
//     padding: width * 0.04,
//     flexDirection: 'row',
//     alignItems: 'center',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   userCard: {
//     padding: 20,
//     borderRadius: 15,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'green',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     borderRadius: 20,
//   },
//   textContainer: {
//     flex: 1,
//     marginTop: 90,
//     paddingRight: 5,
//     zIndex: 2,
//   },
//   title: {
//     color: '#fff',
//     fontSize: width * 0.045,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     color: '#d0d0d0',
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
//     color: '#342a00ff',
//     fontWeight: 'bold',
//   },
//   cardDot: {
//     // backgroundColor: colors.dangerD,
//     padding: 5,
//     borderRadius: 15,
//     // marginBottom: 10,
//     // flexDirection: 'row',
//     alignItems: 'center',
//     // // borderWidth: 5,
//     // borderColor: 'green'
//   },
//   dotContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#ccc',
//     marginHorizontal: 5,
//   },
//   activeDot: {
//     width: 20,
//     backgroundColor: '#000',
//   },
// });

// export default Slider;

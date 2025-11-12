import React, { useRef, useState, useEffect } from 'react';
import { View, Text,FlatList,Dimensions,StyleSheet,TouchableOpacity,ImageBackground,} from 'react-native';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

const sliderData = [
  // {
  //   id: '0',
  //   // title: 'IGKV',
  //   // subtitle: 'Indira Gandhi Krishi Vishwavidyalaya Krishak Nagar, Raipur',
  //   video: 'https://igkv.ac.in/images/AngWeb/Video/intro_Video.mp4',
  // },

  {
    id: '1',
    title: 'IGKV',
    subtitle: '2025 NIRF - Govt. of India',
    image: require('../../../../assets/icons/igkv.jpg'),
  },


  //     id: '1',
  //     title: 'RANKED IN AGRICULTURE AND ALLIED SECTORS',
  //     subtitle: '2025 NIRF - Govt. of India',
  //     image: require('../../assets/icons/igkv.jpg'),
  //   },
  // {
  //   id: '2',
  //   title: 'NAAC Accredited UniversityP',
  //   subtitle: 'Save monthly in Gold',
  //   // image: require('../../assets/icons/gold.png'),
  // },
  // {
  //   id: '3',
  //   title: 'NAAC Accredited University',
  //   subtitle: 'Committed to Academic Excellence',
  //   // image: require('../../assets/icons/certificate.png'),
  // },
  // {
  //   id: '4',
  //   title: 'ICAR Supported Programs',
  //   subtitle: 'Empowering Agricultural Innovation',
  //   // image: require('../../assets/icons/icar.png'),
  // },
  // {
  //   id: '5',
  //   title: 'Krishi Vigyan Kendras (KVKs)',
  //   subtitle: 'Bridging Research & Farming Communities',
  //   // image: require('../../assets/icons/farming.png'),
  // },
  // {
  //   id: '6',
  //   title: 'Student Innovations at IGKV',
  //   subtitle: 'Driving Agri-Tech Startups',
  //   // image: require('../../assets/icons/innovation.png'),
  // },
  // {
  //   id: '7',
  //   title: 'IGKV Raipur - Campus Life',
  //   subtitle: 'A Green Campus with Cutting-edge Labs',
  //   // image: require('../../assets/icons/campus.png'),
  // },


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
    if (item.image) {
      return (
        <ImageBackground
          source={item.image}
          style={styles.card}
          imageStyle={{ borderRadius: 20 }}
          resizeMode="contain">
          <View style={styles.overlay} />
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={2}>
              {item.subtitle}
            </Text>
          </View>

          {/* <TouchableOpacity style={styles.arrowButton}>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity> */}

        </ImageBackground>
      );
    } else {
      return (
        // <View style={[styles.card, { backgroundColor: '#001168db' }]}>
        <View style={[styles.card, styles.userCard ]}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={2}>
              {item.subtitle}
            </Text>
          </View>

          {/* <TouchableOpacity style={styles.arrowButton}>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity> */}
        </View>
      );
    }
  };


//  const renderItem = ({ item }) => {
//   if (item.video) {
//     return (
//       <View style={styles.card}>
//         <Video
//           source={{ uri: item.video }}
//           style={styles.video}
//           resizeMode="cover"
//           repeat
//           paused={false}
//           // controls={true}  // 👈 test playback
//           // onError={(err) => console.log('Video Error:', err)}
//           // onLoadStart={() =>console.log('Loading video...')}
//           // onLoad={() => console.log('Video loaded')}
//         />
//         <View style={styles.overlay} />
//         <View style={styles.textContainer}>
//           <Text style={styles.title}>{item.title}</Text>
//           <Text style={styles.subtitle}>{item.subtitle}</Text>
//         </View>
//       </View>
//     );
//   }

//   // fallback for other cases
//   return (
//     <View style={[styles.card, styles.userCard]}>
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.subtitle}>{item.subtitle}</Text>
//       </View>
//     </View>
//   );
// };




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
    backgroundColor: '#096800db',
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
    backgroundColor: 'rgba(0, 92, 95, 0.81)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'green'
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

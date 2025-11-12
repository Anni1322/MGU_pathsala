//  BirthdaySlider.js
import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Image,
  Alert
} from 'react-native';


// import AuthService from "../../../common/Services/AuthService";
// import alertService from "../../../common/Services/alert/AlertService";
import SessionService from "../../../common/Services/SessionService";

 
import getAdminApiList from '../../config/Api/adminApiList';
import { HttpService } from "../../../common/Services/HttpService";
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width - 90;

const BirthdaySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderData, setSliderData] = useState([]);
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const getProfileDetails = useCallback(async () => {
    try {
      const profileApi = getAdminApiList().getTodayBirhtList;
      if (!profileApi) throw new Error("Profile API endpoint not found.");
      const response = await HttpService.get(profileApi);
      const birthdayList = response?.data?.UserBirthDayList || [];
      setSliderData(birthdayList);
    } catch (error) {
      Alert.alert("Failed to Load Birthdays", error?.message || "Something went wrong");
      console.error("Birthday fetch error:", error);
    }
  }, []);

  useEffect(() => {
    getProfileDetails();
  }, []);

  useEffect(() => {
    if (!sliderData || sliderData.length === 0) return;

    intervalRef.current = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= sliderData.length) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [sliderData, currentIndex]);

  const renderItem = ({ item }) => {
    const fallbackImage = "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg";
    const imageUri = item?.PhotoString || fallbackImage;

    return (
      <View style={styles.cardWrapper}>
        {/* <ImageBackground
          source={{ uri: imageUri }}
          style={styles.card}
          imageStyle={styles.cardImage}
        > */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 1)', 'rgba(168, 230, 255, 0.38)']}
            style={styles.gradientOverlay}
          />
  

          <View style={styles.content}>
            <Image
              source={{ uri: imageUri }}
              style={styles.avatar}
            />
            <View style={styles.textBox}>
              <Text style={styles.name}>{item.name || "Unnamed User"}</Text>
              <Text style={styles.designation}>{item.designation || "No designation"}</Text>
            </View>
          </View>
        {/* </ImageBackground> */}
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={sliderData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
      <View style={styles.dotContainer}>
        {sliderData?.map((_, index) => (
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
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    height: CARD_WIDTH * 0.6,
    justifyContent: 'flex-end',
    borderRadius: 20,
  },
  cardImage: {
    borderRadius: 20,
    backgroundColor:'red'
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,

    backgroundColor: "#FFFFFF",
    marginHorizontal: 10,
    marginVertical: 4,
    padding: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 3,
    // borderLeftWidth: 4,
    // borderBottomWidth:5,
    // borderBottomColor: "#004738ff",
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    zIndex: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 16,
    backgroundColor: '#ccc',
  },
  textBox: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#720000ff',
    fontWeight: '470',
  },
  designation: {
    fontSize: 14,
    color: '#2e006bff',
    marginTop: 4,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bbb',
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeDot: {
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4081',
    opacity: 1,
  },
});

export default BirthdaySlider;


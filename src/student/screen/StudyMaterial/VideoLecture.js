import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';

// Get the screen dimensions for responsive video size
const { width } = Dimensions.get('window');

const VideoLecture = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // NOTE: Replace this URL with the actual link to your video file (.mp4, .mov, etc.)
  const videoUri = 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'; 
  
  if (error) {
    return (
      <LinearGradient colors={['#f9fafc', '#e0eafc']} style={styles.container}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Error Loading Video</Text>
          <Text style={styles.errorMessage}>
            Could not load the video lecture. Please check the URL or your network connection.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f9fafc', '#e0eafc']} style={styles.container}>
      <View style={styles.videoWrapper}>
        <Video
          source={{ uri: videoUri }} 
          style={styles.videoPlayer}
          resizeMode="contain" // Fit the video within its container
          controls={true} // Show standard play/pause, scrub bar
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            console.error('Video Error:', e);
            setError(true);
            setIsLoading(false);
          }}
          // Optional: Add a placeholder thumbnail image if needed
          // poster={'YOUR_THUMBNAIL_URL'}
        />

        {/* Display an Activity Indicator while the video is loading/buffering */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4c669f" />
            <Text style={styles.loadingText}>Loading Lecture...</Text>
          </View>
        )}
      </View>
      
      {/* Optional: Lecture details below the video */}
      <View style={styles.detailsContainer}>
        <Text style={styles.lectureTitle}>Lecture 1: Introduction to React Native</Text>
        <Text style={styles.lectureDescription}>
          This module covers the core concepts of mobile development using React Native.
        </Text>
      </View>
    </LinearGradient>
  );
};

export default VideoLecture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  videoWrapper: {
    width: width, // Full screen width
    height: width * (9 / 16), // A common 16:9 aspect ratio
    backgroundColor: '#000', // Black background for the video area
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  videoPlayer: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#4c669f',
  },
  detailsContainer: {
    width: '90%',
    padding: 10,
  },
  lectureTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  lectureDescription: {
    fontSize: 16,
    color: '#666',
  },
  errorCard: {
    backgroundColor: '#fee',
    borderColor: '#f00',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c00',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 15,
    color: '#800',
    textAlign: 'center',
  }
});



// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
// import Video from 'react-native-video';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// const VideoLecture = () => {
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   const videoLectures = [
//     {
//       id: '1',
//       title: 'Introduction to Agricultural Science',
//       description: 'A comprehensive overview of agricultural science, its importance, and applications.',
//       instructor: 'Dr. John Doe',
//       duration: '30 mins',
//       videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
//     },
//     {
//       id: '2',
//       title: 'Advanced Crop Protection Techniques',
//       description: 'Learn about advanced techniques for pest control and crop protection.',
//       instructor: 'Dr. Sarah Smith',
//       duration: '45 mins',
//       videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
//     },
//   ];

//   const handlePlayPauseVideo = () => {
//     setIsVideoPlaying(false);
//     setSelectedVideo(null);
//   };

//   const handleVideoPress = (videoUrl) => {
//     setSelectedVideo(videoUrl);
//     setIsVideoPlaying(true);
//   };

//   const renderVideoCard = ({ item }) => (
//     <View style={styles.videoCard}>
//       <Image source={require('../../../assets/icons/videoo.png')} style={styles.videoThumbnail} />
//       <View style={styles.videoDetails}>
//         <Text style={styles.videoTitle}>{item.title}</Text>
//         <Text style={styles.videoInstructor}>Instructor: {item.instructor}</Text>
//         <Text style={styles.videoDuration}>Duration: {item.duration}</Text>
//         <Text style={styles.videoDescription}>{item.description}</Text>
//         <TouchableOpacity
//           style={styles.playButton}
//           onPress={() => handleVideoPress(item.videoUrl)}>
//           <FontAwesome6 name="play" size={20} color="#fff" />
//           <Text style={styles.playButtonText}>Play</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Main List */}
//       <FlatList
//         data={videoLectures}
//         renderItem={renderVideoCard}
//         keyExtractor={(item) => item.id}
//         ListHeaderComponent={
//           <View style={styles.header}>
//             <Image
//               style={styles.logo}
//               source={require('../../../assets/home.png')}
//             />
//             <Text style={styles.title}>IGKV Raipur - Agriculture</Text>
//             <Text style={styles.subtitle}>Video Lectures</Text>
//           </View>
//         }
//         ListFooterComponent={
//           <View style={styles.footer}>
//             <TouchableOpacity style={styles.notificationButton}>
//               <EvilIcons name="bell" size={30} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         }
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />

//       {/* Fullscreen Video Player */}
//       {isVideoPlaying && selectedVideo && (
//         <View style={styles.videoPlayerSection}>
//           <Video
//             source={{ uri: selectedVideo }}
//             style={styles.videoPlayer}
//             controls={true}
//             paused={!isVideoPlaying}
//             resizeMode="contain"
//             onEnd={handlePlayPauseVideo}
//           />
//           <TouchableOpacity style={styles.closeButton} onPress={handlePlayPauseVideo}>
//             <EvilIcons name="close" size={30} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f4f4',
//     paddingHorizontal: 16,
//   },
//   header: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   logo: {
//     width: 60,
//     height: 60,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#005822ff',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#555',
//   },
//   videoCard: {
//     backgroundColor: '#fff',
//     padding: 15,
//     marginBottom: 15,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   videoThumbnail: {
//     width: '100%',
//     height: 180,
//     borderRadius: 8,
//   },
//   videoDetails: {
//     marginTop: 10,
//   },
//   videoTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   videoInstructor: {
//     fontSize: 14,
//     color: '#555',
//     marginTop: 5,
//   },
//   videoDuration: {
//     fontSize: 14,
//     color: '#555',
//     marginTop: 5,
//   },
//   videoDescription: {
//     fontSize: 14,
//     color: '#777',
//     marginTop: 10,
//   },
//   playButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#005822ff',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   playButtonText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontSize: 16,
//   },
//   videoPlayerSection: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoPlayer: {
//     width: '100%',
//     height: '100%',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     backgroundColor: '#005822ff',
//     borderRadius: 50,
//     padding: 10,
//   },
//   footer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 40,
//   },
//   notificationButton: {
//     backgroundColor: '#005822ff',
//     borderRadius: 50,
//     padding: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default VideoLecture;

















// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// const Card = ({ title, subtitle, time, color, status, statusColor }) => (
//   <View style={[styles.card, { borderTopColor: color }]}>
//     <View style={styles.cardContent}>
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.subtitle}>{subtitle}</Text>
//       <Text style={[styles.time, { color }]}>{time}</Text>
//       <View style={[styles.statusTag, { backgroundColor: statusColor }]}>
//         <Text style={styles.statusText}>{status}</Text>
//       </View>
//     </View>
//   </View>
// );

// const VideoLecture = () => {
//   return (
//     <LinearGradient colors={['#9b59b6', '#e74c3c']} style={styles.header}>
//       <Text style={styles.headerText}>eHRMS</Text>
//       <ScrollView style={styles.container}>
//         <Card
//           title="Check In"
//           subtitle="Today's arrival time"
//           time="09:30 AM"
//           color="#27ae60"
//           status="On Time"
//           statusColor="#d4efdf"
//         />
//         <Card
//           title="Check Out"
//           subtitle="Expected departure"
//           time="06:30 PM"
//           color="#e74c3c"
//           status="Pending"
//           statusColor="#f9e79f"
//         />
//         <Card
//           title="Duration"
//           subtitle="Time worked today"
//           time="2h 45m"
//           color="#3498db"
//           status="Active"
//           statusColor="#d6eaf8"
//         />
//         <Card
//           title="Status"
//           subtitle="Current work status"
//           time="Active"
//           color="#f1c40f"
//           status="Available"
//           statusColor="#fcf3cf"
//         />
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     paddingTop: 50,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   container: {
//     backgroundColor: '#f4f6f7',
//     paddingHorizontal: 10,
//     paddingTop: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 5,
//     borderTopWidth: 4,
//   },
//   cardContent: {
//     alignItems: 'flex-start',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 12,
//     color: '#7f8c8d',
//     marginBottom: 10,
//   },
//   time: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   statusTag: {
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 20,
//   },
//   statusText: {
//     fontSize: 12,
//     color: '#34495e',
//   },
// });

// export default VideoLecture;








// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// const VideoLecture = () => {
//   return (
//     <LinearGradient colors={['#e2d1ffff', '#f991ff55']} style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.iconBox}>
//             <Text style={styles.iconDiamond}>💎</Text>
//           </View>
//           <Text style={styles.headerText}>eHRMS</Text>
//         </View>

//         {/* User Card */}
//         <View style={styles.userCard}>
//           <FontAwesome6 name="user-circle" size={30} color="#fff" solid />
//           <Text style={styles.userName}>PREMLATA CHANDEL</Text>
//         </View>

//         {/* Dashboard Card */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>MAIN DASHBOARD</Text>
//           <View style={styles.dashboardRow}>
//             <FontAwesome6 name="chart-line" size={26} color="#6e4bd8" solid />
//             <View style={styles.dashboardText}>
//               <Text style={styles.dashboardTitle}>Dashboard</Text>
//               <Text style={styles.dashboardSub}>Overview & Analytics</Text>
//             </View>
//             <View style={styles.liveBadge}>
//               <Text style={styles.liveText}>Live</Text>
//             </View>
//           </View>
//         </View>

//         {/* Logout Button */}
//         <TouchableOpacity style={styles.logoutCard}>
//           <FontAwesome6 name="right-from-bracket" size={24} color="#fff" solid />
//           <View style={{ marginLeft: 10 }}>
//             <Text style={styles.logoutText}>Secure Logout</Text>
//             <Text style={styles.logoutSub}>Sign out safely</Text>
//           </View>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeArea: {
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   iconBox: {
//     backgroundColor: '#ff9a2d',
//     padding: 10,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   iconDiamond: {
//     fontSize: 20,
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   userCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     padding: 20,
//     borderRadius: 15,
//     marginBottom: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor:'white'
//   },
//   userName: {
//     color: '#fff',
//     fontSize: 16,
//     marginLeft: 10,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 20,
//     marginBottom: 20,
//   },
//   cardTitle: {
//     color: '#444',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   dashboardRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   dashboardText: {
//     flex: 1,
//     marginLeft: 15,
//   },
//   dashboardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   dashboardSub: {
//     color: '#888',
//     fontSize: 12,
//   },
//   liveBadge: {
//     backgroundColor: '#884DFF',
//     borderRadius: 10,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//   },
//   liveText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   logoutCard: {
//     backgroundColor: '#f95f5f',
//     borderRadius: 15,
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logoutText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   logoutSub: {
//     color: '#fcecec',
//     fontSize: 12,
//   },
// });

// export default VideoLecture;




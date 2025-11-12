let API_KEY = "AIzaSyAKKLiYZtIxqQKQDAtynBP1hhA8SDx5Gn4";

// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
// import Video from 'react-native-video';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from '../../common/Services/HttpService';




// let CHANNEL_ID = "UCiBxC_RxHDpz0VWmVdDujDg";

// let YOU_TUBE_URL = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + CHANNEL_ID + "&part=snippet,id&order=date&maxResults=10&key=" + API_KEY;

// let YOU_TUBE_PLAY_LIST_Search_URL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" + "raipur" + "&type=video&key=" + API_KEY;


// console.log("YOU_TUBE_URL", YOU_TUBE_URL)

// const MyVideoLecture = () => {
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [filterText, setFilterText] = useState(''); 
//     const [loading, setLoading] = useState(true);
// let watch_video = "https://www.youtube.com/watch?v=wRLibkDec6E"
//   const videoLectures = [
//     {
//       id: '1',
//       title: 'Introduction to Agricultural Science',
//       description: 'A comprehensive overview of agricultural science, its importance, and applications.',
//       instructor: 'Dr. John Doe',
//       duration: '30 mins',
//       videoUrl:  "https://www.youtube.com/watch?v=wRLibkDec6E",
//     },


//     // Add more video lectures as needed
//   ];




//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const sessionData = await SessionService.getSession();
//         const profile = sessionData?.LoginDetail?.[0];
//         // setParams(sessionData);
//       } catch (error) {
//         console.error('Error loading initial data:', error);
//         Alert.alert('Error', 'Failed to load initial data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//     getCourseWiseStudentList();

//   }, []);

//   const getCourseWiseStudentList = useCallback(async (data) => {

//     try {
//        console.log("ok")
//       const response = await HttpService.get(YOU_TUBE_URL);
//       const Videolist = response?.data.items || [];
//       console.log(Videolist,"Videolist");
//       // Update cache and state
//       // setStudentCache((prevCache) => ({ ...prevCache, [selectedCourseId]: Videolist }));
//       // setStudents(Videolist);
//     } catch (error) {
//       Alert.alert('Failed to Load', error?.message || 'Something went wrong');
//       console.error('Student List fetch error:', error);
//     } finally {
//       setStudentLoading(false);
//     }
//   }, []);





//   // Filter function to filter video lectures by title or instructor
//   const filteredLectures = videoLectures.filter((video) =>
//     video.title.toLowerCase().includes(filterText.toLowerCase()) ||
//     video.instructor.toLowerCase().includes(filterText.toLowerCase())
//   );

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
//       {/* Header Section */}
//       <View style={styles.header}>
//         <Image style={styles.logo} source={require('../../../assets/home.png')} />
//         <Text style={styles.title}>IGKV Raipur - Agriculture</Text>
//         <Text style={styles.subtitle}>Video Lectures</Text>
//       </View>

//       {/* Filter Section */}
//       <View style={styles.filterSection}>
//         <TextInput
//           style={styles.filterInput}
//           placeholder="Search by Title or Instructor"
//           value={filterText}
//           onChangeText={(text) => setFilterText(text)}
//         />
//       </View>

//       {/* Video List */}
//       <FlatList
//         data={filteredLectures}
//         renderItem={renderVideoCard}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />

//       {/* Upload Button */}
//       <TouchableOpacity style={styles.uploadButton}>
//         <Text style={styles.uploadButtonText}>Upload</Text>
//       </TouchableOpacity>

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

// export default MyVideoLecture;

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
//   filterSection: {
//     marginVertical: 10,
//   },
//   filterInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     fontSize: 16,
//     backgroundColor: '#fff',
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
//   uploadButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: '#005822ff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   uploadButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });





















// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
// import YoutubePlayer from 'react-native-youtube-iframe';  // For YouTube playback
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from '../../common/Services/HttpService';


// let CHANNEL_ID = "UCiBxC_RxHDpz0VWmVdDujDg";
// let UPLOADS_PLAYLIST_ID = "UU" + CHANNEL_ID.slice(2);   
// let PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`;

// console.log("PLAYLIST_URL", PLAYLIST_URL);

// const MyVideoLecture = () => {
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);   
//   const [filterText, setFilterText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [videoLectures, setVideoLectures] = useState([]);   
//   const [studentLoading, setStudentLoading] = useState(false);
//   const [nextPageToken, setNextPageToken] = useState(null);   
//   const [videoLoading, setVideoLoading] = useState(false);  

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const sessionData = await SessionService.getSession();
//         const profile = sessionData?.LoginDetail?.[0];
//         // setParams(sessionData);
//       } catch (error) {
//         console.error('Error loading initial data:', error);
//         Alert.alert('Error', 'Failed to load initial data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//     fetchChannelVideos();
//   }, []);

//   const fetchChannelVideos = useCallback(async (pageToken = null) => {
//     setStudentLoading(true);
//     try {
//       console.log("Fetching channel videos...");
//       const url = pageToken ? `${PLAYLIST_URL}&pageToken=${pageToken}` : PLAYLIST_URL;
//       const response = await HttpService.get(url);
//       const Videolist = response?.data.items || [];
//       console.log(Videolist, "Videolist");

//       const mappedVideos = Videolist.map(item => ({
//         id: item.snippet.resourceId.videoId,
//         title: item.snippet.title,
//         description: item.snippet.description,
//         instructor: item.snippet.channelTitle,
//         duration: 'Unknown',
//         videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
//         thumbnail: item.snippet.thumbnails.medium.url,
//       }));

//       setVideoLectures(prev => pageToken ? [...prev, ...mappedVideos] : mappedVideos);
//       setNextPageToken(response?.data.nextPageToken || null);
//     } catch (error) {
//       Alert.alert('Failed to Load Videos', error?.message || 'Something went wrong');
//       console.error('Video fetch error:', error);
//     } finally {
//       setStudentLoading(false);
//     }
//   }, []);

//   const filteredLectures = videoLectures.filter((video) =>
//     video.title.toLowerCase().includes(filterText.toLowerCase()) ||
//     video.instructor.toLowerCase().includes(filterText.toLowerCase())
//   );

//   const handlePlayPauseVideo = () => {
//     setIsVideoPlaying(false);
//     setSelectedVideo(null);
//     setVideoLoading(false);  // Reset loading on close
//   };

//   const handleVideoPress = (videoUrl) => {
//     const videoId = videoUrl.split('v=')[1]?.split('&')[0];
//     console.log('Video URL:', videoUrl, 'Extracted ID:', videoId);  // Debug log
//     if (videoId) {
//       setSelectedVideo(videoId);
//       setIsVideoPlaying(true);
//       setVideoLoading(true);  // Start loading when opening player
//     } else {
//       Alert.alert('Error', 'Invalid video URL');
//     }
//   };

//   const loadMoreVideos = () => {
//     if (nextPageToken) {
//       fetchChannelVideos(nextPageToken);
//     }
//   };

//   const renderVideoCard = ({ item }) => (
//     <View style={styles.videoCard}>
//       <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
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

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#007bff" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <Image style={styles.logo} source={require('../../../assets/home.png')} />
//         {/* <Text style={styles.title}>IGKV Raipur - Agriculture</Text> */}
//         <Text style={styles.subtitle}>Video Lectures</Text>
//       </View>

//       {/* Filter Section */}
//       <View style={styles.filterSection}>
//         <TextInput
//           style={styles.filterInput}
//           placeholder="Search by Title or Instructor"
//           value={filterText}
//           onChangeText={(text) => setFilterText(text)}
//         />
//       </View>

//       {/* Video List */}
//       <FlatList
//         data={filteredLectures}
//         renderItem={renderVideoCard}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         onEndReached={loadMoreVideos}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={studentLoading ? <ActivityIndicator size="small" color="#007bff" /> : null}
//       />

//       {/* Upload Button */}
//       <TouchableOpacity style={styles.uploadButton}>
//         <Text style={styles.uploadButtonText}>Upload</Text>
//       </TouchableOpacity>

//       {/* Fullscreen Video Player */}
//       {isVideoPlaying && selectedVideo && (
//         <View style={styles.videoPlayerSection}>
//           <YoutubePlayer
//             height={300}
//             play={isVideoPlaying}
//             videoId={selectedVideo}
//             onReady={() => { console.log('Player Ready'); setVideoLoading(false); }}
//             onChangeState={(state) => {
//               console.log('Player State:', state);  // Debug log
//               if (state === 'buffering') setVideoLoading(true);
//               else if (state === 'playing') setVideoLoading(false);
//               if (state === 'ended') handlePlayPauseVideo();
//             }}
//             onError={(error) => { console.log('Player Error:', error); Alert.alert('Video Error', error); }}
//           />
//           {/* Loading Overlay */}
//           {videoLoading && (
//             <View style={styles.loadingOverlay}>
//               <ActivityIndicator size="large" color="#fff" />
//               <Text style={styles.loadingText}>Loading video...</Text>
//             </View>
//           )}
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
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   logo: {
//     width: 50,
//     height: 50,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//   },
//   filterSection: {
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   filterInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//   },
//   videoCard: {
//     flexDirection: 'row',
//     padding: 10,
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     elevation: 2,
//   },
//   videoThumbnail: {
//     width: 100,
//     height: 100,
//     borderRadius: 5,
//   },
//   videoDetails: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   videoTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   videoInstructor: {
//     fontSize: 14,
//     color: '#666',
//   },
//   videoDuration: {
//     fontSize: 12,
//     color: '#999',
//   },
//   videoDescription: {
//     fontSize: 12,
//     marginVertical: 5,
//   },
//   playButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   playButtonText: {
//     color: '#fff',
//     marginLeft: 5,
//   },
//   uploadButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: '#28a745',
//     padding: 15,
//     borderRadius: 50,
//   },
//   uploadButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
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
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Semi-transparent overlay
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   loadingText: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 10,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     zIndex: 2,
//   },
// });

// export default MyVideoLecture;













// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
// import YoutubePlayer, { STATE } from 'react-native-youtube-iframe'; 
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from '../../common/Services/HttpService';


// let CHANNEL_ID = "UCiBxC_RxHDpz0VWmVdDujDg";
// let UPLOADS_PLAYLIST_ID = "UU" + CHANNEL_ID.slice(2);
// let PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`;

// console.log("PLAYLIST_URL", PLAYLIST_URL);

// const MyVideoLecture = () => {
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [filterText, setFilterText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [videoLectures, setVideoLectures] = useState([]);
//   const [studentLoading, setStudentLoading] = useState(false);
//   const [nextPageToken, setNextPageToken] = useState(null);
//   const [videoLoading, setVideoLoading] = useState(false);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const sessionData = await SessionService.getSession();
//         const profile = sessionData?.LoginDetail?.[0];
//       } catch (error) {
//         console.error('Error loading initial data:', error);
//         Alert.alert('Error', 'Failed to load initial data.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//     fetchChannelVideos();
//   }, []);

//   const fetchChannelVideos = useCallback(async (pageToken = null) => {
//     setStudentLoading(true);
//     try {
//       console.log("Fetching channel videos...");
//       const url = pageToken ? `${PLAYLIST_URL}&pageToken=${pageToken}` : PLAYLIST_URL;
//       const response = await HttpService.get(url);
//       const Videolist = response?.data.items || [];
//       console.log(Videolist, "Videolist");

//       const mappedVideos = Videolist.map(item => ({
//         id: item.snippet.resourceId.videoId,
//         title: item.snippet.title,
//         description: item.snippet.description,
//         instructor: item.snippet.channelTitle,
//         duration: 'Unknown',
//         videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
//         thumbnail: item.snippet.thumbnails.medium.url,
//       }));

//       setVideoLectures(prev => pageToken ? [...prev, ...mappedVideos] : mappedVideos);
//       setNextPageToken(response?.data.nextPageToken || null);
//     } catch (error) {
//       Alert.alert('Failed to Load Videos', error?.message || 'Something went wrong');
//       console.error('Video fetch error:', error);
//     } finally {
//       setStudentLoading(false);
//     }
//   }, []);

//   const filteredLectures = videoLectures.filter((video) =>
//     video.title.toLowerCase().includes(filterText.toLowerCase()) ||
//     video.instructor.toLowerCase().includes(filterText.toLowerCase())
//   );

//   const handlePlayPauseVideo = () => {
//     setIsVideoPlaying(false);
//     setSelectedVideo(null);
//     setVideoLoading(false);
//   };

//   const handleVideoPress = (videoUrl) => {
//     const videoId = videoUrl.split('v=')[1]?.split('&')[0];
//     console.log('Video URL:', videoUrl, 'Extracted ID:', videoId);
//     if (videoId) {
//       setSelectedVideo(videoId);
//       setIsVideoPlaying(true);
//       setVideoLoading(true);
//     } else {
//       Alert.alert('Error', 'Invalid video URL');
//     }
//   };

//   const loadMoreVideos = () => {
//     if (nextPageToken) {
//       fetchChannelVideos(nextPageToken);
//     }
//   };

//   const renderVideoCard = ({ item }) => (
//     <View style={styles.videoCard}>
//       <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
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

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#007bff" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <Image style={styles.logo} source={require('../../../assets/home.png')} />
//         <Text style={styles.title}>IGKV Raipur - Agriculture</Text>
//         <Text style={styles.subtitle}>Video Lectures</Text>
//       </View>

//       {/* Filter Section */}
//       <View style={styles.filterSection}>
//         <TextInput
//           style={styles.filterInput}
//           placeholder="Search by Title or Instructor"
//           value={filterText}
//           onChangeText={(text) => setFilterText(text)}
//         />
//       </View>

//       {/* Video List */}
//       <FlatList
//         data={filteredLectures}
//         renderItem={renderVideoCard}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         onEndReached={loadMoreVideos}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={studentLoading ? <ActivityIndicator size="small" color="#007bff" /> : null}
//       />

//       {/* Upload Button */}
//       <TouchableOpacity style={styles.uploadButton}>
//         <Text style={styles.uploadButtonText}>Upload</Text>
//       </TouchableOpacity>

//       {/* Fullscreen Video Player - Updated with react-native-youtube */}
//       {isVideoPlaying && selectedVideo && (
//         <View style={styles.videoPlayerSection}>
//           <YouTube
//             videoId={selectedVideo}
//             play={isVideoPlaying}
//             fullscreen={true}
//             loop={false}
//             onReady={() => { console.log('Player Ready'); setVideoLoading(false); }}
//             onChangeState={(e) => {
//               console.log('Player State:', e.state);
//               if (e.state === 'buffering') setVideoLoading(true);
//               else if (e.state === 'playing') setVideoLoading(false);
//               if (e.state === 'ended') handlePlayPauseVideo();
//             }}
//             onError={(e) => { console.log('Player Error:', e.error); Alert.alert('Video Error', e.error); }}
//             // Note: Removed style={styles.videoPlayer} as it's not supported by react-native-youtube
//           />
//           {videoLoading && (
//             <View style={styles.loadingOverlay}>
//               <ActivityIndicator size="large" color="#fff" />
//               <Text style={styles.loadingText}>Loading video...</Text>
//             </View>
//           )}
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
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   logo: {
//     width: 50,
//     height: 50,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//   },
//   filterSection: {
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   filterInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//   },
//   videoCard: {
//     flexDirection: 'row',
//     padding: 10,
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     elevation: 2,
//   },
//   videoThumbnail: {
//     width: 100,
//     height: 100,
//     borderRadius: 5,
//   },
//   videoDetails: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   videoTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   videoInstructor: {
//     fontSize: 14,
//     color: '#666',
//   },
//   videoDuration: {
//     fontSize: 12,
//     color: '#999',
//   },
//   videoDescription: {
//     fontSize: 12,
//     marginVertical: 5,
//   },
//   playButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   playButtonText: {
//     color: '#fff',
//     marginLeft: 5,
//   },
//   uploadButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: '#28a745',
//     padding: 15,
//     borderRadius: 50,
//   },
//   uploadButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
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
//   // Removed: videoPlayer style, as it's not used anymore
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Semi-transparent overlay
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   loadingText: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 10,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     zIndex: 2,
//   },
// });

// export default MyVideoLecture;














// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
// import YoutubePlayer, { STATE } from 'react-native-youtube-iframe';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from '../../common/Services/HttpService';

// const CHANNEL_ID = "UCiBxC_RxHDpz0VWmVdDujDg";
// const UPLOADS_PLAYLIST_ID = "UU" + CHANNEL_ID.slice(2);

// const PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`;

// const MyVideoLecture = () => {
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [filterText, setFilterText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [videoLectures, setVideoLectures] = useState([]);
//   const [paginationLoading, setPaginationLoading] = useState(false);  // Renamed for clarity
//   const [nextPageToken, setNextPageToken] = useState(null);
//   const [videoLoading, setVideoLoading] = useState(false);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const sessionData = await SessionService.getSession();
//         const profile = sessionData?.LoginDetail?.[0];
//         // setParams(sessionData);
//       } catch (error) {
//         console.error('Error loading initial data:', error);
//         Alert.alert('Error', 'Failed to load initial data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//     fetchChannelVideos();
//   }, []);

//   const fetchChannelVideos = useCallback(async (pageToken = null) => {
//     setPaginationLoading(true);
//     try {
//       const url = pageToken ? `${PLAYLIST_URL}&pageToken=${pageToken}` : PLAYLIST_URL;
//       const response = await HttpService.get(url);
//       if (!response?.data?.items) {
//         throw new Error('Invalid API response');
//       }

//       const Videolist = response.data.items;
//       if (Videolist && Videolist.length > 0) {
//         Videolist.forEach((item) => {
//           // console.log(item.snippet.resourceId.videoId, "item");
//           const videoId = item.snippet.resourceId.videoId;   
//           if (videoId) {
//             // console.log(`Found videoId: ${videoId}`);
//           }
//         });
//       } else {
//         // console.log("No videos found in the response.");
//       }

//       const mappedVideos = Videolist?.map(item => {
//         const videoId = item.snippet.resourceId.videoId;  // FIXED: Correct path to videoId
//         return {
//           id: videoId,
//           title: item.snippet.title,
//           description: item.snippet.description,
//           instructor: item.snippet.channelTitle,
//           duration: 'Unknown',
//           videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
//           thumbnail: item.snippet.thumbnails.medium.url,
//         };
//       });

//       setVideoLectures(prev => pageToken ? [...prev, ...mappedVideos] : mappedVideos);
//       setNextPageToken(response.data.nextPageToken || null);
//     } catch (error) {
//       Alert.alert('Failed to Load Videos', error?.message || 'Something went wrong');
//       console.error('Video fetch error:', error);
//     } finally {
//       setPaginationLoading(false);
//     }
//   }, []);

//   const filteredLectures = videoLectures.filter((video) =>
//     video.title.toLowerCase().includes(filterText.toLowerCase()) ||
//     video.instructor.toLowerCase().includes(filterText.toLowerCase())
//   );

//   const handlePlayPauseVideo = () => {
//     setIsVideoPlaying(false);
//     setSelectedVideo(null);
//     setVideoLoading(false);
//   };

//   const handleVideoPress = (videoUrl) => {
//     const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
//     if (videoId) {
//       setSelectedVideo(videoId);
//       setIsVideoPlaying(true);
//       setVideoLoading(true);
//     } else {
//       Alert.alert('Error', 'Invalid video URL');
//     }
//   };

//   const loadMoreVideos = () => {
//     if (nextPageToken && !paginationLoading) {
//       fetchChannelVideos(nextPageToken);
//     }
//   };

//   const renderVideoCard = ({ item }) => (
//     <View style={styles.videoCard}>
//       <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
//       <View style={styles.videoDetails}>
//         <Text style={styles.videoTitle}>{item.title}</Text>
//         <Text style={styles.videoInstructor}>Instructor: {item.instructor}</Text>
//         <Text style={styles.videoDuration}>Duration: {item.duration}</Text>
//         <Text style={styles.videoDescription} numberOfLines={2}>{item.description}</Text>
//         <TouchableOpacity style={styles.playButton} onPress={() => handleVideoPress(item.videoUrl)}>
//           <FontAwesome6 name="play" size={20} color="#fff" />
//           <Text style={styles.playButtonText}>Play</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#007bff" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <Image style={styles.logo} source={require('../../../assets/home.png')} />
//         <Text style={styles.subtitle}>Video Lectures</Text>
//       </View>

//       {/* Filter Section */}
//       <View style={styles.filterSection}>
//         <TextInput
//           style={styles.filterInput}
//           placeholder="Search by Title or Instructor"
//           value={filterText}
//           onChangeText={setFilterText}
//         />
//       </View>

//       {/* Video List */}
//       <FlatList
//         data={filteredLectures}
//         renderItem={renderVideoCard}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         onEndReached={loadMoreVideos}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={paginationLoading ? <ActivityIndicator size="small" color="#007bff" /> : null}
//       />

//       {/* Upload Button */}
//       <TouchableOpacity style={styles.uploadButton}>
//         <Text style={styles.uploadButtonText}>Upload</Text>
//       </TouchableOpacity>

//       {/* Fullscreen Video Player */}
//       {isVideoPlaying && selectedVideo && (
//         <View style={styles.videoPlayerSection}>
//           <YoutubePlayer
//             height={Dimensions.get('window').height * 0.4}  // Responsive height
//             play={isVideoPlaying}
//             videoId={selectedVideo}
//             onReady={() => { setVideoLoading(false); }}
//             onChangeState={(state) => {
//               if (state === STATE.BUFFERING) setVideoLoading(true);
//               else if (state === STATE.PLAYING) setVideoLoading(false);
//               if (state === STATE.ENDED) handlePlayPauseVideo();
//             }}
//             onError={(error) => Alert.alert('Video Error', error)}
//           />
//           {videoLoading && (
//             <View style={styles.loadingOverlay}>
//               <ActivityIndicator size="large" color="#fff" />
//               <Text style={styles.loadingText}>Loading video...</Text>
//             </View>
//           )}
//           <TouchableOpacity style={styles.closeButton} onPress={handlePlayPauseVideo}>
//             <EvilIcons name="close" size={30} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// // Add your StyleSheet here (example basics)
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   header: { alignItems: 'center', padding: 10 },
//   logo: { width: 50, height: 50 },
//   subtitle: { fontSize: 18, fontWeight: 'bold' },
//   filterSection: { padding: 10 },
//   filterInput: { borderWidth: 1, padding: 10, borderRadius: 5 },
//   videoCard: { flexDirection: 'row', padding: 10, borderBottomWidth: 1 },
//   videoThumbnail: { width: 100, height: 60 },
//   videoDetails: { flex: 1, marginLeft: 10 },
//   videoTitle: { fontWeight: 'bold' },
//   playButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
//   playButtonText: { color: '#fff', marginLeft: 5 },
//   uploadButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#28a745', padding: 15, borderRadius: 50 },
//   uploadButtonText: { color: '#fff' },
//   videoPlayerSection: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
//   loadingOverlay: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
//   loadingText: { color: '#fff', marginTop: 10 },
//   closeButton: { position: 'absolute', top: 20, right: 20 },
// });

// export default MyVideoLecture;












// paly in brwoser

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  Linking // 🚨 NEW: Import Linking for external playback
} from 'react-native';
// ⚠️ We will not use YoutubePlayer for the reliable solution, but we keep the import if you want to switch back later
// import YoutubePlayer, { STATE } from 'react-native-youtube-iframe'; 
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// --- Mock/Placeholder Imports ---
const HttpService = {
  get: async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} (Check your API_KEY and Network)`);
    }
    const data = await response.json();
    return { data };
  },
};

const SessionService = {
  getSession: async () => ({
    LoginDetail: [{
      name: "Mock User"
    }]
  })
}
// -------------------------------



const CHANNEL_ID = "UCiBxC_RxHDpz0VWmVdDujDg"; // Example YouTube Channel ID
// -------------------------------

const UPLOADS_PLAYLIST_ID = "UU" + CHANNEL_ID.slice(2);
const PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`;
const screenHeight = Dimensions.get('window').height;

const MyVideoLecture = () => {
  // 🚨 We keep the state but will not use the embedded player logic for the reliable fix
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(true);
  const [videoLectures, setVideoLectures] = useState([]);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await SessionService.getSession();
      } catch (error) {
        console.error('Error loading initial data:', error);
        Alert.alert('Error', 'Failed to load initial data.');
      }
    };

    fetchInitialData();
    fetchChannelVideos();
  }, []);

  const fetchChannelVideos = useCallback(async (pageToken = null) => {
    setPaginationLoading(true);
    try {
      const url = pageToken ? `${PLAYLIST_URL}&pageToken=${pageToken}` : PLAYLIST_URL;
      const response = await HttpService.get(url);

      if (!response?.data?.items) {
        throw new Error('Invalid API response or no items found.');
      }

      const Videolist = response.data.items;

      const mappedVideos = Videolist?.map(item => {
        const videoId = item.snippet.resourceId.videoId;
        return {
          id: videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          instructor: item.snippet.channelTitle,
          duration: 'Unknown',
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: item.snippet.thumbnails.medium.url,
        };
      }).filter(video => video.id);

      setVideoLectures(prev => pageToken ? [...prev, ...mappedVideos] : mappedVideos);
      setNextPageToken(response.data.nextPageToken || null);

      if (!pageToken) setLoading(false);

    } catch (error) {
      Alert.alert('Failed to Load Videos', error?.message || 'Check your API Key and Network Connection.');
      console.error('Video fetch error:', error);
      if (!pageToken) setLoading(false);
    } finally {
      setPaginationLoading(false);
    }
  }, []);

  const filteredLectures = videoLectures.filter((video) =>
    video.title.toLowerCase().includes(filterText.toLowerCase()) ||
    video.instructor.toLowerCase().includes(filterText.toLowerCase())
  );

  // 🚨 CRITICAL FIX 2: Change the function to reliably play the video externally.
  const handleVideoPress = (videoUrl) => {
    console.log("Opening video externally:", videoUrl);
    Linking.openURL(videoUrl).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert('Playback Error', 'Could not open the video. Ensure you have the YouTube app or a web browser installed.');
    });

    // Reset embedded player state in case the user wants to switch back
    setSelectedVideo(null);
    setIsVideoPlaying(false);
    setVideoLoading(false);
  };


  const loadMoreVideos = () => {
    if (nextPageToken && !paginationLoading) {
      fetchChannelVideos(nextPageToken);
    }
  };

  const renderVideoCard = ({ item }) => (
    <View style={styles.videoCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
      <View style={styles.videoDetails}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoInstructor}>Instructor: **{item.instructor}**</Text>
        <Text style={styles.videoDuration}>Duration: {item.duration}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>{item.description}</Text>
        <TouchableOpacity style={styles.playButton} onPress={() => handleVideoPress(item.videoUrl)}>
          <FontAwesome6 name="play" size={14} color="#fff" />
          <Text style={styles.playButtonText}>Watch Lecture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingMessage}>Loading initial data and videos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>My Video Lectures 🧑‍🏫</Text>
      </View>

      <View style={styles.filterSection}>
        <TextInput
          style={styles.filterInput}
          placeholder="Search by Title or Instructor"
          placeholderTextColor="#999"
          value={filterText}
          onChangeText={setFilterText}
        />
      </View>

      <FlatList
        data={filteredLectures}
        renderItem={renderVideoCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
        onEndReached={loadMoreVideos}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={!paginationLoading && <Text style={styles.emptyText}>No videos found. Check API Key or channel ID.</Text>}
        ListFooterComponent={paginationLoading ? <ActivityIndicator size="small" color="#007bff" style={{ marginVertical: 20 }} /> : null}
      />

      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload ⬆️</Text>
      </TouchableOpacity>

      {/*       ⚠️ EMBEDDED PLAYER COMMENTED OUT: 
      Since the embedded player was not working reliably for you, this section is commented 
      out. The handleVideoPress function now uses Linking to open the video externally.
      */}
      {/*       {isVideoPlaying && selectedVideo && (
        <View style={styles.videoPlayerSection}>
          <YoutubePlayer
            height={screenHeight * 0.4}
            play={isVideoPlaying}
            videoId={selectedVideo}
            webViewStyle={{ opacity: 0.99 }}
            onReady={() => { setVideoLoading(false); }}
            onChangeState={(state) => {
              if (state === STATE.BUFFERING) setVideoLoading(true);
              else if (state === STATE.PLAYING) setVideoLoading(false);
              if (state === STATE.ENDED) handlePlayPauseVideo();
            }}
            onError={(error) => {
              Alert.alert('Video Error', `Failed to play video. Check restrictions. Error: ${error}`);
              setVideoLoading(false);
            }}
          />

          {videoLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={handlePlayPauseVideo}>
            <EvilIcons name="close" size={40} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      */}
    </View>
  );
};

// ... (Stylesheet remains the same)

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingMessage: {
    marginTop: 10,
    color: '#007bff',
  },
  header: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333'
  },
  filterSection: {
    padding: 10,
    backgroundColor: '#fff',
  },
  filterInput: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  videoCard: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  videoThumbnail: {
    width: 120,
    height: 80,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  videoDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-around',
  },
  videoTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
  },
  videoInstructor: {
    fontSize: 12,
    color: '#555'
  },
  videoDuration: {
    fontSize: 12,
    color: '#777'
  },
  videoDescription: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  playButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  playButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 13,
    fontWeight: 'bold',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  videoPlayerSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    padding: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 15,
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  }
});

export default MyVideoLecture;
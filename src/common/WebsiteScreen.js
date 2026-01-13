import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  BackHandler,
  ScrollView,
  RefreshControl,
  Animated,
  Linking, // Added Linking for fallback
  Alert,   // Added Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import colors from './config/colors';

const { width, height } = Dimensions.get('window');

const ModernWebScreen = ({ navigation }) => {
  const defaultUrl = "https://mguvv.ac.in/angular/";
  
  const [url, setUrl] = useState(defaultUrl);
  const [title, setTitle] = useState("University Portal");
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const webViewRef = useRef(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Header Animation Logic
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -120],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const webViewMarginTop = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [130, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [canGoBack]);

  const onRefresh = () => {
    setRefreshing(true);
    webViewRef.current?.reload();
  };

  const handleHomePress = () => {
    webViewRef.current.injectJavaScript(`window.location.href = '${defaultUrl}';`);
  };

  const handleWebLogin = () => {
    if (navigation) navigation.navigate('AuthLoading');
  };

  // --- NEW: PDF & DOWNLOAD HANDLER ---
  const handleNavigationChange = (request) => {
    const { url } = request;

    // Check if the URL is a PDF or Document
    const isDoc = url.toLowerCase().endsWith('.pdf') || 
                  url.toLowerCase().endsWith('.doc') || 
                  url.toLowerCase().endsWith('.docx');

    if (isDoc) {
      // If it's a PDF, we use Google's viewer to show it inside the app
      const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${url}`;
      
      // We check if we are already in the viewer to avoid infinite loops
      if (!url.includes("docs.google.com")) {
        webViewRef.current.injectJavaScript(`window.location.href = '${viewerUrl}';`);
        return false; // Stop the original download request
      }
    }
    
    return true; // Continue normal browsing
  };

  

  // const handleNavigationChange = (request) => {
  //   const targetUrl = request.url;
  //   console.log("Console: Attempting to load URL:", targetUrl);
  //   // 1. Detect PDF extension
  //   const isPdf = targetUrl.toLowerCase().split('?')[0].endsWith('.pdf');

  //   if (isPdf) {
  //     console.log("Console: PDF Detected! Handling natively...");

  //     if (Platform.OS === 'ios') {
  //       // iOS WebView supports PDF viewing natively
  //       return true; 
  //     } else {
  //       // For Android: 
  //       // If you don't want Google Docs, the WebView cannot "render" the PDF 
  //       // inside the HTML frame easily. You should let the system handle it.
  //       Alert.alert(
  //         "Open Document",
  //         "Would you like to view or download this PDF?",
  //         [
  //           { text: "Cancel", style: "cancel" },
  //           { 
  //             text: "Open", 
  //             onPress: () => Linking.openURL(targetUrl)  
  //           }
  //         ]
  //       );
  //       return false;  
  //     }
  //   }
    
  //   return true; 
  // };

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgcolor} />

      <Animated.View style={[
        styles.header, 
        { 
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }
      ]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleHomePress}>
            <FontAwesome6 name="house" size={18} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleArea}>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleWebLogin}>
            <FontAwesome6 name="user-lock" size={14} color="#32208d" style={{marginRight: 6}} />
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addressBar}>
          <TouchableOpacity onPress={handleHomePress} style={styles.homeBadge}>
            <FontAwesome6 name="house" size={12} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.urlDisplay}>
            <FontAwesome6 name="shield-halved" size={10} color="#10B981" />
            <Text style={styles.urlText} numberOfLines={1}>{url}</Text>
          </View>
        </View>
      </Animated.View>

      {progress < 1 && (
        <View style={[styles.progressContainer, { zIndex: 101, top: 0 }]}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}

      <Animated.View style={[styles.webContainer, { marginTop: webViewMarginTop }]}>
        <ScrollView 
          contentContainerStyle={{ flex: 1 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <WebView
            ref={webViewRef}
            source={{ uri: defaultUrl }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={['*']}
            // Updated to handle PDF/Downloads
            onShouldStartLoadWithRequest={handleNavigationChange}
            // Add download listener for other file types
            onFileDownload={({ nativeEvent: { downloadUrl } }) => {
              Linking.openURL(downloadUrl);
            }}
            setSupportMultipleWindows={false}
            onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
            onNavigationStateChange={(navState) => {
              setUrl(navState.url);
              setCanGoBack(navState.canGoBack);
              if (navState.title) setTitle(navState.title);
              setRefreshing(false); 
            }}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loader}>
                <ActivityIndicator color="#32208d" size="large" />
              </View>
            )}
            style={{ flex: 1 }}
          />
        </ScrollView>
      </Animated.View>

      <View style={styles.floatingNavContainer}>
        <View style={styles.navCapsule}>
          <TouchableOpacity 
            onPress={() => webViewRef.current?.goBack()} 
            disabled={!canGoBack}
            style={styles.navAction}
          >
            <FontAwesome6 name="chevron-left" size={16} color={canGoBack ? "#32208d" : "#D1D5DB"} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onRefresh} style={styles.mainAction}>
            <FontAwesome6 name="rotate" size={18} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => webViewRef.current?.goForward()} style={styles.navAction}>
            <FontAwesome6 name="chevron-right" size={16} color="#32208d" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ... Styles remain the same ...

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgcolor },
  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 15, backgroundColor: colors.bgcolor },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position:'relative' },
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerTitleArea: { flex: 1, marginHorizontal: 12 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  loginBtn: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignItems: 'center', elevation: 4 },
  loginText: { color: "#32208d", fontWeight: 'bold', fontSize: 12 },
  addressBar: { flexDirection: 'row', alignItems: 'center', marginTop: 15, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 4 },
  homeBadge: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 8, marginRight: 8 },
  urlDisplay: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  urlText: { color: '#C7D2FE', fontSize: 11, marginLeft: 6 },
  progressContainer: { height: 3, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)' },
  progressBar: { height: '100%', backgroundColor: '#60A5FA' },
  webContainer: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  loader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  floatingNavContainer: { position: 'absolute', bottom: 35, left: 0, right: 0, zIndex: 200, alignItems: 'center' },
  navCapsule: { flexDirection: 'row', backgroundColor: '#FFF', width: width * 0.6, height: 55, borderRadius: 27, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5, elevation: 15 },
  navAction: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  mainAction: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: colors.bgcolor, justifyContent: 'center', alignItems: 'center' }
});

export default ModernWebScreen;














// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   BackHandler,
//   ScrollView,
//   RefreshControl,
//   Animated, // Added Animated
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import colors from './config/colors';

// const { width, height } = Dimensions.get('window');

// const ModernWebScreen = ({ navigation }) => {
//   const defaultUrl = "https://mguvv.ac.in/angular/";
  
//   const [url, setUrl] = useState(defaultUrl);
//   const [title, setTitle] = useState("University Portal");
//   const [progress, setProgress] = useState(0);
//   const [canGoBack, setCanGoBack] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const webViewRef = useRef(null);

//   // --- Header Animation Logic ---
//   const scrollY = useRef(new Animated.Value(0)).current;

//   // Collapse header after 50 units of scrolling
//   const headerTranslateY = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [0, -120], // Moves header up
//     extrapolate: 'clamp',
//   });

//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, 50],
//     outputRange: [1, 0],
//     extrapolate: 'clamp',
//   });

//   const webViewMarginTop = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [130, 0], // Reduces space when header hides
//     extrapolate: 'clamp',
//   });
//   // ------------------------------

//   useEffect(() => {
//     const onBackPress = () => {
//       if (canGoBack && webViewRef.current) {
//         webViewRef.current.goBack();
//         return true;
//       }
//       return false;
//     };

//     const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
//     return () => subscription.remove();
//   }, [canGoBack]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     webViewRef.current?.reload();
//   };

//   const handleHomePress = () => {
//     const HomeUrl = "https://mguvv.ac.in/angular/";
//     webViewRef.current.injectJavaScript(`window.location.href = '${HomeUrl}';`);
//   };

//   const handleWebLogin = () => {
//     if (navigation) navigation.navigate('AuthLoading');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={colors.bgcolor} />

//       {/* Animated Header */}
//       <Animated.View style={[
//         styles.header, 
//         { 
//           transform: [{ translateY: headerTranslateY }],
//           opacity: headerOpacity,
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 100,
//         }
//       ]}>
//         <View style={styles.headerTopRow}>
//           <TouchableOpacity style={styles.iconBtn} onPress={handleHomePress}>
//             <FontAwesome6 name="house" size={18} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.headerTitleArea}>
//             <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
//           </View>
//           <TouchableOpacity style={styles.loginBtn} onPress={handleWebLogin}>
//             <FontAwesome6 name="user-lock" size={14} color="#32208d" style={{marginRight: 6}} />
//             <Text style={styles.loginText}>LOGIN</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.addressBar}>
//           <TouchableOpacity onPress={handleHomePress} style={styles.homeBadge}>
//             <FontAwesome6 name="house" size={12} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.urlDisplay}>
//             <FontAwesome6 name="shield-halved" size={10} color="#10B981" />
//             <Text style={styles.urlText} numberOfLines={1}>{url}</Text>
//           </View>
//         </View>
//       </Animated.View>

//       {/* Progress Bar */}
//       {progress < 1 && (
//         <View style={[styles.progressContainer, { zIndex: 101, top: 0 }]}>
//           <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
//         </View>
//       )}

//       {/* WebContent */}
//       <Animated.View style={[styles.webContainer, { marginTop: webViewMarginTop }]}>
//         <ScrollView 
//           contentContainerStyle={{ flex: 1 }}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: false }
//           )}
//           scrollEventThrottle={16}
//         >
//           <WebView
//             ref={webViewRef}
//             source={{ uri: defaultUrl }}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             originWhitelist={['*']}
//             onShouldStartLoadWithRequest={() => true}
//             setSupportMultipleWindows={false}
//             onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
//             onNavigationStateChange={(navState) => {
//               setUrl(navState.url);
//               setCanGoBack(navState.canGoBack);
//               if (navState.title) setTitle(navState.title);
//               setRefreshing(false); 
//             }}
//             startInLoadingState={true}
//             renderLoading={() => (
//               <View style={styles.loader}>
//                 <ActivityIndicator color="#32208d" size="large" />
//               </View>
//             )}
//             style={{ flex: 1 }}
//           />
//         </ScrollView>
//       </Animated.View>

//       {/* Bottom Nav */}
//       <View style={styles.floatingNavContainer}>
//         <View style={styles.navCapsule}>
//           <TouchableOpacity 
//             onPress={() => webViewRef.current?.goBack()} 
//             disabled={!canGoBack}
//             style={styles.navAction}
//           >
//             <FontAwesome6 name="chevron-left" size={16} color={canGoBack ? "#32208d" : "#D1D5DB"} />
//           </TouchableOpacity>
          
//           <TouchableOpacity onPress={onRefresh} style={styles.mainAction}>
//             <FontAwesome6 name="rotate" size={18} color="#FFF" />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => webViewRef.current?.goForward()} style={styles.navAction}>
//             <FontAwesome6 name="chevron-right" size={16} color="#32208d" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bgcolor },
//   header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 15, backgroundColor: colors.bgcolor },
//   headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position:'relative' },
//   iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
//   headerTitleArea: { flex: 1, marginHorizontal: 12 },
//   headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFF' },
//   loginBtn: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignItems: 'center', elevation: 4 },
//   loginText: { color: "#32208d", fontWeight: 'bold', fontSize: 12 },
//   addressBar: { flexDirection: 'row', alignItems: 'center', marginTop: 15, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 4 },
//   homeBadge: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 8, marginRight: 8 },
//   urlDisplay: { flex: 1, flexDirection: 'row', alignItems: 'center' },
//   urlText: { color: '#C7D2FE', fontSize: 11, marginLeft: 6 },
//   progressContainer: { height: 3, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)' },
//   progressBar: { height: '100%', backgroundColor: '#60A5FA' },
//   webContainer: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
//   loader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
//   floatingNavContainer: { position: 'absolute', bottom: 35, left: 0, right: 0, zIndex: 200, alignItems: 'center' },
//   navCapsule: { flexDirection: 'row', backgroundColor: '#FFF', width: width * 0.6, height: 55, borderRadius: 27, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5, elevation: 15 },
//   navAction: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
//   mainAction: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: colors.bgcolor, justifyContent: 'center', alignItems: 'center' }
// });

// export default ModernWebScreen;









// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   BackHandler,
//   ScrollView,
//   RefreshControl,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import colors from './config/colors';

// const { width, height } = Dimensions.get('window');

// const ModernWebScreen = ({ navigation }) => {
//   const defaultUrl = "https://mguvv.ac.in/angular/";
  
//   const [url, setUrl] = useState(defaultUrl);
//   const [title, setTitle] = useState("University Portal");
//   const [progress, setProgress] = useState(0);
//   const [canGoBack, setCanGoBack] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const webViewRef = useRef(null);

// useEffect(() => {
//   const onBackPress = () => {
//     if (canGoBack && webViewRef.current) {
//       webViewRef.current.goBack();
//       return true; // Prevents app from closing
//     }
//     return false; // Allows default back behavior
//   };

//   // 1. Create the subscription
//   const subscription = BackHandler.addEventListener(
//     'hardwareBackPress',
//     onBackPress
//   );

//   // 2. Return the cleanup function using .remove()
//   return () => {
//     subscription.remove(); 
//   };
// }, [canGoBack]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     webViewRef.current?.reload();
//   };

//   const handleHomePress = () => {
//     // if (navigation) navigation.navigate('AuthLoading');
//     const HomeUrl = "https://mguvv.ac.in/angular/";
//     webViewRef.current.injectJavaScript(`window.location.href = '${HomeUrl}';`);
//   };

//   const handleWebLogin = () => {
//     if (navigation) navigation.navigate('AuthLoading');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={colors.bgcolor} />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerTopRow}>
//           <TouchableOpacity style={styles.iconBtn} onPress={handleWebLogin}>
//             <FontAwesome6 name="house" size={18} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.headerTitleArea}>
//             <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
//           </View>
//           <TouchableOpacity style={styles.loginBtn} onPress={handleWebLogin}>
//             <FontAwesome6 name="user-lock" size={14} color="#32208d" style={{marginRight: 6}} />
//             <Text style={styles.loginText}>LOGIN</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.addressBar}>
//           <TouchableOpacity onPress={handleHomePress} style={styles.homeBadge}>
//             <FontAwesome6 name="house" size={12} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.urlDisplay}>
//             <FontAwesome6 name="shield-halved" size={10} color="#10B981" />
//             <Text style={styles.urlText} numberOfLines={1}>{url}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Progress Bar */}
//       {progress < 1 && (
//         <View style={styles.progressContainer}>
//           <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
//         </View>
//       )}

//       {/* WebContent */}
//       <View style={styles.webContainer}>
//         {/* ScrollView enables Pull-to-Refresh */}
//         <ScrollView contentContainerStyle={{ flex: 1 }}>
          
//         {/* <ScrollView
//           contentContainerStyle={{ flex: 1 }}
//           refreshControl={
//             <RefreshControl 
//               refreshing={refreshing} 
//               onRefresh={onRefresh} 
//               tintColor="#32208d"
//               colors={["#32208d"]} 
//             />
//           }
//         > */}
//           <WebView
//             ref={webViewRef}
//             source={{ uri: defaultUrl }}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             originWhitelist={['*']}
//             onShouldStartLoadWithRequest={(request) => {
//               return true; 
//             }}
//             setSupportMultipleWindows={false}
//             onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
//             onNavigationStateChange={(navState) => {
//               setUrl(navState.url);
//               setCanGoBack(navState.canGoBack);
//               if (navState.title) setTitle(navState.title);
//               setRefreshing(false); 
//             }}
//             startInLoadingState={true}
//             renderLoading={() => (
//               <View style={styles.loader}>
//                 <ActivityIndicator color="#32208d" size="large" />
//               </View>
//             )}
//             style={{ flex: 1 }}
//           />
//         </ScrollView>
//       </View>

//       {/* Bottom Nav */}
//       <View style={styles.floatingNavContainer}>
//         <View style={styles.navCapsule}>
//           <TouchableOpacity 
//             onPress={() => webViewRef.current?.goBack()} 
//             disabled={!canGoBack}
//             style={styles.navAction}
//           >
//             <FontAwesome6 name="chevron-left" size={16} color={canGoBack ? "#32208d" : "#D1D5DB"} />
//           </TouchableOpacity>
          
//           <TouchableOpacity onPress={onRefresh} style={styles.mainAction}>
//             <FontAwesome6 name="rotate" size={18} color="#FFF" />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => webViewRef.current?.goForward()} style={styles.navAction}>
//             <FontAwesome6 name="chevron-right" size={16} color="#32208d" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.bgcolor },
//   header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 15, backgroundColor: colors.bgcolor },
//   headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
//   headerTitleArea: { flex: 1, marginHorizontal: 12 },
//   headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFF' },
//   loginBtn: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignItems: 'center', elevation: 4 },
//   loginText: { color: colors.bgcolor, fontWeight: 'bold', fontSize: 12 },
//   addressBar: { flexDirection: 'row', alignItems: 'center', marginTop: 15, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 4 },
//   homeBadge: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 8, marginRight: 8 },
//   urlDisplay: { flex: 1, flexDirection: 'row', alignItems: 'center' },
//   urlText: { color: '#C7D2FE', fontSize: 11, marginLeft: 6 },
//   progressContainer: { height: 3, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)' },
//   progressBar: { height: '100%', backgroundColor: '#60A5FA' },
//   webContainer: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
//   loader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
//   floatingNavContainer: { position: 'absolute', bottom: 35, left: 0, right: 0, alignItems: 'center' },
//   navCapsule: { flexDirection: 'row', backgroundColor: '#FFF', width: width * 0.6, height: 55, borderRadius: 27, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5, elevation: 15 },
//   navAction: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
//   mainAction: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: colors.bgcolor, justifyContent: 'center', alignItems: 'center' }
// });

// export default ModernWebScreen;







 
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   BackHandler,
//   Platform,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// const { width } = Dimensions.get('window');

// const ModernWebScreen = ({ navigation }) => {
//   const defaultUrl = "https://mguvv.ac.in/angular/";
  
//   const [url, setUrl] = useState(defaultUrl);
//   const [title, setTitle] = useState("University Portal");
//   const [progress, setProgress] = useState(0);
//   const [canGoBack, setCanGoBack] = useState(false);
//   const webViewRef = useRef(null);

//   // Handle Android Physical Back Button
//   useEffect(() => {
//     const onBackPress = () => {
//       if (canGoBack && webViewRef.current) {
//         webViewRef.current.goBack();
//         return true;
//       }
//       return false;
//     };

//     BackHandler.addEventListener('hardwareBackPress', onBackPress);
//     return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//   }, [canGoBack]);

//   // Actions
//   const handleHome = () => {
     
//   };

//   const handleAppLogin = () => {
//     // Option A: Navigate to your App's Login Screen
//     // navigation.navigate('Login'); 
    
//     // Option B: Navigate to the Website's Login URL
//     webViewRef.current.injectJavaScript(`window.location.href = 'https://mguvv.ac.in/angular/#/login';`);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#32208d" />

//       {/* Advanced Modern Header */}
//       <View style={styles.header}>
//         <View style={styles.headerTopRow}>
//           <TouchableOpacity 
//             style={styles.iconBtn} 
//             onPress={() => navigation.goBack()}
//           >
//             <FontAwesome6 name="arrow-left" size={18} color="#FFF" />
//           </TouchableOpacity>

//           <View style={styles.headerTitleArea}>
//             <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
//           </View>

//           <TouchableOpacity style={styles.loginBtn} onPress={handleAppLogin}>
//             <FontAwesome6 name="user-lock" size={14} color="#32208d" style={{marginRight: 6}} />
//             <Text style={styles.loginText}>LOGIN</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Browser Address Sub-Bar */}
//         <View style={styles.addressBar}>
//           <TouchableOpacity onPress={handleHome} style={styles.homeBadge}>
//             <FontAwesome6 name="house" size={12} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.urlDisplay}>
//             <FontAwesome6 name="shield-halved" size={10} color="#10B981" />
//             <Text style={styles.urlText} numberOfLines={1}>{url}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Progress Bar */}
//       {progress < 1 && (
//         <View style={styles.progressContainer}>
//           <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
//         </View>
//       )}

//       {/* WebView Container */}
//       <View style={styles.webContainer}>
//         <WebView
//           ref={webViewRef}
//           source={{ uri: defaultUrl }}
//           originWhitelist={['*']}
//           onShouldStartLoadWithRequest={() => true}
//           setSupportMultipleWindows={false}
//           onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
//           onNavigationStateChange={(navState) => {
//             setUrl(navState.url);
//             setCanGoBack(navState.canGoBack);
//             if (navState.title) setTitle(navState.title);
//           }}
//           startInLoadingState={true}
//           renderLoading={() => (
//             <View style={styles.loader}>
//               <ActivityIndicator color="#32208d" size="large" />
//             </View>
//           )}
//         />
//       </View>

//       {/* Bottom Floating Nav Controls */}
//       <View style={styles.floatingNavContainer}>
//         <View style={styles.navCapsule}>
//           <TouchableOpacity onPress={() => webViewRef.current.goBack()} style={styles.navAction}>
//             <FontAwesome6 name="chevron-left" size={16} color={canGoBack ? "#32208d" : "#D1D5DB"} />
//           </TouchableOpacity>
          
//           <TouchableOpacity onPress={() => webViewRef.current.reload()} style={styles.mainAction}>
//             <FontAwesome6 name="rotate" size={18} color="#FFF" />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => webViewRef.current.goForward()} style={styles.navAction}>
//             <FontAwesome6 name="chevron-right" size={16} color="#32208d" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#32208d' },
//   header: { 
//     paddingHorizontal: 16, 
//     paddingTop: 10, 
//     paddingBottom: 15,
//     backgroundColor: '#32208d' 
//   },
//   headerTopRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between'
//   },
//   iconBtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 10,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   headerTitleArea: {
//     flex: 1,
//     marginHorizontal: 12,
//   },
//   headerTitle: {
//     fontSize: 17,
//     fontWeight: '800',
//     color: '#FFF',
//     textAlign: 'left'
//   },
//   loginBtn: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     alignItems: 'center',
//     elevation: 4
//   },
//   loginText: {
//     color: '#32208d',
//     fontWeight: 'bold',
//     fontSize: 12
//   },
//   addressBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 15,
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     borderRadius: 12,
//     padding: 4
//   },
//   homeBadge: {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     padding: 8,
//     borderRadius: 8,
//     marginRight: 8
//   },
//   urlDisplay: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   urlText: {
//     color: '#C7D2FE',
//     fontSize: 11,
//     marginLeft: 6
//   },
//   progressContainer: { height: 3, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)' },
//   progressBar: { height: '100%', backgroundColor: '#60A5FA' },
//   webContainer: { 
//     flex: 1, 
//     backgroundColor: '#FFF', 
//     borderTopLeftRadius: 30, 
//     borderTopRightRadius: 30, 
//     overflow: 'hidden' 
//   },
//   loader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  
//   // Floating Nav Styles
//   floatingNavContainer: {
//     position: 'absolute',
//     bottom: 35,
//     left: 0,
//     right: 0,
//     alignItems: 'center'
//   },
//   navCapsule: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     width: width * 0.6,
//     height: 55,
//     borderRadius: 27,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 5,
//     elevation: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 10
//   },
//   navAction: {
//     width: 50,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   mainAction: {
//     width: 45,
//     height: 45,
//     borderRadius: 22.5,
//     backgroundColor: '#32208d',
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// });

// export default ModernWebScreen;







// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   Platform
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// const { width } = Dimensions.get('window');

// const ModernWebScreen = ({ navigation }) => {
//   const defaultUrl = "https://mguvv.ac.in/angular/";
  
//   const [url, setUrl] = useState(defaultUrl);
//   const [title, setTitle] = useState("University Portal");
//   const [progress, setProgress] = useState(0);
//   const webViewRef = useRef(null);

//   // This function prevents links from opening in external browsers
//   const handleNavigationStateChange = (request) => {
//     // If the request is for a new page, keep it in the WebView
//     if (request.url !== 'about:blank') {
//       return true; // "true" means stay inside this WebView
//     }
//     return true;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#32208d" />

//       {/* Modern Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton} 
//           onPress={() => navigation.goBack()}
//         >
//           <FontAwesome6 name="xmark" size={20} color="#FFF" />
//         </TouchableOpacity>

//         <View style={styles.headerTextContainer}>
//           <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
//           <View style={styles.urlBadge}>
//             <FontAwesome6 name="lock" size={8} color="#10B981" style={{marginRight: 4}} />
//             <Text style={styles.headerSubtitle} numberOfLines={1}>{url}</Text>
//           </View>
//         </View>

//         <View style={{width: 40}} /> 
//       </View>

//       {/* Progress Bar */}
//       {progress < 1 && (
//         <View style={styles.progressContainer}>
//           <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
//         </View>
//       )}

//       {/* WebView with Interception Logic */}
//       <View style={styles.webContainer}>
//         <WebView
//           ref={webViewRef}
//           source={{ uri: defaultUrl }}
          
//           // CRITICAL: These props prevent external browser redirection
//           originWhitelist={['*']}
//           onShouldStartLoadWithRequest={(request) => {
//             // Force every link click to stay inside this view
//             return true; 
//           }}
//           setSupportMultipleWindows={false} // Prevents opening new windows
          
//           onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
//           onNavigationStateChange={(navState) => {
//             setUrl(navState.url);
//             if (navState.title) setTitle(navState.title);
//           }}
//           startInLoadingState={true}
//           renderLoading={() => (
//             <View style={styles.loader}>
//               <ActivityIndicator color="#32208d" size="large" />
//             </View>
//           )}
//         />
//       </View>

//       {/* Floating Bottom Nav */}
//       <View style={styles.bottomNavWrapper}>
//         <View style={styles.bottomNav}>
//           <TouchableOpacity onPress={() => webViewRef.current.goBack()} style={styles.navIcon}>
//             <FontAwesome6 name="arrow-left" size={18} color="#4B5563" />
//           </TouchableOpacity>
          
//           <TouchableOpacity onPress={() => webViewRef.current.reload()} style={styles.refreshCircle}>
//             <FontAwesome6 name="rotate" size={18} color="#FFF" />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => webViewRef.current.goForward()} style={styles.navIcon}>
//             <FontAwesome6 name="arrow-right" size={18} color="#4B5563" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#32208d' },
//   header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
//   backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
//   headerTextContainer: { flex: 1, alignItems: 'center' },
//   headerTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
//   urlBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 4 },
//   headerSubtitle: { fontSize: 10, color: '#C7D2FE' },
//   progressContainer: { height: 3, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)' },
//   progressBar: { height: '100%', backgroundColor: '#60A5FA' },
//   webContainer: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden' },
//   loader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
//   bottomNavWrapper: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
//   bottomNav: { flexDirection: 'row', backgroundColor: '#FFF', width: width * 0.7, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'space-around', elevation: 10, shadowOpacity: 0.2, paddingHorizontal: 10 },
//   navIcon: { padding: 10 },
//   refreshCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#32208d', justifyContent: 'center', alignItems: 'center' },
// });

// export default ModernWebScreen;






// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   Animated,
//   Dimensions,
//   Share
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// const { width } = Dimensions.get('window');

// const ModernWebScreen = ({ navigation }) => {
//   // Default URL provided by you
//   const defaultUrl = "https://mguvv.ac.in/angular/";
  
//   const [url, setUrl] = useState(defaultUrl);
//   const [title, setTitle] = useState("University Portal");
//   const [loading, setLoading] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const webViewRef = useRef(null);

//   const handleShare = async () => {
//     try {
//       await Share.share({ url: url, message: `Visiting: ${title}` });
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#32208d" />

//       {/* Modern Gradient-Style Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton} 
//           onPress={() => navigation.goBack()}
//         >
//           <FontAwesome6 name="chevron-left" size={20} color="#FFF" />
//         </TouchableOpacity>

//         <View style={styles.headerTextContainer}>
//           <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
//           <View style={styles.urlBadge}>
//             <FontAwesome6 name="lock" size={8} color="#10B981" style={{marginRight: 4}} />
//             <Text style={styles.headerSubtitle} numberOfLines={1}>{url}</Text>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.backButton} onPress={handleShare}>
//           <FontAwesome6 name="arrow-up-from-bracket" size={18} color="#FFF" />
//         </TouchableOpacity>
//       </View>

//       {/* Animated Modern Progress Bar */}
//       {progress < 1 && (
//         <View style={styles.progressContainer}>
//           <Animated.View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
//         </View>
//       )}

//       {/* Main WebView Content */}
//       <View style={styles.webContainer}>
//         <WebView
//           ref={webViewRef}
//           source={{ uri: defaultUrl }}
//           onLoadStart={() => setLoading(true)}
//           onLoadEnd={() => setLoading(false)}
//           onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
//           onNavigationStateChange={(navState) => {
//             setUrl(navState.url);
//             if (navState.title && navState.title !== 'about:blank') {
//               setTitle(navState.title);
//             }
//           }}
//           startInLoadingState={true}
//           renderLoading={() => (
//             <View style={styles.loader}>
//               <ActivityIndicator color="#32208d" size="large" />
//               <Text style={styles.loadingText}>Securing Connection...</Text>
//             </View>
//           )}
//         />
//       </View>

//       {/* Modern Floating Bottom Navigation */}
//       <View style={styles.bottomNavWrapper}>
//         <View style={styles.bottomNav}>
//           <TouchableOpacity onPress={() => webViewRef.current.goBack()} style={styles.navIcon}>
//             <FontAwesome6 name="arrow-left" size={18} color="#4B5563" />
//           </TouchableOpacity>
          
//           <TouchableOpacity onPress={() => webViewRef.current.reload()} style={styles.refreshCircle}>
//             <FontAwesome6 name="rotate" size={18} color="#FFF" />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => webViewRef.current.goForward()} style={styles.navIcon}>
//             <FontAwesome6 name="arrow-right" size={18} color="#4B5563" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#32208d', // Matches your theme
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#32208d',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTextContainer: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   headerTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#FFF',
//     letterSpacing: 0.5,
//   },
//   urlBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 10,
//     marginTop: 4,
//   },
//   headerSubtitle: {
//     fontSize: 10,
//     color: '#C7D2FE',
//   },
//   progressContainer: {
//     height: 3,
//     width: '100%',
//     backgroundColor: 'rgba(255,255,255,0.1)',
//   },
//   progressBar: {
//     height: '100%',
//     backgroundColor: '#60A5FA', // Bright blue progress
//   },
//   webContainer: {
//     flex: 1,
//     backgroundColor: '#FFF',
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//     overflow: 'hidden',
//   },
//   loader: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 12,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   bottomNavWrapper: {
//     position: 'absolute',
//     bottom: 30,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     width: width * 0.7,
//     height: 60,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     paddingHorizontal: 10,
//   },
//   navIcon: {
//     padding: 10,
//   },
//   refreshCircle: {
//     width: 45,
//     height: 45,
//     borderRadius: 22.5,
//     backgroundColor: '#32208d',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//   },
// });

// export default ModernWebScreen;











// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   Share
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// const WebsiteScreen = ({ route, navigation }) => {
//   // Get URL and Title from navigation props (e.g., from AdminProfile)
//   const { url, title } = route.params || { 
//     url: 'https://google.com', 
//     title: 'Web Browser' 
//   };

//   const [loading, setLoading] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const webViewRef = useRef(null);

//   const onShare = async () => {
//     try {
//       await Share.share({ message: `Check this out: ${url}` });
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       {/* Custom Browser Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.navButton} 
//           onPress={() => navigation.goBack()}
//         >
//           <FontAwesome6 name="arrow-left" size={20} color="#1F2937" />
//         </TouchableOpacity>

//         <View style={styles.titleContainer}>
//           <Text style={styles.title} numberOfLines={1}>{title}</Text>
//           <Text style={styles.subtitle} numberOfLines={1}>{url}</Text>
//         </View>

//         <TouchableOpacity style={styles.navButton} onPress={onShare}>
//           <FontAwesome6 name="share-nodes" size={18} color="#1F2937" />
//         </TouchableOpacity>
//       </View>

//       {/* Progress Bar */}
//       {progress < 1 && (
//         <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
//       )}

//       {/* Main WebView */}
//       <WebView
//         ref={webViewRef}
//         source={{ uri: url }}
//         onLoadStart={() => setLoading(true)}
//         onLoadEnd={() => setLoading(false)}
//         onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
//         startInLoadingState={true}
//         renderLoading={() => (
//           <View style={styles.loader}>
//             <ActivityIndicator color="#32208d" size="large" />
//           </View>
//         )}
//       />

//       {/* Bottom Navigation Bar (Internal Browser Controls) */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity onPress={() => webViewRef.current.goBack()}>
//           <FontAwesome6 name="chevron-left" size={20} color="#6B7280" />
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={() => webViewRef.current.reload()}>
//           <FontAwesome6 name="rotate-right" size={20} color="#6B7280" />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => webViewRef.current.goForward()}>
//           <FontAwesome6 name="chevron-right" size={20} color="#6B7280" />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   navButton: {
//     padding: 8,
//   },
//   titleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   subtitle: {
//     fontSize: 10,
//     color: '#9CA3AF',
//   },
//   progressBar: {
//     height: 3,
//     backgroundColor: '#32208d',
//   },
//   loader: {
//     position: 'absolute',
//     height: '100%',
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//     backgroundColor: '#FAFAFA',
//   }
// });

// export default WebsiteScreen;
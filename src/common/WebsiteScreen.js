
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
  Animated,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import colors from './config/colors';

const { width } = Dimensions.get('window');

const ModernWebScreen = ({ navigation }) => {
  const defaultUrl = "https://mguvv.ac.in/angular/";
  
  const [url, setUrl] = useState(defaultUrl);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);

  // Animation for hiding/showing URL bar on scroll
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -60],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
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

  const onRefresh = () => webViewRef.current?.reload();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgcolor || '#1B4332'} />

      {/* REINSTATED URL SECTION FROM OLD UI (Simplified) */}
      <Animated.View style={[
        styles.header, 
        { 
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
        }
      ]}>
        <View style={styles.addressBar}>
          <View style={styles.urlDisplay}>
            <FontAwesome6 name="shield-halved" size={12} color="#4ADE80" />
            <Text style={styles.urlText} numberOfLines={1}>{url}</Text>
          </View>
          <TouchableOpacity onPress={() => webViewRef.current?.reload()} style={styles.refreshSmall}>
             <FontAwesome6 name="rotate-right" size={12} color="#FFF" opacity={0.7} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Progress Bar */}
      {progress < 1 && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}

      <View style={styles.webContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri: defaultUrl }}
            onScroll={(event) => 
              Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}

              // onScroll={(event) => {
              //     const yOffset = event.nativeEvent.contentOffset.y;
              //     scrollY.setValue(yOffset);
              //   }}

            onShouldStartLoadWithRequest={(request) => {
              if (request.url.toLowerCase().endsWith('.pdf')) {
                const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${request.url}`;
                webViewRef.current.injectJavaScript(`window.location.href = '${viewerUrl}';`);
                return false;
              }
              return true;
            }}
            onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
            onNavigationStateChange={(navState) => {
              setUrl(navState.url);
              setCanGoBack(navState.canGoBack);
            }}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loader}>
                <ActivityIndicator color={colors.bgcolor || "#1B4332"} size="large" />
              </View>
            )}
            style={{ flex: 1 }}
          />
      </View>

      {/* Floating Bottom Navigation */}
      <View style={styles.floatingNavContainer}>
        <View style={styles.navCapsule}>
          <TouchableOpacity onPress={() => webViewRef.current?.goBack()} disabled={!canGoBack} style={styles.navAction}>
            <FontAwesome6 name="chevron-left" size={18} color={canGoBack ? "#1B4332" : "#D1D5DB"} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => webViewRef.current?.injectJavaScript(`window.location.href = '${defaultUrl}';`)} 
            style={styles.mainAction}
          >
            <FontAwesome6 name="house" size={18} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => webViewRef.current?.goForward()} style={styles.navAction}>
            <FontAwesome6 name="chevron-right" size={18} color="#1B4332" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.bgcolor || '#1B4332' 
  },
  header: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    backgroundColor: colors.bgcolor || '#1B4332',
    zIndex: 10,
  },
  addressBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    borderRadius: 12, 
    paddingHorizontal: 12,
    height: 40,
  },
  urlDisplay: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center',
    marginRight: 10
  },
  urlText: { 
    color: '#D1FAE5', 
    fontSize: 12, 
    marginLeft: 8,
    fontWeight: '500'
  },
  refreshSmall: {
    padding: 4
  },
  progressContainer: { 
    height: 3, 
    width: '100%', 
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 100
  },
  progressBar: { 
    height: '100%', 
    backgroundColor: '#4ADE80' 
  },
  webContainer: { 
    flex: 1, 
    backgroundColor: '#FFF',
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35,
    overflow: 'hidden',
    marginTop: 6, 
  },
  loader: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFF' 
  },
  floatingNavContainer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 0, 
    right: 0, 
    alignItems: 'center' 
  },
  navCapsule: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    width: width * 0.55, 
    height: 55, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  navAction: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
  mainAction: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    backgroundColor: '#1B4332', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});

export default ModernWebScreen;



 






 
import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, 
  ActivityIndicator, LayoutAnimation, Platform, UIManager 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// Services & Components
import Apiservice from "../../../common/Services/ApiService";
import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import SessionService from '../../../common/Services/SessionService';
import colors from '../../../common/config/colors';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Chapter = () => {
  const route = useRoute();
  const { courseId } = route.params;
  const [expandedId, setExpandedId] = useState(null);
  const [syllabusData, setSyllabusData] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleExpand = (id) => {
    // Smooth transition for opening/closing
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  useEffect(() => {
    async function fetchSyllabus() {
      setLoading(true);
      const apiList = getApiList();
      try {
        const payload = { Course_Id: courseId };
        const courseChepterApi = apiList?.getCourseChapterListToApp;

        const response = await Apiservice.request({
          endpoint: courseChepterApi,
          payload,
          method: 'POST',
        });

        const apiChapters = response?.data?.ChapterListResponse?.ChapterList;

        if (apiChapters && apiChapters.length > 0) {
          const mappedData = apiChapters.map(chap => ({
            id: chap.Id,
            chapter: chap.Name,
          }));
          setSyllabusData(mappedData);
        }
      } catch (error) {
        console.error('Error fetching syllabus:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSyllabus();
  }, [courseId]);

  const renderItem = ({ item, index }) => {
    const isExpanded = item.id === expandedId;

    // Formatting Logic
    const capitalizeWords = (text) => text.replace(/\b\w/g, (c) => c.toUpperCase());
    
    let chapterTitle = item.chapter;
    let bullets = [];

    const separators = ['--', '-'];
    for (const sep of separators) {
      if (item.chapter.includes(sep)) {
        const parts = item.chapter.split(sep);
        chapterTitle = capitalizeWords(parts[0].trim());
        bullets = parts[1].split(',').map(b => capitalizeWords(b.trim()));
        break;
      }
    }

    return (
      <View style={[styles.cardContainer, isExpanded && styles.activeCardContainer]}>
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={styles.cardHeader} 
          onPress={() => toggleExpand(item.id)}
        >
          <View style={styles.indexCircle}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.chapterTitle, isExpanded && styles.activeTitle]}>
              {chapterTitle}
            </Text>
          </View>

          <FontAwesome6
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={isExpanded ? colors.footercolor : "#999"}
            style={styles.icon}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {bullets.length > 0 ? (
              bullets.map((bullet, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <View style={styles.dot} />
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDetails}>Details coming soon...</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Course Content" />
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.footercolor} />
          <Text style={styles.loadingText}>Preparing Syllabus...</Text>
        </View>
      ) : (
        <FlatList
          data={syllabusData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <FontAwesome6 name="book-open" size={50} color="#DDD" />
              <Text style={styles.emptyText}>No chapters found for this course.</Text>
            </View>
          }
        />
      )}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  listContainer: { padding: 16, paddingBottom: 100 },
  
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  activeCardContainer: {
    borderColor: colors.footercolor,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  indexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.footercolor,
  },
  textContainer: { flex: 1 },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    lineHeight: 20,
  },
  activeTitle: {
    color: colors.footercolor,
  },
  expandedContent: {
    backgroundColor: '#F9FAFF',
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.footercolor,
    marginTop: 6,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    flex: 1,
  },
  noDetails: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  loadingText: { marginTop: 10, color: '#666' },
  emptyText: { marginTop: 10, color: '#AAA' },
  icon: { marginLeft: 10 },
});

export default Chapter;















// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';





// import alertService from '../../../common/Services/alert/AlertService';
// import Apiservice from "../../../common/Services/ApiService"
// // import requestAndroidPermission from "../../../common/Services/requestStoragePermission"
// import getApiList from "../../config/Api/ApiList";
// import Header from "../../layout/Header/Header2";
// import Footer from "../../layout/Footer/Footer";
// import { HttpService } from "../../../common/Services/HttpService";
// import SessionService from '../../../common/Services/SessionService';
// import colors from '../../../common/config/colors';


// const Chapter = () => {
//   const route = useRoute();
//   const { courseId } = route.params;
//   const [expandedId, setExpandedId] = useState(null);
//   const [syllabusData, setSyllabusData] = useState([]);

//   const toggleExpand = (id) => {
//     setExpandedId(prevId => (prevId === id ? null : id));
//   };

//   useEffect(() => {
//     async function fetchSyllabus() {
//       const apiList = getApiList();
//       const sessionData = SessionService.getSession();

//       try {
//         const payload = { Course_Id: courseId };
//         const courseChepterApi = apiList?.getCourseChapterListToApp;

//         const response = await Apiservice.request({
//           endpoint: courseChepterApi,
//           payload,
//           method: 'POST',
//         });

//         const apiChapters = response?.data?.ChapterListResponse?.ChapterList;

//         if (apiChapters && apiChapters.length > 0) {
//           const mappedData = apiChapters.map(chap => ({
//             id: chap.Id,
//             chapter: chap.Name,
//           }));
//           setSyllabusData(mappedData);
//         } else {
//           // setSyllabusData(defaultSyllabus);
//         }

//       } catch (error) {
//         console.error('Error fetching syllabus:', error);
//         // setSyllabusData(defaultSyllabus);
//       }
//     }

//     fetchSyllabus();
//   }, [courseId]);

//   const renderItem = ({ item }) => {
//     const isExpanded = item.id === expandedId;

//     const capitalizeWords = (text) => {
//       return text.replace(/\b\w/g, (char) => char.toUpperCase());
//     };

//     let chapterTitle = item.chapter;
//     let bullets = [];

//     if (item.chapter.includes('--')) {
//       const parts = item.chapter.split('--');
//       chapterTitle = capitalizeWords(parts[0].trim());
//       bullets = parts[1].split(',').map(b => capitalizeWords(b.trim()));
//     } else if (item.chapter.includes('-')) {
//       const parts = item.chapter.split('-');
//       chapterTitle = capitalizeWords(parts[0].trim());
//       bullets = parts[1].split(',').map(b => capitalizeWords(b.trim()));
//     }

//     return (
//       <TouchableOpacity style={styles.card} onPress={() => toggleExpand(item.id)}>
//         <View style={styles.textContainer}>
//           <Text style={styles.chapterTitle}>{chapterTitle}</Text>

//           {isExpanded && bullets.length > 0 && (
//             <View style={{ marginTop: 8 }}>
//               {bullets.map((bullet, index) => (
//                 <Text key={index} style={styles.bulletPoint}>
//                   • {bullet}
//                 </Text>
//               ))}
//             </View>
//           )}
//         </View>

//         <FontAwesome6
//           name={isExpanded ? 'chevron-up' : 'chevron-down'}
//           size={20}
//           color="#ffffffff"
//           style={styles.icon}
//         />
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="📘 Syllabus" />
//       <FlatList
//         data={syllabusData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={{ padding: 16 }}
//       />
//       <Footer />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FEFAE0' },
//   header: { backgroundColor: '#6c63ff', paddingVertical: 18, paddingHorizontal: 16, elevation: 4 },
//   headerText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
//   card: {
//     backgroundColor:colors.footercolor,
//     // borderWidth: 1,
//     // borderColor: '#3A98B9',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//   },

//   textContainer: { flex: 1, paddingRight: 10 },
//   chapterTitle: {
//     fontSize: 18, fontWeight: 'bold', color: '#ff3b0aff'
//   },
//   bulletPoint: {
//     fontSize: 16,
//     color:colors.background,
//     marginLeft: 10,
//     marginBottom: 4,
//     lineHeight: 20,
//     //  backgroundColor:'red'
//   },
//   icon: { marginLeft: 10, marginTop: 4 },
// });

// export default Chapter;

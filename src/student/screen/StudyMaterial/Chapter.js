import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';





import alertService from '../../../common/Services/alert/AlertService';
import Apiservice from "../../../common/Services/ApiService"
// import requestAndroidPermission from "../../../common/Services/requestStoragePermission"
import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import { HttpService } from "../../../common/Services/HttpService";
import SessionService from '../../../common/Services/SessionService';


const Chapter = () => {
  const route = useRoute();
  const { courseId } = route.params;
  const [expandedId, setExpandedId] = useState(null);
  const [syllabusData, setSyllabusData] = useState([]);

  const toggleExpand = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  useEffect(() => {
    async function fetchSyllabus() {
      const apiList = getApiList();
      const sessionData = SessionService.getSession();

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
        } else {
          // setSyllabusData(defaultSyllabus);
        }

      } catch (error) {
        console.error('Error fetching syllabus:', error);
        // setSyllabusData(defaultSyllabus);
      }
    }

    fetchSyllabus();
  }, [courseId]);

  const renderItem = ({ item }) => {
    const isExpanded = item.id === expandedId;

    const capitalizeWords = (text) => {
      return text.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    let chapterTitle = item.chapter;
    let bullets = [];

    if (item.chapter.includes('--')) {
      const parts = item.chapter.split('--');
      chapterTitle = capitalizeWords(parts[0].trim());
      bullets = parts[1].split(',').map(b => capitalizeWords(b.trim()));
    } else if (item.chapter.includes('-')) {
      const parts = item.chapter.split('-');
      chapterTitle = capitalizeWords(parts[0].trim());
      bullets = parts[1].split(',').map(b => capitalizeWords(b.trim()));
    }

    return (
      <TouchableOpacity style={styles.card} onPress={() => toggleExpand(item.id)}>
        <View style={styles.textContainer}>
          <Text style={styles.chapterTitle}>{chapterTitle}</Text>

          {isExpanded && bullets.length > 0 && (
            <View style={{ marginTop: 8 }}>
              {bullets.map((bullet, index) => (
                <Text key={index} style={styles.bulletPoint}>
                  • {bullet}
                </Text>
              ))}
            </View>
          )}
        </View>

        <FontAwesome6
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#006c04ff"
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="📘 Syllabus" />
      <FlatList
        data={syllabusData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#6c63ff', paddingVertical: 18, paddingHorizontal: 16, elevation: 4 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  card: {
    backgroundColor: '#fceade',
    borderWidth: 1,
    borderColor: '#fca311',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  textContainer: { flex: 1, paddingRight: 10 },
  chapterTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#003d23ff'
  },
  bulletPoint: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
    marginBottom: 4,
    lineHeight: 20,
    //  backgroundColor:'red'
  },
  icon: { marginLeft: 10, marginTop: 4 },
});

export default Chapter;

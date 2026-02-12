import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, 
  ActivityIndicator, FlatList, SafeAreaView, Dimensions, 
  Platform, StatusBar 
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

import Header from '../layout/Header/Header';
import FooterNav from '../layout/Footer/Footer';
import SessionService from "../../common/Services/SessionService";
import getAdminApiList from '../config/Api/adminApiList';
import { HttpService } from "../../common/Services/HttpService";
import { downloadFile } from "../../common/Services/pdfService";
import alertService from '../../common/Services/alert/AlertService';
import { API_BASE_URL } from '../../common/config/BaseUrl';
import colors from '../../common/config/colors';

const { width } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

const StudyMaterials = () => {
  const navigation = useNavigation();
  const [courseslist, setCourseslist] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const getStudyMaterial = useCallback(async () => {
    try {
      setLoading(true);
      const getStudyMaterialListApi = getAdminApiList().getStudyMaterialList;
      const sessionData = await SessionService.getSession();
      const profile = sessionData?.LoginDetail?.[0];
      const payload = { 
        emp_id: profile.Emp_Id, 
        course_id: profile.Emp_Id, 
        start_row_count: '', 
        limit_row_count: '' 
      };
   
      const response = await HttpService.post(getStudyMaterialListApi, payload);
      // console.log(response,"response for study");
      setCourseslist(response?.data.StudyMaterialList || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load materials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { getStudyMaterial(); }, [getStudyMaterial]);

  const handleDownloadPDF = async (studyMaterialFile) => {
    setLoading(true);
    try {
      // const filePath = API_BASE_URL + '/' + studyMaterialFile;
      // if (filePath) {
      //   await downloadFile(filePath, `${studyMaterialFile.split('/').pop()}`);
      // } else {
      //   alertService.show({ title: 'Error', message: 'No file available.', type: 'warning' });
      // }

    if (studyMaterialFile && studyMaterialFile.trim() !== "") {
      const filePath = `${API_BASE_URL}/${studyMaterialFile}`;
      const fileName = studyMaterialFile.split('/').pop();
      await downloadFile(filePath, fileName);
    } else {
      alertService.show({
        title: 'Error',
        message: 'No file available.',
        type: 'warning'
      });
    }

    } catch (error) {
      Alert.alert('Download Failed', error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const filteredList = courseslist.filter(item => {
    if (selectedFilter === 'All') return true;
    return item.File_Type_Name === selectedFilter;
  });

  const renderItem = ({ item }) => {
    const isPDF = item.File_Type_Name === 'PDF';
    const itemId = item.Study_Material_ID.toString();

    return (
      <View style={styles.card}>
        <View style={styles.cardMain}>
          <View style={[styles.iconContainer, { backgroundColor: isPDF ? '#FFF1F0' : '#E6F4FF' }]}>
            <FontAwesome6 
              name={isPDF ? "file-pdf" : "file-word"} 
              size={scale(24)} 
              color={isPDF ? "#E53935" : "#1890FF"} 
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.courseTag}>{item.Course_Code}</Text>
            <Text style={styles.materialTitle} numberOfLines={2}>
              {item.Study_Material_Title || "Learning Resource"}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.langBadge}>
                <Text style={styles.langText}>{item.Content_Language || 'English'}</Text>
              </View>
              <Text style={styles.creationDate}>{item.Created_Date || 'Recently'}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.downloadBtn} 
            onPress={() => handleDownloadPDF(item.Study_Material_File)}
          >
            <FontAwesome6 name="cloud-arrow-down" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerStats}>
            <TouchableOpacity style={styles.statItem}>
              <FontAwesome6 name="heart" size={14} color="#90A4AE" />
              <Text style={styles.statText}>{item.mlike || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <FontAwesome6 name="comment-dots" size={14} color="#90A4AE" />
              <Text style={styles.statText}>{item.comments || 0}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.typeTag}>
            <Text style={styles.typeTabText}>{item.File_Type_Name}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      <Header />
      
      <View style={styles.headerSection}>
        <View style={styles.titleRow}>
          <Text style={styles.mainTitle}>Study Materials</Text>
          <TouchableOpacity 
            style={styles.miniFab} 
            onPress={() => navigation.navigate('StudyDash')}
          >
            <FontAwesome6 name="plus" size={14} color="#FFF" />
            <Text style={styles.miniFabText}>Upload</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {['All', 'PDF', 'MS Word'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setSelectedFilter(cat)}
              style={[styles.filterChip, selectedFilter === cat && styles.activeFilterChip]}
            >
              <Text style={[styles.filterText, selectedFilter === cat && styles.activeFilterText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1A237E" />
            <Text style={styles.loadingText}>Fetching Resources...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredList}
            renderItem={renderItem}
            keyExtractor={(item) => item.Study_Material_ID.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <FooterNav />
    </SafeAreaView>
  );
};

export default StudyMaterials;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FE' },
  container: { flex: 1 },
  
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mainTitle: {
    fontSize: scale(20),
    fontWeight: '800',
    color: '#1A237E',
  },
  miniFab: {
    backgroundColor: '#1A237E',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
  },
  miniFabText: { color: '#FFF', fontWeight: 'bold', marginLeft: 6, fontSize: 12 },

  filterContainer: { flexDirection: 'row', gap: 10 },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E8EF',
  },
  activeFilterChip: { backgroundColor: '#1A237E', borderColor: '#1A237E' },
  filterText: { color: '#64748B', fontWeight: '600', fontSize: 13 },
  activeFilterText: { color: '#FFF' },

  listContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 5 },

  // Card Design
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1A237E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: scale(52),
    height: scale(52),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: { flex: 1, marginLeft: 16 },
  courseTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3949AB',
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  materialTitle: { fontSize: scale(15), fontWeight: '700', color: '#1E293B' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  langBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  langText: { fontSize: 10, color: '#475569', fontWeight: '700' },
  creationDate: { fontSize: 11, color: '#94A3B8', marginLeft: 10 },
  
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerStats: { flexDirection: 'row', gap: 15 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  typeTag: { backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  typeTabText: { fontSize: 9, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' },

  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  loadingText: { marginTop: 15, color: '#64748B', fontSize: 14, fontWeight: '600' }
});

















 
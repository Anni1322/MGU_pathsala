import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Header from '../layout/Header/Header';
import FooterNav from '../layout/Footer/Footer';
import SessionService from "../../common/Services/SessionService";
import getAdminApiList from '../config/Api/adminApiList';
import { HttpService } from "../../common/Services/HttpService";
import { useRoute, useNavigation } from '@react-navigation/native';
import { downloadFile } from "../../common/Services/pdfService";
import alertService from '../../common/Services/alert/AlertService';
import { API_BASE_URL } from '../../common/config/BaseUrl';
import colors from '../../common/config/colors';
import CustomRefreshControl from '../../common/RefreshControl';

const StudyMaterials = () => {
  const navigation = useNavigation();
  const [courseslist, setCourseslist] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    if (courseslist.length > 0) {
      const initialLikes = {};
      const initialComments = {};
      courseslist?.forEach(item => {
        const itemId = item.Study_Material_ID.toString();
        initialLikes[itemId] = parseInt(item.mlike) || 0;
        initialComments[itemId] = parseInt(item.comments) || 0;
      });
      setLikes(initialLikes);
      setComments(initialComments);
    }
  }, [courseslist]);

  const handleLike = useCallback((itemId) => {
    const updatedLikes = { ...likes, [itemId]: (likes[itemId] || 0) + 1 };
    setLikes(updatedLikes);
    Alert.alert('Liked!', `Total Likes: ${updatedLikes[itemId]}`);
  }, [likes]);

  const handleComment = useCallback((itemId) => {
    const updatedComments = { ...comments, [itemId]: (comments[itemId] || 0) + 1 };
    setComments(updatedComments);
    Alert.alert('Commented!', `Total Comments: ${updatedComments[itemId]}`);
  }, [comments]);

  const handleDownload = useCallback((file) => {
    Alert.alert('Download Started', `Downloading: ${file}`);
  }, []);

  const handleDownloadPDF = async (studyMaterialFile) => {
    console.log(studyMaterialFile, "Study Material File");
    setLoading(true);
    try {
      const filePath = API_BASE_URL + '/' + studyMaterialFile;
      console.log(filePath,"test file path")
      if (filePath) {
        // await downloadFile(filePath, `${studyMaterialFile.split('/').pop()}`);
        await downloadFile(filePath, `${studyMaterialFile.split('/').pop()}`);
      } else {
        alertService.show({
          title: 'Error',
          message: 'No file available to download.',
          type: 'warning',
        });
      }
    } catch (error) {
      Alert.alert('Download Failed', error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const GettudyMaterial = useCallback(async () => {
    try {
      setLoading(true);
      const getStudyMaterialListApi = getAdminApiList().getStudyMaterialList;
      if (!getStudyMaterialListApi) throw new Error("API endpoint not found.");

      const sessionData = await SessionService.getSession();
      const profile = sessionData?.LoginDetail?.[0];
      const payload = {
        emp_id: profile.Emp_Id,
        course_id: profile.Emp_Id,  //^todo
        start_row_count: '',
        limit_row_count: '',
      };
      const response = await HttpService.post(getStudyMaterialListApi, payload);
      setCourseslist(response?.data.StudyMaterialList || []);
    } catch (error) {
      Alert.alert("Failed to Load Study Materials", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    GettudyMaterial();  
  }, [GettudyMaterial]);

  const filteredList = courseslist.filter(item => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'PDF') return item.File_Type_Name === 'PDF';
    if (selectedFilter === 'MS Word') return item.File_Type_Name === 'MS Word';
    if (selectedFilter === 'English') return item.Content_Language === 'English';
    if (selectedFilter === 'Unspecified') return item.Content_Language === 'Unspecified';
    return false;
  });

  // Table Header Component
  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableCell, styles.headerCell]}>S.No.</Text>
      {/* <Text style={[styles.tableCell, styles.headerCell]}>Title</Text> */}
      <Text style={[styles.tableCell, styles.headerCell]}>Course Code</Text>
      <Text style={[styles.tableCell, styles.headerCell]}>Language</Text>
      <Text style={[styles.tableCell, styles.headerCell]}>File Type</Text>
      {/* <Text style={[styles.tableCell, styles.headerCell]}> </Text> */}
      {/* <Text style={[styles.tableCell, styles.headerCell]}>Created Date</Text> */}
      <Text style={[styles.tableCell, styles.headerCell]}>Actions</Text>
    </View>
  );

  return (
    <View style={styles.body}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.header}>Study Materials</Text>

        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'All' && styles.selectedButton]}
            onPress={() => setSelectedFilter('All')}>
            <Text>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'PDF' && styles.selectedButton]}
            onPress={() => setSelectedFilter('PDF')}>
            <Text>PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'MS Word' && styles.selectedButton]}
            onPress={() => setSelectedFilter('MS Word')}>
            <Text>MS Word</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'English' && styles.selectedButton]}
            onPress={() => setSelectedFilter('English')}>
            <Text>English</Text>
          </TouchableOpacity> */}

          
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
        ) : (
          <ScrollView horizontal>
            <View>
              <TableHeader />
              <FlatList
                data={filteredList}
                keyExtractor={(item) => item.Study_Material_ID.toString()}
                contentContainerStyle={styles.materialList}
                renderItem={({ item, index }) => {
                  const itemId = item.Study_Material_ID.toString();
                  return (
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>{index + 1}</Text>
                      {/* <Text style={styles.tableCell}>{item?.Study_Material_Title ?? "Untitled"}</Text> */}
                      <Text style={styles.tableCell}>{item?.Course_Code ?? "N/A"}</Text>
                      <Text style={styles.tableCell}>{item?.Content_Language ?? ""}</Text>
                      <Text style={styles.tableCell}>{item?.File_Type_Name ?? ""}</Text>
                      {/* <Text style={styles.tableCell}>{item?.Created_Date ?? "Unknown"}</Text> */}
                      <View style={styles.tableCell}>
                        <View style={styles.cardActions}>
                          <TouchableOpacity
                            style={styles.actionIcon}
                            onPress={() => handleDownloadPDF(item.Study_Material_File)}>
                            <FontAwesome6 name="download" solid size={20} color={colors.header} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionIcon}
                            onPress={() => handleLike(itemId)}>
                            <FontAwesome6 name="heart" solid size={20} color={colors.header} />
                            <Text style={styles.counter}>{likes[itemId] || 0}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionIcon}
                            onPress={() => handleComment(itemId)}>
                            <FontAwesome6 name="comment" solid size={20} color={colors.header} />
                            <Text style={styles.counter}>{comments[itemId] || 0}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          </ScrollView>
        )}

        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('StudyDash')}>
          <FontAwesome6 name="plus" solid size={26} color="#ffffffff" />
          {/* <Text style={styles.fabText}>Upload</Text> */}
        </TouchableOpacity>
      </View>
      <FooterNav />
    </View>
  );
};

export default StudyMaterials;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#F5EFE6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5EFE6',
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  header: {
    padding: 8,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#ffffffff',
    backgroundColor: "#1a04507a",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff'
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: '#ffeee8ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
    color: '#007aff',
    margin: 2,
  },
  selectedButton: {
    backgroundColor: '#ffcab6ff',
  },
  materialList: {
    paddingBottom: 100,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor:"#1a04507a",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius:10
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    // flex: 1,
    // marginLeft:'auto',
    // paddingHorizontal: 5,
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
    // minWidth: '70', 
    width:80,
    margin:2 
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#fff',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  counter: {
    fontSize: 10,
    color: '#444',
    marginLeft: 2,
  },
fab: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  backgroundColor: '#705101c3',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',  
  width: 80,  
  height: 80, 
  borderRadius: 50,  
  elevation: 55,
  paddingHorizontal: 15,
  paddingVertical: 15,  
},

  fabText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 13,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});









 
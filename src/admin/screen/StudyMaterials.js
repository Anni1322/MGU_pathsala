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
      <Text style={[styles.tableCell, styles.headerCell]}> </Text>
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
                            <FontAwesome6 name="download" solid size={20} color={colors.dangerD} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionIcon}
                            onPress={() => handleLike(itemId)}>
                            <FontAwesome6 name="heart" solid size={20} color={colors.dangerD} />
                            <Text style={styles.counter}>{likes[itemId] || 0}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionIcon}
                            onPress={() => handleComment(itemId)}>
                            <FontAwesome6 name="comment" solid size={20} color={colors.dangerD} />
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
    backgroundColor: colors.bgcolor,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff'
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: '#e0ebff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
    color: '#007aff',
    margin: 2,
  },
  selectedButton: {
    backgroundColor: '#007aff',
  },
  materialList: {
    paddingBottom: 100,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.bgcolor,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
    minWidth: 80, // Ensure minimum width for readability
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












// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from "../../common/Services/SessionService";
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from "../../common/Services/HttpService";
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { downloadFile } from "../../common/Services/pdfService";
// import alertService from '../../common/Services/alert/AlertService';
// import { API_BASE_URL } from '../../common/config/BaseUrl';
// import colors from '../../common/config/colors';
// import CustomRefreshControl from '../../common/RefreshControl';

// const StudyMaterials = () => {
//   const navigation = useNavigation();
//   const [courseslist, setCourseslist] = useState([]);
//   const [likes, setLikes] = useState({});
//   const [comments, setComments] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState('All');

//   useEffect(() => {
//     if (courseslist.length > 0) {
//       const initialLikes = {};
//       const initialComments = {};
//       courseslist?.forEach(item => {
//         const itemId = item.Study_Material_Id || item.Study_Material_Title;
//         initialLikes[itemId] = likes[itemId] || 0;
//         initialComments[itemId] = comments[itemId] || 0;
//       });
//       setLikes(initialLikes);
//       setComments(initialComments);
//     }
//   }, [courseslist]);

//   const handleLike = useCallback((itemId) => {
//     const updatedLikes = { ...likes, [itemId]: (likes[itemId] || 0) + 1 };
//     setLikes(updatedLikes);
//     Alert.alert('Liked!', `Total Likes: ${updatedLikes[itemId]}`);
//   }, [likes]);

//   const handleComment = useCallback((itemId) => {
//     const updatedComments = { ...comments, [itemId]: (comments[itemId] || 0) + 1 };
//     setComments(updatedComments);
//     Alert.alert('Commented!', `Total Comments: ${updatedComments[itemId]}`);
//   }, [comments]);

//   const handleDownload = useCallback((file) => {
//     Alert.alert('Download Started', `Downloading: ${file}`);
//   }, []);

 
//   const handleDownloadPDF = async (studyMaterialFile) => {
//     console.log(studyMaterialFile, "Study Material File");
//     setLoading(true);
//     try {
//       // Assuming the file path is directly available or fetched via API. Adjust as per your API.
//       const filePath = API_BASE_URL + '/' + studyMaterialFile; // Adjust based on actual response
//       if (filePath) {
//         await downloadFile(filePath, `${studyMaterialFile}.pdf`); // Adjust file name
//       } else {
//         alertService.show({
//           title: 'Error',
//           message: 'No file available to download.',
//           type: 'warning',
//         });
//       }
//     } catch (error) {
//       Alert.alert('Download Failed', error?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCourseCodeList = useCallback(async () => {
//     try {
//       setLoading(true);
//       const courseApi = getAdminApiList().getCourseCodeList;
//       if (!courseApi) throw new Error("API endpoint not found.");

//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const payload = {
//         Emp_id: profile.Emp_Id,
//       };
//       const response = await HttpService.post(courseApi, payload);
//       setCourseslist(response?.data.CourseCodeList || []);
//     } catch (error) {
//       Alert.alert("Failed to Load Courses", error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const GettudyMaterial = useCallback(async () => {
//     try {
//       setLoading(true);
//       const getStudyMaterialListApi = getAdminApiList().getStudyMaterialList;
//       if (!getStudyMaterialListApi) throw new Error("API endpoint not found.");

//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const payload = {
//         emp_id: profile.Emp_Id,
//         course_id: profile.Emp_Id,
//         start_row_count: '',
//         limit_row_count: '',
//       };
//       const response = await HttpService.post(getStudyMaterialListApi, payload);
//       setCourseslist(response?.data.CourseCodeList || []);
//     } catch (error) {
//       Alert.alert("Failed to Load Courses", error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     getCourseCodeList();
//   }, [getCourseCodeList]);

//   const filteredList = courseslist.filter(item => {
//     if (selectedFilter === 'All') return true;
//     if (selectedFilter === 'DegreeProgramme') return !!item.Degree_Programme_Short_Name_E;
//     if (selectedFilter === 'Course_Year') return !!item.Course_Year;
//     if (selectedFilter === 'Semester') return !!item.Semester;
//     if (selectedFilter === 'Date') return !!item.Date;
//     if (selectedFilter === 'Content_Language') return !!item.Content_Language;
//     if (selectedFilter === 'File_Type') return !!item.File_Type;
//     if (selectedFilter === 'Instruction') return !!item.Instruction;
//     return false;
//   });

//   // Table Header Component
//   const TableHeader = () => (
//     <View style={styles.tableHeader}>
//       {/* <Text style={[styles.tableCell, styles.headerCell]}>Title</Text> */}
//       <Text style={[styles.tableCell, styles.headerCell]}>Course Code</Text>
//       {/* <Text style={[styles.tableCell, styles.headerCell]}>Degree Programme</Text> */}
//       {/* <Text style={[styles.tableCell, styles.headerCell]}>Year</Text> */}
//       {/* <Text style={[styles.tableCell, styles.headerCell]}>Semester</Text> */}
//       <Text style={[styles.tableCell, styles.headerCell]}>Language</Text>
//       {/* <Text style={[styles.tableCell, styles.headerCell]}>Uploaded Date</Text> */}
//       <Text style={[styles.tableCell, styles.headerCell]}>Actions</Text>
//     </View>
//   );

//   return (
//     <View style={styles.body}>
//       <Header />
//       <View style={styles.container}>
//         <Text style={styles.header}>Study Materials</Text>

//         <View style={styles.filters}>
//           <TouchableOpacity
//             style={[styles.filterButton, selectedFilter === 'All' && styles.selectedButton]}
//             onPress={() => setSelectedFilter('All')}>
//             <Text>All</Text>
//           </TouchableOpacity>
//           {/* Add more filter buttons if needed */}
//         </View>

//         {loading ? (
//           <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
//         ) : (
//           <ScrollView >
//             <View>
//               <TableHeader />
//               <FlatList
//                 data={filteredList}
//                 keyExtractor={(item, index) =>
//                   item.Study_Material_Id
//                     ? item.Study_Material_Id.toString()
//                     : `${item.Study_Material_Title}_${index}`
//                 }
//                 contentContainerStyle={styles.materialList}
//                 renderItem={({ item }) => {
//                   const itemId = item.Study_Material_Id || item.Study_Material_Title;
//                   return (
//                     <View style={styles.tableRow}>
//                       {/* <Text style={styles.tableCell}>{item?.Study_Material_Title ?? "Untitled"}</Text> */}
//                       <Text style={styles.tableCell}>{item?.Course_Code ?? "N/A"}</Text>
//                       {/* <Text style={styles.tableCell}>{item?.Degree_Programme_Short_Name_E ?? ""}</Text> */}
//                       {/* <Text style={styles.tableCell}>{item?.Course_Year_Name_E ?? ""}</Text> */}
//                       {/* <Text style={styles.tableCell}>{item?.Semester_Name_E ?? ""}</Text> */}
//                       <Text style={styles.tableCell}>{item?.Content_Language ?? ""}</Text>
//                       {/* <Text style={styles.tableCell}>{item?.Created_Date ?? "Unknown"}</Text> */}
//                       <View style={styles.tableCell}>
//                         <View style={styles.cardActions}>
//                           <TouchableOpacity
//                             style={styles.actionIcon}
//                             onPress={() => handleDownloadPDF(item.Study_Material_File)}>
//                             <FontAwesome6 name="download" solid size={20} color={colors.dangerD} />
//                           </TouchableOpacity>
//                           <TouchableOpacity
//                             style={styles.actionIcon}
//                             onPress={() => handleLike(itemId)}>
//                             <FontAwesome6 name="heart" solid size={20} color={colors.dangerD} />
//                             <Text style={styles.counter}>{likes[itemId] || 0}</Text>
//                           </TouchableOpacity>
//                           <TouchableOpacity
//                             style={styles.actionIcon}
//                             onPress={() => handleComment(itemId)}>
//                             <FontAwesome6 name="comment" solid size={20} color={colors.dangerD} />
//                             <Text style={styles.counter}>{comments[itemId] || 0}</Text>
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     </View>
//                   );
//                 }}
//               />
//             </View>
//           </ScrollView>
//         )}

//         <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('StudyDash')}>
//           <FontAwesome6 name="plus" solid size={16} color="#fff" />
//           <Text style={styles.fabText}>Upload</Text>
//         </TouchableOpacity>
//       </View>
//       <FooterNav />
//     </View>
//   );
// };

// export default StudyMaterials;

// const styles = StyleSheet.create({
//   body: {
//     flex: 1,
//     backgroundColor: '#F5EFE6',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#F5EFE6',
//     paddingTop: 10,
//     paddingHorizontal: 15,
//   },
//   header: {
//     padding: 8,
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#ffffffff',
//     backgroundColor: colors.bgcolor,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#fff'
//   },
//   filters: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 10,
//   },
//   filterButton: {
//     backgroundColor: '#e0ebff',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     fontSize: 14,
//     color: '#007aff',
//   },
//   selectedButton: {
//     backgroundColor: '#007aff',
//   },
//   materialList: {
//     paddingBottom: 100,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: colors.bgcolor,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     backgroundColor: '#ffffffff',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   tableCell: {
//     flex: 1,
//     paddingHorizontal: 5,
//     textAlign: 'center',
//     fontSize: 12,
//     color: '#333',
//   },
//   headerCell: {
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   cardActions: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   actionIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   counter: {
//     fontSize: 10,
//     color: '#444',
//     marginLeft: 2,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: '#017016c3',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 30,
//     elevation: 5,
//   },
//   fabText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontSize: 13,
//     fontWeight: 'bold',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

















// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from "../../common/Services/SessionService";
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from "../../common/Services/HttpService";
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { downloadFile } from "../../common/Services/pdfService";
// import alertService from '../../common/Services/alert/AlertService';
// import { API_BASE_URL } from '../../common/config/BaseUrl';
// import colors from '../../common/config/colors';
// import CustomRefreshControl from '../../common/RefreshControl'


// const StudyMaterials = () => {
//   const navigation = useNavigation();
//   const [courseslist, setCourseslist] = useState([]);
//   const [likes, setLikes] = useState({});
//   const [comments, setComments] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState('All');

 
//   useEffect(() => {
//     if (courseslist.length > 0) {
//       const initialLikes = {};
//       const initialComments = {};
//       courseslist?.forEach(item => {
//         const itemId = item.Study_Material_Id || item.Study_Material_Title;
//         initialLikes[itemId] = likes[itemId] || 0;
//         initialComments[itemId] = comments[itemId] || 0;
//       });
//       setLikes(initialLikes);
//       setComments(initialComments);
//     }
//   }, [courseslist]);

//   const handleLike = useCallback((itemId) => {
//     const updatedLikes = { ...likes, [itemId]: (likes[itemId] || 0) + 1 };
//     setLikes(updatedLikes);
//     Alert.alert('Liked!', `Total Likes: ${updatedLikes[itemId]}`);
//   }, [likes]);

//   const handleComment = useCallback((itemId) => {
//     const updatedComments = { ...comments, [itemId]: (comments[itemId] || 0) + 1 };
//     setComments(updatedComments);
//     Alert.alert('Commented!', `Total Comments: ${updatedComments[itemId]}`);
//   }, [comments]);

//   const handleDownload = useCallback((file) => {
//     Alert.alert('Download Started', `Downloading: ${file}`);
//   }, []);


//   const handleDownloadPDF = async StudyMaterials => {
//     console.log(StudyMaterials, "StudyMaterials")
//     setLoading(true);
//     try {
//       const sessionData = await SessionService.getSession();
//       const payload = {
//         STUDENT_ID: sessionData?.STUDENT_ID,
//       };
//       const apiList = getApiList();
//       const DownloadFeeReceiptAPI = apiList.DownloadFeeReceiptt;
//       if (!DownloadFeeReceiptAPI)
//         throw new Error('Fees Receipt endpoint not found.');
//       const response = await HttpService.post(DownloadFeeReceiptAPI, payload);
//       const filePath = API_BASE_URL + '/' + response?.data?.Response[0]?.FilePath;

//       if (filePath) {
//         setLoading(true);
//         await downloadFile(filePath, `${receipt?.Receipt_No}Semester_Examfees.pdf`);
//         setLoading(false);
//       } else {
//         console.error('No file path returned from API.');
//         alertService.show({
//           title: 'Error',
//           message: 'No file available to download.',
//           type: 'warning',
//         });
//       }

//       return response?.data?.FeeReceiptList || [];
//     } catch (error) {
//       Alert.alert(
//         'Fees Receipt Fetch Failed',
//         error?.message || 'Something went wrong',
//       );
//       throw error;
//     }
//     setLoading(false);
//   };


//   const getCourseCodeList = useCallback(async () => {
//     try {
//       setLoading(true);
//       const courseApi = getAdminApiList().getCourseCodeList;
//       if (!courseApi) throw new Error("API endpoint not found.");

//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const payload = {
//         Emp_id: profile.Emp_Id,
//       };
//       const response = await HttpService.post(courseApi, payload);
//       setCourseslist(response?.data.CourseCodeList || []);
//     } catch (error) {
//       Alert.alert("Failed to Load Courses", error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);


//   const GettudyMaterial = useCallback(async () => {
//     try {
//       setLoading(true);
//       const getStudyMaterialListApi = getAdminApiList().getStudyMaterialList;
//       if (!getStudyMaterialListApi) throw new Error("API endpoint not found.");

//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const payload = {
//         emp_id: profile.Emp_Id,
//         course_id: profile.Emp_Id,
//         start_row_count: '',
//         limit_row_count: '',
//       };
//       const response = await HttpService.post(getStudyMaterialListApi, payload);
//       setCourseslist(response?.data.CourseCodeList || []);
//     } catch (error) {
//       Alert.alert("Failed to Load Courses", error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);


//   useEffect(() => {
//     getCourseCodeList();
//   }, [getCourseCodeList]);



//   // Filter the list based on selectedFilter
//   // const filteredList = courseslist.filter(item => {
//   //   if (selectedFilter === 'All') return true; 
//   //   if (selectedFilter === 'Documents') return item.File_Type_Name === 'MS Word';  
//   //   if (selectedFilter === 'Videos') return item.File_Type_Name === 'MP4';  
//   //   if (selectedFilter === 'Quizzes') return item.File_Type_Name === 'Quiz'; 
//   //   if (selectedFilter === 'Resources') return item.File_Type_Name === 'Resource';  
//   //   return false;  
//   // });

//   const filteredList = courseslist.filter(item => {
//     if (selectedFilter === 'All') return true;  // Show all items
//     if (selectedFilter === 'DegreeProgramme') return !!item.Degree_Programme_Short_Name_E;
//     if (selectedFilter === 'Course_Year') return !!item.Course_Year;
//     if (selectedFilter === 'Semester') return !!item.Semester;
//     if (selectedFilter === 'Date') return !!item.Date;
//     if (selectedFilter === 'Content_Language') return !!item.Content_Language;
//     if (selectedFilter === 'File_Type') return !!item.File_Type;
//     if (selectedFilter === 'Instruction') return !!item.Instruction;
//     return false;
//   });

//   return (
//     <View style={styles.body}>
//       <Header />
//       <View style={styles.container}>
//         <Text style={styles.header}>Study Materials</Text>

//         <View style={styles.filters}>
//           <TouchableOpacity
//             style={[styles.filterButton, selectedFilter === 'All' && styles.selectedButton]}
//             onPress={() => setSelectedFilter('All')}>
//             <Text>All</Text>
//           </TouchableOpacity>
//         </View>

//         {loading ? (
//           <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
//         ) : (
//           <FlatList
//             data={filteredList}
            
//             keyExtractor={(item, index) =>
//               item.Study_Material_Id
//                 ? item.Study_Material_Id.toString()
//                 : `${item.Study_Material_Title}_${index}`
//             }
//             contentContainerStyle={styles.materialList}
//             renderItem={({ item }) => {
//               const itemId = item.Study_Material_Id || item.Study_Material_Title;
//               return (
//                 <View style={styles.card}>
//                   {item.icon ? (
//                     <FontAwesome6
//                       name={item.icon}
//                       solid={item.iconType === 'solid'}
//                       size={24}
//                       style={styles.cardIcon} />
//                   ) : null}

//                   <View style={styles.cardContent}>
//                     <View style={styles.headtitleCard}> <Text style={styles.cardLect}>{item?.Study_Material_Title ?? "Untitled"}</Text></View>
//                     <Text style={styles.cardTitle}>Course: {item?.Course_Code ?? "N/A"}  - {item?.Content_Language ?? ""}  </Text>
//                     <Text style={styles.cardDesc}>
//                       {item?.Degree_Programme_Short_Name_E ?? ""}{" "}
//                       {item?.Course_Year_Name_E ?? ""} {item?.Semester_Name_E ?? ""}
//                     </Text>
//                     <Text style={styles.cardDesc}>Uploaded: {item?.Created_Date ?? "Unknown"} </Text>
//                     {/* <Text style={styles.cardMeta}>Uploaded: {item?.Created_Date ?? "Unknown"}</Text> */}
//                     {item?.size ? <Text style={styles.cardMeta}>File Size: {item.size}</Text> : null}
//                     {item?.course ? <Text style={styles.cardMeta}>Course: {item.course}</Text> : null}

//                     <View style={styles.cardActions}>
//                       <TouchableOpacity
//                         style={styles.actionIcon}
//                         onPress={() => handleDownloadPDF(item.Study_Material_File)}>
//                         <FontAwesome6 name="download" solid size={26} color={colors.dangerD} />
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={styles.actionIcon}
//                         onPress={() => handleLike(itemId)}>
//                         <FontAwesome6 name="heart" solid size={26} color={colors.dangerD} />
//                         <Text style={styles.counter}>{likes[itemId] || 0} </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={styles.actionIcon}
//                         onPress={() => handleComment(itemId)}>
//                         <FontAwesome6 name="comment" solid size={26} color={colors.dangerD} />
//                         <Text style={styles.counter}>{comments[itemId] || 0}</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               );
//             }}
//           />
//         )}

//         <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('StudyDash')}>
//           <FontAwesome6 name="plus" solid size={16} color="#fff" />
//           <Text style={styles.fabText}>Upload</Text>
//         </TouchableOpacity>
//       </View>
//       <FooterNav />
//     </View>
//   );
// };

// export default StudyMaterials;


// const styles = StyleSheet.create({
//   body: {
//     flex: 1,
//     backgroundColor: '#F5EFE6',
//     // paddingTop: 50,
//     // paddingHorizontal: 10,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#F5EFE6',
//     paddingTop: 10,
//     paddingHorizontal: 15,
//   },
//   header: {
//     padding: 8,
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#ffffffff',
//     backgroundColor: colors.bgcolor,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#fff'
//   },
//   filters: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 10,
//   },
//   filterButton: {
//     backgroundColor: '#e0ebff',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     fontSize: 14,
//     color: '#007aff',
//   },
//   subFilters: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   subFilter: {
//     backgroundColor: '#dde6f1',
//     padding: 6,
//     borderRadius: 8,
//     fontSize: 12,
//     color: '#333',
//   },
//   materialList: {
//     paddingBottom: 100,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#ffffffff',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//     alignItems: 'flex-start',
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: colors.lite2
//   },
//   cardIcon: {
//     marginRight: 10,
//     marginTop: 4,
//     color: '#007aff',
//   },
//   cardContent: {
//     flex: 1,
//   },
//   headtitleCard:{
//   marginTop:-12,
//   marginLeft:-12,
//   borderTopLeftRadius:9,
//   borderBottomRightRadius:20,
//   backgroundColor:colors.footercolor,
//   width:300,
//   paddingLeft:20
//   },
//   cardLect: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 2,
//     color: colors.background,

//   },
//   cardTitle: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginBottom: 2,
//     color: '#1c1c1c',
//   },
//   cardDesc: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//   },
//   cardMeta: {
//     fontSize: 12,
//     color: '#888',
//   },
//   cardActions: {
//     flexDirection: 'row',
//     marginTop: 8,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     // backgroundColor:colors.bgcolor,
//     padding: 5,
//     borderRadius: 8
//   },
//   actionIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 16,
//   },
//   counter: {
//     fontSize: 12,
//     color: '#444',
//     marginLeft: 4,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: '#017016c3',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 30,
//     elevation: 5,
//   },
//   fabText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontSize: 13,
//     fontWeight: 'bold',
//   },
// });














// // const StudyMaterials = () => {
// //   const [courseslist, setCourseslist] = useState([]);
// //   const [likes, setLikes] = useState({});
// //   const [comments, setComments] = useState({});
// //   const [loading, setLoading] = useState(false);


// //   useEffect(() => {
// //     if (courseslist.length > 0) {
// //       const initialLikes = {};
// //       const initialComments = {};
// //       courseslist?.forEach(item => {
// //         const itemId = item.Study_Material_Id || item.Study_Material_Title;
// //         initialLikes[itemId] = likes[itemId] || 0;
// //         initialComments[itemId] = comments[itemId] || 0;
// //       });
// //       setLikes(initialLikes);
// //       setComments(initialComments);
// //     }
// //   }, [courseslist]);


// //   const handleLike = useCallback((itemId) => {
// //     const updatedLikes = { ...likes, [itemId]: (likes[itemId] || 0) + 1 };
// //     setLikes(updatedLikes);
// //     Alert.alert('Liked!', `Total Likes: ${updatedLikes[itemId]}`);
// //   }, [likes]);

// //   const handleComment = useCallback((itemId) => {
// //     const updatedComments = { ...comments, [itemId]: (comments[itemId] || 0) + 1 };
// //     setComments(updatedComments);
// //     Alert.alert('Commented!', `Total Comments: ${updatedComments[itemId]}`);
// //   }, [comments]);

// //   const handleDownload = useCallback((file) => {
// //     Alert.alert('Download Started', `Downloading: ${file}`);

// //   }, []);

// //   // API Section
// //   const getCourseCodeList = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       const courseApi = getAdminApiList().getCourseCodeList;
// //       if (!courseApi) throw new Error("API endpoint not found.");

// //       const sessionData = await SessionService.getSession();
// //       const profile = sessionData?.LoginDetail?.[0];
// //       // console.log(profile.Emp_Id, "student comp");
// //       const payload = {
// //         Emp_id: profile.Emp_Id,
// //       };
// //       const response = await HttpService.post(courseApi, payload);
// //       setCourseslist(response?.data.CourseCodeList || []);
// //     } catch (error) {
// //       Alert.alert("Failed to Load Courses", error?.message || "Something went wrong");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     getCourseCodeList();
// //   }, [getCourseCodeList]);

// //   return (
// //     <View style={styles.body}>
// //       <Header />
// //       <View style={styles.container}>

// //         <Text style={styles.header}>Study Materials</Text>


// //         <View style={styles.filters}>
// //           <TouchableOpacity style={styles.filterButton}>
// //             <Text>Documents</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.filterButton}>
// //             <Text>Videos</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.filterButton}>
// //             <Text>Quizzes</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.filterButton}>
// //             <Text>Resources</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {loading ? (
// //           <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
// //         ) : (
// //           <FlatList
// //             data={courseslist}
// //             keyExtractor={(item, index) =>
// //               item.Study_Material_Id
// //                 ? item.Study_Material_Id.toString()
// //                 : `${item.Study_Material_Title}_${index}`
// //             }
// //             contentContainerStyle={styles.materialList}
// //             renderItem={({ item }) => {
// //               const itemId = item.Study_Material_Id || item.Study_Material_Title;

// //               return (
// //                 <View style={styles.card}>
// //                   {/* Icon Section */}
// //                   {item.icon ? (
// //                     <FontAwesome6
// //                       name={item.icon}
// //                       solid={item.iconType === 'solid'}
// //                       size={24}
// //                       style={styles.cardIcon}
// //                     />
// //                   ) : null}

// //                   <View style={styles.cardContent}>
// //                     {/* Text fields should always be wrapped in <Text> */}
// //                     <Text style={styles.cardLect}>{item?.Study_Material_Title ?? "Untitled"}</Text>
// //                     <Text style={styles.cardTitle}>Course: {item?.Course_Code ?? "N/A"}</Text>
// //                     <Text style={styles.cardDesc}>
// //                       {item?.Degree_Programme_Short_Name_E ?? ""}{" "}
// //                       {item?.Course_Year_Name_E ?? ""} {item?.Semester_Name_E ?? ""}
// //                     </Text>
// //                     <Text style={styles.cardDesc}>{item?.Content_Language ?? ""}</Text>
// //                     <Text style={styles.cardMeta}>Uploaded: {item?.Created_Date ?? "Unknown"}</Text>
// //                     {item?.size ? <Text style={styles.cardMeta}>File Size: {item.size}</Text> : null}
// //                     {item?.course ? <Text style={styles.cardMeta}>Course: {item.course}</Text> : null}

// //                     {/* Action Icons */}
// //                     <View style={styles.cardActions}>
// //                       <TouchableOpacity
// //                         style={styles.actionIcon}
// //                         onPress={() => handleDownload(item.file)}
// //                       >
// //                         <FontAwesome6 name="download" solid size={26} color="#007aff" />
// //                       </TouchableOpacity>

// //                       <TouchableOpacity
// //                         style={styles.actionIcon}
// //                         onPress={() => handleLike(itemId)}
// //                       >
// //                         <FontAwesome6 name="heart" solid size={26} color="#888" />
// //                         <Text style={styles.counter}>{likes[itemId] || 0}</Text>
// //                       </TouchableOpacity>

// //                       <TouchableOpacity
// //                         style={styles.actionIcon}
// //                         onPress={() => handleComment(itemId)}
// //                       >
// //                         <FontAwesome6 name="comment" solid size={26} color="#888" />
// //                         <Text style={styles.counter}>{comments[itemId] || 0}</Text>
// //                       </TouchableOpacity>
// //                     </View>
// //                   </View>
// //                 </View>
// //               );
// //             }}
// //           />

// //         )}

// //         {/* Floating Action Button */}
// //         <TouchableOpacity style={styles.fab} onPress={() => Alert.alert('Upload', 'Implement upload logic here')}>
// //           <FontAwesome6 name="plus" solid size={16} color="#fff" />
// //           <Text style={styles.fabText}>Upload New Material</Text>
// //         </TouchableOpacity>
// //       </View>
// //       <FooterNav />
// //     </View>

// //   );
// // };

// // export default StudyMaterials;



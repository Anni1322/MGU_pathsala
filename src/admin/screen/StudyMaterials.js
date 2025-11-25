
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
        const itemId = item.Study_Material_Id || item.Study_Material_Title;
        initialLikes[itemId] = likes[itemId] || 0;
        initialComments[itemId] = comments[itemId] || 0;
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


    const handleDownloadPDF = async StudyMaterials => {
      console.log(StudyMaterials,"StudyMaterials")
      setLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const payload = { 
        STUDENT_ID: sessionData?.STUDENT_ID,
      };
      const apiList = getApiList();
      const DownloadFeeReceiptAPI = apiList.DownloadFeeReceiptt;
      if (!DownloadFeeReceiptAPI)
        throw new Error('Fees Receipt endpoint not found.');
      const response = await HttpService.post(DownloadFeeReceiptAPI, payload);
      const filePath = API_BASE_URL + '/' + response?.data?.Response[0]?.FilePath;

      if (filePath) {
        setLoading(true);
        await downloadFile(filePath, `${receipt?.Receipt_No}Semester_Examfees.pdf`);
        setLoading(false);
      } else {
        console.error('No file path returned from API.');
        alertService.show({
          title: 'Error',
          message: 'No file available to download.',
          type: 'warning',
        });
      }

      return response?.data?.FeeReceiptList || [];
    } catch (error) {
      Alert.alert(
        'Fees Receipt Fetch Failed',
        error?.message || 'Something went wrong',
      );
      throw error;
    }
     setLoading(false);
  };


  const getCourseCodeList = useCallback(async () => {
    try {
      setLoading(true);
      const courseApi = getAdminApiList().getCourseCodeList;
      if (!courseApi) throw new Error("API endpoint not found.");

      const sessionData = await SessionService.getSession();
      const profile = sessionData?.LoginDetail?.[0];
      const payload = {
        Emp_id: profile.Emp_Id,
      };
      const response = await HttpService.post(courseApi, payload);
      setCourseslist(response?.data.CourseCodeList || []);
    } catch (error) {
      Alert.alert("Failed to Load Courses", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);


  const GetCourseListForStudyMaterial = useCallback(async () => {
    try {
      setLoading(true);
      const CourseListForStudyMaterialApi = getAdminApiList().GetCourseListForStudyMaterial;
      if (!CourseListForStudyMaterialApi) throw new Error("API endpoint not found.");

      const sessionData = await SessionService.getSession();
      const profile = sessionData?.LoginDetail?.[0];
      const payload = {
        Student_ID: profile.Emp_Id,
        LOGIN_TYPE: profile.Emp_Id,
      };
      const response = await HttpService.post(CourseListForStudyMaterialApi, payload);
      setCourseslist(response?.data.CourseCodeList || []);
    } catch (error) {
      Alert.alert("Failed to Load Courses", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    getCourseCodeList();
  }, [getCourseCodeList]);

  // Filter the list based on selectedFilter
  // const filteredList = courseslist.filter(item => {
  //   if (selectedFilter === 'All') return true; 
  //   if (selectedFilter === 'Documents') return item.File_Type_Name === 'MS Word';  
  //   if (selectedFilter === 'Videos') return item.File_Type_Name === 'MP4';  
  //   if (selectedFilter === 'Quizzes') return item.File_Type_Name === 'Quiz'; 
  //   if (selectedFilter === 'Resources') return item.File_Type_Name === 'Resource';  
  //   return false;  
  // });

  const filteredList = courseslist.filter(item => {
    if (selectedFilter === 'All') return true;  // Show all items
    if (selectedFilter === 'DegreeProgramme') return !!item.Degree_Programme_Short_Name_E;
    if (selectedFilter === 'Course_Year') return !!item.Course_Year;
    if (selectedFilter === 'Semester') return !!item.Semester;
    if (selectedFilter === 'Date') return !!item.Date;
    if (selectedFilter === 'Content_Language') return !!item.Content_Language;
    if (selectedFilter === 'File_Type') return !!item.File_Type;
    if (selectedFilter === 'Instruction') return !!item.Instruction;
    return false;
  });

  return (
    <View style={styles.body}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.header}>Study Materials</Text>

        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'All' && styles.selectedButton]}
            onPress={() => setSelectedFilter('All')}
          >
            <Text>All</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === 'DegreeProgramme' && styles.selectedButton]}
            onPress={() => setSelectedFilter('DegreeProgramme')}
          >
            <Text>Degree Programme</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === 'Videos' && styles.selectedButton]}
            onPress={() => setSelectedFilter('Videos')}
          >
            <Text>Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === 'Quizzes' && styles.selectedButton]}
            onPress={() => setSelectedFilter('Quizzes')}
          >
            <Text>Quizzes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === 'Resources' && styles.selectedButton]}
            onPress={() => setSelectedFilter('Resources')}
          >
            <Text>Resources</Text>
          </TouchableOpacity> */}


        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredList}
            keyExtractor={(item, index) =>
              item.Study_Material_Id
                ? item.Study_Material_Id.toString()
                : `${item.Study_Material_Title}_${index}`
            }
            contentContainerStyle={styles.materialList}
            renderItem={({ item }) => {
              const itemId = item.Study_Material_Id || item.Study_Material_Title;

              return (
                <View style={styles.card}>
                  {item.icon ? (
                    <FontAwesome6
                      name={item.icon}
                      solid={item.iconType === 'solid'}
                      size={24}
                      style={styles.cardIcon}
                    />
                  ) : null}

                  <View style={styles.cardContent}>
                    <Text style={styles.cardLect}>{item?.Study_Material_Title ?? "Untitled"}</Text>
                    <Text style={styles.cardTitle}>Course: {item?.Course_Code ?? "N/A"}  - {item?.Content_Language ?? ""}  </Text>
                    <Text style={styles.cardDesc}>
                      {item?.Degree_Programme_Short_Name_E ?? ""}{" "}
                      {item?.Course_Year_Name_E ?? ""} {item?.Semester_Name_E ?? ""}
                    </Text>
                    <Text style={styles.cardDesc}>Uploaded: {item?.Created_Date ?? "Unknown"} </Text>
                    {/* <Text style={styles.cardMeta}>Uploaded: {item?.Created_Date ?? "Unknown"}</Text> */}
                    {item?.size ? <Text style={styles.cardMeta}>File Size: {item.size}</Text> : null}
                    {item?.course ? <Text style={styles.cardMeta}>Course: {item.course}</Text> : null}

                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.actionIcon}
                        onPress={() => handleDownloadPDF(item.Study_Material_File)}  // Fixed to use actual file path
                      >
                        <FontAwesome6 name="download" solid size={26} color={colors.background} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionIcon}
                        onPress={() => handleLike(itemId)}
                      >
                        <FontAwesome6 name="heart" solid size={26} color={colors.background} />
                        <Text style={styles.counter}>{likes[itemId] || 0} </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionIcon}
                        onPress={() => handleComment(itemId)}
                      >
                        <FontAwesome6 name="comment" solid size={26} color={colors.background} />
                        <Text style={styles.counter}>{comments[itemId] || 0}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Maintenance')}>
          <FontAwesome6 name="plus" solid size={16} color="#fff" />
          <Text style={styles.fabText}>Upload</Text>
        </TouchableOpacity> */}
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
    // paddingTop: 50,
    // paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5EFE6',
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  header: {
    padding:8,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#ffffffff',
    backgroundColor: '#EDA35A',
    borderRadius: 10,
    borderWidth:2,
    borderColor:'#fff'
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#e0ebff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
    color: '#007aff',
  },
  subFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  subFilter: {
    backgroundColor: '#dde6f1',
    padding: 6,
    borderRadius: 8,
    fontSize: 12,
    color: '#333',
  },
  materialList: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
    elevation: 2,
    borderWidth:1,
    borderColor:colors.lite2
  },
  cardIcon: {
    marginRight: 10,
    marginTop: 4,
    color: '#007aff',
  },
  cardContent: {
    flex: 1,
  },
  cardLect: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#6c0000ff',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1c1c1c',
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: '#888',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor:colors.lite2,
    padding:5,
    borderRadius:8
  },
  actionIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  counter: {
    fontSize: 12,
    color: '#444',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#017016c3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 13,
    fontWeight: 'bold',
  },
});














// const StudyMaterials = () => {
//   const [courseslist, setCourseslist] = useState([]);
//   const [likes, setLikes] = useState({});
//   const [comments, setComments] = useState({});
//   const [loading, setLoading] = useState(false);


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

//   // API Section
//   const getCourseCodeList = useCallback(async () => {
//     try {
//       setLoading(true);
//       const courseApi = getAdminApiList().getCourseCodeList;
//       if (!courseApi) throw new Error("API endpoint not found.");

//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       // console.log(profile.Emp_Id, "student comp");
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

//   useEffect(() => {
//     getCourseCodeList();
//   }, [getCourseCodeList]);

//   return (
//     <View style={styles.body}>
//       <Header />
//       <View style={styles.container}>

//         <Text style={styles.header}>Study Materials</Text>


//         <View style={styles.filters}>
//           <TouchableOpacity style={styles.filterButton}>
//             <Text>Documents</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.filterButton}>
//             <Text>Videos</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.filterButton}>
//             <Text>Quizzes</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.filterButton}>
//             <Text>Resources</Text>
//           </TouchableOpacity>
//         </View>

//         {loading ? (
//           <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
//         ) : (
//           <FlatList
//             data={courseslist}
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
//                   {/* Icon Section */}
//                   {item.icon ? (
//                     <FontAwesome6
//                       name={item.icon}
//                       solid={item.iconType === 'solid'}
//                       size={24}
//                       style={styles.cardIcon}
//                     />
//                   ) : null}

//                   <View style={styles.cardContent}>
//                     {/* Text fields should always be wrapped in <Text> */}
//                     <Text style={styles.cardLect}>{item?.Study_Material_Title ?? "Untitled"}</Text>
//                     <Text style={styles.cardTitle}>Course: {item?.Course_Code ?? "N/A"}</Text>
//                     <Text style={styles.cardDesc}>
//                       {item?.Degree_Programme_Short_Name_E ?? ""}{" "}
//                       {item?.Course_Year_Name_E ?? ""} {item?.Semester_Name_E ?? ""}
//                     </Text>
//                     <Text style={styles.cardDesc}>{item?.Content_Language ?? ""}</Text>
//                     <Text style={styles.cardMeta}>Uploaded: {item?.Created_Date ?? "Unknown"}</Text>
//                     {item?.size ? <Text style={styles.cardMeta}>File Size: {item.size}</Text> : null}
//                     {item?.course ? <Text style={styles.cardMeta}>Course: {item.course}</Text> : null}

//                     {/* Action Icons */}
//                     <View style={styles.cardActions}>
//                       <TouchableOpacity
//                         style={styles.actionIcon}
//                         onPress={() => handleDownload(item.file)}
//                       >
//                         <FontAwesome6 name="download" solid size={26} color="#007aff" />
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={styles.actionIcon}
//                         onPress={() => handleLike(itemId)}
//                       >
//                         <FontAwesome6 name="heart" solid size={26} color="#888" />
//                         <Text style={styles.counter}>{likes[itemId] || 0}</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={styles.actionIcon}
//                         onPress={() => handleComment(itemId)}
//                       >
//                         <FontAwesome6 name="comment" solid size={26} color="#888" />
//                         <Text style={styles.counter}>{comments[itemId] || 0}</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               );
//             }}
//           />

//         )}

//         {/* Floating Action Button */}
//         <TouchableOpacity style={styles.fab} onPress={() => Alert.alert('Upload', 'Implement upload logic here')}>
//           <FontAwesome6 name="plus" solid size={16} color="#fff" />
//           <Text style={styles.fabText}>Upload New Material</Text>
//         </TouchableOpacity>
//       </View>
//       <FooterNav />
//     </View>

//   );
// };

// export default StudyMaterials;



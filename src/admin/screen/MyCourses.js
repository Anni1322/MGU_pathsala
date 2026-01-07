import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../layout/Header/Header';
import FooterNav from '../layout/Footer/Footer';
import SessionService from '../../common/Services/SessionService';
import getAdminApiList from '../config/Api/adminApiList';
import { HttpService } from '../../common/Services/HttpService';
import MyModal from '../layout/MyModal';
import CustomSpinner from '../../common/Services/alert/CustomSpinner';
import colors from '../../common/config/colors';
const badgeColors = ['#f9741675', '#8a5cf688', '#aecdfeff', '#ef444474'];
const MyCourses = ({ route }) => {
  const MyCourse = route.params?.data || [];
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [params, setParams] = useState([]);
  const [EmpId, setEmpId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentCache, setStudentCache] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Added for search

  // Memoize courses derivation
  const memoizedCourses = useMemo(() => MyCourse?.CourseWiseStudentCount || [], [MyCourse]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const sessionData = await SessionService.getSession();
        const profile = sessionData?.LoginDetail?.[0];
        setParams(sessionData);
        setEmpId(profile?.Emp_Id);
      } catch (error) {
        console.error('Error loading initial data:', error);
        Alert.alert('Error', 'Failed to load initial data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    setCourses(memoizedCourses);
  }, [memoizedCourses]);

  const handleStudentClick = useCallback(async (student) => {
    setSelectedStudent(student);
    try {
      const currentSession = await SessionService.getSession();
      if (!currentSession) return;
      const updatedSession = {
        LoginDetail: currentSession.LoginDetail,
        SelectedSemester: currentSession.SelectedSemester,
        SelectedSession: currentSession.SelectedSession,
        student: student,
        STUDENT_ID: student?.Student_ID,
        LOGIN_TYPE: student?.LOGIN_TYPE
      };
      await SessionService.saveSession(updatedSession);
    } catch (error) {
      console.error("Failed to update session:", error);
    }
    setModalVisible(true);
  }, []);

  const getCourseWiseStudentList = useCallback(async (data) => {
    if (!EmpId) {
      Alert.alert('Error', 'Employee ID not loaded. Please try again.');
      setStudentLoading(false);
      return;
    }
    try {
      setStudentLoading(true);
      const CourseWiseStudentListApi = getAdminApiList().getCourseWiseStudentList;
      if (!CourseWiseStudentListApi) throw new Error('Student List API endpoint not found.');
      const payload = {
        Academic_session: params?.SelectedSession,
        Semester_Id: params?.SelectedSemester,
        Emp_Id: params?.LoginDetail[0]?.Emp_Id,
        Course_Id: data?.course_id,
        Degree_Programme_Id: data?.Degree_Programme_Id,
        Degree_Programme_Type_Id: data?.Degree_Programme_Type_Id,
        Subject_Id: '',
      };
      const response = await HttpService.get(CourseWiseStudentListApi, payload);
      const studentList = response?.data.StudentList || [];
      // Update cache and state
      setStudentCache((prevCache) => ({ ...prevCache, [data?.course_id]: studentList }));
      setStudents(studentList);
    } catch (error) {
      Alert.alert('Failed to Load', error?.message || 'Something went wrong');
      console.error('Student List fetch error:', error);
    } finally {
      setStudentLoading(false);
    }
  }, [EmpId, params]);

  const handleCourseClick = useCallback((course) => {
    setSelectedCourseId(course?.course_id);
    // Check cache first to avoid unnecessary API calls
    if (studentCache[course?.course_id]) {
      setStudents(studentCache[course?.course_id]);
    } else {
      getCourseWiseStudentList(course);
    }
  }, [studentCache, getCourseWiseStudentList]);

  // Filtered student list based on search term
  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      (student.Name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Memoize the rendered course list as cards
  const memoizedCourseList = useMemo(() => {
    return courses.map((course, index) => (
      <TouchableOpacity key={course.course_id} onPress={() => handleCourseClick(course)} style={styles.courseCard}>
        <View style={styles.cardContent}>
          <Text style={styles.cardSN}>{index + 1}</Text>
          <Text style={styles.cardCourse}>{course.Course_code}</Text>
          <Text style={styles.cardDPT}>{course.Degree_Programme_Type_Name_E}</Text>
          <Text style={styles.cardDegree}>{course.Degree_Programme_Name_E}</Text>
          <View style={styles.cardBadge}>
            <View
              style={[styles.badge, { backgroundColor: badgeColors[index % badgeColors.length] }]}
            >
              <Text style={styles.badgeText}>{course.TotalStudents}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ));
  }, [courses, handleCourseClick]);

  // Render student item for FlatList - Further optimized for large lists
  const renderStudentItem = useCallback(({ item: student, index }) => (
    <TouchableOpacity onPress={() => handleStudentClick(student)} activeOpacity={0.7}>
      <View style={styles.studentCard}>
        <View style={styles.avatarImage}>
          <View style={[styles.avatarImage, { backgroundColor: badgeColors[index % badgeColors.length] }]}>
            <Text style={styles.avatarText}>{index + 1}</Text>
          </View>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.Name}</Text>
          <Text style={styles.studentDetails}>{student.Degree_Programme_Short_Name_E}</Text>
          <Text style={styles.studentDetails}>{student.Year_semester}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [handleStudentClick]);
  
// uicode
  return (
    <SafeAreaView style={styles.container}>
          <Header title='My Courses' />
      <ScrollView  showsVerticalScrollIndicator={false}>
     
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            {/* <View style={styles.header}>
              <Text style={styles.headerText}>My Courses</Text>
            </View> */}

            <View style={styles.studentListContainer}>
              <View style={styles.cardContainer}>
                <Text style={styles.headertable}>All Courses</Text>
                {memoizedCourseList}
              </View>
            </View>

            <View style={styles.studentListContainer}>
              {/* <Text style={styles.studentListTitle}>Student List</Text> */}
              {/* Search Input */}

              {/* <TextInput
                style={styles.searchInput}
                placeholder="Search students by name..."
                value={searchTerm}
                onChangeText={setSearchTerm}
              /> */}

              {studentLoading ? (
                <View style={styles.spinnerWithText}>
                  <CustomSpinner size={50} color="rgba(0, 63, 198, 1)" type="dots" />
                  <Text style={styles.text}>Loading...</Text>
                </View>
              ) : filteredStudents.length === 0 ? (
                <Text style={styles.noStudents}>
                  {students.length === 0 ? 'No student data available' : 'No students match your search'}
                </Text>
              ) : (
                <FlatList
                  data={filteredStudents}
                  keyExtractor={(item, index) => {
                    const id = typeof item.Student_ID === 'string' || typeof item.Student_ID === 'number'
                      ? item.Student_ID.toString()
                      : `fallback-${index}`;
                    return `${id}-${index}`;  
                  }}
                  renderItem={renderStudentItem}
                  showsVerticalScrollIndicator={false}
                  initialNumToRender={10}
                  maxToRenderPerBatch={3}
                  updateCellsBatchingPeriod={50}
                  windowSize={5}
                  removeClippedSubviews={true}
                  getItemLayout={(data, index) => ({
                    length: 80,
                    offset: 80 * index,
                    index,
                  })}
                  onEndReached={() => {
                    console.log('End reached - load more if applicable');
                  }}
                  onEndReachedThreshold={0.1}
                />
              )}
            </View>
          </>
        )}

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MyModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            studentData={selectedStudent}
          />
        </View>
      </ScrollView>
      <FooterNav />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  containerCard: {
    flex: 1,
    backgroundColor: '#ffbda1ff',
    borderBottomEndRadius: 55,
    borderBottomStartRadius: 55,
    // borderTopStartRadius:35,
  },
  container: {
    flex: 1,
      backgroundColor: '#F8EDED',
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    margin: 10,
    padding: 8,
    alignItems: 'center',
     borderRadius: 10,
    backgroundColor: '#EFE9E3',
    borderWidth:2,
    borderColor:'#ffffffff'
   
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  headerCard: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20
  },
  tableScrollContainer: {
    // margin:10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Replaced tableContainer with cardContainer
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  headertable: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  // New styles for course cards
  courseCard: {
    backgroundColor: colors.tablerow,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSN: {
    flex: 0.5,
    textAlign: 'center',
    color: '#000000ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardCourse: {
    flex: 1,
    textAlign: 'center',
    color: '#000000ff',
    fontSize: 14,
  },
  cardDPT: {
    flex: 2,
    textAlign: 'center',
    color: '#000000ff',
    fontSize: 14,
  },
  cardDegree: {
    flex: 2,
    textAlign: 'center',
    color: '#000000ff',
    fontSize: 14,
  },
  cardBadge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  studentListContainer: {
    padding: 10,
    marginTop:-15
  },
  studentListTitle: {
    padding:10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000ff',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    marginBottom: 10,
  },
  // Added search input style
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  studentCard: {
    // flexDirection: 'row',
    // backgroundColor: '#F5D3C4',
    // // borderBottomEndRadius: 35,
    // borderTopStartRadius: 35,
    // borderRightWidth: 8,
    // borderRightColor: '#F4991A',
    // padding: 15,
    // marginBottom: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // borderWidth:1,
    // borderColor:'#ffffffff',
    // elevation: 5,



    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  
  
  
  
  avatarContainer: {
    marginRight: 15,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  avatarText: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 12,
    color: '#000',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: '#4f0000ff',
  },
  studentDetails: {
    fontSize: 14,
    color: '#000000ff',
    flexDirection: 'row',
  },
  spinnerWithText: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  noStudents: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    padding: 20,
  },
});
export default MyCourses;























// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   FlatList,
//   Platform,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// // Your custom components
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from '../../common/Services/HttpService';
// import MyModal from '../layout/MyModal';
// import CustomSpinner from '../../common/Services/alert/CustomSpinner';

// const badgeColors = ['#fed7aa', '#e9d5ff', '#bfdbfe', '#fecaca'];
// const textColors = ['#ea580c', '#9333ea', '#2563eb', '#dc2626'];

// const MyCourses = ({ route }) => {
//   const initialData = route.params?.data?.CourseWiseStudentCount || [];
//   const [courses] = useState(initialData);
//   const [students, setStudents] = useState([]);
//   const [params, setParams] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [studentLoading, setStudentLoading] = useState(false);
//   const [studentCache, setStudentCache] = useState({});
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   useEffect(() => {
//     const fetchSession = async () => {
//       try {
//         const sessionData = await SessionService.getSession();
//         setParams(sessionData);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to load session data.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSession();
//   }, []);

//   const getCourseWiseStudentList = useCallback(async (course) => {
//     if (!params) return;
    
//     try {
//       setStudentLoading(true);
//       const apiPath = getAdminApiList().getCourseWiseStudentList;
//       const payload = {
//         Academic_session: params?.SelectedSession,
//         Semester_Id: params?.SelectedSemester,
//         Emp_Id: params?.LoginDetail[0]?.Emp_Id,
//         Course_Id: course?.course_id,
//         Degree_Programme_Id: course?.Degree_Programme_Id,
//         Degree_Programme_Type_Id: course?.Degree_Programme_Type_Id,
//         Subject_Id: '',
//       };
      
//       const response = await HttpService.get(apiPath, payload);
//       const studentList = response?.data?.StudentList || [];
      
//       setStudentCache(prev => ({ ...prev, [course.course_id]: studentList }));
//       setStudents(studentList);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch students');
//     } finally {
//       setStudentLoading(false);
//     }
//   }, [params]);

//   const handleCourseClick = (course) => {
//     if (studentCache[course.course_id]) {
//       setStudents(studentCache[course.course_id]);
//     } else {
//       getCourseWiseStudentList(course);
//     }
//   };

//   const handleStudentClick = async (student) => {
//     setSelectedStudent(student);
//     setModalVisible(true);
//     // Optionally update session here if needed by MyModal
//   };

//   // HEADER COMPONENT FOR FLATLIST
//   const ListHeader = () => (
//     <View style={styles.contentWrapper}>
//       <Text style={styles.sectionTitle}>All Courses</Text>
//       <View style={styles.courseListGap}>
//         {courses.map((course, index) => (
//           <TouchableOpacity 
//             key={course.course_id} 
//             onPress={() => handleCourseClick(course)} 
//             style={styles.card}
//           >
//             <View style={styles.cardContent}>
//               <Text style={styles.indexText}>{index + 1}</Text>
//               <View style={styles.codeContainer}>
//                 <Text style={styles.codeText}>{course.Course_code}</Text>
//               </View>
//               <Text style={styles.typeText}>{course.Degree_Programme_Type_Name_E}</Text>
//               <View style={styles.degreeContainer}>
//                 <Text style={styles.degreeText}>{course.Degree_Programme_Name_E}</Text>
//               </View>
//             </View>
//             <View style={[styles.badge, { backgroundColor: badgeColors[index % 4] }]}>
//               <Text style={[styles.badgeText, { color: textColors[index % 4] }]}>
//                 {course.TotalStudents}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Student List</Text>
//       {studentLoading && (
//         <View style={styles.centerPad}>
//            <CustomSpinner size={40} color="#0f172a" type="dots" />
//         </View>
//       )}
//     </View>
//   );

//   const renderStudent = ({ item, index }) => (
//     <TouchableOpacity style={styles.studentItem} onPress={() => handleStudentClick(item)}>
//       <View style={[styles.studentAvatar, { backgroundColor: badgeColors[index % 4] }]}>
//         <Text style={{ color: textColors[index % 4], fontWeight: 'bold' }}>{index + 1}</Text>
//       </View>
//       <View style={styles.studentInfo}>
//         <Text style={styles.studentName}>{item.Name}</Text>
//         <Text style={styles.studentSub}>{item.Degree_Programme_Short_Name_E} • {item.Year_semester}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top']}>
//       <StatusBar barStyle="light-content" />
//       <Header title="My Courses" />
      
//       <FlatList
//         data={students}
//         renderItem={renderStudent}
//         keyExtractor={(item, index) => `${item.Student_ID}-${index}`}
//         ListHeaderComponent={ListHeader}
//         ListEmptyComponent={() => !studentLoading && (
//           <Text style={styles.emptyText}>Select a course to view students</Text>
//         )}
//         contentContainerStyle={styles.flatListContent}
//         style={styles.mainContainer}
//       />

//       <MyModal 
//         visible={modalVisible} 
//         onClose={() => setModalVisible(false)} 
//         studentData={selectedStudent} 
//       />
//       <FooterNav />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#0f172a' },
//   mainContainer: { flex: 1, backgroundColor: '#f8fafc' },
//   flatListContent: { paddingBottom: 100 },
//   contentWrapper: {
//     backgroundColor: '#f8fafc',
//     padding: 16,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     marginTop: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1e293b',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   courseListGap: { gap: 10 },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     ...Platform.select({ ios: { shadowOpacity: 0.05, shadowRadius: 5 }, android: { elevation: 2 } }),
//   },
//   cardContent: { flexDirection: 'row', flex: 1, alignItems: 'center' },
//   indexText: { width: 25, fontWeight: 'bold', color: '#64748b' },
//   codeContainer: { width: 70 },
//   codeText: { fontWeight: 'bold', color: '#0f172a' },
//   typeText: { width: 40, color: '#64748b', fontSize: 12, textAlign: 'center' },
//   degreeContainer: { flex: 1, alignItems: 'flex-end', paddingRight: 10 },
//   degreeText: { fontSize: 11, color: '#64748b', textAlign: 'right' },
//   badge: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
//   badgeText: { fontSize: 12, fontWeight: 'bold' },
//   studentItem: {
//     flexDirection: 'row',
//     padding: 12,
//     marginHorizontal: 16,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     marginBottom: 8,
//     alignItems: 'center',
//   },
//   studentAvatar: { width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   studentInfo: { flex: 1 },
//   studentName: { fontWeight: 'bold', color: '#1e293b' },
//   studentSub: { fontSize: 12, color: '#64748b' },
//   emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 20 },
//   centerPad: { padding: 20, alignItems: 'center' }
// });

// export default MyCourses;









































// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, FlatList } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from '../../common/Services/HttpService';
// import MyModal from '../layout/MyModal';
// import CustomSpinner from '../../common/Services/alert/CustomSpinner';
// import colors from '../../common/config/colors';

// const badgeColors = ['#f9741675', '#8a5cf688', '#aecdfeff', '#ef444474'];

// const MyCourses = ({ route }) => {
//   const MyCourse = route.params?.data || [];
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [params, setParams] = useState([]);
//   const [EmpId, setEmpId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [studentLoading, setStudentLoading] = useState(false);
//   const [studentCache, setStudentCache] = useState({});
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   // Memoize courses derivation
//   const memoizedCourses = useMemo(() => MyCourse?.CourseWiseStudentCount || [], [MyCourse]);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const sessionData = await SessionService.getSession();
//         const profile = sessionData?.LoginDetail?.[0];
//         setParams(sessionData);
//         setEmpId(profile?.Emp_Id);
//       } catch (error) {
//         console.error('Error loading initial data:', error);
//         Alert.alert('Error', 'Failed to load initial data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//     setCourses(memoizedCourses);
//   }, [memoizedCourses]);

//   const handleStudentClick = useCallback(async (student) => {
//     setSelectedStudent(student);
//     try {
//       const currentSession = await SessionService.getSession();
//       if (!currentSession) return;
//       const updatedSession = {
//         LoginDetail: currentSession.LoginDetail,
//         SelectedSemester: currentSession.SelectedSemester,
//         SelectedSession: currentSession.SelectedSession,
//         student: student,
//         STUDENT_ID: student?.Student_ID,
//         LOGIN_TYPE: student?.LOGIN_TYPE
//       };
//       await SessionService.saveSession(updatedSession);
//     } catch (error) {
//       console.error("Failed to update session:", error);
//     }
//     setModalVisible(true);
//   }, []);

//   const getCourseWiseStudentList = useCallback(async (data) => {
//     if (!EmpId) {
//       Alert.alert('Error', 'Employee ID not loaded. Please try again.');
//       setStudentLoading(false);
//       return;
//     }
//     try {
//       setStudentLoading(true);
//       const CourseWiseStudentListApi = getAdminApiList().getCourseWiseStudentList;
//       if (!CourseWiseStudentListApi) throw new Error('Student List API endpoint not found.');
//       const payload = {
//         Academic_session: params?.SelectedSession,
//         Semester_Id: params?.SelectedSemester,
//         Emp_Id: params?.LoginDetail[0]?.Emp_Id,
//         Course_Id: data?.course_id,
//         Degree_Programme_Id: data?.Degree_Programme_Id,
//         Degree_Programme_Type_Id: data?.Degree_Programme_Type_Id,
//         Subject_Id: '',
//       };
//       const response = await HttpService.get(CourseWiseStudentListApi, payload);
//       const studentList = response?.data.StudentList || [];
//       // Update cache and state
//       setStudentCache((prevCache) => ({ ...prevCache, [data?.course_id]: studentList }));
//       setStudents(studentList);
//     } catch (error) {
//       Alert.alert('Failed to Load', error?.message || 'Something went wrong');
//       console.error('Student List fetch error:', error);
//     } finally {
//       setStudentLoading(false);
//     }
//   }, [EmpId, params]);

//   const handleCourseClick = useCallback((course) => {
//     setSelectedCourseId(course?.course_id);
//     // Check cache first to avoid unnecessary API calls
//     if (studentCache[course?.course_id]) {
//       setStudents(studentCache[course?.course_id]);
//     } else {
//       getCourseWiseStudentList(course);
//     }
//   }, [studentCache, getCourseWiseStudentList]);

//   // Memoize the rendered course list
//   const memoizedCourseList = useMemo(() => {
//     return courses.map((course, index) => (
//       <TouchableOpacity key={course.course_id} onPress={() => handleCourseClick(course)}>
//         <View style={styles.tableRow}>
//           <Text style={[styles.tableCell, styles.tableCellSN]}>{index + 1}</Text>
//           <Text style={[styles.tableCell, styles.tableCellCourse]}>{course.Course_code}</Text>
//           <Text style={[styles.tableCell, styles.tableCellDept]}>
//             {course.Degree_Programme_Type_Name_E}
//           </Text>
//           <Text style={[styles.tableCell, styles.tableCellDegree]}>
//             {course.Degree_Programme_Name_E}
//           </Text>
//           <View style={[styles.tableCell, styles.tableCellStudents]}>
//             <View
//               style={[styles.badge, { backgroundColor: badgeColors[index % badgeColors.length] }]}
//             >
//               <Text style={styles.badgeText}>{course.TotalStudents}</Text>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     ));
//   }, [courses, handleCourseClick]);

//   // Render student item for FlatList - Further optimized for large lists
//   const renderStudentItem = useCallback(({ item: student, index }) => (
//     <TouchableOpacity onPress={() => handleStudentClick(student)} activeOpacity={0.7}>
//       <View style={styles.studentCard}>
//         <View style={styles.avatarImage}>
//           {/* <View style={[styles.avatar, { backgroundColor: badgeColors[index % badgeColors.length] }]}>
//             <Image
//               source={{ uri: student.PhotoString + student.Student_Photo }}
//               style={styles.avatarImage}
//               resizeMode="cover"
//               onError={() => {}}  
//             />
            
//             <Text style={styles.avatarText}>{index + 1}</Text>
//           </View> */}
//           <View style={[styles.avatarImage, { backgroundColor: badgeColors[index % badgeColors.length] }]}>
//             <Text style={styles.avatarText}>{index + 1}</Text>
//           </View>


//         </View>
//         <View style={styles.studentInfo}>
//           <Text style={styles.studentName}>{student.Name}</Text>
//           <Text style={styles.studentDetails}>{student.Degree_Programme_Short_Name_E}</Text>
//           <Text style={styles.studentDetails}>{student.Year_semester}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   ), [handleStudentClick]);

//   return (
//     <SafeAreaView style={styles.container}>
//        <Header />
//       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
     
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <Text style={styles.loadingText}>Loading...</Text>
//           </View>
//         ) : (
//           <>
//             <View style={styles.header}>
//               <Text style={styles.headerText}>My Courses</Text>
//             </View>

//             <View style={styles.studentListContainer}>
//               <View style={styles.tableContainer}>
//                 <View style={styles.tableHeader}>
//                   <Text style={[styles.tableCell, styles.tableCellSN]}>SN</Text>
//                   <Text style={[styles.tableCell, styles.tableCellCourse]}>Course</Text>
//                   <Text style={[styles.tableCell, styles.tableCellDept]}>DPT</Text>
//                   <Text style={[styles.tableCell, styles.tableCellDegree]}>Degree</Text>
//                   <Text style={[styles.tableCell, styles.tableCellStudents]}>Students</Text>
//                 </View>
//                 {memoizedCourseList}
//               </View>
//             </View>

//             <View style={styles.studentListContainer}>
//               <Text style={styles.studentListTitle}>Student List</Text>
//               {studentLoading ? (
//                 <View style={styles.spinnerWithText}>
//                   <CustomSpinner size={50} color="rgba(0, 63, 198, 1)" type="dots" />
//                   <Text style={styles.text}>Loading...</Text>
//                 </View>
//               ) : students.length === 0 ? (
//                 <Text style={styles.noStudents}>No student data available</Text>
//               ) : (
//                 <FlatList
//                   data={students}
//                   keyExtractor={(item, index) => {
//                     const id = typeof item.Student_ID === 'string' || typeof item.Student_ID === 'number'
//                       ? item.Student_ID.toString()
//                       : `fallback-${index}`;
//                     return `${id}-${index}`;  
//                   }}
//                   renderItem={renderStudentItem}
//                   showsVerticalScrollIndicator={false}
//                   initialNumToRender={10}
//                   maxToRenderPerBatch={3}
//                   updateCellsBatchingPeriod={50}
//                   windowSize={5}
//                   removeClippedSubviews={true}
//                   getItemLayout={(data, index) => ({
//                     length: 80,
//                     offset: 80 * index,
//                     index,
//                   })}
//                   onEndReached={() => {
//                     console.log('End reached - load more if applicable');
//                   }}
//                   onEndReachedThreshold={0.1}
//                 />
//               )}
//             </View>
//           </>
//         )}

//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <MyModal
//             visible={modalVisible}
//             onClose={() => setModalVisible(false)}
//             studentData={selectedStudent}
//           />
//         </View>
//       </ScrollView>
//       <FooterNav />
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   containerCard: {
//     flex: 1,
//     backgroundColor: '#ffbda1ff',
//     borderBottomEndRadius: 55,
//     borderBottomStartRadius: 55,
//     // borderTopStartRadius:35,
//   },
//   container: {
//     flex: 1,
//       backgroundColor: '#F8EDED',
//   },
//   gradientBackground: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   header: {
//     margin: 10,
//     padding: 8,
//     alignItems: 'center',
//      borderRadius: 10,
//     backgroundColor: '#EFE9E3',
//     borderWidth:2,
//     borderColor:'#ffffffff'
   
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000000ff',
//   },
//   headerCard: {
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//     borderRadius: 20
//   },
//   tableScrollContainer: {
//     // margin:10,
//     paddingHorizontal: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tableContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   headertable: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000000ff',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: colors.tableheader,
//     paddingVertical: 10,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     backgroundColor: colors.tablerow,
//     paddingVertical: 10,
//     borderRadius: 5,
//     marginBottom: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 3,
//   },
//   tableCell: {
//     flex: 1,
//     textAlign: 'center',
//     color: '#000000ff',
//     fontSize: 14,
//   },
//   tableCellSN: {
//     flex: 0.5,
//   },
//   tableCellDept: {
//     flex: 2,
//   },
//   tableCellStudents: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 20,
//     // alignItems: 'center',
//     justifyContent: 'center',
//   },
//   badgeText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   studentListContainer: {
//     padding: 10,
//     marginTop:-15
//   },
//   studentListTitle: {
//     padding:10,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#ff0000ff',
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//     marginBottom: 10,
//   },
//   studentCard: {
//     flexDirection: 'row',
//     backgroundColor: '#F5D3C4',
//     // borderBottomEndRadius: 35,
//     borderTopStartRadius: 35,
//     borderRightWidth: 8,
//     borderRightColor: '#F4991A',
//     padding: 15,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     borderWidth:1,
//     borderColor:'#ffffffff',
//     elevation: 5,
//   },
//   avatarContainer: {
//     marginRight: 15,
//   },
//   avatarImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10
//   },
//   avatarText: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingHorizontal: 5,
//     fontSize: 12,
//     color: '#000',
//   },
//   studentInfo: {
//     flex: 1,
//   },
//   studentName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     // color: '#4f0000ff',
//   },
//   studentDetails: {
//     fontSize: 14,
//     color: '#000000ff',
//     flexDirection: 'row',
//   },
//   spinnerWithText: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   text: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#fff',
//   },
//   noStudents: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#fff',
//     padding: 20,
//   },
// });

// export default MyCourses;




























// layout 
// import React from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Platform,
// } from 'react-native';

// const COURSES = [
//   { id: '1', code: 'EPE-52', subCode: '11', type: 'UG', degree: 'B.Tech.(Agril.', major: 'Engg.)', count: 7, color: '#fed7aa', textColor: '#ea580c' },
//   { id: '2', code: 'EPE-53', subCode: '12', type: 'UG', degree: 'B.Tech.(Agril.', major: 'Engg.)', count: 34, color: '#e9d5ff', textColor: '#9333ea' },
//   { id: '3', code: 'EPE-53', subCode: '12', type: 'UG', degree: 'B.Tech.(Agril.', major: 'Engg.)', count: 14, color: '#bfdbfe', textColor: '#2563eb' },
//   { id: '4', code: 'EPF-62', subCode: '11', type: 'UG', degree: 'B.Tech.(Agril.', major: 'Engg.)', count: 57, color: '#fecaca', textColor: '#dc2626' },
//   { id: '5', code: 'FPT', subCode: '-502', type: 'PG', degree: 'M.Tech.(Agril.', major: 'Engg.)', count: 8, color: '#fed7aa', textColor: '#ea580c' },
//   { id: '6', code: 'FPT-60', subCode: '2', type: 'Ph.D', degree: 'Ph.D in Agril.', major: 'Engg.', count: 1, color: '#e9d5ff', textColor: '#9333ea' },
//   { id: '7', code: 'PFE', subCode: '-691', type: 'Ph.D', degree: 'Ph.D in Agril.', major: 'Engg.', count: 1, color: '#bfdbfe', textColor: '#2563eb' },
// ];

// const CourseCard = ({ item }) => (
//   <View style={styles.card}>
//     <View style={styles.cardContent}>
//       <Text style={styles.indexText}>{item.id}</Text>
      
//       <View style={styles.codeContainer}>
//         <Text style={styles.codeText}>{item.code}</Text>
//         <Text style={styles.codeText}>{item.subCode}</Text>
//       </View>

//       <Text style={styles.typeText}>{item.type}</Text>

//       <View style={styles.degreeContainer}>
//         <Text style={styles.degreeText}>{item.degree}</Text>
//         <Text style={styles.degreeText}>{item.major}</Text>
//       </View>
//     </View>

//     <View style={[styles.badge, { backgroundColor: item.color }]}>
//       <Text style={[styles.badgeText, { color: item.textColor }]}>{item.count}</Text>
//     </View>
//   </View>
// );

// export default function CoursesScreen() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />
      
//       {/* Header Section */}
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           {/* Custom Back Arrow using CSS-like borders */}
//           <TouchableOpacity style={styles.backButton}>
//             <View style={styles.backArrow} />
//           </TouchableOpacity>
          
//           <Text style={styles.headerTitle}>My Courses</Text>
          
//           {/* Custom User Icon using Views */}
//           <TouchableOpacity style={styles.profileButton}>
//             <View style={styles.userHead} />
//             <View style={styles.userBody} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Main Content Area */}
//       <View style={styles.contentWrapper}>
//         <ScrollView 
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           <Text style={styles.sectionTitle}>All Courses</Text>
          
//           <View style={styles.listGap}>
//             {COURSES.map((course) => (
//               <CourseCard key={course.id} item={course} />
//             ))}
//           </View>
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0f172a', 
//   },
//   header: {
//     paddingHorizontal: 16,
//     paddingBottom: 32,
//     paddingTop: Platform.OS === 'android' ? 40 : 10,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     backgroundColor: '#1e293b',
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   backArrow: {
//     width: 10,
//     height: 10,
//     borderLeftWidth: 2,
//     borderBottomWidth: 2,
//     borderColor: 'white',
//     transform: [{ rotate: '45deg' }],
//     marginLeft: 4,
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: 'center',
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//     letterSpacing: 0.5,
//   },
//   profileButton: {
//     width: 40,
//     height: 40,
//     backgroundColor: '#f1f5f9',
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: 'white',
//     overflow: 'hidden',
//   },
//   userHead: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#64748b',
//     marginBottom: 2,
//   },
//   userBody: {
//     width: 18,
//     height: 10,
//     borderRadius: 8,
//     backgroundColor: '#64748b',
//   },
//   contentWrapper: {
//     flex: 1,
//     backgroundColor: '#f8fafc', 
//     marginTop: -20,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     overflow: 'hidden',
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingTop: 24,
//     paddingBottom: 40,
//   },
//   sectionTitle: {
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1e293b',
//     marginBottom: 24,
//   },
//   listGap: {
//     paddingBottom: 20,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 10,
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//     borderWidth: 1,
//     borderColor: '#f1f5f9',
//   },
//   cardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   indexText: {
//     fontWeight: 'bold',
//     color: '#0f172a',
//     width: 24,
//     textAlign: 'center',
//   },
//   codeContainer: {
//     width: 80,
//     marginLeft: 16,
//   },
//   codeText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1e293b',
//   },
//   typeText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#64748b',
//     width: 48,
//     textAlign: 'center',
//   },
//   degreeContainer: {
//     flex: 1,
//     alignItems: 'flex-end',
//     paddingRight: 8,
//   },
//   degreeText: {
//     fontSize: 12,
//     color: '#475569',
//     fontWeight: '500',
//   },
//   badge: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   badgeText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
// });



import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { LinearGradient } from 'react-native-linear-gradient';

// Components & Services
import Header from '../layout/Header/Header';
import FooterNav from '../layout/Footer/Footer';
import SessionService from '../../common/Services/SessionService';
import getAdminApiList from '../config/Api/adminApiList';
import MyModal from '../layout/MyModal';
import { HttpService } from '../../common/Services/HttpService';
import CustomSpinner from '../../common/Services/alert/CustomSpinner';
import colors from '../../common/config/colors';

const { width } = Dimensions.get('window');
const badgeColors = ['#6366f1', '#a855f7', '#ec4899', '#f97316'];

const STATIC_SESSIONS = [
  { session_id: 26, SESSION: '2026-27' },
  { session_id: 25, SESSION: '2025-26' },
  { session_id: 24, SESSION: '2024-25' }
];

const STATIC_SEMESTERS = [
  { semester_id: 1, Semester: 'I Semester' },
  { semester_id: 2, Semester: 'II Semester' }
];

const MyStudents = () => {
  const route = useRoute();

  // --- States ---
  const [params, setParams] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [degreeCounts, setDegreeCounts] = useState(route.params?.data || []);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseData, setSelectedCourseData] = useState(null); // Critical for filter updates

  const [loading, setLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);

  // --- 1. Fetch Degree Counts (Updates Top Cards) ---
  const fetchDegreeCounts = useCallback(async (id, session, semester) => {
    try {
      setLoading(true);
      const payload = { Academic_session: session, Semester_Id: semester, Emp_Id: id };
      const response = await HttpService.get(getAdminApiList().getCourseWiseDashCount, payload);
      if (response?.status === 200) {
        setDegreeCounts(response.data?.CourseWiseStudentCount || []);
      }
    } catch (error) {
      console.error("fetchDegreeCounts failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. Fetch Student List (Logic based on your old code) ---
  const getCourseWiseStudentList = useCallback(async (course, currentParams) => {
    if (!empId || !currentParams || !course) return;
    try {
      setStudentLoading(true);
      const payload = {
        Academic_session: currentParams.SelectedSession,
        Semester_Id: currentParams.SelectedSemester,
        Emp_Id: empId,
        Course_Id: course?.course_id || '',
        Degree_Programme_Id: course?.Degree_Programme_Id || '',
        Degree_Programme_Type_Id: course?.Degree_Programme_Type_Id || '',
        Subject_Id: '',
      };

      const response = await HttpService.get(getAdminApiList().getCourseWiseStudentList, payload);
      const list = response?.data.StudentList || [];
      setStudentsList(list);
    } catch (error) {
      console.error("fetch students failed", error);
      setStudentsList([]);
    } finally {
      setStudentLoading(false);
    }
  }, [empId]);

  // --- Initial Setup ---
  useEffect(() => {
    const init = async () => {
      const sessionData = await SessionService.getSession();
      const profile = sessionData?.LoginDetail?.[0];
      setEmpId(profile?.Emp_Id);
      setParams(sessionData);
    };
    init();
  }, []);

  // --- Filter Change Logic ---
  const handleUpdateFilter = async (type, value) => {
    const newParams = { ...params, [type]: value };
    setParams(newParams);
    await SessionService.saveSession(newParams);

    // Refresh the top card counts
    await fetchDegreeCounts(empId, newParams.SelectedSession, newParams.SelectedSemester);

    // If a degree type was already selected, refresh that specific list too
    if (selectedCourseData) {
      getCourseWiseStudentList(selectedCourseData, newParams);
    }
  };

  // --- Click Logic for Degree Type ---
  const handleDegreeClick = (item) => {
    setSelectedCourseId(item.Degree_Programme_Type_Id);
    setSelectedCourseData(item); // Store full object for filter refreshes
    getCourseWiseStudentList(item, params);
  };


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




  const filteredStudents = useMemo(() => {
    return studentsList.filter(s => (s.Name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [studentsList, searchTerm]);

  return (
    <SafeAreaView style={styles.container}>
   
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.flex1}>
   <Header title='My Students' />
        {/* Modern Filter Selectors */}
        <View style={styles.selectorRow}>
          <TouchableOpacity style={styles.modernSelector} onPress={() => setSessionModalVisible(true)}>
            <View>
              <Text style={styles.selectorLabel}>Session</Text>
              <Text style={styles.selectorValue}>
                {STATIC_SESSIONS.find(s => s.session_id === params?.SelectedSession)?.SESSION || 'Select'}
              </Text>
            </View>
            <FontAwesome6 name="calendar-days" size={16} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.modernSelector} onPress={() => setSemesterModalVisible(true)}>
            <View>
              <Text style={styles.selectorLabel}>Semester</Text>
              <Text style={styles.selectorValue}>
                {STATIC_SEMESTERS.find(s => s.semester_id === params?.SelectedSemester)?.Semester || 'Select'}
              </Text>
            </View>
            <FontAwesome6 name="graduation-cap" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Degree Count Section */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Select Degree Type</Text>
            {loading ? (
              <View style={styles.centerSpinner}><CustomSpinner size={30} color={colors.primary} type="dots" /></View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {degreeCounts.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.degreeCard, selectedCourseId === item.Degree_Programme_Type_Id && styles.activeCard]}
                    onPress={() => handleDegreeClick(item)}
                  >
                    <View style={[styles.iconBox, { backgroundColor: badgeColors[index % 4] + '20' }]}>
                      <FontAwesome6 name="user-graduate" size={16} color={badgeColors[index % 4]} />
                    </View>
                    <Text style={styles.degreeText} numberOfLines={1}>{item.Degree_Programme_Type_Name_E}</Text>
                    <Text style={styles.countText}>{item.TotalStudents} Students</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Student List Section */}
          {selectedCourseId && (
            <View style={styles.studentSection}>
              <Text style={styles.sectionTitle}>Student List</Text>
              <View style={styles.searchBar}>
                <FontAwesome6 name="magnifying-glass" size={14} color="#94a3b8" />
                <TextInput
                  placeholder="Search student names..."
                  style={styles.searchInput}
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {studentLoading ? (
                <View style={styles.centerSpinner}><CustomSpinner size={40} color={colors.primary} type="border" /></View>
              ) : filteredStudents.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.noStudents}>No student data available for this selection.</Text>
                </View>
              ) : (
                filteredStudents.map((student, idx) => (

                  <TouchableOpacity key={idx} style={styles.studentItem}  onPress={() => { handleStudentClick(student); setModalVisible(true); }}>
                    <View style={[styles.avatar, { backgroundColor: badgeColors[idx % 4] }]}>
                      <Text style={styles.avatarText}>{student.Name?.charAt(0)}</Text>
                    </View>
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{student.Name}</Text>
                      <Text style={styles.studentSub}>{student.Degree_Programme_Short_Name_E} • {student.Year_semester}</Text>
                    </View>
                    <FontAwesome6 name="chevron-right" size={12} color="#cbd5e1" />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Select Modals */}
      <SelectionModal
        visible={sessionModalVisible}
        onClose={() => setSessionModalVisible(false)}
        title="Session"
        data={STATIC_SESSIONS}
        labelKey="SESSION"
        valueKey="session_id"
        onSelect={(id) => handleUpdateFilter('SelectedSession', id)}
      />
      <SelectionModal
        visible={semesterModalVisible}
        onClose={() => setSemesterModalVisible(false)}
        title="Semester"
        data={STATIC_SEMESTERS}
        labelKey="Semester"
        valueKey="semester_id"
        onSelect={(id) => handleUpdateFilter('SelectedSemester', id)}
      />

      <MyModal visible={modalVisible} onClose={() => setModalVisible(false)} studentData={selectedStudent} />
      <FooterNav />
    </SafeAreaView>
  );
};

// Selection Modal Component
const SelectionModal = ({ visible, onClose, title, data, labelKey, valueKey, onSelect }) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.modalContent}>
        <View style={styles.modalHandle} />
        <Text style={styles.modalHeader}>Select {title}</Text>
        {data.map((item, i) => (
          <TouchableOpacity key={i} style={styles.modalItem} onPress={() => { onSelect(item[valueKey]); onClose(); }}>
            <Text style={styles.modalItemText}>{item[labelKey]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff', paddingTop: -39, },
  selectorRow: { flexDirection: 'row', padding: 15, justifyContent: 'space-between', backgroundColor: '#fff' },
  modernSelector: {
    width: '48%', backgroundColor: '#f8fafc', padding: 12, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#e2e8f0'
  },
  selectorLabel: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' },
  selectorValue: { fontSize: 14, color: '#1e293b', fontWeight: '700' },

  cardSection: { marginTop: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginLeft: 15, marginBottom: 12 },
  horizontalScroll: { paddingLeft: 15, paddingRight: 15, paddingBottom: 10 },
  degreeCard: {
    backgroundColor: '#fff', width: 150, padding: 15, borderRadius: 16, marginRight: 12,
    borderWidth: 1, borderColor: '#e2e8f0', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
  },
  activeCard: { borderColor: colors.primary, backgroundColor: '#f5f3ff', borderWidth: 2 },
  iconBox: { width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  degreeText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  countText: { fontSize: 12, color: colors.primary, fontWeight: 'bold', marginTop: 4 },

  studentSection: { padding: 15, marginTop: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    paddingHorizontal: 12, borderRadius: 12, height: 45, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#1e293b' },
  studentItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 12, borderRadius: 16, marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03
  },
  avatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  studentInfo: { flex: 1, marginLeft: 12 },
  studentName: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  studentSub: { fontSize: 12, color: '#64748b', marginTop: 2 },

  centerSpinner: { padding: 20, alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHandle: { width: 40, height: 5, backgroundColor: '#e2e8f0', borderRadius: 10, alignSelf: 'center', marginBottom: 15 },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#1e293b' },
  modalItem: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalItemText: { fontSize: 16, textAlign: 'center', color: '#334155', fontWeight: '500' },
  emptyState: { alignItems: 'center', marginTop: 20 },
  noStudents: { color: '#94a3b8', fontSize: 14, textAlign: 'center' }
});

export default MyStudents;
























// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { KeyboardAvoidingView } from 'react-native';
// import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Button, Image, TextInput, } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getAdminApiList from '../config/Api/adminApiList';
// import MyModal from '../layout/MyModal';
// import { HttpService } from '../../common/Services/HttpService';
// // import * as Keychain from 'react-native-keychain';
// import CustomSpinner from '../../common/Services/alert/CustomSpinner';
// const badgeColors = ['#f0e0d29f', '#c9b5f735', '#fbcbe04a', '#ef44441d'];
// import { LinearGradient } from 'react-native-linear-gradient';
// import colors from '../../common/config/colors';

// const MyStudents = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const Mystudent = route.params?.data || [];
//   const [modalVisible, setModalVisible] = useState(false);
//   const [DegreeTypeWiseStudentCount, setDegreeTypeWiseStudentCount] = useState(
//     [],
//   );
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [StudentsList, setStudentsList] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [EmpId, setEmpId] = useState(null);
//   const [studentLoading, setStudentLoading] = useState(false);
//   const [studentCache, setStudentCache] = useState({});
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [searchTerm, setSearchTerm] = useState(''); // Added for search

//   const [params, setParams] = useState([]);
//   const [session, setSession] = useState(null);

//   // console.log(route.params, "Mystudent");

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const sessionData = await SessionService.getSession();
//         const profile = sessionData?.LoginDetail?.[0];
//         // console.log(profile, "session (fresh)");
//         setParams(sessionData);
//         setEmpId(profile?.Emp_Id);
//         setStudents(Mystudent);
//       } catch (error) {
//         console.error('Error loading initial data:', error);
//         Alert.alert('Error', 'Failed to load initial data.');
//       }
//     };

//     fetchInitialData();
//   }, [Mystudent]);

//   const getCourseWiseStudentList = useCallback(
//     async data => {
//       if (!EmpId) {
//         Alert.alert('Error', 'Employee ID not loaded. Please try again.');
//         setStudentLoading(false);
//         return;
//       }
//       try {
//         setStudentLoading(true);
//         const CourseWiseStudentListApi =
//           getAdminApiList().getCourseWiseStudentList;
//         if (!CourseWiseStudentListApi)
//           throw new Error('Student List API endpoint not found.');
//         const payload = {
//           Academic_session: params?.SelectedSession,
//           Semester_Id: params?.SelectedSemester,
//           Emp_Id: params?.LoginDetail[0]?.Emp_Id,
//           Course_Id: data?.course_id || '',
//           Degree_Programme_Id: data?.Degree_Programme_Id || '',
//           Degree_Programme_Type_Id: data?.Degree_Programme_Type_Id,
//           Subject_Id: '',
//         };

//         const response = await HttpService.get(
//           CourseWiseStudentListApi,
//           payload,
//         );
//         // console.log(response, "response");
//         const studentList = response?.data.StudentList || [];
//         // Update cache and state
//         setStudentCache(prevCache => ({
//           ...prevCache,
//           [selectedCourseId]: studentList,
//         }));
//         setStudentsList(studentList);
//       } catch (error) {
//         Alert.alert('Failed to Load', error?.message || 'Something went wrong');
//         console.error('Student List fetch error:', error);
//       } finally {
//         setStudentLoading(false);
//       }
//     },
//     [EmpId, params, selectedCourseId, studentCache],
//   );

//   const handleCourseClick = course => {
//     // console.log(course, "course")
//     setSelectedCourseId(course.Degree_Programme_Type_Id);
//     getCourseWiseStudentList(course);
//   };

//   const handleStudentClick = async student => {
//     // console.log(student, "ok student");
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
//         LOGIN_TYPE: student?.LOGIN_TYPE,
//       };
//       // console.log("ok")
//       await SessionService.saveSession(updatedSession);
//       const nowsession = await SessionService.getSession();
//       // console.log(nowsession, "nowupdate")
//     } catch (error) {
//       console.error('Failed to update session:', error);
//     }
//     setModalVisible(true);
//   };

//   // Filtered student list based on search term
//   const filteredStudents = useMemo(() => {
//     return StudentsList.filter(student =>
//       (student.Name || student.name || '').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [StudentsList, searchTerm]);

//   // Memoize the rendered student list
//   const memoizedStudentList = useMemo(() => {
//     return filteredStudents.map((student, idx) => (
//       <TouchableOpacity
//         onPress={() => {
//           handleStudentClick(student);
//           setModalVisible(true);
//         }}
//         key={student.id || idx} // Added key for uniqueness
//       >
//         <View style={styles.studentCard}>
//           <View
//             style={[
//               styles.avatarImage,
//               { backgroundColor: badgeColors[idx % badgeColors.length] },
//             ]}
//           >
//             <Text style={styles.avatarText}>{idx + 1}</Text>
//           </View>

//           <View style={styles.studentInfo}>

//             <View style={styles.badge}>
//               <Text style={styles.studentName}>
//                 {student.Name || student.name}
//               </Text>
//               <Text style={styles.deg}>
//                 {student.Degree_Programme_Short_Name_E || student.degree}{' '}
//               </Text>
//             </View>
//           </View>
//           <View
//             // style={[styles.badge, { backgroundColor: badgeColors[idx % badgeColors.length] },]}>
//             style={[styles.badgee]}>
//             <Text style={styles.studentDetails}>
//               {student.Year_semester || `${student.year} ${student.semester}`}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     ));
//   }, [filteredStudents, badgeColors]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#F3E8DF', '#EFE9E3']}
//         style={styles.gradientBackground}
//       >
//         <Header title='My Students' />
//         <ScrollView style={styles.scrollContainer}>
//           <View style={styles.containerCard}>
//             {/* <View style={styles.header}>
//               <Text style={styles.headerText}>My Students</Text>
//             </View> */}
//             <ScrollView contentContainerStyle={styles.tableScrollContainer}>
//               {/* <View style={styles.cardContainer}>
//                 <Text style={styles.headertable}>Degree Type Wise Count</Text>
//                 {students.map((course, index) => (
//                   <TouchableOpacity
//                     onPress={() => handleCourseClick(course)}
//                     key={course.Degree_Programme_Type_Id}
//                     style={styles.degreeCard}
//                   >
//                     <View style={styles.cardContent}>
//                       <Text style={styles.cardSN}>{index + 1}</Text>
//                       <Text style={styles.cardDPT}>
//                         {course.Degree_Programme_Type_Name_E}
//                       </Text>
//                       <View style={styles.cardBadge}>
//                         <View
//                           style={[
//                             styles.badge,
//                             {
//                               backgroundColor:
//                                 badgeColors[index % badgeColors.length],
//                             },
//                           ]}
//                         >
//                           <Text style={styles.badgeText}>
//                             👉🏻{course.TotalStudents}
//                           </Text>
//                         </View>
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                 ))}
//               </View> */}

//               {/* <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search students by name..."
//                 value={searchTerm}
//                 onChangeText={setSearchTerm}
//               /> */}


//               <View style={styles.cardContainer}>

//                 <Text style={styles.headertable}>Degree Type Wise Count</Text>
//                 {students.map((course, index) => (
//                   <TouchableOpacity
//                     onPress={() => handleCourseClick(course)}
//                     key={course.Degree_Programme_Type_Id}
//                     style={styles.degreeCard}
//                   >
//                     <View style={styles.cardContent}>
//                       <Text style={styles.cardSN}>{index + 1}</Text>
//                       <Text style={styles.cardDPT}>
//                         {course.Degree_Programme_Type_Name_E}
//                       </Text>
//                       <View style={styles.cardBadge}>
//                         <View
//                           style={[
//                             styles.badge,
//                             {
//                               backgroundColor:
//                                 badgeColors[index % badgeColors.length],
//                             },
//                           ]}
//                         >
//                           <Text style={styles.badgeText}>
//                             👉🏻{course.TotalStudents}
//                           </Text>
//                         </View>
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//             </ScrollView>
//           </View>

//           {selectedCourseId && (
//             <View style={styles.studentListContainer}>

//               {/* <View style={styles.header}>
//                 <Text style={styles.studentListTitle}>Student List</Text>
//               </View> */}
//               {/* Search Input */}

//               {studentLoading ? (
//                 <View style={styles.spinnerWithText}>
//                   <CustomSpinner
//                     size={50}
//                     color="rgba(255, 99, 71, 1)"
//                     type="border"
//                   />
//                   <Text style={styles.text}>Loading...</Text>
//                 </View>
//               ) : filteredStudents.length === 0 ? (
//                 <Text style={styles.noStudents}>
//                   {StudentsList.length === 0 ? 'No student data available' : 'No students match your search'}
//                 </Text>
//               ) : (
//                 memoizedStudentList
//               )}
//             </View>
//           )}

//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: 'red',
//             }}
//           >
//             <MyModal
//               visible={modalVisible}
//               onClose={() => setModalVisible(false)}
//               studentData={selectedStudent}
//             />
//           </View>
//         </ScrollView>
//       </LinearGradient>
//       <FooterNav />
//     </SafeAreaView>
//   );
// };

// export default MyStudents;

// const styles = StyleSheet.create({
//   containerCard: {
//     flex: 1,
//     // borderBottomEndRadius: 55,
//     // borderBottomStartRadius: 55,
//     // borderWidth: 1,
//     borderColor: '#fff',
//   },
//   container: {
//     flex: 1,
//   },
//   gradientBackground: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   header: {
//     margin: 10,
//     padding: 10,
//     alignItems: 'center',
//     borderRadius: 20,
//     backgroundColor: '#FCECDD',
//     borderWidth: 2,
//     borderColor: '#ffffffff',
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000000ff',
//   },
//   headerCard: {
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//     borderRadius: 20,
//   },
//   tableScrollContainer: {
//     padding: -10,
//     paddingHorizontal: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // Replaced tableContainer with cardContainer
//   cardContainer: {
//     backgroundColor: '#3D365C',
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 10,
//     shadowColor: '#AEDEFC',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 5.3,
//     shadowRadius: 4,
//     elevation: 35,
//   },
//   headertable: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000000ff',
//     backgroundColor: '#1a04503f',
//     borderRadius: 10,
//     textAlign: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//     padding: 10,
//   },


//   // New styles for degree cards for table
//   // degreeCard: {
//   //   backgroundColor: '#FCD8CD',
//   //   borderRadius: 10,
//   //   padding: 10,
//   //   marginBottom: 10,
//   //   shadowColor: '#ffffffff',
//   //   shadowOffset: { width: 0, height: 1 },
//   //   shadowOpacity: 0.2,
//   //   shadowRadius: 2,
//   //   elevation: 3,
//   // },
//   // cardContent: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   justifyContent: 'space-between',
//   // },
//   // cardSN: {
//   //   flex: 0.5,
//   //   textAlign: 'center',
//   //   color: '#000000ff',
//   //   fontSize: 14,
//   //   fontWeight: 'bold',
//   // },
//   // cardDPT: {
//   //   flex: 2,
//   //   textAlign: 'center',
//   //   color: '#000000ff',
//   //   fontSize: 14,
//   // },
//   // cardBadge: {
//   //   flex: 1,
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   // },
//   // badge: {
//   //   paddingHorizontal: 10,
//   //   paddingVertical: 5,
//   //   borderRadius: 20,
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   // },
//   // badgeText: {
//   //   color: '#fff',
//   //   fontWeight: 'bold',
//   // },




//   studentListContainer: {
//     padding: 10,
//   },
//   studentListTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#a90000ff',
//     marginBottom: 10,
//   },
//   // Added search input style
//   searchInput: {
//     // position: 'absolute',
//     height: 60,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 15,
//     paddingHorizontal: 10,
//     // marginBottom: 10,
//     backgroundColor: '#fff',
//   },

//   studentCard: {
//     flexDirection: 'row',
//     backgroundColor: '#EFF6FF',
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: '#ffffffff',
//     padding: 10,
//     margin: 5,
//     shadowOpacity: 0.3,
//     shadowColor: '#fdc1f2ff',
//     shadowRadius: 4,
//     elevation: 20,
//   },
//   avatarContainer: {
//     marginRight: 15,
//   },
//   avatarImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
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
//     flexDirection: 'row',
//   },
//   studentName: {
//     width: 150,
//     flexWrap: 'wrap',
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#4f0000ff',
//   },
//   deg: {
//     // width: 170,
//     fontSize: 12,
//     // color: '#f60606f0',
//     flexDirection: 'column',
//     flexWrap: 'wrap',
//     // width: '100%',
//     // overflow: 'hidden',
//   },
//   studentDetails: {
//     marginLeft: -8,
//     fontSize: 12,
//     color: '#f60606f0',
//     // flexDirection: 'column',
//     flexWrap: 'wrap',
//     // width: '100%',
//     width: 170,
//     overflow: 'hidden',
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








//   cardContainer: {
//     padding: 10,
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },

//   // headertable: {
//   //   fontSize: 16,
//   //   fontWeight: 'bold',
//   //   marginBottom: 15,
//   // },

//   degreeCard: {
//     backgroundColor: '#f8ededff',
//     padding: 15,
//     marginVertical: 8,
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%', // Ensure the card takes the full width of its container
//     overflow: 'hidden', // Prevent overflow
//   },

//   cardContent: {
//     flexDirection: 'row', // Horizontal layout for SN, Degree Name, and Badge
//     alignItems: 'center',
//     flexWrap: 'wrap', // Allow wrapping if the content overflows
//     width: '100%', // Full width
//   },

//   cardSN: {
//     fontSize: 14,
//     color: '#333',
//     marginRight: 10,
//     flexShrink: 0, // Don't let the index number shrink
//   },

//   cardDPT: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1, // Allow text to take available space
//     flexWrap: 'wrap', // Ensure the Degree name wraps when needed
//     marginRight: 10,
//   },

//   cardBadge: {
//     // marginLeft: 'auto', // Push the badge to the right
//   },

//   badge: {
//     backgroundColor: '#f0f0f0',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 20,
//     // alignItems: 'center',
//   },

//   badgeText: {
//     fontSize: 12,
//     color: '#333',
//   },
// });
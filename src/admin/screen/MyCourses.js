import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Components & Services
import Header from '../layout/Header/Header';
import FooterNav from '../layout/Footer/Footer';
import SessionService from '../../common/Services/SessionService';
import getApiList from '../config/Api/adminApiList';
import { HttpService } from '../../common/Services/HttpService';
import MyModal from '../layout/MyModal';
import CustomSpinner from '../../common/Services/alert/CustomSpinner';
import colors from '../../common/config/colors';

const { width } = Dimensions.get('window');
const badgeColors = ['#6366f1', '#a855f7', '#ec4899', '#f97316'];

// Updated Data Format
const STATIC_SEMESTERS = [
  { semester_id: 1, Semester: 'I Semester' },
  { semester_id: 2, Semester: 'II Semester' }
];

const STATIC_SESSION_DATA = [
  { session_id: 26, SESSION: '2026-27' },
  { session_id: 25, SESSION: '2025-26' },
  { session_id: 24, SESSION: '2024-25' },
  { session_id: 23, SESSION: '2023-24' }
];

const MyCourses = ({ route }) => {
  // --- States ---
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [sessionParams, setSessionParams] = useState(null);
  const [empId, setEmpId] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. Fetch Courses API ---
  const fetchMyCourses = useCallback(async (id, session, semester) => {
    try {
      if (!id) return;
      const payload = { 
        Semester_Id: semester, 
        Academic_session: session, 
        Emp_Id: id 
      };
      const response = await HttpService.get(getApiList().getCourseWiseDashCount, payload);
      
      if (response?.status === 200) {
        const courseData = response.data?.CourseWiseStudentCount || [];
        setCourses(courseData);
        if (courseData.length > 0) {
          setSelectedCourseId(courseData[0].course_id);
        } else {
          setStudents([]);
          setSelectedCourseId(null);
        }
      }
    } catch (error) {
      console.error("fetchMyCourses failed:", error);
    }
  }, []);

  // --- 2. Fetch Students API ---
  const fetchStudents = useCallback(async (courseId, params) => {
    if (!empId || !params || !courseId) return;
    const courseObj = courses.find(c => c.course_id === courseId);
    if (!courseObj) return;

    try {
      setStudentLoading(true);
      const payload = {
        Academic_session: params.SelectedSession,
        Semester_Id: params.SelectedSemester,
        Emp_Id: empId,
        Course_Id: courseObj.course_id,
        Degree_Programme_Id: courseObj.Degree_Programme_Id,
        Degree_Programme_Type_Id: courseObj.Degree_Programme_Type_Id,
        Subject_Id: '',
      };
      const response = await HttpService.get(getApiList().getCourseWiseStudentList, payload);
      setStudents(response?.data.StudentList || []);
    } catch (error) {
      console.error("fetchStudents failed");
    } finally {
      setStudentLoading(false);
    }
  }, [empId, courses]);

  // --- 3. Initial Load ---
  useEffect(() => {
    console.log(route.params,"route.params")
    const init = async () => {
      const sessionData = await SessionService.getSession();
      const profile = sessionData?.LoginDetail?.[0];
      const initialEmpId = profile?.Emp_Id;
      
      // Defaulting to first index of your new static data format
      const initialSession = route.params?.session || sessionData?.SelectedSession || STATIC_SESSION_DATA[0].session_id;
      const initialSem = route.params?.semester || sessionData?.SelectedSemester || STATIC_SEMESTERS[0].semester_id;

      setEmpId(initialEmpId);
      setSessionParams({ SelectedSession: initialSession, SelectedSemester: initialSem });
      
      await fetchMyCourses(initialEmpId, initialSession, initialSem);
      setLoading(false);
    };
    init();
  }, [fetchMyCourses]);

  // Sync Student list when Course or Filters change
  useEffect(() => {
    if (selectedCourseId && sessionParams) {
      fetchStudents(selectedCourseId, sessionParams);
    }
  }, [selectedCourseId, sessionParams, fetchStudents]);

  // --- 4. Persistent Selection Handlers ---
  const handleUpdateFilter = async (newSession, newSem) => {
    try {
      setStudentLoading(true);
      const currentSession = await SessionService.getSession();
      const updatedSession = {
        ...currentSession,
        SelectedSemester: newSem,
        SelectedSession: newSession,
      };
      await SessionService.saveSession(updatedSession);
      setSessionParams({ SelectedSession: newSession, SelectedSemester: newSem });
      
      await fetchMyCourses(empId, newSession, newSem);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setStudentLoading(false);
    }
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
    return students.filter(s => (s.Name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [students, searchTerm]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title='My Courses' />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filter Selection Row */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setSessionModalVisible(true)}>
            {/* <Text style={styles.filterBtnText}>{sessionParams?.SelectedSession}</Text> */}
            <Text style={styles.filterBtnText}>
              {STATIC_SESSION_DATA.find(s => s.session_id === sessionParams?.SelectedSession)?.SESSION}
              </Text>
            <FontAwesome6 name="chevron-down" size={20} color="#5e2308ff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterBtn} onPress={() => setSemesterModalVisible(true)}>
            <Text style={styles.filterBtnText}>
              {STATIC_SEMESTERS.find(s => s.semester_id === sessionParams?.SelectedSemester)?.Semester}
            </Text>
            <FontAwesome6 name="chevron-down" size={20} color="#c03d00ff" />
          </TouchableOpacity>
        </View>

        {/* Course Cards Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.courseScroll}>
          {courses.map((course, index) => (
            <TouchableOpacity 
              key={course.course_id} 
              onPress={() => setSelectedCourseId(course.course_id)}
              style={[styles.courseCard, selectedCourseId === course.course_id && styles.activeCard]}
            >
              <View style={[styles.courseIcon, { backgroundColor: badgeColors[index % badgeColors.length] + '20' }]}>
                 <FontAwesome6 name="book" size={16} color={badgeColors[index % badgeColors.length]} />
              </View>
              <Text style={styles.courseCode}>{course.Course_code}</Text>
              <Text style={styles.studentCount}>{course.TotalStudents} Students</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <FontAwesome6 name="magnifying-glass" size={16} color="#94a3b8" />
          <TextInput
            style={styles.input}
            placeholder="Search student names..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Student List Area */}
        <View style={styles.listContainer}>
          {studentLoading ? (
            <CustomSpinner size={40} color={colors.primary} type="dots" />
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((item, index) => (
              <TouchableOpacity key={index} style={styles.studentCard} onPress={() => { handleStudentClick(item); setModalVisible(true); }}>
                <View style={[styles.avatar, { backgroundColor: badgeColors[index % badgeColors.length] }]}>
                  <Text style={styles.avatarText}>{item.Name.charAt(0)}</Text>
                </View>
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{item.Name}</Text>
                  <Text style={styles.studentId}>{item.Degree_Programme_Short_Name_E}</Text>
                </View>
                <FontAwesome6 name="chevron-right" size={14} color="#cbd5e1" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome6 name="circle-info" size={40} color="#cbd5e1" />
              <Text style={styles.emptyText}>No students available</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Session Modal - Updated to use SESSION and session_id */}
      <Modal visible={sessionModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSessionModalVisible(false)}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Academic Session</Text>
            {STATIC_SESSION_DATA.map(item => (
              <TouchableOpacity key={item.session_id} style={styles.pickerItem} onPress={() => handleUpdateFilter(item.session_id, sessionParams.SelectedSemester).then(() => setSessionModalVisible(false))}>
                <Text style={styles.pickerText}>{item.SESSION}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Semester Modal - Updated to use Semester and semester_id */}
      <Modal visible={semesterModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSemesterModalVisible(false)}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Semester</Text>
            {STATIC_SEMESTERS.map(item => (
              <TouchableOpacity key={item.semester_id} style={styles.pickerItem} onPress={() => handleUpdateFilter(sessionParams.SelectedSession, item.semester_id).then(() => setSemesterModalVisible(false))}>
                <Text style={styles.pickerText}>{item.Semester}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <MyModal visible={modalVisible} onClose={() => setModalVisible(false)} studentData={selectedStudent} />
      <FooterNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  filterRow: { flexDirection: 'row', padding: 20, justifyContent: 'space-between' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, width: '48%', borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  filterBtnText: { flex: 1, color: '#1e293b', fontWeight: 'bold' },
  courseScroll: { paddingLeft: 20, paddingBottom: 10 },
  courseCard: { backgroundColor: '#fff', width: width * 0.38, padding: 15, borderRadius: 16, marginRight: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  activeCard: { borderColor: '#6366f1', borderWidth: 2, backgroundColor: '#f5f3ff' },
  courseIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  courseCode: { fontWeight: 'bold', color: '#1e293b', fontSize: 14 },
  studentCount: { fontSize: 11, color: '#64748b' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 20, paddingHorizontal: 15, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  input: { flex: 1, marginLeft: 10, color: '#1e293b' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 120 },
  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 14, marginBottom: 10, elevation: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  studentDetails: { flex: 1, marginLeft: 12 },
  studentName: { fontWeight: '600', color: '#1e293b' },
  studentId: { fontSize: 11, color: '#94a3b8' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  pickerContainer: { backgroundColor: '#fff', width: '85%', borderRadius: 20, padding: 20 },
  pickerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  pickerItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  pickerText: { fontSize: 16, textAlign: 'center' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#94a3b8', marginTop: 10 }
});

export default MyCourses;



















// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput, Dimensions, Modal } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// // Components & Services
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getApiList from '../config/Api/adminApiList'; // Updated reference
// import { HttpService } from '../../common/Services/HttpService';
// import MyModal from '../layout/MyModal';
// import CustomSpinner from '../../common/Services/alert/CustomSpinner';
// import colors from '../../common/config/colors';

// const { width } = Dimensions.get('window');
// const badgeColors = ['#6366f1', '#a855f7', '#ec4899', '#f97316'];

// const STATIC_SEMESTERS = [{ key: 1, label: 'I Semester' }, { key: 2, label: 'II Semester' }];
// const STATIC_SESSION_DATA = [{ key: 25, label: '26' }, { key: 24, label: '25' }, { key: 23, label: '23' }];

// const MyCourses = ({ route }) => {
//   // --- States ---
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [sessionParams, setSessionParams] = useState(null);
//   const [empId, setEmpId] = useState(null);
  
//   const [loading, setLoading] = useState(true);
//   const [studentLoading, setStudentLoading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [sessionModalVisible, setSessionModalVisible] = useState(false);
//   const [semesterModalVisible, setSemesterModalVisible] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   // --- 1. Fetch Courses API ---
//   const fetchMyCourses = useCallback(async (id, session, semester) => {
//     console.log("fetchMyCourses call with:", session, semester);
//     try {
//       if (!id) return;
//       const payload = { Semester_Id: semester, Academic_session: session, Emp_Id: id };
//       const response = await HttpService.get(getApiList().getCourseWiseDashCount, payload);
//       console.log(response,"response")
      
//       if (response?.status === 200) {
//         const courseData = response.data?.CourseWiseStudentCount || [];
//         setCourses(courseData);
//         // Auto-select first course when list changes
//         if (courseData.length > 0) {
//           setSelectedCourseId(courseData[0].course_id);
//         } else {
//           setStudents([]);
//           setSelectedCourseId(null);
//         }
//       }
//     } catch (error) {
//       console.error("fetchMyCourses failed:", error);
//     }
//   }, []);

//   // --- 2. Fetch Students API ---
//   const fetchStudents = useCallback(async (courseId, params) => {
//     if (!empId || !params || !courseId) return;
//     const courseObj = courses.find(c => c.course_id === courseId);
//     if (!courseObj) return;

//     try {
//       setStudentLoading(true);
//       const payload = {
//         Academic_session: params.SelectedSession,
//         Semester_Id: params.SelectedSemester,
//         Emp_Id: empId,
//         Course_Id: courseObj.course_id,
//         Degree_Programme_Id: courseObj.Degree_Programme_Id,
//         Degree_Programme_Type_Id: courseObj.Degree_Programme_Type_Id,
//         Subject_Id: '',
//       };
//       const response = await HttpService.get(getApiList().getCourseWiseStudentList, payload);
//       setStudents(response?.data.StudentList || []);
//     } catch (error) {
//       console.error("fetchStudents failed");
//     } finally {
//       setStudentLoading(false);
//     }
//   }, [empId, courses]);

//   // --- 3. Initial Load ---
//   useEffect(() => {
//     const init = async () => {
//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const initialEmpId = profile?.Emp_Id;
//       const initialSession = route.params?.session || sessionData?.SelectedSession || '2025-26';
//       const initialSem = route.params?.semester || sessionData?.SelectedSemester || 1;

//       setEmpId(initialEmpId);
//       setSessionParams({ SelectedSession: initialSession, SelectedSemester: initialSem });
      
//       await fetchMyCourses(initialEmpId, initialSession, initialSem);
//       setLoading(false);
//     };
//     init();
//   }, [fetchMyCourses]);

//   // Sync Student list when Course or Filters change
//   useEffect(() => {
//     if (selectedCourseId && sessionParams) {
//       fetchStudents(selectedCourseId, sessionParams);
//     }
//   }, [selectedCourseId, sessionParams, fetchStudents]);

//   // --- 4. Persistent Selection Handlers ---
//   const handleUpdateFilter = async (newSession, newSem) => {
//     try {
//       setStudentLoading(true);
//       const currentSession = await SessionService.getSession();
//       const updatedSession = {
//         ...currentSession,
//         SelectedSemester: newSem,
//         SelectedSession: newSession,
//       };
//       await SessionService.saveSession(updatedSession);
//       setSessionParams({ SelectedSession: newSession, SelectedSemester: newSem });
      
//       // Refresh Course List first
//       await fetchMyCourses(empId, newSession, newSem);
//     } catch (error) {
//       console.error("Update failed:", error);
//     } finally {
//       setStudentLoading(false);
//     }
//   };

//   const filteredStudents = useMemo(() => {
//     return students.filter(s => (s.Name || '').toLowerCase().includes(searchTerm.toLowerCase()));
//   }, [students, searchTerm]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title='My Courses' />
      
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Filter Selection Row */}
//         <View style={styles.filterRow}>
//           <TouchableOpacity style={styles.filterBtn} onPress={() => setSessionModalVisible(true)}>
//             <Text style={styles.filterBtnText}>{sessionParams?.SelectedSession}</Text>
//             <MaterialIcons name="arrow-drop-down" size={24} color="#64748b" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.filterBtn} onPress={() => setSemesterModalVisible(true)}>
//             <Text style={styles.filterBtnText}>
//               {STATIC_SEMESTERS.find(s => s.key === sessionParams?.SelectedSemester)?.label}
//             </Text>
//             <MaterialIcons name="arrow-drop-down" size={24} color="#64748b" />
//           </TouchableOpacity>
//         </View>

//         {/* Course Cards Scroll */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.courseScroll}>
//           {courses.map((course, index) => (
//             <TouchableOpacity 
//               key={course.course_id} 
//               onPress={() => setSelectedCourseId(course.course_id)}
//               style={[styles.courseCard, selectedCourseId === course.course_id && styles.activeCard]}
//             >
//               <View style={[styles.courseIcon, { backgroundColor: badgeColors[index % badgeColors.length] + '20' }]}>
//                  <FontAwesome6 name="book" size={16} color={badgeColors[index % badgeColors.length]} />
//               </View>
//               <Text style={styles.courseCode}>{course.Course_code}</Text>
//               <Text style={styles.studentCount}>{course.TotalStudents} Students</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Search Bar */}
//         <View style={styles.searchBox}>
//           <FontAwesome6 name="magnifying-glass" size={16} color="#94a3b8" />
//           <TextInput
//             style={styles.input}
//             placeholder="Search student names..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//           />
//         </View>

//         {/* List of Students */}
//         <View style={styles.listContainer}>
//           {studentLoading ? (
//             <CustomSpinner size={40} color={colors.primary} type="dots" />
//           ) : filteredStudents.length > 0 ? (
//             filteredStudents.map((item, index) => (
//               <TouchableOpacity key={index} style={styles.studentCard} onPress={() => { setSelectedStudent(item); setModalVisible(true); }}>
//                 <View style={[styles.avatar, { backgroundColor: badgeColors[index % badgeColors.length] }]}>
//                   <Text style={styles.avatarText}>{item.Name.charAt(0)}</Text>
//                 </View>
//                 <View style={styles.studentDetails}>
//                   <Text style={styles.studentName}>{item.Name}</Text>
//                   <Text style={styles.studentId}>{item.Degree_Programme_Short_Name_E}</Text>
//                 </View>
//                 <FontAwesome6 name="chevron-right" size={14} color="#cbd5e1" />
//               </TouchableOpacity>
//             ))
//           ) : (
//             <View style={styles.emptyState}>
//               <FontAwesome6 name="circle-info" size={40} color="#cbd5e1" />
//               <Text style={styles.emptyText}>No students available</Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Session/Semester Selection Modals */}
//       <Modal visible={sessionModalVisible} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} onPress={() => setSessionModalVisible(false)}>
//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerTitle}>Academic Session</Text>
//             {STATIC_SESSION_DATA.map(item => (
//               <TouchableOpacity key={item.key} style={styles.pickerItem} onPress={() => handleUpdateFilter(item.label, sessionParams.SelectedSemester).then(() => setSessionModalVisible(false))}>
//                 <Text style={styles.pickerText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       <Modal visible={semesterModalVisible} transparent animationType="fade">
//         <TouchableOpacity style={styles.modalOverlay} onPress={() => setSemesterModalVisible(false)}>
//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerTitle}>Semester</Text>
//             {STATIC_SEMESTERS.map(item => (
//               <TouchableOpacity key={item.key} style={styles.pickerItem} onPress={() => handleUpdateFilter(sessionParams.SelectedSession, item.key).then(() => setSemesterModalVisible(false))}>
//                 <Text style={styles.pickerText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       <MyModal visible={modalVisible} onClose={() => setModalVisible(false)} studentData={selectedStudent} />
//       <FooterNav />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8fafc' },
//   filterRow: { flexDirection: 'row', padding: 20, justifyContent: 'space-between' },
//   filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, width: '48%', borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
//   filterBtnText: { flex: 1, color: '#1e293b', fontWeight: 'bold' },
//   courseScroll: { paddingLeft: 20, paddingBottom: 10 },
//   courseCard: { backgroundColor: '#fff', width: width * 0.38, padding: 15, borderRadius: 16, marginRight: 12, borderWidth: 1, borderColor: '#e2e8f0' },
//   activeCard: { borderColor: '#6366f1', borderWidth: 2, backgroundColor: '#f5f3ff' },
//   courseIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
//   courseCode: { fontWeight: 'bold', color: '#1e293b', fontSize: 14 },
//   studentCount: { fontSize: 11, color: '#64748b' },
//   searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 20, paddingHorizontal: 15, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
//   input: { flex: 1, marginLeft: 10, color: '#1e293b' },
//   listContainer: { paddingHorizontal: 20, paddingBottom: 120 },
//   studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 14, marginBottom: 10, elevation: 1 },
//   avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
//   avatarText: { color: '#fff', fontWeight: 'bold' },
//   studentDetails: { flex: 1, marginLeft: 12 },
//   studentName: { fontWeight: '600', color: '#1e293b' },
//   studentId: { fontSize: 11, color: '#94a3b8' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
//   pickerContainer: { backgroundColor: '#fff', width: '85%', borderRadius: 20, padding: 20 },
//   pickerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
//   pickerItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
//   pickerText: { fontSize: 16, textAlign: 'center' },
//   emptyState: { alignItems: 'center', marginTop: 40 },
//   emptyText: { color: '#94a3b8', marginTop: 10 }
// });

// export default MyCourses;











// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, FlatList, TextInput, Dimensions, Modal } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// // Components & Services
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from '../../common/Services/HttpService';
// import MyModal from '../layout/MyModal';
// import CustomSpinner from '../../common/Services/alert/CustomSpinner';
// import colors from '../../common/config/colors';

// const { width, height } = Dimensions.get('window');
// const badgeColors = ['#6366f1', '#a855f7', '#ec4899', '#f97316'];

// // --- Static Data ---
// const STATIC_SEMESTERS = [
//   { key: 1, label: 'I Semester' },
//   { key: 2, label: 'II Semester' }
// ];

// const STATIC_SESSION_DATA = [
//   { key: 25, label: '2025-26' },
//   { key: 24, label: '2024-25' },
//   { key: 23, label: '2023-24' },
//   { key: 22, label: '2022-23' },
//   { key: 21, label: '2021-22' },
//   { key: 20, label: '2020-21' },
//   { key: 19, label: '2019-20' },
//   { key: 18, label: '2018-19' }
// ];

// const MyCourses = ({ route }) => {
//   const MyCourseData = route.params?.data || [];
//   const navSession = route.params?.session;
//   const navSemester = route.params?.semester;

//   // --- State Management ---
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [sessionParams, setSessionParams] = useState(null);
//   const [empId, setEmpId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [studentLoading, setStudentLoading] = useState(false);
//   const [studentCache, setStudentCache] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');

//   // Modals Visibility
//   const [modalVisible, setModalVisible] = useState(false);
//   const [sessionModalVisible, setSessionModalVisible] = useState(false);
//   const [semesterModalVisible, setSemesterModalVisible] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   // --- 1. Initialization ---
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const sessionData = await SessionService.getSession();
//         const profile = sessionData?.LoginDetail?.[0];
        
//         setSessionParams({
//           SelectedSession: navSession || sessionData?.SelectedSession || '2025-26',
//           SelectedSemester: navSemester || sessionData?.SelectedSemester || 1,
//         });
//         setEmpId(profile?.Emp_Id);
//         setCourses(MyCourseData?.CourseWiseStudentCount || []);
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, [navSession, navSemester, MyCourseData]);

//   // --- 2. API Logic ---
//   const getCourseWiseStudentList = useCallback(async (courseIdOverride = null) => {
//     const targetCourseId = courseIdOverride || selectedCourseId;
//     if (!empId || !sessionParams || !targetCourseId) return;

//     // Find full course object from the list
//     const courseObj = courses.find(c => c.course_id === targetCourseId);
//     if (!courseObj) return;
    
//     try {
//       setStudentLoading(true);
//       const CourseWiseStudentListApi = getAdminApiList().getCourseWiseStudentList;
      
//       const payload = {
//         Academic_session: sessionParams.SelectedSession,
//         Semester_Id: sessionParams.SelectedSemester,
//         Emp_Id: empId,
//         Course_Id: courseObj.course_id,
//         Degree_Programme_Id: courseObj.Degree_Programme_Id,
//         Degree_Programme_Type_Id: courseObj.Degree_Programme_Type_Id,
//         Subject_Id: '',
//       };

//       const response = await HttpService.get(CourseWiseStudentListApi, payload);
//       const studentList = response?.data.StudentList || [];
      
//       setStudentCache((prev) => ({ ...prev, [targetCourseId]: studentList }));
//       setStudents(studentList);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch students.');
//     } finally {
//       setStudentLoading(false);
//     }
//   }, [empId, sessionParams, selectedCourseId, courses]);

//   // Trigger refresh when session/semester changes
//   useEffect(() => {
//     if (selectedCourseId) {
//         setStudentCache({}); // Clear cache on filter change to force fresh data
//         getCourseWiseStudentList();
//     }
//   }, [sessionParams]);

//   // --- 3. Handlers ---
//   const handleCourseClick = useCallback((course) => {
//     setSelectedCourseId(course?.course_id);
//     if (studentCache[course?.course_id]) {
//       setStudents(studentCache[course?.course_id]);
//     } else {
//       getCourseWiseStudentList(course.course_id);
//     }
//   }, [studentCache, getCourseWiseStudentList]);

//   const handleSessionSelect = (item) => {
//     setSessionParams(prev => ({ ...prev, SelectedSession: item.label }));
//     setSessionModalVisible(false);
//   };

//   const handleSemesterSelect = (item) => {
//     setSessionParams(prev => ({ ...prev, SelectedSemester: item.key }));
//     setSemesterModalVisible(false);
//   };

//   const handleStudentClick = useCallback(async (student) => {
//     setSelectedStudent(student);
//     setModalVisible(true);
//   }, []);

//   const filteredStudents = useMemo(() => {
//     return students.filter(s => (s.Name || '').toLowerCase().includes(searchTerm.toLowerCase()));
//   }, [students, searchTerm]);

//   // --- 4. Sub-Component for Selection List ---
//   const SelectionModal = ({ visible, setVisible, data, onSelect, title }) => (
//     <Modal visible={visible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//             <View style={styles.pickerContainer}>
//                 <View style={styles.pickerHeader}>
//                     <Text style={styles.pickerTitle}>{title}</Text>
//                     <TouchableOpacity onPress={() => setVisible(false)}>
//                         <MaterialIcons name="close" size={24} color="#000" />
//                     </TouchableOpacity>
//                 </View>
//                 <FlatList
//                     data={data}
//                     keyExtractor={(item) => item.key.toString()}
//                     renderItem={({ item }) => (
//                         <TouchableOpacity style={styles.pickerItem} onPress={() => onSelect(item)}>
//                             <Text style={styles.pickerText}>{item.label}</Text>
//                             <FontAwesome6 name="chevron-right" size={12} color="#cbd5e1" />
//                         </TouchableOpacity>
//                     )}
//                 />
//             </View>
//         </View>
//     </Modal>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title='My Courses' />
      
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
//         {/* Filter Section (Session/Semester Pickers) */}
//         <View style={styles.filterRow}>
//             <TouchableOpacity style={styles.filterBtn} onPress={() => setSessionModalVisible(true)}>
//                 <FontAwesome6 name="calendar-days" size={14} color={colors.primary} />
//                 <Text style={styles.filterBtnText}>{sessionParams?.SelectedSession || 'Session'}</Text>
//                 <MaterialIcons name="arrow-drop-down" size={20} color="#64748b" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.filterBtn} onPress={() => setSemesterModalVisible(true)}>
//                 <FontAwesome6 name="layer-group" size={14} color={colors.primary} />
//                 <Text style={styles.filterBtnText}>
//                     {STATIC_SEMESTERS.find(s => s.key === sessionParams?.SelectedSemester)?.label || 'Semester'}
//                 </Text>
//                 <MaterialIcons name="arrow-drop-down" size={20} color="#64748b" />
//             </TouchableOpacity>
//         </View>

//         {/* Horizontal Course Selector */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.courseScroll}>
//           {courses.map((course, index) => (
//             <TouchableOpacity 
//               key={course.course_id} 
//               onPress={() => handleCourseClick(course)}
//               style={[styles.courseCard, selectedCourseId === course.course_id && styles.activeCard]}
//             >
//               <View style={[styles.courseIcon, { backgroundColor: badgeColors[index % badgeColors.length] + '20' }]}>
//                 <FontAwesome6 name="graduation-cap" size={18} color={badgeColors[index % badgeColors.length]} />
//               </View>
//               <Text style={styles.courseCode}>{course.Course_code}</Text>
//               <Text style={styles.studentCount}>{course.TotalStudents} Students</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         <View style={styles.searchBox}>
//           <FontAwesome6 name="magnifying-glass" size={16} color="#94a3b8" />
//           <TextInput
//             style={styles.input}
//             placeholder="Search students..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//           />
//         </View>

//         <View style={styles.listContainer}>
//           <Text style={styles.listHeader}>Student List</Text>
//           {studentLoading ? (
//             <CustomSpinner size={40} color={colors.primary} type="dots" />
//           ) : filteredStudents.length > 0 ? (
//             filteredStudents.map((item, index) => (
//               <TouchableOpacity key={index} style={styles.studentCard} onPress={() => handleStudentClick(item)}>
//                 <View style={[styles.avatar, { backgroundColor: badgeColors[index % badgeColors.length] }]}>
//                   <Text style={styles.avatarText}>{item.Name.charAt(0)}</Text>
//                 </View>
//                 <View style={styles.studentDetails}>
//                   <Text style={styles.studentName}>{item.Name}</Text>
//                   <Text style={styles.studentId}>{item.Degree_Programme_Short_Name_E}</Text>
//                   <Text style={styles.studentId}>{item.Year_semester}</Text>
//                 </View>
//                 <FontAwesome6 name="chevron-right" size={14} color="#cbd5e1" />
//               </TouchableOpacity>
//             ))
//           ) : (
//             <View style={styles.emptyState}>
//               <FontAwesome6 name="user-slash" size={40} color="#cbd5e1" />
//               <Text style={styles.emptyText}>{selectedCourseId ? "No students match filter" : "Select a course above"}</Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Selection Lists Modals */}
//       <SelectionModal 
//         visible={sessionModalVisible} 
//         setVisible={setSessionModalVisible} 
//         data={STATIC_SESSION_DATA} 
//         onSelect={handleSessionSelect} 
//         title="Select Academic Session" 
//       />
//       <SelectionModal 
//         visible={semesterModalVisible} 
//         setVisible={setSemesterModalVisible} 
//         data={STATIC_SEMESTERS} 
//         onSelect={handleSemesterSelect} 
//         title="Select Semester" 
//       />

//       <MyModal visible={modalVisible} onClose={() => setModalVisible(false)} studentData={selectedStudent} />
//       <FooterNav />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8fafc' },
//   filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, justifyContent: 'space-between' },
//   filterBtn: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     backgroundColor: '#fff', 
//     paddingHorizontal: 12, 
//     paddingVertical: 10, 
//     borderRadius: 12, 
//     width: '48%',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     elevation: 2
//   },
//   filterBtnText: { flex: 1, marginLeft: 8, fontSize: 13, color: '#1e293b', fontWeight: '500' },
//   courseScroll: { paddingLeft: 20, paddingBottom: 10 },
//   courseCard: { backgroundColor: '#fff', width: width * 0.35, padding: 15, borderRadius: 16, marginRight: 12, borderWidth: 1, borderColor: '#e2e8f0' },
//   activeCard: { borderColor: '#6366f1', borderWidth: 2, backgroundColor: '#f5f3ff' },
//   courseIcon: { width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
//   courseCode: { fontWeight: 'bold', color: '#1e293b' },
//   studentCount: { fontSize: 11, color: '#64748b', marginTop: 2 },
//   searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 20, paddingHorizontal: 15, height: 45, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
//   input: { flex: 1, marginLeft: 10, color: '#1e293b' },
//   listContainer: { paddingHorizontal: 20 },
//   listHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1e293b' },
//   studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 14, marginBottom: 10, elevation: 2 },
//   avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
//   avatarText: { color: '#fff', fontWeight: 'bold' },
//   studentDetails: { flex: 1, marginLeft: 12 },
//   studentName: { fontWeight: '600', color: '#1e293b' },
//   studentId: { fontSize: 11, color: '#94a3b8' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   pickerContainer: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, maxHeight: height * 0.6 },
//   pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
//   pickerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
//   pickerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
//   pickerText: { flex: 1, fontSize: 16, color: '#334155' },
//   emptyState: { alignItems: 'center', marginTop: 40 },
//   emptyText: { color: '#94a3b8', marginTop: 10 }
// });

// export default MyCourses;












// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, FlatList, TextInput, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// // Components & Services
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from '../../common/Services/HttpService';
// import MyModal from '../layout/MyModal';
// import CustomSpinner from '../../common/Services/alert/CustomSpinner';
// import colors from '../../common/config/colors';

// const { width } = Dimensions.get('window');
// const badgeColors = ['#6366f1', '#a855f7', '#ec4899', '#f97316'];

// const MyCourses = ({ route }) => {
//   // Navigation Params (Ensures data is caught from the previous screen)
//   const MyCourseData = route.params?.data || [];
//   const navSession = route.params?.session;
//   const navSemester = route.params?.semester;

//   // --- State Management ---
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [sessionParams, setSessionParams] = useState(null);
//   const [empId, setEmpId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [studentLoading, setStudentLoading] = useState(false);
//   const [studentCache, setStudentCache] = useState({});
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   // --- 1. Initialization & Navigation Data Sync ---
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const sessionData = await SessionService.getSession();
//         const profile = sessionData?.LoginDetail?.[0];
        
//         // Prioritize navigation params, fallback to storage
//         setSessionParams({
//           SelectedSession: navSession || sessionData?.SelectedSession,
//           SelectedSemester: navSemester || sessionData?.SelectedSemester,
//         });
//         setEmpId(profile?.Emp_Id);
//         setCourses(MyCourseData?.CourseWiseStudentCount || []);
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, [navSession, navSemester, MyCourseData]);

//   // --- 2. API Logic: Fetch Students per Course ---
//   const getCourseWiseStudentList = useCallback(async (course) => {
//     if (!empId || !sessionParams) return;
    
//     try {
//       setStudentLoading(true);
//       const CourseWiseStudentListApi = getAdminApiList().getCourseWiseStudentList;
      
//       const payload = {
//         Academic_session: sessionParams.SelectedSession,
//         Semester_Id: sessionParams.SelectedSemester,
//         Emp_Id: empId,
//         Course_Id: course?.course_id,
//         Degree_Programme_Id: course?.Degree_Programme_Id,
//         Degree_Programme_Type_Id: course?.Degree_Programme_Type_Id,
//         Subject_Id: '',
//       };

//       const response = await HttpService.get(CourseWiseStudentListApi, payload);
//       const studentList = response?.data.StudentList || [];
      
//       setStudentCache((prev) => ({ ...prev, [course?.course_id]: studentList }));
//       setStudents(studentList);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch students.');
//     } finally {
//       setStudentLoading(false);
//     }
//   }, [empId, sessionParams]);

//   // --- 3. Handlers ---
//   const handleCourseClick = useCallback((course) => {
//     setSelectedCourseId(course?.course_id);
//     if (studentCache[course?.course_id]) {
//       setStudents(studentCache[course?.course_id]);
//     } else {
//       getCourseWiseStudentList(course);
//     }
//   }, [studentCache, getCourseWiseStudentList]);

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


//   // --- 4. Search Filter ---
//   const filteredStudents = useMemo(() => {
//     return students.filter(s => 
//       (s.Name || '').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [students, searchTerm]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title='My Courses' />
      
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
//         {/* Header Section */}
//         <View style={styles.headerInfo}>
//           <View>
//             <Text style={styles.welcomeText}>Course Selection</Text>
//             <Text style={styles.subText}>Session: {sessionParams?.SelectedSession || 'Loading...'}</Text>
//           </View>
//           <FontAwesome6 name="book-bookmark" size={30} color={colors.primary} />
//         </View>

//         {/* Horizontal Course Selector */}
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false} 
//           contentContainerStyle={styles.courseScroll}
//         >
//           {courses.map((course, index) => (
//             <TouchableOpacity 
//               key={course.course_id} 
//               onPress={() => handleCourseClick(course)}
//               style={[
//                 styles.courseCard, 
//                 selectedCourseId === course.course_id && styles.activeCard
//               ]}
//             >
//               <View style={[styles.courseIcon, { backgroundColor: badgeColors[index % badgeColors.length] + '20' }]}>
//                 <FontAwesome6 name="graduation-cap" size={18} color={badgeColors[index % badgeColors.length]} />
//               </View>
//               <Text style={styles.courseCode}>{course.Course_code}</Text>
//               <Text style={styles.studentCount}>{course.TotalStudents} Students</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Search Bar */}
//         <View style={styles.searchBox}>
//           <FontAwesome6 name="magnifying-glass" size={16} color="#94a3b8" />
//           <TextInput
//             style={styles.input}
//             placeholder="Find student..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//           />
//         </View>

//         {/* Student List Area */}
//         <View style={styles.listContainer}>
//           <Text style={styles.listHeader}>Student List</Text>
//           {studentLoading ? (
//             <CustomSpinner size={40} color={colors.primary} type="dots" />
//           ) : filteredStudents.length > 0 ? (
//             filteredStudents.map((item, index) => (
//               <TouchableOpacity 
//                 key={index} 
//                 style={styles.studentCard}
//                 onPress={() => handleStudentClick(item)}
//               >
//                 <View style={[styles.avatar, { backgroundColor: badgeColors[index % badgeColors.length] }]}>
//                   <Text style={styles.avatarText}>{item.Name.charAt(0)}</Text>
//                 </View>
//                 <View style={styles.studentDetails}>
//                   <Text style={styles.studentName}>{item.Name}</Text>
//                   {/* <Text style={styles.studentId}>ID: {item.Student_ID} </Text> */}
//                   <Text style={styles.studentId}>{item.Degree_Programme_Short_Name_E}</Text>
//                   <Text style={styles.studentId}>{item.Year_semester}</Text>
//                 </View>
//                 <FontAwesome6 name="chevron-right" size={14} color="#cbd5e1" />
//               </TouchableOpacity>
//             ))
//           ) : (
//             <View style={styles.emptyState}>
//               <FontAwesome6 name="user-slash" size={40} color="#cbd5e1" />
//               <Text style={styles.emptyText}>No students found</Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Modal with Session/Semester */}
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
//   container: { flex: 1, backgroundColor: '#f8fafc' },
//   headerInfo: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     padding: 20, 
//     alignItems: 'center' 
//   },
//   welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
//   subText: { fontSize: 14, color: '#64748b', marginTop: 4 },
//   courseScroll: { paddingLeft: 20, paddingBottom: 10 },
//   courseCard: {
//     backgroundColor: '#fff',
//     width: width * 0.35,
//     padding: 15,
//     borderRadius: 16,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   activeCard: { borderColor: '#6366f1', borderWidth: 2, backgroundColor: '#f5f3ff' },
//   courseIcon: { width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
//   courseCode: { fontWeight: 'bold', color: '#1e293b' },
//   studentCount: { fontSize: 11, color: '#64748b', marginTop: 2 },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     margin: 20,
//     paddingHorizontal: 15,
//     height: 45,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   input: { flex: 1, marginLeft: 10, color: '#1e293b' },
//   listContainer: { paddingHorizontal: 20 },
//   listHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1e293b' },
//   studentCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 14,
//     marginBottom: 10,
//     elevation: 2,
//     shadowOpacity: 0.05,
//   },
//   avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
//   avatarText: { color: '#fff', fontWeight: 'bold' },
//   studentDetails: { flex: 1, marginLeft: 12 },
//   studentName: { fontWeight: '600', color: '#1e293b' },
//   studentId: { fontSize: 12, color: '#94a3b8' },
//   emptyState: { alignItems: 'center', marginTop: 40 },
//   emptyText: { color: '#94a3b8', marginTop: 10 }
// });

// export default MyCourses;









// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, FlatList, TextInput, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Header from '../layout/Header/Header';
// import FooterNav from '../layout/Footer/Footer';
// import SessionService from '../../common/Services/SessionService';
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from '../../common/Services/HttpService';
// import MyModal from '../layout/MyModal';
// import CustomSpinner from '../../common/Services/alert/CustomSpinner';
// import colors from '../../common/config/colors';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const { width } = Dimensions.get('window');
// const badgeColors = ['#6366f1', '#a855f7', '#ec4899', '#f97316'];

// const MyCourses = ({ route }) => {
//   const MyCourse = route.params?.data || [];
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [params, setParams] = useState(null);
//   const [EmpId, setEmpId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [studentLoading, setStudentLoading] = useState(false);
//   const [studentCache, setStudentCache] = useState({});
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

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
//     // Inject session/semester data into the student object for the modal
//     const enrichedStudent = {
//       ...student,
//       displaySession: params?.SelectedSession || 'N/A',
//       displaySemester: params?.SelectedSemester || 'N/A'
//     };
    
//     setSelectedStudent(enrichedStudent);
//     try {
//       const currentSession = await SessionService.getSession();
//       if (!currentSession) return;
//       const updatedSession = {
//         ...currentSession,
//         student: student,
//         STUD_ID: student?.Student_ID,
//       };
//       await SessionService.saveSession(updatedSession);
//     } catch (error) {
//       console.error("Failed to update session:", error);
//     }
//     setModalVisible(true);
//   }, [params]);

//   const getCourseWiseStudentList = useCallback(async (data) => {
//     if (!EmpId) return;
//     try {
//       setStudentLoading(true);
//       const CourseWiseStudentListApi = getAdminApiList().getCourseWiseStudentList;
//       const payload = {
//         Academic_session: params?.SelectedSession,
//         Semester_Id: params?.SelectedSemester,
//         Emp_Id: EmpId,
//         Course_Id: data?.course_id,
//         Degree_Programme_Id: data?.Degree_Programme_Id,
//         Degree_Programme_Type_Id: data?.Degree_Programme_Type_Id,
//         Subject_Id: '',
//       };
//       const response = await HttpService.get(CourseWiseStudentListApi, payload);
//       const studentList = response?.data.StudentList || [];
//       setStudentCache((prev) => ({ ...prev, [data?.course_id]: studentList }));
//       setStudents(studentList);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load students');
//     } finally {
//       setStudentLoading(false);
//     }
//   }, [EmpId, params]);

//   const handleCourseClick = useCallback((course) => {
//     setSelectedCourseId(course?.course_id);
//     if (studentCache[course?.course_id]) {
//       setStudents(studentCache[course?.course_id]);
//     } else {
//       getCourseWiseStudentList(course);
//     }
//   }, [studentCache, getCourseWiseStudentList]);

//   const filteredStudents = useMemo(() => {
//     return students.filter(student =>
//       (student.Name || '').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [students, searchTerm]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title='My Courses' />
//       <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
        
//         {/* Horizontal Course Selection */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Select Course</Text>
//           <Text style={styles.sectionSubtitle}>{courses.length} Available</Text>
//         </View>

//         <ScrollView 
//             horizontal 
//             showsHorizontalScrollIndicator={false} 
//             contentContainerStyle={styles.courseScroll}
//         >
//           {courses.map((course, index) => (
//             <TouchableOpacity 
//               key={course.course_id} 
//               onPress={() => handleCourseClick(course)}
//               style={[
//                 styles.courseCardModern,
//                 selectedCourseId === course.course_id && styles.activeCourseCard
//               ]}
//             >
//               <View style={[styles.cardDot, { backgroundColor: badgeColors[index % badgeColors.length] }]} />
//               <Text style={styles.cardCourseCode}>{course.Course_code}</Text>
//               <Text numberOfLines={1} style={styles.cardCourseName}>{course.Degree_Programme_Short_Name_E}</Text>
//               <View style={styles.countBadge}>
//                 <Text style={styles.countText}>{course.TotalStudents} Students</Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Search Bar - Modern Style */}
//         <View style={styles.searchWrapper}>
//           <View style={styles.searchContainer}>
//             <MaterialIcons name="search" size={20} color="#94a3b8" />
//             <TextInput
//               style={styles.searchInputModern}
//               placeholder="Search student by name..."
//               placeholderTextColor="#94a3b8"
//               value={searchTerm}
//               onChangeText={setSearchTerm}
//             />
//             {searchTerm !== '' && (
//                 <TouchableOpacity onPress={() => setSearchTerm('')}>
//                     <MaterialIcons name="cancel" size={20} color="#94a3b8" />
//                 </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Student List Section */}
//         <View style={styles.listSection}>
//           {studentLoading ? (
//             <View style={styles.centerFixed}>
//               <CustomSpinner size={40} color={colors.primary} type="dots" />
//             </View>
//           ) : filteredStudents.length === 0 ? (
//             <View style={styles.emptyState}>
//               <MaterialIcons name="group-off" size={50} color="#cbd5e1" />
//               <Text style={styles.noStudentsText}>
//                 {students.length === 0 ? 'Select a course to view students' : 'No matches found'}
//               </Text>
//             </View>
//           ) : (
//             filteredStudents.map((student, index) => (
//               <TouchableOpacity 
//                 key={`${student.Student_ID}-${index}`}
//                 onPress={() => handleStudentClick(student)} 
//                 style={styles.studentItemModern}
//               >
//                 <View style={[styles.initialCircle, { backgroundColor: badgeColors[index % badgeColors.length] + '20' }]}>
//                   <Text style={[styles.initialText, { color: badgeColors[index % badgeColors.length] }]}>
//                     {student.Name.charAt(0)}
//                   </Text>
//                 </View>
//                 <View style={styles.studentInfo}>
//                   <Text style={styles.studentNameModern}>{student.Name}</Text>
//                   <Text style={styles.studentSubText}>{student.Degree_Programme_Short_Name_E}</Text>
//                 </View>
//                 <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
//               </TouchableOpacity>
//             ))
//           )}
//         </View>
//       </ScrollView>

//       <MyModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         studentData={selectedStudent}
//         // These can now be accessed via studentData inside your Modal component
//         session={params?.SelectedSession}
//         semester={params?.SelectedSemester}
//       />
//       <FooterNav />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc', // Modern off-white/blue tint
//   },
//   sectionHeader: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'baseline',
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1e293b',
//   },
//   sectionSubtitle: {
//     fontSize: 12,
//     color: '#64748b',
//   },
//   courseScroll: {
//     padding: 15,
//   },
//   courseCardModern: {
//     width: width * 0.4,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//   },
//   activeCourseCard: {
//     borderColor: '#6366f1',
//     backgroundColor: '#f5f3ff',
//     borderWidth: 2,
//   },
//   cardDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginBottom: 8,
//   },
//   cardCourseCode: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1e293b',
//   },
//   cardCourseName: {
//     fontSize: 12,
//     color: '#64748b',
//     marginVertical: 4,
//   },
//   countBadge: {
//     marginTop: 8,
//     backgroundColor: '#f1f5f9',
//     padding: 4,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   countText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#475569',
//   },
//   searchWrapper: {
//     backgroundColor: '#f8fafc',
//     paddingVertical: 10,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     marginHorizontal: 20,
//     paddingHorizontal: 15,
//     borderRadius: 12,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   searchInputModern: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 15,
//     color: '#1e293b',
//   },
//   listSection: {
//     paddingHorizontal: 20,
//     paddingBottom: 100,
//   },
//   studentItemModern: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 16,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#f1f5f9',
//   },
//   initialCircle: {
//     width: 45,
//     height: 45,
//     borderRadius: 22.5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   initialText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   studentInfo: {
//     flex: 1,
//     marginLeft: 15,
//   },
//   studentNameModern: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#1e293b',
//   },
//   studentSubText: {
//     fontSize: 12,
//     color: '#64748b',
//     marginTop: 2,
//   },
//   centerFixed: {
//     marginTop: 50,
//     alignItems: 'center',
//   },
//   emptyState: {
//     marginTop: 80,
//     alignItems: 'center',
//   },
//   noStudentsText: {
//     marginTop: 10,
//     color: '#94a3b8',
//     fontSize: 14,
//   }
// });

// export default MyCourses;

















// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, FlatList, TextInput } from 'react-native';
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
//   const [searchTerm, setSearchTerm] = useState(''); // Added for search

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

//   // Filtered student list based on search term
//   const filteredStudents = useMemo(() => {
//     return students.filter(student =>
//       (student.Name || '').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [students, searchTerm]);

//   // Memoize the rendered course list as cards
//   const memoizedCourseList = useMemo(() => {
//     return courses.map((course, index) => (
//       <TouchableOpacity key={course.course_id} onPress={() => handleCourseClick(course)} style={styles.courseCard}>
//         <View style={styles.cardContent}>
//           <Text style={styles.cardSN}>{index + 1}</Text>
//           <Text style={styles.cardCourse}>{course.Course_code}</Text>
//           <Text style={styles.cardDPT}>{course.Degree_Programme_Type_Name_E}</Text>
//           <Text style={styles.cardDegree}>{course.Degree_Programme_Name_E}</Text>
//           <View style={styles.cardBadge}>
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
  
// // uicode
//   return (
//     <SafeAreaView style={styles.container}>
//           <Header title='My Courses' />
//       <ScrollView  showsVerticalScrollIndicator={false}>
     
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <Text style={styles.loadingText}>Loading...</Text>
//           </View>
//         ) : (
//           <>
//             {/* <View style={styles.header}>
//               <Text style={styles.headerText}>My Courses</Text>
//             </View> */}

//             <View style={styles.studentListContainer}>
//               <View style={styles.cardContainer}>
//                 <Text style={styles.headertable}>All Courses</Text>
//                 {memoizedCourseList}
//               </View>
//             </View>

//             <View style={styles.studentListContainer}>
//               {/* <Text style={styles.studentListTitle}>Student List</Text> */}
//               {/* Search Input */}

//               {/* <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search students by name..."
//                 value={searchTerm}
//                 onChangeText={setSearchTerm}
//               /> */}

//               {studentLoading ? (
//                 <View style={styles.spinnerWithText}>
//                   <CustomSpinner size={50} color="rgba(0, 63, 198, 1)" type="dots" />
//                   <Text style={styles.text}>Loading...</Text>
//                 </View>
//               ) : filteredStudents.length === 0 ? (
//                 <Text style={styles.noStudents}>
//                   {students.length === 0 ? 'No student data available' : 'No students match your search'}
//                 </Text>
//               ) : (
//                 <FlatList
//                   data={filteredStudents}
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
//   // Replaced tableContainer with cardContainer
//   cardContainer: {
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
//   // New styles for course cards
//   courseCard: {
//     backgroundColor: colors.tablerow,
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 3,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   cardSN: {
//     flex: 0.5,
//     textAlign: 'center',
//     color: '#000000ff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   cardCourse: {
//     flex: 1,
//     textAlign: 'center',
//     color: '#000000ff',
//     fontSize: 14,
//   },
//   cardDPT: {
//     flex: 2,
//     textAlign: 'center',
//     color: '#000000ff',
//     fontSize: 14,
//   },
//   cardDegree: {
//     flex: 2,
//     textAlign: 'center',
//     color: '#000000ff',
//     fontSize: 14,
//   },
//   cardBadge: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 20,
//     alignItems: 'center',
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
//   // Added search input style
//   searchInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
//   studentCard: {
//     // flexDirection: 'row',
//     // backgroundColor: '#F5D3C4',
//     // // borderBottomEndRadius: 35,
//     // borderTopStartRadius: 35,
//     // borderRightWidth: 8,
//     // borderRightColor: '#F4991A',
//     // padding: 15,
//     // marginBottom: 10,
//     // shadowColor: '#000',
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.3,
//     // shadowRadius: 4,
//     // borderWidth:1,
//     // borderColor:'#ffffffff',
//     // elevation: 5,

//     flexDirection: 'row',
//     padding: 12,
//     marginHorizontal: 16,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     marginBottom: 8,
//     alignItems: 'center',
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



import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../layout/Header/Header';
import FooterNav from '../layout/Footer/Footer';
import SessionService from '../../common/Services/SessionService';
import getAdminApiList from '../config/Api/adminApiList';
import { HttpService } from '../../common/Services/HttpService';
import MyModal from '../layout/MyModal';
import CustomSpinner from '../../common/Services/alert/CustomSpinner';
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
  const [student, setstudent] = useState([])

  // Memoize courses derivation
  const memoizedCourses = useMemo(() => MyCourse?.CourseWiseStudentCount || [], [MyCourse]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const sessionData = await SessionService.getSession();
        const profile = sessionData?.LoginDetail?.[0];
        setParams(sessionData)
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
  }, [memoizedCourses,]);

  const handleStudentClick = async (student) => {
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
  };


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
      setStudentCache((prevCache) => ({ ...prevCache, [selectedCourseId]: studentList }));
      setStudents(studentList);
    } catch (error) {
      Alert.alert('Failed to Load', error?.message || 'Something went wrong');
      console.error('Student List fetch error:', error);
    } finally {
      setStudentLoading(false);
    }
  }, [EmpId, params, studentCache]);

  const handleCourseClick = (course) => {
    getCourseWiseStudentList(course);
  };


  // Memoize the rendered student list
  const memoizedStudentList = useMemo(() => {
    return students?.map((student, idx) => (
      <TouchableOpacity
        onPress={() => {
          handleStudentClick(student);
          setModalVisible(true)
        }} >

        <View key={student.id} style={styles.studentCard}>
          <View style={styles.avatarContainer}>

            <View style={[styles.avatar, { backgroundColor: badgeColors[idx % badgeColors.length] }]}>
              <Image source={{ uri: student.PhotoString + student.Student_Photo }} style={styles.avatarImage} />
              <Text style={styles.avatarText}>{idx + 1}</Text>
            </View>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.Name} </Text>
            <Text style={styles.studentDetails}>{student.Degree_Programme_Short_Name_E}</Text>
            <Text style={styles.studentDetails}>{student.Year_semester}</Text>
          </View>
        </View>

      </TouchableOpacity>
    ));
  }, [students, badgeColors]);



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Header />
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerText}>My Courses</Text>
            </View>

            <ScrollView horizontal style={styles.studentListContainer} >
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, styles.tableCellSN]}>SN</Text>
                  <Text style={[styles.tableCell, styles.tableCellCourse]}>Course</Text>
                  <Text style={[styles.tableCell, styles.tableCellDept]}>DPT</Text>
                  <Text style={[styles.tableCell, styles.tableCellDegree]}>Degree</Text>
                  <Text style={[styles.tableCell, styles.tableCellStudents]}>Students</Text>
                </View>
                {courses.map((course, index) => (
                  <TouchableOpacity onPress={() => handleCourseClick(course)}>
                    <View key={course.course_id} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.tableCellSN]}>{index + 1}</Text>
                      <Text style={[styles.tableCell, styles.tableCellCourse]}>{course.Course_code}</Text>
                      <Text style={[styles.tableCell, styles.tableCellDept]}>
                        {course.Degree_Programme_Type_Name_E}
                      </Text>
                      <Text style={[styles.tableCell, styles.tableCellDegree]}>
                        {course.Degree_Programme_Name_E}
                      </Text>

                      <View style={[styles.tableCell, styles.tableCellStudents]}>
                        <View
                          style={[styles.badge, { backgroundColor: badgeColors[index % badgeColors.length] },]} >
                          <Text style={styles.badgeText}>{course.TotalStudents}</Text>
                        </View>

                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {(
              <View style={styles.studentListContainer}>
                <Text style={styles.studentListTitle}>Student List</Text>
                {studentLoading ? (
                  <View style={styles.spinnerWithText}>
                    <CustomSpinner size={50} color="rgba(255, 99, 71, 1)" type="dots" />
                    <Text style={styles.text}>Loading...</Text>
                  </View>
                ) : students.length === 0 ? (
                  <Text style={styles.noStudents}>No student data available</Text>
                ) : (
                  memoizedStudentList
                )}
              </View>
            )}
          </>
        )}

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* <Button title="Open Modal" onPress={() => setModalVisible(true)} /> */}
          <MyModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            studentData={selectedStudent}
          />
        </View>
      </ScrollView>
      <FooterNav />
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  spinnerWithText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    color: "#ff6347",
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },






  // loadingContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // loadingText: {
  //   fontSize: 18,
  //   color: '#666',
  // },



  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  studentListContainer: {
    margin: 10,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  tableCellSN: {
    width: 40,
  },
  tableCellCourse: {
    width: 100,
  },
  tableCellDept: {
    width: 80,
  },
  tableCellDegree: {
    width: 120,
  },
  tableCellStudents: {
    width: 80,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  studentListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noStudents: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 80,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    color: '#000a29ff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  studentDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default MyCourses;

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Button, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../layout/Header/Header';
import FooterNav from '../layout/Footer/Footer';
import SessionService from '../../common/Services/SessionService';
import getAdminApiList from '../config/Api/adminApiList';
import MyModal from '../layout/MyModal';
import { HttpService } from '../../common/Services/HttpService';
import * as Keychain from 'react-native-keychain';
import CustomSpinner from '../../common/Services/alert/CustomSpinner';
const badgeColors = ['#f9741675', '#8a5cf688', '#aecdfeff', '#ef444474'];


const MyStudents = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const Mystudent = route.params?.data || [];
  const [modalVisible, setModalVisible] = useState(false);

  const [DegreeTypeWiseStudentCount, setDegreeTypeWiseStudentCount] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [StudentsList, setStudentsList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [EmpId, setEmpId] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentCache, setStudentCache] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [params, setParams] = useState([]);
  const [session, setSession] = useState(null);

  // console.log(route.params, "Mystudent");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const sessionData = await SessionService.getSession();
        const profile = sessionData?.LoginDetail?.[0];
        // console.log(profile, "session (fresh)");
        setParams(sessionData);
        setEmpId(profile?.Emp_Id);
        setStudents(Mystudent);
      } catch (error) {
        console.error('Error loading initial data:', error);
        Alert.alert('Error', 'Failed to load initial data.');
      }
    };

    fetchInitialData();
  }, [Mystudent]);

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
        Course_Id: data?.course_id || '',
        Degree_Programme_Id: data?.Degree_Programme_Id || '',
        Degree_Programme_Type_Id: data?.Degree_Programme_Type_Id,
        Subject_Id: '',
      };

      const response = await HttpService.get(CourseWiseStudentListApi, payload);
      // console.log(response, "response");
      const studentList = response?.data.StudentList || [];
      // Update cache and state
      setStudentCache((prevCache) => ({ ...prevCache, [selectedCourseId]: studentList }));
      setStudentsList(studentList);
    } catch (error) {
      Alert.alert('Failed to Load', error?.message || 'Something went wrong');
      console.error('Student List fetch error:', error);
    } finally {
      setStudentLoading(false);
    }
  }, [EmpId, params, selectedCourseId, studentCache]);

  const handleCourseClick = (course) => {
    // console.log(course, "course")
    setSelectedCourseId(course.Degree_Programme_Type_Id);
    getCourseWiseStudentList(course);
  };

  const handleStudentClick = async (student) => {
    // console.log(student, "ok student");
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
      // console.log("ok")
      await SessionService.saveSession(updatedSession);
      const nowsession = await SessionService.getSession();
      // console.log(nowsession, "nowupdate")
    } catch (error) {
      console.error("Failed to update session:", error);
    }
    setModalVisible(true);
  };

  // Memoize the rendered student list
  const memoizedStudentList = useMemo(() => {
    return StudentsList.map((student, idx) => (
      <TouchableOpacity
        onPress={() => {
          handleStudentClick(student);
          setModalVisible(true)
        }} >

        <View key={student.id} style={styles.studentCard}>
          <View style={styles.avatarContainer}>
            <View
              style={[styles.badge,
              { backgroundColor: badgeColors[idx % badgeColors.length] },]}>
              <Image source={{ uri: student.PhotoString + student.Student_Photo }} style={styles.avatarImage} />
              <Text style={styles.avatarText}>{idx + 1}</Text>
            </View>
          </View>
          <View style={styles.studentInfo}>
            <View
              style={[styles.badge,
              { backgroundColor: badgeColors[idx % badgeColors.length] },]}>
              <Text style={styles.studentName}>{student.Name || student.name}</Text>
            </View>
            <Text style={styles.studentDetails}>{student.Degree_Programme_Short_Name_E || student.degree}</Text>
            <Text style={styles.studentDetails}>{student.Year_semester || `${student.year} ${student.semester}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  }, [StudentsList, badgeColors]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Header />
        <View style={styles.header}>
          <Text style={styles.headerText}>My Students</Text>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.tableScrollContainer}>
          <View style={styles.tableContainer}>
            <Text style={styles.headertable}>Degree Type Wise Count</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableCellSN]}>SN</Text>
              <Text style={[styles.tableCell, styles.tableCellStudents]}> </Text>
              <Text style={[styles.tableCell, styles.tableCellDept]}></Text>
              <Text style={[styles.tableCell, styles.tableCellStudents]}>DPT</Text>
              <Text style={[styles.tableCell, styles.tableCellStudents]}></Text>
              <Text style={[styles.tableCell, styles.tableCellStudents]}>Students</Text>
            </View>
            {students.map((course, index) => (
              <TouchableOpacity
                onPress={() => handleCourseClick(course)}>
                <View key={course.Degree_Programme_Type_Id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellSN]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, styles.tableCellDept]}>
                    {course.Degree_Programme_Type_Name_E}
                  </Text>
                  <View style={[styles.tableCell, styles.tableCellStudents]}>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: badgeColors[index % badgeColors.length] },
                      ]}>
                      <Text style={styles.badgeText}>{course.TotalStudents}</Text>
                    </View>
                  </View>

                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {selectedCourseId && (
          <View style={styles.studentListContainer}>
            <Text style={styles.studentListTitle}>Student List</Text>
            {studentLoading ? (
              <View style={styles.spinnerWithText}>
                <CustomSpinner size={50} color="rgba(255, 99, 71, 1)" type="dots" />
                <Text style={styles.text}>Loading...</Text>
              </View>


            ) : StudentsList.length === 0 ? (
              <Text style={styles.noStudents}>No student data available</Text>
            ) : (
              memoizedStudentList
            )}
          </View>
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
    </SafeAreaView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
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
  tableScrollContainer: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  }
  ,
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
  },
  headertable: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 1,
    paddingHorizontal: 20,
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
  tableCellDept: {
    flex: 1, // Changed to flex: 1 to take remaining space
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
    width: 55,
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

export default MyStudents;
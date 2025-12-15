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
const badgeColors = ['#f916a275', '#8a5cf688', '#aecdfeff', '#ef444474'];
import { LinearGradient } from 'react-native-linear-gradient';
import colors from '../../common/config/colors';


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

          {/* <View style={styles.avatarContainer}>
            <View
              style={[styles.badge,
              { backgroundColor: badgeColors[idx % badgeColors.length] },]}>
              <Image source={{ uri: student.PhotoString + student.Student_Photo }} style={styles.avatarImage} />
              <Text style={styles.avatarText}>{idx + 1}</Text>
            </View>
          </View> */}
          <View style={[styles.avatarImage, { backgroundColor: badgeColors[idx % badgeColors.length] }]}>
            <Text style={styles.avatarText}>{idx + 1}</Text>
          </View>



          <View style={styles.studentInfo}>
            <View
              // style={[styles.badge,{ backgroundColor: badgeColors[idx % badgeColors.length] },]}>
              style={[styles.badge,]}>
              <Text style={styles.studentName}>{student.Name || student.name}</Text>
            </View>
            <Text style={styles.studentDetails}>{student.Degree_Programme_Short_Name_E || student.degree} </Text>
            <Text style={styles.studentDetails}>{student.Year_semester || `${student.year} ${student.semester}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  }, [StudentsList, badgeColors]);



  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F3E8DF', '#EFE9E3']}
        style={styles.gradientBackground}
      >
       <Header />
        <ScrollView style={styles.scrollContainer}>
         

          <View style={styles.containerCard}>
            <View style={styles.header}>
              <Text style={styles.headerText}>My Students</Text>
            </View>
            <ScrollView contentContainerStyle={styles.tableScrollContainer}>
              <View style={styles.tableContainer}>
                <Text style={styles.headertable}>Degree Type Wise Count</Text>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, styles.tableCellSN]}>SN</Text>
                  <Text style={[styles.tableCell, styles.tableCellStudents]}>DPT</Text>
                  <Text style={[styles.tableCell, styles.tableCellStudents]}>Students</Text>
                </View>


                {students.map((course, index) => (
                  <TouchableOpacity
                    onPress={() => handleCourseClick(course)}
                    key={course.Degree_Programme_Type_Id}>
                    <View style={styles.tableRow}>
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
                          <Text style={styles.badgeText}> 👉🏻{course.TotalStudents}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>


          {selectedCourseId && (
            <View style={styles.studentListContainer}>
              <View style={styles.header}>
                <Text style={styles.studentListTitle}>Student List</Text>
              </View>
              {studentLoading ? (
                <View style={styles.spinnerWithText}>
                  <CustomSpinner size={50} color="rgba(255, 99, 71, 1)" type="border" />
                  <Text style={styles.text}>Loading...</Text>
                </View>
              ) : StudentsList.length === 0 ? (
                <Text style={styles.noStudents}>No student data available</Text>
              ) : (
                memoizedStudentList
              )}
            </View>
          )}

          <View style={{
            flex: 1, justifyContent: 'center', alignItems: 'center',
            backgroundColor: 'red'
          }}>
            <MyModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              studentData={selectedStudent}
            />
          </View>
        </ScrollView>
      </LinearGradient>
      <FooterNav />
    </SafeAreaView>
  );

};


export default MyStudents;

const styles = StyleSheet.create({
  containerCard: {
    flex: 1,
    // backgroundColor: colors.background,
    borderBottomEndRadius: 55,
    borderBottomStartRadius: 55,
    // borderTopStartRadius:35,
    borderWidth:1,
    borderColor:'#fff'
  },
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    margin: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#FCECDD',
    borderWidth:2,
    borderColor: '#ffffffff',
 
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
    padding:-10,
    // margin:10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    backgroundColor: '#3D365C',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#AEDEFC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 5.3,
    shadowRadius: 4,
    elevation: 35,
  },
  headertable: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FEEBF6',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FCD8CD',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 5,
    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#000000ff',
    fontSize: 14,
  },
  tableCellSN: {
    flex: 0.5,
  },
  tableCellDept: {
    flex: 2,
  },
  tableCellStudents: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  studentListContainer: {
    padding: 10,
  },
  studentListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a90000ff',
    marginBottom: 10,
  },
  studentCard: {
    flexDirection: 'row',
    backgroundColor: '#B2C6D5',
    borderRadius:15,
    borderWidth:2,
    borderColor: '#ffffffff',
    padding: 10,
    margin:5,
    shadowOpacity: 0.3,
    shadowColor: '#fdc1f2ff',
    shadowRadius: 4,
    elevation: 20,
  },
  avatarContainer: {
    marginRight: 15,


  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight:10
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



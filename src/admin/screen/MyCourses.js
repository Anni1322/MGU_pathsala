import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, FlatList } from 'react-native';
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

  // Memoize the rendered course list
  const memoizedCourseList = useMemo(() => {
    return courses.map((course, index) => (
      <TouchableOpacity key={course.course_id} onPress={() => handleCourseClick(course)}>
        <View style={styles.tableRow}>
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
          {/* <View style={[styles.avatar, { backgroundColor: badgeColors[index % badgeColors.length] }]}>
            <Image
              source={{ uri: student.PhotoString + student.Student_Photo }}
              style={styles.avatarImage}
              resizeMode="cover"
              onError={() => {}}  
            />
            
            <Text style={styles.avatarText}>{index + 1}</Text>
          </View> */}
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

  return (
    <SafeAreaView style={styles.container}>
       <Header />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
     
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerText}>My Courses</Text>
            </View>

            <View style={styles.studentListContainer}>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, styles.tableCellSN]}>SN</Text>
                  <Text style={[styles.tableCell, styles.tableCellCourse]}>Course</Text>
                  <Text style={[styles.tableCell, styles.tableCellDept]}>DPT</Text>
                  <Text style={[styles.tableCell, styles.tableCellDegree]}>Degree</Text>
                  <Text style={[styles.tableCell, styles.tableCellStudents]}>Students</Text>
                </View>
                {memoizedCourseList}
              </View>
            </View>

            <View style={styles.studentListContainer}>
              <Text style={styles.studentListTitle}>Student List</Text>
              {studentLoading ? (
                <View style={styles.spinnerWithText}>
                  <CustomSpinner size={50} color="rgba(0, 63, 198, 1)" type="dots" />
                  <Text style={styles.text}>Loading...</Text>
                </View>
              ) : students.length === 0 ? (
                <Text style={styles.noStudents}>No student data available</Text>
              ) : (
                <FlatList
                  data={students}
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
  tableContainer: {
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.tableheader,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: colors.tablerow,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 5,
    shadowColor: '#000',
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
  studentCard: {
    flexDirection: 'row',
    backgroundColor: '#F5D3C4',
    // borderBottomEndRadius: 35,
    borderTopStartRadius: 35,
    borderRightWidth: 8,
    borderRightColor: '#F4991A',
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth:1,
    borderColor:'#ffffffff',
    elevation: 5,
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

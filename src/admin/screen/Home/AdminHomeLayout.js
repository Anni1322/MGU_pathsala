import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,Image,StatusBar, TouchableWithoutFeedback, Alert, Modal, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Keychain from "react-native-keychain"; 

import { facultyMenu } from '../../config/Menu/MenuList';
import Slider from '../../layout/Sliders/Slider';
import BirthdaySlider from '../../layout/Sliders/BirthdaySlider';
// import { API_BASE_URL } from '../../../common/config/BaseUrl'; // Unused
import getApiList from "../../config/Api/adminApiList";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import { HttpService } from "../../../common/Services/HttpService";
import SessionService from '../../../common/Services/SessionService';
import CustomSpinner from '../../../common/Services/alert/CustomSpinner';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UpdateChecker from "../../../common/UpdateChecker";
import colors from '../../../common/config/colors';
import { G } from 'react-native-svg';

// --- Memoized Sub-Component ---
const IconMap = {
  EvilIcons,
  FontAwesome6,
  MaterialIcons,
};

const IconText = React.memo(({ label, iconLib = 'MaterialIcons', iconName, iconSize = 25, color = 'green' }) => {
  const IconComponent = IconMap[iconLib] || MaterialIcons;
  return (
    <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
      <IconComponent name={iconName} size={iconSize} color={color} />
      <Text style={{ color: 'navy', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
});

// --- Static/Memoized Data ---
const STATIC_SEMESTERS = [
  { semester_id: 1, label: 'I Semester' },
  { semester_id: 2, label: 'II Semester' }
];

const STATIC_SESSION_DATA = [
  // { key: 26, label: '2026-27' },
  { session_id: 26, label: '2026-27' },
  { session_id: 25, label: '2025-26' },
  { session_id: 24, label: '2024-25' },
  { session_id: 23, label: '2023-24' },
  { session_id: 22, label: '2022-23' },
  // { session_id: 21, label: '2021-22' },
  // { session_id: 20, label: '2020-21' },
  // { session_id: 19, label: '2019-20' },
  // { session_id: 18, label: '2018-19' },
  // { session_id: 17, label: '2017-18' },
  // { session_id: 16, label: '2016-17' },
  // { session_id: 15, label: '2015-16' },
  // { session_id: 14, label: '2014-15' },
  // { session_id: 13, label: '2013-14' }
];

// const STATIC_SEMESTERS = [
//   { semester_id: 1, Semester: 'I Semester' },
//   { semester_id: 2, Semester: 'II Semester' }
// ];

// const STATIC_SESSION_DATA = [
//   { session_id: 25, SESSION: '2025-26' },
//   { session_id: 24, SESSION: '2024-25' },
//   { session_id: 23, SESSION: '2023-24' }
// ];



// --- Main Component ---
const AdminHomeLayout = () => {
  const navigation = useNavigation();
  // const route = useRoute(); // Unused
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [MyCourse, setMyCourse] = useState(null);
  const [MyStudent, setStudent] = useState(null);
  const [MyAssignment, setMyAssignment] = useState(null);
  const [MyStudyMaterial, setMyStudyMaterial] = useState(null);

  const [SemesterValue, setSemesterValue] = useState(null);
  const [SessionValue, setSessionValue] = useState(null);
  // const [MyStudyMaterials, setMyStudyMaterials] = useState([]);  

  const [selectedSession, setSelectedSession] = useState(STATIC_SESSION_DATA[0].session_id);
  // const [selectedSession, setSelectedSession] = useState();
  const [selectedSemester, setSelectedSemester] = useState(STATIC_SEMESTERS[0].semester_id);
  const [EmpId, setEmpId] = useState(null);
  const [officeList, setOfficeList] = useState([]);
  // session
  const [isModalVisibleSession, setModalVisibleSession] = useState(false);
  // semester
  const [isModalVisibleSemester, setModalVisibleSemester] = useState(false);
 
  // ^--- method call ---
  const SessionChange = useCallback(async (data) => {
    // console.log(data?.session_id,"data?.session_id")
    setSelectedSession(data?.session_id);
    setSessionValue(data?.label)
    setModalVisibleSession(false)
  }, [])

  const SemesterChange = useCallback(async (data) => {
    // console.log(data?.session_id,"data?.session_id")
    setSelectedSemester(data?.semester_id);
    setSemesterValue(data?.label)
    setModalVisibleSemester(false);
  }, [])


  // --- Rendering ---
  const handleRefresh = useCallback(() => {
    fetchInitialDataAndSetup();
  }, [
    fetchInitialDataAndSetup
  ]);




  // ^--- API call ---
  useEffect(() => {
    fetchInitialDataAndSetup();
  }, [fetchInitialDataAndSetup]);

 useEffect(() => {
    if (EmpId) {
      const updateSessionAndRefresh = async () => {
        try {
          const currentSession = await SessionService.getSession();
          if (!currentSession) return;
          const updatedSession = {
            ...currentSession,
            SelectedSemester: selectedSemester,
            SelectedSession: selectedSession || 1,
          };
          await SessionService.saveSession(updatedSession);
          await loadData(selectedSession, selectedSemester, EmpId);
        } catch (error) {
          console.error("Failed to update session:", error);
        }
      };
      updateSessionAndRefresh();
      getCurrentAcademicSession();
    }
  }, [selectedSemester, selectedSession, EmpId, loadData]);

  
  const fetchInitialDataAndSetup = useCallback(async () => {
    console.log("fetchInitialDataAndSetup call");
    setLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const profile = sessionData?.LoginDetail?.[0];
      console.log(profile,"profile for dean");
      const initialEmpId = profile?.Emp_Id;

      setEmpId(initialEmpId);
      setProfileData(profile);
      console.log(sessionData?.LoginDetail, "office list")
      setOfficeList(sessionData?.LoginDetail)

      // const sessionFromStorage = sessionData?.SelectedSession ;
      const sessionFromStorage = sessionData?.SelectedSession || STATIC_SESSION_DATA[1].session_id;
      const semesterFromStorage = sessionData?.SelectedSemester || STATIC_SEMESTERS[0].semester_id;
      setSelectedSession(sessionFromStorage);
      setSelectedSemester(semesterFromStorage);
      // setSessionValue(sessionData?.SelectedSession)
      setSessionValue(STATIC_SESSION_DATA[1].label)
      setSemesterValue(STATIC_SEMESTERS[0].label)

      if (initialEmpId) {
        await loadData(sessionFromStorage, semesterFromStorage, initialEmpId);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      Alert.alert("Error", "Failed to load initial data.");
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  const loadData = useCallback(async (session, semester, empId) => {
     console.log("loadData call");
    if (!empId) return;
    setLoading(true);
    try {
      await Promise.all([
        fetchMyCourses(empId, session, semester),
        fetchMystudents(empId, session, semester),
        fetchMyassingment(empId, session, semester),
        fetchStudyMaterials(empId),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [fetchMyCourses, fetchMystudents, fetchMyassingment, fetchStudyMaterials]);




// ^--- API Callbacks ---
  const getCurrentAcademicSession = useCallback(async () => {
    //  console.log("ok3");
    try {
      const getCurrentAcademicSessionApi = getApiList().getCurrentAcademicSession;
      const payload = {};
      const response = await HttpService.get(getCurrentAcademicSessionApi, payload);
      console.log(response.data.AccadmicSession, "current session")
      if (response?.status === 200) {
        setSelectedSession(response?.data?.AccadmicSession);
      }
    } catch (error) {
      console.error("fetchMystudents failed:", error);
      // alert()
    }
  }, []);

  const fetchMystudents = useCallback(async (empId, session, semester) => {
     console.log("fetchMystudents call");
    try {
      if (!empId) return;
      const DegreeTypeWiseStudentListApi = getApiList().getDegreeTypeWiseDashCount;
      const payload = {
        Academic_session: session,
        Semester_Id: semester,
        emp_id: empId
      };
      const response = await HttpService.get(DegreeTypeWiseStudentListApi, payload);
      // console.log(response,"response")
      if (response?.status === 200) {
        setStudent(response.data.DegreeTypeWiseStudentCount);
      }
    } catch (error) {
      console.error("fetchMystudents failed:", error);
      // alert()
    }
  }, []);

  const fetchMyCourses = useCallback(async (empId, session, semester) => {
     console.log("fetchMyCourses call");
    try {
      if (!empId) return;
      const payload = {
        Semester_Id: semester,
        Academic_session: session,
        Emp_Id: empId,
      };
      const CourseWiseDashCountApi = getApiList().getCourseWiseDashCount;
      const response = await HttpService.get(CourseWiseDashCountApi, payload);
      if (response?.status === 200) {
        setMyCourse(response.data);
      }
    } catch (error) {
      console.error("fetchMyCourses failed:", error);
    }
  }, []);

  const fetchMyassingment = useCallback(async (empId, session, semester) => {
     console.log("fetchMyassingment call");
    try {
      if (!empId) return;
      const payload = {
        Semester_Id: semester,
        Academic_session: session,
        Created_By: empId,
      };
      const getStudyAssignmentDashCountApi = getApiList().getStudyAssignmentDashCount;
      const response = await HttpService.get(getStudyAssignmentDashCountApi, payload);
      // console.log(response?.data?.StudyAssignmentDashCount[0].assignment_count, "response")
      if (response?.status === 200) {
        setMyAssignment(response?.data);
      }
    } catch (error) {
      console.error("fetchMyCourses failed:", error);
    }
  }, []);

  const fetchStudyMaterials = useCallback(async (empId) => {
     console.log("fetchStudyMaterials call");
    try {
      if (!empId) return;
      const payload = {
        Created_By: empId,
      };
      const getStudyMaterialDashCountApi = getApiList().getStudyMaterialDashCount;
      const response = await HttpService.get(getStudyMaterialDashCountApi, payload);
      // console.log(response?.data, "response")
      if (response?.status === 200) {
        setMyStudyMaterial(response?.data);
      }
    } catch (error) {
      console.error("fetchMyCourses failed:", error);
    }
  }, []);


// ^--- count section
  const myStudentCount = useMemo(() =>
    MyStudent?.reduce((sum, item) => sum + Number(item.TotalStudents || 0), 0) || 0,
    [MyStudent]
  );

  const myCourseCount = useMemo(() =>
    MyCourse?.CourseCount?.[0]?.CourseCount || 0,
    [MyCourse]
  );

  const MyAssignmentCount = useMemo(() =>
    MyAssignment?.StudyAssignmentDashCount?.[0]?.assignment_count || 0,
    [MyAssignment]
  );

  const MyStudyMaterialCount = useMemo(() =>
    MyStudyMaterial?.StudyDashCount?.[0]?.Material_count || 0,
    [MyStudyMaterial]
  );

  // onOfficeSelect = async (office) => {
  //   console.log(office, "office list")
  //   closeModal();


  const updatedMenu = useMemo(() =>
    facultyMenu
      .map(item => {
        let count = "";
        let data = null;
        switch (item.name) {
          case 'My Courses':
            count = myCourseCount;
            data = MyCourse;
            break;
          case 'My Students':
            count = myStudentCount;
            data = MyStudent;
            break;
          case 'My Assignment':
            count = MyAssignmentCount;
            data = MyAssignment;
            break;
          case 'Study Materials':
            count = MyStudyMaterialCount;
            data = MyStudyMaterial;
            break;
          default:
            break;
        }
        return { ...item, count: count, data: data };
      })
      .filter(item => item.id),
 
  );


  
const renderGridItem = (item, index) => {
const liteColors = [
  '#F1F8FF', 
  '#FAF4FF', 
  '#FFF8F1', 
  '#FFF5F5'  
];

const iconColors = [
  '#42A5F5',  
  '#AB47BC',  
  '#FB8C00',  
  '#EF5350'   
];

  const bgColor = item.bgColor || liteColors[index % 4];
  const accentColor = item.color || iconColors[index % 4];

  return (
    <TouchableOpacity 
      key={item.id}
      style={styles.gridItemWrapper}
      onPress={() => navigation.navigate(item.screen, { data: item.data })}
      activeOpacity={0.9}>
      
      <View style={[styles.iconCard, { backgroundColor: bgColor }]}>
        {/* TOP ROW: Icon and Badge */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
            <FontAwesome6 name={item.icon} size={35} color={accentColor} />
          </View>
          
          {item?.count > 0 && (
            <View style={[styles.badgeCount, { backgroundColor: accentColor }]}>
              <Text style={styles.badgeCountText}>{item.count}</Text>
            </View>
          )}
        </View>

        {/* BOTTOM ROW: Label */}
        <View style={styles.cardFooter}>
          <Text style={styles.gridLabel} numberOfLines={2}>{item.name}</Text>
          {/* Optional: Add a placeholder value like 'Check' or 'View' */}
          <FontAwesome6 name="chevron-right" size={10} color={accentColor} style={{opacity: 0.5}} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

  if (loading && !profileData) {
    return <View style={styles.spinnerWithText}>
      <CustomSpinner size={50} color="rgba(251, 0, 0, 1)" type="bars" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  }

  // ^ -----------------------------------model start
  // office list/destination  
  const OfficeListModalContent = React.memo(({ closeModal }) => (
    <View style={modalStyles.centeredView}>
      <View style={modalStyles.modalView}>
        <Text style={modalStyles.modalTitle}>Select Destination/Office</Text>

        {officeList && officeList.length > 0 ? (
          <ScrollView style={modalStyles.officeListScrollView}>
            {officeList.map((office, index) => (
              <TouchableOpacity
                key={office.Office_Id || index}
                style={modalStyles.officeListItem}
                onPress={() => onOfficeSelect(office)
                }>
                <Text style={modalStyles.officeItemText}>
                  {office.Office_Name || `Office ${index + 1}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={modalStyles.noDataText}>No alternative offices available.</Text>
        )}

        <TouchableOpacity
          style={modalStyles.closeButton}
          onPress={closeModal}>
          {/* <FontAwesome6 name='home' size={22} color="white" /> */}
          <Text style={modalStyles.textStyle}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  ));

  //  SessionListModalContent
  const SessionListModalContent = React.memo(({ closeModalSession }) => (
    <View style={modalStyles.centeredView}>
      <View style={modalStyles.modalView}>
        <View style={modalStyles.modalHeader}>
          <Text style={modalStyles.modalTitle}>Select</Text>
        </View>
        {STATIC_SESSION_DATA && STATIC_SESSION_DATA.length > 0 ? (
          <ScrollView style={modalStyles.officeListScrollView}>
            {STATIC_SESSION_DATA.map((ses, index) => (
              <TouchableOpacity
                key={ses.session_id || index}
                onPress={() => SessionChange(ses)}
                style={modalStyles.officeListItem}>
                <Text style={modalStyles.officeItemText}>
                  {ses.label || ` ${index + 1}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={modalStyles.noDataText}>No available.</Text>
        )}
        <TouchableOpacity
          style={modalStyles.closeButton}
          onPress={closeModalSession}>
          {/* <FontAwesome6 name='home' size={22} color="white" /> */}
          <Text style={modalStyles.textStyle}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  ));

  // SemesterListModalContent
  const SemesterListModalContent = React.memo(({ closeModalSemester }) => (
    <View style={modalStyles.centeredView}>
      <View style={modalStyles.modalView}>
        <View style={modalStyles.modalHeader}>
          <Text style={modalStyles.modalTitle}>Select Semester</Text></View>
        {STATIC_SEMESTERS && STATIC_SEMESTERS.length > 0 ? (
          <ScrollView style={modalStyles.officeListScrollView}>
            {STATIC_SEMESTERS.map((sem, index) => (
              <TouchableOpacity
                key={sem.semester_id || index}
                onPress={() => SemesterChange(sem)}
                style={modalStyles.officeListItem}>
                <Text style={modalStyles.officeItemText}>
                  {sem.label || ` ${index + 1}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={modalStyles.noDataText}>No available.</Text>
        )}
        <TouchableOpacity
          style={modalStyles.closeButton}
          onPress={closeModalSemester}>
          {/* <FontAwesome6 name='home' size={22} color="white" /> */}
          <Text style={modalStyles.textStyle}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  ));

  // ^ -----------------------------------model end

   return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.bgcolor} barStyle="light-content" />
        <Header />
  
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} colors={[colors.bgcolor]} />}
        >
          <View style={styles.decorativeHeader}>
            <View style={styles.decorativeCircle} />
          </View>
  
          <View style={styles.profileContainer}>
            <View style={styles.profileCard}>
              <View style={styles.profileRow}>
                <View style={styles.profileTextContainer}>
                  <Text style={styles.greetingText}>Welcome back,</Text>
                  <Text style={styles.nameText} numberOfLines={1}>{profileData?.Emp_Name || 'Faculty Member'}</Text>
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{profileData?.Designation_Name || "Designation no update"}</Text>
                  </View>
                </View>
                <View style={styles.imageWrapper}>
                  <Image 
                    source={{ uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }} 
                    style={styles.profileImage} 
                  />
                </View>
              </View>
              {/* <div style={styles.divider} /> */}
              <View style={styles.degreeRow}>
                <FontAwesome6 name="school" size={16} color="#3028ac" />
                <Text style={styles.degreeText} numberOfLines={1}>{profileData?.Office_Name || 'Department'}</Text>
              </View>
            </View>
          </View>
  
          <View style={styles.selectorSection}>
            <TouchableOpacity style={styles.pillButton} onPress={() => setModalVisibleSession(true)}>
              <FontAwesome6 name="calendar" size={14} color={colors.bgcolor} />
              <Text style={styles.pillText}>{SessionValue}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pillButton} onPress={() => setModalVisibleSemester(true)}>
              <FontAwesome6 name="book" size={14} color={colors.bgcolor} />
              <Text style={styles.pillText}>{SemesterValue}</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.sliderWrapper}>
            <Slider />
          </View>
  
          <View style={styles.sectionContainer}>
            <View style={styles.headerRow}>
              <View style={styles.titleWrapper}>
                <View style={styles.verticalBar} />
                <Text style={styles.sectionTitle}>Faculty Dashboard</Text>
              </View>
            </View>
            <View style={styles.gridContainer}>
              {updatedMenu.slice(0, 5).map(renderGridItem)}
            </View>
          </View>

        <BirthdaySlider/>
        </ScrollView>
  
        {/* --- SESSION MODAL --- */}
        <Modal visible={isModalVisibleSession} transparent animationType="fade" onRequestClose={() => setModalVisibleSession(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisibleSession(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Select Session</Text>
                <ScrollView>
                  {STATIC_SESSION_DATA.map((item) => (
                    <TouchableOpacity key={item.key} style={styles.modalItem} onPress={() => SessionChange(item)}>
                      <Text style={styles.modalItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
  
        {/* --- SEMESTER MODAL --- */}
        <Modal visible={isModalVisibleSemester} transparent animationType="fade" onRequestClose={() => setModalVisibleSemester(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisibleSemester(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Select Semester</Text>
                {STATIC_SEMESTERS.map((item) => (
                  <TouchableOpacity key={item.semester_id} style={styles.modalItem} onPress={() => SemesterChange(item)}>
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
  
        <Footer />
      </View>
    );

    
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  content: { flex: 1 },
  decorativeHeader: {
    backgroundColor: colors.bgcolor, height: 180, borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    position: 'absolute', top: 0, left: 0, right: 0,
  },
  decorativeCircle: {
    position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  profileContainer: { paddingHorizontal: 20, marginTop: 20, marginBottom: 15 },
  profileCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, elevation: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 20,
  },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileTextContainer: { flex: 1, marginRight: 10 },
  greetingText: { fontSize: 13, color: '#888', fontWeight: '500' },
  nameText: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', marginVertical: 4 },
  badgeContainer: { backgroundColor: '#E3F2FD', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText: { color: colors.bgcolor, fontWeight: '700', fontSize: 10 },
  imageWrapper: { padding: 3, backgroundColor: '#fff', borderRadius: 40, elevation: 5 },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
  degreeRow: { flexDirection: 'row', alignItems: 'center' },
  degreeText: { fontSize: 12, color: '#666', marginLeft: 6 },
  selectorSection: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, justifyContent: 'center' },
  pillButton: {
    flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 15,
    borderRadius: 20, marginHorizontal: 5, alignItems: 'center', elevation: 3,
  },
  pillText: { fontSize: 12, fontWeight: '700', color: '#444', marginLeft: 5 },
  sliderWrapper: { marginVertical: 10 },


  sectionContainer: { marginTop: 10, paddingHorizontal: 20, paddingBottom: 10 },
  // headerRow: { marginBottom: 20 },
  // titleWrapper: { flexDirection: 'row', alignItems: 'center' },
  // verticalBar: { width: 4, height: 20, backgroundColor: colors.bgcolor, borderRadius: 2, marginRight: 8 },
  // sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  // gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' , marginBottom: 60 },
  // gridItemWrapper: { width: '25%', alignItems: 'center', marginBottom: 20 },
  // iconCard: {
  //   width: 66, height: 66, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 18,
  //   elevation: 4, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1,
  // },


gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingTop: 5 ,
    paddingBottom:55,
 
  },
  gridItemWrapper: { 
    width: '48%',  
    marginBottom: 16 
  },
  iconCard: {
    width: '100%', 
    height: 120,  
    borderRadius: 22, 
    padding: 16, 
    justifyContent: 'space-between',
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridLabel: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#2C3E50', 
    flex: 1,
    marginRight: 5
  },
  badgeCount: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 22,
    alignItems: 'center',
  },
  badgeCountText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: '900' 
  },



  cardLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222'
  },


  gridLabel: { fontSize: 10, color: '#555', textAlign: 'center', fontWeight: '600', paddingHorizontal: 2 },
  badgeCount: { position: 'absolute', top: -5, right: -5, minWidth: 28, height: 20, borderRadius: 9, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  badgeCountText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20, maxHeight: '60%' },
  modalHeader: { fontSize: 18, fontWeight: 'bold', color: colors.bgcolor, textAlign: 'center', marginBottom: 15 },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 16, textAlign: 'center', color: '#333' }
});

export default AdminHomeLayout;















 
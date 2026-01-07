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
  { key: 1, label: 'I Semester' },
  { key: 2, label: 'II Semester' }
];

const STATIC_SESSION_DATA = [
  // { key: 26, label: '2026-27' },
  { key: 25, label: '2025-26' },
  { key: 24, label: '2024-25' },
  { key: 23, label: '2023-24' },
  { key: 22, label: '2022-23' },
  { key: 21, label: '2021-22' },
  { key: 20, label: '2020-21' },
  { key: 19, label: '2019-20' },
  { key: 18, label: '2018-19' },
  { key: 17, label: '2017-18' },
  { key: 16, label: '2016-17' },
  { key: 15, label: '2015-16' },
  { key: 14, label: '2014-15' },
  { key: 13, label: '2013-14' }
];


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

  const [selectedSession, setSelectedSession] = useState(STATIC_SESSION_DATA[0].key);
  // const [selectedSession, setSelectedSession] = useState();
  const [selectedSemester, setSelectedSemester] = useState(STATIC_SEMESTERS[0].key);
  const [EmpId, setEmpId] = useState(null);
  const [officeList, setOfficeList] = useState([]);

  // const [session, setSession] = useState([]);  
  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  // session
  const [isModalVisibleSession, setModalVisibleSession] = useState(false);
  const openModalSession = useCallback(() => setModalVisibleSession(true), []);
  const closeModalSession = useCallback(() => setModalVisibleSession(false), []);

  // semester
  const [isModalVisibleSemester, setModalVisibleSemester] = useState(false);
  const openModalSemester = useCallback(() => setModalVisibleSemester(true), []);
  const closeModalSemester = useCallback(() => setModalVisibleSemester(false), []);



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

  // ^--- API Callbacks ---
  const getCurrentAcademicSession = useCallback(async () => {
    try {
      const getCurrentAcademicSessionApi = getApiList().getCurrentAcademicSession;
      const payload = {};
      const response = await HttpService.get(getCurrentAcademicSessionApi, payload);
      console.log(response.data.AccadmicSession, "current session")
      if (response?.status === 200) {
        // setSelectedSession(response?.data?.AccadmicSession);
      }
    } catch (error) {
      console.error("fetchMystudents failed:", error);
      // alert()
    }
  }, []);

  const fetchMystudents = useCallback(async (empId, session, semester) => {
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

        // setMyAssignment({
        //   Semester_Id: semester,
        //   Academic_session: session,
        //   Emp_Id: empId,
        //   data: response.data
        // });

      }
    } catch (error) {
      console.error("fetchMyCourses failed:", error);
    }
  }, []);

  const fetchMyassingment = useCallback(async (empId, session, semester) => {
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
    try {
      if (!empId) return;
      const payload = {
        Created_By: empId,
      };
      const getStudyMaterialDashCountApi = getApiList().getStudyMaterialDashCount;
      const response = await HttpService.get(getStudyMaterialDashCountApi, payload);
      console.log(response?.data, "response")
      if (response?.status === 200) {
        setMyStudyMaterial(response?.data);
      }
    } catch (error) {
      console.error("fetchMyCourses failed:", error);
    }
  }, []);


  const loadData = useCallback(async (session, semester, empId) => {
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

  const fetchInitialDataAndSetup = useCallback(async () => {
    setLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const profile = sessionData?.LoginDetail?.[0];
      const initialEmpId = profile?.Emp_Id;

      setEmpId(initialEmpId);
      setProfileData(profile);
      console.log(sessionData?.LoginDetail, "office list")
      setOfficeList(sessionData?.LoginDetail)

      // const sessionFromStorage = sessionData?.SelectedSession ;
      const sessionFromStorage = sessionData?.SelectedSession || STATIC_SESSION_DATA[0].key;
      const semesterFromStorage = sessionData?.SelectedSemester || STATIC_SEMESTERS[0].key;
      setSelectedSession(sessionFromStorage);
      setSelectedSemester(semesterFromStorage);
      // setSessionValue(sessionData?.SelectedSession)
      setSessionValue(STATIC_SESSION_DATA[0].label)
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

  useEffect(() => {
    fetchInitialDataAndSetup();
  }, [fetchInitialDataAndSetup]);

  const SessionChange = useCallback(async (data) => {
    // console.log(data?.key,"data?.key")
    setSelectedSession(data?.key);
    setSessionValue(data?.label)
    setModalVisibleSession(false)
  }, [])

  const SemesterChange = useCallback(async (data) => {
    // console.log(data?.key,"data?.key")
    setSelectedSemester(data?.key);
    setSemesterValue(data?.label)
    setModalVisibleSemester(false);
  }, [])


  useEffect(() => {
    if (EmpId) {
      const updateSessionAndRefresh = async () => {
        try {
          const currentSession = await SessionService.getSession();
          if (!currentSession) return;
          const updatedSession = {
            ...currentSession,
            SelectedSemester: selectedSemester,
            SelectedSession: selectedSession,
          };
          await SessionService.saveSession(updatedSession);
          // await loadData(selectedSession, selectedSemester, EmpId);
        } catch (error) {
          console.error("Failed to update session:", error);
        }
      };
      updateSessionAndRefresh();
      getCurrentAcademicSession();
    }
  }, [selectedSemester, selectedSession, EmpId, loadData]);

  onOfficeSelect = async (office) => {
    console.log(office, "office list")
    closeModal();


    //  try {
    //       const currentSession = await SessionService.getSession();
    //       if (!currentSession) return;
    //       const updatedSession = {
    //         ...currentSession,
    //         SelectedSemester: selectedSemester,
    //         SelectedSession: selectedSession,
    //       };
    //       await SessionService.saveSession(updatedSession);
    //       await loadData(selectedSession, selectedSemester, EmpId);

    //     } catch (error) {
    //       console.error("Failed to update session:", error);
    //     }

  }





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
    // ... dependencies
  );



  // --- API Logic ---
  // const loadDashboardData = useCallback(async (empId, session, semester) => {
  //   if (!empId) return;
  //   setLoading(true);
  //   try {
  //     const payload = { 
  //       Academic_session: session, 
  //       Semester_Id: semester, 
  //       emp_id: empId, 
  //       Emp_Id: empId, 
  //       Created_By: empId 
  //     };
      
  //     const [courses, students, assignments, materials] = await Promise.all([
  //       HttpService.get(getApiList().getCourseWiseDashCount, payload),
  //       HttpService.get(getApiList().getDegreeTypeWiseDashCount, payload),
  //       HttpService.get(getApiList().getStudyAssignmentDashCount, payload),
  //       HttpService.get(getApiList().getStudyMaterialDashCount, { Created_By: empId }),
  //     ]);
  //     console.log(courses,"courses")
  //     console.log(students,"students")
  //     console.log(assignments,"assignments")
  //     console.log(materials,"materials")

  //     if (courses?.status === 200) setMyCourse(courses.data);
  //     if (students?.status === 200) setStudent(students.data.DegreeTypeWiseStudentCount);
  //     if (assignments?.status === 200) setMyAssignment(assignments.data);
  //     if (materials?.status === 200) setMyStudyMaterial(materials.data);

  //     // Sync selection to SessionService
  //     const currentSession = await SessionService.getSession();
  //     if (currentSession) {
  //       await SessionService.saveSession({
  //         ...currentSession,
  //         SelectedSession: session,
  //         SelectedSemester: semester
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Dashboard Fetch Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);


  const loadDashboardData = useCallback(async (empId, session, semester) => {
  if (!empId) return;
  setLoading(true);
  try {
      
    const payload = { 
      Academic_session: session, 
      Semester_Id: semester, 
      emp_id: empId, 
      Emp_Id: empId, 
      Created_By: empId 
    };

    console.log("Payload:", payload);  // Log payload for debugging

 
    
    const [courses, students, assignments, materials] = await Promise.all([
      HttpService.get(getApiList().getCourseWiseDashCount, payload),
      HttpService.get(getApiList().getDegreeTypeWiseDashCount, payload),
      HttpService.get(getApiList().getStudyAssignmentDashCount, payload),
      HttpService.get(getApiList().getStudyMaterialDashCount, { Created_By: empId }),
    ]);

    console.log(courses, "courses");
    console.log(students, "students");
    console.log(assignments, "assignments");
    console.log(materials, "materials");

    // if (courses?.status === 200 && courses.data) setMyCourse(courses.data);
    // if (students?.status === 200 && students.data) setStudent(students.data.DegreeTypeWiseStudentCount);
    // if (assignments?.status === 200 && assignments.data) setMyAssignment(assignments.data);
    // if (materials?.status === 200 && materials.data) setMyStudyMaterial(materials.data);

    // Sync selection to SessionService
    const currentSession = await SessionService.getSession();
    if (currentSession) {
      await SessionService.saveSession({
        ...currentSession,
        SelectedSession: session,
        SelectedSemester: semester
      });
    }
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);  // Log the full error for more details
  } finally {
    setLoading(false);
  }
}, []);


  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    const sessionData = await SessionService.getSession();
    const profile = sessionData?.LoginDetail?.[0];
    
    if (profile) {
      setProfileData(profile);
      setEmpId(profile.Emp_Id);
      
      // Use stored selection or defaults
      const sess = sessionData?.SelectedSession || STATIC_SESSION_DATA[0].key;
      const sem = sessionData?.SelectedSemester || STATIC_SEMESTERS[0].key;
      
      setSelectedSession(sess);
      setSelectedSemester(sem);
      
      // Set Labels for UI
      setSessionValue(STATIC_SESSION_DATA.find(s => s.key === sess)?.label || "2025-26");
      setSemesterValue(STATIC_SEMESTERS.find(s => s.key === sem)?.label || "I Semester");
      // console.log(profile.Emp_Id, sess, sem,"profile.Emp_Id, sess, sem")

      await loadDashboardData(profile.Emp_Id, sess, sem);
    }
    setLoading(false);
  }, [loadDashboardData]);

  useEffect(() => {
    fetchInitialData();
  }, []);
  // --- Handlers ---
  const handleSessionSelect = (item) => {
    setSessionValue(item.label);
    setSelectedSession(item.key);
    setModalVisibleSession(false);
    // loadDashboardData(EmpId, item.key, selectedSemester);
  };

  const handleSemesterSelect = (item) => {
    setSemesterValue(item.label);
    setSelectedSemester(item.key);
    setModalVisibleSemester(false);
    // loadDashboardData(EmpId, selectedSession, item.key);
  };



    // const updatedMenu = useMemo(() => facultyMenu.map(item => {
    //   let count = 0;
    //   if (item.name === 'My Courses') count = MyCourse?.CourseCount?.[0]?.CourseCount || 0;
    //   else if (item.name === 'My Students') count = MyStudent?.reduce((sum, i) => sum + Number(i.TotalStudents || 0), 0) || 0;
    //   else if (item.name === 'My Assignment') count = MyAssignment?.StudyAssignmentDashCount?.[0]?.assignment_count || 0;
    //   else if (item.name === 'Study Materials') count = MyStudyMaterial?.StudyDashCount?.[0]?.Material_count || 0;
    //   return { ...item, count, data: item.data }; 
    // }), [MyCourse, MyStudent, MyAssignment, MyStudyMaterial]);
  


  const renderGridItem = (item) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.gridItemWrapper}
      onPress={() => navigation.navigate(item.screen, { data: item.data })}
      activeOpacity={0.8}>
      <View style={[styles.iconCard, { shadowColor: item.color || colors.footercolor }]}>
        {item.count > 0 && (
          <View style={[styles.badgeCount, { backgroundColor: item.color || colors.footercolor }]}>
            <Text style={styles.badgeCountText}>{item.count}</Text>
          </View>
        )}
        <FontAwesome6 name={item.icon} size={28} color={item.color || colors.footercolor} />
      </View>
      <Text style={styles.gridLabel} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );



  // --- Rendering ---
  const handleRefresh = useCallback(() => {
    // fetchInitialDataAndSetup();
  }, [
    // fetchInitialDataAndSetup

  ]);

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
                key={ses.key || index}
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
                key={sem.key || index}
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

  // return (
  //   <View style={styles.container}>
  //     <Header />
  //     {/* <UpdateChecker /> */}
  //     <ScrollView
  //       style={styles.content}
  //       refreshControl={
  //         <RefreshControl
  //           refreshing={loading}
  //           onRefresh={handleRefresh}
  //           colors={["#007AFF"]}
  //           tintColor="#007AFF"
  //           title="Refreshing..."
  //         />}
  //     >

  //       <View style={styles.userInfo}>
  //         <View style={{ flex: 1 }}>
  //           <Text style={styles.userName}>{profileData?.Emp_Name || 'Guest'} 👋</Text>
  //           <Text style={styles.userHandle}>{profileData?.Organization_Unit_Name || ''}</Text>
  //         </View>

  //         {/* <View style={styles.changeOfficeContainer}>
  //           <TouchableOpacity
  //             style={styles.changeOfficeButton}
  //             onPress={openModal}
  //             accessibilityLabel="Change Office Button">
  //             <Text style={styles.changeOfficeButtonText}>Office's</Text>
  //             <Text style={styles.changeOfficeButtonText}>Change Office</Text>
  //           </TouchableOpacity>
  //         </View> */}

  //       </View>
  //       <View style={styles.topcard}>
  //         <Slider />
  //       </View>


  //       <View style={styles.topcard1}>
  //         {/* Dropdown Selectors */}
  //         <View style={styles.selectorContainer}>
  //           <Text style={styles.sectionTitle}>Faculty Dashboard</Text>

  //           <View style={styles.selectorContainercard}>
  //             <TouchableOpacity
  //               style={styles.ModelButton}
  //               onPress={openModalSession}
  //               accessibilityLabel="Select a Session">
  //               <Text style={styles.ModelText}> {SessionValue || 'Session'}</Text>
  //             </TouchableOpacity>

  //             <TouchableOpacity
  //               style={styles.ModelButton}
  //               onPress={openModalSemester}
  //               accessibilityLabel="Select a Semester">
  //               <Text style={styles.ModelText}>{SemesterValue || 'Semester'}</Text>
  //             </TouchableOpacity>
  //           </View>
  //         </View>

  //         {/* Grid Menu */}
  //         <ScrollView horizontal={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.eCornerContainer}>
  //           <View style={styles.gridContainer}>
  //             {updatedMenu?.map(item => (
  //               <TouchableOpacity
  //                 key={item.id}
  //                 style={styles.gridItem}
  //                 onPress={() => navigation.navigate(item.screen, { data: item.data })}>
  //                 <View style={{ alignItems: 'center' }}>
  //                   <View style={[styles.iconRectangle, { backgroundColor: item.color }]}>
  //                     <Text style={styles.cont}>{item.count}</Text>
  //                     <FontAwesome6 name={item.icon} size={28} color={item.iconColor || 'white'} />
  //                   </View>
  //                   <Text style={styles.iconLabel}>{item.name}</Text>
  //                 </View>
  //               </TouchableOpacity>
  //             ))}
  //           </View>
  //         </ScrollView>


  //         {/* <Text style={styles.sectionTitle}>🎂 Today's Birthday</Text>
  //       <BirthdaySlider /> */}
  //       </View>


  //       {/* <View style={styles.topcard2}>
  //       <Text style={styles.sectionTitle}>Notification's</Text>
  //               <BirthdaySlider />  
  //       </View> */}

  //       {/*  officelist*/}
  //       <TouchableWithoutFeedback onPress={closeModal}>
  //         <Modal
  //           animationType="slide"
  //           transparent={true}
  //           visible={isModalVisible}

  //           onRequestClose={closeModal}>
  //           <OfficeListModalContent closeModal={closeModal} />
  //         </Modal>
  //       </TouchableWithoutFeedback>
  //       {/*  session*/}
  //       <Modal
  //         animationType="slide"
  //         transparent={true}
  //         visible={isModalVisibleSession}
  //         onRequestClose={closeModalSession}>
  //         <TouchableWithoutFeedback onPress={closeModalSession}>
  //           <View style={{ flex: 1, }}>
  //             <SessionListModalContent closeModalSession={closeModalSession} />
  //           </View>
  //         </TouchableWithoutFeedback>
  //       </Modal>
  //       {/*  Semester*/}
  //       <Modal
  //         animationType="slide"
  //         transparent={true}
  //         visible={isModalVisibleSemester}
  //         onRequestClose={closeModalSemester}>
  //         <TouchableWithoutFeedback onPress={closeModalSemester}>
  //           <View style={{ flex: 1, }}>
  //             <SemesterListModalContent closeModalSemester={closeModalSemester} />
  //           </View>
  //         </TouchableWithoutFeedback>
  //       </Modal>
  //     </ScrollView>
  //     <Footer />
  //   </View>
  // );


   return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.footercolor} barStyle="light-content" />
        <Header />
  
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchInitialData} colors={[colors.footercolor]} />}
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
                    <Text style={styles.badgeText}>{profileData?.Designation_Name || "Faculty"}</Text>
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
                <MaterialIcons name="business" size={16} color="#666" />
                <Text style={styles.degreeText} numberOfLines={1}>{profileData?.Organization_Unit_Name || 'Department'}</Text>
              </View>
            </View>
          </View>
  
          <View style={styles.selectorSection}>
            <TouchableOpacity style={styles.pillButton} onPress={() => setModalVisibleSession(true)}>
              <FontAwesome6 name="calendar" size={14} color={colors.footercolor} />
              <Text style={styles.pillText}>{SessionValue}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pillButton} onPress={() => setModalVisibleSemester(true)}>
              <FontAwesome6 name="book" size={14} color={colors.footercolor} />
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
              {updatedMenu.map(renderGridItem)}
            </View>
          </View>
        </ScrollView>
  
        {/* --- SESSION MODAL --- */}
        <Modal visible={isModalVisibleSession} transparent animationType="fade" onRequestClose={() => setModalVisibleSession(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisibleSession(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Select Session</Text>
                <ScrollView>
                  {STATIC_SESSION_DATA.map((item) => (
                    <TouchableOpacity key={item.key} style={styles.modalItem} onPress={() => handleSessionSelect(item)}>
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
                  <TouchableOpacity key={item.key} style={styles.modalItem} onPress={() => handleSemesterSelect(item)}>
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
    backgroundColor: colors.footercolor, height: 180, borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
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
  badgeText: { color: colors.footercolor, fontWeight: '700', fontSize: 10 },
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
  sectionContainer: { marginTop: 10, paddingHorizontal: 20, paddingBottom: 100 },
  headerRow: { marginBottom: 20 },
  titleWrapper: { flexDirection: 'row', alignItems: 'center' },
  verticalBar: { width: 4, height: 20, backgroundColor: colors.footercolor, borderRadius: 2, marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  gridItemWrapper: { width: '25%', alignItems: 'center', marginBottom: 20 },
  iconCard: {
    width: 66, height: 66, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 18,
    elevation: 4, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1,
  },
  gridLabel: { fontSize: 10, color: '#555', textAlign: 'center', fontWeight: '600', paddingHorizontal: 2 },
  badgeCount: { position: 'absolute', top: -5, right: -5, minWidth: 28, height: 20, borderRadius: 9, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  badgeCountText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20, maxHeight: '60%' },
  modalHeader: { fontSize: 18, fontWeight: 'bold', color: colors.footercolor, textAlign: 'center', marginBottom: 15 },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 16, textAlign: 'center', color: '#333' }
});

export default AdminHomeLayout;



















// working code
// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Alert, Modal, RefreshControl } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import * as Keychain from "react-native-keychain"; 

// // Local Imports (assumed paths are correct)
// import { facultyMenu } from '../../config/Menu/MenuList';
// import Slider from '../../layout/Sliders/Slider';
// import BirthdaySlider from '../../layout/Sliders/BirthdaySlider';
// // import { API_BASE_URL } from '../../../common/config/BaseUrl'; // Unused
// import getApiList from "../../config/Api/adminApiList";
// import Header from "../../layout/Header/Header";
// import Footer from "../../layout/Footer/Footer";
// import { HttpService } from "../../../common/Services/HttpService";
// import SessionService from '../../../common/Services/SessionService';
// import CustomSpinner from '../../../common/Services/alert/CustomSpinner';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import UpdateChecker from "../../../common/UpdateChecker";
// import colors from '../../../common/config/colors';

// // --- Memoized Sub-Component ---
// const IconMap = {
//   EvilIcons,
//   FontAwesome6,
//   MaterialIcons,
// };

// const IconText = React.memo(({ label, iconLib = 'MaterialIcons', iconName, iconSize = 25, color = 'green' }) => {
//   const IconComponent = IconMap[iconLib] || MaterialIcons;
//   return (
//     <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
//       <IconComponent name={iconName} size={iconSize} color={color} />
//       <Text style={{ color: 'navy', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
//         {label}
//       </Text>
//     </View>
//   );
// });

// // --- Static/Memoized Data ---
// const STATIC_SEMESTERS = [
//   { key: 1, label: 'I Semester' },
//   { key: 2, label: 'II Semester' }
// ];

// const STATIC_SESSION_DATA = [
//   // { key: 26, label: '2026-27' },
//   { key: 25, label: '2025-26' },
//   { key: 24, label: '2024-25' },
//   { key: 23, label: '2023-24' },
//   { key: 22, label: '2022-23' },
//   { key: 21, label: '2021-22' },
//   { key: 20, label: '2020-21' },
//   { key: 19, label: '2019-20' },
//   { key: 18, label: '2018-19' },
//   { key: 17, label: '2017-18' },
//   { key: 16, label: '2016-17' },
//   { key: 15, label: '2015-16' },
//   { key: 14, label: '2014-15' },
//   { key: 13, label: '2013-14' }
// ];


// // --- Main Component ---
// const AdminHomeLayout = () => {
//   const navigation = useNavigation();
//   // const route = useRoute(); // Unused
//   const [loading, setLoading] = useState(true);
//   const [profileData, setProfileData] = useState(null);
//   const [MyCourse, setMyCourse] = useState(null);
//   const [MyStudent, setStudent] = useState(null);
//   const [MyAssignment, setMyAssignment] = useState(null);
//   const [MyStudyMaterial, setMyStudyMaterial] = useState(null);

//   const [SemesterValue, setSemesterValue] = useState(null);
//   const [SessionValue, setSessionValue] = useState(null);
//   // const [MyStudyMaterials, setMyStudyMaterials] = useState([]);  

//   const [selectedSession, setSelectedSession] = useState(STATIC_SESSION_DATA[0].key);
//   // const [selectedSession, setSelectedSession] = useState();
//   const [selectedSemester, setSelectedSemester] = useState(STATIC_SEMESTERS[0].key);
//   const [EmpId, setEmpId] = useState(null);
//   const [officeList, setOfficeList] = useState([]);

//   // const [session, setSession] = useState([]);  
//   const [isModalVisible, setModalVisible] = useState(false);
//   const openModal = useCallback(() => setModalVisible(true), []);
//   const closeModal = useCallback(() => setModalVisible(false), []);

//   // session
//   const [isModalVisibleSession, setModalVisibleSession] = useState(false);
//   const openModalSession = useCallback(() => setModalVisibleSession(true), []);
//   const closeModalSession = useCallback(() => setModalVisibleSession(false), []);

//   // semester
//   const [isModalVisibleSemester, setModalVisibleSemester] = useState(false);
//   const openModalSemester = useCallback(() => setModalVisibleSemester(true), []);
//   const closeModalSemester = useCallback(() => setModalVisibleSemester(false), []);



//   const myStudentCount = useMemo(() =>
//     MyStudent?.reduce((sum, item) => sum + Number(item.TotalStudents || 0), 0) || 0,
//     [MyStudent]
//   );

//   const myCourseCount = useMemo(() =>
//     MyCourse?.CourseCount?.[0]?.CourseCount || 0,
//     [MyCourse]
//   );

//   const MyAssignmentCount = useMemo(() =>
//     MyAssignment?.StudyAssignmentDashCount?.[0]?.assignment_count || 0,
//     [MyAssignment]
//   );
//   const MyStudyMaterialCount = useMemo(() =>
//     MyStudyMaterial?.StudyDashCount?.[0]?.Material_count || 0,
//     [MyStudyMaterial]
//   );

//   // ^--- API Callbacks ---
//   const getCurrentAcademicSession = useCallback(async () => {
//     try {
//       const getCurrentAcademicSessionApi = getApiList().getCurrentAcademicSession;
//       const payload = {};
//       const response = await HttpService.get(getCurrentAcademicSessionApi, payload);
//       console.log(response.data.AccadmicSession, "current session")
//       if (response?.status === 200) {
//         // setSelectedSession(response?.data?.AccadmicSession);
//       }
//     } catch (error) {
//       console.error("fetchMystudents failed:", error);
//       // alert()
//     }
//   }, []);

//   const fetchMystudents = useCallback(async (empId, session, semester) => {
//     try {
//       if (!empId) return;
//       const DegreeTypeWiseStudentListApi = getApiList().getDegreeTypeWiseDashCount;
//       const payload = {
//         Academic_session: session,
//         Semester_Id: semester,
//         emp_id: empId
//       };
//       const response = await HttpService.get(DegreeTypeWiseStudentListApi, payload);
//       // console.log(response,"response")
//       if (response?.status === 200) {
//         setStudent(response.data.DegreeTypeWiseStudentCount);
//       }
//     } catch (error) {
//       console.error("fetchMystudents failed:", error);
//       // alert()
//     }
//   }, []);

//   const fetchMyCourses = useCallback(async (empId, session, semester) => {
//     try {
//       if (!empId) return;
//       const payload = {
//         Semester_Id: semester,
//         Academic_session: session,
//         Emp_Id: empId,
//       };
//       const CourseWiseDashCountApi = getApiList().getCourseWiseDashCount;
//       const response = await HttpService.get(CourseWiseDashCountApi, payload);
//       if (response?.status === 200) {
//         setMyCourse(response.data);

//         // setMyAssignment({
//         //   Semester_Id: semester,
//         //   Academic_session: session,
//         //   Emp_Id: empId,
//         //   data: response.data
//         // });

//       }
//     } catch (error) {
//       console.error("fetchMyCourses failed:", error);
//     }
//   }, []);

//   const fetchMyassingment = useCallback(async (empId, session, semester) => {
//     try {
//       if (!empId) return;
//       const payload = {
//         Semester_Id: semester,
//         Academic_session: session,
//         Created_By: empId,
//       };
//       const getStudyAssignmentDashCountApi = getApiList().getStudyAssignmentDashCount;
//       const response = await HttpService.get(getStudyAssignmentDashCountApi, payload);
//       // console.log(response?.data?.StudyAssignmentDashCount[0].assignment_count, "response")
//       if (response?.status === 200) {
//         setMyAssignment(response?.data);
//       }
//     } catch (error) {
//       console.error("fetchMyCourses failed:", error);
//     }
//   }, []);


//   const fetchStudyMaterials = useCallback(async (empId) => {
//     try {
//       if (!empId) return;
//       const payload = {
//         Created_By: empId,
//       };
//       const getStudyMaterialDashCountApi = getApiList().getStudyMaterialDashCount;
//       const response = await HttpService.get(getStudyMaterialDashCountApi, payload);
//       console.log(response?.data, "response")
//       if (response?.status === 200) {
//         setMyStudyMaterial(response?.data);
//       }
//     } catch (error) {
//       console.error("fetchMyCourses failed:", error);
//     }
//   }, []);


//   const loadData = useCallback(async (session, semester, empId) => {
//     if (!empId) return;
//     setLoading(true);
//     try {
//       await Promise.all([
//         fetchMyCourses(empId, session, semester),
//         fetchMystudents(empId, session, semester),
//         fetchMyassingment(empId, session, semester),
//         fetchStudyMaterials(empId),
//       ]);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       Alert.alert("Error", "Failed to fetch dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   }, [fetchMyCourses, fetchMystudents, fetchMyassingment, fetchStudyMaterials]);

//   const fetchInitialDataAndSetup = useCallback(async () => {
//     setLoading(true);
//     try {
//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const initialEmpId = profile?.Emp_Id;

//       setEmpId(initialEmpId);
//       setProfileData(profile);
//       console.log(sessionData?.LoginDetail, "office list")
//       setOfficeList(sessionData?.LoginDetail)

//       // const sessionFromStorage = sessionData?.SelectedSession ;
//       const sessionFromStorage = sessionData?.SelectedSession || STATIC_SESSION_DATA[0].key;
//       const semesterFromStorage = sessionData?.SelectedSemester || STATIC_SEMESTERS[0].key;
//       setSelectedSession(sessionFromStorage);
//       setSelectedSemester(semesterFromStorage);
//       // setSessionValue(sessionData?.SelectedSession)
//       setSessionValue(STATIC_SESSION_DATA[0].label)
//       setSemesterValue(STATIC_SEMESTERS[0].label)

//       if (initialEmpId) {
//         await loadData(sessionFromStorage, semesterFromStorage, initialEmpId);
//       }
//     } catch (error) {
//       console.error("Error loading initial data:", error);
//       Alert.alert("Error", "Failed to load initial data.");
//     } finally {
//       setLoading(false);
//     }
//   }, [loadData]);

//   useEffect(() => {
//     fetchInitialDataAndSetup();
//   }, [fetchInitialDataAndSetup]);

//   const SessionChange = useCallback(async (data) => {
//     // console.log(data?.key,"data?.key")
//     setSelectedSession(data?.key);
//     setSessionValue(data?.label)
//     setModalVisibleSession(false)
//   }, [])

//   const SemesterChange = useCallback(async (data) => {
//     // console.log(data?.key,"data?.key")
//     setSelectedSemester(data?.key);
//     setSemesterValue(data?.label)
//     setModalVisibleSemester(false);
//   }, [])


//   useEffect(() => {
//     if (EmpId) {
//       const updateSessionAndRefresh = async () => {
//         try {
//           const currentSession = await SessionService.getSession();
//           if (!currentSession) return;
//           const updatedSession = {
//             ...currentSession,
//             SelectedSemester: selectedSemester,
//             SelectedSession: selectedSession,
//           };
//           await SessionService.saveSession(updatedSession);
//           await loadData(selectedSession, selectedSemester, EmpId);
//         } catch (error) {
//           console.error("Failed to update session:", error);
//         }
//       };
//       updateSessionAndRefresh();
//       getCurrentAcademicSession();
//     }
//   }, [selectedSemester, selectedSession, EmpId, loadData]);

//   onOfficeSelect = async (office) => {
//     console.log(office, "office list")
//     closeModal();


//     //  try {
//     //       const currentSession = await SessionService.getSession();
//     //       if (!currentSession) return;
//     //       const updatedSession = {
//     //         ...currentSession,
//     //         SelectedSemester: selectedSemester,
//     //         SelectedSession: selectedSession,
//     //       };
//     //       await SessionService.saveSession(updatedSession);
//     //       await loadData(selectedSession, selectedSemester, EmpId);

//     //     } catch (error) {
//     //       console.error("Failed to update session:", error);
//     //     }

//   }

//   // const updatedMenu = useMemo(() =>
//   //   facultyMenu
//   //     .map(item => {
//   //       let count = "";
//   //       let data = null;
//   //       switch (item.name) {
//   //         case 'My Courses':
//   //           count = myCourseCount;
//   //           data = MyCourse;
//   //           break;
//   //         case 'My Students':
//   //           count = myStudentCount;
//   //           data = MyStudent;
//   //           break;
//   //         case 'My Assignment':
//   //           count = MyAssignmentCount;
//   //           data = MyAssignment;
//   //           break;
//   //         case 'Study Materials':
//   //           count = MyStudyMaterialCount;
//   //           data = MyStudyMaterial;
//   //           break;
//   //         default:
//   //           break;
//   //       }
//   //       return { ...item, count: count, data: data };
//   //     })
//   //     .filter(item => item.id),
//   //   // ... dependencies
//   // );


//     const updatedMenu = useMemo(() => facultyMenu.map(item => {
//       let count = 0;
//       if (item.name === 'My Courses') count = MyCourse?.CourseCount?.[0]?.CourseCount || 0;
//       else if (item.name === 'My Students') count = MyStudent?.reduce((sum, i) => sum + Number(i.TotalStudents || 0), 0) || 0;
//       else if (item.name === 'My Assignment') count = MyAssignment?.StudyAssignmentDashCount?.[0]?.assignment_count || 0;
//       else if (item.name === 'Study Materials') count = MyStudyMaterial?.StudyDashCount?.[0]?.Material_count || 0;
//       return { ...item, count, data: item.data }; 
//     }), [MyCourse, MyStudent, MyAssignment, MyStudyMaterial]);
  
//   // --- Rendering ---
//   const handleRefresh = useCallback(() => {
//     fetchInitialDataAndSetup();
//   }, [fetchInitialDataAndSetup]);

//   if (loading && !profileData) {
//     return <View style={styles.spinnerWithText}>
//       <CustomSpinner size={50} color="rgba(251, 0, 0, 1)" type="bars" />
//       <Text style={styles.text}>Loading...</Text>
//     </View>
//   }

//   // ^ -----------------------------------model start
//   // office list/destination  
//   const OfficeListModalContent = React.memo(({ closeModal }) => (
//     <View style={modalStyles.centeredView}>
//       <View style={modalStyles.modalView}>
//         <Text style={modalStyles.modalTitle}>Select Destination/Office</Text>

//         {officeList && officeList.length > 0 ? (
//           <ScrollView style={modalStyles.officeListScrollView}>
//             {officeList.map((office, index) => (
//               <TouchableOpacity
//                 key={office.Office_Id || index}
//                 style={modalStyles.officeListItem}
//                 onPress={() => onOfficeSelect(office)
//                 }>
//                 <Text style={modalStyles.officeItemText}>
//                   {office.Office_Name || `Office ${index + 1}`}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         ) : (
//           <Text style={modalStyles.noDataText}>No alternative offices available.</Text>
//         )}

//         <TouchableOpacity
//           style={modalStyles.closeButton}
//           onPress={closeModal}>
//           {/* <FontAwesome6 name='home' size={22} color="white" /> */}
//           <Text style={modalStyles.textStyle}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   ));

//   //  SessionListModalContent
//   const SessionListModalContent = React.memo(({ closeModalSession }) => (
//     <View style={modalStyles.centeredView}>
//       <View style={modalStyles.modalView}>
//         <View style={modalStyles.modalHeader}>
//           <Text style={modalStyles.modalTitle}>Select</Text>
//         </View>
//         {STATIC_SESSION_DATA && STATIC_SESSION_DATA.length > 0 ? (
//           <ScrollView style={modalStyles.officeListScrollView}>
//             {STATIC_SESSION_DATA.map((ses, index) => (
//               <TouchableOpacity
//                 key={ses.key || index}
//                 onPress={() => SessionChange(ses)}
//                 style={modalStyles.officeListItem}>
//                 <Text style={modalStyles.officeItemText}>
//                   {ses.label || ` ${index + 1}`}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         ) : (
//           <Text style={modalStyles.noDataText}>No available.</Text>
//         )}
//         <TouchableOpacity
//           style={modalStyles.closeButton}
//           onPress={closeModalSession}>
//           {/* <FontAwesome6 name='home' size={22} color="white" /> */}
//           <Text style={modalStyles.textStyle}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   ));

//   // SemesterListModalContent
//   const SemesterListModalContent = React.memo(({ closeModalSemester }) => (
//     <View style={modalStyles.centeredView}>
//       <View style={modalStyles.modalView}>
//         <View style={modalStyles.modalHeader}>
//           <Text style={modalStyles.modalTitle}>Select Semester</Text></View>
//         {STATIC_SEMESTERS && STATIC_SEMESTERS.length > 0 ? (
//           <ScrollView style={modalStyles.officeListScrollView}>
//             {STATIC_SEMESTERS.map((sem, index) => (
//               <TouchableOpacity
//                 key={sem.key || index}
//                 onPress={() => SemesterChange(sem)}
//                 style={modalStyles.officeListItem}>
//                 <Text style={modalStyles.officeItemText}>
//                   {sem.label || ` ${index + 1}`}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         ) : (
//           <Text style={modalStyles.noDataText}>No available.</Text>
//         )}
//         <TouchableOpacity
//           style={modalStyles.closeButton}
//           onPress={closeModalSemester}>
//           {/* <FontAwesome6 name='home' size={22} color="white" /> */}
//           <Text style={modalStyles.textStyle}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   ));

//   // ^ -----------------------------------model end

//   return (
//     <View style={styles.container}>
//       <Header />
//       {/* <UpdateChecker /> */}
//       <ScrollView
//         style={styles.content}
//         refreshControl={
//           <RefreshControl
//             refreshing={loading}
//             onRefresh={handleRefresh}
//             colors={["#007AFF"]}
//             tintColor="#007AFF"
//             title="Refreshing..."
//           />}
//       >

//         <View style={styles.userInfo}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.userName}>{profileData?.Emp_Name || 'Guest'} 👋</Text>
//             <Text style={styles.userHandle}>{profileData?.Organization_Unit_Name || ''}</Text>
//           </View>

//           {/* <View style={styles.changeOfficeContainer}>
//             <TouchableOpacity
//               style={styles.changeOfficeButton}
//               onPress={openModal}
//               accessibilityLabel="Change Office Button">
//               <Text style={styles.changeOfficeButtonText}>Office's</Text>
//               <Text style={styles.changeOfficeButtonText}>Change Office</Text>
//             </TouchableOpacity>
//           </View> */}

//         </View>
//         <View style={styles.topcard}>
//           <Slider />
//         </View>


//         <View style={styles.topcard1}>
//           {/* Dropdown Selectors */}
//           <View style={styles.selectorContainer}>
//             <Text style={styles.sectionTitle}>Faculty Dashboard</Text>

//             <View style={styles.selectorContainercard}>
//               <TouchableOpacity
//                 style={styles.ModelButton}
//                 onPress={openModalSession}
//                 accessibilityLabel="Select a Session">
//                 <Text style={styles.ModelText}> {SessionValue || 'Session'}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.ModelButton}
//                 onPress={openModalSemester}
//                 accessibilityLabel="Select a Semester">
//                 <Text style={styles.ModelText}>{SemesterValue || 'Semester'}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Grid Menu */}
//           <ScrollView horizontal={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.eCornerContainer}>
//             <View style={styles.gridContainer}>
//               {updatedMenu?.map(item => (
//                 <TouchableOpacity
//                   key={item.id}
//                   style={styles.gridItem}
//                   onPress={() => navigation.navigate(item.screen, { data: item.data })}>
//                   <View style={{ alignItems: 'center' }}>
//                     <View style={[styles.iconRectangle, { backgroundColor: item.color }]}>
//                       <Text style={styles.cont}>{item.count}</Text>
//                       <FontAwesome6 name={item.icon} size={28} color={item.iconColor || 'white'} />
//                     </View>
//                     <Text style={styles.iconLabel}>{item.name}</Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </ScrollView>


//           {/* <Text style={styles.sectionTitle}>🎂 Today's Birthday</Text>
//         <BirthdaySlider /> */}
//         </View>


//         {/* <View style={styles.topcard2}>
//         <Text style={styles.sectionTitle}>Notification's</Text>
//                 <BirthdaySlider />  
//         </View> */}

//         {/*  officelist*/}
//         <TouchableWithoutFeedback onPress={closeModal}>
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={isModalVisible}

//             onRequestClose={closeModal}>
//             <OfficeListModalContent closeModal={closeModal} />
//           </Modal>
//         </TouchableWithoutFeedback>
//         {/*  session*/}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={isModalVisibleSession}
//           onRequestClose={closeModalSession}>
//           <TouchableWithoutFeedback onPress={closeModalSession}>
//             <View style={{ flex: 1, }}>
//               <SessionListModalContent closeModalSession={closeModalSession} />
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//         {/*  Semester*/}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={isModalVisibleSemester}
//           onRequestClose={closeModalSemester}>
//           <TouchableWithoutFeedback onPress={closeModalSemester}>
//             <View style={{ flex: 1, }}>
//               <SemesterListModalContent closeModalSemester={closeModalSemester} />
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//       </ScrollView>
//       <Footer />
//     </View>
//   );
// };


// const modalStyles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // marginTop: 22,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     elevation: 250,
//     shadowColor: '#000000ff'
//   },

//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: '80%',
//   },
//   modalHeader: {
//     marginTop: -15,
//     width: 250,
//     height: 50,
//     margin: 10,
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: colors.footercolor
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: colors.background
//     // marginBottom: 15,
//     // backgroundColor:'red'
//   },
//   closeButton: {
//     backgroundColor: '#2196F3',
//     borderRadius: 5,
//     padding: 10,
//     elevation: 2,
//     marginTop: 15,
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },

//   officeListScrollView: {
//     maxHeight: 300,
//     width: '100%',
//     paddingHorizontal: 10,
//   },
//   officeListItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     width: '100%',
//     alignItems: 'center',
//   },
//   officeItemText: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   noDataText: {
//     fontSize: 16,
//     color: 'gray',
//     marginBottom: 20,
//   }
// });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffffff',
//     marginBottom: 0
//   },
//   spinnerWithText: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100%",
//     width: "100%",
//   },
//   text: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: "#ff6347",
//   },

//   content: { flex: 1, padding: 15 },

//   topcard: {
//     // marginTop:15,
//     padding: 15,
//     // margin: -20,
//     marginLeft: -25,
//     marginRight: -25,
//     // backgroundColor: '#f9e687ff',   
//     marginVertical: 10,
//     marginHorizontal: 10,
//     borderStartWidth: 2,
//     borderColor: 'red'
//     // borderTopLeftRadius: 40,
//     // borderTopRightRadius: 40,
//     // borderBottomLeftRadius: 40,
//     // borderBottomRightRadius: 40,

//   },
//   topcard1: {
//     // padding: 15,
//     // margin: -20,
//     // marginRight: -25,
//     // marginLeft: -15,
//     // backgroundColor: colors.cardcolor,  
//     // marginVertical: 10,
//     // marginHorizontal: 10,
//     // borderTopRightRadius: 10,
//     // borderBottomLeftRadius: 1200,
//     // borderBottomLeftRadius: 70,
//     // borderTopLeftRadius: 100,
//     // borderWidth:1.5,
//     // borderColor:'#ffffffff'
//   },
//   topcard2: {
//     // marginTop:5,
//     // padding: 15,
//     // margin: -20,
//     // marginLeft: -25,
//     // marginRight: -25,
//     // backgroundColor: '#ffffffff',   
//     // marginVertical: 10,
//     // marginHorizontal: 10,
//     // borderTopRightRadius: 100,
//     // borderBottomRightRadius: 0,
//   },

//   userInfo: {
//     // margin:10,
//     padding: 15,
//     // marginLeft: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 1,
//     // backgroundColor: '#BCCEF8',   
//     borderRadius: 10,
//     borderWidth: 0.4,
//     borderColor: '#ff0000ff'
//     // borderTopRightRadius: 100,
//     // borderBottomRightRadius: 100,
//   },

//   userName: { fontWeight: 'bold', fontSize: 18, color: 'black' },
//   userHandle: { color: 'gray', fontSize: 14 },
//   sectionTitle: {
//     color: colors.footercolor,
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 8,
//     marginTop: 8,
//     margin: 5,
//   },

//   cont: {
//     fontWeight: 'bold',
//   },
//   iconRectangle: {
//     width: 70,
//     height: 70,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 0.3,
//     borderRadius: 20,
//     // marginBottom: 5,
//     // shadowOffset: { width: 0, height: 6 },
//     // shadowOpacity: 0.3,
//     // shadowRadius: 8,
//     // elevation: 10,
//     // backgroundColor: '#fff',
//   },

//   iconLabel: {
//     fontSize: 14,
//     color: '#003109ff',
//     textAlign: 'center',
//     marginBottom: 15
//   },

//   eCornerContainer: {
//     // backgroundColor:'#936a0aff',
//   },

//   gridContainer: {
//     margin: 5,
//     padding: -10,
//     margin: 10,
//     // backgroundColor: '#FAF7F0',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     // borderRadius: 50,
//     // justifyContent: 'flex-start',
//     // elevation: 2,
//     // shadowColor: '#000',
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.2,
//     // shadowRadius: 5,
//     // borderBottomleftRadius: 1200,
//     // borderWidth:1,
//     // borderColor:'#009a98ff'
//   },
//   gridItem: {
//     width: '25%',
//     marginBottom: 10,
//     // borderRadius: 12,
//   },

//   changeOfficeContainer: {
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//   },

//   ModelButton: {
//     backgroundColor: "#f2dcc4ff",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 18,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     marginLeft: 10
//   },
//   ModelText: {
//     fontSize: 16,
//     color: colors.textPrimary
//   },

//   changeOfficeButton: {
//     backgroundColor: '#85b004ff',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   changeOfficeButtonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },

//   selectorContainercard: {
//     marginTop: -15,
//     padding: 5,
//     flexDirection: 'row',
//     // backgroundColor: '#5522222c',
//     marginRight: -20,
//     borderTopLeftRadius: 15,
//     borderBottomLeftRadius: 15
//   },

//   selectorContainer: {
//     flexDirection: 'row',
//     padding: 5,
//     // margin: 5,
//     justifyContent: 'flex-end'
//   },


// });

// export default AdminHomeLayout;




































 
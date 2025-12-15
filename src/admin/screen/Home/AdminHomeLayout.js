import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Keychain from "react-native-keychain"; 

// Local Imports (assumed paths are correct)
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

  const [SemesterValue, setSemesterValue] = useState(null);
  const [SessionValue, setSessionValue] = useState(null);
  // const [MyStudyMaterials, setMyStudyMaterials] = useState([]);  

  const [selectedSession, setSelectedSession] = useState(STATIC_SESSION_DATA[0].key);
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
    MyAssignment?.CourseCount?.[0]?.CourseCount || 0,
    [MyAssignment]
  );

  // ^--- API Callbacks ---
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
        setMyAssignment({
          Semester_Id: semester,
          Academic_session: session,
          Emp_Id: empId,
          data: response.data
        });
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
        fetchMystudents(empId, session, semester)
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [fetchMyCourses, fetchMystudents]);

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

      const sessionFromStorage = sessionData?.SelectedSession || STATIC_SESSION_DATA[0].key;
      const semesterFromStorage = sessionData?.SelectedSemester || STATIC_SEMESTERS[0].key;
      setSelectedSession(sessionFromStorage);
      setSelectedSemester(semesterFromStorage);

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
          await loadData(selectedSession, selectedSemester, EmpId);

        } catch (error) {
          console.error("Failed to update session:", error);
        }
      };

      updateSessionAndRefresh();
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
          default:
            break;
        }

        return { ...item, count: count, data: data };
      })

      .filter(item => item.id),
    // ... dependencies
  );

  // --- Rendering ---
  const handleRefresh = useCallback(() => {
    fetchInitialDataAndSetup();
  }, [fetchInitialDataAndSetup]);

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

  return (
    <View style={styles.container}>
      <Header />
      {/* <UpdateChecker /> */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
            title="Refreshing..."
          />}
          >

        <View style={styles.userInfo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{profileData?.Emp_Name || 'Guest'} 👋</Text>
            <Text style={styles.userHandle}>{profileData?.Organization_Unit_Name || ''}</Text>
          </View>

          {/* <View style={styles.changeOfficeContainer}>
            <TouchableOpacity
              style={styles.changeOfficeButton}
              onPress={openModal}
              accessibilityLabel="Change Office Button">
              <Text style={styles.changeOfficeButtonText}>Office's</Text>
              <Text style={styles.changeOfficeButtonText}>Change Office</Text>
            </TouchableOpacity>
          </View> */}
          
        </View>
        <View style={styles.topcard}>
          <Slider />
        </View>


        <View style={styles.topcard1}>
          {/* Dropdown Selectors */}
          <View style={styles.selectorContainer}>
            <Text style={styles.sectionTitle}>Faculty Dashboard</Text>

            <View style={styles.selectorContainercard}>
              <TouchableOpacity
                style={styles.ModelButton}
                onPress={openModalSession}
                accessibilityLabel="Select a Session">
                <Text style={styles.ModelText}> {SessionValue || 'Session'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ModelButton}
                onPress={openModalSemester}
                accessibilityLabel="Select a Semester">
                <Text style={styles.ModelText}>{SemesterValue || 'Semester'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Grid Menu */}
          <ScrollView horizontal={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.eCornerContainer}>
            <View style={styles.gridContainer}>
              {updatedMenu?.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate(item.screen, { data: item.data })}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={[styles.iconRectangle, { backgroundColor: item.color }]}>
                      <Text style={styles.cont}>{item.count}</Text>
                      <FontAwesome6 name={item.icon} size={28} color={item.iconColor || 'white'} />
                    </View>
                    <Text style={styles.iconLabel}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>


          {/* <Text style={styles.sectionTitle}>🎂 Today's Birthday</Text>
        <BirthdaySlider /> */}
        </View>


        {/* <View style={styles.topcard2}>
        <Text style={styles.sectionTitle}>Notification's</Text>
                <BirthdaySlider />  
        </View> */}

        {/*  officelist*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}>
          <OfficeListModalContent closeModal={closeModal} />
        </Modal>
        {/*  session*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisibleSession}
          onRequestClose={closeModalSession}>
          <SessionListModalContent closeModalSession={closeModalSession} />
        </Modal>
        {/*  Semester*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisibleSemester}
          onRequestClose={closeModalSemester}>
          <SemesterListModalContent closeModalSemester={closeModalSemester} />
        </Modal>
      </ScrollView>
      <Footer />
    </View>
  );
};


const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    elevation: 250,
    shadowColor: '#000000ff'
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalHeader: {
    marginTop: -15,
    width: 250,
    height: 50,
    margin: 10,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.footercolor
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background
    // marginBottom: 15,
    // backgroundColor:'red'
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  officeListScrollView: {
    maxHeight: 300,
    width: '100%',
    paddingHorizontal: 10,
  },
  officeListItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
    alignItems: 'center',
  },
  officeItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    marginBottom: 0
  },
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

  content: { flex: 1, padding: 15 },

  topcard: {
    // marginTop:15,
    padding: 15,
    // margin: -20,
    marginLeft: -25,
    marginRight: -25,
    // backgroundColor: '#f9e687ff',   
    marginVertical: 10,
    marginHorizontal: 10,
    borderStartWidth: 2,
    borderColor: 'red'
    // borderTopLeftRadius: 40,
    // borderTopRightRadius: 40,
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,

  },
  topcard1: {
    // padding: 15,
    // margin: -20,
    // marginRight: -25,
    // marginLeft: -15,
    // backgroundColor: colors.cardcolor,  
    // marginVertical: 10,
    // marginHorizontal: 10,
    // borderTopRightRadius: 10,
    // borderBottomLeftRadius: 1200,
    // borderBottomLeftRadius: 70,
    // borderTopLeftRadius: 100,
    // borderWidth:1.5,
    // borderColor:'#ffffffff'
  },
  topcard2: {
    // marginTop:5,
    // padding: 15,
    // margin: -20,
    // marginLeft: -25,
    // marginRight: -25,
    // backgroundColor: '#ffffffff',   
    // marginVertical: 10,
    // marginHorizontal: 10,
    // borderTopRightRadius: 100,
    // borderBottomRightRadius: 0,
  },

  userInfo: {
    // margin:10,
    padding: 15,
    // marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    // backgroundColor: '#BCCEF8',   
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff0000ff'
    // borderTopRightRadius: 100,
    // borderBottomRightRadius: 100,
  },

  userName: { fontWeight: 'bold', fontSize: 18, color: 'black' },
  userHandle: { color: 'gray', fontSize: 14 },
  sectionTitle: {
    color: colors.footercolor,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    margin: 5, 
  },

  cont: {
    fontWeight: 'bold',
  },
  iconRectangle: {
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 5,
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
    // elevation: 10,
    // backgroundColor: '#fff',
  },

  iconLabel: {
    fontSize: 14,
    color: '#003109ff',
    textAlign: 'center',
    marginBottom:15
  },

  eCornerContainer: {
    // backgroundColor:'#936a0aff',
  },

  gridContainer: {
    margin: 5,
    padding: 0,
    margin:10,
    backgroundColor: '#FAF7F0',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // borderRadius: 50,
    // justifyContent: 'flex-start',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    // borderBottomleftRadius: 1200,
    // borderWidth:1,
    // borderColor:'#009a98ff'
  },
  gridItem: {
    width: '25%',
    // marginBottom: 15,
    // borderRadius: 12,
  },

  changeOfficeContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  ModelButton: {
    backgroundColor: colors.dangerL,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginLeft: 10
  },
  ModelText: {
    fontSize: 16,
    color: colors.textPrimary
  },

  changeOfficeButton: {
    backgroundColor: '#85b004ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  changeOfficeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  selectorContainercard: {
    marginTop: -15,
    padding: 5,
    flexDirection: 'row',
    // backgroundColor: '#5522222c',
    marginRight: -20,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },

  selectorContainer: {
    flexDirection: 'row',
    padding: 5,
    // margin: 5,
    justifyContent: 'flex-end'
  },


});

export default AdminHomeLayout;

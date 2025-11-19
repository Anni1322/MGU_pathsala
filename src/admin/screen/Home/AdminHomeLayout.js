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
import DropdownSelector from '../../Other/DropdownSelector';
import UpdateChecker from "../../../common/UpdateChecker";

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
  // const [MyStudyMaterials, setMyStudyMaterials] = useState([]);  
  
  // Use a default session/semester from SessionService on initial load if possible
  const [selectedSession, setSelectedSession] = useState(STATIC_SESSION_DATA[0].key); 
  const [selectedSemester, setSelectedSemester] = useState(STATIC_SEMESTERS[0].key);
  const [EmpId, setEmpId] = useState(null);
   const [officeList, setOfficeList] = useState([]);

  // const [session, setSession] = useState([]); // Unused state
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);
 

  // --- Derived Data (Counts) ---
  const myStudentCount = useMemo(() =>
    MyStudent?.reduce((sum, item) => sum + Number(item.TotalStudents || 0), 0) || 0,
    [MyStudent]
  );

  const myCourseCount = useMemo(() =>
    MyCourse?.CourseCount?.[0]?.CourseCount || 0,
    [MyCourse]
  );

  // Simplified MyAssignmentCount calculation, assuming the structure is similar to MyCourse
  const MyAssignmentCount = useMemo(() =>
    MyAssignment?.CourseCount?.[0]?.CourseCount || 0,
    [MyAssignment]
  );


  // --- API Callbacks ---
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
  

  const handleSessionChange = useCallback((option) => setSelectedSession(option.key), []);
  const handleSemesterChange = useCallback((option) => setSelectedSemester(option.key), []);
  
  // --- Initial Data Fetch & Session Update ---
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
      console.log(sessionData?.LoginDetail,"office list")
      setOfficeList(sessionData?.LoginDetail)
      
      const sessionFromStorage = sessionData?.SelectedSession || STATIC_SESSION_DATA[0].key;
      const semesterFromStorage = sessionData?.SelectedSemester || STATIC_SEMESTERS[0].key;
      setSelectedSession(sessionFromStorage);
      setSelectedSemester(semesterFromStorage);
      
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
    console.log(office,"office list")
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
      <CustomSpinner size={50} color="rgba(255, 99, 71, 1)" type="dots" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  }


  // Placeholder for your office list/destination component
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
              onPress={() => onOfficeSelect(office)}  
            >
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

  return (
    <View style={styles.container}>
      <Header />
      <UpdateChecker />
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
      <View style={styles.topcard}>
        <View style={styles.userInfo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{profileData?.Emp_Name || 'Guest'} 👋</Text>
            <Text style={styles.userHandle}>{profileData?.Organization_Unit_Name || ''}</Text>
          </View>
          {/* <View style={styles.changeOfficeContainer}>
            <TouchableOpacity
              style={styles.changeOfficeButton}
              onPress={openModal}
              accessibilityLabel="Change Office Button"
            >
              <Text style={styles.changeOfficeButtonText}>Office's</Text>
              <Text style={styles.changeOfficeButtonText}>Change Office</Text>
            </TouchableOpacity>
          </View> */}
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}
          >
            <OfficeListModalContent closeModal={closeModal} />
          </Modal>
        </View>
        <Slider />
      </View>
       
        
        <View style={styles.topcard1}>
        {/* Dropdown Selectors */}
        <View style={styles.selectorContainer}>
         <Text style={styles.sectionTitle}>Faculty Dashboard</Text>
          <DropdownSelector
            data={STATIC_SESSION_DATA}
            initValue={STATIC_SESSION_DATA.find(item => item.key === selectedSession)?.label || "Select a Session"}
            onChange={handleSessionChange}
            style={styles.sessionDropdown}
            initValueTextStyle={styles.sessionDropdownText}
          />
          <DropdownSelector
            data={STATIC_SEMESTERS}
            initValue={STATIC_SEMESTERS.find(item => item.key === selectedSemester)?.label || "Select a Semester"}
            onChange={handleSemesterChange}
            style={styles.semesterDropdown}
          />
        </View>

                {/* Grid Menu */}
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.eCornerContainer}>
          <View style={styles.gridContainer}>
            {updatedMenu?.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={() => navigation.navigate(item.screen, { data: item.data })}
              >
                <View style={{ alignItems: 'center' }}>
                  <View style={[styles.iconRectangle, { backgroundColor: item.color }]}>
                    <Text style={styles.cont}>{item.count}</Text>
                    <FontAwesome6 name={item.icon} size={22} color="white" />
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
        


<View style={styles.topcard2}>
<Text style={styles.sectionTitle}>Notification's</Text>
        {/* <BirthdaySlider />   */}
</View>


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
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
  container: { flex: 1, backgroundColor: '#dfe0e5ff', marginBottom: 0 },
  
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
  marginTop:-15,
  padding: 15,
  // margin: -20,
  marginLeft: -25,
  marginRight: -25,
  backgroundColor: '#ffffffff',   
  marginVertical: 10,
  marginHorizontal: 10,
  borderBottomRightRadius: 10,
  borderBottomRightRadius: 90,
},
topcard1: {
  padding: 15,
  margin: -20,
  marginRight: -25,
  marginLeft: -15,
  backgroundColor: '#ffbda1ff',  
  marginVertical: 10,
  marginHorizontal: 10,
  borderTopRightRadius: 10,
  borderBottomLeftRadius: 1200,
  borderTopLeftRadius: 100,
},
topcard2: {
  marginTop:5,
  padding: 15,
  // margin: -20,
  marginLeft: -25,
  marginRight: -25,
  backgroundColor: '#ffffffff',   
  marginVertical: 10,
  marginHorizontal: 10,
  borderTopRightRadius: 100,
  borderBottomRightRadius: 0,
},

  userInfo: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: { fontWeight: 'bold', fontSize: 18, color: 'black' },
  userHandle: { color: 'gray', fontSize: 14 },
  
  sectionTitle: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    margin: 5
  },
  
  cont: {
    fontWeight: 'bold',
  },
  iconRectangle: {
    width: 85,
    height: 85,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: '#fff',
  },
  
  iconLabel: {
    fontSize: 13,
    color: '#003109ff',
    textAlign: 'center',
  },
  
  gridContainer: {
    margin:5,
    padding:20,
    backgroundColor:'#E7D4B5',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 50,
    justifyContent: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  borderBottomleftRadius: 1200,
  },
  gridItem: {
    width: '20%',
    marginBottom: 15,
    borderRadius: 12,
  },
  
  
  
  changeOfficeContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
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
  
  selectorContainer: {
    flexDirection: 'row', 
    padding: 5, 
    margin: 5,
    justifyContent:'flex-end'
  },
  sessionDropdown: {
    // backgroundColor: '#d5bdaf', 
    // borderRadius: 10, 
    // marginRight: 5
  },
  sessionDropdownText: {
    // fontSize: 18, 
    // color: '#2a9d8f'
  },
  semesterDropdown: {
    // backgroundColor: '#457b9d', 
    // borderRadius: 10, 
    marginRight: 5
  }
});

export default AdminHomeLayout;









































// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Modal } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { Menu, facultyMenu } from '../../config/Menu/MenuList';
// import Slider from '../../../student/layout/Sliders/Slider';
// import BirthdaySlider from '../../layout/Sliders/BirthdaySlider';
// import { API_BASE_URL } from '../../../common/config/BaseUrl';

// import getApiList from "../../config/Api/adminApiList";
// import Header from "../../layout/Header/Header";
// import Footer from "../../layout/Footer/Footer";

// import { HttpService } from "../../../common/Services/HttpService";
// import SessionService from '../../../common/Services/SessionService';
// import CustomSpinner from '../../../common/Services/alert/CustomSpinner';




// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Keychain from "react-native-keychain";

// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import DropdownSelector from '../../Other/DropdownSelector';
// import { RefreshControl } from "react-native";
// import UpdateChecker from "../../../common/UpdateChecker"

// // Memoized IconText component
// const IconText = React.memo(({ label, iconLib = 'MaterialIcons', iconName, iconSize = 25, color = 'green', }) => {
//   const IconComponent = useMemo(() => {
//     switch (iconLib) {
//       case 'EvilIcons':
//         return <EvilIcons name={iconName} size={iconSize} color={color} />;
//       case 'FontAwesome6':
//         return <FontAwesome6 name={iconName} size={iconSize} color={color} />;
//       default:
//         return <MaterialIcons name={iconName} size={iconSize} color={color} />;
//     }
//   }, [iconLib, iconName, iconSize, color]);

//   return (
//     <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
//       {IconComponent}
//       <Text style={{ color: 'navy', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
//         {label}
//       </Text>
//     </View>
//   );
// });



// const AdminHomeLayout = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [loading, setLoading] = useState(true);
//   const [profileData, setProfileData] = useState(null);
//   const [MyCourse, setMyCourse] = useState([]);
//   const [MyStudent, setStudent] = useState([]);
//   const [MyAssignment, setMyAssignment] = useState([]);
//   const [MyStudyMaterials, setMyStudyMaterials] = useState([]);

//   const [selectedSession, setSelectedSession] = useState(25);
//   const [selectedSemester, setSelectedSemester] = useState(1);
//   const [EmpId, setEmpId] = useState(null);

//   const [session, setSession] = useState([]);


//   // 1. Define state to manage Modal visibility
//   const [isModalVisible, setModalVisible] = useState(false);

//   // Function to open the modal
//   const openModal = () => setModalVisible(true);

//   // Function to close the modal
//   const closeModal = () => setModalVisible(false);


//   const semester = [
//     { key: 1, label: 'I Semester' },
//     { key: 2, label: 'II Semester' }
//   ];

//   const SessionData = [
//     { key: 25, label: '2025-26' },
//     { key: 24, label: '2024-25' },
//     { key: 23, label: '2023-24' },
//     { key: 22, label: '2022-23' },
//     { key: 21, label: '2021-22' },
//     { key: 20, label: '2020-21' },
//     { key: 19, label: '2019-20' },
//     { key: 18, label: '2018-19' },
//     { key: 17, label: '2017-18' },
//     { key: 16, label: '2016-17' },
//     { key: 15, label: '2015-16' },
//     { key: 14, label: '2014-15' },
//     { key: 13, label: '2013-14' }
//   ];

//   // Derived values using useMemo
//   const myStudentCount = useMemo(() =>
//     MyStudent?.reduce((sum, item) => sum + Number(item.TotalStudents || 0), 0),
//     [MyStudent]
//   );

//   const myCourseCount = useMemo(() =>
//     MyCourse?.CourseCount?.[0]?.CourseCount || 0,
//     [MyCourse]
//   );

//   const StudyMaterialsCount = useMemo(() =>
//     MyStudyMaterials?.CourseCount?.[0]?.CourseCount || 0,
//     [MyStudyMaterials]
//   );

//   const MyAssignmentCount = useMemo(() =>
//     MyAssignment?.CourseCount?.[0]?.CourseCount || 0,
//     [MyAssignment]
//   );


//   const updatedMenu = useMemo(() =>
//     facultyMenu?.map(item => {
//       switch (item.name) {
//         case 'My Courses':
//           return { ...item, count: myCourseCount, data: MyCourse };

//         case 'My Students':
//           return { ...item, count: myStudentCount, data: MyStudent, setSession: session };

//         case 'My Assignment':
//           return { ...item, count: MyAssignmentCount, data: MyAssignment, setSession: session };


//         // case 'Study Materials':
//         //   return { ...item, count: StudyMaterialsCount, data: MyStudyMaterials };

//         default:
//           return item;
//       }

//     }),
//     [facultyMenu, myCourseCount,
//       myStudentCount, StudyMaterialsCount, MyAssignmentCount,
//       MyCourse, MyStudent, MyAssignment, MyStudyMaterials,
//       session]
//   );





//   // Fetch profile details
//   const getProfileDetails = useCallback(async (payload) => {
//     try {
//       const profileApi = getApiList().profile;
//       if (!profileApi) throw new Error("Profile API endpoint not found.");
//       const response = await HttpService.post(profileApi, payload);
//       if (response?.status !== 200) throw new Error("Failed to fetch profile details.");
//       return response.data;
//     } catch (error) {
//       Alert.alert("Profile Fetch Failed", error?.message || "Something went wrong");
//       console.error("Profile fetch failed:", error);
//       return null;
//     }
//   }, []);

//   // Fetch student data
//   const fetchMystudents = useCallback(async () => {
//     try {
//       const DegreeTypeWiseStudentListApi = getApiList().getDegreeTypeWiseDashCount;
//       const payload = {
//         Academic_session: selectedSession,
//         Semester_Id: selectedSemester,
//         emp_id: EmpId
//       };
//       const response = await HttpService.get(DegreeTypeWiseStudentListApi, payload);
//       if (response?.status === 200) {
//         setStudent(response?.data?.DegreeTypeWiseStudentCount);
//       }
//     } catch (error) {
//       console.error("fetchMystudents failed:", error);
//     }
//   }, [EmpId, selectedSession, selectedSemester]);

//   // Fetch course data
//   const fetchMyCourses = useCallback(async () => {
//     try {
//       const payload = {
//         Semester_Id: selectedSemester,
//         Academic_session: selectedSession,
//         Emp_Id: EmpId,
//       };
//       const CourseWiseDashCountApi = getApiList().getCourseWiseDashCount;
//       const response = await HttpService.get(CourseWiseDashCountApi, payload);
//       if (response?.status === 200) {
//         setMyCourse(response.data);
//         myAssignment(response.data)
//       }
//     } catch (error) {
//       console.error("fetchMyCourses failed:", error);
//     }
//   }, [EmpId, selectedSession, selectedSemester]);


//   // set session for my assignment data
//   const myAssignment = (data) => {
//     // console.log(data,"myAssignment")
//     try {
//       const payload = {
//         Semester_Id: selectedSemester,
//         Academic_session: selectedSession,
//         Emp_Id: EmpId,
//         data: data
//       };
//       setMyAssignment(payload)
//     } catch (error) {
//       console.error("fetchMyCourses failed:", error);
//     }
//   };








//   // Handlers for dropdown changes
//   const handleSessionChange = (option) => setSelectedSession(option.key);
//   const handleSemesterChange = (option) => setSelectedSemester(option.key);

//   function alertshow() {
//     Alert.alert("Error", "Failed to load initial data.");
//   }

//   // Fetch initial data (EmpId and profile)
//   const fetchInitialData = async () => {
//     try {
//       setLoading(true);
//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       setEmpId(profile?.Emp_Id);
//       setProfileData(profile);
//     } catch (error) {
//       console.error("Error loading initial data:", error);
//       Alert.alert("Error", "Failed to load initial data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     const updateSessionAndRefresh = async () => {
//       try {
//         const currentSession = await SessionService.getSession();
//         if (!currentSession) return;
//         const updatedSession = {
//           ...currentSession,
//           SelectedSemester: selectedSemester,
//           SelectedSession: selectedSession,
//         };
//         await SessionService.saveSession(updatedSession);
//         const nowsession = await SessionService.getSession();
//         // console.log(nowsession, "nowsessionnowsession")
//         await fetchInitialData();
//       } catch (error) {
//         console.error("Failed to update session:", error);
//       }
//     };

//     if (selectedSemester && selectedSession) {
//       updateSessionAndRefresh();
//     }
//   }, [selectedSemester, selectedSession]);

//   useEffect(() => {
//     if (EmpId) {
//       const fetchData = async () => {
//         try {
//           setLoading(true);
//           await Promise.all([fetchMyCourses(), fetchMystudents()]);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//           Alert.alert("Error", "Failed to fetch student or course data.");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }
//   }, [selectedSession, selectedSemester, EmpId]);

//   if (loading) {
//     return <View style={styles.spinnerWithText}>
//       <CustomSpinner size={50} color="rgba(255, 99, 71, 1)" type="dots" />
//       <Text style={styles.text}>Loading...</Text>
//     </View>
//   }



//   // Placeholder for your office list/destination component
//   const OfficeListModalContent = () => (
//     <View style={modalStyles.centeredView}>
//       <View style={modalStyles.modalView}>
//         <Text style={modalStyles.modalTitle}>Select Destination/Office</Text>
//         <Text>Office 1: Main Campus</Text>
//         <Text>Office 2: Remote Hub</Text>
//         <Text>Office 3: HQ</Text>

//         <TouchableOpacity
//           style={modalStyles.closeButton}
//           onPress={closeModal}>
//           <Text style={modalStyles.textStyle}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );




//   return (
//     <View style={styles.container}>

//       <Header />
//       {/* <CustomSpinner size={50}  type="dots" text="Loading..." color="blue" thickness={4} /> */}
//       <UpdateChecker />
//       <ScrollView
//         style={styles.content}
//         refreshControl={
//           <RefreshControl
//             refreshing={loading}
//             onRefresh={() => { fetchInitialData(); if (EmpId) { fetchMyCourses(); fetchMystudents(); } }}
//             colors={["#007AFF"]}
//             tintColor="#007AFF"
//             title="Refreshing..."
//           />} >

//         <View style={styles.userInfo}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.userName}>{profileData?.Emp_Name} 👋</Text>
//             <Text style={styles.userHandle}>{profileData?.Organization_Unit_Name || ''}</Text>
//           </View>


//           {/* <View style={styles.changeOfficeContainer}>
          
//             <TouchableOpacity
//               style={styles.changeOfficeButton}   
//               onPress={() => {
//                       Alert.alert("Change Office","Are you sure you want to change your office?",
//                   [
//                     { text: "Cancel", style: "cancel" },
//                     {
//                       text: "OK", onPress: () => {
//                         // navigation.navigate('OfficeSelectionScreen');
//                         console.log("Office change initiated");
//                       }
//                     }
//                   ]
//                 );
//               }}
//               accessibilityLabel="Change Office Button" >
//               <Text style={styles.changeOfficeButtonText}>Change Office</Text>
//             </TouchableOpacity>

//           </View> */}



//           <View style={styles.userInfo}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.userName}>{profileData?.Emp_Name} 👋</Text>
//               <Text style={styles.userHandle}>{profileData?.Organization_Unit_Name || ''}</Text>
//             </View>
//             <View style={styles.changeOfficeContainer}>

//               <TouchableOpacity
//                 style={styles.changeOfficeButton}
//                 // 3. Change onPress to open the Modal
//                 onPress={openModal} // Changed from Alert.alert
//                 accessibilityLabel="Change Office Button"
//               >
//                 <Text style={styles.changeOfficeButtonText}>Change Office</Text>
//               </TouchableOpacity>

//             </View>

//             {/* 4. Add the Modal component */}
//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={isModalVisible}
//               onRequestClose={closeModal}
//             >
//               <OfficeListModalContent />
//             </Modal>

//           </View>




//         </View>

//         <Slider />

//         <Text style={styles.sectionTitle}>Faculty</Text>

//         <View style={{ flexDirection: 'row', padding: 5, margin: 5 }}>
//           <DropdownSelector
//             data={SessionData}
//             initValue={SessionData.find(item => item.key === selectedSession)?.label || "Select a Session"}
//             onChange={handleSessionChange}
//             style={{ backgroundColor: '#d5bdaf', borderRadius: 10, marginRight: 5 }}
//             initValueTextStyle={{ fontSize: 18, color: '#2a9d8f' }}
//           />
//           <DropdownSelector
//             data={semester}
//             initValue={semester.find(item => item.key === selectedSemester)?.label || "Select a Semester"}
//             onChange={handleSemesterChange}
//             style={{ backgroundColor: '#457b9d', borderRadius: 10, marginRight: 5 }}
//           />
//         </View>
//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.eCornerContainer}>
//           <View style={styles.gridContainer}>
//             {updatedMenu.map(item => (
//               <TouchableOpacity key={item.id} style={styles.gridItem} onPress={() => navigation.navigate(item.screen, { data: item.data })}>
//                 <View style={{ alignItems: 'center' }}>
//                   <View style={[styles.iconRectangle, { backgroundColor: item.color }]}>
//                     <Text style={styles.cont}>{item.count}</Text>
//                     <FontAwesome6 name={item.icon} size={22} color="white" />
//                   </View>
//                   <Text style={styles.iconLabel}>{item.name}</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </ScrollView>
//         <Text style={styles.sectionTitle}>🎂 Today's Birthday</Text>
//         <BirthdaySlider />
//       </ScrollView>
//       <Footer />
//     </View>
//   );

// };






// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#EAEBF0', marginBottom: 0 },

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
//   userInfo: {
//     marginLeft: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
//   userName: { fontWeight: 'bold', fontSize: 18, color: 'black' },
//   userHandle: { color: 'gray', fontSize: 14 },
//   greeting: { color: 'darkred', fontWeight: '600' },

//   sectionTitle: {
//     color: 'green',
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 8,
//     marginTop: 8,
//     margin: 5
//   },

//   iconCircle: {
//     backgroundColor: '#006d33ff',
//     width: 50,
//     height: 50,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   cont: {
//     fontWeight: 'bold',
//   },
//   iconRectangle: {
//     width: 65,
//     height: 70,
//     borderRadius: 17,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 5,

//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 10,
//     backgroundColor: '#fff',
//   },

//   iconLabel: {
//     fontSize: 13,
//     color: '#003109ff',
//     textAlign: 'center',
//   },

//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     borderRadius: 20,
//     justifyContent: 'space-around',
//     justifyContent: 'flex-start',
//     // width:20,
//     // height:30
//   },
//   gridItem: {
//     width: '25%',
//     marginBottom: 15,
//     borderRadius: 12,


//   },



//   changeOfficeContainer: {
//     justifyContent: 'center',
//     alignItems: 'flex-end',
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










//   // for office
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: '80%', // Adjust as needed
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
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
//   }


// });

// export default AdminHomeLayout;






































// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Modal } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { Menu, facultyMenu } from '../../config/Menu/MenuList';
// import Slider from '../../../student/layout/Sliders/Slider';
// import BirthdaySlider from '../../layout/Sliders/BirthdaySlider';
// import { API_BASE_URL } from '../../../common/config/BaseUrl';

// import getApiList from "../../config/Api/adminApiList";
// import Header from "../../layout/Header/Header";
// import Footer from "../../layout/Footer/Footer";

// import { HttpService } from "../../../common/Services/HttpService";
// import SessionService from '../../../common/Services/SessionService';
// import CustomSpinner from '../../../common/Services/alert/CustomSpinner';

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Keychain from "react-native-keychain";

// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import DropdownSelector from '../../Other/DropdownSelector';
// import { RefreshControl } from "react-native";
// import UpdateChecker from "../../../common/UpdateChecker"

// // Memoized IconText component
// const IconText = React.memo(({ label, iconLib = 'MaterialIcons', iconName, iconSize = 25, color = 'green', }) => {
//   const IconComponent = useMemo(() => {
//     switch (iconLib) {
//       case 'EvilIcons':
//         return <EvilIcons name={iconName} size={iconSize} color={color} />;
//       case 'FontAwesome6':
//         return <FontAwesome6 name={iconName} size={iconSize} color={color} />;
//       default:
//         return <MaterialIcons name={iconName} size={iconSize} color={color} />;
//     }
//   }, [iconLib, iconName, iconSize, color]);

//   return (
//     <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
//       {IconComponent}
//       <Text style={{ color: 'navy', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
//         {label}
//       </Text>
//     </View>
//   );
// });



// const AdminHomeLayout = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [loading, setLoading] = useState(true);
//   const [profileData, setProfileData] = useState(null);
//   const [MyCourse, setMyCourse] = useState([]);
//   const [MyStudent, setStudent] = useState([]);
//   const [MyAssignment, setMyAssignment] = useState([]);
//   const [MyStudyMaterials, setMyStudyMaterials] = useState([]);

//   const [selectedSession, setSelectedSession] = useState(25);
//   const [selectedSemester, setSelectedSemester] = useState(1);
//   const [EmpId, setEmpId] = useState(null);

//   const [session, setSession] = useState([]);


//   // 1. Define state to manage Modal visibility
//   const [isModalVisible, setModalVisible] = useState(false);

//   // Function to open the modal
//   const openModal = () => setModalVisible(true);

//   // Function to close the modal
//   const closeModal = () => setModalVisible(false);


//   const semester = [
//     { key: 1, label: 'I Semester' },
//     { key: 2, label: 'II Semester' }
//   ];

//   const SessionData = [
//     { key: 25, label: '2025-26' },
//     { key: 24, label: '2024-25' },
//     { key: 23, label: '2023-24' },
//     { key: 22, label: '2022-23' },
//     { key: 21, label: '2021-22' },
//     { key: 20, label: '2020-21' },
//     { key: 19, label: '2019-20' },
//     { key: 18, label: '2018-19' },
//     { key: 17, label: '2017-18' },
//     { key: 16, label: '2016-17' },
//     { key: 15, label: '2015-16' },
//     { key: 14, label: '2014-15' },
//     { key: 13, label: '2013-14' }
//   ];

//   // Derived values using useMemo
//   const myStudentCount = useMemo(() =>
//     MyStudent?.reduce((sum, item) => sum + Number(item.TotalStudents || 0), 0),
//     [MyStudent]
//   );

//   const myCourseCount = useMemo(() =>
//     MyCourse?.CourseCount?.[0]?.CourseCount || 0,
//     [MyCourse]
//   );

//   const StudyMaterialsCount = useMemo(() =>
//     MyStudyMaterials?.CourseCount?.[0]?.CourseCount || 0,
//     [MyStudyMaterials]
//   );

//   const MyAssignmentCount = useMemo(() =>
//     MyAssignment?.CourseCount?.[0]?.CourseCount || 0,
//     [MyAssignment]
//   );


//   const updatedMenu = useMemo(() =>
//     facultyMenu?.map(item => {
//       switch (item.name) {
//         case 'My Courses':
//           return { ...item, count: myCourseCount, data: MyCourse };

//         case 'My Students':
//           return { ...item, count: myStudentCount, data: MyStudent, setSession: session };

//         case 'My Assignment':
//           return { ...item, count: MyAssignmentCount, data: MyAssignment, setSession: session };


//         // case 'Study Materials':
//         //   return { ...item, count: StudyMaterialsCount, data: MyStudyMaterials };

//         default:
//           return item;
//       }

//     }),
//     [facultyMenu, myCourseCount,
//       myStudentCount, StudyMaterialsCount, MyAssignmentCount,
//       MyCourse, MyStudent, MyAssignment, MyStudyMaterials,
//       session]
//   );

//   // Fetch profile details
//   const getProfileDetails = useCallback(async (payload) => {
//     try {
//       const profileApi = getApiList().profile;
//       if (!profileApi) throw new Error("Profile API endpoint not found.");
//       const response = await HttpService.post(profileApi, payload);
//       if (response?.status !== 200) throw new Error("Failed to fetch profile details.");
//       return response.data;
//     } catch (error) {
//       Alert.alert("Profile Fetch Failed", error?.message || "Something went wrong");
//       console.error("Profile fetch failed:", error);
//       return null;
//     }
//   }, []);

//   // Fetch student data
//   const fetchMystudents = useCallback(async () => {
//     try {
//       const DegreeTypeWiseStudentListApi = getApiList().getDegreeTypeWiseDashCount;
//       const payload = {
//         Academic_session: selectedSession,
//         Semester_Id: selectedSemester,
//         emp_id: EmpId
//       };
//       const response = await HttpService.get(DegreeTypeWiseStudentListApi, payload);
//       if (response?.status === 200) {
//         setStudent(response?.data?.DegreeTypeWiseStudentCount);
//       }
//     } catch (error) {
//       console.error("fetchMystudents failed:", error);
//     }
//   }, [EmpId, selectedSession, selectedSemester]);

//   // Fetch course data
//   const fetchMyCourses = useCallback(async () => {
//     try {
//       const payload = {
//         Semester_Id: selectedSemester,
//         Academic_session: selectedSession,
//         Emp_Id: EmpId,
//       };
//       const CourseWiseDashCountApi = getApiList().getCourseWiseDashCount;
//       const response = await HttpService.get(CourseWiseDashCountApi, payload);
//       if (response?.status === 200) {
//         setMyCourse(response.data);
//         myAssignment(response.data)
//       }
//     } catch (error) {
//       console.error("fetchMyCourses failed:", error);
//     }
//   }, [EmpId, selectedSession, selectedSemester]);


//   // set session for my assignment data
//   const myAssignment = (data) => {
//     // console.log(data,"myAssignment")
//     try {
//       const payload = {
//         Semester_Id: selectedSemester,
//         Academic_session: selectedSession,
//         Emp_Id: EmpId,
//         data: data
//       };
//       setMyAssignment(payload)
//     } catch (error) {
//       console.error("fetchMyCourses failed:", error);
//     }
//   };

//   // Handlers for dropdown changes
//   const handleSessionChange = (option) => setSelectedSession(option.key);
//   const handleSemesterChange = (option) => setSelectedSemester(option.key);

//   function alertshow() {
//     Alert.alert("Error", "Failed to load initial data.");
//   }

//   // Fetch initial data (EmpId and profile)
//   const fetchInitialData = async () => {
//     try {
//       setLoading(true);
//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       setEmpId(profile?.Emp_Id);
//       setProfileData(profile);
//     } catch (error) {
//       console.error("Error loading initial data:", error);
//       Alert.alert("Error", "Failed to load initial data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     const updateSessionAndRefresh = async () => {
//       try {
//         const currentSession = await SessionService.getSession();
//         if (!currentSession) return;
//         const updatedSession = {
//           ...currentSession,
//           SelectedSemester: selectedSemester,
//           SelectedSession: selectedSession,
//         };
//         await SessionService.saveSession(updatedSession);
//         const nowsession = await SessionService.getSession();
//         // console.log(nowsession, "nowsessionnowsession")
//         await fetchInitialData();
//       } catch (error) {
//         console.error("Failed to update session:", error);
//       }
//     };

//     if (selectedSemester && selectedSession) {
//       updateSessionAndRefresh();
//     }
//   }, [selectedSemester, selectedSession]);

//   useEffect(() => {
//     if (EmpId) {
//       const fetchData = async () => {
//         try {
//           setLoading(true);
//           await Promise.all([fetchMyCourses(), fetchMystudents()]);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//           Alert.alert("Error", "Failed to fetch student or course data.");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }
//   }, [selectedSession, selectedSemester, EmpId]);

//   if (loading) {
//     return <View style={styles.spinnerWithText}>
//       <CustomSpinner size={50} color="rgba(255, 99, 71, 1)" type="dots" />
//       <Text style={styles.text}>Loading...</Text>
//     </View>
//   }



//   // Placeholder for your office list/destination component
//   const OfficeListModalContent = () => (
//     <View style={modalStyles.centeredView}>
//       <View style={modalStyles.modalView}>
//         <Text style={modalStyles.modalTitle}>Select Destination/Office</Text>
//         <Text>Office 1: Main Campus</Text>
//         <Text>Office 2: Remote Hub</Text>
//         <Text>Office 3: HQ</Text>

//         <TouchableOpacity
//           style={modalStyles.closeButton}
//           onPress={closeModal}>
//           <Text style={modalStyles.textStyle}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>

//       <Header />
//       {/* <CustomSpinner size={50}  type="dots" text="Loading..." color="blue" thickness={4} /> */}
//       <UpdateChecker />
//       <ScrollView
//         style={styles.content}
//         refreshControl={
//           <RefreshControl
//             refreshing={loading}
//             onRefresh={() => { fetchInitialData(); if (EmpId) { fetchMyCourses(); fetchMystudents(); } }}
//             colors={["#007AFF"]}
//             tintColor="#007AFF"
//             title="Refreshing..."
//           />} >

//         <View style={styles.userInfo}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.userName}>{profileData?.Emp_Name} 👋</Text>
//             <Text style={styles.userHandle}>{profileData?.Organization_Unit_Name || ''}</Text>
//           </View>

//           <View style={styles.userInfo}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.userName}>{profileData?.Emp_Name} 👋</Text>
//               <Text style={styles.userHandle}>{profileData?.Organization_Unit_Name || ''}</Text>
//             </View>
//             <View style={styles.changeOfficeContainer}>

//               <TouchableOpacity
//                 style={styles.changeOfficeButton}
//                 // 3. Change onPress to open the Modal
//                 onPress={openModal} // Changed from Alert.alert
//                 accessibilityLabel="Change Office Button"
//               >
//                 <Text style={styles.changeOfficeButtonText}>Change Office</Text>
//               </TouchableOpacity>

//             </View>

//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={isModalVisible}
//               onRequestClose={closeModal}
//             >
//               <OfficeListModalContent />
//             </Modal>
//           </View>
//         </View>

//         <Slider />

//         <Text style={styles.sectionTitle}>Faculty</Text>

//         <View style={{ flexDirection: 'row', padding: 5, margin: 5 }}>
//           <DropdownSelector
//             data={SessionData}
//             initValue={SessionData.find(item => item.key === selectedSession)?.label || "Select a Session"}
//             onChange={handleSessionChange}
//             style={{ backgroundColor: '#d5bdaf', borderRadius: 10, marginRight: 5 }}
//             initValueTextStyle={{ fontSize: 18, color: '#2a9d8f' }}
//           />
//           <DropdownSelector
//             data={semester}
//             initValue={semester.find(item => item.key === selectedSemester)?.label || "Select a Semester"}
//             onChange={handleSemesterChange}
//             style={{ backgroundColor: '#457b9d', borderRadius: 10, marginRight: 5 }}
//           />
//         </View>
//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.eCornerContainer}>
//           <View style={styles.gridContainer}>
//             {updatedMenu.map(item => (
//               <TouchableOpacity key={item.id} style={styles.gridItem} onPress={() => navigation.navigate(item.screen, { data: item.data })}>
//                 <View style={{ alignItems: 'center' }}>
//                   <View style={[styles.iconRectangle, { backgroundColor: item.color }]}>
//                     <Text style={styles.cont}>{item.count}</Text>
//                     <FontAwesome6 name={item.icon} size={22} color="white" />
//                   </View>
//                   <Text style={styles.iconLabel}>{item.name}</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </ScrollView>
//         <Text style={styles.sectionTitle}>🎂 Today's Birthday</Text>
//         <BirthdaySlider />
//       </ScrollView>
//       <Footer />
//     </View>
//   );

// };






// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#EAEBF0', marginBottom: 0 },

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
//   userInfo: {
//     marginLeft: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
//   userName: { fontWeight: 'bold', fontSize: 18, color: 'black' },
//   userHandle: { color: 'gray', fontSize: 14 },
//   greeting: { color: 'darkred', fontWeight: '600' },

//   sectionTitle: {
//     color: 'green',
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 8,
//     marginTop: 8,
//     margin: 5
//   },

//   iconCircle: {
//     backgroundColor: '#006d33ff',
//     width: 50,
//     height: 50,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   cont: {
//     fontWeight: 'bold',
//   },
//   iconRectangle: {
//     width: 65,
//     height: 70,
//     borderRadius: 17,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 5,

//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 10,
//     backgroundColor: '#fff',
//   },

//   iconLabel: {
//     fontSize: 13,
//     color: '#003109ff',
//     textAlign: 'center',
//   },

//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     borderRadius: 20,
//     justifyContent: 'space-around',
//     justifyContent: 'flex-start',
//     // width:20,
//     // height:30
//   },
//   gridItem: {
//     width: '25%',
//     marginBottom: 15,
//     borderRadius: 12,


//   },



//   changeOfficeContainer: {
//     justifyContent: 'center',
//     alignItems: 'flex-end',
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


//   // for office
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: '80%', // Adjust as needed
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
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
//   }


// });

// export default AdminHomeLayout;













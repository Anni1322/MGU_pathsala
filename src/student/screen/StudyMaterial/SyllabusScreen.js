import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Dimensions, SafeAreaView 
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

// Services & Components
import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import { HttpService } from "../../../common/Services/HttpService";
import SessionService from '../../../common/Services/SessionService';
import colors from '../../../common/config/colors';

const { width } = Dimensions.get('window');

const SyllabusScreen = () => {
  const [years, setYears] = useState([]);
  const [semesters, setsemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [loading, setLoading] = useState(true);
  const [fetchingCourses, setFetchingCourses] = useState(false);

  const navigation = useNavigation();

  const fetchSession = async (year, semester) => {
    if (!year || !semester) return;
    setFetchingCourses(true);
    try {
      const apiList = getApiList();
      const sessionData = await SessionService.getSession();
      const payload = {
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        STUDENT_ID: sessionData?.STUDENT_ID,
        Courser_Year_Id: year,
        Semester_Id: semester,
      };
      const response = await HttpService.post(apiList?.GetCoursesSyllabus, payload);
      setCourses(response?.data?.CourseList || []);
    } catch (error) {
      setCourses([]);
    } finally {
      setFetchingCourses(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const apiList = getApiList();
      try {
        const sessionData = await SessionService.getSession();
        const payload = {
          LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
          STUDENT_ID: sessionData?.[0]?.STUDENT_ID
        };
        const response = await HttpService.post(apiList?.getAllCourseYearForStudentToApp, payload);
        const rawList = response?.data?.CourseYearResponse?.CourseYearList || [];
        const transformedYears = rawList?.map(item => ({ label: item.Name, value: item.Id }));
        
        setYears(transformedYears);
        setsemesters([
          { label: "I Semester", value: "1" },
          { label: "II Semester", value: "2" }
        ]);

        if (transformedYears.length > 0) {
          const initialYear = transformedYears[0].value;
          setSelectedYear(initialYear);
          fetchSession(initialYear, '1');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  const renderDropdownItem = (item) => (
    <View style={styles.dropdownItem}>
      <Text style={styles.dropdownItemText}>{item.label}</Text>
      {item.value === (selectedYear || selectedSemester) && (
        <FontAwesome6 name="check" size={12} color={colors.bgcolor} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.mainContainer}>
        
        {/* Selection Header Card */}
        <View style={styles.selectionCard}>
          <Text style={styles.selectionHeaderTitle}>Curriculum Filter</Text>
          <View style={styles.dropdownRow}>
            <View style={styles.dropdownWrapper}>
              <Text style={styles.inputLabel}>Academic Year</Text>
              <Dropdown
                style={styles.dropdownBox}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={years}
                labelField="label"
                valueField="value"
                placeholder="Select Year"
                value={selectedYear}
                renderItem={renderDropdownItem}
                onChange={item => {
                  setSelectedYear(item.value);
                  fetchSession(item.value, selectedSemester);
                }}
              />
            </View>

            <View style={styles.dropdownWrapper}>
              <Text style={styles.inputLabel}>Semester</Text>
              <Dropdown
                style={styles.dropdownBox}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={semesters}
                labelField="label"
                valueField="value"
                placeholder="Select Sem"
                value={selectedSemester}
                renderItem={renderDropdownItem}
                onChange={item => {
                  setSelectedSemester(item.value);
                  fetchSession(selectedYear, item.value);
                }}
              />
            </View>
          </View>
        </View>

        {/* Content Section */}
        {loading || fetchingCourses ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.bgcolor} />
            <Text style={styles.loaderText}>Loading Curriculum...</Text>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {courses.length > 0 ? (
              courses.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={styles.courseCard}
                  onPress={() => navigation.navigate('Chapter', { courseId: item.Course_Id })}
                >
                  <View style={styles.accentBar} />
                  <View style={styles.courseIconContainer}>
                    <FontAwesome6 name="book-bookmark" size={18} color={colors.bgcolor} />
                  </View>
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle} numberOfLines={2}>{item.Course_Title_E}</Text>
                    <View style={styles.courseMeta}>
                      <View style={styles.codeBadge}>
                        <Text style={styles.codeText}>{item.Course_Code}</Text>
                      </View>
                    </View>
                  </View>
                  <FontAwesome6 name="chevron-right" size={12} color="#CCC" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <FontAwesome6 name="folder-open" size={50} color="#DDD" />
                <Text style={styles.emptyText}>No syllabus found for this selection.</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  selectionCard: {
    backgroundColor: colors.bgcolor,
    borderRadius: 20,
    padding: 16,
    marginTop: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  selectionHeaderTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownWrapper: {
    flex: 0.48,
  },
  inputLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '600',
  },
  dropdownBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    height: 45,
    paddingHorizontal: 12,
  },
  placeholderStyle: { fontSize: 13, color: '#999' },
  selectedTextStyle: { fontSize: 13, fontWeight: '700', color: colors.bgcolor },
  
  // Course List Styling
  scrollContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  courseCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 15,
    bottom: 15,
    width: 4,
    backgroundColor: colors.bgcolor,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  courseIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
    paddingRight: 8,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  codeBadge: {
    backgroundColor: '#F1F2F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  codeText: {
    fontSize: 11,
    color: '#636E72',
    fontWeight: '700',
  },
  
  // Loader & Empty States
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#A0A0A0',
    fontSize: 14,
  },
  dropdownItem: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  }
});

export default SyllabusScreen;















// import React, { useState, useEffect } from 'react';
// import { View, Text, Alert, TextInput, StyleSheet, ScrollView, Switch, TouchableOpacity, ActivityIndicator, } from 'react-native';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import { Dropdown } from 'react-native-element-dropdown';
// import { useNavigation } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import alertService from '../../../common/Services/alert/AlertService';
// import Apiservice from "../../../common/Services/ApiService";
// // import requestAndroidPermission from "../../../common/Services/requestStoragePermission"
// import getApiList from "../../config/Api/ApiList";
// import Header from "../../layout/Header/Header2";
// import Footer from "../../layout/Footer/Footer";
// import { HttpService } from "../../../common/Services/HttpService";
// import SessionService from '../../../common/Services/SessionService';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import colors from '../../../common/config/colors';

// const SyllabusScreen = () => {
//   const [years, setYears] = useState([]);
//   const [semesters, setsemesters] = useState([]);
//   const [courses, setCourses] = useState([]);

//   const [isEnabled, setIsEnabled] = useState(true);
//   const [selectedYear, setSelectedYear] = useState('1');
//   const [selectedSemester, setSelectedSemester] = useState('1');

//   const [loading, setLoading] = useState(true);

//   const insets = useSafeAreaInsets();
//   const toggleSwitch = () => setIsEnabled((prev) => !prev);
//   const navigation = useNavigation();

//   const fetchSession = async (year, semester) => {
//     if (!year || !semester) {
//       // console.log("Year or Semester not selected. Skipping API call.");
//       return;
//     }
//     setLoading(true);  
//     const apiList = getApiList();
//     const sessionData = await SessionService.getSession();
//     // console.log(sessionData,"sessionData")

//     const payload = {
//       LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
//       STUDENT_ID: sessionData?.STUDENT_ID,
//       Courser_Year_Id: year,
//       Semester_Id: semester,
//     };
//     const courseApi = apiList?.GetCoursesSyllabus;
//     try {
//       const courseResponse = await HttpService.post(courseApi, payload);
//       // const courseResponse = await Apiservice.request({ endpoint: courseApi, payload, method: 'POST',});
//       setCourses(courseResponse?.data?.CourseList || []);
//       setLoading(false);  
//     } catch (error) {
//       console.error('Failed to load profile:', error);
//       setCourses([]);  
//       setLoading(false); 
//     }
//   };

//   useEffect(() => {
//     const apiList = getApiList();
//     const sessionData = SessionService.getSession();
//     const courseList = async () => {
//       const sessionData = await SessionService.getSession();
//       const CourseYearApi = apiList?.getAllCourseYearForStudentToApp;
//       try {
//         const payload = {
//           LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
//           STUDENT_ID: sessionData?.[0]?.STUDENT_ID
//         };
//         const Response = await HttpService.post(CourseYearApi, payload);
//         const rawList = Response?.data?.CourseYearResponse?.CourseYearList || [];
//         const transformed = rawList?.map(item => ({
//           label: item.Name,
//           value: item.Id,
//         }));
//         setYears(transformed);
//         if (transformed.length > 0) {
//           setSelectedYear(transformed[0].value);
//           fetchSession(transformed[0].value, selectedSemester);
//         }
//         setLoading(false);  
//       } catch (error) {
//         console.error('Failed to load profile:', error);
//         setLoading(false);
//       }
//     };
//     const semesterlist = async () => {
//       try {
//         const semesters = [
//           { "Id": "1", "Name": "I Semester" },
//           { "Id": "2", "Name": "II Semester" }
//         ];
//         const transformed = semesters?.map(item => ({
//           label: item.Name,
//           value: item.Id,
//         }));
//         setsemesters(transformed);
//         setLoading(false);  
//       } catch (error) {
//         console.error('Failed to load profile:', error);
//         setLoading(false);
//       }
//     };
//     courseList();
//     semesterlist();
//   }, []);

//   const renderDropdownItem = (item) => (
//     <View style={styles.item}>
//       <FontAwesome6
//         name={item.icon}
//         size={16}
//         color="#006d33ff"
//         style={{ marginRight: 10 }}
//       />
//       <Text style={styles.itemText}>{item.label}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={{ flex: 1 }}>
//         <Header />
//         <View style={[styles.container, { flex: 1 }]}>
//           <View style={styles.dropdownRow}>
//             <View style={styles.dropdown}>
//               <Text style={styles.dropdownLabel}>Course Year</Text>
//               <Dropdown
//                 style={[
//                   styles.dropdownBox,
//                   selectedYear && { borderColor: '#006d33ff', backgroundColor: '#f9f5ff' },
//                 ]}
//                 containerStyle={styles.dropdownContainer}
//                 placeholderStyle={styles.placeholderStyle}
//                 selectedTextStyle={styles.selectedTextStyle}
//                 itemTextStyle={styles.itemText}
//                 iconStyle={styles.iconStyle}
//                 data={years}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="Select Year"
//                 value={selectedYear}
//                 onChange={item => {
//                   setSelectedYear(item.value);
//                   setSelectedSemester('1');  
//                   setCourses([]);
//                   fetchSession(item.value, '1');
//                 }}
//                 maxHeight={200}
//                 renderItem={renderDropdownItem}
//                 activeColor="#ede7f6"
//                 dropdownPosition="bottom"
//               />
//             </View>

//             <View style={styles.dropdown}>
//               <Text style={styles.dropdownLabel}>Semester</Text>
//               <Dropdown
//                 style={[
//                   styles.dropdownBox,
//                   selectedSemester && { borderColor: '#006d33ff', backgroundColor: '#f9f5ff' },
//                 ]}
//                 containerStyle={styles.dropdownContainer}
//                 placeholderStyle={styles.placeholderStyle}
//                 selectedTextStyle={styles.selectedTextStyle}
//                 itemTextStyle={styles.itemText}
//                 iconStyle={styles.iconStyle}
//                 data={semesters}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="Select Sem"
//                 value={selectedSemester}
//                 onChange={item => {
//                   setSelectedSemester(item.value);
//                   if (selectedYear) { fetchSession(selectedYear, item.value); }
//                 }}
//                 maxHeight={200}
//                 renderItem={renderDropdownItem}
//                 activeColor="#ede7f6"
//                 dropdownPosition="bottom"
//               />
//             </View>
//           </View>
//           {loading || courses.length === 0 ? (
//             <ActivityIndicator size="large" color="#1e90ff" />
//           ) : (
//             <ScrollView
//               contentContainerStyle={{ paddingBottom: 20 }}
//               showsVerticalScrollIndicator={true}
//               scrollEventThrottle={16}
//               style={{ flexGrow: 1 }}
//             >
//               <View style={styles.list}>
//                 {courses?.map((item, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     onPress={() => navigation.navigate('Chapter', { courseId: item.Course_Id })}
//                   >
//                     <View style={styles.card}>
//                       <View style={styles.iconBox}>
//                         <FontAwesome6 name="book" size={22} color="#FF6868" />
//                       </View>
//                       <View style={styles.textContainer}>
//                         <Text style={styles.title}>{item.Course_Title_E}</Text>
//                         <Text style={styles.subtitle}>{item.Course_Code}</Text>
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </ScrollView>
//           )}
//         </View>
//       </View>
//       <Footer />
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   body: {
//     flex: 1,
//     backgroundColor: '#FAF1E6',
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   list: {
//     marginTop: 10,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFC785',
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#ffffffff',
//     padding: 10,
//     margin: 15,
//     marginBottom: 5,
//   },
//   iconBox: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     backgroundColor: '#FFFBF5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   textContainer: {
//     flex: 1,
//     marginBottom: 20,
//     paddingLeft: 4,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#9d2e08ff',
//   },
//   subtitle: {
//     fontSize: 13,
//     color: '#0a1f92ff',
//   },
//   dropdownRow: {
//     // flexWrap: 'wrap',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 5,
//     height: 120,
//     padding: 10,
//     backgroundColor:colors.bgcolor,
//     borderRadius:10
//   },
//   dropdown: {
//     flex: 1,
//     marginHorizontal: 5,
//     marginBottom: 10,
//     borderRadius: 12,
//     padding: 2,
//   },
//   dropdownLabel: {
//     fontSize: 14,
//     marginBottom: 5,
//     color: colors.background,
//    marginLeft:30
//   },
//   dropdownBox: {
//     borderWidth: 1,
//     borderColor: colors.bgcolor,
//     borderRadius: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 14,
//     // backgroundColor: '#fc0000ff',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   placeholderStyle: {
//     fontSize: 15,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.dangerD,
//   },
//   iconStyle: {
//     width: 22,
//     height: 22,
//     tintColor: '#748E63',
//   },
//   item: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomColor: '#eee',
//     borderBottomWidth: 1,
//   },
//   itemText: {
//     fontSize: 15,
//     color: '#748E63',
//   },
// });

// export default SyllabusScreen;

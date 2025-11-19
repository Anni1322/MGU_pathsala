import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import Header from '../../layout/Header/Header2';
import FooterNav from '../../layout/Footer/Footer';
import SessionService from '../../../common/Services/SessionService';
import getApiList from '../../config/Api/ApiList';
import { HttpService } from '../../../common/Services/HttpService';

const StudyMaterialItem = React.memo(({ item, navigation, expanded, onToggle, chapters, isLoadingChapters, onChapterPress }) => {
    const buttonText = expanded ? 'Hide Chapters' : 'View Materials';
    
    return (
 
        <View style={styles.itemContainer}>
            <Text style={styles.courseTitle}>{item.Course_Title}</Text>
            <Text style={styles.courseCode}>Course Code: {item.Course_Code}</Text>
            <View style={styles.footerRow}>
                <Text style={styles.materialCount}>
                    Materials Available: 👉🏻  {item.Material_count}
                </Text>
                <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={onToggle}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
            {expanded && (
                <View style={styles.expandedContainer}>
                    {isLoadingChapters ? (
                        <ActivityIndicator size="small" color="#1a478b" />
                    ) : chapters && chapters.length > 0 ? (
                        <FlatList
                            data={chapters}
                            keyExtractor={(chap) => chap.Id.toString()}
                            renderItem={({ item: chap }) => (
                                <TouchableOpacity 
                                    style={styles.chapterItem}
                                    onPress={() => onChapterPress(chap)}>
                                    <Text style={styles.chapterTitle}>{chap.Name}</Text>
                                    <Text style={styles.chapterCount}>Materials: {chap.Material_Count}</Text>
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={styles.chaptersList}
                            // Optimize: Add initialNumToRender and windowSize for large lists
                            initialNumToRender={10}
                            windowSize={5}
                        />
                    ) : (
                        <Text style={styles.noChaptersText}>No chapters available.</Text>
                    )}
                </View>
            )}
        </View>
        
    );
});

const StudyScreen = ({ navigation }) => {
    // Combine related states into a single object to reduce setState calls and improve performance
    const [state, setState] = useState({
        studyMaterials: [],
        isLoading: true,
        hasError: false,
        expandedItems: {},  
        chaptersData: {},  
        loadingChapters: {},  
        modalVisible: false,
        selectedChapter: null,
        employeeData: [],
        isLoadingEmployees: false,
        courseIdForCollege: null,  // Renamed for clarity
    });

    // Use useMemo to derive computed values without recalculating on every render
    const materialCount = useMemo(() => state.studyMaterials.length, [state.studyMaterials]);
    const hasMaterials = useMemo(() => materialCount > 0, [materialCount]);

    // Dummy data (unchanged)
    const dummyChapters = [
        // Commented out as in original
    ];
    const dummyMyCollegeEmployees = [
        // Commented out as in original
    ];
    const dummyOtherCollegeEmployees = [
        // Commented out as in original
    ];

    const fetchStudyMaterials = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, hasError: false }));
        try {
            const sessionData = await SessionService.getSession();
            const studentId = sessionData?.STUDENT_ID;

            if (!studentId) {
                throw new Error('Student ID not found in session. Cannot fetch materials.');
            }
            const payload = { STUDENT_ID: studentId };
            const apiEndpoint = getApiList().GetCourseListForStudyMaterial;
            if (!apiEndpoint) {
                throw new Error('API endpoint GetCourseListForStudyMaterial not found.');
            }
            const response = await HttpService.post(apiEndpoint, payload);
            const materials = response?.data?.StudyMaterialList || [];
            setState(prev => ({
                ...prev,
                studyMaterials: materials.length > 0 ? materials : [],
                isLoading: false,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                hasError: true,
                studyMaterials: [],
                isLoading: false,
            }));
            Alert.alert('Load Failed ⚠️', error.message || 'Could not fetch study materials.');
            console.error('Study Material fetch error:', error);
        }
    }, []);

    const fetchChaptersForCourse = useCallback(async (courseId) => {
        setState(prev => ({
            ...prev,
            loadingChapters: { ...prev.loadingChapters, [courseId]: true },
        }));
        try {
            const sessionData = await SessionService.getSession();
            const studentId = sessionData?.STUDENT_ID;
            const payload = { Course_ID: courseId, Student_Id: studentId };
            const apiEndpoint = getApiList().getMaterialLectureChapterListToApp;  
            if (!apiEndpoint) {
                throw new Error('API endpoint GetChapterListForCourse not found.');
            }
            const response = await HttpService.post(apiEndpoint, payload);
            const chapterList = response?.data?.ChapterListResponse?.ChapterList || [];
            setState(prev => ({
                ...prev,
                chaptersData: { ...prev.chaptersData, [courseId]: chapterList },
                loadingChapters: { ...prev.loadingChapters, [courseId]: false },
            }));
        } catch (error) {
            console.error('Fetch chapters error:', error);
            setState(prev => ({
                ...prev,
                chaptersData: { ...prev.chaptersData, [courseId]: dummyChapters },
                loadingChapters: { ...prev.loadingChapters, [courseId]: false },
            }));
        }
    }, []);

    const fetchEmployees = useCallback(async (collegeType, courseId) => {
        setState(prev => ({
            ...prev,
            isLoadingEmployees: true,
            loadingChapters: { ...prev.loadingChapters, [courseId]: true },  // Assuming this is tied to course
        }));
        try {
            const sessionData = await SessionService.getSession();
            const studentId = sessionData?.STUDENT_ID;
            const payload = { Course_ID: courseId, Student_Id: studentId };  
            const apiEndpoint = getApiList().getMaterialCountEmpListWiseToApp;
            if (!apiEndpoint) {
                throw new Error('API endpoint getMaterialCountEmpListWiseToApp not found.');
            }
            const response = await HttpService.post(apiEndpoint, payload);
            const empList = response?.data?.EmpListResponse?.EmpList || [];
            setState(prev => ({
                ...prev,
                employeeData: empList,
                isLoadingEmployees: false,
                loadingChapters: { ...prev.loadingChapters, [courseId]: false },
            }));
        } catch (error) {
            console.error('Fetch employees error:', error);
            const dummyData = collegeType === 'my' ? dummyMyCollegeEmployees : dummyOtherCollegeEmployees;
            setState(prev => ({
                ...prev,
                employeeData: dummyData,
                isLoadingEmployees: false,
                loadingChapters: { ...prev.loadingChapters, [courseId]: false },
            }));
        }
    }, []);

    const toggleExpansion = useCallback((courseId) => {
        setState(prev => {
            const currentlyExpanded = prev.expandedItems[courseId];
            if (!currentlyExpanded && !prev.chaptersData[courseId]) {
                fetchChaptersForCourse(courseId);
                return {
                    ...prev,
                    expandedItems: { ...prev.expandedItems, [courseId]: true },
                    courseIdForCollege: courseId,  // Set here for modal use
                };
            }
            return {
                ...prev,
                expandedItems: { ...prev.expandedItems, [courseId]: !currentlyExpanded },
            };
        });
    }, [fetchChaptersForCourse]);

    const handleChapterPress = useCallback((chapter) => {
        setState(prev => ({
            ...prev,
            selectedChapter: chapter,
            modalVisible: true,
        }));
    }, []);

    const handleCollegeSelect = useCallback((collegeType) => {
        if (collegeType === "other") {
            // Handle other college logic if needed, else just return
            return;
        }
        if (state.selectedChapter && state.courseIdForCollege) {
            fetchEmployees(collegeType, state.courseIdForCollege);
        }
    }, [state.selectedChapter, state.courseIdForCollege, fetchEmployees]);

    const closeModal = useCallback(() => {
        setState(prev => ({
            ...prev,
            modalVisible: false,
            selectedChapter: null,
            employeeData: [],
        }));
    }, []);

    useEffect(() => {
        fetchStudyMaterials();
    }, [fetchStudyMaterials]);

    if (state.isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#1a478b" />
                <Text style={styles.loadingText}>Loading Study Materials...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header/>
        <View style={styles.container}>
            <Text style={styles.headerTitle}>📚 Study Materials</Text>    
            {state.hasError ? (
                <View style={[styles.centerContent, styles.errorContainer]}>
                    <Text style={styles.errorText}>Failed to load data. Please check your connection.</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchStudyMaterials}>
                        <Text style={styles.buttonText}>Tap to Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <Text style={styles.headerSubtitle}>
                        {hasMaterials
                            ? `Showing materials for ${materialCount} Course${materialCount > 1 ? 's' : ''}` 
                            : 'No Study Materials Found'
                        }
                    </Text>
                    <View style={styles.listWrapper}>
                        {hasMaterials ? (
                            <FlatList
                                data={state.studyMaterials}
                                keyExtractor={(item) => item.Course_Id.toString()}
                                renderItem={({ item }) => (
                                    <StudyMaterialItem 
                                        item={item} 
                                        navigation={navigation} 
                                        expanded={state.expandedItems[item.Course_Id]}
                                        onToggle={() => toggleExpansion(item.Course_Id)}
                                        chapters={state.chaptersData[item.Course_Id]}
                                        isLoadingChapters={state.loadingChapters[item.Course_Id]}
                                        onChapterPress={handleChapterPress}
                                    />
                                )}
                                contentContainerStyle={styles.flatListContent}
                                // Optimize: Add initialNumToRender and windowSize for large lists
                                initialNumToRender={10}
                                windowSize={5}
                            />
                        ) : (
                            <Text style={styles.noDataText}>
                                There are currently no study materials available for your courses.
                            </Text>
                        )}
                    </View>
                </>
            )}
            
            {/* Modal for College Selection and Employee List */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={state.modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select College</Text>
                        <TouchableOpacity 
                            style={styles.collegeButton}
                            onPress={() => handleCollegeSelect('my')}>
                            <Text style={styles.buttonText}>My College</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.collegeButton}
                            onPress={() => handleCollegeSelect('other')}>
                            <Text style={styles.buttonText}>Other College</Text>
                        </TouchableOpacity>
                        {state.isLoadingEmployees ? (
                            <ActivityIndicator size="small" color="#1a478b" />
                        ) : state.employeeData.length > 0 ? (
                            <FlatList
                                data={state.employeeData}
                                keyExtractor={(emp) => emp.Emp_Id.toString()}
                                renderItem={({ item: emp }) => (
                                    <TouchableOpacity 
                                        style={styles.employeeItem}
                                        onPress={() => {
                                            navigation.navigate('StudyMaterialDetails', {
                                                empId: emp.Emp_Id,
                                                empName: emp.Employee_Name,
                                                course_id: state.courseIdForCollege,
                                            });
                                            closeModal();
                                        }}>
                                        <Text style={styles.employeeName}>{emp.Employee_Name}</Text>
                                        <Text style={styles.employeeDetails}>{emp.Post_Name} - {emp.Office_Short_Name}</Text>
                                        <Text style={styles.employeeCount}>Materials: {emp.Material_Count}</Text>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={styles.employeesList}
                                // Optimize: Add initialNumToRender for employee list
                                initialNumToRender={5}
                            />
                        ) : (
                            <Text style={styles.noEmployeesText}>No employees available.</Text>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
            <FooterNav/>
        </View>
        </View>
    );
};

export default StudyScreen;

















// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
// import Header from '../../layout/Header/Header2';
// import FooterNav from '../../layout/Footer/Footer';
// import SessionService from '../../../common/Services/SessionService';
// import getApiList from '../../config/Api/ApiList';
// import { HttpService } from '../../../common/Services/HttpService';

// const StudyMaterialItem = React.memo(({ item, navigation, expanded, onToggle, chapters, isLoadingChapters, onChapterPress }) => {
//     const buttonText = expanded ? 'Hide Chapters' : 'View Materials';
    
//     return (
//         <View style={styles.itemContainer}>
//             <Text style={styles.courseTitle}>{item.Course_Title}</Text>
//             <Text style={styles.courseCode}>Course Code: {item.Course_Code}</Text>
//             <View style={styles.footerRow}>
//                 <Text style={styles.materialCount}>
//                     Materials Available: 👉🏻  {item.Material_count}
//                 </Text>
//                 <TouchableOpacity 
//                     style={styles.viewButton}
//                     onPress={onToggle}>
//                     <Text style={styles.buttonText}>{buttonText}</Text>
//                 </TouchableOpacity>
//             </View>
//             {expanded && (
//                 <View style={styles.expandedContainer}>
//                     {isLoadingChapters ? (
//                         <ActivityIndicator size="small" color="#1a478b" />
//                     ) : chapters && chapters.length > 0 ? (
//                         <FlatList
//                             data={chapters}
//                             keyExtractor={(chap) => chap.Id.toString()}
//                             renderItem={({ item: chap }) => (
//                                 <TouchableOpacity 
//                                     style={styles.chapterItem}
//                                     onPress={() => onChapterPress(chap)}>
//                                     <Text style={styles.chapterTitle}>{chap.Name}</Text>
//                                     <Text style={styles.chapterCount}>Materials: {chap.Material_Count}</Text>
//                                 </TouchableOpacity>
//                             )}
//                             contentContainerStyle={styles.chaptersList}
//                         />
//                     ) : (
//                         <Text style={styles.noChaptersText}>No chapters available.</Text>
//                     )}
//                 </View>
//             )}
//         </View>
//     );
// });

// const StudyScreen = ({ navigation }) => {
//     const [studyMaterials, setStudyMaterials] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [hasError, setHasError] = useState(false);
//     const [expandedItems, setExpandedItems] = useState({});  
//     const [chaptersData, setChaptersData] = useState({});  
//     const [loadingChapters, setLoadingChapters] = useState({});  

//     // Modal states
//     const [modalVisible, setModalVisible] = useState(false);
//     const [selectedChapter, setSelectedChapter] = useState(null);
//     const [employeeData, setEmployeeData] = useState([]);
//     const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

//     // course_id
//      const [courseIdforcollage, setcourseIdforcollage] = useState();

//     // Dummy data for chapters
//     const dummyChapters = [
//         {
//             // "Id": "0",
//             // "Name": "All Files Without Chapter",
//             // "course_id": "0",
//             // "Material_Count": "1"
//         }
//     ];

//     // Dummy data for employees (My College)
//     const dummyMyCollegeEmployees = [
//         {
//             // "Material_Count": "1",
//             // "Employee_Name": "Dr. Deo Shankar",
//             // "Office_Short_Name": "COA-RPR",
//             // "Post_Name": "Professor",
//             // "Emp_Id": "2278"
//         }
//     ];

//     // Dummy data for employees (Other College) - assuming similar structure
//     const dummyOtherCollegeEmployees = [
//         {
//             // "Material_Count": "2",
//             // "Employee_Name": "Dr. Jane Doe",
//             // "Office_Short_Name": "COA-XYZ",
//             // "Post_Name": "Associate Professor",
//             // "Emp_Id": "1234"
//         }
//     ];

//     const fetchStudyMaterials = useCallback(async () => {
//         setIsLoading(true);  
//         setHasError(false);
//         try {
//             const sessionData = await SessionService.getSession();
//             const studentId = sessionData?.STUDENT_ID;

//             if (!studentId) {
//                 throw new Error('Student ID not found in session. Cannot fetch materials.');
//             }
//             const payload = { STUDENT_ID: studentId };
//             const apiEndpoint = getApiList().GetCourseListForStudyMaterial;
//             if (!apiEndpoint) {
//                 throw new Error('API endpoint GetCourseListForStudyMaterial not found.');
//             }
//             const response = await HttpService.post(apiEndpoint, payload);
//             const materials = response?.data?.StudyMaterialList || [];
//             // console.log(response);
//             if (materials.length > 0) {
//                 setStudyMaterials(materials);
//             } else {
//                 setStudyMaterials([]);
//             }
//         } catch (error) {
//             setHasError(true);
//             setStudyMaterials([]);
//             Alert.alert('Load Failed ⚠️', error.message || 'Could not fetch study materials.');
//             console.error('Study Material fetch error:', error);
//         } finally {
//             setIsLoading(false);  
//         }
//     }, []);

//     const fetchChaptersForCourse = useCallback(async (courseId) => {
//         setLoadingChapters(prev => ({ ...prev, [courseId]: true }));
//         try {
//             const sessionData = await SessionService.getSession();
//             const studentId = sessionData?.STUDENT_ID;
//             const payload = { Course_ID: courseId, Student_Id:studentId };
//             const apiEndpoint = getApiList().getMaterialLectureChapterListToApp;  
//             if (!apiEndpoint) {
//                 throw new Error('API endpoint GetChapterListForCourse not found.');
//             }
//             const response = await HttpService.post(apiEndpoint, payload);
//             const chapterList = response?.data?.ChapterListResponse?.ChapterList || [];
//             console.log(payload,"payload fetchChaptersForCourse")
//             setChaptersData(prev => ({ ...prev, [courseId]: chapterList }));
//         } catch (error) {
//             console.error('Fetch chapters error:', error);
//             setChaptersData(prev => ({ ...prev, [courseId]: dummyChapters }));
//         } finally {
//             setLoadingChapters(prev => ({ ...prev, [courseId]: false }));
//         }
//     }, []);

//     const fetchEmployees = useCallback(async (collegeType,courseId) => {
//       // console.log(courseId,"courseId")
//        setLoadingChapters(prev => ({ ...prev, [courseId]: true }));
//         setIsLoadingEmployees(true);
//         try {
//             const sessionData = await SessionService.getSession();
//             const studentId = sessionData?.STUDENT_ID;
//             const payload = { Course_ID: courseIdforcollage, Student_Id: studentId };  
//             const apiEndpoint = getApiList().getMaterialCountEmpListWiseToApp;
//             if (!apiEndpoint) {
//                 throw new Error('API endpoint getMaterialCountEmpListWiseToApp not found.');
//             }
//             console.log(payload,"payload fetchEmployees")
//             const response = await HttpService.post(apiEndpoint, payload);
//             console.log(response,"response")
//             const empList = response?.data?.EmpListResponse?.EmpList || [];
//             setEmployeeData(empList);
//         } catch (error) {
//             console.error('Fetch employees error:', error);
//             // Use dummy data based on college type
//             if (collegeType === 'my') {
//                 setEmployeeData(dummyMyCollegeEmployees);
//             } else {
//                 setEmployeeData(dummyOtherCollegeEmployees);
//             }
//         } finally {
//             setIsLoadingEmployees(false);
//         }
//     }, [courseIdforcollage]);

//     const toggleExpansion = (courseId) => {
//         const currentlyExpanded = expandedItems[courseId];
//         if (!currentlyExpanded) {
//             if (!chaptersData[courseId]) {
//                 fetchChaptersForCourse(courseId);
//                 console.log(courseId,"courseId")
//               setcourseIdforcollage(courseId);
//             }

//         }
//         setExpandedItems(prev => ({ ...prev, [courseId]: !prev[courseId] }));
//     };

//     const handleChapterPress = (chapter) => {
//         setSelectedChapter(chapter);
//         setModalVisible(true);
//     };

//     const handleCollegeSelect = (collegeType) => {
//       console.log(expandedItems,"expandedItems")
//       // let course_id = expandedItems
//         if(collegeType === "other"){
//           return
//         }
//         if (selectedChapter) {
//             fetchEmployees(collegeType, expandedItems);
//         }
//     };

//     const closeModal = () => {
//         setModalVisible(false);
//         setSelectedChapter(null);
//         setEmployeeData([]);
//     };

//     useEffect(() => {
//         fetchStudyMaterials();
//     }, [fetchStudyMaterials]);

//     const materialCount = studyMaterials.length;
//     const hasMaterials = materialCount > 0;

//     if (isLoading) {
//         return (
//             <View style={[styles.container, styles.centerContent]}>
//                 <ActivityIndicator size="large" color="#1a478b" />
//                 <Text style={styles.loadingText}>Loading Study Materials...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.headerTitle}>📚 Study Materials</Text>    
//             {hasError ? (
//                 <View style={[styles.centerContent, styles.errorContainer]}>
//                     <Text style={styles.errorText}>Failed to load data. Please check your connection.</Text>
//                     <TouchableOpacity style={styles.retryButton} onPress={fetchStudyMaterials}>
//                         <Text style={styles.buttonText}>Tap to Retry</Text>
//                     </TouchableOpacity>
//                 </View>
//             ) : (
//                 <>
//                     <Text style={styles.headerSubtitle}>
//                         {hasMaterials
//                             ? `Showing materials for ${materialCount} Course${materialCount > 1 ? 's' : ''}` 
//                             : 'No Study Materials Found'
//                         }
//                     </Text>
//                     <View style={styles.listWrapper}>
//                         {hasMaterials ? (
//                             <FlatList
//                                 data={studyMaterials}
//                                 keyExtractor={(item) => item.Course_Id.toString()}
//                                 renderItem={({ item }) => (
//                                     <StudyMaterialItem 
//                                         item={item} 
//                                         navigation={navigation} 
//                                         expanded={expandedItems[item.Course_Id]}
//                                         onToggle={() => toggleExpansion(item.Course_Id)}
//                                         chapters={chaptersData[item.Course_Id]}
//                                         isLoadingChapters={loadingChapters[item.Course_Id]}
//                                         onChapterPress={handleChapterPress}
//                                     />
//                                 )}
//                                 contentContainerStyle={styles.flatListContent}
//                             />
//                         ) : (
//                             <Text style={styles.noDataText}>
//                                 There are currently no study materials available for your courses.
//                             </Text>
//                         )}
//                     </View>
//                 </>
//             )}
            
//             {/* Modal for College Selection and Employee List */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={modalVisible}
//                 onRequestClose={closeModal}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalTitle}>Select College</Text>
//                         <TouchableOpacity 
//                             style={styles.collegeButton}
//                             onPress={() => handleCollegeSelect('my')}>
//                             <Text style={styles.buttonText}>My College</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity 
//                             style={styles.collegeButton}
//                             onPress={() => handleCollegeSelect('other')}>
//                             <Text style={styles.buttonText}>Other College</Text>
//                         </TouchableOpacity>
//                         {isLoadingEmployees ? (
//                             <ActivityIndicator size="small" color="#1a478b" />
//                         ) : employeeData.length > 0 ? (
//                             <FlatList
//                                 data={employeeData}
//                                 keyExtractor={(emp) => emp.Emp_Id.toString()}
//                                 renderItem={({ item: emp }) => (
//                                     <TouchableOpacity 
//                                         style={styles.employeeItem}
//                                         onPress={() => {
//                                             navigation.navigate('StudyMaterialDetails', {
//                                                 empId: emp.Emp_Id,
//                                                 empName: emp.Employee_Name,
//                                                 course_id: courseIdforcollage
//                                                 // chapterId: selectedChapter?.Id,
//                                                 // Add other params
//                                             });
//                                             closeModal();
//                                         }}>
//                                         <Text style={styles.employeeName}>{emp.Employee_Name}</Text>
//                                         <Text style={styles.employeeDetails}>{emp.Post_Name} - {emp.Office_Short_Name}</Text>
//                                         <Text style={styles.employeeCount}>Materials: {emp.Material_Count}</Text>
//                                     </TouchableOpacity>
//                                 )}
//                                 contentContainerStyle={styles.employeesList}
//                             />
//                         ) : (
//                             <Text style={styles.noEmployeesText}>No employees available.</Text>
//                         )}
//                         <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
//                             <Text style={styles.closeButtonText}>Close</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
            
//             <FooterNav/>
//         </View>
//     );
// };

// export default StudyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', 
        padding: 0,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        backgroundColor: '#fdd',
        borderRadius: 10,
    },
    errorText: {
        fontSize: 16,
        color: '#d9534f',
        textAlign: 'center',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: '#1a478b',  
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a478b', 
        marginTop: 10,
        marginLeft: 10,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
        marginLeft: 10,
    },
    listWrapper: {
        flex: 1,
    },
    flatListContent: {
        paddingBottom: 20,
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    courseCode: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    materialCount: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1a478b',
    },
    viewButton: {
        backgroundColor: '#28a745',  
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    },
    expandedContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    chaptersList: {
        paddingVertical: 10,
    },
    chapterItem: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#1a478b',
    },
    chapterTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    chapterCount: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    noChaptersText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#888',
        paddingVertical: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a478b',
        marginBottom: 15,
        textAlign: 'center',
    },
    collegeButton: {
        backgroundColor: '#1a478b',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
    },
    employeesList: {
        paddingVertical: 10,
    },
    employeeItem: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#28a745',
    },
    employeeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    employeeDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    employeeCount: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    noEmployeesText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#888',
        paddingVertical: 10,
    },
    closeButton: {
        backgroundColor: '#d9534f',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 15,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});





















// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import Header from '../../layout/Header/Header2';
// import FooterNav from '../../layout/Footer/Footer';
// import SessionService from '../../../common/Services/SessionService';
// import getApiList from '../../config/Api/ApiList';
// import { HttpService } from '../../../common/Services/HttpService';

// const StudyMaterialItem = React.memo(({ item, navigation, expanded, onToggle, chapters, isLoadingChapters }) => {
//     const buttonText = expanded ? 'Hide Chapters' : 'View Materials';
    
//     return (
//         <View style={styles.itemContainer}>
//             <Text style={styles.courseTitle}>{item.Course_Title}</Text>
//             <Text style={styles.courseCode}>Course Code: {item.Course_Code}</Text>
//             <View style={styles.footerRow}>
//                 <Text style={styles.materialCount}>
//                     Materials Available: 👉🏻  {item.Material_count}
//                 </Text>
//                 <TouchableOpacity 
//                     style={styles.viewButton}
//                     onPress={onToggle}>
//                     <Text style={styles.buttonText}>{buttonText}</Text>
//                 </TouchableOpacity>
//             </View>
//             {expanded && (
//                 <View style={styles.expandedContainer}>
//                     {isLoadingChapters ? (
//                         <ActivityIndicator size="small" color="#1a478b" />
//                     ) : chapters && chapters.length > 0 ? (
//                         <FlatList
//                             data={chapters}
//                             keyExtractor={(chap) => chap.Id.toString()}
//                             renderItem={({ item: chap }) => (
//                                 <TouchableOpacity 
//                                     style={styles.chapterItem}
//                                     onPress={() => {
//                                         // Navigate to chapter details or materials page
//                                         navigation.navigate('ChapterMaterialsPage', {
//                                             chapterId: chap.Id,
//                                             chapterName: chap.Name,
//                                             courseId: item.Course_Id,
//                                             // Add other params as needed
//                                         });
//                                     }}>
//                                     <Text style={styles.chapterTitle}>{chap.Name}</Text>
//                                     <Text style={styles.chapterCount}>Materials: {chap.Material_Count}</Text>
//                                 </TouchableOpacity>
//                             )}
//                             contentContainerStyle={styles.chaptersList}
//                         />
//                     ) : (
//                         <Text style={styles.noChaptersText}>No chapters available.</Text>
//                     )}
//                 </View>
//             )}
//         </View>
//     );
// });

// const StudyScreen = ({ navigation }) => {
//     const [studyMaterials, setStudyMaterials] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [hasError, setHasError] = useState(false);
//     const [expandedItems, setExpandedItems] = useState({});  
//     const [chaptersData, setChaptersData] = useState({});  
//     const [loadingChapters, setLoadingChapters] = useState({});  

//     const fetchStudyMaterials = useCallback(async () => {
//         setIsLoading(true);  
//         setHasError(false);
//         try {
//             const sessionData = await SessionService.getSession();
//             const studentId = sessionData?.STUDENT_ID;

//             if (!studentId) {
//                 throw new Error('Student ID not found in session. Cannot fetch materials.');
//             }
//             const payload = { STUDENT_ID: studentId };
//             const apiEndpoint = getApiList().GetCourseListForStudyMaterial;
//             if (!apiEndpoint) {
//                 throw new Error('API endpoint GetCourseListForStudyMaterial not found.');
//             }
//             const response = await HttpService.post(apiEndpoint, payload);
//             const materials = response?.data?.StudyMaterialList || [];
//             console.log(response);
//             if (materials.length > 0) {
//                 setStudyMaterials(materials);
//             } else {
//                 setStudyMaterials([]);
//             }
//         } catch (error) {
//             setHasError(true);
//             setStudyMaterials([]);
//             Alert.alert('Load Failed ⚠️', error.message || 'Could not fetch study materials.');
//             console.error('Study Material fetch error:', error);
//         } finally {
//             setIsLoading(false);  
//         }
//     }, []);

//     const fetchChaptersForCourse = useCallback(async (courseId) => {
//         setLoadingChapters(prev => ({ ...prev, [courseId]: true }));
//         try {
//             const sessionData = await SessionService.getSession();
//             const studentId = sessionData?.STUDENT_ID;
//             const payload = { Student_Id: studentId, Course_ID:courseId };
//             const apiEndpoint = getApiList().getMaterialLectureChapterListToApp; // Adjust as per your API
//             if (!apiEndpoint) {
//                 throw new Error('API endpoint GetChapterListForCourse not found.');
//             }
//             const response = await HttpService.post(apiEndpoint, payload);
//             const chapterList = response?.data?.ChapterListResponse?.ChapterList || [];
//             setChaptersData(prev => ({ ...prev, [courseId]: chapterList }));
//         } catch (error) {
//             console.error('Fetch chapters error:', error);
//             // Use dummy data if API fails
//             setChaptersData(prev => ({ ...prev,}));
//         } finally {
//             setLoadingChapters(prev => ({ ...prev, [courseId]: false }));
//         }
//     }, []);

//     const toggleExpansion = (courseId) => {
//         const currentlyExpanded = expandedItems[courseId];
//         if (!currentlyExpanded) {
//             // Fetch chapters if not already fetched
//             if (!chaptersData[courseId]) {
//                 fetchChaptersForCourse(courseId);
//             }
//         }
//         setExpandedItems(prev => ({ ...prev, [courseId]: !prev[courseId] }));
//     };

//     useEffect(() => {
//         fetchStudyMaterials();
//     }, [fetchStudyMaterials]);

//     const materialCount = studyMaterials.length;
//     const hasMaterials = materialCount > 0;

//     if (isLoading) {
//         return (
//             <View style={[styles.container, styles.centerContent]}>
//                 <ActivityIndicator size="large" color="#1a478b" />
//                 <Text style={styles.loadingText}>Loading Study Materials...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.headerTitle}>📚 Study Materials</Text>    
//             {hasError ? (
//                 <View style={[styles.centerContent, styles.errorContainer]}>
//                     <Text style={styles.errorText}>Failed to load data. Please check your connection.</Text>
//                     <TouchableOpacity style={styles.retryButton} onPress={fetchStudyMaterials}>
//                         <Text style={styles.buttonText}>Tap to Retry</Text>
//                     </TouchableOpacity>
//                 </View>
//             ) : (
//                 <>
//                     <Text style={styles.headerSubtitle}>
//                         {hasMaterials
//                             ? `Showing materials for ${materialCount} Course${materialCount > 1 ? 's' : ''}` 
//                             : 'No Study Materials Found'
//                         }
//                     </Text>
//                     <View style={styles.listWrapper}>
//                         {hasMaterials ? (
//                             <FlatList
//                                 data={studyMaterials}
//                                 keyExtractor={(item) => item.Course_Id.toString()}
//                                 renderItem={({ item }) => (
//                                     <StudyMaterialItem 
//                                         item={item} 
//                                         navigation={navigation} 
//                                         expanded={expandedItems[item.Course_Id]}
//                                         onToggle={() => toggleExpansion(item.Course_Id)}
//                                         chapters={chaptersData[item.Course_Id]}
//                                         isLoadingChapters={loadingChapters[item.Course_Id]}
//                                     />
//                                 )}
//                                 contentContainerStyle={styles.flatListContent}
//                             />
//                         ) : (
//                             <Text style={styles.noDataText}>
//                                 There are currently no study materials available for your courses.
//                             </Text>
//                         )}
//                     </View>
//                 </>
//             )}
            
//             <FooterNav/>
//         </View>
//     );
// };

// export default StudyScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5', 
//         padding: 10,
//     },
//     centerContent: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     loadingText: {
//         marginTop: 10,
//         fontSize: 16,
//         color: '#666',
//     },
//     errorContainer: {
//         backgroundColor: '#fdd',
//         borderRadius: 10,
//     },
//     errorText: {
//         fontSize: 16,
//         color: '#d9534f',
//         textAlign: 'center',
//         marginBottom: 15,
//     },
//     retryButton: {
//         backgroundColor: '#1a478b',  
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 5,
//     },
//     headerTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#1a478b', 
//         marginTop: 10,
//         marginLeft: 10,
//     },
//     headerSubtitle: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 15,
//         marginLeft: 10,
//     },
//     listWrapper: {
//         flex: 1,
//     },
//     flatListContent: {
//         paddingBottom: 20,
//     },
//     itemContainer: {
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         padding: 15,
//         marginVertical: 8,
//         marginHorizontal: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//         elevation: 3,
//     },
//     courseTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 5,
//     },
//     courseCode: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 10,
//     },
//     footerRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginTop: 10,
//         paddingTop: 10,
//         borderTopWidth: 1,
//         borderTopColor: '#eee',
//     },
//     materialCount: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#1a478b',
//     },
//     viewButton: {
//         backgroundColor: '#28a745',  
//         paddingVertical: 8,
//         paddingHorizontal: 15,
//         borderRadius: 5,
//     },
//     buttonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 14,
//     },
//     noDataText: {
//         textAlign: 'center',
//         marginTop: 50,
//         fontSize: 16,
//         color: '#888',
//     },
//     expandedContainer: {
//         marginTop: 10,
//         paddingTop: 10,
//         borderTopWidth: 1,
//         borderTopColor: '#eee',
//     },
//     chaptersList: {
//         paddingVertical: 10,
//     },
//     chapterItem: {
//         backgroundColor: '#f9f9f9',
//         padding: 10,
//         marginVertical: 5,
//         borderRadius: 5,
//         borderLeftWidth: 4,
//         borderLeftColor: '#1a478b',
//     },
//     chapterTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//     },
//     chapterCount: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 5,
//     },
//     noChaptersText: {
//         textAlign: 'center',
//         fontSize: 14,
//         color: '#888',
//         paddingVertical: 10,
//     },
// });






 
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import Header from '../../layout/Header/Header2';
// import FooterNav from '../../layout/Footer/Footer';
// import SessionService from '../../../common/Services/SessionService';
// import getApiList from '../../config/Api/ApiList';
// import { HttpService } from '../../../common/Services/HttpService';
// const StudyMaterialItem = React.memo(({ item, navigation }) => {
//     const navigateToDetail = () => {
//         navigation.navigate('MaterialDetailPage', {
//             courseId: item.Course_Id,
//             courseTitle: item.Course_Title,
//             courseCode: item.Course_Code,
//         });
//     };
//     return (
//         <View style={styles.itemContainer}>
//             <Text style={styles.courseTitle}>{item.Course_Title}</Text>
//             <Text style={styles.courseCode}>Course Code: {item.Course_Code}</Text>
//             <View style={styles.footerRow}>
//                 <Text style={styles.materialCount}>
//                     Materials Available: 👉🏻  {item.Material_count}
//                 </Text>
//                 <TouchableOpacity 
//                     style={styles.viewButton}
//                     onPress={navigateToDetail}>
//                     <Text style={styles.buttonText}>View Materials</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// });
// const StudyScreen = ({ navigation }) => {
//     const [studyMaterials, setStudyMaterials] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [hasError, setHasError] = useState(false);
//     const fetchStudyMaterials = useCallback(async () => {
//         setIsLoading(true);  
//         setHasError(false);
//         try {
//             const sessionData = await SessionService.getSession();
//             const studentId = sessionData?.STUDENT_ID;

//             if (!studentId) {
//                 throw new Error('Student ID not found in session. Cannot fetch materials.');
//             }
//             const payload = { STUDENT_ID: studentId };
//             const apiEndpoint = getApiList().GetCourseListForStudyMaterial;
//             if (!apiEndpoint) {
//                 throw new Error('API endpoint GetCourseListForStudyMaterial not found.');
//             }
//             const response = await HttpService.post(apiEndpoint, payload);
//             const materials = response?.data?.StudyMaterialList || [];
//              console.log(response)
//             if (materials.length > 0) {
//                 setStudyMaterials(materials);
//             } else {
//                 setStudyMaterials([]);
//             }

//         } catch (error) {
//             setHasError(true);
//             setStudyMaterials([]);
//             Alert.alert('Load Failed ⚠️', error.message || 'Could not fetch study materials.');
//             console.error('Study Material fetch error:', error);
//         } finally {
//             setIsLoading(false);  
//         }
//     }, []);
//     useEffect(() => {
//         fetchStudyMaterials();
//     }, [fetchStudyMaterials]);

//     const materialCount = studyMaterials.length;
//     const hasMaterials = materialCount > 0;

//     if (isLoading) {
//         return (
//             <View style={[styles.container, styles.centerContent]}>
//                 <ActivityIndicator size="large" color="#1a478b" />
//                 <Text style={styles.loadingText}>Loading Study Materials...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.headerTitle}>📚 Study Materials</Text>    
//             {hasError ? (
//                  <View style={[styles.centerContent, styles.errorContainer]}>
//                     <Text style={styles.errorText}>Failed to load data. Please check your connection.</Text>
//                     <TouchableOpacity style={styles.retryButton} onPress={fetchStudyMaterials}>
//                         <Text style={styles.buttonText}>Tap to Retry</Text>
//                     </TouchableOpacity>
//                  </View>
//             ) : (
//                 <>
//                     <Text style={styles.headerSubtitle}>
//                         {hasMaterials
//                             ? `Showing materials for ${materialCount} Course${materialCount > 1 ? 's' : ''}` 
//                             : 'No Study Materials Found'
//                         }
//                     </Text>
//                     <View style={styles.listWrapper}>
//                         {hasMaterials ? (
//                             <FlatList
//                                 data={studyMaterials} // Use the state variable
//                                 keyExtractor={(item) => item.Course_Id.toString()} // Ensure key is a string
//                                 renderItem={({ item }) => (
//                                     <StudyMaterialItem item={item} navigation={navigation} />
//                                 )}
//                                 contentContainerStyle={styles.flatListContent}
//                             />
//                         ) : (
//                             <Text style={styles.noDataText}>
//                                 There are currently no study materials available for your courses.
//                             </Text>
//                         )}
//                     </View>
//                 </>
//             )}
            
//             {/* <FooterNav navigation={navigation} /> */}
//             <FooterNav/>
//         </View>
//     );
// };

// export default StudyScreen;
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5', 
//         padding: 10,
//     },
//     centerContent: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     loadingText: {
//         marginTop: 10,
//         fontSize: 16,
//         color: '#666',
//     },
//     errorContainer: {
//         backgroundColor: '#fdd',
//         borderRadius: 10,
//     },
//     errorText: {
//         fontSize: 16,
//         color: '#d9534f',
//         textAlign: 'center',
//         marginBottom: 15,
//     },
//     retryButton: {
//         backgroundColor: '#1a478b',  
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 5,
//     },
//     headerTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#1a478b', 
//         marginTop: 10,
//         marginLeft: 10,
//     },
//     headerSubtitle: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 15,
//         marginLeft: 10,
//     },
//     listWrapper: {
//         flex: 1,
//     },
//     flatListContent: {
//         paddingBottom: 20,
//     },
//     itemContainer: {
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         padding: 15,
//         marginVertical: 8,
//         marginHorizontal: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//         elevation: 3,
//     },
//     courseTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 5,
//     },
//     courseCode: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 10,
//     },
//     footerRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginTop: 10,
//         paddingTop: 10,
//         borderTopWidth: 1,
//         borderTopColor: '#eee',
//     },
//     materialCount: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#1a478b',
//     },
//     viewButton: {
//         backgroundColor: '#28a745',  
//         paddingVertical: 8,
//         paddingHorizontal: 15,
//         borderRadius: 5,
//     },
//     buttonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 14,
//     },
//     noDataText: {
//         textAlign: 'center',
//         marginTop: 50,
//         fontSize: 16,
//         color: '#888',
//     }
// });
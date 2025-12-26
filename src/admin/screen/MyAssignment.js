import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Header from '../layout/Header/Header';
import FooterNav from '../layout/Footer/Footer';
import SessionService from "../../common/Services/SessionService";
import getAdminApiList from '../config/Api/adminApiList';
import { HttpService } from "../../common/Services/HttpService";
import { useRoute, useNavigation } from '@react-navigation/native';
import { downloadFile } from "../../common/Services/pdfService";
import alertService from '../../common/Services/alert/AlertService';
import { API_BASE_URL } from '../../common/config/BaseUrl';
// import colors from '../../common/config/colors';
import CustomRefreshControl from '../../common/RefreshControl';
import colors from '../../common/config/colors';


const DUMMY_COURSE_COUNTS = [
    { SN: 1, Course_Name: 'EPE-5211', Students: 7, Assignments: 1, Course_ID: 'C5211' },
    { SN: 2, Course_Name: 'EPE-5312', Students: 34, Assignments: 1, Course_ID: 'C5312' },
];

const DUMMY_ASSIGNMENT_COUNTS = [
    { SN: 1, Assignment_Name: 'test', Course_Code: 'EPE-5312', Total: 34, Submit: 0, Pending: 34, FilePath: 'path/to/epe-5312-assignment.pdf', Assignment_ID: 'A1' },
    { SN: 2, Assignment_Name: 'test', Course_Code: 'EPE-5211', Total: 7, Submit: 0, Pending: 7, FilePath: 'path/to/epe-5211-assignment.pdf', Assignment_ID: 'A2' },
];

const AssignmentDashboard = () => {
    const navigation = useNavigation();
    const [assignmentCounts, setAssignmentCounts] = useState({
        courseWise: [],
        assignmentWise: [],
    });
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Placeholder function for opening a modal with details
    const handleOpenDetailsModal = useCallback((type, data) => {
        let message = '';
        switch (type) {
            case 'Students':
                message = `Total Students in ${data.Course_Name}: ${data.Students}. (Tap to view student list)`;
                break;
            case 'Assignments':
                message = `Total Assignments for ${data.Course_Name}: ${data.Assignments}. (Tap to view assignment list)`;
                break;
            case 'Total':
                message = `Total assigned for ${data.Assignment_Name}: ${data.Total}. (Tap to view complete list)`;
                break;
            case 'Submit':
                message = `Submitted count for ${data.Assignment_Name}: ${data.Submit}. (Tap to view submitted list)`;
                break;
            case 'Pending':
                message = `Pending count for ${data.Assignment_Name}: ${data.Pending}. (Tap to view pending list)`;
                break;
            default:
                message = `No details available for ${type}.`;
        }
        console.log(message)
        Alert.alert(`${type} Details`, message);
    }, []);

    // Function to handle viewing/downloading the Assignment File
    const handleViewFile = async (filePath) => {

        if (!filePath) {
            alertService.show({
                title: 'Error',
                message: 'No file available for this assignment.',
                type: 'warning',
            });
            return;
        }
        Alert.alert('File Action', `Attempting to view/download file: ${filePath}`);
        setLoading(true);
        try {
            const fullPath = API_BASE_URL + '/' + filePath;
            await downloadFile(fullPath, `${filePath.split('/').pop()}`);
            Alert.alert('Download', 'Simulated download started for ' + filePath.split('/').pop());
        } catch (error) {
            Alert.alert('Download Failed', error?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const getAssignmentCounts = useCallback(async (isRefreshing = false) => {
        if (!isRefreshing) setLoading(true); else setRefreshing(true);

        try {
            // --- Using dummy data for demonstration ---
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            // setAssignmentCounts({
            //     courseWise: DUMMY_COURSE_COUNTS,
            //     assignmentWise: DUMMY_ASSIGNMENT_COUNTS,
            // });



        } catch (error) {
            Alert.alert("Failed to Load Assignment Data", error?.message || "Something went wrong");
        } finally {
            if (!isRefreshing) setLoading(false); else setRefreshing(false);
        }
    }, []);

    const GetApprovalListCount = useCallback(async () => {
        try {
            setLoading(true);

            const {
                getStudyAssignmentDashCount,
                getSubmittedAssignmentStudentCount,
            } = getAdminApiList();

            if (!getStudyAssignmentDashCount || !getSubmittedAssignmentStudentCount) {
                throw new Error("API endpoint not found.");
            }

            const sessionData = await SessionService.getSession();
            const profile = sessionData?.LoginDetail?.[0];

            if (!profile?.Emp_Id) {
                throw new Error("Invalid session or user data");
            }

            const countPayload = {
                Academic_session: sessionData.SelectedSession,
                Semester_Id: sessionData.SelectedSemester,
                Created_By: profile.Emp_Id,
            };

            const listPayload = {
                Academic_session: sessionData.SelectedSession,
                Emp_Id: profile.Emp_Id,
                Semester_Id: sessionData.SelectedSemester,
                CourseID: ''
            };

            const [countRes, listRes] = await Promise.all([
                HttpService.get(getStudyAssignmentDashCount, countPayload),
                HttpService.get(getSubmittedAssignmentStudentCount, listPayload),
            ]);

            const approvalResult = listRes?.data?.AssignmentSubmittedStudentCount ?? {};
            console.log(approvalResult, "approvalResult")

            setAssignmentCounts({
                courseWise: countRes?.data?.StudyAssignmentDashCount ?? [],
                assignmentWise: approvalResult ?? [],
                //   summary: {
                //     total: Number(approvalResult.Total_Count || 0),
                //     uploaded: Number(approvalResult.Upload_Count || 0),
                //     sentToStudent: Number(approvalResult.Sent_To_Student_Count || 0),
                //     rejected: Number(approvalResult.Reject_Count || 0),
                //   },
            });

        } catch (error) {
            Alert.alert(
                "Failed to Load Assignments",
                error?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }, []);




    useEffect(() => {
        getAssignmentCounts();
        GetApprovalListCount();
    }, [getAssignmentCounts]);

    const onRefresh = useCallback(() => {
        getAssignmentCounts(true);
    }, [getAssignmentCounts]);


    // --- Table Components ---
    const CourseWiseHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell, { minWidth: 50, flex: 0.5 }]}>SN</Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>Course Name</Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 1 }]}>Students</Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 1.2 }]}>Assignment</Text>
        </View>
    );

    const AssignmentWiseHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell, { minWidth: 40, flex: 0.5 }]}>SN</Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 1.5 }]}>Assignment</Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 1.5 }]}>Course Code</Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 1 }]}>Total</Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 1 }]}>Submit</Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 1 }]}>Pending</Text>
            <Text style={[styles.tableCell, styles.headerCell, { minWidth: 60, flex: 0.8 }]}>File</Text>
        </View>
    );

    const renderCourseItem = ({ item, index }) => (
        <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{item.Course_Code}</Text>

            {/* TouchableOpacity for Students */}
            <TouchableOpacity
                style={[styles.tableCell, styles.interactiveCell, { flex: 1 }]}
                onPress={() => handleOpenDetailsModal('Students', item)}>
                <Text style={styles.interactiveText}>{item.student_count}</Text>
            </TouchableOpacity>

            {/* TouchableOpacity for Assignments */}
            <TouchableOpacity
                style={[styles.tableCell, styles.interactiveCell, { flex: 1.2 }]}
                onPress={() => handleOpenDetailsModal('Assignments', item)}>
                <Text style={styles.interactiveText}>{item.assignment_count}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderAssignmentItem = ({ item, index }) => (
        <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.Study_Assingment_Title}</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.Course_Code}</Text>

            {/* TouchableOpacity for Total */}
            <TouchableOpacity
                style={[styles.tableCell, styles.interactiveCell, { flex: 1 }]}
                onPress={() => handleOpenDetailsModal('Total', item)}>
                <Text style={styles.interactiveText}>{item.studentCount}</Text>
            </TouchableOpacity>

            {/* TouchableOpacity for Submit */}
            <TouchableOpacity
                style={[styles.tableCell, styles.interactiveCell, { flex: 1 }]}
                onPress={() => handleOpenDetailsModal('Submit', item)}>
                <Text style={[styles.interactiveText, { color: item.Submit > 0 ? colors.success : colors.text }]}>{item.SubmittedAssignmentCount}</Text>
            </TouchableOpacity>

            {/* TouchableOpacity for Pending */}
            <TouchableOpacity
                style={[styles.tableCell, styles.interactiveCell, { flex: 1 }]}
                onPress={() => handleOpenDetailsModal('Pending', item)}>
                <Text style={[styles.interactiveText, { color: item.Pending > 0 ? colors.dangerD : colors.text }]}> {item.studentCount - item.SubmittedAssignmentCount}</Text>
            </TouchableOpacity>

            {/* TouchableOpacity for File */}
            <TouchableOpacity
                style={[styles.tableCell, styles.interactiveCell, { minWidth: 60, flex: 0.8 }]}
                onPress={() => handleViewFile(item.Study_Assignment_File)}>
                <FontAwesome6 name="file-pdf" size={24} color={colors.dangerD} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.body}>
            <View style={styles.container}>
                <Header />
                {/* <View style={styles.dashHeader}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <FontAwesome6 name="arrow-left" size={20} color={'#fff'} />
                    </TouchableOpacity>
                    <Text style={styles.dashTitle}>Assignment Dash Count</Text>
                </View> */}
                <CustomRefreshControl refreshing={refreshing} onRefresh={onRefresh} />

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.assignmentBanner}>
                        <View style={styles.iconCircle}>
                            <FontAwesome name="desktop" solid size={35} color={colors.primary} />
                        </View>
                        <Text style={styles.bannerText}>My Assignment</Text>
                    </View>

                    <TouchableOpacity style={styles.uploadSection} onPress={() => navigation.navigate('MyAssignmentDesh')}>
                        <FontAwesome6 name="cloud-arrow-up" solid size={30} color={'#fffffdff'} />
                        {/* <Text style={styles.uploadText}>Upload New Assignment</Text> */}
                    </TouchableOpacity>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                    ) : (
                        <>
                            {/* Course wise Count Table */}
                            <View style={styles.tableContainer}>
                                <Text style={styles.tableTitle}>Course wise Count</Text>
                                <ScrollView >
                                    <FlatList
                                        data={assignmentCounts.courseWise}
                                        keyExtractor={(item, index) => `course-${index}`}
                                        ListHeaderComponent={CourseWiseHeader}
                                        renderItem={renderCourseItem}
                                        scrollEnabled={false}
                                    />
                                </ScrollView>
                            </View>

                            {/* Assignment wise Count Table */}
                            <View style={styles.tableContainer}>
                                <Text style={styles.tableTitle}>Assignment wise Count</Text>
                                <ScrollView horizontal>
                                    <FlatList
                                        data={assignmentCounts.assignmentWise}
                                        keyExtractor={(item, index) => `assignment-${index}`}
                                        ListHeaderComponent={AssignmentWiseHeader}
                                        renderItem={renderAssignmentItem}
                                        scrollEnabled={false}
                                    />
                                </ScrollView>
                            </View>
                        </>
                    )}

                </ScrollView>
            </View>
            <FooterNav />
        </View>
    );
};

export default AssignmentDashboard;

// --- Colors and Styles Definitions (Duplicated for completeness) ---

// const colors = {
//     primary: '#007bff',
//     primaryDark: '#0056b3',
//     secondary: '#4C9A2A',
//     dangerD: '#dc3545',
//     success: '#28a745',
//     text: '#333',
//     textWhite: '#fff',
//     background: '#F5EFE6',
//     bgcolor: '#007bff',
// };

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingBottom: 100,
    },

    // --- Custom Dashboard Header ---
    dashHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#007bff',
    },
    backButton: {
        paddingRight: 10,
    },
    dashTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textWhite,
    },

    // --- Banner Styles ---
    assignmentBanner: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 5,
        borderColor: '#ADD8E6',
    },
    bannerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },

    // --- Upload Section Styles ---
    uploadSection: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
        // backgroundColor: '#e6ffe6',
        // paddingVertical: 15,
        // marginBottom: 15,
        // borderRadius: 8,
        // borderWidth: 1,
        // borderColor: '#a3e3a3',
        // marginHorizontal: 10,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.2,
        // shadowRadius: 1.41,
        // elevation: 2,




        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#f63a19c3',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 50,
        elevation: 35,
        paddingHorizontal: 15,
        paddingVertical: 15,

    },
    uploadText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.secondary,
    },

    // --- Table Styles ---
    tableContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
        marginVertical: 10,
    },
    tableTitle: {
        backgroundColor: '#f8d8d1ff',
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 15,
        textAlign: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: colors.cardcolor,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#ffffffff',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    tableCell: {
        flex: 1,
        paddingHorizontal: 5,
        textAlign: 'center',
        fontSize: 12,
        color: colors.secondary,
        minWidth: 80,
        // Important: Remove padding from touchable cells to center content correctly
    },
    // Style for touchable cells to ensure alignment and readability
    interactiveCell: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10, // Override row padding for individual touchable cell
        // Optional: Add a subtle highlight for touchable areas
        // backgroundColor: '#f9f9f9', 
    },
    interactiveText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.primaryDark, // Highlight interactive text color
    },
    headerCell: {
        fontWeight: 'bold',
        color: colors.danger,
        fontSize: 13,
    },
    loader: {
        marginTop: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
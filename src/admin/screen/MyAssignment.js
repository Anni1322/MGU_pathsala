
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Modal, TextInput, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { pick, types } from '@react-native-documents/picker';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Header from '../layout/Header/Header';
import FooterNav from '../layout/Footer/Footer';
import SessionService from '../../common/Services/SessionService';
import getAdminApiList from '../config/Api/adminApiList';
import { HttpService } from '../../common/Services/HttpService';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const sampleAssignments = [
    // {
    //     id: '1',
    //     title: 'Assignment 1',
    //     course: 'FMPE-591',
    //     dueDate: '2025-10-20',
    //     status: 'Pending',
    // },
    // {
    //     id: '2',
    //     title: 'Assignment 2',
    //     course: 'FMPE-595',
    //     dueDate: '2025-10-25',
    //     status: 'Completed',
    // },
    // {
    //     id: '3',
    //     title: 'Assignment 3',
    //     course: 'FMPE-603',
    //     dueDate: '2025-10-30',
    //     status: 'Pending',
    // },
    // {
    //     id: '4',
    //     title: 'Assignment 4',
    //     course: 'FMPE-692',
    //     dueDate: '2025-11-05',
    //     status: 'Pending',
    // },
    // {
    //     id: '4',
    //     title: 'Assignment 4',
    //     course: 'FMPE-692',
    //     dueDate: '2025-11-05',
    //     status: 'Pending',
    // },
    // {
    //     id: '4',
    //     title: 'Assignment 4',
    //     course: 'FMPE-692',
    //     dueDate: '2025-11-05',
    //     status: 'Pending',
    // },
];

const statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
];

languagelist = [
    { value: '1', label: 'Hindi' },
    { value: '2', label: 'English' },
]

const MyAssignments = ({ route }) => {
    const Myassignment = route.params.data || [] || {};
    // console.log(Myassignment, "Myassignment");
    const [assignments, setAssignments] = useState([]);
    const [filelist, setFileist] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedCourse, setSelectedCourse] = useState('All');
    const [modalVisible, setModalVisible] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        course: '',
        language: '',
        file: null,
        marks: '',
        status: 'Pending'
    });



    const [isFocusCourse, setIsFocusCourse] = useState(false);
    const [isFocusStatus, setIsFocusStatus] = useState(false);
    const [isFocusModalCourse, setIsFocusModalCourse] = useState(false);
    const [selectedModalCourse, setSelectedModalCourse] = useState(null);


    // Add these new states for the Language and File dropdowns
    const [isFocusModalLanguage, setIsFocusModalLanguage] = useState(false);
    const [selectedModalLanguage, setSelectedModalLanguage] = useState(null);
    const [isFocusModalFile, setIsFocusModalFile] = useState(false);
    const [selectedModalFile, setSelectedModalFile] = useState(null);

    // Memoize courselist to avoid recomputing on every render
    const courselist = useMemo(() => {
        let courselistData = Myassignment?.data?.CourseWiseStudentCount;
        const transformedCourselist = Array.isArray(courselistData)
            ? courselistData.map(item => ({
                label: item.Course_code || item.key || item,
                value: item.course_id || item.key || item,
            }))
            : [];
        return [{ label: 'All', value: 'All' }, ...transformedCourselist];
    }, [Myassignment]);

    // Memoize filteredAssignments to recompute only when dependencies change
    const filteredAssignments = useMemo(() => {
        let filtered = assignments;
        if (selectedStatus !== 'All') {
            filtered = filtered.filter((item) => item.status === selectedStatus);
        }
        if (selectedCourse !== 'All') {
            filtered = filtered.filter((item) => item.course === selectedCourse);
        }
        return filtered;
    }, [assignments, selectedStatus, selectedCourse]);

    useEffect(() => {
        // Initialize assignments with sample data (or fetch real data here if needed)
        setAssignments(sampleAssignments);

        getfileList();
    }, []);


    const getfileList = useCallback(async () => {
        try {
            // setStudentLoading(true);
            const Get_File_Type_MastersApi = getAdminApiList().Get_File_Type_Masters;
            if (!Get_File_Type_MastersApi) throw new Error('Student List API endpoint not found.');
            const payload = {
                Emp_Id: Myassignment?.Emp_Id,
            };
            const response = await HttpService.get(Get_File_Type_MastersApi, payload);
            // console.log(response?.data.MaterialMastersResult.File_Type_Masters, "response");
            const fileList = response?.data.MaterialMastersResult.File_Type_Masters || [];
            const file = fileList?.map(item => ({
                label: item.File_Type_Name || item.key || item,
                value: item.File_Type_ID || item.key || item,
            }));
            setFileist(file)
        } catch (error) {
            Alert.alert('Failed to Load', error?.message || 'Something went wrong');
            console.error('Student List fetch error:', error);
        } finally {
            // setStudentLoading(false);
        }
    }, []);



    const handleAssignmentClick = useCallback((assignmentId) => {
        Alert.alert(`Assignment ${assignmentId} clicked!`);
    }, []);

    const handleChange = useCallback((item, type) => {
        if (type === 'course') {
            setSelectedCourse(item.value);
        }
        if (type === 'status') {
            setSelectedStatus(item.value);
        }
    }, []);

    // const handleSubmit = useCallback(() => {
    //     const updatedAssignments = [
    //         ...assignments,
    //         { ...newAssignment, id: String(assignments.length + 1) },
    //     ];
    //     setAssignments(updatedAssignments);
    //     setModalVisible(false);
    //     setNewAssignment({ title: '', course: '', dueDate: '', status: 'Pending', file: null });
    //     setSelectedModalCourse(null);
    // }, [assignments, newAssignment]);


    const handleSubmit = () => {
        // console.log("Form Data:", newAssignment);
        //  Validation
        if (!newAssignment.title || !newAssignment.course || !newAssignment.language || !newAssignment.file || !newAssignment.marks) {
            Alert.alert("Missing Fields", "Please fill out all fields before submitting.");
            return;
        }

        // If sending to backend
        const formData = new FormData();
        formData.append("title", newAssignment.title);
        formData.append("course", newAssignment.course);
        formData.append("language", newAssignment.language);
        formData.append("marks", newAssignment.marks);
        formData.append("status", newAssignment.status);

        if (newAssignment.file && newAssignment.file.uri) {
            formData.append("file", {
                uri: newAssignment.file.uri,
                name: newAssignment.file.name || "assignment.pdf",
                type: newAssignment.file.type || "application/pdf",
            });
        }

        // API call (if needed)
        fetch(`${API_BASE_URL}/submit-assignment`, {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log("Response:", data);
                Alert.alert("Success", "Assignment submitted successfully!");
                setModalVisible(false);
                setNewAssignment({ title: '', course: '', language: '', file: null, marks: '', status: 'Pending' });
            })
            .catch((err) => {
                console.error("Error submitting:", err);
                Alert.alert("Error", "Failed to submit assignment.");
            });
    };



    const handleFilePick = useCallback(async () => {
        try {
            const res = await pick({
                type: types.pdf,
            });
            if (res?.uri) {
                setNewAssignment((prev) => ({ ...prev, file: res }));
            }
        } catch (error) {
            Alert.alert('File Picker Error', 'There was an error picking the file.');
        }
    }, []);

    const renderAssignmentItem = useCallback(({ item }) => (
        <TouchableOpacity style={styles.assignmentCard} onPress={() => handleAssignmentClick(item.id)}>
            <View style={styles.assignmentContent}>
                <Text style={styles.assignmentTitle}>{item.title}</Text>
                <Text style={styles.assignmentCourse}>Course: {item.course}</Text>
                <Text style={styles.assignmentDueDate}>Due Date: {item.dueDate}</Text>
                <Text style={[styles.assignmentStatus, { color: item.status === 'Completed' ? 'green' : 'red' }]} >
                    Status: {item.status}
                </Text>
            </View>
        </TouchableOpacity>
    ), [handleAssignmentClick]);

    return (


        <SafeAreaProvider>
            <Header />
            <View style={styles.container}>
                <Text style={styles.title}>My Assignments</Text>

                {/* Filter Section - Using Dropdown directly */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome6 name="book" size={25} style={{ marginRight: 10, marginLeft: 10 }} />
                        <Dropdown
                            style={[styles.dropdown, isFocusCourse && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={courselist}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocusCourse ? 'Select Course' : '...'}
                            searchPlaceholder="Search..."
                            value={selectedCourse}
                            onFocus={() => setIsFocusCourse(true)}
                            onBlur={() => setIsFocusCourse(false)}
                            onChange={(item) => handleChange(item, 'course')}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome6 name="clipboard-check" size={25} style={{ marginRight: 10, marginLeft: 10 }} />
                        <Dropdown
                            style={[styles.dropdown, isFocusStatus && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={statusOptions}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocusStatus ? 'Select Status' : '...'}
                            searchPlaceholder="Search..."
                            value={selectedStatus}
                            onFocus={() => setIsFocusStatus(true)}
                            onBlur={() => setIsFocusStatus(false)}
                            onChange={(item) => handleChange(item, 'status')}
                        />
                    </View>
                </View>

                {/* Filtered Assignments */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Filtered Assignments</Text>
                    {filteredAssignments.length === 0 ? (
                        <Text style={styles.noAssignments}>No assignments found</Text>
                    ) : (
                        <FlatList
                            data={filteredAssignments}
                            keyExtractor={(item) => item.id}
                            renderItem={renderAssignmentItem}
                        />
                    )}
                </View>

                {/* Floating Button */}
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.floatingButtonText}>+</Text>
                </TouchableOpacity>

                {/* Modal for Assignment Submission */}
                <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)} >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Submit New Assignment</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                {/* Dropdown for Course in Modal */}
                                <Dropdown
                                    style={[styles.dropdown, isFocusModalCourse && { borderColor: 'blue' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={courselist}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocusModalCourse ? 'Select Course' : '...'}
                                    searchPlaceholder="Search..."
                                    value={selectedModalCourse}
                                    onFocus={() => setIsFocusModalCourse(true)}
                                    onBlur={() => setIsFocusModalCourse(false)}
                                    onChange={(item) => {
                                        setSelectedModalCourse(item.value);
                                        setNewAssignment((prev) => ({ ...prev, course: item.value }));
                                    }}
                                />


                                {/* Dropdown for File in Modal */}
                                <Dropdown
                                    style={[styles.dropdown, isFocusModalFile && { borderColor: 'blue' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={filelist}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocusModalFile ? 'Select File' : '...'}
                                    searchPlaceholder="Search..."
                                    value={selectedModalFile}
                                    onFocus={() => setIsFocusModalFile(true)}
                                    onBlur={() => setIsFocusModalFile(false)}
                                    onChange={(item) => {
                                        setSelectedModalFile(item.value);
                                        setNewAssignment((prev) => ({ ...prev, file: item }));
                                    }}
                                />
                            </View>

                            {/* Dropdown for Language in Modal */}
                            <Dropdown
                                style={[styles.dropdown, isFocusModalLanguage && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={languagelist}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocusModalLanguage ? 'Select Language' : '...'}
                                searchPlaceholder="Search..."
                                value={selectedModalLanguage}
                                onFocus={() => setIsFocusModalLanguage(true)}
                                onBlur={() => setIsFocusModalLanguage(false)}
                                onChange={(item) => {
                                    setSelectedModalLanguage(item.value);
                                    setNewAssignment((prev) => ({ ...prev, language: item.value }));
                                }}
                            />


                            <TextInput style={styles.input} placeholder="Title" value={newAssignment.title} onChangeText={(text) => setNewAssignment((prev) => ({ ...prev, title: text }))} />

                            <TextInput style={styles.input} placeholder="Enter Marks" value={newAssignment.marks} onChangeText={(text) => setNewAssignment((prev) => ({ ...prev, marks: text }))} />

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#007BFF', padding: 10, borderRadius: 5, flex: 1, alignItems: 'center' }}
                                    onPress={handleFilePick} >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Select File</Text>
                                </TouchableOpacity>

                                {newAssignment.file && (
                                    <Text style={{ fontSize: 16, color: '#555', marginLeft: 10, flex: 1 }}>
                                        {newAssignment.file.name}
                                    </Text>
                                )}

                                <TouchableOpacity
                                    style={{ backgroundColor: '#28a745', padding: 10, borderRadius: 5, flex: 1, marginLeft: 10, alignItems: 'center' }}
                                    onPress={handleSubmit}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ backgroundColor: '#dc3545', padding: 10, borderRadius: 5, flex: 1, marginLeft: 10, alignItems: 'center' }}
                                    onPress={() => {
                                        setModalVisible(false);
                                        setNewAssignment({ title: '', course: '', language: '', file: null, marks: '', status: 'Pending' });
                                        setSelectedModalCourse(null);
                                        setSelectedModalLanguage(null);
                                        setSelectedModalFile(null);
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>


            </View>
            <FooterNav />
        </SafeAreaProvider>


    );
};


export default MyAssignments;


const styles = StyleSheet.create({
    body: {
        flex: 1,
        margin: 0,
        padding: 0
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 20,
    },
    fileInfo: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },

    filterSection: {
        margin: 10,
        padding: 10,
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'space-between',
        // marginBottom: 10,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
    },
    dropdown: {
        marginLeft: 10,
        marginRight: 5,
        height: 35,
        width: '50%',
        marginVertical: 5,
        backgroundColor: '#f3f4f6',
        borderRadius: 5,
    },
    section: {
        marginTop: 20,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    noAssignments: {
        fontSize: 16,
        color: '#9ca3af',
    },
    assignmentCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '100%',
    },
    assignmentContent: {
        flexDirection: 'column',
    },
    assignmentTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    assignmentCourse: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 6,
    },
    assignmentDueDate: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    assignmentStatus: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        backgroundColor: '#3498db',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    floatingButtonText: {
        fontSize: 30,
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
});

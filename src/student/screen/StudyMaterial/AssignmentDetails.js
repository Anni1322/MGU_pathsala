// studyMaterialsDetails.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Linking, ImageBackground, Platform } from 'react-native';
import Header from '../../layout/Header/Header2';
import FooterNav from '../../layout/Footer/Footer';
import SessionService from '../../../common/Services/SessionService';
import getApiList from '../../config/Api/ApiList';
import { HttpService } from '../../../common/Services/HttpService';
import { downloadFileOther } from "../../../common/Services/pdfService";
import alertService from '../../../common/Services/alert/AlertService';
import { API_BASE_URL } from '../../../common/config/BaseUrl';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const StudyMaterialItem = React.memo(({ item, onLike, onDislike, onComment, onDownload }) => {
    const handleViewFile = () => {
        // Assuming Study_Material_File is a URL or path
        const fileUrl = API_BASE_URL + '/' + item.Study_Material_File;
        downloadFileOther(fileUrl);
        if (fileUrl) {
            Linking.openURL(fileUrl).catch(err => Alert.alert('Error', 'Cannot open file'));
        } else {
            Alert.alert('Error', 'File not available');
        }
    };





    return (
        <View style={styles.materialItem}>
            <View style={styles.actionsRowCard}>
                <Text style={styles.materialTitle}>{item.Study_Material_Title}</Text>
                <Text style={styles.materialDetails}>Course Code: {item.Course_Code}</Text>
                <Text style={styles.materialDetails}>Uploaded by: {item.Employee_Name} ({item.Post_Name})</Text>
                <Text style={styles.materialDetails}>Office: {item.Office_Short_Name}</Text>
                <Text style={styles.materialDetails}>Upload Date: {item.Upload_Date}</Text>
                <Text style={styles.materialDetails}>Language: {item.Content_Language}</Text>
            </View>
            <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleViewFile}>
                    <Text style={styles.actionText}>View File</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => onLike(item.Study_Material_ID)}>
                    <Text style={styles.actionText}>👍 {item.mlike}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => onDislike(item.Study_Material_ID)}>
                    <Text style={styles.actionText}>👎 {item.mdislike}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => onComment(item.Study_Material_ID)}>
                    <Text style={styles.actionText}>💬 {item.comments}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const StudyMaterialsDetails = ({ navigation, route }) => {
    const { empId, empName, chapterId } = route.params || {};

    const [studyMaterials, setStudyMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);


    const fetchStudyMaterialsDetails = useCallback(async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const sessionData = await SessionService.getSession();
            console.log(sessionData, "sessionData")
            const payload = {
                Emp_Id: empId,
                Course_ID: route.params.course_id,
                Student_Id: sessionData?.STUDENT_ID,
                LOGIN_TYPE: sessionData[0]?.LOGIN_TYPE || 'R',
            };
            console.log(payload, "payload fetchStudyMaterialsDetails")

            const apiEndpoint = getApiList().GetStudyMaterialList;
            if (!apiEndpoint) {
                throw new Error('API endpoint GetStudyMaterialList not found.');
            }
            const response = await HttpService.post(apiEndpoint, payload);
            console.log(response, "response")
            const materials = response?.data?.StudyMaterialList || [];
            if (materials.length > 0) {
                setStudyMaterials(materials);
            } else {
                setStudyMaterials([]);
            }
        } catch (error) {
            setHasError(true);
            setStudyMaterials([]);
            Alert.alert('Load Failed ⚠️', error.message || 'Could not fetch study materials details.');
            console.error('Study Materials Details fetch error:', error);
            // setStudyMaterials(dummyMaterials);
        } finally {
            setIsLoading(false);
        }
    }, [empId, chapterId]);

    useEffect(() => {
        fetchStudyMaterialsDetails();
    }, [fetchStudyMaterialsDetails]);

    const handleLike = (materialId) => {
        // Implement like functionality, e.g., call API to like
        // Alert.alert('Like', `Liked material ${materialId}`);
    };

    const handleDislike = (materialId) => {
        // Implement dislike functionality
        // Alert.alert('Dislike', `Disliked material ${materialId}`);
    };

    const handleComment = (materialId) => {
        // Navigate to comments page or show comments
        // Alert.alert('Comments', `View comments for material ${materialId}`);
    };

    const handleDownload = (item) => {
        const filePath = item.Study_Material_File;
        if (!filePath) {
            Alert.alert('Error', 'File path not available');
            return;
        }
        const fullUrl = `${API_BASE_URL}${filePath}`;
        // Extract file extension
        const extension = filePath.split('.').pop().toLowerCase();
        const fileName = `${item.Study_Material_Title.replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`;
        // Call downloadFile with fullUrl and fileName
        downloadFile(fullUrl, fileName, navigation);
    };
    const materialCount = studyMaterials.length;
    const hasMaterials = materialCount > 0;
    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#1a478b" />
                <Text style={styles.loadingText}>Loading Study Materials...</Text>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#ffffffff','#D3DFFF', '#E5D5FF', '#EECDA3']}
             start={{ x: 1, y: 0 }} 
             end={{ x: 2, y: 2 }} 
            style={styles.container}
        >

        {/* <ImageBackground
            source={require('../../../../assets/bg/Dark.png')}
            style={styles.container}
            imageStyle={styles.imageStyle}> */}

            <View style={styles.container}>
                <Header />
                {/* <Text style={styles.headerTitle}>📚 Study Materials for {empName || 'Employee'}</Text> */}
                <Text style={styles.headerTitle}>📚 Study Materials</Text>
                {hasError ? (
                    <View style={[styles.centerContent, styles.errorContainer]}>
                        <Text style={styles.errorText}>Failed to load data. Please check your connection.</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchStudyMaterialsDetails}>
                            <Text style={styles.buttonText}>Tap to Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <Text style={styles.headerSubtitle}>
                            {hasMaterials
                                ? `Showing ${materialCount} Material${materialCount > 1 ? 's' : ''}`
                                : 'No Study Materials Found'
                            }
                        </Text>
                        <View style={styles.listWrapper}>
                            {hasMaterials ? (
                                <FlatList
                                    data={studyMaterials}
                                    keyExtractor={(item) => item.Study_Material_ID.toString()}
                                    renderItem={({ item }) => (
                                        <StudyMaterialItem
                                            item={item}
                                            onLike={handleLike}
                                            onDislike={handleDislike}
                                            onComment={handleComment}
                                            onDownload={handleDownload}
                                        />
                                    )}
                                    contentContainerStyle={styles.flatListContent}
                                />
                            ) : (
                                <Text style={styles.noDataText}>
                                    There are currently no study materials available.
                                </Text>
                            )}
                        </View>
                    </>
                )}
                <FooterNav navigation={navigation} />
            </View>


        {/* </ImageBackground> */}
     </LinearGradient> 

    );
};

export default StudyMaterialsDetails;

const styles = StyleSheet.create({
    textContainer: {
        backgroundColor: 'rgba(241, 66, 66, 0.5)',
        padding: 20,
        borderRadius: 10,
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },


    container: {
        flex: 1,
        backgroundColor: '#d1cccb5d',
        padding: -0,
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
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    headerTitle: {
        fontSize: 18,
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


    materialItem: {
        backgroundColor: '#ffffffff',
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        shadowColor: '#000000ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        // elevation: 3,
    },
    materialTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#5010aaff',
        marginBottom: 10,
    },
    materialDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    actionsRowCard: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ff7070ff',
        flexWrap: 'wrap',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // marginTop: 15,
        // paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexWrap: 'wrap',
    },
    actionButton: {
        backgroundColor: '#94935e61',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 15,
        // marginHorizontal: 2,
        marginVertical: 2,
    },
    actionText: {
        color: '#0a0000ff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    },
});
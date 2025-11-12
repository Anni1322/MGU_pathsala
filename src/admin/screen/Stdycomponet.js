import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { PermissionsAndroid } from 'react-native';

const AdminExamination = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Request permission for external storage access on Android (if required)
    const requestPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Permission Required',
                    message: 'This app needs access to your storage to read files.',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log('Storage permission granted');
            } else {
                // console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    // Function to open the folder and get files
  const openFolder = async () => {
    setLoading(true);
    try {
        // Request permission if accessing external storage on Android
        if (Platform.OS === 'android') {
            await requestPermissions();
        }

        // Define the base path where the file was saved
        let basePath;
        if (Platform.OS === 'android') {
            basePath = RNFS.DownloadDirectoryPath;
        } else {
            basePath = RNFS.DocumentDirectoryPath || RNFS.ExternalDirectoryPath;
        }

        const folderName = 'IGKV'; // Folder where the file is saved
        const folderPath = `${basePath}/${folderName}`;
        // console.log('Opening folder:', folderPath);

        // Read all files in the specified folder
        const fileList = await RNFS.readDir(folderPath);
        // console.log('Files in the folder:', fileList);

        setFiles(fileList); // Store the file data in the state (or handle it as needed)

    } catch (error) {
        console.error("Error opening folder:", error);
    } finally {
        setLoading(false);
    }
};


    // Function to share a file
    const shareFile = async (filePath) => {
        try {
            // Check if the file exists
            const fileExists = await RNFS.exists(filePath);
            if (!fileExists) {
                console.error("File does not exist:", filePath);
                return;
            }
            const isPDF = filePath.toLowerCase().endsWith('.pdf');
            const mimeType = isPDF ? 'application/pdf' : 'application/octet-stream';
            const fileUrl = `file://${filePath}`;
            const shareOptions = {
                title: 'Share File',
                url: fileUrl,
                type: mimeType,
            };
            await Share.open(shareOptions)
                .then((res) => console.log('Shared successfully!', res))
                .catch((err) => console.error('Error sharing: ', err));
        } catch (error) {
            console.error("Error sharing file:", error);
        }
    };
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Button title="Open Folder" onPress={openFolder} />
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={files}
                    keyExtractor={(item) => item.path}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => shareFile(item.path)}>
                            <View style={{ marginBottom: 10 }}>
                                <Text>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default AdminExamination;

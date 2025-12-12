// import RNFS from "react-native-fs";
// import { Platform, Alert, PermissionsAndroid } from "react-native";
// import FileViewer from "react-native-file-viewer";
// import Share from "react-native-share";
// // Assuming these are custom imports you want to keep
// import requestAndroidPermission from "../Services/requestStoragePermission" 
// // import alertService from '../Services/alert/AlertService'; 


// /**
//  * Opens a local file using FileViewer or falls back to the system's Share dialog.
//  * @param {string} filePath - The local path to the file.
//  * @param {string} mimeType - The file's MIME type (optional, for better sharing fallback).
//  */
// const openFile = async (filePath, mimeType = undefined) => {
//   try {
//     const exists = await RNFS.exists(filePath);
//     if (!exists) {
//       Alert.alert("Error", "File not found at local path.");
//       return;
//     }

//     // Rely on the file extension for opening the correct app
//     await FileViewer.open(filePath, { showOpenWithDialog: true });

//   } catch (err) {
//     console.warn("FileViewer failed, trying share...", err);

//     // Fallback: share the file
//     try {
//       await Share.open({
//         url: Platform.OS === "android" ? `file://${filePath}` : filePath,
//         type: mimeType, 
//         failOnCancel: false,
//       });
//     } catch (shareErr) {
//       console.error("Open File Error:", shareErr);
//       Alert.alert(
//         "Error",
//         "No app found to open this file. Please install a suitable viewer."
//       );
//     }
//   }
// };


// /**
//  * Downloads a file of ANY type, saves it locally using its original file name,
//  * and opens it using the system's file viewer.
//  * @param {string} fileUrl - The URL of the file to download.
//  * @param {string} originalFileName - The name of the file (e.g., 'document.docx'). MUST include the extension.
//  * @param {string} folderName - The subfolder to save the file in (e.g., 'Downloads').
//  * @param {string} mimeType - The file's MIME type (optional, e.g., 'image/png').
//  * @param {any} navigation - The navigation object (kept for compatibility).
//  */
// export const downloadFile = async (
//   fileUrl,
//   originalFileName,
//   folderName = "Mguvv", 
//   mimeType = undefined, 
//   navigation = null
// ) => {
//   if (!fileUrl || !originalFileName) {
//     Alert.alert("Download failed", "Invalid file URL or file name");
//     return;
//   }

//   // 1. Prepare File Name and Paths
//   const fileName = originalFileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");

//   try {

//     // 2. Storage Permission Check (Android)
//     if (Platform.OS === "android") {
//       const granted = await  requestAndroidPermission()
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         Alert.alert("Permission Denied", "Cannot save file without storage access");
//         return;
//       }
//     }

//     const basePath = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
//     const folderPath = `${basePath}/${folderName}`;
//     const localFile = `${folderPath}/${fileName}`;

//     // 3. Create Folder
//     if (!(await RNFS.exists(folderPath))) {
//       await RNFS.mkdir(folderPath);
//     }

//     // 4. Check for Existing File
//     if (await RNFS.exists(localFile)) {
//       await openFile(localFile, mimeType);
//       Alert.alert("File Already Exists", `Opening ${fileName} from ${folderName} folder.`);
//       return;
//     }

//     // 5. Download the File
//     const downloadResult = await RNFS.downloadFile({
//       fromUrl: fileUrl,
//       toFile: localFile,
//     }).promise;

//     // 6. Handle Result and Open
//     if (downloadResult.statusCode === 200) {
//       Alert.alert("Download Successful", `Saved as ${fileName} in ${folderName} folder.`);
//       await openFile(localFile, mimeType);
//     } else {
//       await RNFS.unlink(localFile).catch(() => {}); // Clean up failed download
//       throw new Error(`Failed with status code: ${downloadResult.statusCode}`);
//     }
//   } catch (error) {
//     console.error("Download failed:", error);
//     Alert.alert("Download failed", error.message || "Try again after some time");
//   }
// };







// import { PDFDocument, rgb } from "pdf-lib";
// import RNFS from "react-native-fs";
// import { Platform, Alert, PermissionsAndroid } from "react-native";
// import FileViewer from "react-native-file-viewer";
// import Share from "react-native-share";
// import requestAndroidPermission from "../Services/requestStoragePermission"
// import alertService from '../Services/alert/AlertService';




// export const downloadFile = async (transcriptUrl, fileIdentifier = 1, navigation) => {
//   if (!transcriptUrl) {
//     Alert.alert("Download failed", "Invalid file URL");
//     return;
//   }


//   const baseFileName = typeof fileIdentifier === "number" ? `SRC${fileIdentifier}` : `${fileIdentifier.replace(/\.pdf$/, "")}`;
//   const fileName = `${baseFileName}.pdf`;
//   const folderName = "Mguvv";


//   try {
//     if (Platform.OS === "android") {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//       );
//       if (granted === false) {
//         Alert.alert("Permission Denied", "Cannot save file without storage access");
//         return;
//       }
//     }

//     const basePath = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
//     const folderPath = `${basePath}/${folderName}`;
//     const localFile = `${folderPath}/${fileName}`;

//     if (!(await RNFS.exists(folderPath))) {
//       await RNFS.mkdir(folderPath);
//     }

//     // Check if the file already exists
//     if (await RNFS.exists(localFile)) {
//       // File exists, just open it
//       await openPDF(localFile);
//       Alert.alert("File Already Exists", `Opening ${fileName} from mguvv folder.`);
//       return;
//     }

//     // File does not exist, proceed to download
//     const downloadResult = await RNFS.downloadFile({
//       fromUrl: transcriptUrl,
//       toFile: localFile,
//     }).promise;

//     if (downloadResult.statusCode === 200) {
//       Alert.alert("Download Successful", `Saved as ${fileName} in mguvv folder.`);
//       await openPDF(localFile);  // Pass the file path (localFile)
//     } else {
//       throw new Error(`Failed with status code: ${downloadResult.statusCode}`);
//     }
//   } catch (error) {
//     console.error("Download failed:", error);
//     Alert.alert("Download failed", "Try again after some time");
//     // Alert.alert("Download failed", error.message || "Failed to download file.");
//   }
// };


// export const downloadFileOther = async (transcriptUrl, fileIdentifier = 1, navigation) => {
//   if (!transcriptUrl) {
//     Alert.alert("Download failed", "Invalid file URL");
//     return;
//   }


//   const baseFileName = typeof fileIdentifier === "number" ? `_${fileIdentifier}` : `${fileIdentifier.replace(/\.pdf$/, "")}`;
//   const fileName = `${baseFileName}.pdf`;
//   const folderName = "MGUVV";


//   try {
//     if (Platform.OS === "android") {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//       );
//       if (granted === false) {
//         Alert.alert("Permission Denied", "Cannot save file without storage access");
//         return;
//       }
//     }

//     const basePath = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
//     const folderPath = `${basePath}/${folderName}`;
//     const localFile = `${folderPath}/${fileName}`;

//     if (!(await RNFS.exists(folderPath))) {
//       await RNFS.mkdir(folderPath);
//     }

//     // Check if the file already exists
//     if (await RNFS.exists(localFile)) {
//       // File exists, just open it
//       await openPDF(localFile);
//       Alert.alert("File Already Exists", `Opening ${fileName} from MGUVV folder.`);
//       return;
//     }

//     // File does not exist, proceed to download
//     const downloadResult = await RNFS.downloadFile({
//       fromUrl: transcriptUrl,
//       toFile: localFile,
//     }).promise;

//     if (downloadResult.statusCode === 200) {
//       Alert.alert("Download Successful", `Saved as ${fileName} in mguvv folder.`);
//       await openPDF(localFile);  // Pass the file path (localFile)
//     } else {
//       throw new Error(`Failed with status code: ${downloadResult.statusCode}`);
//     }
//   } catch (error) {
//     console.error("Download failed:", error);
//     Alert.alert("Download failed", "Try again after some time");
//     // Alert.alert("Download failed", error.message || "Failed to download file.");
//   }
// };


// const openPDF = async (filePath) => {
//   try {
//     const exists = await RNFS.exists(filePath);
//     if (!exists) {
//       Alert.alert("Error", "PDF file not found");
//       return;
//     }
//     await FileViewer.open(filePath, { showOpenWithDialog: true });
//   } catch (err) {
//     console.warn("FileViewer failed, trying share...", err);

//     // Fallback: share PDF so user can open with any app
//     try {
//       await Share.open({
//         url: Platform.OS === "android" ? `file://${filePath}` : filePath,
//         type: "application/pdf",
//         failOnCancel: false,
//       });
//     } catch (shareErr) {
//       console.error("Open PDF Error:", shareErr);
//       Alert.alert(
//         "Error",
//         "No app found to open this PDF. Please install a PDF reader."
//       );
//     }
//   }
// };













import { PDFDocument, rgb } from "pdf-lib";
import RNFS from "react-native-fs";
import { Platform, Alert, PermissionsAndroid } from "react-native";
import FileViewer from "react-native-file-viewer";
import Share from "react-native-share";
import requestAndroidPermission from "../Services/requestStoragePermission"
import alertService from '../Services/alert/AlertService';

 
export const downloadFile = async (transcriptUrl, fileIdentifier = 1, navigation, extension) => {
    if (!transcriptUrl) {
        Alert.alert("Download failed", "Invalid file URL");
        return;
    }

    let finalExtension = extension;
    let baseFileName = '';

    // --- LOGIC TO DETERMINE FILENAME AND EXTENSION ---
    if (typeof fileIdentifier === "string") {
        const parts = fileIdentifier.split('.');
        
        if (!extension && parts.length > 1) {
            // Case 1: No extension passed, but fileIdentifier has one (e.g., 'xyz.word')
            finalExtension = parts.pop(); // 'word'
            baseFileName = parts.join('.'); // 'xyz'
        } else if (extension) {
             // Case 2: An extension was explicitly passed (e.g., downloadFile(..., 'xyz.word', null, 'pdf'))
             // We still try to remove any existing extension from the identifier
             baseFileName = fileIdentifier.replace(new RegExp(`\\.${finalExtension}$`, 'i'), "");
        } else {
            // Case 3: Identifier is a string but has no extension (e.g., 'document')
            baseFileName = fileIdentifier;
        }
    } else {
        // If fileIdentifier is a number (your fallback logic)
        baseFileName = `SRC${fileIdentifier}`;
        finalExtension = finalExtension || 'pdf'; // Default to PDF for numbered files
    }

    // Construct the final file name (e.g., 'xyz.word')
    const fileName = finalExtension ? `${baseFileName}.${finalExtension}` : baseFileName;
    const folderName = "Mguvv";
    // --- END LOGIC ---


    try {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            if (granted === false) {
                Alert.alert("Permission Denied", "Cannot save file without storage access");
                return;
            }
        }

        const basePath = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
        const folderPath = `${basePath}/${folderName}`;
        const localFile = `${folderPath}/${fileName}`; // localFile will be .../Mguvv/xyz.word

        if (!(await RNFS.exists(folderPath))) {
            await RNFS.mkdir(folderPath);
        }

        // Check if the file already exists
        if (await RNFS.exists(localFile)) {
            // File exists, just open it
            // NOTE: If finalExtension is NOT 'pdf', you must use a different opening utility here!
            await openPDF(localFile); 
            Alert.alert("File Already Exists", `Opening ${fileName} from mguvv folder.`);
            return;
        }

        // File does not exist, proceed to download
        const downloadResult = await RNFS.downloadFile({
            fromUrl: transcriptUrl,
            toFile: localFile,
        }).promise;

        if (downloadResult.statusCode === 200) {
            Alert.alert("Download Successful", `Saved as ${fileName} in mguvv folder.`);
            // NOTE: If finalExtension is NOT 'pdf', you must use a different opening utility here!
            await openPDF(localFile); 
        } else {
            throw new Error(`Failed with status code: ${downloadResult.statusCode}`);
        }
    } catch (error) {
        console.error("Download failed:", error);
        Alert.alert("Download failed", "Try again after some time");
        // Alert.alert("Download failed", error.message || "Failed to download file.");
    }
};

// export const downloadFile = async (transcriptUrl, fileIdentifier = 1, navigation, extension = 'pdf') => {
//   if (!transcriptUrl) {
//     Alert.alert("Download failed", "Invalid file URL");
//     return;
//   }

//   const baseFileName = typeof fileIdentifier === "number" ? `SRC${fileIdentifier}` : `${fileIdentifier.replace(new RegExp(`\\.${extension}$`, 'i'), "")}`;
//   const fileName = `${baseFileName}.${extension}`;
//   const folderName = "Mguvv";

//   try {
//     if (Platform.OS === "android") {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//       );
//       if (granted === false) {
//         Alert.alert("Permission Denied", "Cannot save file without storage access");
//         return;
//       }
//     }

//     const basePath = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
//     const folderPath = `${basePath}/${folderName}`;
//     const localFile = `${folderPath}/${fileName}`;

//     if (!(await RNFS.exists(folderPath))) {
//       await RNFS.mkdir(folderPath);
//     }

//     // Check if the file already exists
//     if (await RNFS.exists(localFile)) {
//       // File exists, just open it
//       await openPDF(localFile);  // Note: This assumes openPDF works for non-PDF files; you may need to adjust for other extensions
//       Alert.alert("File Already Exists", `Opening ${fileName} from mguvv folder.`);
//       return;
//     }

//     // File does not exist, proceed to download
//     const downloadResult = await RNFS.downloadFile({
//       fromUrl: transcriptUrl,
//       toFile: localFile,
//     }).promise;

//     if (downloadResult.statusCode === 200) {
//       Alert.alert("Download Successful", `Saved as ${fileName} in mguvv folder.`);
//       await openPDF(localFile);  
//     } else {
//       throw new Error(`Failed with status code: ${downloadResult.statusCode}`);
//     }
//   } catch (error) {
//     console.error("Download failed:", error);
//     Alert.alert("Download failed", "Try again after some time");
//     // Alert.alert("Download failed", error.message || "Failed to download file.");
//   }
// };



// export const downloadFile = async (transcriptUrl, fileIdentifier = 1, navigation) => {
//   if (!transcriptUrl) {
//     Alert.alert("Download failed", "Invalid file URL");
//     return;
//   }


//   const baseFileName = typeof fileIdentifier === "number" ? `SRC${fileIdentifier}` : `${fileIdentifier.replace(/\.pdf$/, "")}`;
//   const fileName = `${baseFileName}.pdf`;
//   const folderName = "Mguvv";


//   try {
//     if (Platform.OS === "android") {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//       );
//       if (granted === false) {
//         Alert.alert("Permission Denied", "Cannot save file without storage access");
//         return;
//       }
//     }

//     const basePath = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
//     const folderPath = `${basePath}/${folderName}`;
//     const localFile = `${folderPath}/${fileName}`;

//     if (!(await RNFS.exists(folderPath))) {
//       await RNFS.mkdir(folderPath);
//     }

//     // Check if the file already exists
//     if (await RNFS.exists(localFile)) {
//       // File exists, just open it
//       await openPDF(localFile);
//       Alert.alert("File Already Exists", `Opening ${fileName} from mguvv folder.`);
//       return;
//     }

//     // File does not exist, proceed to download
//     const downloadResult = await RNFS.downloadFile({
//       fromUrl: transcriptUrl,
//       toFile: localFile,
//     }).promise;

//     if (downloadResult.statusCode === 200) {
//       Alert.alert("Download Successful", `Saved as ${fileName} in mguvv folder.`);
//       await openPDF(localFile);  // Pass the file path (localFile)
//     } else {
//       throw new Error(`Failed with status code: ${downloadResult.statusCode}`);
//     }
//   } catch (error) {
//     console.error("Download failed:", error);
//     Alert.alert("Download failed", "Try again after some time");
//     // Alert.alert("Download failed", error.message || "Failed to download file.");
//   }
// };


export const downloadFileOther = async (transcriptUrl, fileIdentifier = 1, navigation) => {
  if (!transcriptUrl) {
    Alert.alert("Download failed", "Invalid file URL");
    return;
  }


  const baseFileName = typeof fileIdentifier === "number" ? `_${fileIdentifier}` : `${fileIdentifier.replace(/\.pdf$/, "")}`;
  const fileName = `${baseFileName}.pdf`;
  const folderName = "MGUVV";


  try {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === false) {
        Alert.alert("Permission Denied", "Cannot save file without storage access");
        return;
      }
    }

    const basePath = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
    const folderPath = `${basePath}/${folderName}`;
    const localFile = `${folderPath}/${fileName}`;

    if (!(await RNFS.exists(folderPath))) {
      await RNFS.mkdir(folderPath);
    }

    // Check if the file already exists
    if (await RNFS.exists(localFile)) {
      // File exists, just open it
      await openPDF(localFile);
      Alert.alert("File Already Exists", `Opening ${fileName} from MGUVV folder.`);
      return;
    }

    // File does not exist, proceed to download
    const downloadResult = await RNFS.downloadFile({
      fromUrl: transcriptUrl,
      toFile: localFile,
    }).promise;

    if (downloadResult.statusCode === 200) {
      Alert.alert("Download Successful", `Saved as ${fileName} in mguvv folder.`);
      await openPDF(localFile);  // Pass the file path (localFile)
    } else {
      throw new Error(`Failed with status code: ${downloadResult.statusCode}`);
    }
  } catch (error) {
    console.error("Download failed:", error);
    Alert.alert("Download failed", "Try again after some time");
    // Alert.alert("Download failed", error.message || "Failed to download file.");
  }
};


const openPDF = async (filePath) => {
  try {
    const exists = await RNFS.exists(filePath);
    if (!exists) {
      Alert.alert("Error", "PDF file not found");
      return;
    }
    await FileViewer.open(filePath, { showOpenWithDialog: true });
  } catch (err) {
    console.warn("FileViewer failed, trying share...", err);

    // Fallback: share PDF so user can open with any app
    try {
      await Share.open({
        url: Platform.OS === "android" ? `file://${filePath}` : filePath,
        type: "application/pdf",
        failOnCancel: false,
      });
    } catch (shareErr) {
      console.error("Open PDF Error:", shareErr);
      Alert.alert(
        "Error",
        "No app found to open this PDF. Please install a PDF reader."
      );
    }
  }
};





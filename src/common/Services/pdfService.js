
import { PDFDocument, rgb } from "pdf-lib";
import RNFS from "react-native-fs";
import { Platform, Alert, PermissionsAndroid } from "react-native";
import FileViewer from "react-native-file-viewer";
import Share from "react-native-share";
import requestAndroidPermission from "../Services/requestStoragePermission"
import alertService from '../Services/alert/AlertService';



/**
 * Open PDF in any installed PDF reader or fallback to share
 */
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

/**
 * Generate, save, and open PDF
 * @param {string} fileName - PDF file name without extension
 * @param {Array<{text: string, x: number, y: number, size: number, color?: [number, number, number]}>} content
 * @param {string} folderName - Optional folder name inside Documents/Downloads
 */


export const generateAndOpenPDF = async (
  fileName,
  content = [],
  folderName = "E Krishi Pathsala"  // Default is now IGKV
) => {
  try {
    // Request permission (Android)
    // console.log("ok")
    const hasPermission = await requestAndroidPermission();
    // console.log(hasPermission, "access")
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Cannot save PDF without storage permission"
      );
      return;
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    content.forEach((item) => {
      page.drawText(item.text, {
        x: item.x,
        y: item.y,
        size: item.size,
        color: item.color ? rgb(...item.color) : rgb(0, 0, 0),
      });
    });

    // Save PDF as Base64
    const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: false });

    // Define base path
    let basePath;
    if (Platform.OS === "android") {
      basePath = RNFS.DownloadDirectoryPath;  // e.g., /storage/emulated/0/Download
    } else {
      basePath = RNFS.DocumentDirectoryPath;
    }

    // Final folder + file path
    const folderPath = `${basePath}/${folderName}`;
    const filePath = `${folderPath}/${fileName}.pdf`;

    // Create folder if it doesn't exist
    const folderExists = await RNFS.exists(folderPath);
    if (!folderExists) {
      await RNFS.mkdir(folderPath);
      // console.log("PDF folder created at:", folderPath);
    }

    // Write the PDF file
    await RNFS.writeFile(filePath, pdfBase64, "base64");

    // Success alert
    Alert.alert("PDF Saved Successfully", `Saved to: ${filePath}`, [
      { text: "OK" },
    ]);

  } catch (error) {
    console.error("PDF Generation Error:", error);
    Alert.alert(
      "Error",
      `Failed to create or open PDF: ${error.message}\nCheck console for details.`
    );
  }
};



export const downloadDF = async (transcriptUrl, fileIdentifier = 1, navigation) => {
  if (!transcriptUrl) {
    Alert.alert("Download failed", "Invalid file URL");
    return;
  }

  const baseFileName = typeof fileIdentifier === "number" ? `SRC${fileIdentifier}` : `${fileIdentifier.replace(/\.pdf$/, "")}`;
  const fileName = `${baseFileName}.pdf`;
  const folderName = "IGKV";

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
      Alert.alert("File Already Exists", `Opening ${fileName} from IGKV folder.`);
      return;
    }

    // File does not exist, proceed to download
    const downloadResult = await RNFS.downloadFile({
      fromUrl: transcriptUrl,
      toFile: localFile,
    }).promise;

    if (downloadResult.statusCode === 200) {
      Alert.alert("Download Successful", `Saved as ${fileName} in IGKV folder.`);
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





// import RNBlobUtil from 'react-native-blob-util';

// export const downloadDF = async (transcriptUrl, fileIdentifier = 1, navigation) => {
//   if (!transcriptUrl) {
//     Alert.alert("Download failed", "Invalid file URL");
//     return;
//   }

//   const baseFileName = typeof fileIdentifier === "number"
//     ? `SRC${fileIdentifier}`
//     : `${fileIdentifier.replace(/\.pdf$/, "")}`;
//   const fileName = `${baseFileName}.pdf`;
//   const folderName = "IGKV";

//   try {
//     // Handle permission (Android only)
//     if (Platform.OS === "android" && Platform.Version <= 28) {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         Alert.alert("Permission Denied", "Cannot save file without storage access");
//         return;
//       }
//     }

//     // Use system Download Manager on Android 10+
//     if (Platform.OS === 'android' && Platform.Version >= 29) {
//       await RNBlobUtil.config({
//         addAndroidDownloads: {
//           useDownloadManager: true,
//           notification: true,
//           mime: 'application/pdf',
//           title: fileName,
//           description: 'Downloading PDF...',
//           path: `${RNBlobUtil.fs.dirs.DownloadDir}/${fileName}`,
//           mediaScannable: true,
//         },
//       }).fetch('GET', transcriptUrl);
//       // await openPDF(transcriptUrl);
//       Alert.alert("Download Complete", `Saved as ${fileName} in Downloads.`);
//       return;
//     }

//     // For older Android and iOS
//     const basePath =
//       Platform.OS === "android"
//         ? RNFS.DownloadDirectoryPath
//         : RNFS.DocumentDirectoryPath;
//     const folderPath = `${basePath}/${folderName}`;
//     const localFile = `${folderPath}/${fileName}`;

//     if (!(await RNFS.exists(folderPath))) {
//       await RNFS.mkdir(folderPath);
//     }

//     const downloadResult = await RNFS.downloadFile({
//       fromUrl: transcriptUrl,
//       toFile: localFile,
//     }).promise;
//     console.log(downloadResult.statusCode === 200, "ok")
//     if (downloadResult.statusCode === 200) {
//       Alert.alert("Download Successful", `Saved as ${fileName}`);
//       // console.log("ok")
//       await openPDF(localFile);
//     } else {
//       throw new Error(`Failed with status code: ${downloadResult.statusCode}`);
//     }
//   } catch (error) {
//     console.error("Download failed:", error);
//     Alert.alert("Download failed", error.message || "Failed to download file.");
//   }
// };

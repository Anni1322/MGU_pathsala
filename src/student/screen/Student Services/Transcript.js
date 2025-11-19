import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, FlatList, Share } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import alertService from '../../../common/Services/alert/AlertService';
import { HttpService } from "../../../common/Services/HttpService";
import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import SessionService from '../../../common/Services/SessionService';
import Loading from '../../../common/Services/Loading'; // Assuming this is a spinner component
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../../common/config/BaseUrl';
import { downloadFile } from "../../../common/Services/pdfService";

const Transcript = () => {
  const [transcriptUrl, setTranscriptUrl] = useState(null);
  const [studentdetail, setStudentdetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  
  const handleDownloadPDF = async (id) => {
    setLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const payload = {
        STUDENT_ID: sessionData?.STUDENT_ID,
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        U_ID: sessionData?.STUDENT_ID,
      };
      const apiList = getApiList();
      const response = await HttpService.post(apiList?.getTranscriptPath, payload);
      const filePath = response?.data?.TranscriptPathRes?.File_Path;
      if (!filePath) {
        throw new Error('No file path returned from API.');
      }
      const baseUrl = API_BASE_URL.replace(/\/$/, '');
      const fullUrl = `${baseUrl}/${filePath.replace(/^\//, '')}`;
      const downloadResult = await downloadFile(fullUrl, 'transcript.pdf');
      const newFile = {
        name: 'transcript.pdf',
        path: downloadResult?.localPath || fullUrl
      };
      setFiles([newFile]);
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert(
        'Transcript Download Failed',
        error?.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
      <Header />
      <Text style={styles.header}>Transcript Download</Text>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Click to Download</Text>
          <View style={styles.infoRow}>
            <TouchableOpacity
              onPress={handleDownloadPDF}
              disabled={loading} // Disable button during loading
              style={[styles.downloadButton, loading && styles.disabledButton]}
              accessibilityLabel="Download Transcript PDF"
              accessibilityHint="Tap to download your transcript as a PDF"
            >
              <FontAwesome6 name="download" size={30} color={loading ? "#ccc" : "#c70000ff"} />
              {loading && <Text style={styles.buttonText}>Downloading...</Text>}
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <Loading /> {/* Use the imported Loading component */}
              <Text style={styles.loadingText}>Please wait while we prepare your download...</Text>
            </View>
          ) : (
            <FlatList
              data={files}
              keyExtractor={(item) => item.path}
              // renderItem={({ item }) => (
              //   <TouchableOpacity
              //     onPress={() => shareFile(item.path)}
              //     style={styles.fileRow}
              //     accessibilityLabel={`Share ${item.name}`}
              //     accessibilityHint="Tap to share this PDF file"
              //   >
              //     <FontAwesome6 name="file-pdf" size={18} color="#c70000ff" style={styles.fileIcon} />
              //     <Text style={styles.fileText}>{item.name}</Text>
              //     <FontAwesome6 name="share" size={16} color="#636e72" />
              //   </TouchableOpacity>
              // )}
              contentContainerStyle={files.length === 0 ? styles.emptyList : { paddingBottom: 20 }}
            // ListEmptyComponent={<Text style={styles.emptyText}>No files downloaded yet.</Text>}
            />
          )}
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#b19702ff',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    borderRadius: 10,
    margin: 10,
    padding: 15,
    textAlign: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: '#eeeeeeff',
    borderRadius: 15,
    padding: 20,
    width: '90%', // More responsive
    flex: 1, // Dynamic height
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#8500baff',
  },
  infoRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#636e72',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#636e72',
    marginTop: 10,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#c4dfffff',
    borderRadius: 10,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fileIcon: {
    marginRight: 10,
  },
  fileText: {
    fontSize: 16,
    color: '#2f3640',
    flex: 1,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
  },
});

export default Transcript;



import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, FlatList, Image, StyleSheet, Alert, Modal, ActivityIndicator, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { pick, types } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';

// Import services and components
import alertService from '../../../common/Services/alert/AlertService';
import Apiservice from "../../../common/Services/ApiService";
import requestAndroidPermission from "../../../common/Services/requestStoragePermission";
import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import SessionService from '../../../common/Services/SessionService';
import { HttpService } from '../../../common/Services/HttpService';

// --- Utility Components ---
const FileAttachment = ({ label, required, file, onSelectFile, allowedTypes, iconName = "paperclip" }) => (
  <View style={optimizedStyles.inputGroup}>
    <Text style={optimizedStyles.label}>
      {label} {required && <Text style={{ color: "red" }}>*</Text>}
    </Text>
    <TouchableOpacity
      style={optimizedStyles.fileUploadBox}
      onPress={() => onSelectFile(allowedTypes)}
      activeOpacity={0.8}
    >
      <FontAwesome6 name={iconName} size={20} color={file ? "#2e7d32" : "#6B6B81"} />
      <Text style={[optimizedStyles.fileUploadText, { color: file ? "#2e7d32" : "#A9A9A9" }]}>
        {file ? file.name : `Tap to upload (${allowedTypes.join(', ').toUpperCase()})`}
      </Text>
    </TouchableOpacity>
    {file && file.type.startsWith('image/') && (
      <Image
        source={{ uri: file.uri || file.fileCopyUri || file.path }}
        style={optimizedStyles.previewImage}
        resizeMode="cover"
      />
    )}
  </View>
);

// --- Main Component ---
export default function ComplaintScreen() {
  const [activeTab, setActiveTab] = useState("new_complaint");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [officialOrderCopy, setOfficialOrderCopy] = useState(null);
  const [selectedPromlem, setSelectedTypePromlem] = useState(null);
  const [selectedPromlemSub, setselectedPromlemSub] = useState(null);

  const [problemTypesList, setProblemTypesList] = useState([]);
  const [problemSubTypesList, setProblemSubTypesList] = useState([]);
  const [complaintStatusData, setComplaintStatusData] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Utility Functions ---

  const handleFileSelection = async (setter, allowedTypes, fileDescription) => {
    try {
      const files = await pick({
        type: allowedTypes,
        allowMultiSelection: false,
      });

      if (files.length > 0) {
        const file = files[0];
        setter(file);
        Alert.alert(`${fileDescription} Selected`, `Name: ${file.name}`);
      }
    } catch (error) {
      if (
        error &&
        (error.code === 'USER_CANCELLED' ||
          /user canceled/i.test(error.message))
      ) {
        // console.log('User cancelled picker');
      } else {
        console.error(`${fileDescription} Picker Error:`, error);
        Alert.alert("File Selection Error", `Could not select the ${fileDescription}. Please try again.`);
      }
    }
  };

  const selectScreenshot = () => handleFileSelection(setScreenshot, [types.images], 'Screenshot');
  const selectOfficialOrderCopy = () => handleFileSelection(setOfficialOrderCopy, [types.allFiles], 'Official Order Copy');

  const readFileAsBase64 = async (file) => {
    try {
      const uri = file.uri || file.fileCopyUri || file.path;
      if (!uri) throw new Error("Invalid file URI");
      return await RNFS.readFile(uri, 'base64');
    } catch (error) {
      console.error("Error converting file to base64:", file?.name, error);
      throw new Error(`Failed to process file: ${file.name}`);
    }
  };

  // --- API Handlers ---

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const payload = {
        USER_TYPE_ID: 1,
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        STUDENT_ID: sessionData?.STUDENT_ID,
      };

      const apiList = getApiList();
      const GetComplainProblemListApi = apiList.GetComplainProblemList;
      const response = await HttpService.post(GetComplainProblemListApi, payload);

      const res = response?.data?.StudentContact[0];
      const problemList = response?.data?.ComplainProblemList?.map(item => ({
        label: item.Problem_Name,
        value: item.Problem_Id,
      })) || [];

      setMobile(res?.Mobile_No || "");
      setEmail(res?.Email_Id || "");
      setProblemTypesList(problemList);
    } catch (error) {
      console.error("fetchData API Error:", error);
      setProblemTypesList([]);
      Alert.alert("Error", "Failed to load initial data.");
    } finally {
      setIsLoading(false);
    }
  };

  const GetMyComplainList = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const payload = {
        STUDENT_ID: sessionData?.STUDENT_ID,
      };

      const apiList = getApiList();
      const GetMyComplainListApi = apiList.GetMyComplainList;
      const response = await HttpService.post(GetMyComplainListApi, payload);

      const data = response?.data?.ComplainListResponse?.ComplainList || [];
      setComplaintStatusData(data);
    } catch (error) {
      console.error("GetMyComplainList API Error:", error);
      setComplaintStatusData([]);
      if (showLoading) Alert.alert("Error", "Failed to load complaint list.");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const subProblemList = async (PROBLEM_ID) => {
    try {
      const apiList = getApiList();
      const GetComplainSubProblemListApi = apiList.GetComplainSubProblemList;
      const payload = { PROBLEM_ID };
      const response = await HttpService.post(GetComplainSubProblemListApi, payload);

      const res = response?.data?.ComplainSubProblemList || [];
      const problemList = res?.map(item => ({
        label: item.Sub_Problem_Name,
        value: item.Sub_Problem_Id,
      })) || [];
      setProblemSubTypesList(problemList);
    } catch (error) {
      console.error("subProblemList API Error:", error);
      setProblemSubTypesList([]);
      Alert.alert("Error", "Failed to load sub-problem types.");
    }
  };

  // --- Lifecycle & Handlers ---

  useEffect(() => {
    fetchData();
    GetMyComplainList(false); // Load complaint list in the background/on mount
  }, []);

  useEffect(() => {
    // Re-fetch list when switching to status tab
    if (activeTab === "complaint_status" && complaintStatusData.length === 0) {
      GetMyComplainList();
    }
  }, [activeTab]);

  const handleSelectProblem = (item, type) => {
    if (type === "Problem") {
      setSelectedTypePromlem(item.value);
      setselectedPromlemSub(null);
      subProblemList(item.value);
    } else if (type === "Sub Problem") {
      setselectedPromlemSub(item.value);
    }
  };

  const handleSubmit = async () => {
    // 1. Validation
    if (!selectedPromlem || !selectedPromlemSub || !mobile.trim() || !email.trim() || !problemDescription.trim() || !screenshot || !officialOrderCopy) {
      Alert.alert("Validation Error", "Please fill all required fields and upload both files.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. Fetch session data
      const sessionData = await SessionService.getSession();
      const userTypeId = sessionData?.USER_TYPE_ID || 1;
      const studentName = sessionData?.student?.Name || '';
      const studentId = sessionData?.student?.Student_ID || sessionData?.STUDENT_ID || '';

      // 3. Convert files to base64
      const screenshotBase64 = await readFileAsBase64(screenshot);
      const orderCopyBase64 = await readFileAsBase64(officialOrderCopy);

      // 4. Build FormData payload
      const formData = new FormData();
      formData.append("USER_TYPE_ID", userTypeId.toString());
      formData.append("PROBLEM_TYPE_ID", selectedPromlem.toString());
      formData.append("SUB_PROBLEM_TYPE_ID", selectedPromlemSub.toString());
      formData.append("STUDENT_NAME", studentName);
      formData.append("STUDENT_ID", studentId);
      formData.append("MOBILE_NO", mobile.trim());
      formData.append("EMAIL_ID", email.trim());
      formData.append("PROBLEM", problemDescription.trim());
      formData.append("PROBLEM_COPY", screenshotBase64);
      formData.append("ORDER_COPY", orderCopyBase64);

      // 5. Submit to API
      const apiList = getApiList();
      const SaveComplainApi = apiList.SaveComplain;
      const response = await HttpService.post(SaveComplainApi, formData);

      const complainId = response?.data?.Response[0]?.Complain_ID;

      if (complainId === '0') {
        Alert.alert("Duplicate Complaint", "You have already submitted this complaint.");
      } else if (complainId && complainId.length > 0) {
        Alert.alert("Success", "Complaint submitted successfully!");
        // Reset form
        setSelectedTypePromlem(null);
        setselectedPromlemSub(null);
        setProblemDescription("");
        setScreenshot(null);
        setOfficialOrderCopy(null);
        // Navigate to status tab
        setActiveTab("complaint_status");
        GetMyComplainList();
      } else {
        Alert.alert("Submission Failed", "The server returned an unexpected response.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("An error occurred", error.message || "Failed to submit the complaint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Functions (Optimized with useCallback) ---

  const renderComplaintItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={optimizedStyles.card}
      activeOpacity={0.8}
      onPress={() => setSelectedComplaint(item)}
    >
      <View style={optimizedStyles.row}>
        <Text style={optimizedStyles.problemTitle}>{item.Problem_Name}</Text>
        <Text
          style={[
            optimizedStyles.statusTag,
            item.resolve_yn === "Y" ? optimizedStyles.resolvedTag : optimizedStyles.pendingTag,
          ]}
        >
          <Text>  {item.resolve_yn === "Y" ? "Resolved" : "Pending"}</Text>
        </Text>
      </View>
      <Text style={optimizedStyles.subProblem}>{item.Sub_Problem_Name}</Text>
      <View style={optimizedStyles.footerRow}>
        <Text style={optimizedStyles.dateText}>
          <FontAwesome6 name="calendar-day" size={12} color="#9ca3af" /> {item.problem_date}
        </Text>
        <Text style={optimizedStyles.complainId}>ID: {item.complain_id}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  const TabButton = ({ title, tabKey }) => (
    <TouchableOpacity
      style={[optimizedStyles.tab, activeTab === tabKey && optimizedStyles.activeTab]}
      onPress={() => setActiveTab(tabKey)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          optimizedStyles.tabText,
          activeTab === tabKey && optimizedStyles.activeTabText,
        ]}
      >
        <Text>{title}</Text>
      </Text>
    </TouchableOpacity>
  );

  // --- Render View ---

  return (
    <SafeAreaView style={optimizedStyles.container}>
      <Header />

      {/* Tabs */}
      <View style={optimizedStyles.tabsContainer}>
        <TabButton title="New Complaint" tabKey="new_complaint" />
        <TabButton title="Complaint Status" tabKey="complaint_status" />
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={optimizedStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2e7d32" />
        </View>
      )}

      {/* Content */}
      <View style={{ flex: 1 }}>
        {activeTab === "new_complaint" ? (
          <ScrollView style={optimizedStyles.formContainer} keyboardShouldPersistTaps="handled">
            <Text style={optimizedStyles.sectionTitle}>Complaint Details</Text>

            {/* Problem Type */}
            <View style={optimizedStyles.inputGroup}>
              <Text style={optimizedStyles.label}>Problem Type <Text style={{ color: "red" }}>*</Text></Text>
              <Dropdown
                data={problemTypesList}
                labelField="label"
                valueField="value"
                placeholder="Select Problem"
                value={selectedPromlem}
                onChange={(item) => handleSelectProblem(item, "Problem")}
                style={optimizedStyles.dropdown}
                placeholderStyle={optimizedStyles.placeholderStyle}
                selectedTextStyle={optimizedStyles.selectedTextStyle}
                iconStyle={optimizedStyles.iconStyle}
                renderRightIcon={() => (<FontAwesome6 name="chevron-down" size={16} color="#6B6B81" />)}
              />
            </View>

            {/* Sub Problem Type */}
            <View style={optimizedStyles.inputGroup}>
              <Text style={optimizedStyles.label}>Sub Problem Type <Text style={{ color: "red" }}>*</Text></Text>
              <Dropdown
                data={problemSubTypesList}
                labelField="label"
                valueField="value"
                placeholder="Select Sub Problem"
                value={selectedPromlemSub}
                onChange={(item) => handleSelectProblem(item, "Sub Problem")}
                style={optimizedStyles.dropdown}
                placeholderStyle={optimizedStyles.placeholderStyle}
                selectedTextStyle={optimizedStyles.selectedTextStyle}
                iconStyle={optimizedStyles.iconStyle}
                disable={!selectedPromlem}
                renderRightIcon={() => (<FontAwesome6 name="chevron-down" size={16} color="#6B6B81" />)}
              />
            </View>

            {/* Contact Details */}
            <Text style={optimizedStyles.sectionTitle}>Your Contact Information</Text>

            <TextInput
              style={optimizedStyles.textInput}
              placeholder="Mobile Number *"
              placeholderTextColor="#A9A9A9"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            <TextInput
              style={optimizedStyles.textInput}
              placeholder="Email Address *"
              placeholderTextColor="#A9A9A9"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {/* Problem Description */}
            <View style={optimizedStyles.inputGroup}>
              <Text style={optimizedStyles.label}>Problem Description <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput
                style={optimizedStyles.textArea}
                multiline
                placeholder="Describe your problem in detail..."
                placeholderTextColor="#A9A9A9"
                value={problemDescription}
                onChangeText={setProblemDescription}
              />
            </View>

            {/* File Uploads */}
            <Text style={optimizedStyles.sectionTitle}>Attachments</Text>

            <FileAttachment
              label="Screenshot of Problem"
              required
              file={screenshot}
              onSelectFile={selectScreenshot}
              allowedTypes={['images']}
              iconName="image"
            />

            <FileAttachment
              label="Official Order Copy"
              required
              file={officialOrderCopy}
              onSelectFile={selectOfficialOrderCopy}
              allowedTypes={['allFiles']}
              iconName="file-lines"
            />


            {/* Submit Button */}
            <View style={optimizedStyles.centerContainer}>
              <TouchableOpacity
                style={optimizedStyles.submitButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={optimizedStyles.submitButtonText}>SUBMIT COMPLAINT</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ height: 50 }} /> {/* Spacer */}
          </ScrollView>
        ) : (
          /* Complaint Status Tab */
          <FlatList
            style={optimizedStyles.statusList}
            data={complaintStatusData}
            keyExtractor={(item) => item.complain_id?.toString() || Math.random().toString()}
            renderItem={renderComplaintItem}
            contentContainerStyle={optimizedStyles.statusListContent}
            ListEmptyComponent={
              <Text style={optimizedStyles.emptyText}>
                {isLoading ? "Loading complaints..." : "No complaints found. Submit a new one!"}
              </Text>
            }
          />
        )}
      </View>

      <Footer />

      {/* Popup Modal */}
      <Modal
        visible={!!selectedComplaint}
        transparent
        animationType="fade" // Changed to fade for a smoother look
        onRequestClose={() => setSelectedComplaint(null)}
      >
        <View style={optimizedStyles.modalOverlay}>
          <View style={optimizedStyles.modalBox}>
            <Text style={optimizedStyles.modalTitle}>Complaint Details (ID: {selectedComplaint?.complain_id})</Text>

            {/* Detail Rows */}
            <View style={optimizedStyles.detailRow}>
              <Text style={optimizedStyles.modalLabel}>Problem:</Text>
              <Text style={optimizedStyles.modalText}>{selectedComplaint?.Problem_Name}</Text>
            </View>
            <View style={optimizedStyles.detailRow}>
              <Text style={optimizedStyles.modalLabel}>Sub Problem:</Text>
              <Text style={optimizedStyles.modalText}>{selectedComplaint?.Sub_Problem_Name}</Text>
            </View>
            <View style={optimizedStyles.detailRow}>
              <Text style={optimizedStyles.modalLabel}>Date:</Text>
              <Text style={optimizedStyles.modalText}>{selectedComplaint?.problem_date}</Text>
            </View>
            <View style={optimizedStyles.detailRow}>
              <Text style={optimizedStyles.modalLabel}>Status:</Text>
              <Text
                style={[
                  optimizedStyles.modalText,
                  selectedComplaint?.resolve_yn === "Y" ? optimizedStyles.modalResolved : optimizedStyles.modalPending,
                ]}>
                <Text>  {selectedComplaint?.resolve_yn === "Y" ? "Resolved" : "Pending"}   </Text>
              </Text>
            </View>
            {selectedComplaint?.resolve_yn === "Y" && selectedComplaint?.resolution_message && (
              <View style={optimizedStyles.detailRowMessage}>
                <Text style={optimizedStyles.modalLabel}>Resolution:</Text>
                <Text style={optimizedStyles.modalText}>{selectedComplaint.resolution_message}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setSelectedComplaint(null)}
              style={optimizedStyles.closeButton}
            >
              <Text style={optimizedStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const optimizedStyles = StyleSheet.create({
  // General
  container: { flex: 1, backgroundColor: '#f4f7f9' },
  centerContainer: { alignItems: 'center' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 15,
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 23,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: '#F3E8DF',
    borderWidth:2,
    borderColor:'#ffffffff',
    padding:8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    // borderBottomColor: '#2e7d32',
     borderRadius: 10,
    backgroundColor: '#E67E22',
  },
  tabText: { color: '#6B6B81', fontWeight: '600', fontSize: 14 },
  activeTabText: { color: '#ffffffff', fontWeight: 'bold' },

  // Form
  formContainer: { flex: 1, paddingHorizontal: 16, marginTop: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f6fcff',
    marginTop: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#efc800ff',
    paddingLeft: 8,
    backgroundColor:'#53629E'
  },
  inputGroup: { marginBottom: 15 },
  label: { fontWeight: '600', fontSize: 14, marginBottom: 5, color: '#374151' },

  textInput: {
    height: 50,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 15,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 120,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#1f2937',
    backgroundColor: '#fff',
  },

  // Dropdown
  dropdown: {
    height: 50,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  placeholderStyle: { color: '#A9A9A9', fontSize: 15 },
  selectedTextStyle: { color: '#000', fontSize: 15 },
  iconStyle: { width: 20, height: 20 },

  // File Upload
  fileUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 50,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  fileUploadText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
  previewImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  // Submit Button
  submitButton: {
    backgroundColor: '#FF8040',
    width: '80%',
    maxWidth: 300,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    elevation: 4,
  },
  submitButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Complaint Status List (Optimized Card)
  statusList: { flex: 1, marginTop: 10 },
  statusListContent: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#ccc', // Will be overridden by resolved/pending status
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 4,
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
  },
  subProblem: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  dateText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  complainId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: '600',
  },
  resolvedTag: {
    backgroundColor: '#dcfce7', // Very light green
    color: '#15803d', // Dark green
  },
  pendingTag: {
    backgroundColor: '#fee2e2', // Very light red
    color: '#dc2626', // Dark red
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 30,
    fontSize: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Darker overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 15, // Softer corners
    padding: 25,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 15,
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailRowMessage: {
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4b5563",
  },
  modalText: {
    fontSize: 14,
    color: "#374151",
    maxWidth: '65%',
    textAlign: 'right',
  },
  modalResolved: {
    color: "#15803d",
    fontWeight: "600",
  },
  modalPending: {
    color: "#dc2626",
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#2e7d32",
    borderRadius: 8,
    marginTop: 20,
    paddingVertical: 12,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
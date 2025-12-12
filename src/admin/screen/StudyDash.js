import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Image } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { pick, types } from '@react-native-documents/picker';
import SessionService from "../../common/Services/SessionService";
import getAdminApiList from '../config/Api/adminApiList';
import { HttpService } from "../../common/Services/HttpService";
import { downloadFile } from "../../common/Services/pdfService";
import alertService from '../../common/Services/alert/AlertService';
import { API_BASE_URL } from '../../common/config/BaseUrl';
import colors from '../../common/config/colors';
import RNFS from 'react-native-fs';
import { CheckBox } from 'react-native-elements';




const COURSE_OPTIONS = [
  { id: '3229', name: 'EPF-6211' },
  { id: '3230', name: 'EPF-6212' },
  { id: '3231', name: 'EPF-6213' }
];
const CHAPTER_OPTIONS = [
  { id: '', name: '--Select Chapter--' },
  { id: '1', name: 'Chapter 1' },
  { id: '2', name: 'Chapter 2' },
  { id: '3', name: 'Chapter 3' },
  { id: '4', name: 'Chapter 4' },
  { id: '5', name: 'Chapter 5' }
];
const LANGUAGE_OPTIONS = [
  { id: '1', name: 'Hindi' },
  { id: '2', name: 'English' }
];



// --- Color Palette ---
const Colors = {
  primaryBlue: '#3498db',
  lightPurple: '#f0e6ff',
  darkPurple: '#6a0dad',
  redOrange: '#e74c3c',
  lightBeige: '#f9f5e6',
  inputBorder: '#ccc',
  successGreen: '#5cb85c',
  cardBackground: 'white',
  darkText: '#333',
  lightText: 'white',
  fileStatus: '#2ecc71',
  modalHeaderBg: '#d35400',
  listOddRow: '#f2f2f2',
  listEvenRow: 'white',
  redPDF: '#e74c3c',
};


export default function UploadStudyMaterialScreen() {
  const [loading, setLoading] = useState(false);
  const [studyMaterialTotalList, getstudyMaterialTotalList] = useState([]);
  const [studyMaterialGetApprovalList, getstudyMaterialGetApprovalList] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [currentDropdownType, setCurrentDropdownType] = useState(null);
  // 1. State to track the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');

  // for input
  const [selectedItems, setSelectedItems] = useState([]);
  const [remark, setRemark] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('3229');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [selectedLanguageId, setSelectedLanguageId] = useState('1');
  const [selectedFileTypeId, setSelectedFileTypeId] = useState(''); // Will be set after API load
  const [fileTypelist, setfileTypelist] = useState([]);


  // 2. NEW State for Modal Visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleApprovalList, setisModalVisibleApprovalList] = useState(false);

  // 3. NEW State for Dropdown Modal
  const [dropdownModalVisible, setDropdownModalVisible] = useState(false);
  const [currentDropdownId, setCurrentDropdownId] = useState(null);


  // 4. NEW State for Selected Dropdown Values
  const [selectedValues, setSelectedValues] = useState({
    '1': 'EPF-6211',
    '2': '--Select Chapter--',
    '3': 'Hindi',
    '4': 'MS Word',
  });

  //  5. // for download pdf
  const handleDownloadPDF = async (studyMaterialFile) => {
    console.log(studyMaterialFile, "Study Material File");
    // setLoading(true);
    // console.log(filePath)
    try {
      const filePath = API_BASE_URL + '/' + studyMaterialFile;
      console.log(filePath)
      if (filePath) {
        await downloadFile(filePath, `${studyMaterialFile.split('/').pop()}`);
      } else {
        alertService.show({
          title: 'Error',
          message: 'No file available to download.',
          type: 'warning',
        });
      }
    } catch (error) {
      Alert.alert('Download Failed', error?.message || 'Something went wrong');
    } finally {
      // setLoading(false);
    }
  };


  const handleFileSelection = async () => {
    try {
      const result = await pick({
        type: types.allFiles,
      });
      if (result.length > 0) {
        const file = result[0];
        setSelectedFile(file);
        setImageUri(file)
        Alert.alert('File Selected', `${file.name} is ready for upload.`);
      } else {
        Alert.alert('No file selected', 'Please select a file to upload.');
      }
    } catch (err) {
      if (err.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User canceled file picker.');
      } else {
        console.error('Error selecting file:', err);
        Alert.alert('Error', 'Failed to pick file. Please try again.');
      }
    }
  };

  // 6. Function to open the list modal
  const handleOpenTotalMaterials = (count, label) => {
    // console.log("Count:", count);
    // console.log("Label:", label);
    setSelectedLabel(label);
    if (label == 'Total Materials') {
      // GetstudyMaterial();
      setIsModalVisible(true);
    }
    if (label == 'Materials in Queued') {
      // GetApprovalList();
      setisModalVisibleApprovalList(true);
    }
  };



  // 7. Function to handle submit and collect form data
  const handleSubmit = async () => {
    if (!selectedValues['1'] || !selectedValues['2'] || !selectedValues['3'] || !selectedValues['4'] || !title.trim() || !selectedFile) {
      Alert.alert("Validation Error", "Please fill all required fields and select a file.");
      return;
    }
    try {
      const sessionData = await SessionService.getSession();
      console.log(sessionData, "sessionData")
      const empId = sessionData?.LoginDetail[0]?.Emp_Id || 'Guest';
      const formData = new FormData();
      formData.append("course_id", selectedCourseId);
      formData.append("language_id", selectedLanguageId);
      formData.append("file_type_id", selectedFileTypeId);
      formData.append("title", title);
      formData.append("emp_id", empId);
      formData.append("File_Size", selectedFile.size.toString());
      formData.append("file_name", selectedFile.name);
      formData.append("size", selectedFile.size.toString());
      formData.append("Chapter_Id", selectedChapterId);

      // Append file directly (no base64)
      console.log("Appending file with name:", selectedFile.name, "and URI:", selectedFile.uri);  // Debug log
      formData.append("file", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.type || 'application/octet-stream',
      });

      console.log("FormData object created:", formData);

      const apiList = getAdminApiList();
      const uploadApi = apiList.saveStudyMaterailFile;

      // const response = await HttpService.post(uploadApi, formData);
      // console.log("Full response:", response);

      // const result = response?.data?.UploadMaterialResult;
      // if (result?.Success === "1") {
      //   Alert.alert("Success", result.Message || "Uploaded successfully!");
      //   setSelectedValues({});
      //   setTitle("");
      //   setSelectedFile(null);
      // } else {
      //   Alert.alert("Submission Failed", result?.Message || "The server returned an unexpected response.");
      // }


    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("An error occurred", error.message || "Failed to submit.");
    } finally {
      setIsSubmitting(false);
    }
  };



  // 8  for list 
  const GetstudyMaterial = useCallback(async () => {
    try {
      setLoading(true);
      const getStudyMaterialListApi = getAdminApiList().getStudyMaterialList;
      if (!getStudyMaterialListApi) throw new Error("API endpoint not found.");

      const sessionData = await SessionService.getSession();
      const profile = sessionData?.LoginDetail?.[0];
      const payload = {
        emp_id: profile.Emp_Id,
        course_id: '',  //^todo
        start_row_count: '',
        limit_row_count: '',
      };
      const response = await HttpService.post(getStudyMaterialListApi, payload);
      getstudyMaterialTotalList(response?.data.StudyMaterialList || []);
    } catch (error) {
      Alert.alert("Failed to Load Study Materials", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);


  const GetApprovalList = useCallback(async () => {
    try {
      // setLoading(true);
      const GetApprovalListApi = getAdminApiList().getAssignmentMaterailApprovalDashCountList;
      if (!GetApprovalListApi) throw new Error("API endpoint not found.");
      const sessionData = await SessionService.getSession();
      // console.log(sessionData, "sessionData")
      const profile = sessionData?.LoginDetail?.[0];
      const payload = {
        Academic_session: sessionData?.SelectedSession,
        Emp_Id: profile.Emp_Id,
        is_approved: 'N',
        isForMaterial: '' || 1,
        isForMaterialYouTube: ''
      };
      // console.log(payload, "payload")
      const response = await HttpService.get(GetApprovalListApi, payload);
      console.log(response, "response")
      getstudyMaterialGetApprovalList(response?.data.UploadApprovalResult.GetUploadApprovalList || []);
    } catch (error) {
      Alert.alert("Failed to Load Study Materials", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);


  const fileType = useCallback(async () => {
    try {
      setLoading(true);
      const Get_File_Type_MastersApi = getAdminApiList().Get_File_Type_Masters;
      if (!Get_File_Type_MastersApi) throw new Error("API endpoint not found.");
      const sessionData = await SessionService.getSession();
      const profile = sessionData?.LoginDetail?.[0];
      const payload = {
        Emp_Id: profile.Emp_Id,
      };
      const response = await HttpService.get(Get_File_Type_MastersApi, payload);
      const fileTypes = response?.data.MaterialMastersResult.File_Type_Masters || [];
      setfileTypelist(fileTypes);
      if (fileTypes.length > 0) {
        setSelectedFileTypeId(fileTypes[0].File_Type_ID); // Set default to first item's ID
      }
    } catch (error) {
      Alert.alert("Failed to Loading", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    GetstudyMaterial();
    GetApprovalList();
    fileType();
  }, []);



  // for action in model section start
  // Toggle select all
  const toggleSelectAll = () => {
    const data = selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList;
    setSelectedItems(prev =>
      prev.length === data.length ? [] : data.map(item => item.id)
    );
  };


  // Toggle individual selection  
  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    const selectedData = (selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList).filter(item => selectedItems.includes(item.id));
    if (selectedData.length > 0) {
      Alert.alert("Delete", `Delete ${selectedData.length} items?`, [
        { text: "Cancel" },
        {
          text: "OK", onPress: () => {
            // Implement delete logic here
            console.log("Deleting:", selectedData);
            setSelectedItems([]);
          }
        }
      ]);
    }
  };


  const handleSendToStudent = () => {
    const selectedData = (selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList).filter(item => selectedItems.includes(item.id));
    if (selectedData.length > 0) {
      // Implement send logic with remark
      console.log("Sending to student:", selectedData, remark);
      setSelectedItems([]);
      setRemark('');
    }
  };

  const handleRemoveToStudent = () => {
    const selectedData = (selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList).filter(item => selectedItems.includes(item.id));
    if (selectedData.length > 0) {
      // Implement remove logic with remark
      console.log("Removing from student:", selectedData, remark);
      setSelectedItems([]);
      setRemark('');
    }
  };


  // for action in model section end
  const MaterialListModal = ({ isVisible, onClose, data, label }) => {
    return (
      <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <View style={modalStyles.modalHeader}>
              <Text style={modalStyles.modalHeaderText}>For Approval And Remove List</Text>
              <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                <FontAwesome6 name="close" size={24} color={Colors.lightText} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={modalStyles.remarkInput}
              placeholder="Enter remark"
              placeholderTextColor="#888"
              value={remark}
              onChangeText={setRemark} />
            <Text style={modalStyles.totalListHeader}>{selectedLabel}</Text>

            <View style={[modalStyles.row, modalStyles.headerRow]}>
              <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0 }]}>No.  </Text>
              <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.55 }]}>Chapter</Text>
              <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.6, marginLeft: 75 }]}>Code</Text>
              {/* <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.3, }]}>PDF</Text> */}
              <CheckBox
                title="Select All"
                checked={selectedItems.length === data.length && data.length > 0}
                onPress={toggleSelectAll}
                containerStyle={[modalStyles.cellText, modalStyles.headerText, { backgroundColor: '#f9f5f5ff', flex: 0, padding: 0 }]}
                checkedIcon={<FontAwesome6 name="check-square" size={24} color={Colors.primaryBlue} />}
                uncheckedIcon={<FontAwesome6 name="square" size={20} color="#000" />} />
            </View>

            <ScrollView style={modalStyles.listContainer}>
              {data.map((item, index) => (
                <View key={item.id} style={[modalStyles.row, index % 2 === 0 ? modalStyles.evenRow : modalStyles.oddRow]}>
                  <Text style={[modalStyles.cellText, { flex: 0, marginLeft: -25, padding: 10 }]}>{index + 1}</Text>
                  <Text style={[modalStyles.cellText, { flex: 1.5 }]}>{item.Study_Material_Title}</Text>
                  <Text style={[modalStyles.cellText, { flex: 1, textAlign: 'center' }]}>{item.Course_Code}</Text>
                  <TouchableOpacity style={{ flex: 0.3, marginLeft: 25, padding: 3 }} onPress={() => handleDownloadPDF(item.Study_Material_File)}>
                    <FontAwesome6 name="file-pdf" size={24} color={Colors.redPDF} />
                  </TouchableOpacity>
                  <CheckBox
                    checked={selectedItems.includes(item.id)}
                    onPress={() => toggleSelectItem(item.id)}
                    containerStyle={{ marginLeft: 0 }}
                    checkedIcon={<FontAwesome6 name="check-square" size={20} color="#000" />}
                    uncheckedIcon={<FontAwesome6 name="square" size={20} color="#000" />}
                  />
                </View>
              ))}

            </ScrollView>
            <View style={modalStyles.actionButtons}>
              <TouchableOpacity style={modalStyles.actionButton} onPress={handleDelete}>
                <Text style={modalStyles.deleteButton}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modalStyles.actionButton} onPress={handleSendToStudent}>
                <Text style={modalStyles.actionButtonText}>Send to Student</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modalStyles.actionButton} onPress={handleRemoveToStudent}>
                <Text style={modalStyles.actionButtonText}>Remove from Student</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };




  const StatusCard = ({ count, label, countColor, onPress, labelColor = Colors.darkText }) => (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
      <View style={styles.cardContainer}>
        <View style={[styles.countBadge, { backgroundColor: countColor }]}>
          <Text style={styles.countText}>{count}</Text>
        </View>
        <Text style={[styles.cardLabel, { color: labelColor }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  const DropdownField = ({ selectedId, options, onPress, placeholder }) => {
    const selectedOption = options.find(opt => opt.id === selectedId);
    const displayText = selectedOption ? selectedOption.name : placeholder;
    return (
      <TouchableOpacity onPress={onPress} style={styles.dropdownContainer}>
        <Text style={displayText !== placeholder ? styles.dropdownPlaceholder : styles.dropdownPlaceholderInactive}>{displayText}</Text>
        <FontAwesome6 name="caret-down" size={24} color={Colors.redOrange} />
      </TouchableOpacity>
    );
  };

  const DropdownModal = ({ isVisible, onClose, options, onSelect, selectedId }) => (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalHeaderText}>Select Option</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <FontAwesome6 name="xmark" size={24} color={Colors.lightText} />
            </TouchableOpacity>
          </View>
          <ScrollView style={modalStyles.listContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => onSelect(option.id)}
                style={[
                  modalStyles.row,
                  selectedId === option.id ? modalStyles.selectedRow : (index % 2 === 0 ? modalStyles.evenRow : modalStyles.oddRow)
                ]}>
                <Text style={modalStyles.cellText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );


  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryBlue} />

      <View style={styles.header}>
        <FontAwesome6 name="upload" size={24} color={Colors.lightText} />
        <Text style={styles.headerTitle}>Upload Study Material</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.cardSection}>
          <StatusCard
            count={studyMaterialTotalList.length}
            label="Total Materials"
            countColor={Colors.darkPurple}
            onPress={() => handleOpenTotalMaterials(studyMaterialTotalList.length, "Total Materials")}
          />
          <StatusCard
            count={studyMaterialGetApprovalList.length}
            label="Materials in Queued"
            countColor={Colors.redOrange}
            onPress={() => handleOpenTotalMaterials(studyMaterialGetApprovalList.length, "Materials in Queued")}
          />
          <StatusCard
            count={studyMaterialTotalList.length}
            label="Shared Materials"
            countColor={Colors.darkPurple}
            onPress={() => handleOpenTotalMaterials(studyMaterialTotalList.length, "Shared Materials")}
          />
          <StatusCard
            count={0}
            label="DeLinked Materials"
            countColor={Colors.redOrange}
            onPress={() => handleOpenTotalMaterials(0, "DeLinked Materials")}
          />
        </View>


        <View style={styles.formSection}>
          <DropdownField
            selectedId={selectedCourseId}
            options={COURSE_OPTIONS}
            onPress={() => {
              setCurrentDropdownType('course');
              setDropdownModalVisible(true);
            }}
            placeholder="Select Course"
          />
          <DropdownField
            selectedId={selectedChapterId}
            options={CHAPTER_OPTIONS}
            onPress={() => {
              setCurrentDropdownType('chapter');
              setDropdownModalVisible(true);
            }}
            placeholder="Select Chapter"
          />
          <DropdownField
            selectedId={selectedLanguageId}
            options={LANGUAGE_OPTIONS}
            onPress={() => {
              setCurrentDropdownType('language');
              setDropdownModalVisible(true);
            }}
            placeholder="Select Language"
          />
          <DropdownField
            selectedId={selectedFileTypeId}
            options={fileTypelist.map(item => ({ id: item.File_Type_ID, name: item.File_Type_Name }))}
            onPress={() => {
              setCurrentDropdownType('fileType');
              setDropdownModalVisible(true);
            }}
            placeholder="Select File Type"
          />
          <TextInput style={styles.titleInput}
            placeholder="Title" placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle} />

          {selectedFile && (
            <View style={styles.fileStatusContainer}>
              <FontAwesome6 name="check-circle" size={20} color={Colors.fileStatus} />
              <Text style={styles.fileNameText}>
                {selectedFile.name}
              </Text>
            </View>
          )}


          <View style={styles.buttoncard}>
            <TouchableOpacity
              style={styles.selectFileButton}
              onPress={handleFileSelection}>
              <Text style={styles.selectFileButtonText}>
                {selectedFile ? 'CHANGE FILE' : 'Select File'}
              </Text>
            </TouchableOpacity>
            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.selectFileButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <MaterialListModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        data={studyMaterialTotalList} />

      <MaterialListModal
        isVisible={isModalVisibleApprovalList}
        onClose={() => setisModalVisibleApprovalList(false)}
        data={studyMaterialGetApprovalList} />
        
      <DropdownModal
        isVisible={dropdownModalVisible}
        onClose={() => setDropdownModalVisible(false)}
        options={
          currentDropdownType === 'course' ? COURSE_OPTIONS :
            currentDropdownType === 'chapter' ? CHAPTER_OPTIONS :
              currentDropdownType === 'language' ? LANGUAGE_OPTIONS :
                currentDropdownType === 'fileType' ? fileTypelist.map(item => ({ id: item.File_Type_ID, name: item.File_Type_Name })) : []
        }
        selectedId={
          currentDropdownType === 'course' ? selectedCourseId :
            currentDropdownType === 'chapter' ? selectedChapterId :
              currentDropdownType === 'language' ? selectedLanguageId :
                currentDropdownType === 'fileType' ? selectedFileTypeId : ''
        }
        onSelect={(id) => {
          if (currentDropdownType === 'course') setSelectedCourseId(id);
          else if (currentDropdownType === 'chapter') setSelectedChapterId(id);
          else if (currentDropdownType === 'language') setSelectedLanguageId(id);
          else if (currentDropdownType === 'fileType') setSelectedFileTypeId(id);
          setDropdownModalVisible(false);
        }}
      />

    </View>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightBeige,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    // backgroundColor: Colors.primaryBlue,
    backgroundColor: colors.footercolor,
  },
  headerTitle: {
    color: Colors.lightText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 15,
  },
  // --- Status Cards Styles ---
  cardSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 90,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  countBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 5,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: Colors.lightText,
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  // --- Form and Dropdown Styles ---
  formSection: {
    paddingVertical: 10,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.lightBeige,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 8,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffffffff',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: Colors.darkText,
  },
  titleInput: {
    backgroundColor: Colors.cardBackground,
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    fontSize: 16,
  },
  // --- File Status Styles ---
  fileStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e6faed',
    borderRadius: 5,
    marginVertical: 5,
  },
  fileNameText: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.darkText,
    fontWeight: '500',
  },
  // --- Button Styles ---
  selectFileButton: {
    backgroundColor: Colors.redOrange,
    padding: 15,
    borderRadius: 55,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttoncard: {
    flexDirection: 'row',
    justifyContent: 'space-around'


  },
  selectFileButtonText: {
    color: Colors.lightText,
    fontWeight: 'bold',
    fontSize: 18,
  },

  // --- Submit Button Styles ---
  submitButton: {
    backgroundColor: Colors.primaryBlue,
    padding: 15,
    borderRadius: 55,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});

// --- Modal Stylesheet (Completed) ---
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    height: '90%',
    backgroundColor: 'white',
    marginBottom: -100,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    overflow: 'hidden',
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: colors.bgcolor
  },
  modalHeaderText: {
    color: Colors.lightText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    fontSize: 14,
  },
  totalListHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // backgroundColor: '#b30000ff',


  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerRow: {
    backgroundColor: '#dee9faff',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    padding: 20
  },
  evenRow: {
    backgroundColor: Colors.listEvenRow,
    padding: 20
  },
  oddRow: {
    backgroundColor: Colors.listOddRow,
    padding: 20
  },
  selectedRow: {
    backgroundColor: Colors
  },




  //  buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    // paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: '#ffffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    // backgroundColor: colors.secondary,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButtonText: {
    color: '#fff',
  },
})




























// import React, { useState, useCallback, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Image } from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import { pick, types } from '@react-native-documents/picker';
// import SessionService from "../../common/Services/SessionService";
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from "../../common/Services/HttpService";
// import { downloadFile } from "../../common/Services/pdfService";
// import alertService from '../../common/Services/alert/AlertService';
// import { API_BASE_URL } from '../../common/config/BaseUrl';
// import colors from '../../common/config/colors';
// import RNFS from 'react-native-fs';
// import { CheckBox } from 'react-native-elements';

// // --- Color Palette ---
// const Colors = {
//   primaryBlue: '#3498db',
//   lightPurple: '#f0e6ff',
//   darkPurple: '#6a0dad',
//   redOrange: '#e74c3c',
//   lightBeige: '#f9f5e6',
//   inputBorder: '#ccc',
//   successGreen: '#5cb85c',
//   cardBackground: 'white',
//   darkText: '#333',
//   lightText: 'white',
//   fileStatus: '#2ecc71',
//   modalHeaderBg: '#d35400',
//   listOddRow: '#f2f2f2',
//   listEvenRow: 'white',
//   redPDF: '#e74c3c',
// };

// const DROPDOWN_DATA = [
//   { id: '1', placeholder: 'EPF-6211' },
//   { id: '2', placeholder: '--Select Chapter--' },
//   { id: '3', placeholder: 'Hindi' },
//   { id: '4', placeholder: 'MS Word' },
// ];

// const DROPDOWN_OPTIONS = {
//   '1': ['EPF-6211', 'EPF-6212', 'EPF-6213'],
//   '2': ['--Select Chapter--', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5'],
//   '3': ['Hindi', 'English'],
//   '4': ['Image', 'MS Word', 'MS Excel', 'MS PowerPoint', 'MS setWordSpacing', 'PDF'],
// };

// // Mapping for form submission (example; adjust based on your API)
// const VALUE_TO_ID_MAP = {
//   '1': { 'EPF-6211': '3229', 'EPF-6212': '3230', 'EPF-6213': '3231' }, // course_id
//   '2': { '--Select Chapter--': '', 'Chapter 1': '1', 'Chapter 2': '2', 'Chapter 3': '3', 'Chapter 4': '4', 'Chapter 5': '5' }, // Chapter_Id
//   '3': { 'Hindi': '1', 'English': '2' },
//   '4': { 'Image': '1', 'MS Word': '2', 'MS Excel': '3', 'MS PowerPoint': '4', 'MS setWordSpacing': '5', 'PDF': '6' }, // file_type_id
// };

// export default function UploadStudyMaterialScreen() {
//   const [loading, setLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [studyMaterialTotalList, setStudyMaterialTotalList] = useState([]);
//   const [studyMaterialGetApprovalList, setStudyMaterialGetApprovalList] = useState([]);
//   const [selectedLabel, setSelectedLabel] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [title, setTitle] = useState('');
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [remark, setRemark] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isModalVisibleApprovalList, setIsModalVisibleApprovalList] = useState(false);
//   const [dropdownModalVisible, setDropdownModalVisible] = useState(false);
//   const [currentDropdownId, setCurrentDropdownId] = useState(null);



//   const [fileTypelist, setfileTypelist] = useState([]);
//   const [selectedValues, setSelectedValues] = useState({
//     '1': 'EPF-6211',
//     '2': '--Select Chapter--',
//     '3': 'Hindi',
//     '4': 'MS Word',
//   });

//   const handleDownloadPDF = async (studyMaterialFile) => {
//     try {
//       const filePath = API_BASE_URL + '/' + studyMaterialFile;
//       if (filePath) {
//         await downloadFile(filePath, `${studyMaterialFile.split('/').pop()}`);
//       } else {
//         alertService.show({
//           title: 'Error',
//           message: 'No file available to download.',
//           type: 'warning',
//         });
//       }
//     } catch (error) {
//       Alert.alert('Download Failed', error?.message || 'Something went wrong');
//     }
//   };

//   const handleFileSelection = async () => {
//     try {
//       const result = await pick({ type: types.allFiles });
//       if (result.length > 0) {
//         const file = result[0];
//         setSelectedFile(file);
//         Alert.alert('File Selected', `${file.name} is ready for upload.`);
//       } else {
//         Alert.alert('No file selected', 'Please select a file to upload.');
//       }
//     } catch (err) {
//       if (err.code === 'DOCUMENT_PICKER_CANCELED') {
//         console.log('User canceled file picker.');
//       } else {
//         console.error('Error selecting file:', err);
//         Alert.alert('Error', 'Failed to pick file. Please try again.');
//       }
//     }
//   };

//   const handleOpenTotalMaterials = (count, label) => {
//     setSelectedLabel(label);
//     if (label === 'Total Materials') {
//       // GetStudyMaterial();
//       setIsModalVisible(true);
//     } else if (label === 'Materials in Queued') {
//       // GetApprovalList();
//       setIsModalVisibleApprovalList(true);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedValues['1'] || !selectedValues['2'] || !selectedValues['3'] || !selectedValues['4'] || !title.trim() || !selectedFile) {
//       Alert.alert("Validation Error", "Please fill all required fields and select a file.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const sessionData = await SessionService.getSession();
//       const empId = sessionData?.emp_id || 'Guest';

//       const formData = new FormData();
//       formData.append("course_id", VALUE_TO_ID_MAP['1'][selectedValues['1']] || "3229");
//       formData.append("language_id", VALUE_TO_ID_MAP['3'][selectedValues['3']] || "1");
//       formData.append("file_type_id", VALUE_TO_ID_MAP['4'][selectedValues['4']] || "1");
//       formData.append("title", title);
//       formData.append("emp_id", empId);
//       formData.append("File_Size", selectedFile.size.toString());
//       formData.append("file_name", selectedFile.name);
//       formData.append("size", selectedFile.size.toString());
//       formData.append("Chapter_Id", VALUE_TO_ID_MAP['2'][selectedValues['2']] || "1");

//       formData.append("file", {
//         uri: selectedFile.uri,
//         name: selectedFile.name,
//         type: selectedFile.type || 'application/octet-stream',
//       });

//       const apiList = getAdminApiList();
//       const uploadApi = apiList.saveStudyMaterailFile;
//       const response = await HttpService.post(uploadApi, formData);
//       const result = response?.data?.UploadMaterialResult;
//       if (result?.Success === "1") {
//         Alert.alert("Success", result.Message || "Uploaded successfully!");
//         setSelectedValues({ '1': 'EPF-6211', '2': '--Select Chapter--', '3': 'Hindi', '4': 'MS Word' });
//         setTitle("");
//         setSelectedFile(null);
//       } else {
//         Alert.alert("Submission Failed", result?.Message || "The server returned an unexpected response.");
//       }
//     } catch (error) {
//       console.error("Submit error:", error);
//       Alert.alert("An error occurred", error.message || "Failed to submit.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const GetStudyMaterial = useCallback(async () => {
//     try {
//       setLoading(true);
//       const getStudyMaterialListApi = getAdminApiList().getStudyMaterialList;
//       if (!getStudyMaterialListApi) throw new Error("API endpoint not found.");
//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const payload = {
//         emp_id: profile.Emp_Id,
//         course_id: '',
//         start_row_count: '',
//         limit_row_count: '',
//       };
//       const response = await HttpService.post(getStudyMaterialListApi, payload);
//       setStudyMaterialTotalList(response?.data.StudyMaterialList || []);
//     } catch (error) {
//       Alert.alert("Failed to Load Study Materials", error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const GetApprovalList = useCallback(async () => {
//     try {
//       setLoading(true);
//       const GetApprovalListApi = getAdminApiList().getAssignmentMaterailApprovalDashCountList;
//       if (!GetApprovalListApi) throw new Error("API endpoint not found.");
//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const payload = {
//         Academic_session: sessionData?.SelectedSession,
//         Emp_Id: profile.Emp_Id,
//         is_approved: 'N',
//         isForMaterial: 1,
//         isForMaterialYouTube: ''
//       };
//       const response = await HttpService.get(GetApprovalListApi, payload);
//       setStudyMaterialGetApprovalList(response?.data.UploadApprovalResult.GetUploadApprovalList || []);
//     } catch (error) {
//       Alert.alert("Failed to Load Study Materials", error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);



//   const fileType = useCallback(async () => {
//     try {
//       setLoading(true);
//       const Get_File_Type_MastersApi = getAdminApiList().Get_File_Type_Masters;
//       if (!Get_File_Type_MastersApi) throw new Error("API endpoint not found.");
//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const payload = {
//         Emp_Id: profile.Emp_Id,
//       };
//       const response = await HttpService.get(Get_File_Type_MastersApi, payload);
//       console.log(response)
//       console.log(response?.data.MaterialMastersResult.File_Type_Masters)
//       setfileTypelist(response?.data.MaterialMastersResult.File_Type_Masters || []);
//     } catch (error) {
//       Alert.alert("Failed to Loading", error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);


//   useEffect(() => {
//     GetApprovalList();
//     GetStudyMaterial();
//     fileType();
//   }, [])

//   // Checkbox handlers
//   const toggleSelectAll = () => {
//     const data = selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList;
//     setSelectedItems(prev =>
//       prev.length === data.length ? [] : data.map(item => item.id)
//     );
//   };

//   const toggleSelectItem = (id) => {
//     setSelectedItems(prev =>
//       prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
//     );
//   };

//   const handleDelete = () => {
//     const selectedData = (selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList).filter(item => selectedItems.includes(item.id));
//     if (selectedData.length > 0) {
//       Alert.alert("Delete", `Delete ${selectedData.length} items?`, [
//         { text: "Cancel" },
//         {
//           text: "OK", onPress: () => {
//             // Implement delete logic here
//             console.log("Deleting:", selectedData);
//             setSelectedItems([]);
//           }
//         }
//       ]);
//     }
//   };

//   const handleSendToStudent = () => {
//     const selectedData = (selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList).filter(item => selectedItems.includes(item.id));
//     if (selectedData.length > 0) {
//       // Implement send logic with remark
//       console.log("Sending to student:", selectedData, remark);
//       setSelectedItems([]);
//       setRemark('');
//     }
//   };

//   const handleRemoveToStudent = () => {
//     const selectedData = (selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList).filter(item => selectedItems.includes(item.id));
//     if (selectedData.length > 0) {
//       // Implement remove logic with remark
//       console.log("Removing from student:", selectedData, remark);
//       setSelectedItems([]);
//       setRemark('');
//     }
//   };

//   const MaterialListModal = ({ isVisible, onClose, data, label }) => {
//     return (
//       <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
//         <View style={modalStyles.centeredView}>
//           <View style={modalStyles.modalView}>
//             <View style={modalStyles.modalHeader}>
//               <Text style={modalStyles.modalHeaderText}>For Approval And Remove List</Text>
//               <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
//                 <FontAwesome6 name="close" size={24} color={Colors.lightText} />
//               </TouchableOpacity>
//             </View>
//             <TextInput
//               style={modalStyles.remarkInput}
//               placeholder="Enter remark"
//               placeholderTextColor="#888"
//               value={remark}
//               onChangeText={setRemark} />
//             <Text style={modalStyles.totalListHeader}>{label}</Text>

//             <View style={[modalStyles.row, modalStyles.headerRow]}>
//               <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0 }]}>No.  </Text>
//               <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.55 }]}>Chapter</Text>
//               <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.6, marginLeft: 75 }]}>Code</Text>
//               {/* <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.3, }]}>PDF</Text> */}
//               <CheckBox
//                 title="Select All"
//                 checked={selectedItems.length === data.length && data.length > 0}
//                 onPress={toggleSelectAll}
//                 containerStyle={[modalStyles.cellText, modalStyles.headerText, { backgroundColor: '#f9f5f5ff', flex: 0, padding: 0 }]}
//                 checkedIcon={<FontAwesome6 name="check-square" size={24} color={Colors.primaryBlue} />}
//                 uncheckedIcon={<FontAwesome6 name="square" size={20} color="#000" />} />
//             </View>

//             <ScrollView style={modalStyles.listContainer}>
//               {data.map((item, index) => (
//                 <View key={item.id} style={[modalStyles.row, index % 2 === 0 ? modalStyles.evenRow : modalStyles.oddRow]}>
//                   <Text style={[modalStyles.cellText, { flex: 0, marginLeft: -25, padding: 10 }]}>{index + 1}</Text>
//                   <Text style={[modalStyles.cellText, { flex: 1.5 }]}>{item.Study_Material_Title}</Text>
//                   <Text style={[modalStyles.cellText, { flex: 1, textAlign: 'center' }]}>{item.Course_Code}</Text>
//                   <TouchableOpacity style={{ flex: 0.3, marginLeft: 25, padding: 3 }} onPress={() => handleDownloadPDF(item.Study_Material_File)}>
//                     <FontAwesome6 name="file-pdf" size={24} color={Colors.redPDF} />
//                   </TouchableOpacity>
//                   <CheckBox
//                     checked={selectedItems.includes(item.id)}
//                     onPress={() => toggleSelectItem(item.id)}
//                     containerStyle={{ marginLeft: 0 }}
//                     checkedIcon={<FontAwesome6 name="check-square" size={20} color="#000" />}
//                     uncheckedIcon={<FontAwesome6 name="square" size={20} color="#000" />}
//                   />
//                 </View>
//               ))}

//             </ScrollView>
//             <View style={modalStyles.actionButtons}>
//               <TouchableOpacity style={modalStyles.actionButton} onPress={handleDelete}>
//                 <Text style={modalStyles.deleteButton}>Delete</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={modalStyles.actionButton} onPress={handleSendToStudent}>
//                 <Text style={modalStyles.actionButtonText}>Send to Student</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={modalStyles.actionButton} onPress={handleRemoveToStudent}>
//                 <Text style={modalStyles.actionButtonText}>Remove from Student</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   };


//   const StatusCard = ({ count, label, countColor, onPress, labelColor = Colors.darkText }) => (
//     <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
//       <View style={styles.cardContainer}>
//         <View style={[styles.countBadge, { backgroundColor: countColor }]}>
//           <Text style={styles.countText}>{count}</Text>
//         </View>
//         <Text style={[styles.cardLabel, { color: labelColor }]}>{label}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const DropdownField = ({ id, selectedValue, onPress }) => (
//     <TouchableOpacity onPress={onPress} style={styles.dropdownContainer}>
//       <Text style={styles.dropdownPlaceholder}>{selectedValue}</Text>
//       <FontAwesome6 name="caret-down" size={24} color={Colors.redOrange} />
//     </TouchableOpacity>
//   );

//   const DropdownModal = ({ isVisible, onClose, options, onSelect, selected }) => (
//     <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
//       <View style={modalStyles.centeredView}>
//         <View style={modalStyles.modalView}>
//           <View style={modalStyles.modalHeader}>
//             <Text style={modalStyles.modalHeaderText}>Select Option</Text>
//             <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
//               <FontAwesome6 name="xmark" size={24} color={Colors.lightText} />
//             </TouchableOpacity>
//           </View>
//           <ScrollView style={modalStyles.listContainer}>
//             {options.map((option, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => onSelect(option)}
//                 style={[
//                   modalStyles.row,
//                   selected === option ? modalStyles.selectedRow : (index % 2 === 0 ? modalStyles.evenRow : modalStyles.oddRow)
//                 ]}>
//                 <Text style={modalStyles.cellText}>{option}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" backgroundColor={Colors.primaryBlue} />
//       <View style={styles.header}>
//         <FontAwesome6 name="upload" size={24} color={Colors.lightText} />
//         <Text style={styles.headerTitle}>Upload Study Material</Text>
//         <View style={{ width: 24 }} />
//       </View>
//       <ScrollView style={styles.contentContainer}>
//         <View style={styles.cardSection}>
//           <StatusCard
//             count={studyMaterialTotalList.length}
//             label="Total Materials"
//             countColor={Colors.darkPurple}
//             onPress={() => handleOpenTotalMaterials(studyMaterialTotalList.length, "Total Materials")}
//           />
//           <StatusCard
//             count={studyMaterialGetApprovalList.length}
//             label="Materials in Queued"
//             countColor={Colors.redOrange}
//             onPress={() => handleOpenTotalMaterials(studyMaterialGetApprovalList.length, "Materials in Queued")}
//           />
//           <StatusCard
//             count={studyMaterialTotalList.length}
//             label="Shared Materials"
//             countColor={Colors.darkPurple}
//             onPress={() => handleOpenTotalMaterials(studyMaterialTotalList.length, "Shared Materials")}
//           />
//           <StatusCard
//             count={0}
//             label="DeLinked Materials"
//             countColor={Colors.redOrange}
//             onPress={() => handleOpenTotalMaterials(0, "DeLinked Materials")}
//           />
//         </View>
//         <View style={styles.formSection}>
//           {DROPDOWN_DATA.map((item) => (
//             <DropdownField
//               key={item.id}
//               id={item.id}
//               selectedValue={selectedValues[item.id]}
//               onPress={() => {
//                 setCurrentDropdownId(item.id);
//                 setDropdownModalVisible(true);
//               }}
//             />
//           ))}

//           <TextInput
//             style={styles.titleInput}
//             placeholder="Title"
//             placeholderTextColor="#888"
//             value={title}
//             onChangeText={setTitle}
//           />
//           {selectedFile && (
//             <View style={styles.fileStatusContainer}>
//               <FontAwesome6 name="check-circle" size={20} color={Colors.fileStatus} />
//               <Text style={styles.fileNameText}>{selectedFile.name}</Text>
//             </View>
//           )}
//           <TouchableOpacity style={styles.selectFileButton} onPress={handleFileSelection}>
//             <Text style={styles.selectFileButtonText}>
//               {selectedFile ? 'CHANGE FILE' : 'SELECT FILE'}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
//             <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <MaterialListModal
//         isVisible={isModalVisibleApprovalList}
//         onClose={() => setIsModalVisibleApprovalList(false)}
//         data={studyMaterialGetApprovalList}
//         label={selectedLabel}
//       />


//       <DropdownModal
//         isVisible={dropdownModalVisible}
//         onClose={() => setDropdownModalVisible(false)}
//         options={currentDropdownId ? DROPDOWN_OPTIONS[currentDropdownId] : []}
//         selected={currentDropdownId ? selectedValues[currentDropdownId] : ''}
//         onSelect={(option) => {
//           setSelectedValues((prev) => ({ ...prev, [currentDropdownId]: option }));
//           setDropdownModalVisible(false);
//         }}
//       />
//     </SafeAreaView>
//   );
// }



// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: Colors.lightBeige,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 15,
//     // backgroundColor: Colors.primaryBlue,
//     backgroundColor: colors.footercolor,
//   },
//   headerTitle: {
//     color: Colors.lightText,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   contentContainer: {
//     padding: 15,
//   },
//   // --- Status Cards Styles ---
//   cardSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   cardContainer: {
//     flex: 1,
//     marginHorizontal: 4,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: 8,
//     padding: 8,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     height: 90,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//   },
//   countBadge: {
//     borderRadius: 999,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     marginBottom: 5,
//     minWidth: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   countText: {
//     color: Colors.lightText,
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   cardLabel: {
//     fontSize: 11,
//     textAlign: 'center',
//   },
//   // --- Form and Dropdown Styles ---
//   formSection: {
//     paddingVertical: 10,
//   },
//   dropdownContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: Colors.lightBeige,
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     marginVertical: 8,
//     borderRadius: 25,
//     borderWidth: 2,
//     borderColor: '#ffffffff',
//   },
//   dropdownPlaceholder: {
//     fontSize: 16,
//     color: Colors.darkText,
//   },
//   titleInput: {
//     backgroundColor: Colors.cardBackground,
//     padding: 15,
//     marginVertical: 8,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: Colors.inputBorder,
//     fontSize: 16,
//   },
//   // --- File Status Styles ---
//   fileStatusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#e6faed',
//     borderRadius: 5,
//     marginVertical: 5,
//   },
//   fileNameText: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: Colors.darkText,
//     fontWeight: '500',
//   },
//   // --- Button Styles ---
//   selectFileButton: {
//     backgroundColor: Colors.successGreen,
//     padding: 15,
//     borderRadius: 5,
//     marginVertical: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   selectFileButtonText: {
//     color: Colors.lightText,
//     fontWeight: 'bold',
//     fontSize: 18,
//   },

//   // --- Submit Button Styles ---
//   submitButton: {
//     backgroundColor: colors.footercolor,
//     padding: 15,
//     borderRadius: 5,
//     marginVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   submitButtonText: {
//     color: Colors.lightText,
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
// });

// // --- Modal Stylesheet (Completed) ---
// const modalStyles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalView: {
//     width: '100%',
//     height: '90%',
//     backgroundColor: 'white',
//     marginBottom: -100,
//     borderTopRightRadius: 30,
//     borderTopLeftRadius: 30,
//     overflow: 'hidden',
//     elevation: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 15,
//     backgroundColor: colors.bgcolor
//   },
//   modalHeaderText: {
//     color: Colors.lightText,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   remarkInput: {
//     borderWidth: 1,
//     borderColor: Colors.inputBorder,
//     borderRadius: 5,
//     padding: 10,
//     margin: 10,
//     fontSize: 14,
//   },
//   totalListHeader: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     backgroundColor: '#f0f0f0',

//   },
//   listContainer: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   headerRow: {
//     backgroundColor: '#dee9faff',
//     paddingVertical: 10,
//     borderBottomWidth: 2,
//     borderBottomColor: '#ccc',
//     padding: 20
//   },
//   evenRow: {
//     backgroundColor: Colors.listEvenRow,
//     padding: 20
//   },
//   oddRow: {
//     backgroundColor: Colors.listOddRow,
//     padding: 20
//   },
//   selectedRow: {
//     backgroundColor: Colors
//   },




//   //  buttons
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     backgroundColor: '#fff',
//   },
//   actionButton: {
//     flex: 1,
//     marginHorizontal: 5,
//     // paddingVertical: 10,
//     paddingHorizontal: 8,
//     borderRadius: 8,

//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: colors.secondary,
//   },
//   actionButtonText: {
//     color: '#ffffffff',
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//     // backgroundColor: colors.secondary,
//   },
//   deleteButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   deleteButtonText: {
//     color: '#fff',
//   },
// })















// import React, { useState, useCallback, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Image } from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import { pick, types } from '@react-native-documents/picker';
// import SessionService from "../../common/Services/SessionService";
// import getAdminApiList from '../config/Api/adminApiList';
// import { HttpService } from "../../common/Services/HttpService";
// import { downloadFile } from "../../common/Services/pdfService";
// import alertService from '../../common/Services/alert/AlertService';
// import { API_BASE_URL } from '../../common/config/BaseUrl';
// import colors from '../../common/config/colors';
// import RNFS from 'react-native-fs';
// import { CheckBox } from 'react-native-elements';

// // --- Color Palette ---
// const Colors = {
//   primaryBlue: '#3498db',
//   lightPurple: '#f0e6ff',
//   darkPurple: '#6a0dad',
//   redOrange: '#e74c3c',
//   lightBeige: '#f9f5e6',
//   inputBorder: '#ccc',
//   successGreen: '#5cb85c',
//   cardBackground: 'white',
//   darkText: '#333',
//   lightText: 'white',
//   fileStatus: '#2ecc71',
//   modalHeaderBg: '#d35400',
//   listOddRow: '#f2f2f2',
//   listEvenRow: 'white',
//   redPDF: '#e74c3c',
// };

// // Static options for dropdowns (updated to objects with id and name, no mappings needed)
// const COURSE_OPTIONS = [
//   { id: '3229', name: 'EPF-6211' },
//   { id: '3230', name: 'EPF-6212' },
//   { id: '3231', name: 'EPF-6213' }
// ];
// const CHAPTER_OPTIONS = [
//   { id: '', name: '--Select Chapter--' },
//   { id: '1', name: 'Chapter 1' },
//   { id: '2', name: 'Chapter 2' },
//   { id: '3', name: 'Chapter 3' },
//   { id: '4', name: 'Chapter 4' },
//   { id: '5', name: 'Chapter 5' }
// ];
// const LANGUAGE_OPTIONS = [
//   { id: '1', name: 'Hindi' },
//   { id: '2', name: 'English' }
// ];

// export default function UploadStudyMaterialScreen() {
//   const [loading, setLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [studyMaterialTotalList, setStudyMaterialTotalList] = useState([]);
//   const [studyMaterialGetApprovalList, setStudyMaterialGetApprovalList] = useState([]);
//   const [selectedLabel, setSelectedLabel] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [title, setTitle] = useState('');
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [remark, setRemark] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isModalVisibleApprovalList, setIsModalVisibleApprovalList] = useState(false);
//   const [dropdownModalVisible, setDropdownModalVisible] = useState(false);
//   const [currentDropdownType, setCurrentDropdownType] = useState(null);
//   const [fileTypelist, setfileTypelist] = useState([]);

//   const [imageUri, setImageUri] = useState(null);

//   // Separate states for each dropdown (now storing id)
//   const [selectedCourseId, setSelectedCourseId] = useState('3229');
//   const [selectedChapterId, setSelectedChapterId] = useState('');
//   const [selectedLanguageId, setSelectedLanguageId] = useState('1');
//   const [selectedFileTypeId, setSelectedFileTypeId] = useState(''); // Will be set after API load

//   const handleDownloadPDF = async (studyMaterialFile) => {
//     try {
//       const filePath = API_BASE_URL + '/' + studyMaterialFile;
//       if (filePath) {
//         await downloadFile(filePath, `${studyMaterialFile.split('/').pop()}`);
//       } else {
//         alertService.show({
//           title: 'Error',
//           message: 'No file available to download.',
//           type: 'warning',
//         });
//       }
//     } catch (error) {
//       Alert.alert('Download Failed', error?.message || 'Something went wrong');
//     }
//   };


//   const handleFileSelection = async () => {
//     try {
//       const result = await pick({
//         type: types.allFiles,
//       });
//       if (result.length > 0) {
//         const file = result[0];
//         setSelectedFile(file);
//         setImageUri(file)
//         Alert.alert('File Selected', `${file.name} is ready for upload.`);
//       } else {
//         Alert.alert('No file selected', 'Please select a file to upload.');
//       }
//     } catch (err) {
//       if (err.code === 'DOCUMENT_PICKER_CANCELED') {
//         console.log('User canceled file picker.');
//       } else {
//         console.error('Error selecting file:', err);
//         Alert.alert('Error', 'Failed to pick file. Please try again.');
//       }
//     }
//   };

//   const handleOpenTotalMaterials = (count, label) => {
//     setSelectedLabel(label);
//     if (label === 'Total Materials') {
//       setIsModalVisible(true);
//     } else if (label === 'Materials in Queued') {
//       setIsModalVisibleApprovalList(true);
//     }
//   };


//   // 7. Function to handle submit and collect form data
//   const handleSubmit = async () => {
//     if (!title.trim() || !selectedFile) {
//       Alert.alert("Validation Error", "Please fill all required fields and select a file.");
//       return;
//     }
//     try {
//       const sessionData = await SessionService.getSession();
//       const empId = sessionData?.emp_id || 'Guest';
//       const formData = new FormData();
//       formData.append("course_id", "3229");
//       formData.append("language_id", "1");
//       formData.append("file_type_id", "1");
//       formData.append("title", "aaa");
//       formData.append("emp_id", "1033");
//       formData.append("File_Size", selectedFile.size.toString());
//       formData.append("file_name", selectedFile.name);
//       formData.append("size", selectedFile.size.toString());
//       formData.append("Chapter_Id", "1");

//       // Append file directly (no base64)
//       console.log("Appending file with name:", selectedFile.name, "and URI:", selectedFile.uri, "type", selectedFile.type);  // Debug log
//       formData.append("file", {
//         uri: selectedFile.uri,
//         name: selectedFile.name,
//         type: selectedFile.type || 'application/octet-stream',
//       });

//       console.log("FormData object created:", formData);

//       const apiList = getAdminApiList();
//       const uploadApi = apiList.saveStudyMaterailFile;

//       const response = await HttpService.post(uploadApi, formData);
//       console.log("Full response:", response);

//       const result = response?.data?.UploadMaterialResult;
//       if (result?.Success === "1") {
//         Alert.alert("Success", result.Message || "Uploaded successfully!");
//         // setSelectedValues({});
//         setTitle("");
//         setSelectedFile(null);
//       } else {
//         Alert.alert("Submission Failed", result?.Message || "The server returned an unexpected response.");
//       }
//     } catch (error) {
//       console.error("Submit error:", error);
//       Alert.alert("An error occurred", error.message || "Failed to submit.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };



//   const GetStudyMaterial = useCallback(async () => {
//     try {
//       setLoading(true);
//       const getStudyMaterialListApi = getAdminApiList().getStudyMaterialList;
//       if (!getStudyMaterialListApi) throw new Error("API endpoint not found.");
//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const payload = {
//         emp_id: profile.Emp_Id,
//         course_id: '',
//         start_row_count: '',
//         limit_row_count: '',
//       };
//       const response = await HttpService.post(getStudyMaterialListApi, payload);
//       setStudyMaterialTotalList(response?.data.StudyMaterialList || []);
//     } catch (error) {
//       Alert.alert("Failed to Load Study Materials", error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const GetApprovalList = useCallback(async () => {
//     console.log("object")
//     try {
//       setLoading(true);
//       const GetApprovalListApi = getAdminApiList().getAssignmentMaterailApprovalDashCountList;
//       if (!GetApprovalListApi) throw new Error("API endpoint not found.");
//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const payload = {
//         Academic_session: sessionData?.SelectedSession,
//         Emp_Id: profile.Emp_Id,
//         is_approved: 'N',
//         isForMaterial: 1,
//         isForMaterialYouTube: ''
//       };
//       const response = await HttpService.get(GetApprovalListApi, payload);
//       console.log(response, "response")
//       setStudyMaterialGetApprovalList(response?.data.UploadApprovalResult.GetUploadApprovalList || []);
//     } catch (error) {
//       Alert.alert("Failed to Load Study Materials", error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fileType = useCallback(async () => {
//     try {
//       setLoading(true);
//       const Get_File_Type_MastersApi = getAdminApiList().Get_File_Type_Masters;
//       if (!Get_File_Type_MastersApi) throw new Error("API endpoint not found.");
//       const sessionData = await SessionService.getSession();
//       const profile = sessionData?.LoginDetail?.[0];
//       const payload = {
//         Emp_Id: profile.Emp_Id,
//       };
//       const response = await HttpService.get(Get_File_Type_MastersApi, payload);
//       const fileTypes = response?.data.MaterialMastersResult.File_Type_Masters || [];
//       setfileTypelist(fileTypes);
//       if (fileTypes.length > 0) {
//         setSelectedFileTypeId(fileTypes[0].File_Type_ID); // Set default to first item's ID
//       }
//     } catch (error) {
//       Alert.alert("Failed to Loading", error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     GetApprovalList();
//     GetStudyMaterial();
//     fileType();
//   }, []);

//   // Checkbox handlers
//   const toggleSelectAll = () => {
//     const data = selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList;
//     setSelectedItems(prev =>
//       prev.length === data.length ? [] : data.map(item => item.id)
//     );
//   };

//   const toggleSelectItem = (id) => {
//     setSelectedItems(prev =>
//       prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
//     );
//   };

//   const handleDelete = () => {
//     const selectedData = (selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList).filter(item => selectedItems.includes(item.id));
//     if (selectedData.length > 0) {
//       Alert.alert("Delete", `Delete ${selectedData.length} items?`, [
//         { text: "Cancel" },
//         {
//           text: "OK", onPress: () => {
//             // Implement delete logic here
//             console.log("Deleting:", selectedData);
//             setSelectedItems([]);
//           }
//         }
//       ]);
//     }
//   };

//   const handleSendToStudent = () => {
//     const selectedData = (selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList).filter(item => selectedItems.includes(item.id));
//     if (selectedData.length > 0) {
//       // Implement send logic with remark
//       console.log("Sending to student:", selectedData, remark);
//       setSelectedItems([]);
//       setRemark('');
//     }
//   };

//   const handleRemoveToStudent = () => {
//     const selectedData = (selectedLabel === 'Total Materials' ? studyMaterialTotalList : studyMaterialGetApprovalList).filter(item => selectedItems.includes(item.id));
//     if (selectedData.length > 0) {
//       // Implement remove logic with remark
//       console.log("Removing from student:", selectedData, remark);
//       setSelectedItems([]);
//       setRemark('');
//     }
//   };

//   const MaterialListModal = ({ isVisible, onClose, data, label }) => {
//     return (
//       <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
//         <View style={modalStyles.centeredView}>
//           <View style={modalStyles.modalView}>
//             <View style={modalStyles.modalHeader}>
//               <Text style={modalStyles.modalHeaderText}>For Approval And Remove List</Text>
//               <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
//                 <FontAwesome6 name="close" size={24} color={Colors.lightText} />
//               </TouchableOpacity>
//             </View>
//             <TextInput
//               style={modalStyles.remarkInput}
//               placeholder="Enter remark"
//               placeholderTextColor="#888"
//               value={remark}
//               onChangeText={setRemark} />
//             <Text style={modalStyles.totalListHeader}>{label}</Text>

//             <View style={[modalStyles.row, modalStyles.headerRow]}>
//               <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0 }]}>No.  </Text>
//               <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.55 }]}>Chapter</Text>
//               <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.6, marginLeft: 75 }]}>Code</Text>
//               <CheckBox
//                 title="Select All"
//                 checked={selectedItems.length === data.length && data.length > 0}
//                 onPress={toggleSelectAll}
//                 containerStyle={[modalStyles.cellText, modalStyles.headerText, { backgroundColor: '#f9f5f5ff', flex: 0, padding: 0 }]}
//                 checkedIcon={<FontAwesome6 name="check-square" size={24} color={Colors.primaryBlue} />}
//                 uncheckedIcon={<FontAwesome6 name="square" size={20} color="#000" />} />
//             </View>

//             <ScrollView style={modalStyles.listContainer}>
//               {data.map((item, index) => (
//                 <View key={item.id} style={[modalStyles.row, index % 2 === 0 ? modalStyles.evenRow : modalStyles.oddRow]}>
//                   <Text style={[modalStyles.cellText, { flex: 0, marginLeft: -25, padding: 10 }]}>{index + 1}</Text>
//                   <Text style={[modalStyles.cellText, { flex: 1.5 }]}>{item.Study_Material_Title}</Text>
//                   <Text style={[modalStyles.cellText, { flex: 1, textAlign: 'center' }]}>{item.Course_Code}</Text>
//                   <TouchableOpacity style={{ flex: 0.3, marginLeft: 25, padding: 3 }} onPress={() => handleDownloadPDF(item.Study_Material_File)}>
//                     <FontAwesome6 name="file-pdf" size={24} color={Colors.redPDF} />
//                   </TouchableOpacity>
//                   <CheckBox
//                     checked={selectedItems.includes(item.id)}
//                     onPress={() => toggleSelectItem(item.id)}
//                     containerStyle={{ marginLeft: 0 }}
//                     checkedIcon={<FontAwesome6 name="check-square" size={20} color="#000" />}
//                     uncheckedIcon={<FontAwesome6 name="square" size={20} color="#000" />}
//                   />
//                 </View>
//               ))}

//             </ScrollView>
//             <View style={modalStyles.actionButtons}>
//               <TouchableOpacity style={modalStyles.actionButton} onPress={handleDelete}>
//                 <Text style={modalStyles.deleteButton}>Delete</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={modalStyles.actionButton} onPress={handleSendToStudent}>
//                 <Text style={modalStyles.actionButtonText}>Send to Student</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={modalStyles.actionButton} onPress={handleRemoveToStudent}>
//                 <Text style={modalStyles.actionButtonText}>Remove from Student</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   const StatusCard = ({ count, label, countColor, onPress, labelColor = Colors.darkText }) => (
//     <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
//       <View style={styles.cardContainer}>
//         <View style={[styles.countBadge, { backgroundColor: countColor }]}>
//           <Text style={styles.countText}>{count}</Text>
//         </View>
//         <Text style={[styles.cardLabel, { color: labelColor }]}>{label}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const DropdownField = ({ selectedId, options, onPress, placeholder }) => {
//     const selectedOption = options.find(opt => opt.id === selectedId);
//     const displayText = selectedOption ? selectedOption.name : placeholder;
//     return (
//       <TouchableOpacity onPress={onPress} style={styles.dropdownContainer}>
//         <Text style={displayText !== placeholder ? styles.dropdownPlaceholder : styles.dropdownPlaceholderInactive}>{displayText}</Text>
//         <FontAwesome6 name="caret-down" size={24} color={Colors.redOrange} />
//       </TouchableOpacity>
//     );
//   };

//   const DropdownModal = ({ isVisible, onClose, options, onSelect, selectedId }) => (
//     <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
//       <View style={modalStyles.centeredView}>
//         <View style={modalStyles.modalView}>
//           <View style={modalStyles.modalHeader}>
//             <Text style={modalStyles.modalHeaderText}>Select Option</Text>
//             <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
//               <FontAwesome6 name="xmark" size={24} color={Colors.lightText} />
//             </TouchableOpacity>
//           </View>
//           <ScrollView style={modalStyles.listContainer}>
//             {options.map((option, index) => (
//               <TouchableOpacity
//                 key={option.id}
//                 onPress={() => onSelect(option.id)}
//                 style={[
//                   modalStyles.row,
//                   selectedId === option.id ? modalStyles.selectedRow : (index % 2 === 0 ? modalStyles.evenRow : modalStyles.oddRow)
//                 ]}>
//                 <Text style={modalStyles.cellText}>{option.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" backgroundColor={Colors.primaryBlue} />
//       <View style={styles.header}>
//         <FontAwesome6 name="upload" size={24} color={Colors.lightText} />
//         <Text style={styles.headerTitle}>Upload Study Material</Text>
//         <View style={{ width: 24 }} />
//       </View>
//       <ScrollView style={styles.contentContainer}>
//         <View style={styles.cardSection}>
//           <StatusCard
//             count={studyMaterialTotalList.length}
//             label="Total Materials"
//             countColor={Colors.darkPurple}
//             onPress={() => handleOpenTotalMaterials(studyMaterialTotalList.length, "Total Materials")}
//           />
//           <StatusCard
//             count={studyMaterialGetApprovalList.length}
//             label="Materials in Queued"
//             countColor={Colors.redOrange}
//             onPress={() => handleOpenTotalMaterials(studyMaterialGetApprovalList.length, "Materials in Queued")}
//           />
//           <StatusCard
//             count={studyMaterialTotalList.length}
//             label="Shared Materials"
//             countColor={Colors.darkPurple}
//             onPress={() => handleOpenTotalMaterials(studyMaterialTotalList.length, "Shared Materials")}
//           />
//           <StatusCard
//             count={0}
//             label="DeLinked Materials"
//             countColor={Colors.redOrange}
//             onPress={() => handleOpenTotalMaterials(0, "DeLinked Materials")}
//           />
//         </View>
//         <View style={styles.formSection}>
//           <DropdownField
//             selectedId={selectedCourseId}
//             options={COURSE_OPTIONS}
//             onPress={() => {
//               setCurrentDropdownType('course');
//               setDropdownModalVisible(true);
//             }}
//             placeholder="Select Course"
//           />
//           <DropdownField
//             selectedId={selectedChapterId}
//             options={CHAPTER_OPTIONS}
//             onPress={() => {
//               setCurrentDropdownType('chapter');
//               setDropdownModalVisible(true);
//             }}
//             placeholder="Select Chapter"
//           />
//           <DropdownField
//             selectedId={selectedLanguageId}
//             options={LANGUAGE_OPTIONS}
//             onPress={() => {
//               setCurrentDropdownType('language');
//               setDropdownModalVisible(true);
//             }}
//             placeholder="Select Language"
//           />
//           <DropdownField
//             selectedId={selectedFileTypeId}
//             options={fileTypelist.map(item => ({ id: item.File_Type_ID, name: item.File_Type_Name }))}
//             onPress={() => {
//               setCurrentDropdownType('fileType');
//               setDropdownModalVisible(true);
//             }}
//             placeholder="Select File Type"
//           />
//           <TextInput
//             style={styles.titleInput}
//             placeholder="Title"
//             placeholderTextColor="#888"
//             value={title}
//             onChangeText={setTitle}
//           />
//           {selectedFile && (
//             <View style={styles.fileStatusContainer}>
//               <FontAwesome6 name="check-circle" size={20} color={Colors.fileStatus} />
//               <Text style={styles.fileNameText}>{selectedFile.name}</Text>
//             </View>
//           )}
//           <TouchableOpacity style={styles.selectFileButton} onPress={handleFileSelection}>
//             <Text style={styles.selectFileButtonText}>
//               {selectedFile ? 'CHANGE FILE' : 'SELECT FILE'}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
//             <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//       <MaterialListModal
//         isVisible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         data={studyMaterialTotalList}
//         label={selectedLabel}
//       />
//       <MaterialListModal
//         isVisible={isModalVisibleApprovalList}
//         onClose={() => setIsModalVisibleApprovalList(false)}
//         data={studyMaterialGetApprovalList}
//         label={selectedLabel}
//       />
//       <DropdownModal
//         isVisible={dropdownModalVisible}
//         onClose={() => setDropdownModalVisible(false)}
//         options={
//           currentDropdownType === 'course' ? COURSE_OPTIONS :
//             currentDropdownType === 'chapter' ? CHAPTER_OPTIONS :
//               currentDropdownType === 'language' ? LANGUAGE_OPTIONS :
//                 currentDropdownType === 'fileType' ? fileTypelist.map(item => ({ id: item.File_Type_ID, name: item.File_Type_Name })) : []
//         }
//         selectedId={
//           currentDropdownType === 'course' ? selectedCourseId :
//             currentDropdownType === 'chapter' ? selectedChapterId :
//               currentDropdownType === 'language' ? selectedLanguageId :
//                 currentDropdownType === 'fileType' ? selectedFileTypeId : ''
//         }
//         onSelect={(id) => {
//           if (currentDropdownType === 'course') setSelectedCourseId(id);
//           else if (currentDropdownType === 'chapter') setSelectedChapterId(id);
//           else if (currentDropdownType === 'language') setSelectedLanguageId(id);
//           else if (currentDropdownType === 'fileType') setSelectedFileTypeId(id);
//           setDropdownModalVisible(false);
//         }}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: Colors.lightBeige,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 15,
//     backgroundColor: colors.footercolor,
//   },
//   headerTitle: {
//     color: Colors.lightText,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   contentContainer: {
//     padding: 15,
//   },
//   // --- Status Cards Styles ---
//   cardSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   cardContainer: {
//     flex: 1,
//     marginHorizontal: 4,
//     backgroundColor: Colors.cardBackground,
//     borderRadius: 8,
//     padding: 8,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     height: 90,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//   },
//   countBadge: {
//     borderRadius: 999,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     marginBottom: 5,
//     minWidth: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   countText: {
//     color: Colors.lightText,
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   cardLabel: {
//     fontSize: 11,
//     textAlign: 'center',
//   },
//   // --- Form and Dropdown Styles ---
//   formSection: {
//     paddingVertical: 10,
//   },
//   dropdownContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: Colors.lightBeige,
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     marginVertical: 8,
//     borderRadius: 25,
//     borderWidth: 2,
//     borderColor: '#ffffffff',
//   },
//   dropdownPlaceholder: {
//     fontSize: 16,
//     color: Colors.darkText,
//   },
//   dropdownPlaceholderInactive: {
//     fontSize: 16,
//     color: '#888',
//   },
//   titleInput: {
//     backgroundColor: Colors.cardBackground,
//     padding: 15,
//     marginVertical: 8,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: Colors.inputBorder,
//     fontSize: 16,
//   },
//   // --- File Status Styles ---
//   fileStatusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#e6faed',
//     borderRadius: 5,
//     marginVertical: 5,
//   },
//   fileNameText: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: Colors.darkText,
//     fontWeight: '500',
//   },
//   // --- Button Styles ---
//   selectFileButton: {
//     backgroundColor: Colors.successGreen,
//     padding: 15,
//     borderRadius: 5,
//     marginVertical: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   selectFileButtonText: {
//     color: Colors.lightText,
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   // --- Submit Button Styles ---
//   submitButton: {
//     backgroundColor: colors.footercolor,
//     padding: 15,
//     borderRadius: 5,
//     marginVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   submitButtonText: {
//     color: Colors.lightText,
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
// });

// // --- Modal Stylesheet (Completed) ---
// const modalStyles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalView: {
//     width: '100%',
//     height: '90%',
//     backgroundColor: 'white',
//     marginBottom: -100,
//     borderTopRightRadius: 30,
//     borderTopLeftRadius: 30,
//     overflow: 'hidden',
//     elevation: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 15,
//     backgroundColor: colors.bgcolor,
//   },
//   modalHeaderText: {
//     color: Colors.lightText,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   remarkInput: {
//     borderWidth: 1,
//     borderColor: Colors.inputBorder,
//     borderRadius: 5,
//     padding: 10,
//     margin: 10,
//     fontSize: 14,
//   },
//   totalListHeader: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     backgroundColor: '#f0f0f0',
//   },
//   listContainer: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   headerRow: {
//     backgroundColor: '#dee9faff',
//     paddingVertical: 10,
//     borderBottomWidth: 2,
//     borderBottomColor: '#ccc',
//     padding: 20,
//   },
//   evenRow: {
//     backgroundColor: Colors.listEvenRow,
//     padding: 20,
//   },
//   oddRow: {
//     backgroundColor: Colors.listOddRow,
//     padding: 20,
//   },
//   selectedRow: {
//     backgroundColor: Colors.primaryBlue,
//   },
//   cellText: {
//     fontSize: 14,
//     color: Colors.darkText,
//   },
//   headerText: {
//     fontWeight: 'bold',
//   },
//   // buttons
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     backgroundColor: '#fff',
//   },
//   actionButton: {
//     flex: 1,
//     marginHorizontal: 5,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: colors.secondary,
//   },
//   actionButtonText: {
//     color: '#ffffffff',
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   deleteButton: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
// });

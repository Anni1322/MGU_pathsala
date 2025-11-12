// 


































import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal, // Import Modal for the overlay
} from 'react-native';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// --- Static JSON Data ---
const DROPDOWN_DATA = [
  { id: '1', placeholder: 'EPF-6211' },
  { id: '2', placeholder: '--Select Chapter--' },
  { id: '3', placeholder: 'Hindi' },
  { id: '4', placeholder: 'MS Word' },
];

// --- Static Material List Data (Based on your screenshot) ---
const MATERIAL_LIST_DATA = [
  { id: 1, chapter: 'Chapter-1_Physical Properties of Agril. Produce', code: 'EPE-5211' },
  { id: 2, chapter: 'Chapter-2_Thermal Properties of Agril. Produce', code: 'EPE-5211' },
  { id: 3, chapter: 'Chapter-3_Frictional Properties', code: 'EPE-5211' },
  { id: 4, chapter: 'Chapter-5_Electrical Properties', code: 'EPE-5211' },
  { id: 5, chapter: 'Chapter-1', code: 'AENGG-5321' },
  { id: 6, chapter: 'Chapter-5', code: 'AENGG-5321' },
  { id: 7, chapter: 'Chapter-6', code: 'AENGG-5321' },
  { id: 8, chapter: 'Chapter-7', code: 'AENGG-5321' },
  { id: 9, chapter: 'Chapter-1', code: 'EPE-5427' },
  { id: 10, chapter: 'Chapter-2', code: 'EPE-5427' },
  { id: 11, chapter: 'Chapter-3', code: 'EPE-5427' },
  { id: 12, chapter: 'Chapter-4', code: 'EPE-5427' },
  { id: 13, chapter: 'Chapter-5', code: 'EPE-5427' },
];

// --- Color Palette ---
const Colors = {
  primaryBlue: '#3498db',
  lightPurple: '#f0e6ff',
  darkPurple: '#6a0dad', // Used for Total Materials count
  redOrange: '#e74c3c',
  lightBeige: '#f9f5e6',
  inputBorder: '#ccc',
  successGreen: '#5cb85c',
  cardBackground: 'white',
  darkText: '#333',
  lightText: 'white',
  fileStatus: '#2ecc71',
  modalHeaderBg: '#d35400', // Color inspired by the screenshot's header
  listOddRow: '#f2f2f2',
  listEvenRow: 'white',
  redPDF: '#e74c3c', // Red color for the PDF FontAwesome6
};

// --- Reusable Component: Status Card (Updated to be Touchable) ---
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

const DropdownField = ({ placeholder }) => (
  <View style={styles.dropdownContainer}>
    <Text style={styles.dropdownPlaceholder}>{placeholder}</Text>
    <FontAwesome6 name="keyboard-arrow-down" size={24} color={Colors.darkText} />
  </View>
);

// --- NEW: Material List Modal Component ---
const MaterialListModal = ({ isVisible, onClose, data }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          
          {/* Modal Header - "For Approval And Remove List" */}
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalHeaderText}>For Approval And Remove List</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <FontAwesome6 name="close" size={24} color={Colors.lightText} />
            </TouchableOpacity>
          </View>

          {/* Remark Input */}
          <TextInput
            style={modalStyles.remarkInput}
            placeholder="Enter remark"
            placeholderTextColor="#888"
          />

          {/* Total List Header */}
          <Text style={modalStyles.totalListHeader}>Total List</Text>
          
          {/* List Header Row */}
          <View style={[modalStyles.row, modalStyles.headerRow]}>
            <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.1 }]}>#</Text>
            <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.6 }]}>Chapter</Text>
            <Text style={[modalStyles.cellText, modalStyles.headerText, { flex: 0.2, textAlign: 'center' }]}>Code</Text>
            <View style={{ flex: 0.1 }} /> {/* Placeholder for PDF FontAwesome6 */}
          </View>


          {/* Material List */}
          <ScrollView style={modalStyles.listContainer}>
            {data.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  modalStyles.row, 
                  index % 2 === 0 ? modalStyles.evenRow : modalStyles.oddRow
                ]}
              >
                <Text style={[modalStyles.cellText, { flex: 0.1 }]}>{item.id}</Text>
                <Text style={[modalStyles.cellText, { flex: 0.6 }]}>{item.chapter}</Text>
                <Text style={[modalStyles.cellText, { flex: 0.2, textAlign: 'center' }]}>{item.code}</Text>
                <FontAwesome6 name="picture-as-pdf" size={24} color={Colors.redPDF} style={{ flex: 0.1, textAlign: 'center' }} />
              </View>
            ))}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
};

// --- Main Screen Component ---
export default function UploadStudyMaterialScreen() {
  // 1. State to track the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  
  // 2. NEW State for Modal Visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 3. Mock function for file selection
  const handleFileSelect = async () => {
    // MOCKING the file selection for this example:
    if (selectedFile) {
        setSelectedFile(null);
        Alert.alert('File Cleared', 'Please select a new file.');
    } else {
        const mockFile = { name: 'My_New_Study_Material.pdf', uri: 'file://path/to/file.pdf' };
        setSelectedFile(mockFile);
        Alert.alert('File Selected', `File: ${mockFile.name} is ready for upload.`);
    }
  };

  // 4. Function to open the list modal
  const handleOpenTotalMaterials = () => {
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryBlue} />

      {/* Header (Unchanged) */}
      <View style={styles.header}>
        <FontAwesome6 name="arrow-back" size={24} color={Colors.lightText} />
        <Text style={styles.headerTitle}>Upload Study Material</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* 1. Status Cards Section - Total Materials is now clickable */}
        <View style={styles.cardSection}>
          <StatusCard 
            count={MATERIAL_LIST_DATA.length} // Use actual count
            label="Total Materials" 
            countColor={Colors.darkPurple} 
            onPress={handleOpenTotalMaterials} // NEW: Handler to open modal
          />
          <StatusCard count={0} label="Materials in Queued" countColor={Colors.redOrange} />
          <StatusCard count={13} label="Shared Materials" countColor={Colors.darkPurple} />
          <StatusCard count={0} label="DeLinked Materials" countColor={Colors.redOrange} />
        </View>

        {/* 2. Input/Dropdown Section */}
        <View style={styles.formSection}>
          {/* RENDER DROPDOWNS FROM JSON DATA */}
          {DROPDOWN_DATA.map((item) => (
            <DropdownField key={item.id} placeholder={item.placeholder} />
          ))}

          {/* Title Input Field */}
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
          
          {/* File Status Display */}
          {selectedFile && (
            <View style={styles.fileStatusContainer}>
              <FontAwesome6 name="check-circle" size={20} color={Colors.fileStatus} />
              <Text style={styles.fileNameText}>
                {selectedFile.name}
              </Text>
            </View>
          )}

          {/* File Selection Button */}
          <TouchableOpacity 
            style={styles.selectFileButton}
            onPress={handleFileSelect}
          >
            <Text style={styles.selectFileButtonText}>
              {selectedFile ? 'CHANGE FILE' : 'SELECT FILE'}
            </Text>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
      
      {/* NEW: Render the Modal Component */}
      <MaterialListModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        data={MATERIAL_LIST_DATA}
      />
    </SafeAreaView>
  );
}

// --- Stylesheet for Main Screen (mostly unchanged) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightPurple,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: Colors.primaryBlue,
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0d8c0',
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
    backgroundColor: Colors.successGreen,
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectFileButtonText: {
    color: Colors.lightText,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

// --- NEW: Modal Stylesheet ---
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  modalView: {
    width: '95%',
    height: '90%', // Occupy most of the screen
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden', // Ensure content doesn't bleed outside
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: Colors.darkPurple, // Using darkPurple for prominence
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
    backgroundColor: '#f0f0f0', // Light background for the "Total List" label
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
    backgroundColor: '#e0e0e0', // Slightly darker header row
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  evenRow: {
    backgroundColor: Colors.listEvenRow,
  },
  oddRow: {
    backgroundColor: Colors.listOddRow,
  },
  cellText: {
    fontSize: 13,
    color: Colors.darkText,
    paddingHorizontal: 5,
  },
  headerText: {
    fontWeight: 'bold',
  },
});
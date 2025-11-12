import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Modal, Button, ScrollView, } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import requestAndroidPermission from '../../../common/Services/requestStoragePermission';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import SessionService from '../../../common/Services/SessionService';
import getApiList from '../../config/Api/ApiList';
import Header from '../../layout/Header/Header2';
import Footer from '../../layout/Footer/Footer';
import { HttpService } from '../../../common/Services/HttpService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { downloadDF } from "../../../common/Services/pdfService";
import alertService from '../../../common/Services/alert/AlertService';
import { API_BASE_URL } from '../../../common/config/BaseUrl';

const FeeReceipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [sessionOptions, setSessionOptions] = useState([]);
  const [purposeOptions, setPurposeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [footerHide, setfooterHide] = useState(false);

  const handleCardPress = item => {
    setSelectedReceipt(item);
  };

  const hidefooter = () => {
    setfooterHide(true);
  };


  const handleDownloadPDF = async receipt => {
      setLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const payload = { STUDENT_ID: sessionData?.STUDENT_ID, Receipt_No: receipt?.Receipt_No, };
      const apiList = getApiList();
      const DownloadFeeReceiptAPI = apiList.DownloadFeeReceipt;
      if (!DownloadFeeReceiptAPI)
        throw new Error('Fees Receipt endpoint not found.');
      const response = await HttpService.post(DownloadFeeReceiptAPI, payload);
      const filePath = API_BASE_URL + '/' + response?.data?.Response[0]?.FilePath;
      if (filePath) {
        setLoading(true);
        await downloadDF(filePath, `${receipt?.Receipt_No}Semester_Examfees.pdf`);
        setLoading(false);
      } else {
        console.error('No file path returned from API.');
        alertService.show({
          title: 'Error',
          message: 'No file available to download.',
          type: 'warning',
        });
      }

      return response?.data?.FeeReceiptList || [];
    } catch (error) {
      Alert.alert(
        'Fees Receipt Fetch Failed',
        error?.message || 'Something went wrong',
      );
      throw error;
    }
     setLoading(false);
  };

const sortByDateDesc = (data = []) => {
  return [...data].sort((a, b) => {
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const dateOnly = dateStr.split(" ")[0];
      const [d, m, y] = dateOnly.split("-");
      if (!d || !m || !y) return null;
      const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d)); 
      return isNaN(date.getTime()) ? null : date; 
    };
    const dateA = parseDate(a?.ReceiptDate);
    const dateB = parseDate(b?.ReceiptDate);
    if (dateA && dateB) {
      return dateB - dateA;
    }
    if (!dateA && dateB) return 1; 
    if (dateA && !dateB) return -1;  
    return 0; 
  });
};

const getFeeReceipt = async payload => {
  setLoading(true);
  try {
    const apiList = getApiList();
    const FeesReceiptAPI = apiList.FeeReceiptList;
    if (!FeesReceiptAPI) throw new Error('Fees Receipt endpoint not found.');

    const response = await HttpService.post(FeesReceiptAPI, payload);

    if (!response || response?.status !== 200) {
      throw new Error('Failed to fetch fee receipt details.');
    }
    let list = Array.isArray(response?.data?.FeeReceiptList)
      ? response.data.FeeReceiptList
      : [];

    list = sortByDateDesc(list);  

    // Output the sorted dates in numbered list format
    // console.log("Sorted Receipt Dates (Latest to Oldest):");
    // list.forEach((item, index) => {
    //   console.log(`${index + 1} ${item.ReceiptDate}`);
    // });

    return list;

  } catch (error) {
    Alert.alert('Fees Receipt Fetch Failed', error?.message || 'Something went wrong');
    throw error;
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const payload = {
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        STUDENT_ID: sessionData?.STUDENT_ID,
      };

      const fees = await getFeeReceipt(payload);
      setReceipts(fees);
      setFiltered(fees);
      setSessionOptions([
        { label: 'All', value: 'All' },
        ...[...new Set(fees?.map(i => i.Academic_Session_Name_E))]?.map(s => ({
          label: s,
          value: s,
        }))
      ]);

      setPurposeOptions([
        { label: 'All', value: 'All' },
        ...[...new Set(fees?.map(i => i.Fee_Purpose_Name))]?.map(p => ({
          label: p,
          value: p,
        }))
      ]);

    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  fetchReceipts();
}, []);

useEffect(() => {
  let data = receipts;
  if (searchText.trim() !== '') {
    data = data.filter(
      item =>
        item.Receipt_No.includes(searchText) ||
        item.IGKVRefNo.includes(searchText),
    );
  }
  if (selectedSession && selectedSession !== 'All') {
    data = data.filter(
      item => item.Academic_Session_Name_E === selectedSession,
    );
  }
  if (selectedPurpose && selectedPurpose !== 'All') {
    data = data.filter(item => item.Fee_Purpose_Name === selectedPurpose);
  }
  data = sortByDateDesc(data);
// console.log(data,"data")
  setFiltered(data);
}, [searchText, selectedSession, selectedPurpose, receipts]);


  const renderReceipt = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
      <View style={styles.cardGrid}>
        {/* Only show purpose, amount, and date as per requirements */}
        <Text style={styles.headtittle}>{item.Fee_Purpose_Name}</Text>
        <Text style={styles.gridItem}>Amount: ₹{item.GrandTotal}</Text>
        <Text style={styles.gridItem}>{item.ReceiptDate}</Text>
        {/* <Text style={styles.gridItem}>{item.Receipt_No}</Text> */}

        {/* Download button remains */}
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => handleDownloadPDF(item)}
        >
          <FontAwesome6
            name="file-pdf"
            size={20}
            color="#ffffffff"
            style={{ marginRight: 8 }}
          />
          {/* <Text style={styles.downloadText}>PDF</Text> */}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Header  />
        <Text style={styles.headerText }>Fees Recipt</Text>
        {/* <TextInput
          style={styles.search}
          placeholder="Search by Receipt No or Ref No"
          value={searchText}
          onChangeText={setSearchText}
          onPress={hidefooter}
        /> */}
        {/* <Dropdown
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={sessionOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Session"
          value={selectedSession}
          onChange={item => setSelectedSession(item.value)}
          maxHeight={300}
        />
        <Dropdown
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={purposeOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Purpose"
          value={selectedPurpose}
          onChange={item => setSelectedPurpose(item.value)}
          maxHeight={300}
        /> */}

        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center',alignItems: 'center',
              marginTop: 50,
            }}
          >
            <ActivityIndicator size="large" color="#2e7d32" />
            <Text style={{ marginTop: 10 }}>Loading receipts...</Text>
          </View>
        ) : (
          <FlatList
            data={[...filtered]}
            renderItem={renderReceipt}
            keyExtractor={(item, index) => index.toString()}
          />

        )}

        {/* Modal for showing details */}
        {selectedReceipt && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={selectedReceipt !== null}
            onRequestClose={() => setSelectedReceipt(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <ScrollView>
                  <Text style={styles.modalTitle}>🧾 Receipt Details</Text>

                  <View style={styles.modalItem}>
                    <Text style={styles.modalLabel}>Receipt No:</Text>
                    <Text style={styles.modalValue}>
                      {selectedReceipt?.Receipt_No}
                    </Text>
                  </View>

                  <View style={styles.modalItem}>
                    <Text style={styles.modalLabel}>Date:</Text>
                    <Text style={styles.modalValue}>
                      {selectedReceipt?.ReceiptDate}
                    </Text>
                  </View>

                  <View style={styles.modalItem}>
                    <Text style={styles.modalLabel}>Amount:</Text>
                    <Text style={styles.modalValue}>
                      ₹{selectedReceipt?.GrandTotal}
                    </Text>
                  </View>

                  <View style={styles.modalItem}>
                    <Text style={styles.modalLabel}>Payment Mode:</Text>
                    <Text style={styles.modalValue}>
                      {selectedReceipt?.PaymentMode}
                    </Text>
                  </View>

                  <View style={styles.modalItem}>
                    <Text style={styles.modalLabel}>Purpose:</Text>
                    <Text style={styles.modalValue}>
                      {selectedReceipt?.Fee_Purpose_Name}
                    </Text>
                  </View>

                  <View style={styles.modalItem}>
                    <Text style={styles.modalLabel}>Course / Semester:</Text>
                    <Text style={styles.modalValue}>
                      {selectedReceipt?.Course_Year_Name} -{' '}
                      {selectedReceipt?.Semester_Name}
                    </Text>
                  </View>

                  <View style={styles.modalItem}>
                    <Text style={styles.modalLabel}>Session:</Text>
                    <Text style={styles.modalValue}>
                      {selectedReceipt?.Academic_Session_Name_E}
                    </Text>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedReceipt(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
      {!footerHide && (
        <View>
          <Footer />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },

  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },

  modalItem: {
    marginBottom: 12,
  },

  modalLabel: {
    fontSize: 14,
    color: '#777',
  },

  modalValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },

    headerText: {
    margin:10,
    padding:10,
    borderRadius: 8,
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    backgroundColor: '#ff922b',
  },

  closeButton: {
    marginTop: 20,
    backgroundColor: '#CF524C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  container: { flex: 1, backgroundColor: '#ECEDEF' },
  search: {
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a5d6a7',
  },
  dropdown: {
    marginHorizontal: 15,
    marginBottom: 10,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#a5d6a7',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a5d6a7',
    marginTop: 4,
    elevation: 5,
  },
  placeholderStyle: { fontSize: 14, color: '#999' },
  selectedTextStyle: { fontSize: 14, color: '#1b5e20' },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginVertical: 4,
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 5,
    borderBottomColor: '#ff922b',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  headtittle: {
    width: '50%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000397ff',
    marginBottom: 8,
  },
  gridItem: { width: '50%', fontSize: 14, color: '#333', marginBottom: 8 },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2ad00ff',
    padding: 6,
    borderRadius: 6,
  },
  downloadText: { color: '#fff', fontWeight: 'bold' },
});

export default FeeReceipt;
 
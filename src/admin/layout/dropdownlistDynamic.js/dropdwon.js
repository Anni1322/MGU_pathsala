// import React, { useState, useCallback } from 'react';
// import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
// import { DropdownSelector } from './components/DropdownSelector'; // Assuming you have this component

// // Static data for session and semester
// const STATIC_SESSION_DATA = [
//   { key: 'session1', label: 'Session 1' },
//   { key: 'session2', label: 'Session 2' },
//   // Add more sessions here
// ];

// const STATIC_SEMESTERS = [
//   { key: 'semester1', label: 'Semester 1' },
//   { key: 'semester2', label: 'Semester 2' },
//   // Add more semesters here
// ];

// // Styles
// const modalStyles = {
//   centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   modalView: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300 },
//   modalTitle: { fontSize: 18, fontWeight: 'bold' },
//   officeListScrollView: { maxHeight: 200 },
//   officeListItem: { padding: 10 },
//   officeItemText: { fontSize: 16 },
//   noDataText: { fontSize: 14, color: 'gray' },
//   closeButton: { marginTop: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
//   textStyle: { color: 'white', textAlign: 'center' },
// };

// const styles = {
//   selectorContainercard: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
//   changeOfficeButton: { padding: 10, backgroundColor: '#007bff', borderRadius: 5, width: '45%' },
//   sessionDropdown: { width: '45%' },
//   semesterDropdown: { width: '45%' },
//   sessionDropdownText: { color: 'black' }
// };

// const SessionSemesterPage = () => {
//   // State for selected session and semester
//   const [selectedSession, setSelectedSession] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [isModalVisibleSession, setModalVisibleSession] = useState(false);
//   const [isModalVisibleSemester, setModalVisibleSemester] = useState(false);

//   // Open and close session modal
//   const openModalSession = useCallback(() => setModalVisibleSession(true), []);
//   const closeModalSession = useCallback(() => setModalVisibleSession(false), []);

//   // Open and close semester modal
//   const openModalSemester = useCallback(() => setModalVisibleSemester(true), []);
//   const closeModalSemester = useCallback(() => setModalVisibleSemester(false), []);

//   // Handler for session change
//   const SessionChange = useCallback((data) => {
//     setSelectedSession(data?.key);
//     setModalVisibleSession(false);
//   }, []);

//   // Handler for semester change
//   const SemesterChange = useCallback((data) => {
//     setSelectedSemester(data?.key);
//     setModalVisibleSemester(false);
//   }, []);

//   // Session modal content
//   const SessionListModalContent = React.memo(({ closeModalSession }) => (
//     <View style={modalStyles.centeredView}>
//       <View style={modalStyles.modalView}>
//         <Text style={modalStyles.modalTitle}>Select Session</Text>
//         {STATIC_SESSION_DATA && STATIC_SESSION_DATA.length > 0 ? (
//           <ScrollView style={modalStyles.officeListScrollView}>
//             {STATIC_SESSION_DATA.map((ses, index) => (
//               <TouchableOpacity
//                 key={ses.key || index}
//                 onPress={() => SessionChange(ses)}
//                 style={modalStyles.officeListItem}
//               >
//                 <Text style={modalStyles.officeItemText}>{ses.label || ` ${index + 1}`}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         ) : (
//           <Text style={modalStyles.noDataText}>No available.</Text>
//         )}
//         <TouchableOpacity style={modalStyles.closeButton} onPress={closeModalSession}>
//           <Text style={modalStyles.textStyle}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   ));

//   // Semester modal content
//   const SemesterListModalContent = React.memo(({ closeModalSemester }) => (
//     <View style={modalStyles.centeredView}>
//       <View style={modalStyles.modalView}>
//         <Text style={modalStyles.modalTitle}>Select Semester</Text>
//         {STATIC_SEMESTERS && STATIC_SEMESTERS.length > 0 ? (
//           <ScrollView style={modalStyles.officeListScrollView}>
//             {STATIC_SEMESTERS.map((sem, index) => (
//               <TouchableOpacity
//                 key={sem.key || index}
//                 onPress={() => SemesterChange(sem)}
//                 style={modalStyles.officeListItem}
//               >
//                 <Text style={modalStyles.officeItemText}>{sem.label || ` ${index + 1}`}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         ) : (
//           <Text style={modalStyles.noDataText}>No available.</Text>
//         )}
//         <TouchableOpacity style={modalStyles.closeButton} onPress={closeModalSemester}>
//           <Text style={modalStyles.textStyle}>Close</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   ));

//   return (
//     <View style={{ flex: 1 }}>
//       {/* Modals */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isModalVisibleSession}
//         onRequestClose={closeModalSession}
//       >
//         <SessionListModalContent closeModalSession={closeModalSession} />
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isModalVisibleSemester}
//         onRequestClose={closeModalSemester}
//       >
//         <SemesterListModalContent closeModalSemester={closeModalSemester} />
//       </Modal>

//       {/* Selector Buttons and Dropdowns */}
//       <View style={styles.selectorContainercard}>
//         <TouchableOpacity
//           style={styles.changeOfficeButton}
//           onPress={openModalSession}
//           accessibilityLabel="Select a Session"
//         >
//           <Text>{selectedSession || 'Select a Session'}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.changeOfficeButton}
//           onPress={openModalSemester}
//           accessibilityLabel="Select a Semester"
//         >
//           <Text>{selectedSemester || 'Select a Semester'}</Text>
//         </TouchableOpacity>
//       </View>

//       <DropdownSelector
//         data={STATIC_SESSION_DATA}
//         initValue={STATIC_SESSION_DATA.find(item => item.key === selectedSession)?.label || 'Select a Session'}
//         onChange={SessionChange}
//         style={styles.sessionDropdown}
//         initValueTextStyle={styles.sessionDropdownText}
//       />
//       <DropdownSelector
//         data={STATIC_SEMESTERS}
//         initValue={STATIC_SEMESTERS.find(item => item.key === selectedSemester)?.label || 'Select a Semester'}
//         onChange={SemesterChange}
//         style={styles.semesterDropdown}
//       />
//     </View>
//   );
// };

// export default SessionSemesterPage;

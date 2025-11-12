import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Header from '../layout/Header/Header';
import Footer from '../layout/Footer/Footer';

const FinanceDashboard = () => {
    const [activeTab, setActiveTab] = useState('checked');

    const checkedPapers = [
        { id: 1, title: "Agronomy Paper 1", bill: 550 },
        { id: 2, title: "Horticulture Paper 1", bill: 450 },
        { id: 3, title: "Soil Science Paper 1", bill: 400 },
    ];

    const allottedPapers = [
        { id: 4, title: "Agronomy Paper 2", status: "Pending" },
        { id: 5, title: "Horticulture Paper 2", status: "Pending" },
        { id: 6, title: "Agricultural Economics Paper 1", status: "Pending" },
    ];

    const totalPapers = checkedPapers.length + allottedPapers.length;
    const completedPapers = checkedPapers.length;
    const progress = (completedPapers / totalPapers) * 100;

    // Count the number of pending papers
    const pendingPapersCount = allottedPapers.filter(paper => paper.status === 'Pending').length;

    const renderItem = (item) => (
        <View style={styles.paperItem} key={item.id}>
            <Text style={styles.paperTitle}>{item.title}</Text>
            {item.bill && <Text style={styles.paperBill}>Bill: ₹{item.bill}</Text>}
            {item.status && <Text style={styles.paperStatus}>Status: {item.status}</Text>}
        </View>
    );

    // Handle tab change and show alert for Pending count
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'allotted') {
            Alert.alert('Pending Papers', `You have ${pendingPapersCount} pending papers.`);
        }
    };

    useEffect(() => {
        handleTabChange('allotted');
    }, []);

    return (
        <ScrollView >
            <Header />
            <View style={styles.container}>
                {/* Tabs Section */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'checked' && styles.activeTab]}
                        onPress={() => handleTabChange('checked')}
                    >
                        <Text style={[styles.tabText, activeTab === 'checked' && styles.activeTabText]}>
                            Checked Papers
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'allotted' && styles.activeTab]}
                        onPress={() => handleTabChange('allotted')}
                    >
                        <Text style={[styles.tabText, activeTab === 'allotted' && styles.activeTabText]}>
                            Allotted Papers
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Progress Section */}
                <View style={styles.progressSection}>
                    <Text style={styles.sectionTitle}>Progress</Text>
                    <Text style={styles.progressText}>{completedPapers} / {totalPapers} papers checked</Text>
                    <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                    <View style={styles.progressBarWrapper}>
                        <View
                            style={[
                                styles.progressBar,
                                { width: `${Math.round(progress)}%` },
                            ]}
                        />
                    </View>
                </View>

                {/* List Section Based on Active Tab */}
                <FlatList
                    data={activeTab === 'checked' ? checkedPapers : allottedPapers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => renderItem(item)}
                    ListEmptyComponent={<Text style={styles.emptyText}>No Papers Available</Text>}
                />
            </View>
        </ScrollView>
    );
};

// Styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 24,
        borderRadius: 10,
        marginTop: 15,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: { borderBottomWidth: 4, borderBottomColor: '#2e7d32' },
    tabText: { color: '#6B6B81', fontWeight: '600' },
    activeTabText: { color: '#0B136E', fontWeight: 'bold' },

    progressSection: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 10,
    },
    progressText: {
        fontSize: 16,
        color: '#34495e',
    },
    progressPercentage: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#27ae60',
        marginTop: 10,
    },
    progressBarWrapper: {
        marginTop: 10,
        height: 10,
        width: '100%',
        backgroundColor: '#ecf0f1',
        borderRadius: 5,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#2e7d32',
        borderRadius: 5,
    },

    paperItem: {
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#bdc3c7',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    paperTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    paperBill: {
        fontSize: 14,
        color: '#e74c3c',
        marginTop: 5,
    },
    paperStatus: {
        fontSize: 14,
        color: '#f39c12',
        marginTop: 5,
    },

    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
    },
});

export default FinanceDashboard;

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { Button, Card } from 'react-native-paper';

// export default function FinanceDashboard() {
//   // Sample dynamic data
//   const [eGrievancesData, setEGrievancesData] = useState([
//     { category: 'Employee', total: 10, resolved: 5, pending: 5 },
//     { category: 'Student', total: 15, resolved: 10, pending: 5 },
//     { category: 'Others', total: 8, resolved: 3, pending: 5 },
//   ]);

//   const [employeeComplainsData, setEmployeeComplainsData] = useState([
//     {
//       problem: 'Employee Claims/Bills',
//       total: 5,
//       resolved: 2,
//       forwarded: 1,
//       pending: 2,
//     },
//     {
//       problem: 'Finance Reports',
//       total: 8,
//       resolved: 4,
//       forwarded: 2,
//       pending: 2,
//     },
//     {
//       problem: 'Login ID Password',
//       total: 3,
//       resolved: 1,
//       forwarded: 1,
//       pending: 1,
//     },
//     {
//       problem: 'Others(Employee)',
//       total: 2,
//       resolved: 1,
//       forwarded: 0,
//       pending: 1,
//     },
//     {
//       problem: 'Problem in Research Project Submission',
//       total: 6,
//       resolved: 3,
//       forwarded: 2,
//       pending: 1,
//     },
//     {
//       problem: 'Network Issue',
//       total: 4,
//       resolved: 2,
//       forwarded: 1,
//       pending: 1,
//     },
//     {
//       problem: 'Work and Role allotment',
//       total: 7,
//       resolved: 5,
//       forwarded: 1,
//       pending: 1,
//     },
//     {
//       problem: 'Establishment',
//       total: 3,
//       resolved: 1,
//       forwarded: 1,
//       pending: 1,
//     },
//     {
//       problem: 'New Login Issue',
//       total: 4,
//       resolved: 2,
//       forwarded: 1,
//       pending: 1,
//     },
//     {
//       problem: 'Finance Activity',
//       total: 10,
//       resolved: 6,
//       forwarded: 3,
//       pending: 1,
//     },
//   ]);

//   return (
//     <View style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>eGrievances</Text>
//         <Button mode="contained" style={styles.trackButton}>
//           Track Complain
//         </Button>
//       </View>

//       {/* eGrievances Data Table */}
//       <ScrollView style={styles.scrollContainer}>
//         <Card style={styles.card}>
//           <Card.Content>
//             <Text style={styles.subHeading}>eGrievances</Text>
//             <View style={styles.table}>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableHeader}>Category</Text>
//                 <Text style={styles.tableHeader}>Total</Text>
//                 <Text style={styles.tableHeader}>Resolved</Text>
//                 <Text style={styles.tableHeader}>Pending</Text>
//               </View>

//               {eGrievancesData.map((data, index) => (
//                 <View key={index} style={styles.tableRow}>
//                   <Text style={styles.tableCell}>{data.category}</Text>
//                   <Text style={styles.tableCell}>{data.total}</Text>
//                   <Text style={styles.tableCell}>{data.resolved}</Text>
//                   <Text style={styles.tableCell}>{data.pending}</Text>
//                 </View>
//               ))}
//             </View>
//           </Card.Content>
//         </Card>

//         {/* Employee Complain Data Table */}
//         <Card style={styles.card}>
//           <Card.Content>
//             <Text style={styles.subHeading}>Employee Complain</Text>
//             <View style={styles.table}>
//               <View style={styles.tableRow}>
//                 <Text style={styles.tableHeader}>Problem Name</Text>
//                 <Text style={styles.tableHeader}>Total</Text>
//                 <Text style={styles.tableHeader}>Resolved</Text>
//                 <Text style={styles.tableHeader}>Forwarded</Text>
//                 <Text style={styles.tableHeader}>Pending</Text>
//               </View>

//               {employeeComplainsData.map((complain, index) => (
//                 <View key={index} style={styles.tableRow}>

//                   <Text style={styles.tableCell}>{complain.problem}</Text>

//                   {/* <Text style={{borderBlockColor:'#368d55ff'}}> */}
//                     <Text style={styles.tableCell}>{complain.total}</Text>
//                   {/* </Text> */}
//                   <Text style={styles.tableCell}>{complain.resolved}</Text>
//                   <Text style={styles.tableCell}>{complain.forwarded}</Text>
//                   <Text style={styles.tableCell}>{complain.pending}</Text>
//                 </View>
//               ))}
//             </View>
//           </Card.Content>
//         </Card>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 20,
//     backgroundColor: '#f0f4f8',
//   },
//   header: {
//     backgroundColor: '#e24a6dff',
//     paddingVertical: 20,
//     paddingHorizontal: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerText: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   trackButton: {
//     backgroundColor: '#FF6F61',
//     borderRadius: 8,
//   },
//   scrollContainer: {
//     marginTop: 10,
//     // flex: 1,
//     padding: 5,
//     borderRadius: 10,
//     backgroundColor: '#9ebaff90',
//   },
//   card: {
//     marginBottom: 10,
//     borderRadius: 8,
//     elevation: 1,
//   },
//   subHeading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   table: {
//     marginTop: 10,
//     width: '100%',
//     // backgroundColor: '#ffe3e3ff',
//     // margin:-10
//     padding: -52,
//     borderRadius: 10,
//     backgroundColor: '#7ca0fe6b',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     paddingVertical: 8,
//     paddingHorizontal: 5,
//   },
//   tableHeader: {
//     flex: 1,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   tableCell: {
//     flex: 1,
//     textAlign: 'center',
//   },
//   circle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#FF6F61',
//     justifyContent: 'center',
//     alignItems: 'center',
//     // marginLeft: 5,
//   },
// });

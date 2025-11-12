// import React from "react";
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
//     ScrollView,
//     StatusBar,
// } from "react-native";
// import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Header from "../../layout/Header/Header";

// const ExaminationScreen = ({ navigation }) => {
//     const mcqItems = [
//         { title: "Create Paper", icon: "file-circle-plus" },
//         { title: "Exam Summary", icon: "file-lines" },
//     ];

//     const offlineItems = [
//         { title: "Create Paper", icon: "file-circle-plus" },
//         { title: "Edit/Delete Papers", icon: "pen-to-square" },
//         { title: "Exam Attendance", icon: "user-check" },
//         { title: "Answer Sheet", icon: "file-pen" },
//     ];

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" backgroundColor="#2a2c94" />

//             {/* Header */}
//             <Header />

//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 {/* MCQ Based Examination */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Examination</Text>
//                     <Text style={styles.subTitle}>MCQ Based Examination</Text>

//                     <View style={styles.cardContainer}>
//                         {mcqItems.map((item, index) => (
//                             <TouchableOpacity key={index} style={styles.card}>
//                                 <FontAwesome6 name={item.icon} size={25} color="#2a2c94" />
//                                 <Text style={styles.cardText}>{item.title}</Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 </View>

//                 {/* Offline Examination */}
//                 <View style={styles.section}>
//                     <Text style={styles.subTitleOffline}>Offline Examination</Text>

//                     <View style={styles.cardContainer}>
//                         {offlineItems.map((item, index) => (
//                             <TouchableOpacity key={index} style={styles.card}>
//                                 <FontAwesome6 name={item.icon} size={25} color="#2a2c94" />
//                                 <Text style={styles.cardText}>{item.title}</Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>

//                     <TouchableOpacity style={styles.studentReportCard}>
//                         <FontAwesome6 name="user" size={25} color="#fff" />
//                         <Text style={styles.reportText}>Student App Download Report</Text>
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// export default ExaminationScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#ffffff",
//     },
//     //   header: {
//     //     flexDirection: "row",
//     //     alignItems: "center",
//     //     backgroundColor: "#2a2c94",
//     //     paddingHorizontal: 16,
//     //     paddingVertical: 12,
//     //     justifyContent: "space-between",
//     //   },
//     //   headerTitle: {
//     //     color: "#fff",
//     //     fontSize: 18,
//     //     fontWeight: "600",
//     //   },
//     scrollContainer: {
//         paddingBottom: 30,
//     },
//     section: {
//         alignItems: "center",
//         marginVertical: 10,
//     },
//     sectionTitle: {
//         fontSize: 26,
//         fontWeight: "700",
//         color: "#2a2c94",
//         marginTop: 10,
//     },
//     subTitle: {
//         backgroundColor: "#e5f0ff",
//         color: "#2a2c94",
//         fontWeight: "600",
//         marginVertical: 10,
//         paddingVertical: 4,
//         paddingHorizontal: 12,
//         borderRadius: 10,
//     },
//     subTitleOffline: {
//         color: "#00976f",
//         fontWeight: "700",
//         marginVertical: 10,
//         fontSize: 16,
//         backgroundColor: "#ebfff8",
//         paddingVertical: 4,
//         paddingHorizontal: 12,
//         borderRadius: 10,
//     },
//     cardContainer: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "center",
//     },
//     card: {
//         width: "40%",
//         margin: 10,
//         backgroundColor: "#fff",
//         borderRadius: 15,
//         elevation: 4,
//         alignItems: "center",
//         paddingVertical: 20,
//     },
//     cardText: {
//         marginTop: 10,
//         fontSize: 14,
//         fontWeight: "600",
//         textAlign: "center",
//         color: "#000",
//     },
//     studentReportCard: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#ff6b35",
//         borderRadius: 15,
//         justifyContent: "center",
//         paddingVertical: 16,
//         paddingHorizontal: 10,
//         marginTop: 20,
//         width: "90%",
//     },
//     reportText: {
//         color: "#fff",
//         fontSize: 15,
//         fontWeight: "600",
//         marginLeft: 10,
//     },
// });







import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";

const ExaminationScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("checked");

  // === Finance Section Data ===
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
  const pendingPapersCount = allottedPapers.filter(
    (paper) => paper.status === "Pending"
  ).length;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "allotted") {
      Alert.alert("Pending Papers", `You have ${pendingPapersCount} pending papers.`);
    }
  };

  useEffect(() => {
    handleTabChange("checked");
  }, []);

  const renderItem = (item) => (
    <View style={styles.paperItem} key={item.id}>
      <Text style={styles.paperTitle}>{item.title}</Text>
      {item.bill && <Text style={styles.paperBill}>Bill: ₹{item.bill}</Text>}
      {item.status && <Text style={styles.paperStatus}>Status: {item.status}</Text>}
    </View>
  );

  // === Examination Section Data ===
  const mcqItems = [
    { title: "Create Paper", icon: "file-circle-plus" },
    { title: "Exam Summary", icon: "file-lines" },
  ];

  const offlineItems = [
    { title: "Create Paper", icon: "file-circle-plus" },
    { title: "Edit/Delete Papers", icon: "pen-to-square" },
    { title: "Exam Attendance", icon: "user-check" },
    { title: "Answer Sheet", icon: "file-pen" },
    { title: "Scan", icon: "file-pen" , screen: "QRScannerr"},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2a2c94" />
      <Header />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== Examination Section ===== */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.studentReportCard}>
            <FontAwesome6 name="user" size={25} color="#fff" />
            <Text style={styles.reportText}>Examination</Text>
            {/* <Text style={styles.reportText}>Student App Download Report</Text> */}
          </TouchableOpacity>

          {/* <Text style={styles.sectionTitle}>Examination</Text> */}
          <Text style={styles.subTitle}>MCQ Based Examination</Text>

          <View style={styles.cardContainer}>
            {mcqItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.card}>
                <FontAwesome6 name={item.icon} size={25} color="#2a2c94" />
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subTitleOffline}>Offline Examination</Text>

          <View style={styles.cardContainer}>
            {offlineItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.card}
              onPress={() => item.screen ? navigation.navigate(item.screen) : null}
              >
                <FontAwesome6 name={item.icon} size={25} color="#2a2c94" />
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>


        </View>


        {/* ===== Finance Dashboard Section ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finance Dashboard</Text>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "checked" && styles.activeTab]}
              onPress={() => handleTabChange("checked")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "checked" && styles.activeTabText,
                ]}
              >
                Checked Papers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "allotted" && styles.activeTab]}
              onPress={() => handleTabChange("allotted")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "allotted" && styles.activeTabText,
                ]}
              >
                Allotted Papers
              </Text>
            </TouchableOpacity>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressText}>
              {completedPapers} / {totalPapers} papers checked
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(progress)}%
            </Text>
            <View style={styles.progressBarWrapper}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
          </View>

          {/* Paper List */}
          <FlatList
            data={activeTab === "checked" ? checkedPapers : allottedPapers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Papers Available</Text>
            }
          />
        </View>

      
      </ScrollView>
        <Footer />
    </SafeAreaView>
  );
};

export default ExaminationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: { marginVertical: 15, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2a2c94",
    marginBottom: 10,
    textAlign: "center",
  },

  // Tabs
  tabsContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: { borderBottomWidth: 4, borderBottomColor: "#2a2c94" },
  tabText: { color: "#6B6B81", fontWeight: "600" },
  activeTabText: { color: "#2a2c94", fontWeight: "bold" },

  // Progress
  progressSection: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f9f9ff",
    borderRadius: 10,
    elevation: 3,
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2a2c94",
    marginBottom: 5,
  },
  progressText: { fontSize: 15, color: "#333" },
  progressPercentage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
    marginVertical: 5,
  },
  progressBarWrapper: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2a2c94",
    borderRadius: 5,
  },

  // Papers
  paperItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  paperTitle: { fontSize: 16, fontWeight: "bold", color: "#2c3e50" },
  paperBill: { color: "#e74c3c", marginTop: 5 },
  paperStatus: { color: "#f39c12", marginTop: 5 },
  emptyText: { textAlign: "center", color: "#888", marginVertical: 10 },

  // Examination Cards
  subTitle: {
    backgroundColor: "#e5f0ff",
    color: "#2a2c94",
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  subTitleOffline: {
    color: "#00976f",
    fontWeight: "700",
    backgroundColor: "#ebfff8",
    textAlign: "center",
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 15,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: "42%",
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 4,
    alignItems: "center",
    paddingVertical: 20,
  },
  cardText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },
  studentReportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b35",
    borderRadius: 15,
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 20,
  },
  reportText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
  },
});

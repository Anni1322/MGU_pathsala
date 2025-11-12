// import React from 'react';
// import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// const Result = () => {
//   const student = {
//     name: 'Nikita Sahu',
//     rollNo: 'AG2023BSC104',
//     class: 'B.Sc. (Agri) 2nd Year',
//     school: 'Indira Gandhi Krishi Vishwavidyalaya (IGKV), Raipur',
//     avatar: 'https://i.pravatar.cc/150?img=48',
//     results: [
//       { subject: 'Crop Production', marks: 91, icon: 'seedling' },
//       { subject: 'Soil Science', marks: 87, icon: 'flask' },
//       { subject: 'Horticulture', marks: 93, icon: 'carrot' },
//       { subject: 'Agri Economics', marks: 85, icon: 'chart-line' },
//       { subject: 'Plant Pathology', marks: 89, icon: 'leaf' },
//     ],
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.card}>
//         {/* Header Section */}
//         <View style={styles.header}>
//           <Image source={{ uri: student.avatar }} style={styles.avatar} />
//           <View style={styles.headerText}>
//             <Text style={styles.name}>{student.name}</Text>
//             <Text style={styles.info}>{student.class}</Text>
//             <Text style={styles.info}>Roll No: {student.rollNo}</Text>
//           </View>
//         </View>

//         {/* School Name */}
//         <Text style={styles.schoolName}>{student.school}</Text>

//         {/* Divider */}
//         <View style={styles.divider} />

//         {/* Subject-wise Marks */}
//         <Text style={styles.sectionTitle}>📋 Subject-wise Marks</Text>
//         {student.results.map((item, index) => (
//           <View style={styles.resultRow} key={index}>
//             <FontAwesome6 name={item.icon} size={22} color="#4CAF50" />
//             <Text style={styles.subject}>{item.subject}</Text>
//             <Text style={styles.marks}>{item.marks}/100</Text>
//           </View>
//         ))}

//         {/* Footer */}
//         <View style={styles.footer}>
//           <EvilIcons name="calendar" size={20} color="#666" />
//           <Text style={styles.footerText}>Academic Year: 2023–24</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#F6F6F6',
//   },
//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 16,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   avatar: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//   },
//   headerText: {
//     marginLeft: 12,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   info: {
//     fontSize: 14,
//     color: '#666',
//   },
//   schoolName: {
//     fontSize: 15,
//     textAlign: 'center',
//     color: '#888',
//     marginBottom: 10,
//   },
//   divider: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#DDD',
//     marginVertical: 10,
//   },
//   sectionTitle: {
//     fontSize: 17,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   resultRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 6,
//   },
//   subject: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 15,
//   },
//   marks: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   footer: {
//     marginTop: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   footerText: {
//     marginLeft: 6,
//     fontSize: 13,
//     color: '#666',
//   },
// });

// export default Result;

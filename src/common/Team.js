import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Modal, Pressable } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../admin/layout/Header/Header';

const MGUVVTeamScreen = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  // Expanded Team Data
  const sections = [
    {
      title: 'Patron',
      name: 'PROF. RAVI R. SAXENA',
      role: "Hon'ble Vice Chancellor",
      hasImage: true,
      imageUri: 'https://randomuser.me/api/portraits/men/32.jpg',
      colors: ['#4C6ED7', '#92A3FD'],
      details: "An eminent scientist and academician leading MGUVV towards excellence in Horticulture and Forestry research."
    },
    {
      title: 'Administration',
      name: 'DR. S.K. PATHAK', 
      role: "Registrar",
      hasImage: true,
      imageUri: 'https://randomuser.me/api/portraits/men/45.jpg',
      colors: ['#24C6DC', '#514A9D'],
      details: "Overseeing university administration, academic affairs, and institutional development."
    },
    {
      title: 'Principal Investigator',
      name: 'DR. ANJALI SHARMA', 
      role: "Professor & Head (Horticulture)",
      hasImage: true,
      imageUri: 'https://randomuser.me/api/portraits/women/44.jpg',
      colors: ['#11998e', '#38ef7d'],
      details: "Leading the specialized project on climate-resilient crop varieties and digital agriculture integration."
    },
    {
      title: 'Nodal Officer',
      name: 'SHRI R.K. VERMA', 
      role: "IT & Digital Services",
      hasImage: true,
      imageUri: 'https://randomuser.me/api/portraits/men/60.jpg',
      colors: ['#FF8008', '#FFC837'],
      details: "Coordinating digital initiatives and technical implementation across university departments."
    },
    {
      title: 'Technical Support (NIC Team)',
      name: 'NIC TEAM CHHATTISGARH',
      role: "State Centre Raipur",
      hasImage: false,
      isGroup: true,
      teamAvatars: [
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/women/2.jpg',
        'https://randomuser.me/api/portraits/men/3.jpg'
      ],
      colors: ['#FF512F', '#DD2476'],
      details: "Technical development, hosting, and maintenance support provided by National Informatics Centre (NIC)."
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7FF" />
      <Header />

      {/* MEMBER DETAILS MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={selectedMember !== null}
        onRequestClose={() => setSelectedMember(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedMember(null)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedMember(null)}>
              <FontAwesome6 name="circle-xmark" size={24} color="#FF512F" />
            </TouchableOpacity>

            {selectedMember && (
              <View style={styles.modalBody}>
                {selectedMember.hasImage ? (
                  <Image source={{ uri: selectedMember.imageUri }} style={styles.modalPortrait} />
                ) : (
                  <View style={styles.groupIcon}><FontAwesome6 name="users-gear" size={40} color="#3F51B5" /></View>
                )}
                <Text style={styles.modalName}>{selectedMember.name}</Text>
                <Text style={styles.modalRoleText}>{selectedMember.role}</Text>
                <View style={styles.tag}><Text style={styles.tagText}>{selectedMember.title}</Text></View>
                <Text style={styles.modalBio}>{selectedMember.details}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
       

        {sections.map((item, index) => (
          <View key={index} style={styles.cardWrapper}>
            <Text style={styles.sectionLabel}>{item.title}</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setSelectedMember(item)}>
              <LinearGradient colors={item.colors} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.mainCard}>
                <View style={styles.cardOverlay}>
                  <View style={styles.row}>
                    {item.isGroup ? (
                      <View style={styles.avatarStack}>
                        {item.teamAvatars.map((url, i) => (
                          <Image key={i} source={{ uri: url }} style={[styles.stackImg, { marginLeft: i === 0 ? 0 : -12 }]} />
                        ))}
                      </View>
                    ) : (
                      <View style={styles.imageWrapper}>
                        <Image source={{ uri: item.imageUri }} style={styles.avatar} />
                      </View>
                    )}
                    
                    <View style={styles.infoContainer}>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <Text style={styles.memberRole}>{item.role}</Text>
                    </View>
                    <FontAwesome6 name="circle-info" size={18} color="rgba(255,255,255,0.8)" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FF' },
  scrollContent: { paddingBottom: 30 },
  topHeader: { paddingHorizontal: 20, paddingVertical: 20, alignItems: 'center', backgroundColor: '#FFF', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 2 },
  title: { fontSize: 24, fontWeight: '900', color: '#1A1D2E' },
  subTitle: { fontSize: 13, color: '#666', marginTop: 2 },
  sectionLabel: { fontSize: 15, fontWeight: 'bold', color: '#555', marginBottom: 8, paddingHorizontal: 25, textTransform: 'uppercase' },
  cardWrapper: { marginBottom: 15 },
  mainCard: { borderRadius: 22, marginHorizontal: 20, overflow: 'hidden', elevation: 4 },
  cardOverlay: { padding: 18, backgroundColor: 'rgba(255, 255, 255, 0.05)' },
  row: { flexDirection: 'row', alignItems: 'center' },
  imageWrapper: { width: 55, height: 55, borderRadius: 27.5, overflow: 'hidden', marginRight: 15, borderWidth: 2, borderColor: '#FFF' },
  avatar: { width: '100%', height: '100%' },
  avatarStack: { flexDirection: 'row', marginRight: 15 },
  stackImg: { width: 35, height: 35, borderRadius: 17.5, borderWidth: 2, borderColor: '#FFF' },
  infoContainer: { flex: 1 },
  memberName: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  memberRole: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 13, marginTop: 2 },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(26, 29, 46, 0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 30, padding: 25, alignItems: 'center' },
  closeBtn: { alignSelf: 'flex-end', marginBottom: -10 },
  modalBody: { alignItems: 'center', width: '100%' },
  modalPortrait: { width: 110, height: 110, borderRadius: 55, marginBottom: 15, borderWidth: 3, borderColor: '#F4F7FF' },
  groupIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F4FF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  modalName: { fontSize: 22, fontWeight: '800', color: '#1A1D2E', textAlign: 'center' },
  modalRoleText: { fontSize: 15, color: '#666', marginTop: 4 },
  tag: { backgroundColor: '#E8F0FE', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 10 },
  tagText: { color: '#3F51B5', fontSize: 11, fontWeight: 'bold' },
  divider: { width: '100%', height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  modalBio: { fontSize: 15, color: '#444', textAlign: 'center', lineHeight: 22, marginTop: 15 }
});

export default MGUVVTeamScreen;











// import React, { useState } from 'react';
// import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Modal, Pressable } from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import LinearGradient from 'react-native-linear-gradient';

// const MGUVVTeamScreen = () => {
//   // 1. State to manage the modal visibility and which member is selected
//   const [selectedMember, setSelectedMember] = useState(null);

//   const sections = [
//     {
//       title: 'Patron',
//       name: 'PROF. RAVI R. SAXENA',
//       role: "Hon'ble Vice Chancellor",
//       hasImage: true,
//       imageUri: 'https://randomuser.me/api/portraits/men/32.jpg',
//       colors: ['#4C6ED7', '#92A3FD'],
//       details: "Leading the university with over 30 years of academic experience in horticulture and research."
//     },
//     {
//       title: 'Principal Investigator',
//       name: 'DR. ANJALI SHARMA', 
//       role: "Professor & Head (Horticulture)",
//       hasImage: true,
//       imageUri: 'https://randomuser.me/api/portraits/women/44.jpg',
//       colors: ['#24C6DC', '#514A9D'],
//       details: "Specializing in sustainable farming practices and local crop optimization at Durg."
//     },
//     // ... add more as needed
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F4F7FF" />
      
//       {/* 2. THE MODAL COMPONENT */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={selectedMember !== null}
//         onRequestClose={() => setSelectedMember(null)}
//       >
//         <Pressable style={styles.modalOverlay} onPress={() => setSelectedMember(null)}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Member Profile</Text>
//               <TouchableOpacity onPress={() => setSelectedMember(null)}>
//                 <FontAwesome6 name="xmark" size={20} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {selectedMember && (
//               <View style={styles.modalBody}>
//                 <Image source={{ uri: selectedMember.imageUri }} style={styles.modalPortrait} />
//                 <Text style={styles.modalName}>{selectedMember.name}</Text>
//                 <Text style={styles.modalRole}>{selectedMember.role}</Text>
//                 <View style={styles.divider} />
//                 <Text style={styles.modalBio}>{selectedMember.details}</Text>
//               </View>
//             )}
//           </View>
//         </Pressable>
//       </Modal>

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <View style={styles.topHeader}>
//           <Text style={styles.title}>Team Members</Text>
//         </View>

//         {sections.map((item, index) => (
//           <View key={index} style={styles.cardWrapper}>
//             <Text style={styles.sectionLabel}>{item.title}</Text>
//             {/* 3. CLICK TRIGGER */}
//             <TouchableOpacity activeOpacity={0.9} onPress={() => setSelectedMember(item)}>
//               <LinearGradient 
//                 colors={item.colors} 
//                 start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
//                 style={styles.mainCard}
//               >
//                 <View style={styles.cardOverlay}>
//                   <View style={styles.row}>
//                     <View style={styles.imageWrapper}>
//                       <Image source={{ uri: item.imageUri }} style={styles.avatar} />
//                     </View>
//                     <View style={styles.infoContainer}>
//                       <Text style={styles.memberName}>{item.name}</Text>
//                       <Text style={styles.memberRole}>{item.role}</Text>
//                     </View>
//                     <FontAwesome6 name="chevron-right" size={16} color="#FFF" />
//                   </View>
//                 </View>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F4F7FF' },
//   scrollContent: { paddingBottom: 30 },
//   topHeader: { paddingHorizontal: 20, paddingVertical: 25, alignItems: 'center' },
//   title: { fontSize: 22, fontWeight: '800', color: '#1A1D2E' },
//   sectionLabel: { fontSize: 16, fontWeight: '700', color: '#444', marginBottom: 10, paddingHorizontal: 20 },
//   cardWrapper: { marginBottom: 20 },
//   mainCard: { borderRadius: 20, marginHorizontal: 20, overflow: 'hidden', elevation: 5 },
//   cardOverlay: { padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.05)' },
//   row: { flexDirection: 'row', alignItems: 'center' },
//   imageWrapper: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden', marginRight: 12, borderWidth: 1, borderColor: '#FFF' },
//   avatar: { width: '100%', height: '100%' },
//   infoContainer: { flex: 1 },
//   memberName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
//   memberRole: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 },

//   // MODAL STYLES
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
//   modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 25, padding: 20, elevation: 10 },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
//   modalTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
//   modalBody: { alignItems: 'center' },
//   modalPortrait: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
//   modalName: { fontSize: 20, fontWeight: 'bold', color: '#1A1D2E' },
//   modalRole: { fontSize: 14, color: '#666', marginBottom: 15 },
//   divider: { width: '100%', height: 1, backgroundColor: '#EEE', marginBottom: 15 },
//   modalBio: { fontSize: 14, color: '#444', textAlign: 'center', lineHeight: 20 }
// });

// export default MGUVVTeamScreen;









// import React from 'react';
// import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import LinearGradient from 'react-native-linear-gradient';

// const MGUVVTeamScreen = () => {
//   const sections = [
//     {
//       title: 'Patron',
//       name: 'PROF. RAVI R. SAXENA',
//       role: "Hon'ble Vice Chancellor",
//       hasImage: true,
//       imageUri: 'https://randomuser.me/api/portraits/men/32.jpg',
//       colors: ['#4C6ED7', '#92A3FD'],
//     },
//     {
//       title: 'Principal Investigator',
//       name: 'DR. ANJALI SHARMA', 
//       role: "Professor & Head (Horticulture)",
//       hasImage: true,
//       imageUri: 'https://randomuser.me/api/portraits/women/44.jpg',
//       colors: ['#24C6DC', '#514A9D'],
//     },
//     {
//       title: 'NIC Team',
//       name: 'Technical Support Division',
//       role: "NIC Raipur & Durg Unit",
//       hasImage: false,
//       teamMembers: [
//         'https://randomuser.me/api/portraits/men/1.jpg',
//         'https://randomuser.me/api/portraits/women/2.jpg',
//         'https://randomuser.me/api/portraits/men/3.jpg',
//         'https://randomuser.me/api/portraits/women/4.jpg',
//       ],
//       colors: ['#FF512F', '#DD2476'],
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F4F7FF" />
      
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         {/* Header Section */}
//         <View style={styles.topHeader}>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome6 name="arrow-left" size={18} color="#666" />
//           </TouchableOpacity>
//           <View style={styles.headerTextContainer}>
//             <Text style={styles.title}>Team Members</Text>
//             <Text style={styles.subTitle}>MGUVV, Durg (Patan)</Text>
//           </View>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome6 name="magnifying-glass" size={18} color="#666" />
//           </TouchableOpacity>
//         </View>

//         {/* Section Cards */}
//         {sections.map((item, index) => (
//           <View key={index} style={styles.cardWrapper}>
//             <Text style={styles.sectionLabel}>{item.title}</Text>
//             <LinearGradient 
//               colors={item.colors} 
//               start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
//               style={styles.mainCard}
//             >
//               <View style={styles.cardOverlay}>
//                 <View style={styles.row}>
//                   {item.hasImage ? (
//                     <View style={styles.imageWrapper}>
//                       <Image source={{ uri: item.imageUri }} style={styles.avatar} />
//                     </View>
//                   ) : (
//                     // This is the overlapping avatar stack for the NIC Team
//                     <View style={styles.avatarStack}>
//                       {item.teamMembers?.map((uri, i) => (
//                         <Image key={i} source={{ uri }} style={[styles.stackImage, { marginLeft: i === 0 ? 0 : -15 }]} />
//                       ))}
//                     </View>
//                   )}
                  
//                   <View style={styles.infoContainer}>
//                     <Text style={styles.memberName}>{item.name}</Text>
//                     <Text style={styles.memberRole}>{item.role}</Text>
//                   </View>
                  
//                   <TouchableOpacity>
//                     <FontAwesome6 name="chevron-right" size={16} color="rgba(255,255,255,0.7)" />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </LinearGradient>
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F4F7FF',
//   },
//   scrollContent: { paddingBottom: 30 },
//   topHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 25,
//   },
//   headerTextContainer: { alignItems: 'center' },
//   title: { fontSize: 22, fontWeight: '800', color: '#1A1D2E' },
//   subTitle: { fontSize: 13, color: '#9BA4B5', fontWeight: '500' },
//   iconButton: {
//     width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF',
//     alignItems: 'center', justifyContent: 'center', elevation: 3,
//   },
//   sectionLabel: { fontSize: 16, fontWeight: '700', color: '#444', marginBottom: 10, marginLeft: 5 },
//   cardWrapper: { paddingHorizontal: 20, marginBottom: 20 },
//   mainCard: { borderRadius: 24, overflow: 'hidden', elevation: 5 },
//   cardOverlay: { padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)' },
//   row: { flexDirection: 'row', alignItems: 'center' },
//   imageWrapper: {
//     width: 55, height: 55, borderRadius: 27.5, borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.6)', overflow: 'hidden', marginRight: 15,
//   },
//   avatar: { width: '100%', height: '100%' },
//   // Avatar Stack Styling
//   avatarStack: { flexDirection: 'row', marginRight: 20, alignItems: 'center' },
//   stackImage: {
//     width: 35, height: 35, borderRadius: 17.5,
//     borderWidth: 2, borderColor: '#FFF',
//   },
//   infoContainer: { flex: 1 },
//   memberName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
//   memberRole: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, marginTop: 3 },
// });

// export default MGUVVTeamScreen;







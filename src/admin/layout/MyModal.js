import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Keyboard } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
// import { HttpService } from "../../common/Services/HttpService";
import SessionService from '../../common/Services/SessionService';


// const MyModal = ({ visible, onClose, onCardClick }) => {
//   const navigation = useNavigation();

//   return (
//     <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.modalContainer}>
//           <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//             <View style={styles.modalContent}>
//               <View style={styles.cardContainer}>
//                 <TouchableOpacity
//                   style={styles.card}
//                   onPress={() => {
//                     navigation.navigate('Student');
//                     onClose();
//                   }
//                   }
//                 // onPress={() => {
//                 //   onCardClick('Card 1 Data');  
//                 // onClose();
//                 // }}
//                 >
//                   <FontAwesome6 name="user" size={24} color="#333" style={styles.icon} />
//                   <Text style={styles.cardText}>
//                   Student pathsala
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.card}
//                   onPress={() => {
//                     navigation.navigate('adminStudentHome');
//                     onClose();
//                   }
//                   }
//                 // onPress={() => {
//                 //   onCardClick('Card 2 Data');
//                 //   onClose();
//                 // }}
//                 >
//                   <FontAwesome6 name="eye" size={24} color="#333" style={styles.icon} />
//                   <Text style={styles.cardText}>View Other Details</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </TouchableWithoutFeedback>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );
// };



const MyModal = ({ visible, onClose, studentData }) => {
  const navigation = useNavigation();
  const [student, setstudent] = useState([])


  useEffect(() => {
    // console.log("Student:", student);
    setstudent(studentData)
    const updateSessionAndRefresh = async () => {
      try {
        const currentSession = await SessionService.getSession();
        if (!currentSession) return;
        const updatedSession = {
          ...currentSession,
          student: student,
          STUDENT_ID: student?.Student_ID
        };
          // console.log("ok")
        await SessionService.saveSession(updatedSession);
        const nowsession = await SessionService.getSession();
        // console.log(nowsession, "nowsessionnowsession")
        } catch (error) {
          console.error("Failed to update session:", error);
        }
      };
      if (student) {
        updateSessionAndRefresh();
      }
    }, [student]);


  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalContent}>
              <View style={styles.cardContainer}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    navigation.navigate('Student', { student: studentData });
                    onClose();
                  }}
                >
                  <FontAwesome6 name="user" size={24} color="#333" style={styles.icon} />
                  <Text style={styles.cardText}>Student Pathsala</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    navigation.navigate('adminStudentHome', { student: studentData });
                    onClose();
                  }}>
                  <FontAwesome6 name="eye" size={24} color="#333" style={styles.icon} />
                  <Text style={styles.cardText}>View Other Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};






const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(105, 100, 100, 0.9)',
  },
  modalContent: {
    width: 450,
    padding: 20,
    // backgroundColor: '#eeeeee16',
    borderRadius: 10,
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 190,
    padding: 15,

    marginBottom: 10,
    backgroundColor: '#f7f7f7ff',
    borderRadius: 8,
  },
  icon: {
    margin: 5
    // marginRight: 10,
  },
  cardText: {
    margin: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyModal;

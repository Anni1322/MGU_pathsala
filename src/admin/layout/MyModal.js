import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import SessionService from '../../common/Services/SessionService';
import colors from '../../common/config/colors';

const MyModal = ({ visible, onClose, studentData }) => {
  const navigation = useNavigation();
  const [student, setstudent] = useState([]);

  useEffect(() => {
    setstudent(studentData);

    const updateSessionAndRefresh = async () => {
      try {
        const currentSession = await SessionService.getSession();
        if (!currentSession) return;

        const updatedSession = {
          ...currentSession,
          student: student,
          STUDENT_ID: student?.Student_ID
        };

        await SessionService.saveSession(updatedSession);
      } catch (error) {
        console.error("Failed to update session:", error);
      }
    };

    if (student) updateSessionAndRefresh();
  }, [student]);


  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* CLICK OUTSIDE AREA */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Prevent Outside Click Closing When Touching Inside */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.bottomSheet}>
              
              <View style={styles.line} />

              <View style={styles.cardContainer}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    navigation.navigate('Student', { student: studentData });
                    onClose();
                  }}>
                  <FontAwesome6 name="user" size={24} color={colors.background}  />
                  <Text style={styles.cardText}>Student MorGurukul</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    navigation.navigate('adminStudentHome', { student: studentData });
                    onClose();
                  }}>
                  <FontAwesome6 name="eye" size={24} color={colors.background} />
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.73)', // Dim background
    justifyContent: 'flex-end',         // Push modal to bottom
  },

  bottomSheet: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '40%',       // Half screen height
  },

  line: {
    width: 75,
    height: 8,
    backgroundColor: '#e00000ff',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 15,
  },

  cardContainer: {
    marginTop: 10,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 12,
    backgroundColor: colors.footercolor,
    borderRadius: 10,
  },

  cardText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color:'#fff'
  },
});

export default MyModal;

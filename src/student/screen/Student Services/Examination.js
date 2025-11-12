import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Maintenance from '../../../common/Services/Maintenance'

const Examination = () => {
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 1 hour in seconds
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  const examDetails = {
    examName: 'Agricultural Science - Final Exam',
    description: 'This is a comprehensive exam covering all topics learned in the agricultural science course.',
    duration: '1 hour',
  };

  const questions = [
    {
      id: '1',
      questionText: 'What is the best time to plant rice?',
      options: ['Spring', 'Monsoon', 'Winter', 'Autumn'],
      correctAnswer: 'Monsoon',
    },
    {
      id: '2',
      questionText: 'What is the primary cause of soil erosion?',
      options: ['Overgrazing', 'Heavy rainfall', 'Deforestation', 'All of the above'],
      correctAnswer: 'All of the above',
    },
    {
      id: '3',
      questionText: 'Which of these is a common pest in wheat crops?',
      options: ['Aphids', 'Termites', 'Caterpillars', 'All of the above'],
      correctAnswer: 'All of the above',
    },
  ];

  // Countdown timer logic
  useEffect(() => {
    if (timeRemaining > 0 && !isExamSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isExamSubmitted]);

  // Format time remaining into hh:mm:ss format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  // Submit the exam
  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    Alert.alert('Exam Submitted', 'Your exam has been submitted successfully.');
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}

      <Maintenance />

      {/* <View style={styles.header}>
        <Text style={styles.examTitle}>{examDetails.examName}</Text>
        <Text style={styles.examDescription}>{examDetails.description}</Text>
        <Text style={styles.examDuration}>Duration: {examDetails.duration}</Text>
        <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
      </View>

    
      <FlatList
        data={questions}
        renderItem={({ item }) => (
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{item.questionText}</Text>
            <View style={styles.optionsContainer}>
              {item.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswers[item.id] === option && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswerSelect(item.id, option)}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
 
      {!isExamSubmitted && (
        <View style={styles.submitContainer}>
          <Button title="Submit Exam" onPress={handleSubmitExam} color="#005822ff" />
        </View>
      )}

      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.notificationButton}>
          <EvilIcons name="bell" size={30} color="#fff" />
        </TouchableOpacity>
      </View> */}




    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  examTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005822ff',
  },
  examDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  examDuration: {
    fontSize: 14,
    color: '#555',
  },
  timer: {
    fontSize: 20,
    color: '#FF5722',
    marginTop: 10,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#005822ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  submitContainer: {
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#005822ff',
    borderRadius: 50,
    padding: 15,
  },
  notificationButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Examination;

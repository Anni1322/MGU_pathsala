// App.tsx or FilePicker.tsx
import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { pick, types } from '@react-native-documents/picker';

const FilePickerScreen = () => {
  const handlePickFile = async () => {
    try {
      const files = await pick({
        type: [types.allFiles],
        allowMultiSelection: false,
      });

      if (files.length > 0) {
        const file = files[0];
        Alert.alert('File Picked', `Name: ${file.name}\nType: ${file.type}`);
        console.log('File Info:', file);
      }
    } catch (error) {
      if (error.code === 'USER_CANCELLED') {
        console.log('User cancelled picker');
      } else {
        console.error('Picker Error:', error);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Select a File (PDF, DOCX, Image, etc.)</Text>
      <Button title="Pick File" onPress={handlePickFile} />
    </View>
  );
};

export default FilePickerScreen;

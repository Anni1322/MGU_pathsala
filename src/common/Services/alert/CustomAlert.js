import React, { useState } from 'react';
import { View, Text, Modal, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Install: npm install react-native-vector-icons

// Custom Alert Component with Loading, Confirmation, and Modern UI Design
const CustomAlert = ({
  visible,
  type, // 'loading', 'confirmation', 'info'
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onClose, // For info type
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  const handleConfirm = () => {
    setIsVisible(false);
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    setIsVisible(false);
    if (onCancel) onCancel();
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const renderContent = () => {
    switch (type) {
      case 'loading':
        return (
          <View style={styles.content}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.title}>{title || 'Loading...'}</Text>
            <Text style={styles.message}>{message || 'Please wait'}</Text>
          </View>
        );
      case 'confirmation':
        return (
          <View style={styles.content}>
            <Icon name="help-outline" size={50} color="#007AFF" style={styles.icon} />
            <Text style={styles.title}>{title || 'Confirm Action'}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'info':
      default:
        return (
          <View style={styles.content}>
            <Icon name="info-outline" size={50} color="#007AFF" style={styles.icon} />
            <Text style={styles.title}>{title || 'Information'}</Text>
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={type === 'loading' ? null : handleCancel} // Prevent closing loading modal
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;
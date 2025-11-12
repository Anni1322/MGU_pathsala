import React from 'react';
import ModalSelector from 'react-native-modal-selector';
import { StyleSheet } from 'react-native';

const DropdownSelector = ({
    data = [
        { key: 1, label: 'No data' },
    ],
    initValue = 'Select an option',
    onChange = () => { },
    style = {},
}) => {
    return (
        <ModalSelector
            data={data}
            initValue={initValue}
            onChange={onChange}
            style={[styles.selector, style]}
            initValueTextStyle={[styles.initValueText,style]}
            selectTextStyle={styles.selectedTextStyle}
            animationType="slide"
            optionTextStyle={styles.optionTextStyle}
            optionContainerStyle={styles.optionContainerStyle}
            optionStyle={styles.optionStyle}
            cancelText="Cancel"
            cancelTextStyle={styles.cancelTextStyle}
            overlayStyle={styles.overlayStyle}
            optionListContainerStyle={styles.optionListContainerStyle}
        />
    );
};

const styles = StyleSheet.create({
    selector: {
        borderColor: '#ccc',
        borderWidth: 0,
        borderRadius: 8,
        padding: 5,
      
    },
    initValueText: {
        color: '#000000ff',
        fontSize: 16,
    },
    selectedTextStyle: {
        color: '#333',
        fontSize: 16,
    },
    optionTextStyle: {
        color: '#2a9d8f',
        fontSize: 18,
        fontWeight: '600',
    },
    optionContainerStyle: {
        backgroundColor: '#f0f4f8',
    },
    optionStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cancelTextStyle: {
        color: '#e76f51',
        fontWeight: 'bold',
        fontSize: 16,
    },
    overlayStyle: {
        backgroundColor: 'rgba(221, 221, 221, 1)',
    },
    optionListContainerStyle: {
        maxHeight: 250,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 12,
        marginHorizontal: 12,
        backgroundColor: '#fff',
    },
});

export default DropdownSelector;

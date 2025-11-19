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
            initValueTextStyle={[styles.initValueText, style]}
            selectTextStyle={styles.selectedTextStyle}
            animationType="fade"
            // optionTextStyle={styles.optionTextStyle}
            // optionContainerStyle={styles.optionContainerStyle}
            // optionStyle={styles.optionStyle}
            cancelText="Cancel"
            // cancelTextStyle={styles.cancelTextStyle}
            // overlayStyle={styles.overlayStyle}
            // optionListContainerStyle={styles.optionListContainerStyle}
            offset={10}   
        />
    );
};

const styles = StyleSheet.create({
    selector: {
        backgroundColor: '#fff',   
        borderRadius: 8,         
        borderWidth: 1,            
        borderColor: '#E1E1E1',    
        // paddingHorizontal: 16,     
        // paddingVertical: 12,
        justifyContent: 'center',  
        // marginVertical: 10,        
    },
    initValueText: {
        fontSize: 16,              
        color: '#555',          
        fontWeight: '400',         
        letterSpacing: 0.5,       
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#000',            
        fontWeight: '600',         
    },

 
    optionTextStyle: {
        fontSize: 16,
        color: '#333',          
        paddingVertical: 10,        
        fontWeight: '400',
    },

    optionContainerStyle: {
        backgroundColor: '#fff',   
        borderBottomWidth: 1,      
        borderBottomColor: '#E1E1E1',
    },

    optionStyle: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',  
    },

    cancelTextStyle: {
        fontSize: 16,
        color: '#FF6347',          
        fontWeight: '500',        
    },
    overlayStyle: {
        backgroundColor: 'rgba(211, 202, 202, 0.59)',   
        flex: 1,                                   
    },
    optionListContainerStyle: {
        maxHeight: 300,                           
        borderRadius: 8,                           
        marginHorizontal: 16,                      
    },
});

export default DropdownSelector;





















// import React from 'react';
// import ModalSelector from 'react-native-modal-selector';
// import { StyleSheet } from 'react-native';

// const DropdownSelector = ({
//     data = [
//         { key: 1, label: 'No data' },
//     ],
//     initValue = 'Select an option',
//     onChange = () => { },
//     style = {},
// }) => {
//     return (
//         <ModalSelector
//             data={data}
//             initValue={initValue}
//             onChange={onChange}
//             style={[styles.selector, style]}
//             initValueTextStyle={[styles.initValueText, style]}
//             selectTextStyle={styles.selectedTextStyle}
//             animationType="fade"
//             optionTextStyle={styles.optionTextStyle}
//             optionContainerStyle={styles.optionContainerStyle}
//             optionStyle={styles.optionStyle}
//             cancelText="Cancel"
//             cancelTextStyle={styles.cancelTextStyle}
//             overlayStyle={styles.overlayStyle}
//             optionListContainerStyle={styles.optionListContainerStyle}
//             offset={10}   
//         />
//     );
// };

// const styles = StyleSheet.create({
//     selector: {
//         backgroundColor: '#fff',   
//         borderRadius: 8,         
//         borderWidth: 1,            
//         borderColor: '#E1E1E1',    
//         paddingHorizontal: 16,     
//         paddingVertical: 12,
//         justifyContent: 'center',  
//         marginVertical: 10,        
//     },
//     initValueText: {
//         fontSize: 16,              
//         color: '#555',          
//         fontWeight: '400',         
//         letterSpacing: 0.5,       
//     },
//     selectedTextStyle: {
//         fontSize: 16,
//         color: '#000',            
//         fontWeight: '600',         
//     },

 
//     optionTextStyle: {
//         fontSize: 16,
//         color: '#333',          
//         paddingVertical: 10,        
//         fontWeight: '400',
//     },

//     optionContainerStyle: {
//         backgroundColor: '#fff',   
//         borderBottomWidth: 1,      
//         borderBottomColor: '#E1E1E1',
//     },

//     optionStyle: {
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: '#fff',  
//     },

//     cancelTextStyle: {
//         fontSize: 16,
//         color: '#FF6347',          
//         fontWeight: '500',        
//     },
//     overlayStyle: {
//         backgroundColor: 'rgba(211, 202, 202, 0.59)',   
//         flex: 1,                                   
//     },
//     optionListContainerStyle: {
//         maxHeight: 300,                           
//         borderRadius: 8,                           
//         marginHorizontal: 16,                      
//     },
// });

// export default DropdownSelector;


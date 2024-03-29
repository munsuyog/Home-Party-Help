import React, { useState } from 'react';
import { View, Modal, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';

const EditAddressModal = ({ visible, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContent}>
                <Text>Modal Content Here</Text>
                {/* Add your modal content */}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default EditAddressModal;

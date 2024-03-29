import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ButtonSecondary from '../../../../components/common/ButtonSecondary/ButtonSecondary';
import { router } from 'expo-router';

const SuccessPage = () => {
    return (
        <View style={styles.container}>
            <FontAwesome name='warning' size={40} color='red' />
            <Text style={styles.title}>Payment Unsuccessful!</Text>
            <Text style={styles.message}>Your transaction was unsuccessful. Please retry.</Text>
            <View style={{marginTop: 20}}>
            <ButtonSecondary title="Book Again" color onPress={() => router.navigate('/customer/app/Services/Services')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});

export default SuccessPage;

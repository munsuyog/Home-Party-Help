import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ButtonSecondary from '../../../../components/common/ButtonSecondary/ButtonSecondary';
import { router, useLocalSearchParams } from 'expo-router';
import { sendMessage } from '../../../../utils/firebase';

const SuccessPage = () => {
    const params = useLocalSearchParams();
    const {id} = params;
    useEffect(() => {
        const sendNotification = async () => {
            await sendMessage(
                'system',
                'Payment Message',
                id,
                'Provider',
                "Payment Received - Further Details to Follow. Your amount will be transferred manually after work completion. Contact us for any queries."
            );
        }
        sendNotification()
    }, [])
    return (
        <View style={styles.container}>
            <FontAwesome name='check-circle' size={40} color='green' />
            <Text style={styles.title}>Payment Successful!</Text>
            <Text style={styles.message}>Thank you for your payment. Your transaction has been completed successfully.</Text>
            <View style={{marginTop: 20}}>
            <ButtonSecondary title="Home" color onPress={() => router.navigate('/customer/app/Services/Services')} />
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

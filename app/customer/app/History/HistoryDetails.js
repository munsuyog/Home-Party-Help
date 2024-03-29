import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Modal, Linking } from 'react-native'
import { fontFamily } from '../../../../styles/fontStyles'
import { useLocalSearchParams } from 'expo-router'
import { getOrderById } from '../../../../utils/firebase'

const HistoryDetails = () => {
    const params = useLocalSearchParams();
    console.log(params)
    const {id} = params;
    const [history, setHistory] = useState(null)
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const order = await getOrderById(id);
                console.log(order)
                setHistory(order);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchHistory();
    }, []);
    
    // In your JSX, render a WebView component with the checkout URL

    
    
  return (
    <View style={styles.container}>
        {history && (
            <>
                <View style={styles.detailsContainer}>
            <Text style={[fontFamily.poppins700, styles.detailsTitle]}>Booking Details</Text>
            <View style={styles.details}>
                <Text style={[fontFamily.poppins600, styles.detailsSubtitle]}>Booking Date: </Text>
                <Text style={[fontFamily.poppins500, styles.detailsInfo]}>{new Date(history.bookingDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.details}>
                <Text style={[fontFamily.poppins600, styles.detailsSubtitle]}>Subtotal: </Text>
                <Text style={[fontFamily.poppins500, styles.detailsInfo]}>${history.paymentDetails.subTotal}</Text>
            </View>
            <View style={styles.details}>
                <Text style={[fontFamily.poppins600, styles.detailsSubtitle]}>Service Status: </Text>
                <Text style={[fontFamily.poppins500, styles.detailsInfo]}>{history.status}</Text>
            </View>
            <View style={styles.details}>
                <Text style={[fontFamily.poppins600, styles.detailsSubtitle]}>Payment Status: </Text>
                <Text style={[fontFamily.poppins500, styles.detailsInfo]}>{history.paymentDetails.status}</Text>
            </View>
        </View>
        <View style={styles.detailsContainer}>
            <Text style={[fontFamily.poppins700, styles.detailsTitle]}>Provider Details</Text>
            <View style={styles.details}>
                <Text style={[fontFamily.poppins600, styles.detailsSubtitle]}>Name: </Text>
                <Text style={[fontFamily.poppins500, styles.detailsInfo]}>{history.providerDetails.name}</Text>
            </View>
            <View style={styles.details}>
                <Text style={[fontFamily.poppins600, styles.detailsSubtitle]}>Address: </Text>
                <Text style={[fontFamily.poppins500, styles.detailsInfo]}>{history.providerDetails.address}</Text>
            </View>
            <View style={styles.details}>
                <Text style={[fontFamily.poppins600, styles.detailsSubtitle]}>Service: </Text>
                <Text style={[fontFamily.poppins500, styles.detailsInfo]}>{history.providerDetails.service}</Text>
            </View>
        </View>
        <View style={styles.detailsContainer}>
            <Text style={[fontFamily.poppins700, styles.detailsTitle]}>Customer Details</Text>
            <View style={styles.details}>
                <Text style={[fontFamily.poppins600, styles.detailsSubtitle]}>Name: </Text>
                <Text style={[fontFamily.poppins500, styles.detailsInfo]}>{history.customerName}</Text>
            </View>
            <View style={styles.details}>
                <Text style={[fontFamily.poppins600, styles.detailsSubtitle]}>Address: </Text>
                <Text style={[fontFamily.poppins500, styles.detailsInfo]}>{history.address}</Text>
            </View>
        </View>
            </>
        )}
    </View>
  )
}

export default HistoryDetails

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        padding: 10,
        gap: 20
    },
    detailsTitle: {
        fontSize: 20,
        color: '#EF4F5F'
    },
    detailsContainer: {
        borderRadius: 10,
        elevation: 10,
        backgroundColor : 'white',
        width: '100%',
        padding: 20
    },
    detailsSubtitle: {
        fontSize: 18
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 30
    },
    detailsInfo: {
        fontSize: 16,
        opacity: 0.7
    }
})
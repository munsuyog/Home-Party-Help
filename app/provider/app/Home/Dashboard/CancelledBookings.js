import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import PendingBooking from '../../../../../components/provider/Dashboard/Booking';
import { getOrdersByStatusAndUser } from '../../../../../utils/firebase';
import { acceptOrder, rejectOrder } from '../../../../../utils/firebase';
import { getUserData } from '../../../../../utils/useSecureStorage';

const CancelledBookings = () => {
    const [userData, setUserData] = useState(null);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserData();
                setUserData(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchPendingBookings = async () => {
            try {
                if (userData) {
                    setIsLoading(true);
                    const pendingBookingsData = await getOrdersByStatusAndUser(userData.id, 'cancelled');
                    setPendingBookings(pendingBookingsData);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching cancelled bookings:', error);
                setIsLoading(false);
            }
        };
        fetchPendingBookings();
    }, [userData]);

    const acceptBooking = async (orderId) => {
        try {
            await acceptOrder(orderId);
            // Refresh pending bookings after accepting
            const pendingBookingsData = await getOrdersByStatusAndUser(userData.id);
            setPendingBookings(pendingBookingsData);
        } catch (error) {
            console.error('Error accepting booking:', error);
        }
    };

    const rejectBooking = async (orderId) => {
        try {
            await rejectOrder(orderId);
            // Refresh pending bookings after rejecting
            const pendingBookingsData = await getOrdersByStatusAndUser(userData.id);
            setPendingBookings(pendingBookingsData);
        } catch (error) {
            console.error('Error rejecting booking:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : pendingBookings && Object.values(pendingBookings).some((orders) => Object.keys(orders).length > 0) ? (
                Object.values(pendingBookings).map((orders) => (
                    Object.values(orders).map((booking, index) => (
                        <PendingBooking
                            key={index}
                            history={booking}
                            navigation={navigation}
                            onPress={() => { navigation.navigate("HistoryDetails", { history: booking }) }}
                        />
                    ))
                ))
            ) : (
                <Text>No cancelled bookings found.</Text>
            )}
        </ScrollView>
    );
};

export default CancelledBookings;

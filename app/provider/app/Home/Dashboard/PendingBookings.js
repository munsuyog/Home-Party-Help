import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import PendingBooking from '../../../../../components/provider/Dashboard/Booking';
import { getOrdersByStatusAndUser } from '../../../../../utils/firebase';
import { acceptOrder, rejectOrder } from '../../../../../utils/firebase';
import { getUserData } from '../../../../../utils/useSecureStorage';
import { router } from 'expo-router';

const PendingBookings = () => {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
      const fetchUserData = async () => {
        const userData = await getUserData();
        setUserData(userData);
      };
      fetchUserData();
    }, []);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State variable to track loading status

    useEffect(() => {
        const fetchPendingBookings = async () => {
            try {
                if(userData) {
                    const pendingBookingsData = await getOrdersByStatusAndUser(userData.id, 'pending');
                    setPendingBookings(pendingBookingsData);
                    setIsLoading(false); // Set loading to false after fetching data
                }
            } catch (error) {
                console.error('Error fetching pending bookings:', error);
            }
        };

        fetchPendingBookings();

        // Cleanup function
        return () => {
            // Cleanup code if needed
        };
    }, [userData]);

    const acceptBooking = async (orderId) => {
        try {
            await acceptOrder(orderId);
            // Refresh pending bookings after accepting
            const pendingBookingsData = await getOrdersByStatusAndUser(userData.id, 'pending');
            setPendingBookings(pendingBookingsData);
        } catch (error) {
            console.error('Error accepting booking:', error);
        }
    };

    const rejectBooking = async (orderId) => {
        try {
            await rejectOrder(orderId);
            // Refresh pending bookings after rejecting
            const pendingBookingsData = await getOrdersByStatusAndUser(userData.id, 'pending');
            setPendingBookings(pendingBookingsData);
        } catch (error) {
            console.error('Error rejecting booking:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={{alignItems: 'center'}}>
            {isLoading ? ( // Display loading animation if isLoading is true
                <ActivityIndicator size="large" color="#0000ff" />
            ) : pendingBookings && Object.values(pendingBookings).some((orders) => Object.keys(orders).length > 0) ? (
                Object.values(pendingBookings).map((orders) => (
                    Object.values(orders).map((booking, index) => (
                        <PendingBooking
                            key={index}
                            history={booking}
                            actionBtn={() => {acceptBooking(booking.id)}}
                            actionBtnTitle="Accept"
                            actionBtn2={() => {rejectBooking(booking.id)}}
                            actionBtnTitle2="Reject"
                        />
                    ))
                ))
            ) : (
                <Text>No pending bookings found.</Text>
            )}
        </ScrollView>
    );
};

export default PendingBookings;

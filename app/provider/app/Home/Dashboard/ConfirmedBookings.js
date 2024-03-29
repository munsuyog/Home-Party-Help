import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import PendingBooking from '../../../../../components/provider/Dashboard/Booking';
import { getOrdersByStatusAndUser } from '../../../../../utils/firebase';
import { acceptOrder, rejectOrder } from '../../../../../utils/firebase';
import { getUserData } from '../../../../../utils/useSecureStorage';

const ConfirmedBookings = () => {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
      const fetchUserData = async () => {
        const userData = await getUserData();
        setUserData(userData);
      };
      fetchUserData();
    }, []);
    const [confirmedBookings, setConfirmedBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State variable to track loading status

    useEffect(() => {
        const fetchConfirmedBookings = async () => {
            try {
                if(userData) {
                    const confirmedBookingsData = await getOrdersByStatusAndUser(userData.id, 'confirmed');
                    setConfirmedBookings(confirmedBookingsData);
                    setIsLoading(false); // Set loading to false after fetching data
                }
            } catch (error) {
                console.error('Error fetching confirmed bookings:', error);
            }
        };

        fetchConfirmedBookings();

        // Cleanup function
        return () => {
            // Cleanup code if needed
        };
    }, [userData]);

    const acceptBooking = async (orderId) => {
        try {
            await acceptOrder(orderId);
            // Refresh confirmed bookings after accepting
            const confirmedBookingsData = await getOrdersByStatusAndUser(userData.id);
            setConfirmedBookings(confirmedBookingsData);
        } catch (error) {
            console.error('Error accepting booking:', error);
        }
    };

    const rejectBooking = async (orderId) => {
        try {
            await rejectOrder(orderId);
            // Refresh confirmed bookings after rejecting
            const confirmedBookingsData = await getOrdersByStatusAndUser(userData.id);
            setConfirmedBookings(confirmedBookingsData);
        } catch (error) {
            console.error('Error rejecting booking:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={{alignItems: 'center'}}>
            {isLoading ? ( // Display loading animation if isLoading is true
                <ActivityIndicator size="large" color="#0000ff" />
            ) : confirmedBookings && Object.values(confirmedBookings).some((orders) => Object.keys(orders).length > 0) ? (
                Object.values(confirmedBookings).map((orders) => (
                    Object.values(orders).map((booking, index) => (
                        <PendingBooking
                            key={index}
                            history={booking}
                            onPress={() => {acceptBooking(booking.id)}}
                            actionBtnTitle="Accept"
                            actionBtn2={() => {rejectBooking(booking.id)}}
                            actionBtnTitle2="Reject"
                        />
                    ))
                ))
            ) : (
                <Text>No confirmed bookings found.</Text>
            )}
        </ScrollView>
    );
};

export default ConfirmedBookings;

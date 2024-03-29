import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import HistoryComponent from '../../../../components/common/HistoryComponent/HistoryComponent';
import { fontFamily } from '../../../../styles/fontStyles';
import { getOrdersByStatus } from '../../../../utils/firebase';
import { router } from 'expo-router';

const YourHistory = ({ navigation }) => {
    const [history, setHistory] = useState(null);
    console.log(history)
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const ordersByStatus = await getOrdersByStatus();
                // Assuming ordersByStatus is an object with properties like pending, completed, etc.
                // Concatenate the values of each property into a single array
                const allOrders = Object.values(ordersByStatus).reduce((acc, val) => acc.concat(val), []);
                setHistory(allOrders);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            {history &&
                Object.entries(history).map(([status, orders]) => (
                    <View key={status}>
                        {Object.values(orders).map((order,index) => (
                            <HistoryComponent
                                key={index}
                                history={order}
                                onPress={() => router.push({pathname: '/customer/app/History/HistoryDetails', params: {id: order.id} })}
                            />
                        ))}
                    </View>
                ))}
        </ScrollView>
    );
};

export default YourHistory;

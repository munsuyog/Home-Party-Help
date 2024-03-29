import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, TouchableOpacity, ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import { fontFamily } from '../../../../styles/fontStyles';
import ButtonSecondary from '../../../../components/common/ButtonSecondary/ButtonSecondary';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { updateService } from '../../../../utils/firebase';
import { getUserData } from '../../../../utils/useSecureStorage';

const UpdateService = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // State variable for loading indicator
    const [newService, setNewService] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserData();
                setUserData(userData);
                setLoading(false); // Set loading to false once user data is fetched
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false); // Set loading to false in case of error
            }
        };
        fetchUserData();
    }, []);

    const changeService = async () => {
        try {
            setLoading(true); // Set loading to true while updating service
            await updateService(userData.id, newService);
            setLoading(false); // Set loading to false once service is updated
        }
        catch (error) {
            console.error("Error while Updating Service", error);
            setLoading(false); // Set loading to false in case of error
        }
    }

    const services = ['Bartender', 'DJ Artist', 'Waiter']; // List of available services
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            {loading ? ( // Show loading indicator if loading is true
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <Text style={[fontFamily.poppins600, { fontSize: 18 }]}>Current Service: {userData.service}</Text>
                    <RNPickerSelect
                        onValueChange={(value) => setNewService(value)}
                        placeholder={{ label: 'Select Service: ', value: null, color: '#9EA0A4' }}
                        items={[
                            { label: 'Bartender', value: 'bartender' },
                            { label: 'DJ Artist', value: 'dj-artist' },
                            { label: 'Home Helper', value: 'home-helper' },
                        ]}
                    />
                    <ButtonSecondary title="Change Service" width={150} height={50} color onPress={changeService} />
                </>
            )}
        </View>
    );
}

export default UpdateService;

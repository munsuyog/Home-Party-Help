import React, { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { fontFamily } from '../../../../styles/fontStyles';
import ButtonSecondary from '../../../../components/common/ButtonSecondary/ButtonSecondary';
import { getUserData } from '../../../../utils/useSecureStorage';
import { router } from 'expo-router';

const ProviderProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserData();
                setUserData(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };
        fetchUserData();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#EF4F5F" />
            ) : userData ? (
                <View style={styles.profileContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: userData.imageUri }}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.name}>{userData.name}</Text>
                    <Text style={styles.details}>{userData.phone}</Text>
                    <Text style={styles.details}>{userData.email}</Text>
                    <View style={styles.line}></View>
                    <View style={styles.addressContainer}>
                        <Text style={styles.addressText}>Country: {userData.country}</Text>
                        <Text style={styles.addressText}>Zipcode: {userData.zipcode}</Text>
                    </View>
                    <View style={{gap: 20}}>
                    <ButtonSecondary title="About Us" onPress={() => router.push({pathname: '/provider/app/Profile/ViewAboutProfile'})} />
                    <ButtonSecondary title="Edit Profile" onPress={() => router.push({pathname: '/provider/app/Profile/EditProfile'})} />
                    </View>
                </View>
            ) : (
                <Text>No user data available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    profileContainer: {
        backgroundColor: 'white',
        width: '100%',
        alignItems: 'center',
        borderRadius: 20,
        padding: 20,
        elevation: 10,
    },
    imageContainer: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 75,
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        zIndex: 1
    },
    profileImage: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 75
    },
    name: {
        ...fontFamily.poppins600,
        fontSize: 26,
        marginTop: 20,
    },
    details: {
        ...fontFamily.poppins400,
        fontSize: 18,
        marginTop: 10,
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#EAEAEA',
        marginVertical: 20,
    },
    addressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    addressText: {
        ...fontFamily.poppins400,
        fontSize: 16,
        marginVertical: 5,
    },
});

export default ProviderProfile;

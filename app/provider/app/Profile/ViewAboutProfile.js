import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo-vector-icons
import { getUserData } from '../../../../utils/useSecureStorage';
import ButtonSecondary from '../../../../components/common/ButtonSecondary/ButtonSecondary';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';

const ViewAboutProfile = () => {
    const [userData, setUserData] = useState(null);
    console.log(userData)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <View style={styles.container}>
            {userData !== null ? ( // Check if userData is not null
                userData.about ? (
                    <ScrollView>
                        <View style={styles.aboutContainer}>
                            <Text style={styles.aboutTitle}>About Us</Text>
                            <Text style={styles.aboutText}>{userData.about.info}</Text>
                        </View>
                        <View style={styles.galleryContainer}>
                            <Text style={styles.galleryTitle}>Gallery</Text>
                            <ScrollView horizontal={true}>
                                {userData.about.gallery.map((image, index) => (
                                    <Image key={index} source={{ uri: image }} style={styles.image} />
                                ))}
                            </ScrollView>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <ButtonSecondary title="Edit About" onPress={() => router.push({ pathname: '/provider/app/Profile/EditAboutProfile' })} />
                        </View>
                    </ScrollView>
                ) : (
                    <View>
                        <Text style={{ fontSize: 16 }}>About Us is not added yet!</Text>
                        <ButtonSecondary title="Add About" onPress={() => router.push({ pathname: '/provider/app/Profile/EditAboutProfile' })} />
                    </View>
                )
            ) : (
                <ActivityIndicator size="large" color="#EF4F5F" /> // Or any other loading indicator
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    aboutContainer: {
        marginBottom: 20,
    },
    aboutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    aboutText: {
        fontSize: 16,
    },
    galleryContainer: {
        marginBottom: 20,
    },
    galleryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: 150,
        height: 150,
        marginRight: 10,
        borderRadius: 10,
    },
});

export default ViewAboutProfile;

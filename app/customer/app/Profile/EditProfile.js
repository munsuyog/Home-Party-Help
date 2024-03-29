import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Modal, Button, ActivityIndicator } from 'react-native';
import { fontFamily } from '../../../../styles/fontStyles';
import ButtonSecondary from '../../../../components/common/ButtonSecondary/ButtonSecondary';
import * as ImagePicker from 'expo-image-picker'
import { editProfile } from '../../../../utils/firebase';
import { getUserData } from '../../../../utils/useSecureStorage';

const EditProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state for fetching user data
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [state, setState] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [object, setObject] = useState({});
    const [successVisible, setSuccessVisible] = useState(false); // State variable for success message visibility

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

    const handleSaveProfile = async () => {
        try {
            setLoading(true); // Set loading to true before starting save operation
            if (userData.user === "Customer" || userData.user === "Customers") {
                await editProfile("Customers", userData.id, object);
                setSuccessVisible(true); // Show success message
            }
            if (userData.user === "Providers" || userData.user === "Provider") {
                await editProfile("Providers", userData.id, object);
                setSuccessVisible(true); // Show success message
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false after save operation completes
        }
    };

    const handleEditImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.cancelled) {
                setProfileImage(result.assets[0].uri);
                setObject({ ...object, imageUri: result.assets[0].uri });
            }
        } catch (error) {
            console.error('Error picking image: ', error);
            // Handle error if needed
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#EF4F5F" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.imageContainer} onPress={handleEditImage}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                        <Image source={{ uri: userData.imageUri }} style={styles.profileImage} />
                    )}
                <View style={styles.editImageOverlay}>
                    <Text style={styles.editImageText}>Edit Image</Text>
                </View>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={(value) => setObject({ ...object, name: value })}
            />
            <TextInput
                style={styles.input}
                placeholder="Mobile number"
                onChangeText={(value) => setObject({ ...object, phone: value })}
                keyboardType="numeric"
            />
            <View style={styles.addressContainer}>
                <TextInput
                    style={styles.addressInput}
                    placeholder="Country"
                    onChangeText={(value) => setObject({ ...object, country: value })}
                />
                <TextInput
                    style={styles.addressInput}
                    placeholder="Zipcode"
                    onChangeText={(value) => setObject({ ...object, zipcode: value })}
                    keyboardType="numeric"
                />
            </View>
            <ButtonSecondary width={150} height={50} title="Save Profile" onPress={handleSaveProfile} />

            {/* Success Message Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={successVisible}
                onRequestClose={() => setSuccessVisible(false)}
            >
                <View style={styles.successModalContainer}>
                    <View style={styles.successModalContent}>
                        <Text style={styles.successText}>Profile updated successfully!</Text>
                        <Button title="Close" onPress={() => setSuccessVisible(false)} />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    editImageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    editImageText: {
        color: 'white',
        ...fontFamily.poppins400,
    },
    input: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        marginBottom: 20,
        fontSize: 16,
        ...fontFamily.poppins400,
    },
    addressContainer: {
        width: '100%',
        marginBottom: 20,
    },
    addressInput: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        marginBottom: 10,
        fontSize: 16,
        ...fontFamily.poppins400,
    },
    // Styles for Success Message Modal
    successModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    successModalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    successText: {
        ...fontFamily.poppins400,
        fontSize: 18,
        marginBottom: 20,
    },
});

export default EditProfile;

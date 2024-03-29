import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import ButtonSecondary from '../../../../components/common/ButtonSecondary/ButtonSecondary';
import * as ImagePicker from 'expo-image-picker';
import { getUserData } from '../../../../utils/useSecureStorage';
import { updateProviderAboutAndGallery } from '../../../../utils/firebase';

const EditAboutProfile = () => {
    const [about, setAbout] = useState('');
    const [gallery, setGallery] = useState([]);
    const [newImage, setNewImage] = useState(null);
    const [userData, setUserData]= useState(null);
    console.log(gallery)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = await getUserData();
                setUserData(userInfo);
                setAbout(userInfo.about.info || ''); // Set about text from user data
                setGallery(userInfo.about.gallery || []); // Set gallery images from user data
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const launchImagePicker = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (!pickerResult.cancelled) {
            setNewImage(pickerResult.uri);
            setGallery([...gallery, pickerResult.assets[0].uri])
        }
    };

    const deleteImage = (index) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this image?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        const updatedGallery = [...gallery];
                        updatedGallery.splice(index, 1);
                        setGallery(updatedGallery);
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const saveChanges = async () => {
        try {
            await updateProviderAboutAndGallery(userData.id, about, gallery);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Edit About</Text>
                    <TextInput
                        style={styles.input}
                        multiline
                        placeholder="Enter about text..."
                        value={about}
                        onChangeText={setAbout}
                    />
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Add Images to Gallery</Text>
                    <TouchableOpacity style={styles.addButton} onPress={launchImagePicker}>
                        <Text>Select Image</Text>
                    </TouchableOpacity>
                    {newImage && <Image source={{ uri: newImage }} style={styles.image} />}
                    <ScrollView horizontal={true}>
                        {gallery.map((image, index) => (
                            <TouchableOpacity key={index} onLongPress={() => deleteImage(index)}>
                                <Image source={{ uri: image }} style={styles.image} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <ButtonSecondary title="Save Changes" onPress={saveChanges} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        minHeight: 100,
    },
    addButton: {
        backgroundColor: '#efefef',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: 150,
        height: 150,
        marginRight: 10,
        borderRadius: 10,
    },
});

export default EditAboutProfile;

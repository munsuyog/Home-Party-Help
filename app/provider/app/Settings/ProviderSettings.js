import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TextInput } from 'react-native';
import ButtonSecondary from '../../../../components/common/ButtonSecondary/ButtonSecondary';
import { router } from 'expo-router';
import { removeUserData, getUserData } from '../../../../utils/useSecureStorage';
import { deleteUserAccount } from '../../../../utils/firebase';

const ProviderSettings = () => {
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      const fetchUserData = async () => {
          try {
              const userData = await getUserData();
              console.log(userData)
              setUserData(userData);
          } catch (error) {
              console.error('Error fetching user data:', error);
          } finally {
              setLoading(false); // Set loading to false regardless of success or failure
          }
      };
      fetchUserData();
  }, []);

    const handleLogout = async () => {
        try {
            await removeUserData();
            router.replace('/');
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleDeleteAccount = () => {
        setShowModal(true);
    };

    const confirmDeleteAccount = async () => {
      try {
          await deleteUserAccount(userData.email, password)
          await removeUserData();
          router.replace('/');
      } catch (error) {
          console.error('Error deleting user account:', error);
      }
  };

    return (
        <View style={styles.container}>
            <View style={styles.settingsContainer}>
                <View style={styles.settingItem}>
                    <Pressable onPress={() => router.push({ pathname: '/provider/app/Settings/UpdateService' })}>
                        <Text style={styles.settingText}>Update Service</Text>
                    </Pressable>
                </View>
                <View style={styles.settingItem}>
                    {/* Button to delete account */}
                    <ButtonSecondary title="Delete Account" onPress={handleDeleteAccount} width={200} />
                </View>
                <View style={styles.settingItem}>
                    <ButtonSecondary title="Logout" onPress={handleLogout} />
                </View>
            </View>
            {/* Modal for reconfirmation */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>To confirm, please re-enter your password:</Text>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                        <ButtonSecondary title="Confirm" onPress={confirmDeleteAccount} />
                        <ButtonSecondary title="Cancel" onPress={() => setShowModal(false)} color />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: '100%',
    },
    settingsContainer: {
        backgroundColor: 'white',
        width: '90%',
        height: '90%',
        borderRadius: 20,
        elevation: 10,
        padding: 20,
    },
    settingItem: {
        marginVertical: 10,
    },
    settingText: {
        fontSize: 16,
        color: 'black',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        paddingBottom: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center'
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center'
    },
    passwordInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default ProviderSettings;

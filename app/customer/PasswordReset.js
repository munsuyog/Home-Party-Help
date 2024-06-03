import React, { useState } from 'react'
import { KeyboardAvoidingView, Text, TextInput, View,StyleSheet, Platform, ScrollView, Modal, Button, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../styles/commonStyles';
import { fontFamily } from '../../styles/fontStyles';
import ButtonSecondary from '../../components/common/ButtonSecondary/ButtonSecondary';
import { sendPasswordReset } from '../../utils/firebase';
import { router } from 'expo-router';
import ButtonPrimary from '../../components/common/ButtonPrimary/ButtonPrimary';

const PasswordReset = () => {
    const [email, setEmail] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const onResetPress = async () => {
        try {
            setLoading(true);
            await sendPasswordReset(email);
            setLoading(false);
            setIsSuccessModalVisible(true);
        } catch (error) {
            setLoading(false);
            console.error(error);
            setError(error.message);
        }
    };

    const closeModal = () => {
        setIsSuccessModalVisible(false);
        // You can also reset any other state variables here
    };

    return (
        <SafeAreaView style={[commonStyles.container, { width: "100%" }]}>
          <KeyboardAvoidingView
            style={{ flex: 1, width: "100%" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.signupWrapper}>
                <Text style={[styles.signupHead, fontFamily.poppins600]}>
                  Reset Password
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                    }}
                    placeholder="Enter email"
                    style={styles.input}
                    ref={(input) => { setEmailInput = input; }} // Assign ref to the input field
                    returnKeyType="next" // Set returnKeyType to "next"
                    onSubmitEditing={() => { setPasswordInput.focus(); }}
                  />
                </View>
                <Text style={{ color: "red", fontSize: 14 }}>{error}</Text>
                <View style={{ marginTop: 10 }}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : (
                <ButtonSecondary
                      title="Reset Password"
                      onPress={() => onResetPress()}
                      width={200}
                    />
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <Modal
                animationType="slide"
                transparent={true}
                visible={isSuccessModalVisible}
                onRequestClose={() => setSuccessVisible(false)}
            >
                <View style={styles.successModalContainer}>
                    <View style={styles.successModalContent}>
                        <Text style={styles.successText}>You will receive a reset password mail if you are the user of Home Party Help</Text>
                        <ButtonSecondary color title="Okay" onPress={() => {setIsSuccessModalVisible(false); router.push('/')}} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
      );
    };
    
    export default PasswordReset;
    
    const styles = StyleSheet.create({
      scrollViewContent: {
        padding: 10,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
      },
      signupWrapper: {
        width: "90%",
        borderRadius: 10,
        borderColor: "rgba(0,0,0,0.3)",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
        paddingHorizontal: 10,
        marginTop: "20%",
        gap: 10
      },
      signupHead: {
        textAlign: "center",
        fontSize: 30,
      },
      inputWrapper: {
        flexDirection: "row",
        width: "95%",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        marginTop: 10,
      },
      input: {
        flex: 1,
        marginLeft: 10, // Add left margin to create space between icon and text input
      },
      button: {
        width: 100,
        height: 100,
        borderRadius: 50, // half of width and height to make it circular
        backgroundColor: "lightgray", // Placeholder background color
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // This is important to make border radius work in Android
      },
      image: {
        width: "100%",
        height: "100%",
        borderRadius: 50, // half of width and height to make it circular
      },
      profileImageWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
      },
      profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 60,
      },
      profileImagePlaceholder: {
        fontSize: 16,
        color: "#888",
      },
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
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    });
    
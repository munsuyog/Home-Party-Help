import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import { fontFamily } from "../../styles/fontStyles";
import ButtonSecondary from "../../components/common/ButtonSecondary/ButtonSecondary";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProviderSignup, signupWithService, storeUserDataInFirestore, uploadImageToStorage } from "../../utils/firebase";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { router, useLocalSearchParams } from "expo-router";
import { saveUserData } from "../../utils/useSecureStorage";

const SignupProvider = () => {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [provider, setProvider] = useState();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [object, setObject] = useState({ user: "Provider" });
  console.log(object);

  const params = useLocalSearchParams();
  const service = params.service;

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      setObject({ ...object, imageUri: result.assets[0].uri });
    }
  };

  const onSignupPress = async () => {
    try {
      setLoading(true);
      if (
        object.name &&
        object.email &&
        object.country &&
        object.zipcode &&
        object.phone
      ) {
        const userInfo = await signupWithService(
          email,
          password,
          object
        );
        await storeUserDataInFirestore(userInfo.uid, {...object, service: service, id: userInfo.uid}, "Providers")
        await saveUserData({...object, service: service, id: userInfo.uid})
        router.push({
          pathname: "/provider/app/Home/UpdateLocation"
        });
      } else {
        setError("Enter all the details");
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists! Use another");
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.signupWrapper}>
            <Text style={[styles.signupHead, fontFamily.poppins600]}>
              Sign Up as Provider
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setObject({ ...object, email: text });
                }}
                placeholder="Enter email"
                style={styles.input}
                ref={(input) => { setEmailInput = input; }} // Assign ref to the input field
                returnKeyType="next" // Set returnKeyType to "next"
                onSubmitEditing={() => { setPasswordInput.focus(); }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                ref={(input) => { setPasswordInput = input; }} // Assign ref to the input field
                returnKeyType="next" // Set returnKeyType to "next"
                onSubmitEditing={() => { setNameInput.focus(); }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setObject({ ...object, name: text });
                }}
                placeholder="Enter Name"
                style={styles.input}
                ref={(input) => { setNameInput = input; }} // Assign ref to the input field
                returnKeyType="next" // Set returnKeyType to "next"
                onSubmitEditing={() => { setCountryInput.focus(); }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={address}
                onChangeText={(text) => {
                  setObject({ ...object, country: text });
                }}
                placeholder="Enter Country"
                style={styles.input}
                ref={(input) => { setCountryInput = input; }} // Assign ref to the input field
                returnKeyType="next" // Set returnKeyType to "next"
                onSubmitEditing={() => { setZipcodeInput.focus(); }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={phoneNumber}
                onChangeText={(text) => {
                  setObject({ ...object, zipcode: text });
                }}
                keyboardType="phone-pad"
                placeholder="Enter Zipcode"
                style={styles.input}
                ref={(input) => { setZipcodeInput = input; }} // Assign ref to the input field
                returnKeyType="next" // Set returnKeyType to "next"
                onSubmitEditing={() => { setPhoneNumberInput.focus(); }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={phoneNumber}
                onChangeText={(text) => {
                  setObject({ ...object, phone: text });
                }}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                style={styles.input}
                ref={(input) => { setPhoneNumberInput = input; }} // Assign ref to the input field
                returnKeyType="next" // Set returnKeyType to "next"
                onSubmitEditing={() => { setHourlyRateInput.focus(); }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                onChangeText={(text) => {
                  setObject({ ...object, hourlyRate: text });
                }}
                keyboardType="numeric"
                placeholder="Hourly Rate($)"
                style={styles.input}
                ref={(input) => { setHourlyRateInput = input; }} // Assign ref to the input field
                returnKeyType="done" // Set returnKeyType to "next"
                onSubmitEditing={onSignupPress}
              />
            </View>
            <Text style={{ color: "red", fontSize: 14 }}>{error}</Text>
            {loading ? (
              <ActivityIndicator
                style={{ marginTop: 10 }}
                size="large"
                color="blue"
              />
            ) : (
              <View style={{ marginTop: 10 }}>
                <ButtonSecondary
                  title="Sign Up"
                  onPress={() => onSignupPress()}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupProvider;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  signupWrapper: {
    width: "90%",
    borderRadius: 10,
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  signupHead: {
    textAlign: "center",
    fontSize: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    width: "90%",
    height: 40,
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
});

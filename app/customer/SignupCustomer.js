import React, { useState } from "react";
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
import { Path, Svg } from "react-native-svg";
import ButtonSecondary from "../../components/common/ButtonSecondary/ButtonSecondary";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomerSignup } from "../../utils/firebase";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { saveUserData } from "../../utils/useSecureStorage";

const SignupCustomer = () => {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [object, setObject] = useState({ user: "Customer" });

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
    setLoading(true);
    try {
      if (
        object.name &&
        object.email &&
        object.phone &&
        object.zipcode &&
        object.country &&
        object.imageUri
      ) {
        const userData = await CustomerSignup(email, password, object);
        await saveUserData(userData);
        setLoading(false);
        router.push({ pathname: '/customer/app/Services/ServicesScreen', params: userData });

      } else {
        setLoading(false);
        setError("Enter all the details");
      }
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists! Use another");
      }
      if (error.code === "auth/weak-password") {
        setError("Weak Password");
      }
    }
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
              Sign Up as Customer
            </Text>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.profileImageWrapper}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.profileImage} />
              ) : (
                <Text style={styles.profileImagePlaceholder}>Add Photo</Text>
              )}
            </TouchableOpacity>
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
                secureTextEntry
                autoCapitalize="none"
                onChangeText={setPassword}
                placeholder="Enter password"
                style={styles.input}
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
                value={pincode}
                onChangeText={(text) => {
                  setObject({ ...object, zipcode: text });
                }}
                placeholder="Enter zipcode"
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
                returnKeyType="done" // Set returnKeyType to "next"
                onSubmitEditing={onSignupPress}
              />
            </View>
            <Text style={{ color: "red", fontSize: 14 }}>{error}</Text>
            <View style={{ marginTop: 10 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <ButtonSecondary
                  title="Sign Up"
                  onPress={() => onSignupPress()}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupCustomer;

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  },
  signupWrapper: {
    width: "100%",
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
});

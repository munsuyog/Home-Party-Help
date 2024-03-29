import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, ScrollView, Image, ActivityIndicator, Modal } from "react-native";
// import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getDocumentsByService, sendMessage, updateProviderLocation } from "../../../../utils/firebase";
import { router, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { getUserData } from "../../../../utils/useSecureStorage";
import ButtonSecondary from "../../../../components/common/ButtonSecondary/ButtonSecondary";
import OpenStreetMap from "../../../../components/common/OpenStreetMaps/OpenStreetMaps";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import NotificationsComponent from "../../../../components/common/NotificationHandler/NotificationHandler";

const MapScreen = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true); // State for loading animation
  const [successModalVisible, setSuccessModalVisible] = useState(false); // State for success modal visibility
  const [errorModalVisible, setErrorModalVisible] = useState(false); // State for error modal visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [searchBox, setSearchBox] = useState(null);

  const params = useGlobalSearchParams();
  const id = params.id;

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      setUserData(userData);
    };
    fetchUserData();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [searchCoordinates, setSearchCoordinates] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorModalVisible(true);
      setErrorMessage("Location permission denied");
      setLoading(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude, accuracy, altitude } = location.coords;
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      console.log(data)
      setSearchQuery(data.display_name);
      setUserLocation({ latitude, longitude });
      setSearchCoordinates({ latitude, longitude });
      setLoading(false);
    } catch (error) {
      setErrorModalVisible(true);
      setErrorMessage("Failed to fetch current location");
      setLoading(false);
    }
  };

  const updateLocation = async () => {
    try {
        console.log(userData);
        console.log(userLocation)
      await updateProviderLocation(userData.id, userLocation.latitude, userLocation.longitude, searchQuery);
      setSuccessModalVisible(true); // Show success modal
      sendMessage(userData.id, userData.name, userData.id, userData.name, "Test Notification")
    } catch(error) {
      setErrorModalVisible(true); // Show error modal
      setErrorMessage("Failed to update location");
      console.error(error)
    }
  }

  const handleSearch = async () => {
    try {
      const response = await Location.geocodeAsync(searchBox);
      console.log(response)
      const {latitude, longitude} = response[0]
      const responseReverse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await responseReverse.json();
      setSearchQuery(data.display_name);
      const coordinates = {
        latitude: response[0].latitude,
        longitude: response[0].longitude,
      };
      setSearchCoordinates(coordinates);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#EF4F5F" />
      ) : (
        <>
          <View
            style={{
              height: "auto",
              backgroundColor: "white",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              padding: 15,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 5,
                padding: 5,
              }}
              placeholder="Enter location"
              value={searchBox}
              onChangeText={(text) => setSearchBox(text)}
            />
          <View>
            <ButtonSecondary title="Search" onPress={handleSearch} />
          </View>
            <TouchableOpacity style={{ borderRadius: 40 }} onPress={getCurrentLocation}>
              <FontAwesome name="location-arrow" size={25} />
            </TouchableOpacity>
          </View>
          {userLocation && (
            <OpenStreetMap markers={searchCoordinates} />
          )}
          <View style={{width: '100%', backgroundColor :'white', alignItems: 'center', padding: 10,}}>
            <Text style={{marginTop: 10, marginBottom: 10}}><Text style={{fontWeight: 600}}>Location: </Text>{searchQuery}</Text>
            <ButtonSecondary title="Update Location" color width={'70%'} height={50} onPress={updateLocation} />
          </View>
        </>
      )}
      {/* Success Modal */}
      <Modal visible={successModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Success!</Text>
            <Text style={{ marginBottom: 10 }}>Location updated successfully.</Text>
            <Button title="Close" onPress={() => {setSuccessModalVisible(false); router.push({pathname: '/provider/app/Home/Dashboard/ProviderDashboard', params: {id: userData.id}})}} />
          </View>
        </View>
      </Modal>
      {/* Error Modal */}
      <Modal visible={errorModalVisible} animationType="slide" transparent={true} >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Error!</Text>
            <Text style={{ marginBottom: 10 }}>{errorMessage}</Text>
            <Button title="Close" onPress={() => setErrorModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;

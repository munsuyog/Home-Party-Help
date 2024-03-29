import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, ScrollView, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import EditAddressModal from "./EditAddressModal";
import { getDocumentsByService } from "../../../utils/firebase";

const MapScreen = ({ navigation, route }) => {
  const {service, userData} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [searchCoordinates, setSearchCoordinates] = useState(null);
  const [nearbyDeliveryBoys, setNearbyDeliveryBoys] = useState([]);
  const [users, setUsers] = useState([null]);

  const fetchUsersByService = async () => {
    try {
      const users = await getDocumentsByService(service);
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users by service:", error);
    }
  };


  useEffect(() => {
    getCurrentLocation();

    fetchUsersByService();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Location permission denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setUserLocation({ latitude, longitude });
  };

  const handleMapLongPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    // Here you can add the logic to save the selected location or handle it as needed
  };

  function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  const handleSearch = async () => {
    try {
      const response = await Location.geocodeAsync(searchQuery);
      const data = await Location.reverseGeocodeAsync(response[0]);
      console.log(data[0].formattedAddress);
      const coordinates = {
        latitude: response[0].latitude,
        longitude: response[0].longitude,
      };
      fetchNearbyDeliveryBoys(data[0].city);
      setSearchCoordinates(coordinates);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchNearbyDeliveryBoys = (city) => {
    const filteredDeliveryBoys = users.filter((user) => {
      return user.data.city === city;
    });
    setNearbyDeliveryBoys(filteredDeliveryBoys);
  }

  return (
    <View style={{ flex: 1 }}>
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
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <View style={{ borderRadius: 40 }}>
          <Button color="#EF4F5F" title="Search" onPress={handleSearch} />
        </View>
      </View>
      {userLocation && (
        <MapView
          style={{ flex: 1 }}
          onLongPress={handleMapLongPress}
          region={{
            ...searchCoordinates,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={searchCoordinates ? searchCoordinates : userLocation}
            pinColor="red"
          />
        </MapView>
      )}
      <ScrollView
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          maxHeight: 200,
          rowGap: 20,
        }}
      >
        {nearbyDeliveryBoys.length > 0 ? (
          nearbyDeliveryBoys.map((person) => {
            return (
              <View
                style={{
                  height: 100,
                  backgroundColor: "white",
                  width: "90%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  padding: 10,
                  borderRadius: 10,
                  elevation: 3,
                  position: "relative",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 100,
                      flexDirection: "row",
                      borderColor: "black",
                      borderWidth: 1,
                    }}
                  >
                    <Image
                      source={require("../../../images/common/profile.png")}
                      style={{ width: 40, height: 40 }}
                    />
                  </View>
                  <View>
                    <Text>{person.data.name}</Text>
                    <Text>{person.data.address}</Text>
                  </View>
                </View>
                <View>
                  <Text>${person.data.hourlyRate}</Text>
                  <Button
                    onPress={() => {
                      navigation.navigate('ServiceInfo', {personInfo: person, userData: userData});
                    }}
                    color="#EF4F5F"
                    title="Book"
                  />
                </View>
              </View>
            );
          })
        ) : (
          <View
            style={{
              height: 100,
              backgroundColor: "white",
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              padding: 10,
              borderRadius: 10,
              elevation: 3,
              position: "relative",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 20, alignItems: "center" }}
            >
              <View>
                <Text>No Service Available</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <EditAddressModal onClose={closeModal} visible={modalVisible} />
    </View>
  );
};

export default MapScreen;

import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, ScrollView, Image, ActivityIndicator, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getDocumentsByService } from "../../../../utils/firebase";
import { router, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { getUserData } from "../../../../utils/useSecureStorage";
import ButtonPrimary from "../../../../components/common/ButtonPrimary/ButtonPrimary";
import ButtonSecondary from "../../../../components/common/ButtonSecondary/ButtonSecondary";
import OpenStreetMap from "../../../../components/common/OpenStreetMaps/OpenStreetMaps";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const MapScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true); // State for loading animation
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [searchCoordinates, setSearchCoordinates] = useState(null);
  const [nearbyDeliveryBoys, setNearbyDeliveryBoys] = useState([]);
  const [users, setUsers] = useState(null);
  const [searchBox, setSearchBox] = useState(null)

  const params = useGlobalSearchParams();
  const service = params.service;
  console.log(service)


  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      setUserData(userData);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []); // Add users to the dependency array


  const fetchData = async () => {
    try {
      const users = await fetchUsersByService();
      const location = await getCurrentLocation();
      if (users.length > 0) {
        await fetchNearbyDeliveryBoys(users, location);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const fetchUsersByService = async () => {
    try {
      if(service) {
        const users = await getDocumentsByService(service);
        setUsers(users);
        return users
      }
    } catch (error) {
      console.error("Error fetching users by service:", error);
    }
  };

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

  
  const getCurrentLocation = async () => {
    try {
      setLoading(true); // Start loading animation
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission denied");
        setLoading(false); // Stop loading animation
        return;
      }
    
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
        // Fetch reverse geocoding data from OpenStreetMap API
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        setSearchQuery(data.display_name)
      setUserLocation({ latitude, longitude }); // Set userLocation before calling fetchNearbyDeliveryBoys
      setSearchCoordinates({ latitude, longitude });
      setLoading(false); // Stop loading animation
      return {latitude, longitude}
    }
    catch(error) {
      console.error(error)
      setLoading(false); // Stop loading animation
    }
  };
  
  const getServiceCurrentLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Location permission denied");
      setLoading(false);
      return;
    }
  
    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Fetch reverse geocoding data from OpenStreetMap API
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      console.log(data)
      
      // Extract necessary information, for example, city
      const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
      
      // Perform further actions with the city data, such as fetching nearby delivery boys
      fetchNearbyDeliveryBoys(city);
      
      // Update state with user location and search coordinates
      setUserLocation({ latitude, longitude });
      setSearchCoordinates({ latitude, longitude });
      setSearchQuery(data.display_name)
      console.log(data.display_name)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching current location:", error);
      setLoading(false);
    }
  };
  

  const calculateDistance = async (lat1, lon1, lat2, lon2, unit) => {
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
  
  const fetchNearbyDeliveryBoys = async (users, location) => {
    if (!location || !users) {
      setNearbyDeliveryBoys([]);
      return;
    }
  
    const nearbyBoys = users.map(async (user) => {
      if (!location.latitude || !location.longitude || !user.data.location) {
        return null;
      }
  
      const distance = await calculateDistance(
        location.latitude,
        location.longitude,
        user.data.location.latitude,
        user.data.location.longitude,
        "K"
      );
      return { user, distance };
    });
  
    Promise.all(nearbyBoys)
      .then((nearbyBoysWithDistance) => {
        // Filter out null values
        const validNearbyBoys = nearbyBoysWithDistance.filter(
          (boy) => boy !== null
        );
        // Sort by distance in ascending order
        validNearbyBoys.sort((a, b) => a.distance - b.distance);
        // Set nearby delivery boys state
        setNearbyDeliveryBoys(validNearbyBoys.map((boy) => boy.user));
      })
      .catch((error) => {
        console.error("Error fetching nearby delivery boys:", error);
      });
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
            <View style={{ borderRadius: 40 }} >
              <Pressable onPress={fetchData}>
              <FontAwesome name="location-arrow" size={30} />
              </Pressable>
            </View>
          </View>
          {userLocation && (
            <OpenStreetMap markers={searchCoordinates} />
          )}
          <View>
          <ScrollView
            style={{
              position: "absolute",
              bottom: 10,
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
                          source={{uri: person.data.imageUri}}
                          style={{ width: 50, height: 50, borderRadius: 100, borderColor: 'black', borderWidth: 1 }}
                        />
                      </View>
                      <View>
                        <Text style={{fontWeight: 600, fontSize: 16}}>{person.data.name}</Text>
                        <Text style={{width: 180, fontSize: 10}}>{person.data.location && (person.data.location.address)}</Text>
                      </View>
                    </View>
                    <View>
                      <Button
                        onPress={() => {
                          router.push({pathname: '/customer/app/Services/ServiceInfo', params: {personId: person.id}});
                        }}
                        color="#EF4F5F"
                        title="Details"
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
          </View>
          <View style={{width: '100%', backgroundColor :'white', alignItems: 'center', padding: 10, gap: 20}}>
            <Text><Text style={{fontWeight: 600}}>Location: </Text>{searchQuery}</Text>
            <ButtonSecondary title="Reload" color width={'70%'} height={50} onPress={getServiceCurrentLocation} />
          </View>
        </>
      )}
    </View>
  );
};

export default MapScreen;

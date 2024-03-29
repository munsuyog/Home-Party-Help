import React, { useState, useEffect } from "react";
import { Image, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import ButtonSecondary from "../../../../components/common/ButtonSecondary/ButtonSecondary";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { getUserData } from "../../../../utils/useSecureStorage";
import { getProviderById } from "../../../../utils/firebase";
import AboutProviderModal from "../../../../components/customer/services/AboutProvider";
import { fontFamily } from "../../../../styles/fontStyles";

const ServiceInfo = () => {
  const params = useLocalSearchParams();
  const { personId } = params;
  const [userData, setUserData] = useState({});
  const [personInfo, setPersonInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const calculateAmount = (price, service) => {
    if(service === 'bartender') {
      return price * 3;
    } else if(service === 'dj-artist') {
      return price * 2;
    } else if(service === 'home-helper') {
      return price * 2.75;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      const personInfo = await getProviderById(personId);
      setUserData(userData);
      setPersonInfo(personInfo);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {personInfo.imageUri && (
        <Image source={{ uri: personInfo.imageUri }} style={styles.profileImg} />
      )}
      <View>
        <Text style={[styles.personName, fontFamily.poppins400]}><Text style={[fontFamily.poppins600]}>Name: </Text> {personInfo.name}</Text>
      </View>
      <View>
        <Text style={[styles.personAddress, fontFamily.poppins400]}><Text style={fontFamily.poppins600}>Address: </Text> {personInfo.location ? personInfo.location.address : personInfo.address}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={[styles.rate, fontFamily.poppins400]}><Text style={fontFamily.poppins600}>Amount: </Text> ${calculateAmount(personInfo.hourlyRate, personInfo.service)}</Text>
      </View>
      <View style={{ gap: 20 }}>
        <ButtonSecondary title="Book Now" onPress={() => router.push({ pathname: "/customer/app/Services/BookingForm", params: personInfo })} />
        <ButtonSecondary title="About" onPress={() => handleOpenModal()} />
        <ButtonSecondary title="Chat Now" onPress={() => router.push({ pathname: "/customer/app/Services/ChatScreen", params: personInfo })} />
      </View>
      <AboutProviderModal visible={modalVisible} providerInfo={personInfo} onClose={handleCloseModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 30,
    width: "90%",
    height: "70%",
    borderWidth: 1,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 20,
    justifyContent: "space-evenly",
    backgroundColor: "white",
    marginTop: "auto",
    marginBottom: "auto",
  },
  profileImg: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: "black",
    borderWidth: 1,
  },
  personName: {
    fontSize: 20,
  },
  personAddress: {
    fontSize: 16,
    textAlign: 'center'
  },
  rate: {
    fontSize: 16,
    textAlign:'center'
  },
  aboutButton: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ServiceInfo;

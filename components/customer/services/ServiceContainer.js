import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { fontFamily } from '../../../styles/fontStyles';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const ServiceContainer = ({ title, src, service, userData }) => {
  return (
    <TouchableOpacity style={styles.bgImageContainer} onPress={() => router.push({pathname: '/customer/app/Services/MapScreen', params: {userData, service}})}>
    <ImageBackground
      source={src} // Call a function to get the image source
      style={styles.bgImage}
      resizeMode='contain'
    >
      <View style={styles.serviceTitleContainer}>
        <Text style={[fontFamily.poppins700, styles.serviceTitle]}>{title}</Text>
      </View>
    </ImageBackground>
    </TouchableOpacity>
  );
};

export default ServiceContainer;

const styles = StyleSheet.create({
  serviceTitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  serviceTitleContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    bottom: 60,
    backgroundColor: 'white',
    width: 200,
    height: 50,
    justifyContent: 'center'
  },
  bgImage: {
    flex: 1,
    borderRadius: 10,
    width: 350,
    height: 250,
    position: 'relative',
    // elevation:5
  },
  bgImageContainer: {
    width: 350,
    height: 250
  }
});

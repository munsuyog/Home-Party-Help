import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const CustomHeader = ({ navigation, route, title }) => {
  
  return (
    <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }}>
      <Text style={{ fontSize: 18, color: '#333333', textAlign: 'center' }}>{title}</Text>
      <View style={{ width: 50 }}></View>
    </View>
  );
};

export default CustomHeader;

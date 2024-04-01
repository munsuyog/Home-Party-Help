import React from 'react'
import { Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native'
import { fontFamily } from '../../../styles/fontStyles'

const ButtonSecondary = ({title, link, color, onPress, width, height}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{
        width: width ? width : 110,
        height: height ? height : 38,
        backgroundColor: color ? '#EF4F5F' : '#fff',
        borderRadius: 10,
        flexDirection:'row',
        justifyContent: 'center',
        gap: 30,
        alignItems: 'center',
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: '#EF4F5F',
        
    }}>
        <Text style={[fontFamily.poppins400, {
        fontSize: 16,
        color: color ? 'white' : '#EF4F5F',
        textAlign: 'center'
    }]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default ButtonSecondary
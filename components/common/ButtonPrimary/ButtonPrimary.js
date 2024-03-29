import React from 'react'
import { Text, Pressable } from 'react-native'
import Svg, {Path} from 'react-native-svg'
import { fontFamily } from '../../../styles/fontStyles'
import { router } from 'expo-router'

const ButtonPrimary = ({title, link, color}) => {
  return (
    <Pressable onPress={() => {router.navigate(link)}} style={{
        width: 227,
        height: 63,
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
        <Svg height={20} width={20}>
            <Path xmlns="http://www.w3.org/2000/svg" d="M7.87778 13.2894L9.44444 14.7778L15 9.5L9.44444 4.22222L7.87778 5.71056L10.7444 8.44444H0V10.5556H10.7444L7.87778 13.2894ZM17.7778 0H2.22222C0.988889 0 0 0.95 0 2.11111V6.33333H2.22222V2.11111H17.7778V16.8889H2.22222V12.6667H0V16.8889C0 18.05 0.988889 19 2.22222 19H17.7778C19 19 20 18.05 20 16.8889V2.11111C20 0.95 19 0 17.7778 0Z" fill={color ? "white": "#EF4F5F"}/>
        </Svg>
        <Text style={[fontFamily.poppins400, {
        fontSize: 20,
        color: color ? 'white' : '#EF4F5F'
    }]}>{title}</Text>
    </Pressable>
  )
}

export default ButtonPrimary
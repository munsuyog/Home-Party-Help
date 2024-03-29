import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import LoginContainer from '../../components/provider/Login/LoginContainer'

const LoginServices = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <LoginContainer key="bartender" title="Login as Bartender" src={require('../../images/customer/services/bartender.png')} service="bartender" link='/provider/LoginProvider' />
        <LoginContainer key="dj-artist" title="Login as DJ Artist" src={require('../../images/customer/services/dj.png')} service="dj-artist" link='/provider/LoginProvider' />
        <LoginContainer key="home-helper" title="Login as Home Helper" src={require('../../images/customer/services/homehelper.png')} service="home-helper" link='/provider/LoginProvider' />
      </View>
    </ScrollView>
  )
}

export default LoginServices

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  }
})
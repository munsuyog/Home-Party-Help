import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import ServiceContainer from '../../../../components/customer/services/ServiceContainer'
import { getUserData } from '../../../../utils/useSecureStorage'

const Home = () => {
  // const params = useLocalSearchParams()
  const [userData, setUserData] = useState({})
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      setUserData(userData);
    };
    fetchUserData();
  }, []);
  return (
    <ScrollView>
      <View style={styles.container}>
        <ServiceContainer key="bartender" title="Book Bartender" src={require('../../../../images/customer/services/bartender.png')} service="bartender" userData={userData}/>
        <ServiceContainer key="dj-artist" title="Book DJ Artist" src={require('../../../../images/customer/services/dj.png')} service="dj-artist" userData={userData} />
        <ServiceContainer key="home-helper" title="Home Helper" src={require('../../../../images/customer/services/homehelper.png')} service="home-helper" userData={userData} />
      </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  }
})
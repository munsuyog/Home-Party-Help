import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { checkIfUserIsLoggedIn, getUserDataById } from '../utils/firebase';
import ButtonPrimary from '../components/common/ButtonPrimary/ButtonPrimary';
import NotificationsComponent from '../components/common/NotificationHandler/NotificationHandler';
import { commonStyles } from '../styles/commonStyles';
import { fontFamily } from '../styles/fontStyles';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loggedInUser = await checkIfUserIsLoggedIn();
        if (loggedInUser) {
          const userData = await getUserDataById(loggedInUser.uid);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (user) {
    const screenToNavigate = user.isCustomer ? 'Customer' : 'Provider';
    navigation.navigate(screenToNavigate);
    return null;
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <Image source={require('../images/homeScreen/background.png')} style={styles.backgroundImage} />
        <Text style={[styles.welcomeText, fontFamily.pacifico]}>Welcome</Text>
        <Text style={styles.loginAsText}>Login As: </Text>
        <ButtonPrimary color title="Customer" link="/customer/LoginCustomer" />
        <ButtonPrimary title="Provider" link="/provider/LoginServices" />
        <NotificationsComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '30%',
    resizeMode: 'cover',
  },
  loginAsText: {
    fontSize: 16,
    color: '#000',
    opacity: 0.5,
  },
  welcomeText: {
    fontSize: 34,
  },
  pacifico: {
    fontFamily: 'Pacifico', // Assuming 'Pacifico' is a custom font in your app
  },
});

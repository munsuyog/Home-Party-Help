
// Import necessary modules
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../../../utils/firebase';

// Define the notification handler function
const backgroundNotificationHandler = async (notification) => {
  // You can define custom behavior here, such as showing an alert, navigating to a specific screen, etc.
  console.log('Received background notification:', notification);
};

const NotificationsComponent = ({userId}) => {
  console.log(userId)
  useEffect(() => {
    registerForPushNotificationsAsync(userId);

    const subscription = Notifications.addNotificationReceivedListener(handleNotification);

    return () => subscription.remove();
  }, []);

  // const registerForPushNotificationsAsync = async () => {
  //   try {
  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;

  //     if (existingStatus !== 'granted') {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }

  //     if (finalStatus !== 'granted') {
  //       console.log('Permission to receive notifications was denied.');
  //       return;
  //     }

  //     const tokenData = await Notifications.getExpoPushTokenAsync();
  //     const token = tokenData.data;
  //     console.log('Expo Push Token:', token);
  //   } catch (error) {
  //     console.error('Error registering for push notifications:', error);
  //   }
  // };

  const handleNotification = (notification) => {
    console.log('Received notification:', notification);
    // Customize this function according to your app's requirements
    // For example, display an alert or navigate to a specific screen
  };

  useEffect(() => {
    // Set the notification handler for background notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
      handleSuccess: backgroundNotificationHandler,
    });

    // On Android, you need to return a promise with a resolved value when handling background notifications
    if (Platform.OS === 'android') {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
        handleSuccess: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    }
  }, []);

  return null;
};

export default NotificationsComponent;

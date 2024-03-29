import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  
  return (
    <Stack>
      <Stack.Screen name="ServicesScreen" options={{ headerShown: true, headerTitle: 'Services' }} />
      <Stack.Screen name="MapScreen" options={{headerTitle: 'Select Provider', headerShown: true }} />
      <Stack.Screen name="ServiceInfo" options={{headerTitle: 'About Provider', headerShown: true }} />
      <Stack.Screen name="BookingForm" options={{headerTitle: 'Book Provider', headerShown: true }} />
      <Stack.Screen name="WebView" options={{headerTitle: 'Payment', headerShown: true }} />
      <Stack.Screen name="ChatScreen" options={{headerTitle: 'Chat', headerShown: true }} />
      <Stack.Screen name="SuccessPage" options={{headerTitle: 'Chat', headerShown: false }} />
      <Stack.Screen name="ErrorPage" options={{headerTitle: 'Chat', headerShown: false }} />


    </Stack>
  );
}

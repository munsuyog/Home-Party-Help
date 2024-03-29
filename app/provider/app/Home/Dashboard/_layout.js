import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  
  return (
    <Stack>
      <Stack.Screen name="ProviderDashboard" options={{ headerShown: false }} />
      <Stack.Screen name="PendingBookings" options={{ headerShown: false }} />
      <Stack.Screen name="CancelledBookings" options={{ headerShown: false }} />
      <Stack.Screen name="CompletedBookings" options={{ headerShown: false }} />
      <Stack.Screen name="ConfirmedBookings" options={{ headerShown: false }} />
    </Stack>
  );
}

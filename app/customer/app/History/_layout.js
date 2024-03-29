import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  
  return (
    <Stack>
      <Stack.Screen name="YourHistory" options={{ headerShown: true, headerTitle: 'Your History' }} />
      <Stack.Screen name="HistoryDetails" options={{ headerShown: true, headerTitle: 'History Details' }} />
    </Stack>
  );
}

import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  return (
    <Stack>
      <Stack.Screen name="ProviderSettings" options={{ headerTitle: 'Settings' ,headerShown: true }} />
      <Stack.Screen name="UpdateService" options={{headerTitle: 'Update Service' , headerShown: true }} />
    </Stack>
  );
}

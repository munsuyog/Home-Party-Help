import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  
  return (
    <Stack>
      <Stack.Screen name="ViewProfile" options={{ headerShown: false, headerTitle: "View Profile" }} />
      <Stack.Screen name="EditProfile" options={{ headerShown: false, headerTitle: "Edit Profile" }} />
    </Stack>
  );
}

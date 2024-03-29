import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  return (
    <Stack>
      <Stack.Screen name="ViewProfile" options={{ headerTitle: 'View Profile',headerShown: true }} />
      <Stack.Screen name="EditProfile" options={{ headerTitle: 'Edit Profile',headerShown: true }} />
      <Stack.Screen name="ViewAboutProfile" options={{ headerTitle: 'View About',headerShown: true }} />
      <Stack.Screen name="EditAboutProfile" options={{ headerTitle: 'Edit About',headerShown: true }} />
    </Stack>
  );
}

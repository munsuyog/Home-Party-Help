import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  
  return (
    <Stack>
      <Stack.Screen name="Settings" options={{ headerShown: true }} />
      <Stack.Screen name='PrivacyPolicy' options={{headerShown: true}} />
      <Stack.Screen name='TermsAndConditions' options={{headerShown: true}} />
    </Stack>
  );
}

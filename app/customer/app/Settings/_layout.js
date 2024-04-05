import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  
  return (
    <Stack>
      <Stack.Screen name="Settings" options={{ headerShown: true, headerTitle: "Settings" }} />
      <Stack.Screen name='PrivacyPolicy' options={{headerShown: true, headerTitle: "Privacy Policy"}} />
      <Stack.Screen name='TermsAndConditions' options={{headerShown: true, headerTitle: "Terms and Conditions"}} />
    </Stack>
  );
}

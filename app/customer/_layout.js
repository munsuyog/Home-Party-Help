import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  return (
    <Stack>
      <Stack.Screen name='LoginCustomer' options={{headerShown: true, headerTitle: "Login"}} />
      <Stack.Screen name='SignupCustomer' options={{headerShown: true, headerTitle: "Signup"}} />
      <Stack.Screen name='app' options={{headerShown: false}} />
    </Stack>
  );
}

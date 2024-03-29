import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  return (
    <Stack>
      <Stack.Screen name='LoginServices' options={{ headerTitle: 'Login As',headerShown: true}} />
      <Stack.Screen name='LoginProvider' options={{ headerTitle: 'Login',headerShown: true}} />
      <Stack.Screen name='SignupProvider' options={{headerTitle: 'Signup',headerShown: true}} />
      <Stack.Screen name='app' options={{headerShown: false}} />
    </Stack>
  );
}

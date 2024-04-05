import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {

  
  return (
    <Stack>
      <Stack.Screen name="ChatConversations" options={{ headerTitle: 'Conversations', headerShown: true }} />
      <Stack.Screen name="ChatScreen" options={{ headerShown: true, headerTitle: "Chat Screen" }} />

    </Stack>
  );
}

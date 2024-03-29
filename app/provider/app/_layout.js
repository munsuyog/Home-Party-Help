import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { Fontisto } from '@expo/vector-icons';

export default function TabLayout() {

  
  return (
    <Tabs>
      <Tabs.Screen name="Home" options={{ headerShown: false, tabBarIcon: ({color}) => (<Fontisto name='home' size={20} color={color} />) }} />
      <Tabs.Screen name="Chats" options={{ headerShown: false, tabBarIcon: ({color}) => (<Fontisto name='hipchat' size={20} color={color} />) }} />
      <Tabs.Screen name="Profile" options={{ headerShown: false, tabBarIcon: ({color}) => (<Fontisto name='person' size={20} color={color} />) }} />
      <Tabs.Screen name="Settings" options={{ headerShown: false, tabBarIcon: ({color}) => (<Fontisto name='player-settings' size={20} color={color} />) }} />
    </Tabs>
  );
}

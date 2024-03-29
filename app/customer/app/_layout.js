import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { FontAwesome, Fontisto } from '@expo/vector-icons';

export default function TabLayout() {

  
  return (
    <Tabs>
      <Tabs.Screen name="Services" options={{ headerShown: false, tabBarIcon: ({color}) => (<Fontisto name='persons' size={20} color={color} />) }} />
      <Tabs.Screen name="History" options={{ headerShown: false, tabBarIcon: ({color}) => (<Fontisto name='history' size={20} color={color} />) }} />
      <Tabs.Screen name="Profile" options={{ headerShown: false, tabBarIcon: ({color}) => (<Fontisto name='person' size={20} color={color} />) }} />
      <Tabs.Screen name="Settings" options={{ headerShown: false, tabBarIcon: ({color}) => (<Fontisto name='player-settings' size={20} color={color} />) }} />
    </Tabs>
  );
}

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function TabLayout() {

  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
      <Drawer.Screen name='Dashboard' />
      <Drawer.Screen name='UpdateLocation' options={{headerTitle: "Update Location", title: "Update Location"}}  />
      </Drawer>
    </GestureHandlerRootView>
  );
}

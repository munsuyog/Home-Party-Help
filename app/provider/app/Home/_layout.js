import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {

  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{drawerIcon: () => <Ionicons name='menu' color="black" size={20} />}}>
      <Drawer.Screen name='ProviderDashboard' options={{headerTitle: "Dashboard", title: "Dashboard", drawerIcon: () => <Ionicons name="home" size={24} color="black" />}} />
      <Drawer.Screen name='PendingBookings' options={{headerTitle: "Pending Bookings", title: "Pending Bookings", drawerIcon: () => <MaterialIcons name="pending-actions" size={24} color="black" />}} />
      <Drawer.Screen name='CancelledBookings' options={{headerTitle: "Cancelled Bookings", title: "Cancelled Bookings", drawerIcon: () => <MaterialIcons name="cancel" size={24} color="black" />}} />
      <Drawer.Screen name='CompletedBookings' options={{headerTitle: "Completed Bookings", title: "Completed Bookings", drawerIcon: () => <Ionicons name="checkmark" size={24} color="black" />}} />
      <Drawer.Screen name='ConfirmedBookings' options={{headerTitle: "Confirmed Bookings", title: "Confirmed Bookings", drawerIcon: () => <MaterialIcons name="confirmation-num" size={24} color="black" />}} />
      <Drawer.Screen name='UpdateLocation' options={{headerTitle: "Update Location", title: "Update Location", drawerIcon: () => <MaterialIcons name="add-location" size={24} color="black" />}}  />
      </Drawer>
    </GestureHandlerRootView>
  );
}

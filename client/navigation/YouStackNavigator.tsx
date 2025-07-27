import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import YouScreen from '../screens/YouScreen';
import AccountScreen from '../screens/setting_screens/AccountScreen';
import ProfileScreen from '../screens/setting_screens/ProfileScreen';
import NotificationsScreen from '../screens/setting_screens/NotificationsScreen';
import PastRidesScreen from '../screens/setting_screens/PastRidesScreen';
import PrivacyScreen from '../screens/setting_screens/PrivacyScreen';
import ReportsScreen from '../screens/setting_screens/ReportsScreen';

const Stack = createNativeStackNavigator();

export default function YouStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
      <Stack.Screen name="YouMain" component={YouScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PastRides" component={PastRidesScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
}

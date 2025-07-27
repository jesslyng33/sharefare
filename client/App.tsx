import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your tab navigator and screens
import TabNavigator from './navigation/TabNavigator';
import AccountScreen from './screens/setting_screens/AccountScreen';
import ProfileScreen from './screens/setting_screens/ProfileScreen';
import NotificationsScreen from './screens/setting_screens/NotificationsScreen';
import PastRidesScreen from './screens/setting_screens/PastRidesScreen';
import PrivacyScreen from './screens/setting_screens/PrivacyScreen';
import ReportsScreen from './screens/setting_screens/ReportsScreen';


const Stack = createStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* This is your main tabbed interface */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* These are sub-pages for settings (navigated from YouScreen) */}
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="PastRides" component={PastRidesScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

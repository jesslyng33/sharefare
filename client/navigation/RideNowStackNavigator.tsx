import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RideNowHomeScreen from '../screens/rideNow/RideNowHomeScreen';

const Stack = createStackNavigator();

export default function RideNowStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
      <Stack.Screen name="Home" component={RideNowHomeScreen} />
    </Stack.Navigator>
  );
};


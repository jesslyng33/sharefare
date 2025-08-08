import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RideNowHomeScreen from '../screens/rideNow/RideNowHomeScreen';
import FindingRideScreen from '../screens/rideNow/FindingRideScreen';

export type RideNowStackParamList = {
  Home: undefined;
  FindingRide: undefined;
};

const Stack = createStackNavigator<RideNowStackParamList>();

export default function RideNowStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
      <Stack.Screen name="Home" component={RideNowHomeScreen} />
      <Stack.Screen name="FindingRide" component={FindingRideScreen} />
    </Stack.Navigator>
  );
};

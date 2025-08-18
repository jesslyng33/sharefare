import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RideNowHomeScreen from '../screens/rideNow/RideNowHomeScreen';
import FindingRideScreen from '../screens/rideNow/FindingRideScreen';
import MatchedRideScreen from '../screens/rideNow/MatchedRideScreen';

export type RideNowStackParamList = {
  Home: undefined;
  FindingRide: { rideRequestId: string };
  MatchedRide: { groupId: string };
};

const Stack = createStackNavigator<RideNowStackParamList>();

export default function RideNowStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
      <Stack.Screen name="Home" component={RideNowHomeScreen} />
      <Stack.Screen name="FindingRide" component={FindingRideScreen} />
      <Stack.Screen name="MatchedRide" component={MatchedRideScreen} />
    </Stack.Navigator>
  );
};

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/homeScreen';
import FriendsScreen from '../screens/FriendsScreen';
import RideNowScreen from '../screens/RideNowScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import YouStackNavigator from './YouStackNavigator';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      id={undefined}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Ride Now" component={RideNowScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="You" component={YouStackNavigator} />
    </Tab.Navigator>
  );
}

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import FullNameScreen from '../screens/onboarding/FullName';
import YearScreen from '../screens/onboarding/Year';
import MajorScreen from '../screens/onboarding/Major';
import InstagramScreen from '../screens/onboarding/Instagram';
import ProfilePictureScreen from '../screens/onboarding/ProfilePicture';
import PreferencesScreen from '../screens/onboarding/Preferences';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false 
      }}
      initialRouteName="MainTabs"
      id={undefined}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="FullName" component={FullNameScreen} />
      <Stack.Screen name="Year" component={YearScreen} />
      <Stack.Screen name="Major" component={MajorScreen} />
      <Stack.Screen name="Instagram" component={InstagramScreen} />
      <Stack.Screen name="ProfilePicture" component={ProfilePictureScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
    </Stack.Navigator>
  );
}

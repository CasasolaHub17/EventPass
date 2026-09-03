import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { RegisterEventScreen } from '../screens/RegisterEventScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator = ({ route }: any) => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Register" component={RegisterEventScreen} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        initialParams={route?.params?.params} 
      />
    </Tab.Navigator>
  );
};
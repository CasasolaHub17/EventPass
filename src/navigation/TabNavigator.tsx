// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importaciones nominadas con llaves { } para que coincidan con la exportación de las pantallas
import { HomeScreen } from '../screens/HomeScreen';
import { RegisterEventScreen } from '../screens/RegisterEventScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

import { useTheme } from '../context/ThemeContext';
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Eventos' }}
      />
      <Tab.Screen 
        name="Register" 
        component={RegisterEventScreen} 
        options={{ title: 'Registrar' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
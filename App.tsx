// App.tsx
import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext'; // Ajusta la ruta según tu estructura
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator'; // Tu navegador principal

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
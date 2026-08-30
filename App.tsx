import React from 'react';
import { LoginScreen } from './src/screens/LoginScreen';

export default function App() {
  // Mock simple de navegación para pruebas en Web
  const mockNavigation: any = {
    replace: (screenName: string) => alert(`Redirigiendo a: ${screenName}`),
  };

  return <LoginScreen navigation={mockNavigation} route={{} as any} />;
}
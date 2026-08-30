import React from 'react';
import { View } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';

export default function App() {
  const mockNavigation: any = {
    replace: (screenName: string) => alert(`Redirigiendo a: ${screenName}`),
  };

  return (
    <View style={{ flex: 1 }}>
      <LoginScreen navigation={mockNavigation} route={{} as any} />
    </View>
  );
}
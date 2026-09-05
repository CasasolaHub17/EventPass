// App.tsx
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { TicketProvider } from './src/context/TicketContext';
import { EventProvider } from './src/context/EventContext';
import AppNavigator from './src/navigation/AppNavigator';

const MainApp = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <EventProvider>
          <TicketProvider>
            <MainApp />
          </TicketProvider>
        </EventProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
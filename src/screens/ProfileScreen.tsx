import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Usuario de Pruebas</Text>
      <Text style={styles.email}>usuario@correo.com</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7FAFC' },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#718096', marginTop: 4 },
});
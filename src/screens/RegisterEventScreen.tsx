// src/screens/RegisterEventScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { AuthStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const RegisterEventScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [attendeeName, setAttendeeName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventName, setEventName] = useState('');

  const handleRegister = () => {
    if (!attendeeName || !email || !phone || !eventName) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido.');
      return;
    }

    const newTicket = {
      id: Date.now().toString(),
      title: eventName,
      date: 'Fecha por confirmar',
    };

    Alert.alert(
      '¡Registro Exitoso!',
      `Te has registrado a: ${eventName}`,
      [
        {
          text: 'Ver mi pase en Perfil',
          onPress: () => {
            setAttendeeName('');
            setEmail('');
            setPhone('');
            setEventName('');

            navigation.navigate('MainTabs', {
              screen: 'Profile',
              params: {
                email: email.toLowerCase(),
                newTicket: newTicket,
              },
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Registro a Evento</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Ingresa los datos para obtener tu pase
        </Text>

        <CustomInput
          label="Nombre del Asistente"
          placeholder="Tu nombre completo"
          value={attendeeName}
          onChangeText={setAttendeeName}
        />

        <CustomInput
          label="Correo Electrónico"
          placeholder="ejemplo@correo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <CustomInput
          label="Número de Teléfono"
          placeholder="9999-9999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <CustomInput
          label="Nombre del Evento"
          placeholder="Ej. Conferencia Tech 2026"
          value={eventName}
          onChangeText={setEventName}
        />

        <View style={styles.buttonContainer}>
          <CustomButton title="Confirmar Registro" onPress={handleRegister} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterEventScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
});

// src/screens/RegisterEventScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { AuthStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useTickets } from '../context/TicketContext';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const RegisterEventScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { addTicket } = useTickets();

  const [attendeeName, setAttendeeName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(''); // Formato YYYY-MM-DD

  const handleRegister = () => {
    if (!attendeeName || !email || !phone || !eventName || !eventDate) {
      Alert.alert('Error', 'Por favor completa todos los campos, incluida la fecha.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido.');
      return;
    }

    // Validar formato de fecha YYYY-MM-DD simple
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(eventDate)) {
      Alert.alert('Error', 'Ingresa la fecha en formato YYYY-MM-DD (ej: 2026-10-25).');
      return;
    }

    // Agregar ticket al estado global
    addTicket({
      title: eventName,
      date: eventDate,
      attendeeName,
      email: email.toLowerCase(),
      phone,
    });

    Alert.alert('¡Registro Exitoso!', `Te has registrado a: ${eventName}`, [
      {
        text: 'Ver mi pase en Perfil',
        onPress: () => {
          setAttendeeName('');
          setEmail('');
          setPhone('');
          setEventName('');
          setEventDate('');

          navigation.navigate('MainTabs', {
            screen: 'Profile',
            params: { email: email.toLowerCase() },
          });
        },
      },
    ]);
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

        <CustomInput
          label="Fecha del Evento (YYYY-MM-DD)"
          placeholder="2026-10-25"
          value={eventDate}
          onChangeText={setEventDate}
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
  safeArea: { flex: 1 },
  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  subtitle: { fontSize: 14, marginBottom: 24, marginTop: 4 },
  buttonContainer: { marginTop: 16, marginBottom: 20 },
});
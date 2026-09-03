import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado del Perfil */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>UP</Text>
        </View>
        <Text style={styles.name}>Usuario de Pruebas</Text>
        <Text style={styles.email}>usuario@correo.com</Text>
      </View>

      {/* Tarjetas de Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Eventos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Pases Activos</Text>
        </View>
      </View>

      {/* Mis Entradas / Pases */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Entradas Próximas</Text>
        
        <View style={styles.ticketCard}>
          <View>
            <Text style={styles.ticketTitle}>Conferencia Tech 2026</Text>
            <Text style={styles.ticketDate}>15 de Septiembre • 10:00 AM</Text>
          </View>
          <View style={styles.qrBadge}>
            <Text style={styles.qrBadgeText}>QR Listo</Text>
          </View>
        </View>

        <View style={styles.ticketCard}>
          <View>
            <Text style={styles.ticketTitle}>Hackathon Estudiantil</Text>
            <Text style={styles.ticketDate}>05 de Octubre • 08:30 AM</Text>
          </View>
          <View style={styles.qrBadge}>
            <Text style={styles.qrBadgeText}>QR Listo</Text>
          </View>
        </View>
      </View>

      {/* Botón de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F7FAFC',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3182CE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  email: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statCard: {
    flex: 0.48,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3182CE',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  section: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  ticketCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3182CE',
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
  },
  ticketDate: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 4,
  },
  qrBadge: {
    backgroundColor: '#EBF8FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  qrBadgeText: {
    color: '#2B6CB0',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E53E3E',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#E53E3E',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
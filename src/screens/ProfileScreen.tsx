import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackParamList, MainTabParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;
type ProfileRouteProp = RouteProp<MainTabParamList, 'Profile'>;

interface Ticket {
  id: string;
  title: string;
  date: string;
}

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ProfileRouteProp>();

  const userEmail = route.params?.email || 'usuario@correo.com';

  // Estado para gestionar los tickets de manera dinámica
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Escuchar si viene un nuevo ticket desde el formulario de registro
  useEffect(() => {
    const newTicket = (route.params as any)?.newTicket;
    if (newTicket) {
      setTickets((prevTickets) => {
        // Evitamos duplicar si el ticket ya existe en la lista
        const exists = prevTickets.some((item) => item.id === newTicket.id);
        if (!exists) {
          return [newTicket, ...prevTickets];
        }
        return prevTickets;
      });
    }
  }, [route.params]);

  // Función para cancelar/eliminar un registro de evento
  const handleCancelTicket = (ticketId: string, ticketTitle: string) => {
    Alert.alert(
      'Cancelar Registro',
      `¿Estás seguro de que deseas cancelar tu registro a "${ticketTitle}"?`,
      [
        { text: 'No, conservar', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => {
            setTickets((prevTickets) => prevTickets.filter((item) => item.id !== ticketId));
            Alert.alert('Registro Cancelado', 'Tu pase ha sido eliminado.');
          },
        },
      ]
    );
  };

  const getAvatarInitials = (email: string) => {
    const namePart = email.split('@')[0];
    if (!namePart) return 'U';
    return namePart.slice(0, 2).toUpperCase();
  };

  const getUserName = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => navigation.replace('Login') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado del Perfil */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getAvatarInitials(userEmail)}</Text>
          </View>
          <Text style={styles.name}>{getUserName(userEmail)}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>

        {/* Tarjetas de Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tickets.length}</Text>
            <Text style={styles.statLabel}>Eventos Registrados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tickets.length}</Text>
            <Text style={styles.statLabel}>Pases Activos</Text>
          </View>
        </View>

        {/* Mis Entradas / Pases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Entradas Próximas</Text>

          {tickets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aún no te has registrado a ningún evento.</Text>
              <Text style={styles.emptySubtext}>Ve a la pestaña "Register" para añadir tu primera entrada.</Text>
            </View>
          ) : (
            tickets.map((ticket) => (
              <View key={ticket.id} style={styles.ticketCard}>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketTitle}>{ticket.title}</Text>
                  <Text style={styles.ticketDate}>{ticket.date}</Text>
                </View>

                <View style={styles.ticketActions}>
                  <View style={styles.qrBadge}>
                    <Text style={styles.qrBadgeText}>QR Listo</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelTicket(ticket.id, ticket.title)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Botón de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
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
  ticketInfo: {
    flex: 1,
    marginRight: 10,
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
  ticketActions: {
    alignItems: 'flex-end',
  },
  qrBadge: {
    backgroundColor: '#EBF8FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  qrBadgeText: {
    color: '#2B6CB0',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelButtonText: {
    color: '#E53E3E',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 4,
    textAlign: 'center',
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
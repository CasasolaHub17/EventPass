import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
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

  // Estados para pases
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [processedIds, setProcessedIds] = useState<string[]>([]);

  // Estado para controlar el Modal del QR
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Escuchar si viene un nuevo ticket desde RegisterEventScreen
  useEffect(() => {
    const newTicket = (route.params as any)?.newTicket;

    if (newTicket && newTicket.id) {
      const isAlreadyProcessed = processedIds.includes(newTicket.id);

      if (!isAlreadyProcessed) {
        setProcessedIds((prev) => [...prev, newTicket.id]);
        setTickets((prev) => [newTicket, ...prev]);
      }
    }
  }, [route.params?.newTicket]);

  // Abrir Modal
  const handleOpenQR = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  // Cancelar Ticket
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
            if (selectedTicket?.id === ticketId) {
              setModalVisible(false);
            }
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
                {/* Zona de información clickeable */}
                <TouchableOpacity
                  style={styles.ticketInfo}
                  onPress={() => handleOpenQR(ticket)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.ticketTitle}>{ticket.title}</Text>
                  <Text style={styles.ticketDate}>{ticket.date}</Text>
                  <Text style={styles.tapToView}>Toca aquí para ver pase</Text>
                </TouchableOpacity>

                {/* Acciones laterales */}
                <View style={styles.ticketActions}>
                  {/* Botón QR Listo clickeable */}
                  <TouchableOpacity
                    style={styles.qrBadge}
                    onPress={() => handleOpenQR(ticket)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.qrBadgeText}>QR Listo </Text>
                  </TouchableOpacity>

                  {/* Botón de Cancelación */}
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

      {/* MODAL DEL CÓDIGO QR */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderTitle}>Pase Digital de Entrada</Text>
            <Text style={styles.modalEventTitle}>{selectedTicket?.title}</Text>
            <Text style={styles.modalAttendee}>{getUserName(userEmail)}</Text>

            {/* Código QR Dinámico */}
            {selectedTicket && (
              <View style={styles.qrContainer}>
                <Image
                  source={{
                    uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Ticket-${selectedTicket.id}`,
                  }}
                  style={styles.qrImage}
                />
              </View>
            )}

            <Text style={styles.ticketIdText}>ID: #{selectedTicket?.id.slice(-6)}</Text>
            <Text style={styles.qrInstruction}>Muestra este código QR en la entrada del evento.</Text>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Cerrar Pase</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
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
    marginTop: 2,
  },
  tapToView: {
    fontSize: 11,
    color: '#3182CE',
    marginTop: 6,
    fontWeight: '600',
  },
  ticketActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  qrBadge: {
    backgroundColor: '#EBF8FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BEE3F8',
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

  /* MODAL ESTILOS */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  modalHeaderTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#A0AEC0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalEventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 6,
    textAlign: 'center',
  },
  modalAttendee: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  qrContainer: {
    marginVertical: 20,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  ticketIdText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  qrInstruction: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  closeModalButton: {
    backgroundColor: '#3182CE',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
// src/screens/ProfileScreen.tsx
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
import { useTheme } from '../context/ThemeContext';

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
  const { colors, themeMode, setThemeMode } = useTheme();

  const userEmail = route.params?.email || 'usuario@correo.com';
  const isDark = themeMode === 'dark';

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [processedIds, setProcessedIds] = useState<string[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const newTicket = (route.params as any)?.newTicket;
    if (newTicket && newTicket.id) {
      if (!processedIds.includes(newTicket.id)) {
        setProcessedIds((prev) => [...prev, newTicket.id]);
        setTickets((prev) => [newTicket, ...prev]);
      }
    }
  }, [route.params?.newTicket]);

  const handleOpenQR = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

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
            setTickets((prev) => prev.filter((item) => item.id !== ticketId));
            if (selectedTicket?.id === ticketId) setModalVisible(false);
            Alert.alert('Registro Cancelado', 'Tu pase ha sido eliminado.');
          },
        },
      ]
    );
  };

  const getAvatarInitials = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart ? namePart.slice(0, 2).toUpperCase() : 'U';
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{getAvatarInitials(userEmail)}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{getUserName(userEmail)}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{userEmail}</Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{tickets.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Eventos Registrados</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{tickets.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pases Activos</Text>
          </View>
        </View>

        {/* Mis Entradas */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mis Entradas Próximas</Text>

          {tickets.length === 0 ? (
            <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.text }]}>Aún no te has registrado a ningún evento.</Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Ve a la pestaña "Registrar" para añadir tu primera entrada.
              </Text>
            </View>
          ) : (
            tickets.map((ticket) => (
              <View key={ticket.id} style={[styles.ticketCard, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
                <TouchableOpacity style={styles.ticketInfo} onPress={() => handleOpenQR(ticket)}>
                  <Text style={[styles.ticketTitle, { color: colors.text }]}>{ticket.title}</Text>
                  <Text style={[styles.ticketDate, { color: colors.textSecondary }]}>{ticket.date}</Text>
                  <Text style={[styles.tapToView, { color: colors.primary }]}>Toca aquí para ver pase</Text>
                </TouchableOpacity>

                <View style={styles.ticketActions}>
                  <TouchableOpacity
                    style={[styles.qrBadge, { backgroundColor: colors.primaryLight }]}
                    onPress={() => handleOpenQR(ticket)}
                  >
                    <Text style={[styles.qrBadgeText, { color: colors.primary }]}>QR Listo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCancelTicket(ticket.id, ticket.title)}>
                    <Text style={[styles.cancelButtonText, { color: colors.danger }]}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.danger }]} onPress={handleLogout}>
          <Text style={[styles.logoutText, { color: colors.danger }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Botón Flotante con Diseño Tipo Píldora */}
      <TouchableOpacity
        style={[
          styles.pillButton,
          {
            backgroundColor: isDark ? '#1E232A' : '#E6E9EF',
            borderColor: isDark ? '#2A303C' : '#D2D7E0',
          },
        ]}
        onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
        activeOpacity={0.8}
      >
        <View style={[styles.pillIconBadge, { backgroundColor: isDark ? '#2D3748' : '#FFFFFF' }]}>
          <Text style={styles.pillIcon}>{isDark ? '🌙' : '☀️'}</Text>
        </View>
        <Text style={[styles.pillText, { color: isDark ? '#A0AEC0' : '#718096' }]}>
          {isDark ? 'MODO OSCURO' : 'MODO CLARO'}
        </Text>
      </TouchableOpacity>

      {/* Modal QR */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.modalCard }]}>
            <Text style={[styles.modalHeaderTitle, { color: colors.textSecondary }]}>Pase Digital de Entrada</Text>
            <Text style={[styles.modalEventTitle, { color: colors.text }]}>{selectedTicket?.title}</Text>
            <Text style={[styles.modalAttendee, { color: colors.textSecondary }]}>{getUserName(userEmail)}</Text>

            {selectedTicket && (
              <View style={styles.qrContainer}>
                <Image
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Ticket-${selectedTicket.id}` }}
                  style={styles.qrImage}
                />
              </View>
            )}

            <Text style={[styles.ticketIdText, { color: colors.text }]}>ID: #{selectedTicket?.id.slice(-6)}</Text>
            <Text style={[styles.qrInstruction, { color: colors.textSecondary }]}>Muestra este código QR en la entrada del evento.</Text>

            <TouchableOpacity style={[styles.closeModalButton, { backgroundColor: colors.primary }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalButtonText}>Cerrar Pase</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, position: 'relative' },
  container: { padding: 20, paddingBottom: 90, flexGrow: 1 },
  header: { alignItems: 'center', marginVertical: 15 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { fontSize: 14, marginTop: 2 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  statCard: { flex: 0.48, padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 4 },
  section: { marginTop: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  ticketCard: { padding: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderLeftWidth: 4, elevation: 2 },
  ticketInfo: { flex: 1, marginRight: 10 },
  ticketTitle: { fontSize: 15, fontWeight: '600' },
  ticketDate: { fontSize: 12, marginTop: 2 },
  tapToView: { fontSize: 11, marginTop: 6, fontWeight: '600' },
  ticketActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  qrBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, marginBottom: 8 },
  qrBadgeText: { fontSize: 11, fontWeight: 'bold' },
  cancelButtonText: { fontSize: 12, fontWeight: '600' },
  emptyContainer: { padding: 20, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderStyle: 'dashed' },
  emptyText: { fontSize: 14, fontWeight: '600' },
  emptySubtext: { fontSize: 12, marginTop: 4, textAlign: 'center' },
  logoutButton: { borderWidth: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  logoutText: { fontSize: 16, fontWeight: 'bold' },

  /* Estilo del Botón Flotante Píldora */
  pillButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 46,
    paddingHorizontal: 6,
    paddingRight: 14,
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999,
  },
  pillIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  pillIcon: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 10,
  },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 10 },
  modalHeaderTitle: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  modalEventTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 6, textAlign: 'center' },
  modalAttendee: { fontSize: 14, marginTop: 2 },
  qrContainer: { marginVertical: 20, padding: 12, backgroundColor: '#FFF', borderRadius: 12 },
  qrImage: { width: 180, height: 180 },
  ticketIdText: { fontSize: 13, fontWeight: 'bold' },
  qrInstruction: { fontSize: 12, textAlign: 'center', marginTop: 6, marginBottom: 20 },
  closeModalButton: { width: '100%', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  closeModalButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});
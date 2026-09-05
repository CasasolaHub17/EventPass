// src/screens/ProfileScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext';
import { useTickets } from '../context/TicketContext';

// Helper para interpretar fechas en formatos DD-MM-YYYY y YYYY-MM-DD
const parseEventDate = (dateString?: string): Date => {
  if (!dateString) return new Date();

  const cleanDate = dateString.trim().replace(/\//g, '-');
  const parts = cleanDate.split('-');

  if (parts.length === 3) {
    const num1 = parseInt(parts[0], 10);
    const num2 = parseInt(parts[1], 10);
    const num3 = parseInt(parts[2], 10);

    if (parts[0].length === 2 && parts[2].length === 4) {
      return new Date(num3, num2 - 1, num1);
    }

    if (parts[0].length === 4) {
      return new Date(num1, num2 - 1, num3);
    }
  }

  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

// Determina el estado dinámicamente
const getEventStatus = (dateString?: string) => {
  const eventDate = parseEventDate(dateString);
  const today = new Date();

  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const eventTime = eventDate.getTime();
  const todayTime = today.getTime();

  if (eventTime > todayTime) {
    return {
      key: 'Próximos',
      label: 'Próximo',
      icon: '🟢',
      color: '#15803D',
      bgColor: '#DCFCE7',
    };
  } else if (eventTime === todayTime) {
    return {
      key: 'En Curso',
      label: 'En Curso',
      icon: '🟡',
      color: '#A16207',
      bgColor: '#FEF9C3',
    };
  } else {
    return {
      key: 'Finalizados',
      label: 'Finalizado',
      icon: '⚪',
      color: '#4B5563',
      bgColor: '#F3F4F6',
    };
  }
};

export const ProfileScreen = ({ navigation }: any) => {
  const themeContext = useTheme();

  const colors = themeContext.colors;
  const isDarkMode =
    themeContext.isDarkMode ??
    themeContext.themeMode === 'dark' ??
    themeContext.theme === 'dark';

  // Valor animado para la posición del círculo deslizante (0 = Izquierda / Claro, 1 = Derecha / Oscuro)
  const animatedValue = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const toggleTheme = () => {
    if (themeContext.toggleTheme) {
      themeContext.toggleTheme();
    } else if (themeContext.setThemeMode) {
      themeContext.setThemeMode(isDarkMode ? 'light' : 'dark');
    } else if (themeContext.setTheme) {
      themeContext.setTheme(isDarkMode ? 'light' : 'dark');
    }
  };

  const { tickets, deleteTicket } = useTickets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  // Cancelar Pase (Próximos)
  const handleCancelTicket = (ticketId: string, title: string) => {
    Alert.alert(
      'Cancelar Pase',
      `¿Deseas cancelar tu inscripción al evento "${title}"?`,
      [
        { text: 'Volver', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: () => {
            if (deleteTicket) deleteTicket(ticketId);
          },
        },
      ]
    );
  };

  // Eliminar Registro (Próximos o Finalizados)
  const handleDeleteTicket = (ticketId: string, title: string) => {
    Alert.alert(
      'Eliminar Registro',
      `¿Deseas eliminar permanentemente el registro de "${title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            if (deleteTicket) deleteTicket(ticketId);
          },
        },
      ]
    );
  };

  // Acciones al deslizar según el estado del evento
  const renderRightActions = (ticketId: string, title: string, statusKey: string) => {
    if (statusKey === 'En Curso') return null;

    if (statusKey === 'Próximos') {
      return (
        <View style={styles.swipeActionsContainer}>
          <TouchableOpacity
            style={[styles.swipeActionBtn, styles.cancelActionBtn]}
            onPress={() => handleCancelTicket(ticketId, title)}
            activeOpacity={0.8}
          >
            <Text style={styles.swipeActionText}>🚫 Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.swipeActionBtn, styles.deleteActionBtn]}
            onPress={() => handleDeleteTicket(ticketId, title)}
            activeOpacity={0.8}
          >
            <Text style={styles.swipeActionText}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.swipeActionsContainer}>
        <TouchableOpacity
          style={[styles.swipeActionBtn, styles.deleteActionBtn]}
          onPress={() => handleDeleteTicket(ticketId, title)}
          activeOpacity={0.8}
        >
          <Text style={styles.swipeActionText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const filteredTickets = tickets.filter((ticket: any) => {
    const rawDate = ticket.eventDate || ticket.date;
    const status = getEventStatus(rawDate);
    const title = ticket.eventTitle || ticket.title || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'Todos') return matchesSearch;
    return matchesSearch && status.key === selectedFilter;
  });

  const activeTicketsCount = tickets.filter((t: any) => {
    const rawDate = t.eventDate || t.date;
    return getEventStatus(rawDate).key !== 'Finalizados';
  }).length;

  // Interpolaciones de animación para el círculo deslizante
  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 70], // Desplazamiento horizontal dentro del track reducido
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Cabecera del Usuario */}
        <View style={styles.headerContainer}>
          <Text style={[styles.userName, { color: colors.text }]}>Usuario</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            usuario@correo.com
          </Text>
        </View>

        {/* Tarjetas de Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{tickets.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Pases</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: '#16A34A' }]}>{activeTicketsCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Activos</Text>
          </View>
        </View>

        {/* Buscador */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mis Entradas</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Desliza ⬅️ para opciones
          </Text>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar evento por nombre..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filtros */}
        <View style={styles.filterContainer}>
          {['Todos', 'Próximos', 'En Curso', 'Finalizados'].map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? colors.primary : colors.card,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterText, { color: isActive ? '#FFFFFF' : colors.textSecondary }]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lista de Eventos */}
        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: any) => {
            const rawDate = item.eventDate || item.date;
            const status = getEventStatus(rawDate);
            const title = item.eventTitle || item.title;

            const cardContent = (
              <View
                style={[
                  styles.ticketCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderLeftColor: status.color,
                  },
                ]}
              >
                <View style={styles.ticketMainInfo}>
                  <Text style={[styles.ticketTitle, { color: colors.text }]}>{title}</Text>
                  <Text style={[styles.ticketDate, { color: colors.textSecondary }]}>📅 {rawDate}</Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
                  <Text style={styles.statusIcon}>{status.icon}</Text>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>
            );

            if (status.key === 'En Curso') return cardContent;

            return (
              <Swipeable
                renderRightActions={() => renderRightActions(item.id, title, status.key)}
                overshootRight={false}
              >
                {cardContent}
              </Swipeable>
            );
          }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No se encontraron entradas.
            </Text>
          }
        />

        {/* Footer: Toggle Neumórfico Animado y Pequeño Alineado a la Derecha */}
        <View style={styles.footerContainer}>
          <View style={styles.toggleRowContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleTheme}
              style={[
                styles.compactTrack,
                isDarkMode ? styles.trackDark : styles.trackLight,
              ]}
            >
              {/* Texto de fondo indicativo */}
              <View style={styles.trackTextContainer}>
                {isDarkMode ? (
                  <Text style={styles.compactTextDark}>DARK</Text>
                ) : (
                  <Text style={styles.compactTextLight}>LIGHT</Text>
                )}
              </View>

              {/* Botón Circular Deslizante con Animación */}
              <Animated.View
                style={[
                  styles.compactThumb,
                  isDarkMode ? styles.thumbDark : styles.thumbLight,
                  {
                    transform: [{ translateX: thumbTranslateX }],
                  },
                ]}
              >
                <Text style={styles.compactThumbIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: '#EF4444' }]}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  headerContainer: { alignItems: 'center', marginBottom: 16 },
  userName: { fontSize: 22, fontWeight: 'bold' },
  userEmail: { fontSize: 14, marginTop: 2 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { flex: 0.48, paddingVertical: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 13, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionSubtitle: { fontSize: 12, fontStyle: 'italic' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, height: 44, marginBottom: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  filterChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontWeight: '600' },
  listContent: { paddingBottom: 16 },
  ticketCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderLeftWidth: 6, marginBottom: 10 },
  ticketMainInfo: { flex: 1 },
  ticketTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  ticketDate: { fontSize: 13 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusIcon: { fontSize: 10, marginRight: 4 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  swipeActionsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: 8 },
  swipeActionBtn: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, height: '100%', borderRadius: 12, marginLeft: 4 },
  cancelActionBtn: { backgroundColor: '#F97316' },
  deleteActionBtn: { backgroundColor: '#EF4444' },
  swipeActionText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 24, fontSize: 14 },

  footerContainer: { marginVertical: 8 },
  toggleRowContainer: {
    width: '100%',
    alignItems: 'flex-end', // Alinea el switch hacia la esquina derecha
    marginBottom: 12,
  },

  // Switch compacto neumórfico
  compactTrack: {
    width: 110,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  trackLight: {
    backgroundColor: '#E6E9EE',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  trackDark: {
    backgroundColor: '#1E232A',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  trackTextContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  compactTextLight: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E9AAB',
    letterSpacing: 1,
    paddingLeft: 30,
  },
  compactTextDark: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5A6578',
    letterSpacing: 1,
    paddingRight: 30,
  },

  // Thumb animado del Switch
  compactThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  thumbLight: {
    backgroundColor: '#F0F3F8',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbDark: {
    backgroundColor: '#2A303A',
    shadowColor: '#3A4250',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },
  compactThumbIcon: { fontSize: 16 },

  logoutButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 },
});
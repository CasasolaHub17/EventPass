// src/screens/HomeScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useTickets } from '../context/TicketContext';
import { useEvents, EventItem } from '../context/EventContext';

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { tickets, addTicket } = useTickets();
  const { events } = useEvents();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(
      (evt) =>
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, events]);

  const isUserRegistered = (eventId: string, eventTitle: string) => {
    return tickets.some(
      (t) => !t.isCancelled && (t.eventId === eventId || t.title.toLowerCase() === eventTitle.toLowerCase())
    );
  };

  const handleRegister = (event: EventItem) => {
    if (isUserRegistered(event.id, event.title)) {
      Alert.alert('Registro Duplicado', 'Ya posees un pase activo para este evento.');
      return;
    }

    addTicket({
      eventId: event.id,
      title: event.title,
      date: event.date,
      isCancelled: false,
    });

    Alert.alert(
      '¡Registro Exitoso! 🎉',
      `Te has inscrito a "${event.title}". Tu pase digital ya está disponible en tu perfil.`,
      [
        { text: 'Seguir explorando', style: 'cancel' },
        {
          text: 'Ver mi Pase',
          onPress: () => navigation.navigate('Profile'),
        },
      ]
    );
  };

  const renderEventItem = ({ item }: { item: EventItem }) => {
    const registered = isUserRegistered(item.id, item.title);

    return (
      <View style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.categoryBadge, { color: colors.primary, backgroundColor: `${colors.primary}15` }]}>
            {item.category}
          </Text>
          <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
            📅 {item.displayDate}
          </Text>
        </View>

        <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>
          📍 {item.location}
        </Text>

        <TouchableOpacity
          style={[
            styles.registerButton,
            { backgroundColor: registered ? '#22C55E20' : colors.primary },
            registered && { borderWidth: 1, borderColor: '#22C55E' },
          ]}
          onPress={() => handleRegister(item)}
          disabled={registered}
        >
          <Text
            style={[
              styles.registerButtonText,
              { color: registered ? '#22C55E' : '#FFFFFF' },
            ]}
          >
            {registered ? '✅ Registrado (1 Pase)' : '🎟️ Registrarme'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Descubrir Eventos</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Explora e inscríbete a los próximos eventos
        </Text>

        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar por nombre o categoría..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearSearch, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No se encontraron eventos para "{searchQuery}".
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 2, marginBottom: 15 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 15,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14 },
  clearSearch: { fontSize: 14, paddingHorizontal: 6, fontWeight: 'bold' },
  listContainer: { paddingBottom: 20 },
  eventCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  eventDate: { fontSize: 12, fontWeight: '500' },
  eventTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  eventLocation: { fontSize: 13, marginBottom: 14 },
  registerButton: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: { padding: 30, alignItems: 'center' },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
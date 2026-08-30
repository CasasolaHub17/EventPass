import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { EventCard } from '../components/EventCard';

const mockEvents = [
  { id: '1', title: 'Conferencia Tech 2026', date: '15 de Septiembre', spots: 12 },
  { id: '2', title: 'Taller de React Native', date: '20 de Septiembre', spots: 0 },
  { id: '3', title: 'Hackathon Estudiantil', date: '05 de Octubre', spots: 5 },
];

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Eventos Disponibles</Text>
      <FlatList
        data={mockEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            title={item.title}
            date={item.date}
            availableSpots={item.spots}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EDF2F7' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
});
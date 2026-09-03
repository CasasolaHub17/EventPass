import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

const mockEvents = [
  { id: '1', title: 'Conferencia Tech 2026', date: '15 de Septiembre', location: 'Auditorio Principal' },
  { id: '2', title: 'Hackathon Estudiantil', date: '05 de Octubre', location: 'Laboratorio de Cómputo' },
  { id: '3', title: 'Taller de React Native', date: '20 de Octubre', location: 'Aula Magna' },
];

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Eventos Disponibles</Text>

        <FlatList
          data={mockEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDetail}>📅 {item.date}</Text>
              <Text style={styles.cardDetail}>📍 {item.location}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FAFC',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 6,
  },
  cardDetail: {
    fontSize: 13,
    color: '#718096',
    marginTop: 2,
  },
});
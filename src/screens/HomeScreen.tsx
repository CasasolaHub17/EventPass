// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const mockEvents = [
  { id: '1', title: 'Conferencia Tech 2026', date: '15 de Septiembre', location: 'Auditorio Principal' },
  { id: '2', title: 'Hackathon Estudiantil', date: '05 de Octubre', location: 'Laboratorio de Cómputo' },
  { id: '3', title: 'Taller de React Native', date: '20 de Octubre', location: 'Aula Magna' },
];

export const HomeScreen = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Eventos Disponibles</Text>

        <FlatList
          data={mockEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.cardDetail, { color: colors.textSecondary }]}>📅 {item.date}</Text>
              <Text style={[styles.cardDetail, { color: colors.textSecondary }]}>📍 {item.location}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
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
    marginBottom: 6,
  },
  cardDetail: {
    fontSize: 13,
    marginTop: 2,
  },
});
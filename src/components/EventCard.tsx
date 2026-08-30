import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  date: string;
  availableSpots: number;
}

export const EventCard: React.FC<Props> = ({ title, date, availableSpots }) => {
  const isAvailable = availableSpots > 0;

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Estilo condicional: Verde si hay cupos, Rojo si está agotado */}
      <View
        style={[
          styles.badge,
          { backgroundColor: isAvailable ? '#C6F6D5' : '#FED7D7' },
        ]}
      >
        <Text style={{ color: isAvailable ? '#22543D' : '#742A2A', fontWeight: 'bold' }}>
          {isAvailable ? `${availableSpots} Cupos` : 'Agotado'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  date: {
    color: '#718096',
    marginTop: 4,
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
});
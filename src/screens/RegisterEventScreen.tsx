// src/screens/RegisterEventScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../context/EventContext';

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'Register'>;

export const RegisterEventScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { addEvent } = useEvents();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tecnología');
  const [location, setLocation] = useState('');

  // Estados para el selector de fecha
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [hasSelectedDate, setHasSelectedDate] = useState<boolean>(false);

  // Formatea la fecha seleccionada en formato DD-MM-YYYY
  const formatDateDDMMYYYY = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Manejador del cambio de fecha en el calendario
  const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setHasSelectedDate(true);
    }
  };

  const handleCreateEvent = () => {
    if (!title.trim() || !location.trim() || !hasSelectedDate) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos y selecciona una fecha.');
      return;
    }

    const formattedDate = formatDateDDMMYYYY(selectedDate);

    addEvent({
      title: title.trim(),
      category,
      location: location.trim(),
      date: formattedDate,
      displayDate: formattedDate, // Muestra DD-MM-YYYY en la lista de eventos
    });

    Alert.alert(
      '¡Evento Publicado! 🎉',
      `"${title}" ha sido creado para el ${formattedDate}.`,
      [
        {
          text: 'Ver en la Lista',
          onPress: () => {
            setTitle('');
            setLocation('');
            setHasSelectedDate(false);
            setSelectedDate(new Date());
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>➕ Crear Evento</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Publica un nuevo evento para la comunidad
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>Título del Evento</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Ej: Conferencia AI & Devs 2026"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: colors.text }]}>Categoría</Text>
        <View style={styles.categoryContainer}>
          {['Tecnología', 'Música', 'Comida', 'Deportes'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                { backgroundColor: category === cat ? colors.primary : colors.card, borderColor: colors.border },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={{ color: category === cat ? '#FFF' : colors.text, fontWeight: 'bold' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Ubicación / Lugar</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Ej: Auditorio Central, Expo Center"
          placeholderTextColor={colors.textSecondary}
          value={location}
          onChangeText={setLocation}
        />

        {/* Selector de fecha en formato DD-MM-YYYY */}
        <Text style={[styles.label, { color: colors.text }]}>Fecha del Evento</Text>
        <TouchableOpacity
          style={[styles.datePickerButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: hasSelectedDate ? colors.text : colors.textSecondary, fontSize: 14 }}>
            {hasSelectedDate ? `📅 ${formatDateDDMMYYYY(selectedDate)}` : '📅 Seleccionar fecha (DD-MM-YYYY)...'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleCreateEvent}>
          <Text style={styles.submitButtonText}>🚀 Publicar Evento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterEventScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 13, marginTop: 2, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14 },
  datePickerButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    justifyContent: 'center',
  },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 4 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1 },
  submitButton: { marginTop: 28, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
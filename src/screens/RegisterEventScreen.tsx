import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../context/EventContext';

const CATEGORIES = ['Tecnología', 'Música', 'Deportes', 'Educación', 'Entretenimiento'];

export const RegisterEventScreen = ({ navigation }: any) => {
  const themeContext = useTheme();
  const colors = themeContext?.colors || {
    background: '#FFFFFF',
    card: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    primary: '#2563EB',
  };

  const isDarkMode =
    themeContext?.isDarkMode ??
    themeContext?.themeMode === 'dark' ??
    themeContext?.theme === 'dark' ??
    false;

  const eventContext = useEvents ? useEvents() : null;
  const addEvent = eventContext?.addEvent;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Tecnología');

  // Fecha actual dinámica del sistema
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dayNamesHeader = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'];

  const getFormattedHeaderDate = (date: Date) => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = monthNames[date.getMonth()];
    return `${dayName}, ${day} de ${monthName}`;
  };

  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      grid.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      grid.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return grid;
  };

  const changeMonth = (direction: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1));
  };

  const isSelectedDate = (date: Date) => {
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  const handleCreateEvent = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para el evento.');
      return;
    }

    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDateStr = `${day}-${month}-${year}`;

    const newEvent = {
      id: Date.now().toString(),
      title,
      description,
      location,
      category,
      date: formattedDateStr,
    };

    if (addEvent) {
      addEvent(newEvent);
    }

    Alert.alert('¡Éxito!', 'El evento ha sido registrado correctamente.', [
      { text: 'OK', onPress: () => navigation?.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Registrar Evento</Text>

        {/* Título */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Título del Evento</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Ej. Concierto de Rock"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Categoría */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    active
                      ? { backgroundColor: '#E0F2FE', borderColor: '#0284C7' }
                      : { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: active ? '#0284C7' : colors.textSecondary },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selector de Fecha */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Fecha del Evento</Text>
          <TouchableOpacity
            style={[
              styles.dateSelectorInput,
              {
                backgroundColor: isDarkMode ? '#1E2024' : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setIsCalendarVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.dateInputText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
              {getFormattedHeaderDate(currentDate)}
            </Text>
            <View style={[styles.dropdownSquare, { backgroundColor: isDarkMode ? '#2B2D33' : '#E5E7EB' }]}>
              <Text style={{ color: isDarkMode ? '#FFFFFF' : colors.text, fontSize: 10 }}>˅</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Ubicación */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Ubicación</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Ej. Auditorio Principal"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Descripción */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Descripción</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Detalles sobre el evento..."
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleCreateEvent}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Guardar Evento</Text>
        </TouchableOpacity>

        {/* Modal Calendario Estilizado */}
        <Modal
          visible={isCalendarVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsCalendarVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsCalendarVisible(false)}
          >
            <View
              style={[
                styles.calendarCard,
                { backgroundColor: isDarkMode ? '#212124' : '#FFFFFF' },
              ]}
              onStartShouldSetResponder={() => true}
            >
              {/* Encabezado: Fecha Seleccionada */}
              <View style={styles.headerSelectedRow}>
                <Text style={[styles.headerSelectedText, { color: isDarkMode ? '#F4F4F5' : '#111827' }]}>
                  {getFormattedHeaderDate(currentDate)}
                </Text>
                <TouchableOpacity
                  style={[styles.dropdownChevronBtn, { borderColor: isDarkMode ? '#3F3F46' : '#E5E7EB' }]}
                  onPress={() => setIsCalendarVisible(false)}
                >
                  <Text style={{ color: isDarkMode ? '#D4D4D8' : '#4B5563', fontSize: 12 }}>˅</Text>
                </TouchableOpacity>
              </View>

              {/* Control de Navegación de Mes */}
              <View style={styles.monthNavRow}>
                <Text style={[styles.monthNavTitle, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>
                  {`${monthNames[viewDate.getMonth()]} de ${viewDate.getFullYear()}`}
                </Text>
                <View style={styles.arrowsContainer}>
                  <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
                    <Text style={[styles.arrowText, { color: isDarkMode ? '#A1A1AA' : '#4B5563' }]}>▲</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
                    <Text style={[styles.arrowText, { color: isDarkMode ? '#A1A1AA' : '#4B5563' }]}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Cabecera de Días de la Semana */}
              <View style={styles.daysHeaderRow}>
                {dayNamesHeader.map((day, idx) => (
                  <Text key={idx} style={[styles.dayHeaderCell, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>
                    {day}
                  </Text>
                ))}
              </View>

              {/* Matriz de Días */}
              <View style={styles.gridContainer}>
                {generateCalendarDays().map((item, index) => {
                  const selected = isSelectedDate(item.date);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.dayCell}
                      activeOpacity={0.7}
                      onPress={() => {
                        setCurrentDate(item.date);
                        setViewDate(new Date(item.date.getFullYear(), item.date.getMonth(), 1));
                        setIsCalendarVisible(false);
                      }}
                    >
                      <View style={[styles.dayCircle, selected && styles.selectedDayCircle]}>
                        <Text
                          style={[
                            styles.dayText,
                            {
                              color: selected
                                ? '#18181B'
                                : item.isCurrentMonth
                                ? isDarkMode
                                  ? '#FFFFFF'
                                  : '#111827'
                                : isDarkMode
                                ? '#52525B'
                                : '#A1A1AA',
                            },
                          ]}
                        >
                          {item.day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterEventScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  dateSelectorInput: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
  },
  dateInputText: { fontSize: 15, fontWeight: '500' },
  dropdownSquare: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  calendarCard: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 18,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  headerSelectedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerSelectedText: {
    fontSize: 20,
    fontWeight: '500',
  },
  dropdownChevronBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  monthNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  monthNavTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  arrowsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  arrowBtn: {
    padding: 6,
  },
  arrowText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayHeaderCell: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayCircle: {
    backgroundColor: '#E8ACEB',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
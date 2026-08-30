import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export const RegisterEventScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    let valid = true;
    let newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
      valid = false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Ingrese un correo electrónico válido';
      valid = false;
    }
    if (phone.length < 8) {
      newErrors.phone = 'Ingrese un teléfono válido (mín. 8 dígitos)';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      Alert.alert('¡Éxito!', 'Registro completado con éxito');
      setName('');
      setEmail('');
      setPhone('');
      setErrors({});
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscripción a Evento</Text>
      
      <CustomInput
        label="Nombre Completo"
        placeholder="Juan Pérez"
        value={name}
        onChangeText={setName}
        error={errors.name}
      />
      <CustomInput
        label="Correo Electrónico"
        placeholder="juan@ejemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={errors.email}
      />
      <CustomInput
        label="Teléfono"
        placeholder="99998888"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        error={errors.phone}
      />

      <CustomButton title="Confirmar Registro" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FFF', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
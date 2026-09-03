import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { AuthStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.includes('@')) {
      Alert.alert('Error', 'Ingrese un correo electrónico válido.');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Error', 'La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    // Navega al TabNavigator pasando el correo ingresado
    navigation.replace('MainTabs', {
      screen: 'Profile',
      params: { email: email.toLowerCase() },
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>EventPass</Text>
      <Text style={styles.subtitle}>Gestión de Eventos y Entradas</Text>

      <CustomInput
        label="Correo Electrónico"
        placeholder="usuario@ejemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <CustomInput
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <CustomButton title="Iniciar Sesión" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F7FAFC',
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 28,
  },
});
// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { AuthStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useTheme();

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: colors.text }]}>EventPass</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Gestión de Eventos y Entradas
      </Text>

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

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 28,
  },
});

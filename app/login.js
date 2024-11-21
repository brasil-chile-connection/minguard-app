import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { styled } from "nativewind";
import { Screen } from "../components/Screen";
import { Link, useRouter } from "expo-router";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const StyledPressable = styled(Pressable);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Ingresa un correo electrónico válido.");
      return;
    }

    try {
      const API_URL = 'http://192.168.1.132:8089';

      // Solicitud de login al backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;

      // Guarda el token en SecureStore
      await SecureStore.setItemAsync('userToken', token);
      console.log('Token guardado en SecureStore:', token);

      // Obtener y guardar el rol del usuario
      const userResponse = await axios.get(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userRole = userResponse.data.role.name;
      await SecureStore.setItemAsync('userRole', userRole);
      console.log('Rol del usuario guardado:', userRole);

      // Redirigir según el rol
      if (userRole === "ADMIN") {
        router.replace('/admin/overview');
      } else if (userRole === "WORKER") {
        router.replace('/worker/overview');
      } else {
        Alert.alert("Error", "Rol de usuario no reconocido.");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.error('Token expirado o no válido. Intenta renovar.');
        handleTokenRefresh();
      } else {
        console.error('Error al iniciar sesión:', error);
        Alert.alert("Error", "Ocurrió un problema al iniciar sesión.");
      }
    }
  };

  const handleTokenRefresh = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        console.error('No se encontró un refresh token.');
        router.replace('/login');
        return;
      }

      const API_URL = 'http://192.168.1.132:8089';
      const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, {
        refreshToken,
      });

      const newToken = refreshResponse.data.token;
      console.log('Nuevo token obtenido:', newToken);

      // Guarda el nuevo token en SecureStore
      await SecureStore.setItemAsync('userToken', newToken);

      // Reintenta la solicitud que falló
      router.replace('/overview');
    } catch (error) {
      console.error('Error al renovar el token:', error);
      Alert.alert("Error", "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      router.replace('/login');
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center bg-black"
      >
        <Text className="text-white text-2xl mb-8">Iniciar Sesión</Text>

        <TextInput
          placeholder="Correo Electrónico"
          keyboardType="email-address"
          className="bg-white/90 w-3/4 p-4 mb-4 rounded"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          className="bg-white/90 w-3/4 p-4 mb-6 rounded"
          value={password}
          onChangeText={setPassword}
        />

        <StyledPressable
          onPress={handleLogin}
          className="bg-yellow-500 w-3/4 p-4 rounded items-center mb-4 active:bg-yellow-600"
          accessible={true}
          accessibilityLabel="Botón para iniciar sesión"
        >
          <Text className="text-black font-bold">Ingresar</Text>
        </StyledPressable>

        <Link href="/recoverpassword" className="mt-4">
          <Text className="text-white/70">¿Olvidaste tu contraseña?</Text>
        </Link>
      </KeyboardAvoidingView>
    </Screen>
  );
}

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
      // Dirección IP de tu máquina; ajusta según sea necesario
      const API_URL = 'http://192.168.59.148:8089';

      // Realiza la solicitud POST al endpoint de autenticación
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email,
        password: password,
      });

      // Supongamos que el token viene en response.data.token
      const token = response.data.token;

      // Guarda el token de forma segura
      await SecureStore.setItemAsync('userToken', token);

      // Navega a /overview
      router.push('/overview');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Manejo de errores según la respuesta de la API
      if (error.response && error.response.status === 401) {
        Alert.alert("Error", "Correo o contraseña incorrectos.");
      } else {
        Alert.alert("Error", "Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.");
      }
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

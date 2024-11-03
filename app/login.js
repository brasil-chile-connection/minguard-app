import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { styled } from "nativewind";
import { Screen } from "../components/Screen";
import { Link, useRouter } from "expo-router";

const StyledPressable = styled(Pressable);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Ingresa un correo electrónico válido.");
      return;
    }

    // Lógica de autenticación
    // Si la autenticación es exitosa, redirige a /overview
    router.push('/overview');
    // Si falla, muestra un mensaje de error
    // Alert.alert("Error", "Correo o contraseña incorrectos.");
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

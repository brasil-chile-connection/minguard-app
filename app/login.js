import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import { Screen } from "../components/Screen";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../components/Logo";
import { CircleInfoIcon } from "../components/Icons"; 

const StyledPressable = styled(Pressable);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Ingresa un correo electrónico válido.");
      return;
    }

    try {
      const API_URL = "http://192.168.1.144:8089";

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;

      await SecureStore.setItemAsync("userToken", token);

      const userResponse = await axios.get(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userRole = userResponse.data.role.name;
      const userId = userResponse.data.id;

      await SecureStore.setItemAsync("userRole", userRole);
      await SecureStore.setItemAsync("userId", userId.toString());

      if (userRole === "ADMIN") {
        router.replace("/admin/overview");
      } else if (userRole === "WORKER") {
        router.replace("/worker/overview");
      } else {
        Alert.alert("Error", "Rol de usuario no reconocido.");
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert("Error", "Ocurrió un problema al iniciar sesión.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      {/* Encabezado personalizado */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: "black",
        }}
      >
        <Pressable>
          <Logo />
        </Pressable>
        <Pressable>
          <CircleInfoIcon />
        </Pressable>
      </View>

      {/* Formulario de inicio de sesión */}
      <Screen>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
    </SafeAreaView>
  );
}

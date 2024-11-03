// app/_layout.js
// Este layout envuelve todas las pantallas y configura la navegación

import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Logo } from "../components/Logo";
import { CircleInfoIcon } from "../components/Icons";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        // Estilos del encabezado
        headerStyle: { backgroundColor: "black" },
        headerTintColor: "white",
        headerTitle: "",
        // Estilo del contenido de las pantallas
        contentStyle: { backgroundColor: "black" },
        // Botón izquierdo del encabezado
        headerLeft: () => (
          <Pressable
            onPress={() => router.push("/")}
            accessible={true}
            accessibilityLabel="Ir a inicio"
          >
            <Logo />
          </Pressable>
        ),
        // Botón derecho del encabezado
        headerRight: () => (
          <Pressable
            onPress={() => router.push("/about")}
            accessible={true}
            accessibilityLabel="Acerca de"
          >
            <CircleInfoIcon />
          </Pressable>
        ),
      }}
    />
  );
}

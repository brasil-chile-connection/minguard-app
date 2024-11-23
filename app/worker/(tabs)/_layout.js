// app/worker/(tabs)/_layout.js
import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function WorkerLayout() {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userRole = await SecureStore.getItemAsync("userRole");
        if (userRole !== "WORKER") {
          // Si el rol no es WORKER, redirigir a login o pantalla inicial
          router.replace("/login");
        } else {
          setRole(userRole);
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        router.replace("/login");
      }
    };

    fetchUserRole();
  }, []);

  if (!role) {
    // Mostrar un estado de carga mientras se obtiene el rol
    return null;
  }

  const workerScreens = [
    {
      name: "overview",
      title: "Resumen",
      icon: ({ color, size }) => (
        <MaterialIcons name="dashboard" color={color} size={size} />
      ),
    },
    {
      name: "ReportIncident",
      title: "Reportar",
      icon: ({ color, size }) => (
        <MaterialIcons name="report-problem" color={color} size={size} />
      ),
    },
    {
      name: "HistorialIncidente",
      title: "Historial",
      icon: ({ color, size }) => (
        <MaterialIcons name="history" color={color} size={size} />
      ),
    },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "black" },
        tabBarActiveTintColor: "yellow",
        tabBarInactiveTintColor: "white",
      }}
    >
      {workerScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: screen.icon,
          }}
        />
      ))}
    </Tabs>
  );
}

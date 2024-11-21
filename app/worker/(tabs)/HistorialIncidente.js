import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { InfoIcon } from "../../../components/Icons";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function TabsLayout() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const storedRole = await SecureStore.getItemAsync("userRole");
        if (storedRole) {
          setRole(storedRole);
        } else {
          router.replace("/login"); // Redirigir al login si no hay rol
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return null; // Mostrar un estado de carga si es necesario
  }

  // Configuración de tabs por rol
  const tabsConfig = {
    ADMIN: [
      {
        name: "admin/overview",
        title: "Resumen",
        icon: ({ color, size }) => (
          <MaterialIcons name="dashboard" color={color} size={size} />
        ),
      },
      {
        name: "admin/about",
        title: "Acerca",
        icon: ({ color, size }) => <InfoIcon color={color} size={size} />,
      },
      {
        name: "admin/Tickets",
        title: "Tickets",
        icon: ({ color, size }) => (
          <MaterialIcons name="receipt" color={color} size={size} />
        ),
      },
    ],
    WORKER: [
      {
        name: "worker/overview",
        title: "Resumen",
        icon: ({ color, size }) => (
          <MaterialIcons name="dashboard" color={color} size={size} />
        ),
      },
      {
        name: "worker/ReportIncident",
        title: "Reporte",
        icon: ({ color, size }) => (
          <MaterialIcons name="report-problem" color={color} size={size} />
        ),
      },
      {
        name: "worker/HistorialIncidente",
        title: "Historial",
        icon: ({ color, size }) => (
          <MaterialIcons name="history" color={color} size={size} />
        ),
      },
    ],
  };

  const tabs = tabsConfig[role] || [];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "black" },
        tabBarActiveTintColor: "yellow",
        tabBarInactiveTintColor: "white",
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: tab.icon,
          }}
        />
      ))}
    </Tabs>
  );
}

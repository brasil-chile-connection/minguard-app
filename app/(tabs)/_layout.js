// app/tabs/_layout.js

import { Tabs } from "expo-router";
import { HomeIcon, InfoIcon, LoginIcon } from "../../components/Icons";
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "black" },
        tabBarActiveTintColor: "yellow",
        tabBarInactiveTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="about"
        options={{
          title: "Acerca",
          tabBarIcon: ({ color, size }) => (
            <InfoIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="overview"
        options={{
          title: "Resumen",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ReportIncident"
        options={{
          title: "Reporte",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="report-problem" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Tickets"
        options={{
          title: "Tickets",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="receipt" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Historialincidente"
        options={{
          title: "Historial",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

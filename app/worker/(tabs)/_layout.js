// app/worker/(tabs)/_layout.js
import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, View, Modal, Text, StyleSheet, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { Logo } from "../../../components/Logo";

export default function WorkerLayout() {
  const [role, setRole] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userRole = await SecureStore.getItemAsync("userRole");
        if (userRole !== "WORKER") {
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

  const fetchUserInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const API_URL = "http://ec2-44-221-160-148.compute-1.amazonaws.com:8089/user/me";
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userRole");
    await SecureStore.deleteItemAsync("userId");
    router.replace("/login");
  };

  if (!role) {
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
    <>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "white",
          headerTitle: "",
          tabBarStyle: { backgroundColor: "black" },
          tabBarActiveTintColor: "yellow",
          tabBarInactiveTintColor: "white",
          headerLeft: () => (
            <Pressable
              onPress={() => router.push("worker/overview/")}
              accessible={true}
              accessibilityLabel="Ir a inicio"
            >
              <Logo />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                fetchUserInfo();
                setModalVisible(true);
              }}
              accessible={true}
              accessibilityLabel="Cuenta"
            >
              <MaterialIcons name="account-circle" size={36} color="white" />
            </Pressable>
          ),
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

      {/* Modal para mostrar información del usuario */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Información de la Cuenta</Text>
            <Text style={styles.modalText}>
              Nombre: {userInfo.firstName} {userInfo.lastName}
            </Text>
            <Text style={styles.modalText}>Correo: {userInfo.email}</Text>
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </Pressable>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

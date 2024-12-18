import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Screen } from "../../../components/Screen";

export default function HistorialIncidente() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://192.168.1.144:8089";

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const userId = await SecureStore.getItemAsync("userId");

      if (!userId) {
        Alert.alert("Error", "No se encontró el ID del usuario.");
        return;
      }

      const response = await axios.get(`${API_URL}/incident/reporter/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncidents(response.data);
    } catch (error) {
      console.error("Error al obtener los incidentes:", error);
      Alert.alert("Error", "No se pudieron obtener los incidentes.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    fetchIncidents();
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#FFD700" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial de Incidentes</Text>
        <Pressable onPress={onRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Actualizar</Text>
        </Pressable>
      </View>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>

              {/* Mostrar imágenes del incidente */}
              {item.images && item.images.length > 0 && (
                <FlatList
                  data={item.images}
                  keyExtractor={(imageUri, index) => index.toString()}
                  horizontal
                  renderItem={({ item: imageUri }) => (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                  )}
                  style={{ marginBottom: 12 }}
                />
              )}

              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>Ubicación:</Text>
                <Text style={styles.cardText}>{item.location}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>Urgencia:</Text>
                <Text style={styles.cardText}>
                  {item.urgencyId || "No especificada"}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>Fecha:</Text>
                <Text style={styles.cardText}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
  },
  refreshButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: "#333", // Fondo negro
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    color: "#FFD700", // Texto amarillo
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
  },
  cardDescription: {
    color: "#fff", // Texto blanco
    fontSize: 16,
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: "row",
    marginBottom: 4,
  },
  cardLabel: {
    color: "#FFD700", // Etiquetas en amarillo
    fontWeight: "bold",
    marginRight: 4,
  },
  cardText: {
    color: "#fff", // Texto blanco
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
});

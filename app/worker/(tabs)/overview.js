import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Pressable, // Importamos Pressable para el botón
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { format } from "date-fns";

export default function Overview() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerName, setWorkerName] = useState("");
  const [refreshing, setRefreshing] = useState(false); // Estado para controlar el refresco

  const fetchIncidents = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        Alert.alert("Error", "No se encontró el token de usuario.");
        return;
      }

      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) {
        Alert.alert("Error", "No se encontró el ID del usuario.");
        return;
      }

      const API_URL = "http://192.168.1.150:8089";

      // Obtener información del trabajador
      const userResponse = await axios.get(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkerName(
        userResponse.data.firstName + " " + userResponse.data.lastName
      );

      // Obtener los incidentes del trabajador del día actual
      const today = format(new Date(), "yyyy-MM-dd");
      const response = await axios.get(
        `${API_URL}/incident/reporter/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const todaysIncidents = response.data.filter((incident) => {
        const incidentDate = format(new Date(incident.createdAt), "yyyy-MM-dd");
        return incidentDate === today;
      });

      setIncidents(todaysIncidents);
    } catch (error) {
      console.error("Error al obtener los incidentes:", error);
      Alert.alert("Error", "No se pudieron obtener los incidentes.");
    } finally {
      setLoading(false);
      setRefreshing(false); // Asegurarse de que 'refreshing' sea falso
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true); // Mostrar el indicador de carga si es necesario
    fetchIncidents();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="yellow" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado con el botón de Actualizar */}
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido, {workerName}</Text>
        <Pressable onPress={onRefresh} style={styles.refreshButton}>
          {refreshing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          )}
        </Pressable>
      </View>

      {incidents.length === 0 ? (
        <Text style={styles.noIncidentsText}>
          No se encontraron incidentes reportados hoy.
        </Text>
      ) : (
        <>
          <Text style={styles.subtitle}>Incidentes reportados hoy:</Text>
          <FlatList
            data={incidents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardDetail}>Ubicación: {item.location}</Text>
                <Text style={styles.cardDetail}>
                  Fecha: {new Date(item.createdAt).toLocaleTimeString()}
                </Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "#fff",
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
  subtitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
  },
  noIncidentsText: {
    color: "#ccc",
    fontSize: 18,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#333",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  cardDescription: {
    color: "#ccc",
    marginBottom: 5,
  },
  cardDetail: {
    color: "yellow",
  },
});

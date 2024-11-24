import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Screen } from "../../../components/Screen";

export default function HistorialIncidente() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // Obtener el token y el ID del usuario
        const token = await SecureStore.getItemAsync("userToken");
        const userId = await SecureStore.getItemAsync("userId");

        if (!userId) {
          Alert.alert("Error", "No se encontró el ID del usuario.");
          return;
        }

        const API_URL = "http://192.168.1.150:8089";

        // Llamar a la API para obtener los incidentes del usuario
        const response = await axios.get(`${API_URL}/incident/reporter/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIncidents(response.data); // Suponiendo que la API devuelve un array
      } catch (error) {
        console.error("Error al obtener los incidentes:", error);
        Alert.alert("Error", "No se pudieron obtener los incidentes.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const handleIncidentPress = (incident) => {
    setSelectedIncident(incident);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="yellow" />
      </Screen>
    );
  }

  if (incidents.length === 0) {
    return (
      <Screen>
        <Text className="text-white text-center mt-4">
          No se encontraron incidentes reportados.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleIncidentPress(item)}
            style={{
              backgroundColor: "#444",
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
              {item.title}
            </Text>
            <Text style={{ color: "#ccc", marginVertical: 5 }}>
              {item.description}
            </Text>
            <Text style={{ color: "yellow" }}>
              Fecha: {new Date(item.createdAt).toLocaleString()}
            </Text>
          </Pressable>
        )}
      />

      {/* Modal para mostrar detalles del incidente */}
      <Modal visible={modalVisible} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          {selectedIncident && (
            <View style={{ backgroundColor: "#222", padding: 20, borderRadius: 10 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                {selectedIncident.title}
              </Text>
              <Text style={{ color: "#ccc", marginBottom: 10 }}>
                {selectedIncident.description}
              </Text>
              <Text style={{ color: "yellow", marginBottom: 10 }}>
                Fecha: {new Date(selectedIncident.createdAt).toLocaleString()}
              </Text>
              <Text style={{ color: "#fff", marginBottom: 10 }}>
                Ubicación: {selectedIncident.location || "No especificada"}
              </Text>
              <Text style={{ color: "#fff", marginBottom: 10 }}>
                Urgencia: {selectedIncident.urgencyId || "No especificada"}
              </Text>
              {selectedIncident.images && selectedIncident.images.length > 0 ? (
                <View style={{ marginVertical: 10 }}>
                  <Text style={{ color: "#fff", marginBottom: 10 }}>Imágenes:</Text>
                  {selectedIncident.images.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                      resizeMode="contain"
                    />
                  ))}
                </View>
              ) : (
                <Text style={{ color: "#ccc" }}>Sin imágenes adjuntas</Text>
              )}
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{
                  marginTop: 10,
                  backgroundColor: "yellow",
                  padding: 10,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#000", fontWeight: "bold" }}>Cerrar</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </Screen>
  );
}

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, Pressable } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { styled } from "nativewind";
import { Screen } from "../../../components/Screen";

const StyledPressable = styled(Pressable);

export default function HistorialIncidente() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const renderIncident = ({ item }) => (
    <View className="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <Text className="text-lg font-bold text-white mb-2">Título: {item.title}</Text>
      <Text className="text-sm text-gray-300 mb-1">Descripción: {item.description}</Text>
      <Text className="text-sm text-gray-400 mb-1">
        Fecha: {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Text className="text-sm text-yellow-400 mb-2">Ubicación: {item.location}</Text>
      <StyledPressable
        className="bg-yellow-500 rounded p-2 mt-2 items-center"
        onPress={() => Alert.alert("Más detalles", `Detalles del incidente: ${item.title}`)}
      >
        <Text className="text-black font-bold">Ver Detalles</Text>
      </StyledPressable>
    </View>
  );

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center bg-black">
          <ActivityIndicator size="large" color="#FFD700" />
          <Text className="text-white mt-4">Cargando incidentes...</Text>
        </View>
      </Screen>
    );
  }

  if (incidents.length === 0) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center bg-black">
          <Text className="text-white text-center text-lg mt-4">
            No se encontraron incidentes reportados.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text className="text-2xl font-bold text-white mt-4 mb-4">Historial de Incidentes</Text>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderIncident}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </Screen>
  );
}

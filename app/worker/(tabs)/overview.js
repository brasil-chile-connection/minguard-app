import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Alert, ActivityIndicator } from "react-native";
import { Screen } from "../../../components/Screen";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function OverviewWorker() {
  const [workerName, setWorkerName] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const userId = await SecureStore.getItemAsync("userId");

        if (!userId || !token) {
          Alert.alert("Error", "No se pudo obtener los datos del usuario.");
          return;
        }

        const API_URL = "http://192.168.1.150:8089";

        // Obtener información del trabajador
        const userResponse = await axios.get(`${API_URL}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { firstName, lastName } = userResponse.data;
        setWorkerName(`${firstName} ${lastName}`);

        // Obtener los incidentes reportados por el trabajador
        const incidentResponse = await axios.get(`${API_URL}/incident/reporter/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIncidents(incidentResponse.data || []);
      } catch (error) {
        console.error("Error al obtener los datos del trabajador:", error);
        Alert.alert("Error", "No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, []);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="yellow" />
        <Text className="text-yellow-500 text-center mt-4">Cargando datos...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-1">
        {/* Cabecera del Trabajador */}
        <View className="bg-yellow-500 p-4 rounded mb-6">
          <Text className="text-black text-2xl font-bold">Hola, {workerName}</Text>
          <Text className="text-black">¡Bienvenido a tu panel de trabajo!</Text>
        </View>

        {/* Título de la sección */}
        <Text className="text-white text-xl mb-4">Tus Incidentes Reportados:</Text>

        {/* Lista de Incidentes */}
        <FlatList
          data={incidents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="bg-gray-800 p-4 mb-4 rounded">
              <Text className="text-yellow-500 font-bold text-lg">{item.title}</Text>
              <Text className="text-gray-300">Descripción: {item.description}</Text>
              <Text className="text-yellow-400">
                Fecha: {new Date(item.createdAt).toLocaleString()}
              </Text>
              <Text className="text-gray-400">Ubicación: {item.location}</Text>
              <Pressable
                onPress={() => Alert.alert("Detalles", `Incidente: ${item.title}`)}
                className="mt-4 bg-yellow-500 p-2 rounded"
              >
                <Text className="text-black text-center">Ver Más Detalles</Text>
              </Pressable>
            </View>
          )}
        />

        {/* Si no hay incidentes */}
        {incidents.length === 0 && (
          <Text className="text-white text-center mt-4">
            No has reportado ningún incidente aún.
          </Text>
        )}

        {/* Botón de Ayuda */}
        <Pressable
          onPress={() => {
            Alert.alert(
              "Ayuda",
              "En este panel puedes ver todos los incidentes que has reportado y gestionar tus actividades."
            );
          }}
          className="mt-6 bg-yellow-500 p-4 rounded items-center"
        >
          <Text className="text-black font-bold">Ayuda</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

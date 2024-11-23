import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from "react-native";
import { styled } from "nativewind";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const StyledPressable = styled(Pressable);

export default function HistorialIncidente() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (!token) {
          Alert.alert("Error", "No se encontró un token de usuario. Redirigiendo al login.");
          router.replace("/login");
          return;
        }

        const response = await axios.get("http://192.168.1.150:8089/incident", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIncidents(response.data);
      } catch (error) {
        console.error("Error al obtener los incidentes:", error);
        Alert.alert("Error", "Ocurrió un problema al cargar los incidentes.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const renderIncident = ({ item }) => (
    <View className="bg-white rounded-lg shadow-md p-4 mb-4">
      <Text className="text-lg font-bold text-black">Título: {item.title}</Text>
      <Text className="text-sm text-gray-700">Descripción: {item.description}</Text>
      <Text className="text-sm text-gray-700">Ubicación: {item.location}</Text>
      <Text className="text-sm text-gray-700">Urgencia: {item.urgency.name}</Text>
      <Text className="text-sm text-gray-700">Reportado por: {item.reporter.firstName} {item.reporter.lastName}</Text>
      <Text className="text-sm text-gray-700">Fecha de creación: {new Date(item.createdAt).toLocaleString()}</Text>
      <StyledPressable
        className="bg-yellow-500 rounded mt-4 p-2 items-center"
        onPress={() => router.push(`/admin/incident/${item.id}`)}
      >
        <Text className="text-black font-bold">Más detalles</Text>
      </StyledPressable>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#FFD700" />
        <Text className="text-white mt-4">Cargando incidentes...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-4">
      <Text className="text-2xl font-bold text-white mt-4 mb-2">Historial de Incidentes</Text>
      {incidents.length === 0 ? (
        <Text className="text-white">No hay incidentes disponibles.</Text>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderIncident}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

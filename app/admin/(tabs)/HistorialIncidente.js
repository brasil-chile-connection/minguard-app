import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, TextInput } from "react-native";
import { Screen } from "../../../components/Screen";
import * as SecureStore from "expo-secure-store";
import api from "../../../components/api";

function HistorialIncidente() {
  const [incidentes, setIncidentes] = useState([]);
  const [filteredIncidentes, setFilteredIncidentes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidentes = async () => {
      try {
        const role = await SecureStore.getItemAsync("userRole");
        const userId = await SecureStore.getItemAsync("userId");
        let response;

        if (role === "ADMIN") {
          response = await api.get("/incident");
        } else if (role === "WORKER" && userId) {
          response = await api.get(`/incident/reporter/${userId}`);
        }

        setIncidentes(response.data);
        setFilteredIncidentes(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener incidentes:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchIncidentes();
  }, []);

  useEffect(() => {
    const filtered = incidentes.filter((incidente) =>
      incidente.title.toLowerCase().includes(searchText.toLowerCase()) ||
      incidente.description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredIncidentes(filtered);
  }, [searchText, incidentes]);

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando incidentes...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Text>Error al cargar los incidentes.</Text>
        </View>
      </Screen>
    );
  }

  const IncidenteRow = ({ incidente, index }) => (
    <Pressable
      onPress={() => console.log(`Seleccionado incidente ${incidente.id}`)}
      className={`flex-row p-2 border-b border-gray-300 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
    >
      <Text className="flex-1 text-center">{incidente.id}</Text>
      <Text className="flex-1 text-center">{incidente.title}</Text>
      <Text className="flex-1 text-center">{incidente.status}</Text>
    </Pressable>
  );

  return (
    <Screen>
      <View className="flex-1 p-4 bg-white">
        <TextInput
          placeholder="Buscar por título o descripción..."
          value={searchText}
          onChangeText={setSearchText}
          className="bg-gray-200 p-2 mb-4 rounded"
        />

        <FlatList
          data={filteredIncidentes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => <IncidenteRow incidente={item} index={index} />}
        />
      </View>
    </Screen>
  );
}

export default HistorialIncidente;

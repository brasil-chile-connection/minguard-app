// app/(tabs)/Tickets.js
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, TextInput, Pressable } from "react-native";
import { Screen } from "../../../components/Screen";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import api from "../../../components/api";

export default function Tickets() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const userRole = await SecureStore.getItemAsync("userRole");
        if (userRole) {
          setRole(userRole);
        } else {
          setRole("guest");
          router.replace("/login"); // Redirigir si no hay rol
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        setRole("guest");
        router.replace("/login");
      }
    };

    const fetchTickets = async () => {
      if (role === "guest") return;

      try {
        // Asumiendo que los tickets se obtienen según el rol del usuario
        const endpoint = role === "ADMIN" ? "/ticket/admin" : "/ticket/worker";
        const response = await api.get(endpoint);
        setTickets(response.data);
        setFilteredTickets(response.data);
      } catch (error) {
        console.error("Error al obtener los tickets:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    // Cargar el rol y luego los tickets
    const initialize = async () => {
      await getUserRole();
      await fetchTickets();
    };

    initialize();
  }, [role]);

  useEffect(() => {
    const filtered = tickets.filter((ticket) =>
      ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredTickets(filtered);
  }, [searchText, tickets]);

  if (loading || role === null) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando tickets...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Text>Error al cargar los tickets. Intenta nuevamente.</Text>
        </View>
      </Screen>
    );
  }

  const TicketRow = ({ ticket, index }) => (
    <Pressable
      onPress={() => router.push(`/tickets/${ticket.id}`)}
      className={`flex-row p-2 border-b border-gray-300 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
      accessible={true}
      accessibilityLabel={`Ver detalles del ticket ${ticket.id}`}
    >
      <Text className="flex-1 text-center">{ticket.id}</Text>
      <Text className="flex-1 text-center">{ticket.title}</Text>
      <Text className="flex-1 text-center">{ticket.status}</Text>
    </Pressable>
  );

  return (
    <Screen>
      <View className="flex-1 p-4 bg-white">
        <Text className="text-xl font-bold text-center mb-4">
          {role === "ADMIN" ? "Gestión de Tickets" : "Mis Tickets"}
        </Text>

        <TextInput
          placeholder="Buscar por título o descripción..."
          value={searchText}
          onChangeText={setSearchText}
          className="bg-gray-200 p-2 mb-4 rounded"
          accessible={true}
          accessibilityLabel="Campo de búsqueda"
        />

        <View className="flex-row bg-gray-200 p-2 rounded-t-lg border-b border-gray-300">
          <Text className="flex-1 text-center font-semibold">ID</Text>
          <Text className="flex-1 text-center font-semibold">Título</Text>
          <Text className="flex-1 text-center font-semibold">Estado</Text>
        </View>

        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => <TicketRow ticket={item} index={index} />}
          contentContainerStyle={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        />
      </View>
    </Screen>
  );
}

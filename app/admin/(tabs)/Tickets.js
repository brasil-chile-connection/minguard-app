import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { Screen } from "../../../components/Screen";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import axios from "axios";

export default function Tickets() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");

        if (!token) {
          Alert.alert("Error", "No se encontró el token de usuario.");
          router.replace("/login");
          return;
        }

        const API_URL = "http://192.168.1.150:8089";

        // Determinar rol del usuario
        const userRole = await SecureStore.getItemAsync("userRole");
        setRole(userRole);

        // Obtener tickets según el rol
        const endpoint =
          userRole === "ADMIN" ? `${API_URL}/ticket` : `${API_URL}/ticket/worker`;
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTickets(response.data);
        setFilteredTickets(response.data);
      } catch (error) {
        console.error("Error al obtener los tickets:", error);
        Alert.alert("Error", "No se pudieron cargar los tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    // Filtrar los tickets según el texto de búsqueda
    const filtered = tickets.filter((ticket) =>
      ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredTickets(filtered);
  }, [searchText, tickets]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Cargando tickets...</Text>
        </View>
      </Screen>
    );
  }

  const TicketRow = ({ ticket, index }) => (
    <Pressable
      onPress={() => router.push(`/ticket/${ticket.id}`)}
      style={[
        styles.ticketRow,
        index % 2 === 0 ? styles.ticketRowEven : styles.ticketRowOdd,
      ]}
      accessible={true}
      accessibilityLabel={`Ver detalles del ticket ${ticket.id}`}
    >
      <Text style={styles.ticketText}>{ticket.id}</Text>
      <Text style={styles.ticketText}>{ticket.title}</Text>
      <Text style={styles.ticketText}>{ticket.status}</Text>
    </Pressable>
  );

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>
          {role === "ADMIN" ? "Gestión de Tickets" : "Mis Tickets"}
        </Text>

        <TextInput
          placeholder="Buscar por título o descripción..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          accessible={true}
          accessibilityLabel="Campo de búsqueda"
        />

        <View style={styles.headerRow}>
          <Text style={styles.headerText}>ID</Text>
          <Text style={styles.headerText}>Título</Text>
          <Text style={styles.headerText}>Estado</Text>
        </View>

        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => <TicketRow ticket={item} index={index} />}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#FFD700",
    fontSize: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#333",
    color: "#FFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
  },
  ticketRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  ticketRowEven: {
    backgroundColor: "#222",
  },
  ticketRowOdd: {
    backgroundColor: "#333",
  },
  ticketText: {
    flex: 1,
    color: "#FFF",
    textAlign: "center",
  },
  flatListContent: {
    borderRadius: 8,
  },
});

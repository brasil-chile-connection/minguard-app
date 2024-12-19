import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { format, subDays } from "date-fns";
import { LineChart } from "react-native-chart-kit";

export default function OverviewAdmin() {
  const [incidentsToday, setIncidentsToday] = useState([]);
  const [incidentsWeek, setIncidentsWeek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [refreshing, setRefreshing] = useState(false); 
  const fetchIncidents = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        Alert.alert("Error", "No se encontró el token de usuario.");
        return;
      }

      const API_URL = "http://ec2-44-221-160-148.compute-1.amazonaws.com:8089";

      // Obtener información del administrador
      const userResponse = await axios.get(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminName(
        userResponse.data.firstName + " " + userResponse.data.lastName
      );

      // Obtener todos los incidentes
      const response = await axios.get(`${API_URL}/incident`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const incidents = response.data;

      // Filtrar incidentes de hoy
      const today = format(new Date(), "yyyy-MM-dd");
      const todaysIncidents = incidents.filter((incident) => {
        const incidentDate = format(new Date(incident.createdAt), "yyyy-MM-dd");
        return incidentDate === today;
      });
      setIncidentsToday(todaysIncidents);

      // Obtener incidentes de los últimos 7 días
      const last7DaysIncidents = [];
      for (let i = 6; i >= 0; i--) {
        const date = format(subDays(new Date(), i), "yyyy-MM-dd");
        const incidentsOfDay = incidents.filter((incident) => {
          const incidentDate = format(
            new Date(incident.createdAt),
            "yyyy-MM-dd"
          );
          return incidentDate === date;
        });
        last7DaysIncidents.push({
          date,
          count: incidentsOfDay.length,
        });
      }
      setIncidentsWeek(last7DaysIncidents);
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

    // Configurar el polling para actualizar los incidentes cada 10 segundos
    const intervalId = setInterval(fetchIncidents, 30000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
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
        <Text style={styles.title}>Bienvenido, {adminName}</Text>
        <Pressable onPress={onRefresh} style={styles.refreshButton}>
          {refreshing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          )}
        </Pressable>
      </View>

      <Text style={styles.subtitle}>Incidentes reportados hoy:</Text>

      {incidentsToday.length === 0 ? (
        <Text style={styles.noIncidentsText}>
          No se encontraron incidentes reportados hoy.
        </Text>
      ) : (
        <FlatList
          data={incidentsToday}
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
          style={{ marginBottom: 20 }}
          scrollEnabled={false}
        />
      )}

      <Text style={styles.subtitle}>Incidentes de los últimos 7 días:</Text>

      {incidentsWeek.length === 0 ? (
        <Text style={styles.noIncidentsText}>
          No se encontraron incidentes en la última semana.
        </Text>
      ) : (
        <LineChart
          data={{
            labels: incidentsWeek.map((item) =>
              format(new Date(item.date), "dd/MM")
            ),
            datasets: [
              {
                data: incidentsWeek.map((item) => item.count),
              },
            ],
          }}
          width={Dimensions.get("window").width - 40} // Ancho de la gráfica
          height={220}
          chartConfig={{
            backgroundColor: "#000",
            backgroundGradientFrom: "#000",
            backgroundGradientTo: "#000",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`, // Amarillo
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Blanco
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#FFD700",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
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
    marginBottom: 10,
    marginTop: 20,
  },
  noIncidentsText: {
    color: "#ccc",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
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

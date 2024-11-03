import { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { styled } from "nativewind";
import { Screen } from "../../components/Screen";
import { useRouter } from "expo-router";

const StyledPressable = styled(Pressable);

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Simulación de obtención de datos
        const fetchedTickets = [
          { id: "01", departamento: "Recursos Humanos", trabajador: "Juan Pérez", estado: "Activo" },
          { id: "02", departamento: "Soporte Técnico", trabajador: "María García", estado: "En Proceso" },
          { id: "03", departamento: "Ventas", trabajador: "Carlos Sánchez", estado: "Resuelto" },
        ];
        setTickets(fetchedTickets);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleTicketPress = (id) => {
    router.push(`/tickets/${id}`);
  };

  const TicketCard = ({ ticket }) => (
    <View
      key={ticket.id}
      className="bg-gray-200 p-4 rounded-lg shadow border border-gray-300"
    >
      <View className="flex flex-row justify-between">
        <Text className="text-lg font-semibold">{ticket.id}</Text>
        <Text className="text-sm text-gray-500">{ticket.estado}</Text>
      </View>

      <Text className="text-gray-700 mt-2">Departamento: {ticket.departamento}</Text>
      <Text className="text-gray-700">Trabajador: {ticket.trabajador}</Text>

      <StyledPressable
        onPress={() => handleTicketPress(ticket.id)}
        className="bg-gray-300 mt-4 p-2 rounded"
        accessible={true}
        accessibilityLabel={`Ver detalles del ticket ${ticket.id}`}
      >
        <Text className="text-center text-black">Detalles</Text>
      </StyledPressable>
    </View>
  );

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Text>Cargando tickets...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Text>Error al cargar los tickets.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-1 p-4 bg-white">
        <Text className="text-xl font-bold text-center mb-4">Tickets</Text>

        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TicketCard ticket={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </Screen>
  );
}

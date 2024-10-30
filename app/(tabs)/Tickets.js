import { View, Text, ScrollView, Pressable } from "react-native";
import { styled } from "nativewind";
import { Screen } from "../../components/Screen";

const StyledPressable = styled(Pressable);

export default function Tickets() {
  // Datos de ejemplo para los tickets
  const tickets = [
    { id: "01", departamento: "Recursos Humanos", trabajador: "Juan Pérez" },
    { id: "02", departamento: "Soporte Técnico", trabajador: "María García" },
    { id: "03", departamento: "Ventas", trabajador: "Carlos Sánchez" },
  ];

  return (
    <Screen>
      <View className="flex-1 p-4 bg-white">
        <Text className="text-xl font-bold text-center mb-4">Tickets</Text>

        <ScrollView className="space-y-4">
          {tickets.map((ticket) => (
            <View
              key={ticket.id}
              className="bg-gray-200 p-4 rounded-lg shadow border border-gray-300"
            >
              <View className="flex flex-row justify-between">
                <Text className="text-lg font-semibold">{ticket.id}</Text>
                <Text className="text-sm text-gray-500">Activo</Text>
              </View>

              <Text className="text-gray-700 mt-2">Departamento: {ticket.departamento}</Text>
              <Text className="text-gray-700">Trabajador: {ticket.trabajador}</Text>

              <StyledPressable className="bg-gray-300 mt-4 p-2 rounded">
                <Text className="text-center text-black">Detalles</Text>
              </StyledPressable>
            </View>
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}

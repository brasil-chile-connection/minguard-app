import { View, Text, ScrollView } from "react-native";
import { styled } from "nativewind";
import { Screen } from "../../components/Screen";

export default function HistorialIncidentes() {
  // Datos de ejemplo para la tabla
  const incidentes = [
    { id: "01", trabajador: "Juan Pérez", departamento: "Recursos Humanos", estado: "Resuelto" },
    { id: "02", trabajador: "María García", departamento: "Soporte Técnico", estado: "Pendiente" },
    { id: "03", trabajador: "Carlos Sánchez", departamento: "Ventas", estado: "En Proceso" },
  ];

  return (
    <Screen>
      <View className="flex-1 p-4 bg-white">
        <Text className="text-xl font-bold text-center mb-4">Historial de Incidentes</Text>

        {/* Encabezados de la Tabla */}
        <View className="flex-row bg-gray-200 p-2 rounded-t-lg border-b border-gray-300">
          <Text className="flex-1 text-center font-semibold">ID</Text>
          <Text className="flex-1 text-center font-semibold">Trabajador</Text>
          <Text className="flex-1 text-center font-semibold">Departamento</Text>
          <Text className="flex-1 text-center font-semibold">Estado</Text>
        </View>

        {/* Filas de la Tabla */}
        <ScrollView className="border border-gray-300 rounded-b-lg">
          {incidentes.map((incidente) => (
            <View
              key={incidente.id}
              className="flex-row p-2 border-b border-gray-300"
            >
              <Text className="flex-1 text-center">{incidente.id}</Text>
              <Text className="flex-1 text-center">{incidente.trabajador}</Text>
              <Text className="flex-1 text-center">{incidente.departamento}</Text>
              <Text className="flex-1 text-center">{incidente.estado}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}

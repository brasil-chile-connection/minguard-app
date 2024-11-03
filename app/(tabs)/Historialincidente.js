import { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, TextInput } from "react-native";
import { styled } from "nativewind";
import { Screen } from "../../components/Screen";
import { useRouter } from "expo-router";

export default function HistorialIncidentes() {
  const [incidentes, setIncidentes] = useState([]);
  const [filteredIncidentes, setFilteredIncidentes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchIncidentes = async () => {
      try {
        // Simulación de obtención de datos
        const data = [
          { id: "01", trabajador: "Juan Pérez", departamento: "Recursos Humanos", estado: "Resuelto" },
          { id: "02", trabajador: "María García", departamento: "Soporte Técnico", estado: "Pendiente" },
          { id: "03", trabajador: "Carlos Sánchez", departamento: "Ventas", estado: "En Proceso" },
          // ... más datos
        ];
        setIncidentes(data);
        setFilteredIncidentes(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchIncidentes();
  }, []);

  useEffect(() => {
    const filtered = incidentes.filter((incidente) =>
      incidente.trabajador.toLowerCase().includes(searchText.toLowerCase()) ||
      incidente.departamento.toLowerCase().includes(searchText.toLowerCase())
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
      onPress={() => router.push(`/incidentes/${incidente.id}`)}
      className={`flex-row p-2 border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
      accessible={true}
      accessibilityLabel={`Ver detalles del incidente ${incidente.id}`}
    >
      <Text className="flex-1 text-center">{incidente.id}</Text>
      <Text className="flex-1 text-center">{incidente.trabajador}</Text>
      <Text className="flex-1 text-center">{incidente.departamento}</Text>
      <Text className="flex-1 text-center">{incidente.estado}</Text>
    </Pressable>
  );

  return (
    <Screen>
      <View className="flex-1 p-4 bg-white">
        <Text
          className="text-xl font-bold text-center mb-4"
          accessible={true}
          accessibilityRole="header"
        >
          Historial de Incidentes
        </Text>

        {/* Barra de Búsqueda */}
        <TextInput
          placeholder="Buscar por trabajador o departamento..."
          value={searchText}
          onChangeText={setSearchText}
          className="bg-gray-200 p-2 mb-4 rounded"
          accessible={true}
          accessibilityLabel="Campo de búsqueda"
        />

        {/* Encabezados de la Tabla */}
        <View className="flex-row bg-gray-200 p-2 rounded-t-lg border-b border-gray-300">
          <Text className="flex-1 text-center font-semibold">ID</Text>
          <Text className="flex-1 text-center font-semibold">Trabajador</Text>
          <Text className="flex-1 text-center font-semibold">Departamento</Text>
          <Text className="flex-1 text-center font-semibold">Estado</Text>
        </View>

        {/* Filas de la Tabla */}
        <FlatList
          data={filteredIncidentes}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <IncidenteRow incidente={item} index={index} />}
          contentContainerStyle={{ borderWidth: 1, borderColor: '#D1D5DB', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
        />
      </View>
    </Screen>
  );
}

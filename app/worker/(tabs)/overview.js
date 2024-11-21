import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import { styled } from "nativewind";
import { Screen } from "../../../components/Screen";
import { LineChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";

export default function Overview() {
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API para obtener información del usuario
        const userResponse = await fetch("https://jsonplaceholder.typicode.com/users/3");
        const userData = await userResponse.json();
        setUserInfo({
          nombre: userData.name,
          lastLogin: new Date().toISOString(), // Simulamos una fecha de último acceso
        });

        // API para obtener datos estadísticos (usamos dummyjson como ejemplo)
        const statsResponse = await fetch("https://dummyjson.com/products");
        const statsData = await statsResponse.json();

        // Transformamos los datos de productos para crear datos de ejemplo para el gráfico
        const labels = statsData.products.slice(0, 1).map(product => product.title); // Nombres de productos
        const values = statsData.products.slice(0, 5).map(product => product.price); // Precios de productos

        setStats({ labels, values });
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando información...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Text>Error al cargar los datos.</Text>
        </View>
      </Screen>
    );
  }

  // Configuración de datos para el gráfico de líneas
  const chartData = {
    labels: stats.labels, // Etiquetas para el gráfico (títulos de productos)
    datasets: [
      {
        data: stats.values, // Valores para el gráfico (precios de productos)
      },
    ],
  };

  return (
    <Screen>
      <ScrollView className="flex-1 p-4 bg-gray-100">
        <Text
          className="text-2xl font-bold mb-4"
          accessible={true}
          accessibilityRole="header"
        >
          Resumen General
        </Text>

        {/* Sección de Información */}
        <View className="bg-white p-4 rounded-lg shadow mb-4">
          <Text className="text-lg font-semibold">
            Bienvenido, {userInfo.nombre}
          </Text>
          <Text className="text-gray-700 mt-2">
            Último acceso:{" "}
            {new Date(userInfo.lastLogin).toLocaleString("es-ES")}
          </Text>
        </View>

        {/* Sección de Estadísticas */}
        <View className="bg-white p-4 rounded-lg shadow mb-4">
          <Text className="text-lg font-semibold">Estadísticas</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 32} // Ancho del gráfico
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Botón para ver más detalles */}
        <Pressable
          onPress={() => router.push("/details")}
          className="bg-blue-500 p-4 rounded items-center mt-4"
          accessible={true}
          accessibilityLabel="Ver detalles"
        >
          <Text className="text-white font-bold">Ver Detalles</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

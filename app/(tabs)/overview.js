import { View, Text, ScrollView, Button } from "react-native";
import { styled } from "nativewind";
import { Screen } from "../../components/Screen";

export default function Overview() {
  return (
    <Screen>
      <ScrollView className="flex-1 p-4 bg-gray-100">
        <Text className="text-2xl font-bold mb-4">Resumen General</Text>
        
        {/* Sección de Información */}
        <View className="bg-white p-4 rounded-lg shadow mb-4">
          <Text className="text-lg font-semibold">Información General</Text>
          <Text className="text-gray-700 mt-2">
            Aquí se puede mostrar información general sobre la aplicación o el usuario.
          </Text>
        </View>
        
        {/* Sección de Estadísticas */}
        <View className="bg-white p-4 rounded-lg shadow mb-4">
          <Text className="text-lg font-semibold">Estadísticas</Text>
          <Text className="text-gray-700 mt-2">
            Puedes colocar estadísticas o gráficos aquí.
          </Text>
        </View>
        
       
        
      </ScrollView>
    </Screen>
  );
}

import { View, Text, TextInput, Pressable, Modal, FlatList, Alert, Image } from "react-native";
import { useState } from "react";
import { styled } from "nativewind";
import { Screen } from "../../components/Screen";

const StyledPressable = styled(Pressable);

export default function ReportarIncidente() {
  const [urgencia, setUrgencia] = useState("Baja");
  const [imagen, setImagen] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const urgencias = ["Baja", "Media", "Alta"];

  const handleImageUpload = () => {
    Alert.alert("Funcionalidad de carga de imagen aún no implementada.");
  };

  return (
    <Screen>
      <View className="flex-1 p-4 bg-gray-100">
        <Text className="text-xl font-bold mb-4">REPORTE INCIDENTE</Text>

        {/* Campo de Título */}
        <Text className="text-gray-700 mb-2">Título</Text>
        <TextInput
          placeholder="Ingrese el título del incidente"
          className="bg-gray-200 p-4 mb-4 rounded"
        />

        {/* Campo de Descripción */}
        <Text className="text-gray-700 mb-2">Descripción</Text>
        <TextInput
          placeholder="Describa el incidente"
          multiline
          className="bg-gray-200 p-4 mb-4 rounded"
        />

        {/* Inserta Imagen */}
        <Text className="text-gray-700 mb-2">Insertar Imagen</Text>
        <StyledPressable onPress={handleImageUpload} className="bg-gray-200 p-4 mb-4 rounded items-center">
          <Image
            source={imagen ? { uri: imagen } : require("../../assets/favicon.png")}
            style={{ width: 50, height: 50 }}
          />
        </StyledPressable>

        {/* Nivel de Urgencia */}
        <Text className="text-gray-700 mb-2">Nivel de Urgencia</Text>
        <StyledPressable onPress={() => setModalVisible(true)} className="bg-gray-200 p-4 mb-4 rounded">
          <Text className="text-center">{urgencia}</Text>
        </StyledPressable>

        {/* Modal para Selección de Urgencia */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-3/4 p-4 rounded-lg">
              <Text className="text-lg font-bold mb-4 text-center">Seleccionar Urgencia</Text>
              <FlatList
                data={urgencias}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setUrgencia(item);
                      setModalVisible(false);
                    }}
                    className="p-4 border-b border-gray-200"
                  >
                    <Text className="text-center">{item}</Text>
                  </Pressable>
                )}
              />
              <Pressable onPress={() => setModalVisible(false)} className="mt-4 p-2 bg-gray-300 rounded-lg">
                <Text className="text-center">Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Botón de Enviar */}
        <StyledPressable className="bg-yellow-500 p-4 rounded items-center mt-4 active:bg-yellow-600">
          <Text className="text-black font-bold">Enviar Reporte</Text>
        </StyledPressable>
      </View>
    </Screen>
  );
}

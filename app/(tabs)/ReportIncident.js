import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  FlatList,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { styled } from 'nativewind';
import { Screen } from '../../components/Screen';
import * as ImagePicker from 'expo-image-picker';

const StyledPressable = styled(Pressable);

export default function ReportarIncidente() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [urgencia, setUrgencia] = useState('Baja');
  const [imagen, setImagen] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const urgencias = ['Baja', 'Media', 'Alta'];

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requieren permisos para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImagen(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!titulo || !descripcion) {
      setErrorMessage('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      // Simulación de envío de datos
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert('Reporte enviado', 'Tu reporte ha sido enviado exitosamente.');
      // Limpiar campos
      setTitulo('');
      setDescripcion('');
      setUrgencia('Baja');
      setImagen(null);
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al enviar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 p-4 bg-gray-100">
              <Text className="text-xl font-bold mb-4">REPORTE INCIDENTE</Text>

              {/* Campo de Título */}
              <Text className="text-gray-700 mb-2">Título</Text>
              <TextInput
                placeholder="Ingrese el título del incidente"
                className="bg-gray-200 p-4 mb-4 rounded"
                value={titulo}
                onChangeText={setTitulo}
              />

              {/* Campo de Descripción */}
              <Text className="text-gray-700 mb-2">Descripción</Text>
              <TextInput
                placeholder="Describa el incidente"
                multiline
                className="bg-gray-200 p-4 mb-4 rounded"
                value={descripcion}
                onChangeText={setDescripcion}
              />

              {/* Mostrar mensaje de error */}
              {errorMessage !== '' && (
                <Text className="text-red-500 mb-4">{errorMessage}</Text>
              )}

              {/* Insertar Imagen */}
              <Text className="text-gray-700 mb-2">Insertar Imagen</Text>
              <StyledPressable
                onPress={handleImageUpload}
                className="bg-gray-200 p-4 mb-4 rounded items-center"
                accessible={true}
                accessibilityLabel="Cargar imagen del incidente"
              >
                <Image
                  source={imagen ? { uri: imagen } : require('../../assets/favicon.png')}
                  style={{ width: 100, height: 100 }}
                  className="mb-4"
                />
                <Text>Seleccionar Imagen</Text>
              </StyledPressable>

              {/* Nivel de Urgencia */}
              <Text className="text-gray-700 mb-2">Nivel de Urgencia</Text>
              <StyledPressable
                onPress={() => setModalVisible(true)}
                className="bg-gray-200 p-4 mb-4 rounded"
                accessible={true}
                accessibilityLabel="Seleccionar nivel de urgencia"
              >
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
                    <Text className="text-lg font-bold mb-4 text-center">
                      Seleccionar Urgencia
                    </Text>
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
                          accessible={true}
                          accessibilityLabel={`Seleccionar urgencia ${item}`}
                        >
                          <Text className="text-center">{item}</Text>
                        </Pressable>
                      )}
                    />
                    <Pressable
                      onPress={() => setModalVisible(false)}
                      className="mt-4 p-2 bg-gray-300 rounded-lg"
                      accessible={true}
                      accessibilityLabel="Cancelar selección de urgencia"
                    >
                      <Text className="text-center">Cancelar</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

              {/* Botón de Enviar */}
              <StyledPressable
                onPress={handleSubmit}
                disabled={loading}
                className={`bg-yellow-500 p-4 rounded items-center mt-4 active:bg-yellow-600 ${
                  loading ? 'opacity-50' : ''
                }`}
                accessible={true}
                accessibilityLabel="Enviar reporte de incidente"
              >
                <Text className="text-black font-bold">
                  {loading ? 'Enviando...' : 'Enviar Reporte'}
                </Text>
              </StyledPressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
}

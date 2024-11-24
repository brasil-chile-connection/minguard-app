import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";

export default function ReportIncident() {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [urgencyId, setUrgencyId] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleImagePick = async () => {
    try {
      // Solicitar permisos para acceder a la galería
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permiso denegado", "Se requiere acceso a la galería.");
        return;
      }

      // Abrir el selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1, // Calidad máxima
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]); // Guardar la imagen seleccionada
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  const handleGetLocation = async () => {
    setGettingLocation(true);
    try {
      // Solicitar permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se requiere permiso para acceder a la ubicación."
        );
        setGettingLocation(false);
        return;
      }

      // Obtener la ubicación actual
      let currentLocation = await Location.getCurrentPositionAsync({});
      if (currentLocation) {
        const { latitude, longitude } = currentLocation.coords;
        // Puedes formatear la ubicación como desees. Por ejemplo:
        const locationString = `Latitud: ${latitude}, Longitud: ${longitude}`;
        setLocation(locationString);
      } else {
        Alert.alert("Error", "No se pudo obtener la ubicación.");
      }
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      Alert.alert("Error", "No se pudo obtener la ubicación.");
    } finally {
      setGettingLocation(false);
    }
  };

  const handleReport = async () => {
    if (!description || !title || !location || !urgencyId) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    const urgencyNumber = Number(urgencyId);
    if (isNaN(urgencyNumber) || urgencyNumber < 1 || urgencyNumber > 3) {
      Alert.alert("Error", "La urgencia debe ser un valor entre 1 y 3.");
      return;
    }

    if (!image) {
      Alert.alert("Error", "Por favor selecciona una imagen.");
      return;
    }

    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        Alert.alert("Error", "No se encontró el token de usuario.");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      // Convertir los datos del incidente a una cadena JSON
      const requestJson = JSON.stringify({
        description,
        title,
        location,
        urgencyId: urgencyNumber,
      });

      // Escribir el JSON en un archivo temporal
      const requestFileUri = FileSystem.cacheDirectory + "request.json";
      await FileSystem.writeAsStringAsync(requestFileUri, requestJson, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Agregar el archivo 'request.json' al FormData
      formData.append("request", {
        uri: requestFileUri,
        name: "request.json",
        type: "application/json",
      });

      // Ajustar la URI de la imagen en Android
      let imageUri = image.uri;
      if (Platform.OS === "android") {
        if (!imageUri.startsWith("file://")) {
          imageUri = "file://" + imageUri;
        }
      }

      // Agregar la imagen al FormData
      formData.append("image", {
        uri: imageUri,
        name: "incident_image.jpg", // Puedes ajustar el nombre y extensión
        type: "image/jpeg", // Ajusta el tipo MIME si es necesario
      });

      // Enviar la solicitud al backend usando fetch
      const response = await fetch(
        "http://192.168.1.150:8089/incident/register",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // No establecer 'Content-Type'; fetch lo maneja automáticamente
          },
          body: formData,
        }
      );

      if (response.ok) {
        Alert.alert("Éxito", "Incidente reportado correctamente.");
        // Reiniciar los campos
        setDescription("");
        setTitle("");
        setLocation("");
        setUrgencyId("");
        setImage(null);

        // Eliminar el archivo temporal
        await FileSystem.deleteAsync(requestFileUri);
      } else {
        const errorText = await response.text();
        Alert.alert("Error", `No se pudo reportar el incidente: ${errorText}`);

        // Eliminar el archivo temporal en caso de error
        await FileSystem.deleteAsync(requestFileUri);
      }
    } catch (error) {
      console.error("Error al reportar el incidente:", error);
      Alert.alert("Error", "No se pudo reportar el incidente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, padding: 20, backgroundColor: "#000" }}>
        <Text style={{ color: "#fff", fontSize: 24, marginBottom: 20 }}>
          Reportar Incidente
        </Text>
        <TextInput
          placeholder="Título"
          placeholderTextColor="#ccc"
          style={{
            backgroundColor: "#fff",
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Descripción"
          placeholderTextColor="#ccc"
          style={{
            backgroundColor: "#fff",
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}
          value={description}
          onChangeText={setDescription}
        />
        {/* Campo de ubicación con botón para obtener ubicación automáticamente */}
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TextInput
            placeholder="Ubicación"
            placeholderTextColor="#ccc"
            style={{
              backgroundColor: "#fff",
              padding: 10,
              flex: 1,
              borderRadius: 5,
            }}
            value={location}
            onChangeText={setLocation}
          />
          <Pressable
            onPress={handleGetLocation}
            style={{
              backgroundColor: "#444",
              padding: 10,
              marginLeft: 10,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {gettingLocation ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff" }}>Ubicación</Text>
            )}
          </Pressable>
        </View>
        <TextInput
          placeholder="Urgencia (1-3)"
          placeholderTextColor="#ccc"
          style={{
            backgroundColor: "#fff",
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}
          value={urgencyId}
          onChangeText={setUrgencyId}
          keyboardType="numeric"
        />
        <Pressable
          onPress={handleImagePick}
          style={{
            backgroundColor: "#444",
            padding: 10,
            marginBottom: 20,
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>
            {image ? "Imagen Seleccionada" : "Seleccionar Imagen"}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleReport}
          style={{
            backgroundColor: "yellow",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={{ color: "#000", fontWeight: "bold" }}>
              Enviar Reporte
            </Text>
          )}
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import api from "../../../components/api";

export default function ReportIncident() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("1"); // Default urgency ID
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");

  // Function to pick an image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Function to get the current location
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "No se pudo acceder a la ubicación.");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(
      `Lat: ${currentLocation.coords.latitude}, Long: ${currentLocation.coords.longitude}`
    );
  };

  // Function to submit the incident
  const submitIncident = async () => {
    if (!title || !description || !location) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    const formData = new FormData();

    formData.append("request", JSON.stringify({
      title,
      description,
      location,
      urgencyId: parseInt(urgency),
    }));

    if (image) {
      formData.append("images", {
        uri: image.uri,
        type: image.type || "image/jpeg",
        name: "incident-image.jpg",
      });
    }

    try {
      const response = await api.post("/incident/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Éxito", "Incidente registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar el incidente:", error.response?.data || error);
      Alert.alert("Error", "Hubo un problema al registrar el incidente.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reporte Incidente</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingrese el título del incidente"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Describa el incidente"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>
            {image ? "Imagen seleccionada" : "Insertar Imagen"}
          </Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image.uri }} style={styles.image} />}

        <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
          <Text style={styles.buttonText}>Obtener Ubicación</Text>
        </TouchableOpacity>

        <Text style={styles.location}>{location || "Ubicación no disponible"}</Text>

        <TouchableOpacity style={styles.submitButton} onPress={submitIncident}>
          <Text style={styles.submitButtonText}>Enviar Reporte</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  location: {
    marginBottom: 15,
    textAlign: "center",
    color: "#6c757d",
  },
  submitButton: {
    backgroundColor: "#ffc107",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

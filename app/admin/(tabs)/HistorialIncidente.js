import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Image, 
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Screen } from "../../../components/Screen";
import { useRouter } from "expo-router";

export default function HistorialIncidenteAdmin() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [urgencyId, setUrgencyId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const API_URL = "http://192.168.1.144:8089";

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        Alert.alert("Error", "No se encontró un token de usuario.");
        router.replace("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/incident`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncidents(response.data);
    } catch (error) {
      console.error("Error al obtener los incidentes:", error);
      Alert.alert("Error", "No se pudieron obtener los incidentes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();

    // Configurar el polling para actualizar los incidentes cada 10 segundos
    const intervalId = setInterval(fetchIncidents, 10000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);



  const onRefresh = () => {
    fetchIncidents();
  };

  const handleEdit = (incident) => {
    setSelectedIncident(incident);
    setTitle(incident.title);
    setDescription(incident.description);
    setLocation(incident.location);
    setUrgencyId(incident.urgencyId?.toString() || "");
    setModalVisible(true);
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este incidente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              const token = await SecureStore.getItemAsync("userToken");
              if (!token) {
                Alert.alert(
                  "Error",
                  "No se encontró un token de usuario. Redirigiendo al login."
                );
                router.replace("/login");
                return;
              }

              await axios.delete(`${API_URL}/incident/${selectedIncident.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              // Eliminar el incidente de la lista local
              setIncidents((prevIncidents) =>
                prevIncidents.filter(
                  (incident) => incident.id !== selectedIncident.id
                )
              );

              Alert.alert("Éxito", "Incidente eliminado correctamente.");
              setModalVisible(false);
            } catch (error) {
              console.error("Error al eliminar el incidente:", error);
              Alert.alert(
                "Error",
                "Ocurrió un problema al eliminar el incidente."
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const saveEdit = async () => {
    if (!title || !description || !location || !urgencyId) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    const urgencyNumber = Number(urgencyId);
    if (isNaN(urgencyNumber) || urgencyNumber < 1 || urgencyNumber > 3) {
      Alert.alert("Error", "La urgencia debe ser un valor entre 1 y 3.");
      return;
    }

    setSaving(true);

    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        Alert.alert("Error", "No se encontró el token de usuario.");
        setSaving(false);
        return;
      }

      // Enviar la solicitud al backend usando axios
      await axios.put(
        `${API_URL}/incident/${selectedIncident.id}`,
        {
          title,
          description,
          location,
          urgencyId: urgencyNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Éxito", "Incidente actualizado correctamente.");
      setModalVisible(false);
      fetchIncidents();
    } catch (error) {
      console.error("Error al actualizar el incidente:", error);
      Alert.alert("Error", "No se pudo actualizar el incidente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#FFD700" />
      </Screen>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Screen>
        {/* Header con el botón de Actualizar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historial de Incidentes</Text>
          <Pressable onPress={onRefresh} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          </Pressable>
        </View>

        <FlatList
          data={incidents}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable
                onPress={() => handleEdit(item)}
                style={styles.cardContent}
              >
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>

                {/* Mostrar imágenes del incidente */}
                {item.images && item.images.length > 0 && (
                  <FlatList
                    data={item.images}
                    keyExtractor={(imageUri, index) => index.toString()}
                    horizontal
                    renderItem={({ item: imageUri }) => (
                      <Image source={{ uri: imageUri }} style={styles.image} />
                    )}
                    style={{ marginBottom: 12 }}
                  />
                )}

                <View style={styles.cardInfo}>
                  <Text style={styles.cardLabel}>Ubicación:</Text>
                  <Text style={styles.cardText}>{item.location}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardLabel}>Urgencia:</Text>
                  <Text style={styles.cardText}>
                    {item.urgency ? item.urgency.name : "No especificada"}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardLabel}>Reportado por:</Text>
                  <Text style={styles.cardText}>
                    {item.reporter.firstName} {item.reporter.lastName}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardLabel}>Fecha:</Text>
                  <Text style={styles.cardText}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        />

        {/* Modal para Editar Incidente */}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Incidente</Text>
              <TextInput
                placeholder="Título"
                placeholderTextColor="#ccc"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <TextInput
                placeholder="Descripción"
                placeholderTextColor="#ccc"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                multiline
              />
              <TextInput
                placeholder="Ubicación"
                placeholderTextColor="#ccc"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
              />
              <TextInput
                placeholder="Urgencia (1-3)"
                placeholderTextColor="#ccc"
                value={urgencyId}
                onChangeText={setUrgencyId}
                keyboardType="numeric"
                style={styles.input}
              />

              {/* Mostrar imágenes existentes, si las hay */}
              {selectedIncident?.images &&
                selectedIncident.images.length > 0 && (
                  <FlatList
                    data={selectedIncident.images}
                    keyExtractor={(imageUri, index) => index.toString()}
                    horizontal
                    renderItem={({ item: imageUri }) => (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.modalImage}
                      />
                    )}
                    style={{ marginBottom: 12 }}
                  />
                )}

              {/* Botones de Acción */}
              <View style={styles.buttonContainer}>
                <Pressable onPress={saveEdit} style={styles.saveButton}>
                  {saving ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={handleDelete} style={styles.deleteButton}>
                  {deleting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </Screen>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
  },
  refreshButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: "#333", // Fondo negro
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    color: "#FFD700", // Texto amarillo
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
  },
  cardDescription: {
    color: "#fff", // Texto blanco
    fontSize: 16,
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: "row",
    marginBottom: 4,
  },
  cardLabel: {
    color: "#FFD700", // Etiquetas en amarillo
    fontWeight: "bold",
    marginRight: 4,
  },
  cardText: {
    color: "#fff", // Texto blanco
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: "#000", // Fondo negro
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    color: "#FFD700", // Texto amarillo
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#333", // Fondo gris oscuro
    marginBottom: 12,
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    color: "#fff", // Texto blanco
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#FFD700", // Botón amarillo
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  saveButtonText: {
    color: "#000", // Texto negro
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#888", // Botón gris
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  cancelButtonText: {
    color: "#fff", // Texto blanco
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF4C4C", // Botón rojo
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  deleteButtonText: {
    color: "#fff", // Texto blanco
    fontSize: 16,
    fontWeight: "bold",
  },
});

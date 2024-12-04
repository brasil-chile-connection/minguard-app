import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Screen } from "../../../components/Screen";

export default function Tickets() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    location: "",
    urgencyId: "",
    incidentId: "",
    responsibleId: "",
    statusId: "",
  });
  const [statuses, setStatuses] = useState([]);
  const [creating, setCreating] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const API_URL = "http://192.168.1.150:8089";

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const response = await axios.get(`${API_URL}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatuses(response.data);

        // Asignar el primer estado como predeterminado al cargar los estados
        if (response.data.length > 0) {
          setNewTicket((prevTicket) => ({
            ...prevTicket,
            statusId: response.data[0].id,
          }));
        }
      } catch (error) {
        console.error("Error al obtener los estados:", error);
      }
    };

    fetchStatuses();
  }, []);

  const handleCreateTicket = async () => {
    const {
      title,
      description,
      location,
      urgencyId,
      incidentId,
      responsibleId,
      statusId,
    } = newTicket;

    if (
      !title ||
      !description ||
      !location ||
      !urgencyId ||
      !incidentId ||
      !responsibleId ||
      !statusId
    ) {
      Alert.alert(
        "Error",
        "Por favor completa todos los campos, incluyendo el estado del ticket."
      );
      return;
    }

    setCreating(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await axios.post(
        `${API_URL}/ticket`,
        {
          description,
          title,
          location,
          urgencyId: parseInt(urgencyId, 10),
          incidentId: parseInt(incidentId, 10),
          responsibleId: parseInt(responsibleId, 10),
          statusId: parseInt(statusId, 10),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const createdTicketId = response.data.id; // Obtenemos el ID del ticket creado
        Alert.alert("Éxito", "El ticket fue creado correctamente.");
        setModalVisible(false);
        resetForm();
        fetchTicketDetails(createdTicketId); // Obtenemos los detalles del ticket
      } else {
        Alert.alert("Error", "No se pudo crear el ticket.");
      }
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      Alert.alert("Error", "Ocurrió un problema al crear el ticket.");
    } finally {
      setCreating(false);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await axios.get(`${API_URL}/ticket/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setTicketDetails(response.data);
        setShowTicketModal(true); // Mostramos el modal con los detalles del ticket
      } else {
        Alert.alert(
          "Error",
          "No se pudieron obtener los detalles del ticket."
        );
      }
    } catch (error) {
      console.error("Error al obtener los detalles del ticket:", error);
      Alert.alert(
        "Error",
        "Ocurrió un problema al obtener los detalles del ticket."
      );
    }
  };

  const resetForm = () => {
    setNewTicket({
      title: "",
      description: "",
      location: "",
      urgencyId: "",
      incidentId: "",
      responsibleId: "",
      statusId: statuses.length > 0 ? statuses[0].id : "",
    });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Pressable
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>Crear Nuevo Ticket</Text>
        </Pressable>

        {/* Modal para crear un nuevo ticket */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContainer}
              >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                  <Text style={styles.modalTitle}>Crear Nuevo Ticket</Text>

                  <TextInput
                    placeholder="Título"
                    placeholderTextColor="#AAA"
                    value={newTicket.title}
                    onChangeText={(text) =>
                      setNewTicket({ ...newTicket, title: text })
                    }
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Descripción"
                    placeholderTextColor="#AAA"
                    value={newTicket.description}
                    onChangeText={(text) =>
                      setNewTicket({ ...newTicket, description: text })
                    }
                    multiline
                    style={[styles.input, styles.textArea]}
                  />
                  <TextInput
                    placeholder="Ubicación"
                    placeholderTextColor="#AAA"
                    value={newTicket.location}
                    onChangeText={(text) =>
                      setNewTicket({ ...newTicket, location: text })
                    }
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Urgencia (ID)"
                    placeholderTextColor="#AAA"
                    value={newTicket.urgencyId}
                    onChangeText={(text) =>
                      setNewTicket({ ...newTicket, urgencyId: text })
                    }
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="ID del incidente"
                    placeholderTextColor="#AAA"
                    value={newTicket.incidentId}
                    onChangeText={(text) =>
                      setNewTicket({ ...newTicket, incidentId: text })
                    }
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="ID del responsable"
                    placeholderTextColor="#AAA"
                    value={newTicket.responsibleId}
                    onChangeText={(text) =>
                      setNewTicket({ ...newTicket, responsibleId: text })
                    }
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <Text style={styles.label}>Estado:</Text>
                  <Picker
                    selectedValue={newTicket.statusId}
                    onValueChange={(value) =>
                      setNewTicket({ ...newTicket, statusId: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecciona un estado" value="" />
                    {statuses.map((status) => (
                      <Picker.Item
                        key={status.id}
                        label={status.name}
                        value={status.id}
                      />
                    ))}
                  </Picker>

                  <Pressable
                    style={styles.saveButton}
                    onPress={handleCreateTicket}
                    disabled={creating}
                  >
                    <Text style={styles.saveButtonText}>
                      {creating ? "Guardando..." : "Guardar"}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </Pressable>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Modal para mostrar detalles del ticket */}
        <Modal
          visible={showTicketModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.ticketModalContainer}>
                <Text style={styles.modalTitle}>Detalles del Ticket</Text>
                {ticketDetails ? (
                  <>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Título:</Text>{" "}
                      {ticketDetails.title}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Descripción:</Text>{" "}
                      {ticketDetails.description}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Ubicación:</Text>{" "}
                      {ticketDetails.location}
                    </Text>
                    {/* ... otros detalles ... */}

                    {/* Mostrar historial del ticket */}
                    <Text style={styles.historyTitle}>Historial:</Text>
                    {ticketDetails.history && ticketDetails.history.length > 0 ? (
                      ticketDetails.history.map((event, index) => (
                        <View key={index} style={styles.historyItem}>
                          <Text style={styles.historyDate}>
                            <Text style={styles.detailLabel}>Fecha:</Text>{" "}
                            {new Date(event.date).toLocaleString()}
                          </Text>
                          <Text style={styles.historyStatus}>
                            <Text style={styles.detailLabel}>Estado:</Text>{" "}
                            {event.status}
                          </Text>
                          <Text style={styles.historyComments}>
                            <Text style={styles.detailLabel}>Comentarios:</Text>{" "}
                            {event.comments}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.detailText}>
                        No hay historial disponible.
                      </Text>
                    )}
                  </>
                ) : (
                  <Text style={styles.detailText}>Cargando detalles...</Text>
                )}
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setShowTicketModal(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  createButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  createButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 10,
    elevation: 5,
  },
  scrollViewContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#FFF",
  },
  input: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: "#FFF",
  },
  textArea: {
    height: 100,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginVertical: 10,
  },
  picker: {
    height: 50,
    backgroundColor: "#333",
    color: "#FFF",
    borderRadius: 8,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#888",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  ticketModalContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  detailText: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 20,
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyDate: {
    fontSize: 14,
    color: "#FFF",
  },
  historyStatus: {
    fontSize: 14,
    color: "#FFF",
  },
  historyComments: {
    fontSize: 14,
    color: "#FFF",
  },
});

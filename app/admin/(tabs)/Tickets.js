import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import { Screen } from "../../../components/Screen";
import * as Clipboard from "expo-clipboard";

export default function Tickets() {
  const API_URL = "http://ec2-44-221-160-148.compute-1.amazonaws.com:8089";
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchAllData = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      const [incidentRes, statusRes, ticketsRes] = await Promise.all([
        fetch(`${API_URL}/incident`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/status`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/ticket`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setIncidents(await incidentRes.json());
      setStatuses(await statusRes.json());
      setTickets(await ticketsRes.json());
    } catch (error) {
      console.error("Error al obtener datos:", error);
      Alert.alert("Error", "No se pudieron cargar los datos.");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateTicket = async () => {
    if (!selectedIncident) {
      Alert.alert("Error", "Por favor selecciona un incidente.");
      return;
    }

    setCreating(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const incidentDetails = incidents.find((i) => String(i.id) === String(selectedIncident));

      if (!incidentDetails) {
        Alert.alert("Error", "No se pudo encontrar el incidente seleccionado.");
        return;
      }

      // Generar un UUID en el frontend (opcional)
      const ticketUUID = uuid.v4();

      const ticketRequest = {
        title: incidentDetails.title,
        description: incidentDetails.description,
        location: incidentDetails.location,
        urgencyId: incidentDetails.urgency?.id || 1,
        incidentId: incidentDetails.id,
        responsibleId: incidentDetails.reporter?.id || 1,
        statusId: statuses[0]?.id || 1,
        identifier: ticketUUID,
      };

      const requestFileUri = FileSystem.cacheDirectory + "request.json";
      await FileSystem.writeAsStringAsync(requestFileUri, JSON.stringify(ticketRequest), {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const formData = new FormData();
      formData.append("request", {
        uri: requestFileUri,
        name: "request.json",
        type: "application/json",
      });

      const response = await fetch(`${API_URL}/ticket`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const createdTicketId = data.id; // Aquí solo tenemos el id

        // Hacer segunda llamada para obtener ticket completo
        const ticketResponse = await fetch(`${API_URL}/ticket/${createdTicketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (ticketResponse.ok) {
          const ticketData = await ticketResponse.json();
          const backendUUID = ticketData.identifier;

          setModalVisible(false);
          await fetchAllData();

          Alert.alert(
            "Éxito",
            `Ticket creado correctamente.\nIdentificador (backend): ${backendUUID}`,
            [
              {
                text: "Copiar URL",
                onPress: () => {
                  const url = `https://minguard.netlify.app/third-party-access/tickets/${backendUUID}`;
                  Clipboard.setString(url);
                  Alert.alert("Copiado", "El enlace se ha copiado al portapapeles.");
                }
              },
              { text: "OK" }
            ]
          );
        } else {
          Alert.alert(
            "Error",
            "Se creó el ticket pero no se pudo obtener el identificador desde el backend."
          );
        }
      } else {
        Alert.alert("Error", "No se pudo crear el ticket.");
      }

      await FileSystem.deleteAsync(requestFileUri);
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      Alert.alert("Error", "Ocurrió un problema al crear el ticket.");
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (ticket) => {
    setSelectedTicket(ticket);
    setEditModalVisible(true);
  };

  const handleCancelEdit = () => {
    setSelectedTicket(null);
    setEditModalVisible(false);
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

        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Historial de Tickets</Text>
          <Pressable style={styles.refreshButton} onPress={fetchAllData}>
            <Text style={styles.refreshButtonText}> Actualizar </Text>
          </Pressable>
        </View>

        <View style={styles.historyWrapper}>
          <ScrollView style={styles.historyContainer}>
            {tickets.map((ticket) => (
              <Pressable key={ticket.id} onPress={() => openEditModal(ticket)}>
                <View style={styles.ticketItem}>
                  <Text style={styles.ticketText}>
                    <Text style={styles.ticketLabel}>Título:</Text> {ticket.title}
                  </Text>
                  <Text style={styles.ticketText}>
                    <Text style={styles.ticketLabel}>Estado:</Text> {ticket.status?.name || "N/A"}
                  </Text>
                  <Text style={styles.ticketText}>
                    <Text style={styles.ticketLabel}>Ubicación:</Text> {ticket.location}
                  </Text>
                  <Text style={styles.ticketText}>
                    <Text style={styles.ticketLabel}>Descripción:</Text> {ticket.description}
                  </Text>
                  <Text style={styles.ticketText}>
                    <Text style={styles.ticketLabel}>Incidente:</Text> {ticket.incident?.title || "N/A"}
                  </Text>
                  <Text style={styles.ticketText}>
                    <Text style={styles.ticketLabel}>Responsable:</Text> {ticket.responsible?.name || "N/A"}
                  </Text>
                  <Text style={styles.ticketText}>
                    <Text style={styles.ticketLabel}>Urgencia:</Text> {ticket.urgency?.name || "N/A"}
                  </Text>
                  <Text style={styles.ticketText}>
                    <Text style={styles.ticketLabel}>Creado:</Text> {new Date(ticket.createdAt).toLocaleString()}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Modal para Crear Ticket */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Crear Nuevo Ticket</Text>
              <Picker
                selectedValue={selectedIncident}
                onValueChange={(value) => setSelectedIncident(value)}
                style={styles.picker}
                itemStyle={{ height: 80, color: "#FFF" }}
              >
                <Picker.Item label="Selecciona un incidente" value="" />
                {incidents.map((incident) => (
                  <Picker.Item key={incident.id} label={incident.title} value={incident.id} />
                ))}
              </Picker>
              <Pressable
                style={styles.saveButton}
                onPress={handleCreateTicket}
                disabled={creating}
              >
                <Text style={styles.saveButtonText}>
                  {creating ? "Guardando..." : "Crear Ticket"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Modal para Editar Ticket */}
        <Modal visible={editModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Editar Ticket</Text>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                value={selectedTicket?.title || ""}
                onChangeText={(text) =>
                  setSelectedTicket({ ...selectedTicket, title: text })
                }
              />
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={styles.input}
                multiline
                value={selectedTicket?.description || ""}
                onChangeText={(text) =>
                  setSelectedTicket({ ...selectedTicket, description: text })
                }
              />
              <Text style={styles.label}>Ubicación</Text>
              <TextInput
                style={styles.input}
                value={selectedTicket?.location || ""}
                onChangeText={(text) =>
                  setSelectedTicket({ ...selectedTicket, location: text })
                }
              />
              <Text style={styles.label}>Incidente</Text>
              <Picker
                selectedValue={selectedTicket?.incidentId || ""}
                onValueChange={(value) =>
                  setSelectedTicket({ ...selectedTicket, incidentId: value })
                }
                style={styles.picker}
                itemStyle={{ height: 70, color: "#FFF" }}
              >
                {incidents.map((incident) => (
                  <Picker.Item key={incident.id} label={incident.title} value={incident.id} />
                ))}
              </Picker>
              <Text style={styles.label}>Estado</Text>
              <Picker
                selectedValue={selectedTicket?.statusId || ""}
                onValueChange={(value) =>
                  setSelectedTicket({ ...selectedTicket, statusId: value })
                }
                style={styles.picker}
                itemStyle={{ height: 70, color: "#FFF" }}
              >
                {statuses.map((status) => (
                  <Picker.Item key={status.id} label={status.name} value={status.id} />
                ))}
              </Picker>
              <Pressable
                style={styles.saveButton}
                onPress={async () => {
                  try {
                    const token = await SecureStore.getItemAsync("userToken");
                    const response = await fetch(`${API_URL}/ticket/${selectedTicket.id}`, {
                      method: "PUT",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        title: selectedTicket.title,
                        description: selectedTicket.description,
                        location: selectedTicket.location,
                        urgencyId: selectedTicket.urgencyId,
                        incidentId: selectedTicket.incidentId,
                        responsibleId: selectedTicket.responsibleId,
                        statusId: selectedTicket.statusId,
                      }),
                    });

                    if (response.ok) {
                      Alert.alert("Éxito", "El ticket ha sido actualizado.");
                      setEditModalVisible(false);
                      fetchAllData();
                    } else {
                      Alert.alert("Error", "No se pudo actualizar el ticket.");
                    }
                  } catch (error) {
                    console.error("Error al actualizar el ticket:", error);
                    Alert.alert("Error", "Hubo un problema al actualizar el ticket.");
                  }
                }}
              >
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => {
                  Alert.alert(
                    "Confirmación",
                    "¿Estás seguro de que deseas eliminar este ticket?",
                    [
                      {
                        text: "Cancelar",
                        style: "cancel",
                      },
                      {
                        text: "Eliminar",
                        onPress: async () => {
                          try {
                            const token = await SecureStore.getItemAsync("userToken");
                            const response = await fetch(
                              `${API_URL}/ticket/${selectedTicket.id}`,
                              {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );

                            if (response.ok) {
                              Alert.alert("Éxito", "El ticket ha sido eliminado.");
                              setEditModalVisible(false);
                              fetchAllData();
                            } else {
                              Alert.alert("Error", "No se pudo eliminar el ticket.");
                            }
                          } catch (error) {
                            console.error("Error al eliminar el ticket:", error);
                            Alert.alert("Error", "Hubo un problema al eliminar el ticket.");
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.deleteButtonText}>Eliminar Ticket</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </View>
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
  },
  createButtonText: { color: "#000", fontWeight: "bold" },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  historyTitle: {
    color: "#FFD700",
    fontSize: 18,
    flex: 1,
    marginRight: 10,
  },
  refreshButton: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    padding: 8,
  },
  refreshButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  historyWrapper: { flex: 1, marginTop: 10 },
  historyContainer: { flex: 1 },
  ticketItem: {
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  ticketText: { color: "#FFF" },
  ticketLabel: { fontWeight: "bold", color: "#FFD700" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContainer: {
    backgroundColor: "#000",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    width: "85%",
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 23,
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold"
  },
  label: { color: "#FFF", marginBottom: 10 },
  picker: {
    backgroundColor: "#444",
    color: "#FFF",
    height: 70,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButton: { backgroundColor: "#FFD700", padding: 10, borderRadius: 8, marginTop: 10 },
  saveButtonText: { color: "#FFF", textAlign: "center" },
  deleteButton: { backgroundColor: "#FF5733", padding: 10, borderRadius: 8, marginTop: 10 },
  deleteButtonText: { color: "#FFF", textAlign: "center" },
  cancelButton: { backgroundColor: "#888", padding: 10, borderRadius: 8, marginTop: 10 },
  cancelButtonText: { color: "#FFF", textAlign: "center" },
});

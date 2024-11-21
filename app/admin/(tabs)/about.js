// app/(tabs)/about.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import api from "../../../components/api"; // Asegúrate de que la ruta sea correcta

export default function About() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    mobilePrefix: "",
    mobileNumber: "",
    acceptTc: true,
    genderId: 0,
    role: "WORKER", // Por defecto 'WORKER', puedes cambiarlo a 'ADMIN' si es necesario
  });

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleRegister = async () => {
    try {
      const response = await api.post(`/user/register/${formData.role}`, {
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobilePrefix: formData.mobilePrefix,
        mobileNumber: formData.mobileNumber,
        acceptTc: formData.acceptTc,
        genderId: formData.genderId,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Éxito", "Usuario registrado exitosamente.");
      } else {
        Alert.alert("Error", "No se pudo registrar el usuario.");
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      Alert.alert("Error", "Ocurrió un error al intentar registrar el usuario.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
        Registrar Usuario
      </Text>

      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        placeholder="Correo Electrónico"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        placeholder="Contraseña"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
      />
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        placeholder="Confirmar Contraseña"
        secureTextEntry
        value={formData.passwordConfirm}
        onChangeText={(value) => handleInputChange("passwordConfirm", value)}
      />
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        placeholder="Nombre"
        value={formData.firstName}
        onChangeText={(value) => handleInputChange("firstName", value)}
      />
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        placeholder="Apellido"
        value={formData.lastName}
        onChangeText={(value) => handleInputChange("lastName", value)}
      />
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        placeholder="Prefijo del móvil"
        value={formData.mobilePrefix}
        onChangeText={(value) => handleInputChange("mobilePrefix", value)}
      />
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        placeholder="Número de móvil"
        value={formData.mobileNumber}
        onChangeText={(value) => handleInputChange("mobileNumber", value)}
      />
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        placeholder="ID de Género (0: WOMAN, 1: MAN, etc.)"
        value={formData.genderId.toString()}
        onChangeText={(value) => handleInputChange("genderId", parseInt(value))}
        keyboardType="numeric"
      />

      <Button
        title="Registrar Usuario"
        onPress={handleRegister}
        color="blue"
      />
    </View>
  );
}

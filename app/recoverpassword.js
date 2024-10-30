import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { styled } from "nativewind";
import { Screen } from "../components/Screen";


const StyledPressable = styled(Pressable);

export default function RecoverPassword() {
  const handlePasswordRecovery = () => {
    // Aquí podrías integrar la lógica de recuperación (por ejemplo, envío de correo)
    Alert.alert("Recuperación de Contraseña", "Si el correo existe, se enviará un enlace de recuperación.");
  };

  return (
    <Screen>
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-2xl mb-8">Recuperar Contraseña</Text>
        
        <TextInput
          placeholder="Correo Electrónico"
          keyboardType="email-address"
          className="bg-white/90 w-3/4 p-4 mb-4 rounded"
        />
        
        <StyledPressable onPress={handlePasswordRecovery} className="bg-yellow-500 w-3/4 p-4 rounded items-center mb-4 active:bg-yellow-600">
          <Text className="text-black font-bold">Restablecer Contraseña</Text>
        </StyledPressable>
      </View>
    </Screen>
  );
}

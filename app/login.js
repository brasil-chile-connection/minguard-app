import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { styled } from "nativewind";
import { Screen } from "../components/Screen";
import { Link } from "expo-router";


<StyledPressable className="mt-4">
  <Link href="/recoverPassword">
    <Text className="text-white/70">¿Olvidaste tu contraseña?</Text>
  </Link>
</StyledPressable>

const StyledPressable = styled(Pressable);

export default function Login() {

  const handlePasswordRecovery = () => {
    // Aquí podrías redirigir a una vista o modal para recuperar la contraseña
    Alert.alert("Recuperación de Contraseña", "Redirigiendo a recuperación...");
  };

  return (
    <Screen>
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-2xl mb-8">Iniciar Sesión</Text>
        
        <TextInput
          placeholder="Correo Electrónico"
          keyboardType="email-address"
          className="bg-white/90 w-3/4 p-4 mb-4 rounded"
        />
        
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          className="bg-white/90 w-3/4 p-4 mb-6 rounded"
        />
        <Link asChild href="/overview">
          <StyledPressable  className="bg-yellow-500 w-3/4 p-4 rounded items-center mb-4 active:bg-yellow-600">
            <Text className="text-black font-bold">Ingresar</Text>
          </StyledPressable>
        </Link>
        <Link asChild href="/recoverpassword" >
         <StyledPressable>
            <Text className="text-white/70">¿Olvidaste tu contraseña?</Text>
        </StyledPressable>
        </Link>

      </View>
    </Screen>
  );
}

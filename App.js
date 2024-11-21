import { StatusBar } from "expo-status-bar";
import { ExpoRoot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./components/authContext";

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <ExpoRoot />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
console.log('AuthProvider importado:', AuthProvider);

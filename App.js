import { StatusBar } from "expo-status-bar";
import { ExpoRoot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ExpoRoot />
    </SafeAreaProvider>
  );
}

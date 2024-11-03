// app/tabs/about.js

import { Pressable, ScrollView, Text } from "react-native";
import { Link } from "expo-router";
import { HomeIcon } from "../../components/Icons";
import { styled } from "nativewind";
import { Screen } from "../../components/Screen";

const StyledPressable = styled(Pressable);

export default function About() {
  return (
    <Screen>
      <ScrollView className="pt-24 bg-black">
        {/* Enlace a la pantalla principal */}
        <Link asChild href="/">
          <StyledPressable className="active:opacity-80">
            <HomeIcon />
          </StyledPressable>
        </Link>

        <Text className="text-white font-bold mb-8 text-2xl">
          Sobre El Proyecto
        </Text>

        <Text className="text-white/90 mb-4">
          Esta es una aplicación simple que utiliza React Native Web para
          renderizar el mismo código en la web y en dispositivos móviles.
        </Text>

        {/* Enlace a la pantalla de resumen */}
        <Link asChild href="/overview">
          <StyledPressable className="active:opacity-80">
            <HomeIcon />
          </StyledPressable>
        </Link>
      </ScrollView>
    </Screen>
  );
}

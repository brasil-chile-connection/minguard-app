import React from 'react';
import Svg, { Circle, Text } from "react-native-svg";
import { useColorScheme } from "react-native";

/**
 * Componente Logo
 *
 * Renderiza el logo de Minguard utilizando SVG.
 *
 * Props:
 * - width: ancho del logo (por defecto 176)
 * - height: alto del logo (por defecto 40)
 * - ...props: otras propiedades pasadas al componente Svg
 */
export const Logo = React.memo(({ width = 176, height = 40, ...props }) => {
  const colorScheme = useColorScheme();
  const textColor = '#FFFFFF'; // Puedes ajustar esto según el tema si lo deseas.

  const COLORS = {
    yellow: "#FFCC33",
    black: "#000000",
    white: "#FFFFFF",
  };

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 300 100"
      accessible={true}
      accessibilityLabel="Logo de Minguard"
      {...props}
    >
      {/* Círculo Amarillo Exterior */}
      <Circle cx="50" cy="50" r="48" fill={COLORS.yellow} />

      {/* Círculo Negro Interior */}
      <Circle cx="50" cy="50" r="40" fill={COLORS.black} />

      {/* Letra 'M' en el Círculo */}
      <Text
        x="50"
        y="68"
        fontFamily="System"
        fontSize="60"
        fontWeight="bold"
        textAnchor="middle"
        fill={COLORS.white}
      >
        M
      </Text>

      {/* Texto "Minguard" */}
      <Text
        x="110"
        y="70"
        fontFamily="System"
        fontSize="36"
        fontWeight="normal"
        fill={COLORS.white}
      >
        Minguard
      </Text>
    </Svg>
  );
});

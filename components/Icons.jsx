import React from 'react';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

/**
 * Componente Icon
 * Componente base para renderizar iconos de FontAwesome6.
 *
 * Props:
 * - name: nombre del icono
 * - size: tamaño del icono (predeterminado 24)
 * - color: color del icono (predeterminado "white")
 * - ...props: otras propiedades
 */
const Icon = ({ name, size = 24, color = "white", ...props }) => {
  return <FontAwesome6 name={name} size={size} color={color} {...props} />;
};

/**
 * Componente CircleInfoIcon
 * Icono de información en círculo.
 */
export const CircleInfoIcon = (props) => (
  <Icon name="circle-info" accessibilityLabel="Información general" {...props} />
);

/**
 * Componente HomeIcon
 * Icono de inicio.
 */
export const HomeIcon = (props) => (
  <Icon name="house" accessibilityLabel="Inicio" {...props} />
);

/**
 * Componente InfoIcon
 * Icono de información.
 */
export const InfoIcon = (props) => (
  <Icon name="info-circle" accessibilityLabel="Acerca de" {...props} />
);

/**
 * Componente LoginIcon
 * Icono de usuario para iniciar sesión.
 */
export const LoginIcon = (props) => (
  <Icon name="user" accessibilityLabel="Iniciar sesión" {...props} />
);

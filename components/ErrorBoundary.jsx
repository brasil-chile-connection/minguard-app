// components/ErrorBoundary.jsx

import React from 'react';
import { View, Text } from 'react-native';

/**
 * Componente ErrorBoundary
 *
 * Captura errores en sus componentes hijos y muestra una interfaz de reserva.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de reserva
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores si lo deseas
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de reserva
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Ocurrió un error
          </Text>
          <Text>
            {this.state.error ? this.state.error.message : 'Error desconocido'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

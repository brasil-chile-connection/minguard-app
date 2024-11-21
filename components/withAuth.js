// components/withAuth.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../components/authContext';
import { useRouter } from 'expo-router';
import { Alert, View, ActivityIndicator, Text } from 'react-native';

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { role, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (loading) return; // Esperar a que termine la carga
      console.log('Rol en withAuth:', role);
      if (role === 'guest' || !allowedRoles.includes(role)) {
        Alert.alert('Acceso Denegado', 'No tienes permiso para acceder a esta página.');
        router.replace('/login');
      }
    }, [role, loading]);

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando...</Text>
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

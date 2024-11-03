// components/withAuth.js

import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function withAuth(WrappedComponent, requiredRole) {
  return function AuthComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const token = await SecureStore.getItemAsync('userToken');
        const userRole = await SecureStore.getItemAsync('userRole');

        if (!token) {
          router.replace('/login');
        } else if (userRole !== requiredRole) {
          Alert.alert("Acceso denegado", "No tienes permisos para acceder a esta sección.");
          router.replace('/login');
        }
      };

      checkAuth();
    }, []);

    return <WrappedComponent {...props} />;
  };
}

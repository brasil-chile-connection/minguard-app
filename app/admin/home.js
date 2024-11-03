// app/admin/home.js

import React from 'react';
import { View, Text } from 'react-native';
import withAuth from '../../components/withAuth';

function AdminHome() {
  return (
    <View>
      <Text>Bienvenido, Administrador</Text>
      {/* Contenido exclusivo para administradores */}
    </View>
  );
}

export default withAuth(AdminHome, 'ADMIN');

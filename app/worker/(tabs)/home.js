// app/worker/home.js

import React from 'react';
import { View, Text } from 'react-native';
import withAuth from '../../../components/withAuth';

function WorkerHome() {
  return (
    <View>
      <Text>Bienvenido, Trabajador</Text>
      {/* Contenido exclusivo para trabajadores */}
    </View>
  );
}

export default withAuth(WorkerHome, 'WORKER');

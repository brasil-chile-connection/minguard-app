import React from 'react';
import { Redirect } from 'expo-router';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Index() {
  return (
    <ErrorBoundary>
      <Redirect href="/login" />
    </ErrorBoundary>
  );
}

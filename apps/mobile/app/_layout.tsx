import 'react-native-reanimated'

import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React from 'react'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  return <RootLayoutNav />
}

function RootLayoutNav() {
  return <Stack />
}

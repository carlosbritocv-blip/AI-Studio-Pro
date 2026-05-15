// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AppProvider } from '../context/AppContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProvider>
        <StatusBar style="light" backgroundColor="#0a0a0f" />
        {/* Dejamos que Expo Router gestione las rutas automáticamente */}
        <Stack 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right'
          }} 
        />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image, SafeAreaView } from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('menu'); // Controla qué pantalla vemos
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  // --- COMPONENTE: MENÚ PRINCIPAL ---
  const MainMenu = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuHeader}>
        <Text style={styles.title}>AI STUDIO PRO</Text>
        <Text style={styles.subtitle}>¿Qué quieres hacer hoy?</Text>
      </View>
      
      <View style={styles.grid}>
        <TouchableOpacity style={styles.cardIA} onPress={() => setScreen('ia')}>
          <Text style={styles.icon}>✨</Text>
          <Text style={styles.cardTitle}>CREACIÓN IA</Text>
          <Text style={styles.cardDesc}>Genera desde texto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardEdit} onPress={() => setScreen('edit')}>
          <Text style={styles.icon}>🎨</Text>
          <Text style={styles.cardTitle}>EDITOR PRO</Text>
          <Text style={styles.cardDesc}>Edita tus archivos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // --- COMPONENTE: PANTALLA IA ---
  const IAScreen = () => (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('menu')} style={styles.backBtn}>
        <Text style={styles.backText}>← VOLVER AL MENÚ</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>LABORATORIO IA</Text>
      <View style={styles.inputCard}>
        <TextInput 
          style={styles.textInput} 
          placeholder="Describe tu creación..." 
          placeholderTextColor="#555"
          value={prompt}
          onChangeText={setPrompt}
        />
      </View>
      <TouchableOpacity style={styles.generateBtn}>
        <Text style={styles.generateText}>GENERAR AHORA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // --- COMPONENTE: PANTALLA EDICIÓN ---
  const EditScreen = () => (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('menu')} style={styles.backBtn}>
        <Text style={styles.backText}>← VOLVER AL MENÚ</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>EDITOR PROFESIONAL</Text>
      
      <TouchableOpacity style={styles.uploadBox}>
        <Text style={{color: '#666'}}>+ CARGAR ARCHIVO PARA EDITAR</Text>
      </TouchableOpacity>

      <View style={styles.toolsRow}>
        <TouchableOpacity style={styles.toolBtn}><Text style={styles.toolText}>FILTROS</Text></TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn}><Text style={styles.toolText}>CORTAR</Text></TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn}><Text style={styles.toolText}>AJUSTES</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Lógica de renderizado
  if (screen === 'menu') return <MainMenu />;
  if (screen === 'ia') return <IAScreen />;
  if (screen === 'edit') return <EditScreen />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  menuHeader: { marginTop: 40, alignItems: 'center', marginBottom: 40 },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', letterSpacing: 2 },
  subtitle: { color: '#666', fontSize: 16, marginTop: 5 },
  grid: { flex: 1, justifyContent: 'center' },
  cardIA: { backgroundColor: '#007AFF', padding: 30, borderRadius: 30, marginBottom: 20, alignItems: 'center' },
  cardEdit: { backgroundColor: '#1a1a1a', padding: 30, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  cardDesc: { color: '#e0e0e0', fontSize: 12, marginTop: 5 },
  icon: { fontSize: 40 },
  backBtn: { padding: 10, marginBottom: 20 },
  backText: { color: '#007AFF', fontWeight: 'bold' },
  sectionTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inputCard: { backgroundColor: '#0a0a0a', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#222' },
  textInput: { color: '#fff', fontSize: 16 },
  generateBtn: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginTop: 20, alignItems: 'center' },
  generateText: { fontWeight: 'bold', fontSize: 18 },
  uploadBox: { height: 200, backgroundColor: '#0a0a0a', borderRadius: 25, borderStyle: 'dashed', borderWidth: 2, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  toolsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  toolBtn: { backgroundColor: '#111', padding: 15, borderRadius: 15, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  toolText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});

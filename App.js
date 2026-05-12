import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, BackHandler, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function App() {
  const [screen, setScreen] = useState('inicio');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  // 1. CONTROL DE NAVEGACIÓN (BOTÓN ATRÁS DEL MÓVIL)
  useEffect(() => {
    const backAction = () => {
      if (screen !== 'inicio') {
        setScreen('inicio');
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [screen]);

  // 2. FUNCIÓN DE EDICIÓN REAL (PROCESA LA IMAGEN)
  const applyFilter = async () => {
    if (!image) return Alert.alert("Error", "Carga una imagen primero");
    setLoading(true);
    try {
      const result = await ImageManipulator.manipulateAsync(
        image,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: false }
      );
      setImage(result.uri);
      Alert.alert("Éxito", "Filtro Pro aplicado");
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar la imagen");
    } finally {
      setLoading(false);
    }
  };

  // 3. CARGA DE ARCHIVOS
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setScreen('editor');
    }
  };

  // --- VISTAS ---

  if (screen === 'inicio') return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logoText}>AI STUDIO PRO</Text>
          <Text style={styles.subText}>¿Qué quieres hacer hoy?</Text>
        </View>

        <TouchableOpacity style={styles.mainActionCard} onPress={() => setScreen('ia')}>
          <Text style={styles.cardIcon}>✨</Text>
          <Text style={styles.cardTitle}>CREACIÓN IA</Text>
          <Text style={styles.cardDesc}>Genera desde texto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryActionCard} onPress={pickImage}>
          <Text style={styles.cardIcon}>🎨</Text>
          <Text style={styles.cardTitle}>EDITOR PRO</Text>
          <Text style={styles.cardDesc}>Edita tus archivos</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Tendencias ›</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft: 20}}>
          {['Cinemático', 'Retro', 'Anime', '8K Real'].map((t) => (
            <TouchableOpacity key={t} style={styles.thumb} onPress={() => {setPrompt(t); setScreen('ia');}}>
              <View style={styles.thumbBox}><Text style={styles.thumbEmoji}>🖼️</Text></View>
              <Text style={styles.thumbLabel}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => setScreen('inicio')}><Text style={styles.backBtn}>← VOLVER</Text></TouchableOpacity>
        <Text style={styles.navTitle}>{screen === 'ia' ? 'LABORATORIO IA' : 'EDITOR PRO'}</Text>
      </View>

      <View style={styles.workArea}>
        {image ? (
          <Image source={{uri: image}} style={styles.previewImage} />
        ) : (
          <View style={styles.emptyBox}><Text style={{color: '#444'}}>Esperando archivo...</Text></View>
        )}

        {loading && <ActivityIndicator size="large" color="#007AFF" style={{margin: 20}} />}

        <View style={styles.controlsGrid}>
          {screen === 'editor' ? (
            <>
              <TouchableOpacity style={styles.toolBtn} onPress={applyFilter}><Text style={styles.toolText}>FILTROS</Text></TouchableOpacity>
              <TouchableOpacity style={styles.toolBtn} onPress={pickImage}><Text style={styles.toolText}>CAMBIAR</Text></TouchableOpacity>
              <TouchableOpacity style={styles.toolBtn} onPress={() => Alert.alert("IA", "Analizando imagen...")}><Text style={styles.toolText}>AJUSTES AI</Text></TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.generateBtn} onPress={() => Alert.alert("IA", `Generando: ${prompt}`)}>
              <Text style={styles.generateBtnText}>GENERAR AHORA</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 30, alignItems: 'center' },
  logoText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subText: { color: '#666', fontSize: 14 },
  mainActionCard: { backgroundColor: '#007AFF', margin: 20, padding: 30, borderRadius: 30 },
  secondaryActionCard: { backgroundColor: '#111', marginHorizontal: 20, padding: 30, borderRadius: 30, borderWidth: 1, borderColor: '#222' },
  cardIcon: { fontSize: 32, marginBottom: 10 },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cardDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', margin: 20 },
  thumb: { marginRight: 15, alignItems: 'center' },
  thumbBox: { width: 100, height: 140, backgroundColor: '#111', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  thumbEmoji: { fontSize: 30 },
  thumbLabel: { color: '#666', fontSize: 10, marginTop: 5 },
  topNav: { flexDirection: 'row', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#111' },
  backBtn: { color: '#007AFF', fontWeight: 'bold' },
  navTitle: { color: '#fff', marginLeft: 20, fontWeight: 'bold' },
  workArea: { flex: 1, padding: 20, alignItems: 'center' },
  previewImage: { width: '100%', height: 350, borderRadius: 25 },
  emptyBox: { width: '100%', height: 350, backgroundColor: '#0a0a0a', borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#222' },
  controlsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20, width: '100%' },
  toolBtn: { width: '31%', backgroundColor: '#111', padding: 15, borderRadius: 15, alignItems: 'center' },
  toolText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  generateBtn: { backgroundColor: '#fff', width: '100%', padding: 20, borderRadius: 20, alignItems: 'center' },
  generateBtnText: { fontWeight: 'bold' }
});

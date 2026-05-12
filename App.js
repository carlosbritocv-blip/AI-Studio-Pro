import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image, Share } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const TOKENS = {
  openai: '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',
  replicate: 'r8_5C9Y1YWyG7NtTpfvEODZ808OJRGyOrM0EO4R3',
  elevenlabs: 'sk_1c129e727e2a5bc29ecf44844fa890220b2fd2a82d447df4'
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [loading, setLoading] = useState(false);
  const [resultUri, setResultUri] = useState(null);
  const [imageToEdit, setImageToEdit] = useState(null);

  // --- FUNCIONES DE GESTIÓN ---
  const resetAll = () => {
    setPrompt('');
    setResultUri(null);
    setImageToEdit(null);
    Alert.alert("Limpio", "Se han borrado todos los campos.");
  };

  const saveToGallery = async () => {
    if (!resultUri) return Alert.alert("Error", "No hay nada generado para guardar.");
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.saveToLibraryAsync(resultUri);
      Alert.alert("¡Guardado!", "La imagen ya está en tu galería.");
    } else {
      Alert.alert("Permiso denegado", "Necesito acceso a tu galería para guardar.");
    }
  };

  const shareContent = async () => {
    if (!resultUri) return Alert.alert("Error", "Genera algo antes de compartir.");
    await Share.share({ url: resultUri, message: `Mira lo que he creado en AI Studio Pro: ${prompt}` });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImageToEdit(result.assets[0].uri);
  };

  const handleGenerate = async () => {
    if (!prompt) return Alert.alert("Aviso", "Escribe una descripción.");
    setLoading(true);
    try {
      if (mediaType === 'image') {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKENS.openai}` },
          body: JSON.stringify({ prompt, n: 1, size: "1024x1024" })
        });
        const data = await response.json();
        if (data.data) setResultUri(data.data[0].url);
      } else {
        Alert.alert("Info", `${mediaType.toUpperCase()} está conectando con Replicate/ElevenLabs...`);
      }
    } catch (err) {
      Alert.alert("Error", "Fallo de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>AI STUDIO PRO 🦾</Text>
        <TouchableOpacity onPress={resetAll} style={styles.trashBtn}>
          <Text style={{fontSize: 20}}>🗑️</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scroll}>
        {/* CARGA DE ARCHIVOS */}
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {imageToEdit ? <Image source={{ uri: imageToEdit }} style={styles.previewImg} /> : <Text style={styles.uploadText}>+ CARGAR CONTENIDO</Text>}
        </TouchableOpacity>

        {/* INPUT */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu prompt aquí..."
            placeholderTextColor="#444"
            multiline
            value={prompt}
            onChangeText={setPrompt}
          />
        </View>

        {/* MODOS */}
        <View style={styles.modeRow}>
          {['image', 'video', 'audio'].map((m) => (
            <TouchableOpacity 
              key={m} 
              style={[styles.modeBtn, mediaType === m && styles.activeMode]}
              onPress={() => setMediaType(m)}
            >
              <Text style={styles.modeText}>{m.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* RESULTADO Y ACCIONES RÁPIDAS */}
        {resultUri && (
          <View style={styles.resContainer}>
            <Image source={{ uri: resultUri }} style={styles.resImg} />
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={saveToGallery}>
                <Text style={styles.actionBtnText}>📥 GUARDAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#25D366'}]} onPress={shareContent}>
                <Text style={styles.actionBtnText}>📤 COMPARTIR</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* BOTÓN GENERAR */}
      <TouchableOpacity style={styles.mainBtn} onPress={handleGenerate} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.mainBtnText}>GENERAR {mediaType.toUpperCase()}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  header: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  trashBtn: { padding: 10, backgroundColor: '#1a1a1a', borderRadius: 12 },
  scroll: { padding: 20 },
  uploadBox: { height: 120, backgroundColor: '#111', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#333', marginBottom: 20 },
  uploadText: { color: '#555', fontWeight: 'bold', fontSize: 12 },
  previewImg: { width: '100%', height: '100%', borderRadius: 20 },
  card: { backgroundColor: '#111', padding: 15, borderRadius: 20, marginBottom: 20 },
  input: { color: '#fff', fontSize: 16, minHeight: 60 },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  modeBtn: { flex: 1, padding: 12, backgroundColor: '#111', borderRadius: 12, marginHorizontal: 5, alignItems: 'center' },
  activeMode: { backgroundColor: '#007AFF' },
  modeText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
  resContainer: { backgroundColor: '#111', borderRadius: 25, padding: 10, marginBottom: 50 },
  resImg: { width: '100%', height: 350, borderRadius: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15, marginBottom: 10 },
  actionBtn: { backgroundColor: '#333', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  mainBtn: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 20, alignItems: 'center', position: 'absolute', bottom: 10, left: 0, right: 0 },
  mainBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});

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

  const resetAll = () => {
    setPrompt('');
    setResultUri(null);
    setImageToEdit(null);
  };

  const saveToGallery = async () => {
    if (!resultUri) return;
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.saveToLibraryAsync(resultUri);
      Alert.alert("Éxito", "Guardado en galería");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImageToEdit(result.assets[0].uri);
  };

  const handleGenerate = async () => {
    if (!prompt) return Alert.alert("Aviso", "Escribe un prompt");
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
      }
    } catch (err) {
      Alert.alert("Error", "Fallo al conectar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>AI STUDIO PRO</Text>
        <TouchableOpacity onPress={resetAll}><Text style={{fontSize: 24}}>🗑️</Text></TouchableOpacity>
      </View>
      
      <ScrollView style={{padding: 20}}>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {imageToEdit ? <Image source={{ uri: imageToEdit }} style={styles.img} /> : <Text style={{color: '#555'}}>+ CARGAR</Text>}
        </TouchableOpacity>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="¿Qué creamos?"
            placeholderTextColor="#444"
            multiline
            value={prompt}
            onChangeText={setPrompt}
          />
        </View>

        <View style={styles.row}>
          {['image', 'video', 'audio'].map((m) => (
            <TouchableOpacity key={m} style={[styles.btn, mediaType === m && styles.active]} onPress={() => setMediaType(m)}>
              <Text style={styles.btnText}>{m.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {resultUri && (
          <View style={styles.resContainer}>
            <Image source={{ uri: resultUri }} style={styles.img} />
            <TouchableOpacity style={styles.saveBtn} onPress={saveToGallery}>
              <Text style={styles.btnText}>📥 GUARDAR EN GALERÍA</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.mainBtn} onPress={handleGenerate} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.mainBtnText}>GENERAR</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  header: { color: '#fff', fontSize: 22, fontWeight: '900' },
  uploadBox: { height: 120, backgroundColor: '#111', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  img: { width: '100%', height: '100%', borderRadius: 20 },
  card: { backgroundColor: '#111', padding: 15, borderRadius: 20, marginBottom: 20 },
  input: { color: '#fff', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 12, backgroundColor: '#111', borderRadius: 10, marginHorizontal: 5, alignItems: 'center' },
  active: { backgroundColor: '#007AFF' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
  resContainer: { marginTop: 20, backgroundColor: '#111', borderRadius: 20, padding: 10 },
  saveBtn: { backgroundColor: '#333', padding: 15, borderRadius: 12, marginTop: 10, alignItems: 'center' },
  mainBtn: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 20, alignItems: 'center' },
  mainBtnText: { color: '#000', fontWeight: 'bold' }
});

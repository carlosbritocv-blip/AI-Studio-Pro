import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, Image, 
  ScrollView, SafeAreaView, TextInput, Alert, ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function App() {
  const [screen, setScreen] = useState('inicio');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setScreen('editor');
    }
  };

  const applyFilter = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        image,
        [{ flip: ImageManipulator.FlipType.Vertical }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      setImage(manipResult.uri);
      Alert.alert("Éxito", "Filtro aplicado correctamente");
    } catch (e) {
      Alert.alert("Error", "No se pudo procesar la imagen");
    }
    setLoading(false);
  };

  if (screen === 'inicio') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>AI STUDIO PRO</Text>
        <Text style={styles.subtitle}>¿Qué quieres hacer hoy?</Text>
        
        <TouchableOpacity style={styles.cardBlue} onPress={() => setScreen('laboratorio')}>
          <Text style={styles.cardTitle}>✨ CREACIÓN IA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardGray} onPress={() => setScreen('editor')}>
          <Text style={styles.cardTitle}>🎨 EDITOR PRO</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('inicio')}>
        <Text style={styles.backBtn}>← VOLVER</Text>
      </TouchableOpacity>
      
      <View style={styles.workArea}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Text style={styles.uploadText}>+ CARGAR ARCHIVO</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.smallBtn} onPress={applyFilter}>
          <Text style={styles.smallBtnText}>FILTROS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallBtn} onPress={() => Alert.alert("IA", "Analizando curvas...")}>
          <Text style={styles.smallBtnText}>CURVAS AI</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 40 },
  subtitle: { color: '#666', textAlign: 'center', marginBottom: 40 },
  cardBlue: { backgroundColor: '#007AFF', padding: 30, borderRadius: 20, marginBottom: 20 },
  cardGray: { backgroundColor: '#1C1C1E', padding: 30, borderRadius: 20 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  backBtn: { color: '#007AFF', fontWeight: 'bold', marginVertical: 20 },
  workArea: { height: 350, backgroundColor: '#111', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  preview: { width: '100%', height: '100%', borderRadius: 20 },
  uploadBtn: { padding: 20 },
  uploadText: { color: '#444', fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  smallBtn: { backgroundColor: '#1C1C1E', padding: 15, borderRadius: 12, width: '45%' },
  smallBtnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const processWithIA = () => {
    if (!image) return Alert.alert("Error", "Carga un archivo primero");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("IA Studio Pro", "Procesamiento de imagen completado con éxito");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>AI STUDIO PRO</Text>
      
      <View style={styles.mainCard}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
            <Text style={styles.uploadText}>+ CARGAR CONTENIDO</Text>
            <Text style={styles.uploadSub}>Imagen o Video</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => Alert.alert("Modo", "Cambiando a Laboratorio IA...")}>
          <Text style={styles.btnText}>✨ LABORATORIO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.btnPrimary} onPress={processWithIA}>
          <Text style={styles.btnText}>{loading ? "PROCESANDO..." : "CREAR CON IA"}</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <TouchableOpacity onPress={() => setImage(null)} style={{marginTop: 20}}>
          <Text style={{color: '#ff4444', textAlign: 'center'}}>Eliminar y empezar de nuevo</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 20}} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  mainCard: { width: '100%', height: 400, backgroundColor: '#0a0a0a', borderRadius: 25, borderStyle: 'dashed', borderWidth: 1, borderColor: '#333', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  preview: { width: '100%', height: '100%' },
  uploadArea: { alignItems: 'center' },
  uploadText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  uploadSub: { color: '#444', marginTop: 5 },
  menu: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  btnPrimary: { backgroundColor: '#007AFF', padding: 20, borderRadius: 15, width: '48%', alignItems: 'center' },
  btnSecondary: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, width: '48%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

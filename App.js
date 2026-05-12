import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedAsset(result.assets[0].uri);
    }
  };

  const applyFilter = async () => {
    if (!selectedAsset) return Alert.alert("Aviso", "Primero selecciona una imagen");
    
    const manipResult = await ImageManipulator.manipulateAsync(
      selectedAsset,
      [{ flip: ImageManipulator.FlipType.Vertical }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    setSelectedAsset(manipResult.uri);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.logoText}>AI STUDIO PRO</Text>
      
      <View style={styles.canvas}>
        {selectedAsset ? (
          <Image source={{ uri: selectedAsset }} style={styles.preview} />
        ) : (
          <Text style={styles.placeholder}>Sube contenido para editar o crear con IA</Text>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={pickMedia}>
          <Text style={styles.btnIcon}>📁</Text>
          <Text style={styles.btnText}>Cargar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolBtn} onPress={applyFilter}>
          <Text style={styles.btnIcon}>🎨</Text>
          <Text style={styles.btnText}>Filtro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.toolBtn, styles.iaBtn]}>
          <Text style={styles.btnIcon}>✨</Text>
          <Text style={styles.btnText}>Crear IA</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.toolBtn}>
          <Text style={styles.btnIcon}>🎵</Text>
          <Text style={styles.btnText}>Música</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60 },
  logoText: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', letterSpacing: 2 },
  canvas: { width: '90%', height: '60%', backgroundColor: '#1e1e1e', alignSelf: 'center', marginTop: 30, borderRadius: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#333' },
  preview: { width: '100%', height: '100%' },
  placeholder: { color: '#555', textAlign: 'center', padding: 20 },
  toolbar: { marginTop: 30, paddingLeft: 20 },
  toolBtn: { backgroundColor: '#252525', padding: 15, borderRadius: 15, alignItems: 'center', marginRight: 15, width: 85, height: 90 },
  iaBtn: { borderWeight: 2, borderColor: '#00e5ff', backgroundColor: '#1a2a3a' },
  btnIcon: { fontSize: 24, marginBottom: 5 },
  btnText: { color: '#ccc', fontSize: 12, fontWeight: '500' }
});


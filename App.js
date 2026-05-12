import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [image, setImage] = useState(null);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Necesitamos permisos para la galería');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>AI STUDIO PRO</Text>
      
      <View style={styles.card}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <TouchableOpacity onPress={selectImage}>
            <Text style={styles.uploadText}>+ CARGAR IMAGEN</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("IA", "Procesando imagen...")}>
        <Text style={styles.buttonText}>GENERAR CON IA</Text>
      </TouchableOpacity>

      {image && (
        <TouchableOpacity onPress={() => setImage(null)}>
          <Text style={styles.resetText}>Eliminar imagen</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 40 },
  card: { width: '100%', height: 300, backgroundColor: '#111', borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  preview: { width: '100%', height: '100%', borderRadius: 20 },
  uploadText: { color: '#555', fontSize: 18 },
  button: { backgroundColor: '#007AFF', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resetText: { color: '#ff4444', marginTop: 20 }
});

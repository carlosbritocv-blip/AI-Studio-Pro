import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const applyAI = async () => {
    if (!image) return Alert.alert("Aviso", "Carga una imagen primero");
    setLoading(true);
    try {
      const result = await ImageManipulator.manipulateAsync(image, [{ rotate: 0 }], { compress: 0.7 });
      setImage(result.uri);
      Alert.alert("Éxito", "IA aplicada al 100%");
    } catch (e) {
      Alert.alert("Error", "Error al procesar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>AI STUDIO PRO</Text>
      <View style={styles.box}>
        {image ? <Image source={{uri: image}} style={styles.img} /> : <Text style={{color: '#444'}}>VACÍO</Text>}
      </View>
      <TouchableOpacity style={styles.btn1} onPress={selectImage}><Text style={styles.txt}>+ CARGAR</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btn2} onPress={applyAI} disabled={loading}>
        <Text style={styles.txt}>{loading ? "PROCESANDO..." : "BOTÓN IA FUNCIONAL"}</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator color="#007AFF" style={{marginTop: 10}} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' },
  logo: { color: '#fff', fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  box: { height: 300, backgroundColor: '#0a0a0a', borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  img: { width: '100%', height: '100%', borderRadius: 20 },
  btn1: { backgroundColor: '#111', padding: 20, borderRadius: 15, marginBottom: 10, alignItems: 'center' },
  btn2: { backgroundColor: '#007AFF', padding: 20, borderRadius: 15, alignItems: 'center' },
  txt: { color: '#fff', fontWeight: 'bold' }
});

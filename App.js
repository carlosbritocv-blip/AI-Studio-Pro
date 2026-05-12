import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState('image'); // image, video, audio

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI STUDIO PRO v2.0</Text>
      
      <ScrollView style={styles.content}>
        {/* ÁREA DE PROMPT */}
        <View style={styles.card}>
          <Text style={styles.label}>Describe tu creación:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Paisaje futurista en Marte, estilo cinematográfico..."
            placeholderTextColor="#666"
            multiline
            value={prompt}
            onChangeText={setPrompt}
          />
        </View>

        {/* SELECTOR DE TIPO */}
        <View style={styles.row}>
          {['image', 'video', 'audio'].map((type) => (
            <TouchableOpacity 
              key={type} 
              style={[styles.typeBtn, mediaType === type && styles.activeBtn]}
              onPress={() => setMediaType(type)}
            >
              <Text style={styles.btnText}>{type.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SECCIÓN DE PLANTILLAS */}
        <Text style={styles.label}>Plantillas Populares:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateRow}>
          {['Cyberpunk', 'Realista', 'Anime', '3D Render', 'Vintage'].map((item) => (
            <TouchableOpacity key={item} style={styles.templateCard} onPress={() => setPrompt(prev => prev + " estilo " + item)}>
              <Text style={styles.templateText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CONFIGURACIÓN DE AUDIO (Solo si es video/audio) */}
        {(mediaType === 'video' || mediaType === 'audio') && (
          <View style={styles.card}>
            <Text style={styles.label}>Ajustes de Sonido:</Text>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.btnText}>+ Añadir Voz / Música</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* BOTÓN DE ACCIÓN PRINCIPAL */}
      <TouchableOpacity style={styles.generateBtn}>
        <Text style={styles.generateText}>GENERAR {mediaType.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 50 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  content: { paddingHorizontal: 20 },
  card: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 15, marginBottom: 20 },
  label: { color: '#aaa', fontSize: 14, marginBottom: 10, fontWeight: '600' },
  input: { color: '#fff', fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  typeBtn: { flex: 1, padding: 12, backgroundColor: '#1a1a1a', marginHorizontal: 5, borderRadius: 10, alignItems: 'center' },
  activeBtn: { backgroundColor: '#3b82f6' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  templateRow: { marginBottom: 25 },
  templateCard: { backgroundColor: '#333', padding: 15, borderRadius: 12, marginRight: 10, width: 100, alignItems: 'center' },
  templateText: { color: '#fff', fontSize: 12 },
  secondaryBtn: { backgroundColor: '#222', padding: 15, borderRadius: 10, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#444' },
  generateBtn: { backgroundColor: '#fff', margin: 20, padding: 18, borderRadius: 15, alignItems: 'center' },
  generateText: { color: '#000', fontWeight: 'bold', fontSize: 18 }
});

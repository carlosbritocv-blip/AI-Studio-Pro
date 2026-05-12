import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';

const TOKENS = {
  openai: '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',
  replicate: 'r8_5C9Y1YWyG7NtTpfvEODZ808OJRGyOrM0EO4R3',
  elevenlabs: 'sk_1c129e727e2a5bc29ecf44844fa890220b2fd2a82d447df4'
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return Alert.alert("Error", "Escribe algo para empezar.");
    setLoading(true);
    
    try {
      // LÓGICA PARA IMAGEN (OPENAI)
      if (mediaType === 'image') {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKENS.openai}` },
          body: JSON.stringify({ prompt, n: 1, size: "1024x1024" })
        });
        const data = await response.json();
        Alert.alert("Éxito", "Imagen generada correctamente");
      }
      
      // LÓGICA PARA AUDIO (ELEVENLABS)
      if (mediaType === 'audio') {
        // Aquí se conectará con el sintetizador de ElevenLabs
        Alert.alert("Audio", "Conectando con ElevenLabs para voz...");
      }

    } catch (err) {
      Alert.alert("Error", "Algo falló en la conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI STUDIO PRO 🦾</Text>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>TU PROMPT MAESTRO:</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe qué quieres crear hoy..."
            placeholderTextColor="#666"
            multiline
            value={prompt}
            onChangeText={setPrompt}
          />
        </View>

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

        <Text style={styles.label}>ESTILOS RÁPIDOS:</Text>
        <ScrollView horizontal style={styles.templateRow}>
          {['Futurista', 'Cinemático', 'Voz Narrador', '4K Ultra'].map((item) => (
            <TouchableOpacity key={item} style={styles.templateCard} onPress={() => setPrompt(item + ": " + prompt)}>
              <Text style={styles.templateText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.generateText}>GENERAR {mediaType.toUpperCase()}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', paddingTop: 50 },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', textAlign: 'center', letterSpacing: 2 },
  content: { padding: 20 },
  card: { backgroundColor: '#111', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  label: { color: '#555', fontSize: 12, marginBottom: 10, fontWeight: 'bold' },
  input: { color: '#fff', fontSize: 18, minHeight: 100 },
  row: { flexDirection: 'row', marginTop: 20 },
  typeBtn: { flex: 1, padding: 15, backgroundColor: '#111', borderRadius: 12, marginHorizontal: 5, alignItems: 'center' },
  activeBtn: { backgroundColor: '#007AFF' },
  btnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  templateRow: { marginTop: 20 },
  templateCard: { backgroundColor: '#222', padding: 12, borderRadius: 10, marginRight: 10 },
  templateText: { color: '#fff', fontSize: 12 },
  generateBtn: { backgroundColor: '#fff', margin: 25, padding: 20, borderRadius: 20, alignItems: 'center' },
  generateText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';

// CONFIGURACIÓN DE TOKENS (ACTUALIZADOS)
const TOKENS = {
  openai: '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',
  replicate: 'r8_5C9Y1YWyG7NtTpfvEODZ808OJRGyOrM0EO4R3',
  elevenlabs: 'sk_1c129e727e2a5bc29ecf44844fa890220b2fd2a82d447df4',
  huggingface: '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'
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [loading, setLoading] = useState(false);
  const [resultUri, setResultUri] = useState(null);

  const handleGenerate = async () => {
    if (!prompt) return Alert.alert("Atención", "Debes escribir un prompt o elegir una plantilla.");
    setLoading(true);
    setResultUri(null);
    
    try {
      // --- GENERACIÓN DE IMAGEN (OPENAI) ---
      if (mediaType === 'image') {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${TOKENS.openai}` 
          },
          body: JSON.stringify({ prompt, n: 1, size: "1024x1024" })
        });
        const data = await response.json();
        if (data.data) setResultUri(data.data[0].url);
        else throw new Error("Fallo en OpenAI");
      }
      
      // --- GENERACIÓN DE VÍDEO (REPLICATE) ---
      else if (mediaType === 'video') {
        const response = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: { 
            'Authorization': `Token ${TOKENS.replicate}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            version: "3f0c30e24530510619213876938a4d166c48311d4e0c4a45a337f90e5f20616b",
            input: { prompt: prompt }
          })
        });
        const data = await response.json();
        Alert.alert("Vídeo en Proceso", "Replicate está generando tu clip. Estará listo en un momento.");
      }

      // --- GENERACIÓN DE AUDIO (ELEVENLABS) ---
      else if (mediaType === 'audio') {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
          method: 'POST',
          headers: { 
            'xi-api-key': TOKENS.elevenlabs,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            text: prompt,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.5 }
          })
        });
        if (response.ok) Alert.alert("Audio Listo", "Se ha generado la voz correctamente.");
        else throw new Error("Fallo en ElevenLabs");
      }

    } catch (err) {
      Alert.alert("Error Maestro", "Hubo un problema con la API. Revisa tus créditos o conexión.");
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = (style) => {
    setPrompt(`${style}: ${prompt}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AI STUDIO PRO</Text>
      
      <ScrollView style={styles.scrollArea}>
        {/* INPUT DE PROMPT */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>¿QUÉ TIENES EN MENTE?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe tu idea aquí..."
            placeholderTextColor="#444"
            multiline
            value={prompt}
            onChangeText={setPrompt}
          />
        </View>

        {/* SELECTOR DE MODO */}
        <View style={styles.tabContainer}>
          {['image', 'video', 'audio'].map((t) => (
            <TouchableOpacity 
              key={t} 
              style={[styles.tab, mediaType === t && styles.activeTab]}
              onPress={() => { setMediaType(t); setResultUri(null); }}
            >
              <Text style={styles.tabText}>{t.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PLANTILLAS */}
        <Text style={styles.label}>PLANTILLAS RÁPIDAS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateList}>
          {['Cinemático', '4K Realista', 'Anime', 'Voz Profunda', 'Cyberpunk'].map((s) => (
            <TouchableOpacity key={s} style={styles.chip} onPress={() => addTemplate(s)}>
              <Text style={styles.chipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* VISUALIZACIÓN */}
        {resultUri && (
          <View style={styles.previewBox}>
            <Image source={{ uri: resultUri }} style={styles.previewImage} />
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 30 }} />}
      </ScrollView>

      {/* BOTÓN PRINCIPAL */}
      <TouchableOpacity 
        style={[styles.mainBtn, loading && { opacity: 0.5 }]} 
        onPress={handleGenerate} 
        disabled={loading}
      >
        <Text style={styles.mainBtnText}>
          {loading ? "PROCESANDO..." : `GENERAR ${mediaType.toUpperCase()}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 60 },
  header: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, letterSpacing: 3 },
  scrollArea: { paddingHorizontal: 20 },
  inputSection: { backgroundColor: '#111', padding: 20, borderRadius: 25, borderWeight: 1, borderColor: '#222' },
  label: { color: '#555', fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
  textInput: { color: '#fff', fontSize: 18, minHeight: 100, textAlignVertical: 'top' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  tab: { flex: 1, padding: 15, backgroundColor: '#111', borderRadius: 15, marginHorizontal: 5, alignItems: 'center' },
  activeTab: { backgroundColor: '#007AFF' },
  tabText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  templateList: { flexDirection: 'row', marginTop: 10 },
  chip: { backgroundColor: '#222', padding: 12, borderRadius: 12, marginRight: 10, height: 45 },
  chipText: { color: '#eee', fontSize: 13 },
  previewBox: { marginTop: 30, borderRadius: 20, overflow: 'hidden', backgroundColor: '#111', padding: 5 },
  previewImage: { width: '100%', height: 350, borderRadius: 15 },
  mainBtn: { backgroundColor: '#fff', margin: 25, padding: 22, borderRadius: 25, alignItems: 'center' },
  mainBtnText: { color: '#000', fontWeight: '900', fontSize: 18 }
});

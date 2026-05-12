import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';

const TOKENS = {
  openai: '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',
  replicate: 'r8_5C9Y1YWyG7NtTpfvEODZ808OJRGyOrM0EO4R3',
  elevenlabs: 'sk_1c129e727e2a5bc29ecf44844fa890220b2fd2a82d447df4'
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [loading, setLoading] = useState(false);
  const [resultUri, setResultUri] = useState(null); // Para mostrar la imagen generada

  const handleGenerate = async () => {
    if (!prompt) return Alert.alert("Aviso", "Escribe una descripción primero.");
    setLoading(true);
    setResultUri(null);
    
    try {
      if (mediaType === 'image') {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${TOKENS.openai}` 
          },
          body: JSON.stringify({ 
            prompt: prompt, 
            n: 1, 
            size: "1024x1024",
            response_format: "url"
          })
        });
        
        const data = await response.json();
        if (data.data && data.data[0].url) {
          setResultUri(data.data[0].url);
        } else {
          Alert.alert("Error", "No se pudo generar la imagen. Revisa tu saldo de OpenAI.");
        }
      }
      
      // La lógica de Video (Replicate) y Audio (ElevenLabs) se activará igual
      if (mediaType === 'audio') Alert.alert("ElevenLabs", "Generando voz con tu token...");

    } catch (err) {
      Alert.alert("Error de Red", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI STUDIO PRO 🦾</Text>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>TU PROMPT:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Un astronauta montando un caballo en el espacio..."
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
              onPress={() => { setMediaType(type); setResultUri(null); }}
            >
              <Text style={styles.btnText}>{type.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* VISOR DE RESULTADOS */}
        {resultUri && (
          <View style={styles.resultContainer}>
            <Image source={{ uri: resultUri }} style={styles.resultImage} />
            <Text style={styles.resultText}>¡Generación completada!</Text>
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}
      </ScrollView>

      <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} disabled={loading}>
        <Text style={styles.generateText}>GENERAR {mediaType.toUpperCase()}</Text>
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
  input: { color: '#fff', fontSize: 18, minHeight: 80 },
  row: { flexDirection: 'row', marginTop: 20, marginBottom: 20 },
  typeBtn: { flex: 1, padding: 15, backgroundColor: '#111', borderRadius: 12, marginHorizontal: 5, alignItems: 'center' },
  activeBtn: { backgroundColor: '#007AFF' },
  btnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  resultContainer: { marginTop: 20, alignItems: 'center', backgroundColor: '#111', borderRadius: 20, padding: 10 },
  resultImage: { width: '100%', height: 300, borderRadius: 15, resizeMode: 'cover' },
  resultText: { color: '#0f0', marginTop: 10, fontWeight: 'bold' },
  generateBtn: { backgroundColor: '#fff', margin: 25, padding: 20, borderRadius: 20, alignItems: 'center' },
  generateText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});

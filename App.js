import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image, SafeAreaView, Share, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');

export default function App() {
  const [screen, setScreen] = useState('menu'); 
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultUri, setResultUri] = useState(null);
  const [imageToEdit, setImageToEdit] = useState(null);

  const TOKENS = { openai: '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' };

  // --- LÓGICA ---
  const handleGenerate = async (customPrompt) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt) return Alert.alert("Aviso", "Escribe algo o elige una plantilla.");
    setLoading(true);
    try {
      const resp = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKENS.openai}` },
        body: JSON.stringify({ prompt: finalPrompt, n: 1, size: "1024x1024" })
      });
      const data = await resp.json();
      if (data.data) {
        setResultUri(data.data[0].url);
        setScreen('ia');
      }
    } catch (e) { Alert.alert("Error", "Fallo de conexión"); }
    finally { setLoading(false); }
  };

  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!res.canceled) {
      setImageToEdit(res.assets[0].uri);
      setScreen('edit');
    }
  };

  // --- PANTALLA: MENÚ PRINCIPAL ---
  if (screen === 'menu') return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerArea}>
          <Image source={require('./assets/splash.png')} style={styles.mainLogo} />
          <Text style={styles.mainTitle}>AI STUDIO PRO</Text>
          <Text style={styles.mainSubtitle}>¿Qué quieres hacer hoy?</Text>
        </View>

        <View style={styles.mainButtonsRow}>
          <TouchableOpacity style={styles.bigCardIA} onPress={() => setScreen('ia')}>
            <Text style={styles.cardEmoji}>✨</Text>
            <Text style={styles.cardTitle}>CREACIÓN IA</Text>
            <Text style={styles.cardSubtitle}>Crear con plantilla...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bigCardEdit} onPress={pickImage}>
            <Text style={styles.cardEmoji}>🎨</Text>
            <Text style={styles.cardTitle}>EDITOR PRO</Text>
            <Text style={styles.cardSubtitle}>Edita tus archivos</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>PLANTILLAS DESTACADAS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroll}>
          {['Realismo 8K', 'Anime Style', 'Cinemático 3D', 'Pop Art'].map((t, i) => (
            <TouchableOpacity key={i} style={styles.templateCard} onPress={() => {setPrompt(t); setScreen('ia');}}>
              <View style={styles.templateImgPlaceholder}><Text style={{color: '#fff', fontSize: 10}}>{t}</Text></View>
              <Text style={styles.templateText}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>HERRAMIENTAS DE EDICIÓN</Text>
        <View style={styles.editGrid}>
          {['Filtros Pro', 'Recorte', 'Brillo', 'Contraste', 'Curvas AI', 'Texto AI'].map((tool) => (
            <TouchableOpacity key={tool} style={styles.gridTool}>
              <Text style={styles.gridToolText}>{tool}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // --- PANTALLAS SECUNDARIAS (IA / EDIT) ---
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('menu')} style={styles.backButton}>
        <Text style={{color: '#007AFF', fontWeight: 'bold'}}>← VOLVER AL MENÚ</Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={{padding: 20}}>
        <Text style={styles.sectionLabel}>{screen === 'ia' ? 'LABORATORIO IA' : 'EDITOR PRO'}</Text>
        
        {screen === 'ia' ? (
          <View>
            <TextInput style={styles.inputIA} placeholder="Describe tu idea..." placeholderTextColor="#444" multiline value={prompt} onChangeText={setPrompt} />
            <TouchableOpacity style={styles.genBtnIA} onPress={() => handleGenerate()}>
              {loading ? <ActivityIndicator color="#000" /> : <Text style={{fontWeight: 'bold'}}>GENERAR AHORA</Text>}
            </TouchableOpacity>
            {resultUri && <Image source={{uri: resultUri}} style={styles.resultPreview} />}
          </View>
        ) : (
          <View>
            {imageToEdit && <Image source={{uri: imageToEdit}} style={styles.resultPreview} />}
            <TouchableOpacity style={styles.genBtnIA} onPress={pickImage}><Text style={{fontWeight: 'bold'}}>CAMBIAR IMAGEN</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerArea: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  mainLogo: { width: 80, height: 80, borderRadius: 20, marginBottom: 15 },
  mainTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', letterSpacing: 1 },
  mainSubtitle: { color: '#666', fontSize: 14 },
  mainButtonsRow: { flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-between', marginBottom: 30 },
  bigCardIA: { width: (width/2)-25, backgroundColor: '#007AFF', padding: 20, borderRadius: 25, alignItems: 'center' },
  bigCardEdit: { width: (width/2)-25, backgroundColor: '#1a1a1a', padding: 20, borderRadius: 25, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  cardEmoji: { fontSize: 30, marginBottom: 10 },
  cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cardSubtitle: { color: '#e0e0e0', fontSize: 10, marginTop: 4 },
  sectionLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 15 },
  templateScroll: { paddingLeft: 20, marginBottom: 30 },
  templateCard: { marginRight: 15, alignItems: 'center' },
  templateImgPlaceholder: { width: 80, height: 80, backgroundColor: '#111', borderRadius: 15, borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  templateText: { color: '#888', fontSize: 11, marginTop: 8 },
  editGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  gridTool: { width: (width/3)-20, backgroundColor: '#111', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center' },
  gridToolText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  backButton: { padding: 20 },
  inputIA: { backgroundColor: '#0a0a0a', color: '#fff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#222', minHeight: 100, fontSize: 16 },
  genBtnIA: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginTop: 20, alignItems: 'center' },
  resultPreview: { width: '100%', height: 350, borderRadius: 25, marginTop: 20 }
});

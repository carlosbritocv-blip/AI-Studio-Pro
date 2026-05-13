// app/generate/video.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { enhancePrompt } from '../../services/aiService';

const VIDEO_STYLES = [
  { id: 'cinematic', label: '🎬 Cinemático' },
  { id: 'animation', label: '🎨 Animación' },
  { id: 'realistic', label: '📷 Realista' },
  { id: 'timelapse', label: '⏩ Timelapse' },
  { id: 'slowmo', label: '🐢 Cámara lenta' },
  { id: 'vintage', label: '📼 Vintage' },
];

const DURATIONS = [
  { id: '4', label: '4s' },
  { id: '8', label: '8s' },
  { id: '16', label: '16s' },
];

export default function GenerateVideoScreen() {
  const router = useRouter();
  const { openaiKey, useCredit } = useApp();

  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [selectedDuration, setSelectedDuration] = useState('4');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [generated, setGenerated] = useState(false);

  const pickReferenceImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setReferenceImage(result.assets[0].uri);
  };

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    if (!openaiKey) { Alert.alert('API Key requerida', 'Configura tu OpenAI API Key.'); return; }
    setEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt, openaiKey, 'video');
      setPrompt(enhanced);
    } catch { Alert.alert('Error', 'No se pudo mejorar el prompt.'); }
    finally { setEnhancing(false); }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { Alert.alert('Prompt vacío', 'Describe el vídeo que quieres crear.'); return; }
    setLoading(true);
    // Simulated generation — integrate RunwayML / Pika / Kling APIs
    await new Promise(r => setTimeout(r, 3000));
    setLoading(false);
    setGenerated(true);
    useCredit();
    Alert.alert(
      '🎬 Vídeo en proceso',
      'La generación de vídeo con IA requiere integrar RunwayML, Pika Labs o Kling AI. Añade tu API Key de RunwayML en Ajustes para activar esta función.\n\nPor ahora el prompt ha sido procesado y está listo.',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎥 Generar Vídeo IA</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerTitle}>⚡ Powered by RunwayML / Pika</Text>
          <Text style={styles.infoBannerText}>
            Genera vídeos de hasta 16 segundos desde texto o imagen de referencia.
            Configura tu API Key de RunwayML en Ajustes.
          </Text>
        </View>

        {/* Reference Image */}
        <Text style={styles.label}>Imagen de referencia (opcional)</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickReferenceImage}>
          {referenceImage ? (
            <Image source={{ uri: referenceImage }} style={styles.refImage} resizeMode="cover" />
          ) : (
            <View style={styles.imagePickerPlaceholder}>
              <Text style={styles.imagePickerEmoji}>🖼️</Text>
              <Text style={styles.imagePickerText}>Toca para seleccionar imagen base</Text>
              <Text style={styles.imagePickerSub}>Image-to-Video</Text>
            </View>
          )}
        </TouchableOpacity>
        {referenceImage && (
          <TouchableOpacity onPress={() => setReferenceImage(null)}>
            <Text style={styles.clearBtn}>✕ Quitar imagen</Text>
          </TouchableOpacity>
        )}

        {/* Prompt */}
        <Text style={styles.label}>Describe el vídeo</Text>
        <TextInput
          style={styles.promptInput}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Ej: Una ciudad futurista de noche con autos voladores, cámara cinematográfica, movimiento suave..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.enhanceBtn, enhancing && { opacity: 0.6 }]}
          onPress={handleEnhance}
          disabled={enhancing}
        >
          {enhancing
            ? <ActivityIndicator size="small" color={COLORS.primaryLight} />
            : <Text style={styles.enhanceBtnText}>🪄 Mejorar prompt con IA</Text>
          }
        </TouchableOpacity>

        {/* Style */}
        <Text style={styles.label}>Estilo visual</Text>
        <View style={styles.stylesGrid}>
          {VIDEO_STYLES.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[styles.styleChip, selectedStyle === s.id && styles.styleChipActive]}
              onPress={() => setSelectedStyle(s.id)}
            >
              <Text style={[styles.styleChipText, selectedStyle === s.id && styles.styleChipTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Duration */}
        <Text style={styles.label}>Duración</Text>
        <View style={styles.durationRow}>
          {DURATIONS.map(d => (
            <TouchableOpacity
              key={d.id}
              style={[styles.durationBtn, selectedDuration === d.id && styles.durationBtnActive]}
              onPress={() => setSelectedDuration(d.id)}
            >
              <Text style={[styles.durationText, selectedDuration === d.id && styles.durationTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.tipsBox}>
          <Text style={styles.tipsTitle}>💡 Consejos para mejores vídeos</Text>
          <Text style={styles.tipItem}>• Describe el movimiento de cámara (zoom in, paneo lento...)</Text>
          <Text style={styles.tipItem}>• Menciona la iluminación (atardecer, neón, luz natural...)</Text>
          <Text style={styles.tipItem}>• Especifica el estilo (cinemático 4K, documental...)</Text>
          <Text style={styles.tipItem}>• Usa imágenes de referencia para mejor coherencia</Text>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateBtn, loading && { opacity: 0.7 }]}
          onPress={handleGenerate}
          disabled={loading}
        >
          <LinearGradient
            colors={['#059669', '#10b981', '#06b6d4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.generateGradient}
          >
            {loading
              ? <><ActivityIndicator color="#fff" size="small" /><Text style={styles.generateBtnText}>  Procesando...</Text></>
              : <Text style={styles.generateBtnText}>🎥 Generar Vídeo</Text>
            }
          </LinearGradient>
        </TouchableOpacity>

        {/* Prompt Summary */}
        {generated && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>✅ Prompt procesado</Text>
            <Text style={styles.resultPrompt}>{prompt}</Text>
            <Text style={styles.resultNote}>
              Configura RunwayML API Key en Ajustes → la generación de vídeo se activará automáticamente.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { padding: 4 },
  backBtnText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.md },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text },
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 40 },
  label: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },

  infoBanner: {
    backgroundColor: '#06b6d410', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: '#06b6d430',
  },
  infoBannerTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.accent, marginBottom: 4 },
  infoBannerText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, lineHeight: 18 },

  imagePicker: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed',
    overflow: 'hidden', minHeight: 140,
  },
  imagePickerPlaceholder: { alignItems: 'center', justifyContent: 'center', padding: SPACING.xl, gap: 8 },
  imagePickerEmoji: { fontSize: 36 },
  imagePickerText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  imagePickerSub: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  refImage: { width: '100%', height: 180 },
  clearBtn: { color: COLORS.error, fontSize: FONTS.sizes.sm, textAlign: 'center' },

  promptInput: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md,
    color: COLORS.text, fontSize: FONTS.sizes.md, borderWidth: 1,
    borderColor: COLORS.border, minHeight: 110, lineHeight: 22,
  },
  enhanceBtn: {
    backgroundColor: '#7c3aed20', borderRadius: RADIUS.md,
    padding: SPACING.md, alignItems: 'center',
    borderWidth: 1, borderColor: '#7c3aed60',
  },
  enhanceBtnText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },

  stylesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  styleChip: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  styleChipActive: { backgroundColor: '#06b6d420', borderColor: COLORS.accent },
  styleChipText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  styleChipTextActive: { color: COLORS.accent, fontWeight: FONTS.weights.semibold },

  durationRow: { flexDirection: 'row', gap: SPACING.sm },
  durationBtn: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  durationBtnActive: { backgroundColor: '#06b6d420', borderColor: COLORS.accent },
  durationText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  durationTextActive: { color: COLORS.accent },

  tipsBox: {
    backgroundColor: '#f59e0b10', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: '#f59e0b30', gap: 6,
  },
  tipsTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.gold, marginBottom: 4 },
  tipItem: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, lineHeight: 18 },

  generateBtn: { borderRadius: RADIUS.xl, overflow: 'hidden', marginTop: SPACING.sm },
  generateGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: SPACING.lg, gap: 8,
  },
  generateBtnText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },

  resultCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.success + '40', gap: SPACING.sm,
  },
  resultTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.success },
  resultPrompt: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 20 },
  resultNote: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, lineHeight: 18 },
});

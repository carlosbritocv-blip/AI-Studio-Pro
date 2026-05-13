// app/generate/image.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Image, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import {
  generateImageDallE,
  generateImageStability,
  enhancePrompt,
} from '../../services/aiService';
import { saveToGallery, shareImage } from '../../services/imageService';

const STYLES = [
  { id: 'photo', label: '📷 Foto realista' },
  { id: 'painting', label: '🎨 Pintura' },
  { id: 'anime', label: '🎌 Anime' },
  { id: 'cartoon', label: '🐭 Cartoon' },
  { id: '3d', label: '💎 3D' },
  { id: 'sketch', label: '✏️ Boceto' },
  { id: 'watercolor', label: '🌊 Acuarela' },
  { id: 'oil', label: '🖌️ Óleo' },
];

const SIZES = [
  { id: '1024x1024', label: '1:1 Cuadrado' },
  { id: '1792x1024', label: '16:9 Paisaje' },
  { id: '1024x1792', label: '9:16 Story' },
];

const ENGINES = [
  { id: 'dalle', label: 'DALL-E 3', desc: 'OpenAI — Máxima calidad' },
  { id: 'stability', label: 'Stable Diffusion', desc: 'Stability AI — Más control' },
];

export default function GenerateImageScreen() {
  const router = useRouter();
  const { openaiKey, stabilityKey, useCredit } = useApp();

  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('photo');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [selectedEngine, setSelectedEngine] = useState('dalle');
  const [hdQuality, setHdQuality] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState('');

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    if (!openaiKey) { Alert.alert('API Key requerida', 'Configura tu OpenAI API Key en Ajustes.'); return; }
    setEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt, openaiKey, 'image');
      setPrompt(enhanced);
    } catch (e) {
      Alert.alert('Error', 'No se pudo mejorar el prompt.');
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { Alert.alert('Escribe un prompt', 'Describe lo que quieres crear.'); return; }
    if (selectedEngine === 'dalle' && !openaiKey) {
      Alert.alert('API Key requerida', 'Configura tu OpenAI API Key en Ajustes.'); return;
    }
    if (selectedEngine === 'stability' && !stabilityKey) {
      Alert.alert('API Key requerida', 'Configura tu Stability AI API Key en Ajustes.'); return;
    }

    const styleModifiers: Record<string, string> = {
      photo: ', photorealistic, high detail, professional photography',
      painting: ', oil painting, artistic, masterpiece',
      anime: ', anime style, manga, cel shaded',
      cartoon: ', cartoon style, vibrant colors, animated',
      '3d': ', 3D render, octane render, highly detailed, CGI',
      sketch: ', pencil sketch, hand drawn, detailed lines',
      watercolor: ', watercolor painting, soft colors, artistic',
      oil: ', oil painting, textured canvas, classical art',
    };

    const fullPrompt = prompt + (styleModifiers[selectedStyle] || '');
    setLoading(true);
    setError('');
    setGeneratedUrl(null);

    try {
      let url: string;
      if (selectedEngine === 'dalle') {
        url = await generateImageDallE({
          prompt: fullPrompt,
          apiKey: openaiKey,
          size: selectedSize as any,
          quality: hdQuality ? 'hd' : 'standard',
          style: 'vivid',
        });
      } else {
        const [w, h] = selectedSize.split('x').map(Number);
        url = await generateImageStability({
          prompt: fullPrompt,
          apiKey: stabilityKey,
          negativePrompt,
          width: w,
          height: h,
        });
      }
      setGeneratedUrl(url);
      useCredit();
    } catch (e: any) {
      const msg = e?.response?.data?.error?.message || e?.message || 'Error desconocido';
      setError(msg);
      Alert.alert('Error al generar', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>✨ Generar Imagen IA</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Engine Selector */}
        <Text style={styles.label}>Motor de IA</Text>
        <View style={styles.engineRow}>
          {ENGINES.map(engine => (
            <TouchableOpacity
              key={engine.id}
              style={[styles.engineCard, selectedEngine === engine.id && styles.engineCardActive]}
              onPress={() => setSelectedEngine(engine.id)}
            >
              <Text style={[styles.engineLabel, selectedEngine === engine.id && styles.engineLabelActive]}>
                {engine.label}
              </Text>
              <Text style={styles.engineDesc}>{engine.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Prompt */}
        <Text style={styles.label}>Describe tu imagen</Text>
        <TextInput
          style={styles.promptInput}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Ej: Un dragón dorado sobrevolando una ciudad futurista al atardecer..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.enhanceBtn, enhancing && { opacity: 0.6 }]}
          onPress={handleEnhancePrompt}
          disabled={enhancing}
        >
          {enhancing
            ? <ActivityIndicator size="small" color={COLORS.primaryLight} />
            : <Text style={styles.enhanceBtnText}>🪄 Mejorar prompt con IA</Text>
          }
        </TouchableOpacity>

        {/* Negative Prompt (Stability only) */}
        {selectedEngine === 'stability' && (
          <>
            <Text style={styles.label}>Prompt negativo (opcional)</Text>
            <TextInput
              style={[styles.promptInput, { minHeight: 60 }]}
              value={negativePrompt}
              onChangeText={setNegativePrompt}
              placeholder="Lo que NO quieres en la imagen: blurry, ugly, low quality..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              textAlignVertical="top"
            />
          </>
        )}

        {/* Style */}
        <Text style={styles.label}>Estilo artístico</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {STYLES.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[styles.chip, selectedStyle === s.id && styles.chipActive]}
              onPress={() => setSelectedStyle(s.id)}
            >
              <Text style={[styles.chipText, selectedStyle === s.id && styles.chipTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Size */}
        <Text style={styles.label}>Tamaño</Text>
        <View style={styles.sizeRow}>
          {SIZES.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[styles.sizeBtn, selectedSize === s.id && styles.sizeBtnActive]}
              onPress={() => setSelectedSize(s.id)}
            >
              <Text style={[styles.sizeBtnText, selectedSize === s.id && styles.sizeBtnTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* HD Toggle (DALL-E only) */}
        {selectedEngine === 'dalle' && (
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Alta calidad HD</Text>
              <Text style={styles.toggleDesc}>Mayor detalle, más tiempo</Text>
            </View>
            <Switch
              value={hdQuality}
              onValueChange={setHdQuality}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={hdQuality ? COLORS.primaryLight : COLORS.textMuted}
            />
          </View>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateBtn, loading && { opacity: 0.7 }]}
          onPress={handleGenerate}
          disabled={loading}
        >
          <LinearGradient
            colors={['#7c3aed', '#a855f7', '#ec4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.generateGradient}
          >
            {loading
              ? <><ActivityIndicator color="#fff" size="small" /><Text style={styles.generateBtnText}>  Generando...</Text></>
              : <Text style={styles.generateBtnText}>✨ Generar Imagen</Text>
            }
          </LinearGradient>
        </TouchableOpacity>

        {/* Result */}
        {generatedUrl && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>✅ Imagen generada</Text>
            <Image
              source={{ uri: generatedUrl }}
              style={styles.resultImage}
              resizeMode="contain"
            />
            <View style={styles.resultActions}>
              <TouchableOpacity
                style={styles.resultBtn}
                onPress={() => saveToGallery(generatedUrl).then(ok =>
                  Alert.alert(ok ? '✅ Guardada' : '❌ Error', ok ? 'Imagen guardada en galería.' : 'No se pudo guardar.')
                )}
              >
                <Text style={styles.resultBtnText}>💾 Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resultBtn}
                onPress={() => shareImage(generatedUrl)}
              >
                <Text style={styles.resultBtnText}>📤 Compartir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.resultBtn, { borderColor: COLORS.accent }]}
                onPress={() => router.push({ pathname: '/editor/image', params: { uri: generatedUrl } })}
              >
                <Text style={[styles.resultBtnText, { color: COLORS.accent }]}>✏️ Editar</Text>
              </TouchableOpacity>
            </View>
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
  label: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },

  engineRow: { flexDirection: 'row', gap: SPACING.sm },
  engineCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border,
  },
  engineCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryGlow },
  engineLabel: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary },
  engineLabelActive: { color: COLORS.primaryLight },
  engineDesc: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

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

  chipScroll: { marginHorizontal: -SPACING.lg, paddingHorizontal: SPACING.lg },
  chip: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  chipTextActive: { color: COLORS.primaryLight, fontWeight: FONTS.weights.semibold },

  sizeRow: { flexDirection: 'row', gap: SPACING.sm },
  sizeBtn: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    padding: SPACING.sm, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  sizeBtnActive: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.primary },
  sizeBtnText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.medium },
  sizeBtnTextActive: { color: COLORS.primaryLight },

  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  toggleLabel: { fontSize: FONTS.sizes.md, color: COLORS.text, fontWeight: FONTS.weights.medium },
  toggleDesc: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  generateBtn: { borderRadius: RADIUS.xl, overflow: 'hidden', marginTop: SPACING.sm },
  generateGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: SPACING.lg, gap: 8,
  },
  generateBtnText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },

  resultCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md,
  },
  resultTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.success },
  resultImage: { width: '100%', height: 300, borderRadius: RADIUS.lg, backgroundColor: '#000' },
  resultActions: { flexDirection: 'row', gap: SPACING.sm },
  resultBtn: {
    flex: 1, borderRadius: RADIUS.md, padding: SPACING.sm,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary,
  },
  resultBtnText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },
});

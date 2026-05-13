// app/(tabs)/create.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const CREATE_OPTIONS = [
  {
    id: 'text-to-image',
    emoji: '✍️→🖼️',
    title: 'Texto a Imagen',
    desc: 'Escribe una descripción y la IA creará tu imagen',
    gradient: ['#7c3aed', '#a855f7'],
    tags: ['DALL-E 3', 'Stable Diffusion'],
    route: '/generate/image',
  },
  {
    id: 'text-to-video',
    emoji: '✍️→🎬',
    title: 'Texto a Vídeo',
    desc: 'Describe una escena y genera un vídeo con IA',
    gradient: ['#059669', '#10b981'],
    tags: ['RunwayML', 'Pika Labs'],
    route: '/generate/video',
  },
  {
    id: 'image-to-image',
    emoji: '🖼️→🖼️',
    title: 'Imagen a Imagen',
    desc: 'Transforma o edita una imagen existente con IA',
    gradient: ['#0891b2', '#06b6d4'],
    tags: ['DALL-E Edit', 'Img2Img'],
    route: '/editor/image',
  },
  {
    id: 'image-to-video',
    emoji: '🖼️→🎬',
    title: 'Imagen a Vídeo',
    desc: 'Anima una foto convirtiéndola en vídeo',
    gradient: ['#dc2626', '#ef4444'],
    tags: ['RunwayML', 'Kling AI'],
    route: '/generate/video',
  },
  {
    id: 'caption-gen',
    emoji: '💬',
    title: 'Generar Caption',
    desc: 'IA genera captions perfectos para redes sociales',
    gradient: ['#d97706', '#f59e0b'],
    tags: ['GPT-4o', 'Instagram', 'TikTok'],
    route: '/editor/image',
  },
  {
    id: 'edit-photo',
    emoji: '✏️',
    title: 'Editar Foto',
    desc: 'Filtros, recorte, rotación y ajustes avanzados',
    gradient: ['#4f46e5', '#6366f1'],
    tags: ['Filtros', 'Recorte', 'Ajustes'],
    route: '/editor/image',
  },
  {
    id: 'edit-video',
    emoji: '🎞️',
    title: 'Editar Vídeo',
    desc: 'Recorta, cambia velocidad y ajusta tu vídeo',
    gradient: ['#0f766e', '#14b8a6'],
    tags: ['Cortar', 'Velocidad', 'Audio'],
    route: '/editor/video',
  },
  {
    id: 'template',
    emoji: '🎨',
    title: 'Usar Plantilla',
    desc: 'Elige entre +15 plantillas para redes sociales',
    gradient: ['#9d174d', '#db2777'],
    tags: ['Instagram', 'TikTok', 'YouTube'],
    route: '/(tabs)/templates',
  },
];

export default function CreateScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ Crear</Text>
        <Text style={styles.headerSubtitle}>¿Qué quieres crear hoy?</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {CREATE_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.id}
            style={styles.card}
            onPress={() => router.push(option.route as any)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={option.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardEmoji}>{option.emoji}</Text>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDesc}>{option.desc}</Text>
                  <View style={styles.cardTags}>
                    {option.tags.map(tag => (
                      <View key={tag} style={styles.cardTag}>
                        <Text style={styles.cardTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  headerSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },

  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 32 },

  card: { borderRadius: RADIUS.xl, overflow: 'hidden' },
  cardGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  cardEmoji: { fontSize: 28 },
  cardInfo: { flex: 1, gap: 4 },
  cardTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: '#fff' },
  cardDesc: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.85)', lineHeight: 18 },
  cardTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  cardTag: {
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  cardTagText: { color: 'rgba(255,255,255,0.9)', fontSize: 10, fontWeight: '600' },
  cardArrow: { color: 'rgba(255,255,255,0.7)', fontSize: 28, fontWeight: '300' },
});

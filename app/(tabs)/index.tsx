// app/(tabs)/index.tsx
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ImageBackground, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const FEATURES = [
  {
    id: 'edit-image',
    emoji: '🖼️',
    title: 'Editar Imagen',
    desc: 'Recorta, filtra y mejora tus fotos',
    gradient: ['#7c3aed', '#a855f7'],
    route: '/editor/image',
  },
  {
    id: 'edit-video',
    emoji: '🎬',
    title: 'Editar Vídeo',
    desc: 'Recorta y edita tus vídeos',
    gradient: ['#0891b2', '#06b6d4'],
    route: '/editor/video',
  },
  {
    id: 'gen-image',
    emoji: '✨',
    title: 'Generar Imagen IA',
    desc: 'Crea imágenes con inteligencia artificial',
    gradient: ['#ec4899', '#f97316'],
    route: '/generate/image',
  },
  {
    id: 'gen-video',
    emoji: '🎥',
    title: 'Generar Vídeo IA',
    desc: 'Crea vídeos a partir de texto',
    gradient: ['#059669', '#10b981'],
    route: '/generate/video',
  },
];

const QUICK_ACTIONS = [
  { emoji: '📷', label: 'Cámara', route: '/editor/image' },
  { emoji: '📁', label: 'Galería', route: '/editor/image' },
  { emoji: '🎨', label: 'Plantillas', route: '/(tabs)/templates' },
  { emoji: '🎵', label: 'Música', route: '/(tabs)/templates' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { openaiKey, credits } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola 👋</Text>
            <Text style={styles.title}>AI Studio Pro</Text>
          </View>
          <TouchableOpacity
            style={styles.creditsChip}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.creditsText}>⚡ {credits}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <LinearGradient
          colors={['#7c3aed', '#a855f7', '#ec4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroEmoji}>🚀</Text>
          <Text style={styles.heroTitle}>Crea con IA</Text>
          <Text style={styles.heroSubtitle}>
            Genera y edita imágenes y vídeos increíbles con inteligencia artificial
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => router.push('/generate/image')}
          >
            <Text style={styles.heroButtonText}>✨ Empezar a crear</Text>
          </TouchableOpacity>

          {!openaiKey && (
            <TouchableOpacity
              style={styles.heroWarning}
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.heroWarningText}>
                ⚠️ Configura tu API Key en Ajustes
              </Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              onPress={() => router.push(action.route as any)}
            >
              <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>¿Qué quieres hacer?</Text>
        <View style={styles.featuresGrid}>
          {FEATURES.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => router.push(feature.route as any)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={feature.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featureGradient}
              >
                <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Consejo del día</Text>
          <Text style={styles.tipText}>
            Usa el "Mejorador de Prompt" en la generación de imágenes para obtener resultados mucho más detallados y profesionales.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
  },
  creditsChip: {
    backgroundColor: '#7c3aed20',
    borderWidth: 1,
    borderColor: '#7c3aed60',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  creditsText: {
    color: COLORS.primaryLight,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },

  hero: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  heroEmoji: { fontSize: 40, marginBottom: SPACING.sm },
  heroTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: '#fff',
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  heroButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginBottom: SPACING.sm,
  },
  heroButtonText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  heroWarning: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: SPACING.sm,
  },
  heroWarningText: { color: '#fbbf24', fontSize: FONTS.sizes.sm },

  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },

  quickActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  quickAction: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  quickActionEmoji: { fontSize: 22 },
  quickActionLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  featureCard: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  featureGradient: {
    padding: SPACING.lg,
    minHeight: 150,
    justifyContent: 'flex-end',
  },
  featureEmoji: { fontSize: 32, marginBottom: SPACING.sm },
  featureTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: '#fff',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16,
  },

  tipCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#7c3aed30',
    gap: SPACING.sm,
  },
  tipTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primaryLight,
  },
  tipText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

// app/(tabs)/settings.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Switch, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function SettingsScreen() {
  const { openaiKey, stabilityKey, setOpenaiKey, setStabilityKey, saveKeys, credits } = useApp();
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showStabilityKey, setShowStabilityKey] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!openaiKey.startsWith('sk-') && openaiKey.length > 0) {
      Alert.alert('⚠️ API Key inválida', 'La OpenAI API Key debe empezar con "sk-"');
      return;
    }
    await saveKeys();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    Alert.alert('✅ Guardado', 'Las API Keys han sido guardadas de forma segura en tu dispositivo.');
  };

  const openLink = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Credits */}
        <View style={styles.creditsCard}>
          <View style={styles.creditsLeft}>
            <Text style={styles.creditsEmoji}>⚡</Text>
            <View>
              <Text style={styles.creditsLabel}>Créditos restantes</Text>
              <Text style={styles.creditsValue}>{credits} generaciones</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.creditsBtn} onPress={() => Alert.alert('💎 Pro', 'La versión Pro elimina el límite de créditos. Disponible próximamente en Play Store.')}>
            <Text style={styles.creditsBtnText}>⬆ Pro</Text>
          </TouchableOpacity>
        </View>

        {/* API Keys Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔑 API Keys</Text>
          <Text style={styles.sectionSubtitle}>
            Tus API Keys se guardan localmente en tu dispositivo y nunca se envían a nuestros servidores.
          </Text>

          {/* OpenAI */}
          <View style={styles.keyCard}>
            <View style={styles.keyHeader}>
              <View style={styles.keyLogo}>
                <Text style={styles.keyLogoText}>🤖</Text>
              </View>
              <View style={styles.keyInfo}>
                <Text style={styles.keyName}>OpenAI (DALL-E 3 + GPT-4o)</Text>
                <Text style={styles.keyStatus}>
                  {openaiKey ? '✅ Configurada' : '❌ No configurada'}
                </Text>
              </View>
            </View>
            <View style={styles.keyInputRow}>
              <TextInput
                style={styles.keyInput}
                value={openaiKey}
                onChangeText={setOpenaiKey}
                placeholder="sk-proj-..."
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showOpenaiKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowOpenaiKey(!showOpenaiKey)}>
                <Text style={styles.eyeBtnText}>{showOpenaiKey ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => openLink('https://platform.openai.com/api-keys')}>
              <Text style={styles.keyLink}>→ Obtener API Key gratuita en platform.openai.com</Text>
            </TouchableOpacity>
          </View>

          {/* Stability AI */}
          <View style={styles.keyCard}>
            <View style={styles.keyHeader}>
              <View style={styles.keyLogo}>
                <Text style={styles.keyLogoText}>🎨</Text>
              </View>
              <View style={styles.keyInfo}>
                <Text style={styles.keyName}>Stability AI (Stable Diffusion)</Text>
                <Text style={styles.keyStatus}>
                  {stabilityKey ? '✅ Configurada' : '❌ No configurada'}
                </Text>
              </View>
            </View>
            <View style={styles.keyInputRow}>
              <TextInput
                style={styles.keyInput}
                value={stabilityKey}
                onChangeText={setStabilityKey}
                placeholder="sk-..."
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showStabilityKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowStabilityKey(!showStabilityKey)}>
                <Text style={styles.eyeBtnText}>{showStabilityKey ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => openLink('https://platform.stability.ai/account/keys')}>
              <Text style={styles.keyLink}>→ Obtener API Key en platform.stability.ai</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saved && { backgroundColor: COLORS.success }]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>{saved ? '✅ Guardado' : '💾 Guardar API Keys'}</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎛️ Preferencias</Text>

          {[
            { label: 'Notificaciones', sub: 'Avisos cuando se complete una generación', value: notifications, setter: setNotifications },
            { label: 'Autoguardar', sub: 'Guardar automáticamente en galería', value: autoSave, setter: setAutoSave },
            { label: 'Alta calidad', sub: 'DALL-E HD por defecto (usa más créditos)', value: highQuality, setter: setHighQuality },
          ].map(pref => (
            <View key={pref.label} style={styles.prefRow}>
              <View>
                <Text style={styles.prefLabel}>{pref.label}</Text>
                <Text style={styles.prefSub}>{pref.sub}</Text>
              </View>
              <Switch
                value={pref.value}
                onValueChange={pref.setter}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={pref.value ? COLORS.primaryLight : COLORS.textMuted}
              />
            </View>
          ))}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Acerca de</Text>
          {[
            { label: '🔒 Política de privacidad', url: 'https://example.com/privacy' },
            { label: '📋 Términos de uso', url: 'https://example.com/terms' },
            { label: '⭐ Valorar en Play Store', url: 'https://play.google.com' },
            { label: '💬 Soporte', url: 'mailto:support@aistudiopro.app' },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.aboutRow} onPress={() => openLink(item.url)}>
              <Text style={styles.aboutLabel}>{item.label}</Text>
              <Text style={styles.aboutArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>AI Studio Pro v1.0.0</Text>
          <Text style={styles.footerSub}>Hecho con ❤️ para creadores</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  content: { padding: SPACING.lg, gap: SPACING.xl, paddingBottom: 40 },

  creditsCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#7c3aed20', borderRadius: RADIUS.xl,
    padding: SPACING.lg, borderWidth: 1, borderColor: '#7c3aed40',
  },
  creditsLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  creditsEmoji: { fontSize: 32 },
  creditsLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  creditsValue: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.primaryLight },
  creditsBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  creditsBtnText: { color: '#fff', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },

  section: { gap: SPACING.md },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text },
  sectionSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },

  keyCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md,
  },
  keyHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  keyLogo: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center',
  },
  keyLogoText: { fontSize: 22 },
  keyInfo: { flex: 1 },
  keyName: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  keyStatus: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 2 },
  keyInputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceLight, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  keyInput: { flex: 1, padding: SPACING.md, color: COLORS.text, fontSize: FONTS.sizes.sm },
  eyeBtn: { padding: SPACING.md },
  eyeBtnText: { fontSize: 18 },
  keyLink: { fontSize: FONTS.sizes.xs, color: COLORS.accent },

  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    padding: SPACING.md, alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },

  prefRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  prefLabel: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.medium, color: COLORS.text },
  prefSub: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  aboutRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  aboutLabel: { fontSize: FONTS.sizes.md, color: COLORS.text },
  aboutArrow: { color: COLORS.textMuted, fontSize: FONTS.sizes.xl },

  footer: { alignItems: 'center', gap: 4, paddingTop: SPACING.lg },
  footerText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  footerSub: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
});

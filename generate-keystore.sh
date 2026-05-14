#!/bin/bash
# ─────────────────────────────────────────────────────────────
# generate-keystore.sh
# Script para generar el keystore de firma para Android
# Ejecútalo UNA SOLA VEZ y guarda el archivo .jks y las contraseñas
# ─────────────────────────────────────────────────────────────

echo "🔑 Generando keystore para AI Studio Pro..."
echo ""

# Genera el keystore
keytool -genkey -v \
  -keystore ai-studio-pro.jks \
  -alias ai-studio-pro \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=AI Studio Pro, OU=Mobile, O=AIStudioPro, L=Madrid, ST=Madrid, C=ES"

echo ""
echo "✅ Keystore generado: ai-studio-pro.jks"
echo ""
echo "📋 Ahora convierte el keystore a Base64 para Codemagic:"
echo ""
echo "  base64 -i ai-studio-pro.jks | pbcopy   (macOS)"
echo "  base64 ai-studio-pro.jks               (Linux/Termux)"
echo ""
echo "⚠️  IMPORTANTE: Guarda el archivo .jks y las contraseñas en un lugar seguro."
echo "   Si los pierdes, no podrás actualizar tu app en Play Store."

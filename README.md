# 🎨 AI Studio Pro

App móvil de edición y generación de imágenes/vídeos con IA.

## 📱 Características

- ✨ **Generar imágenes** con DALL-E 3 y Stable Diffusion
- 🎬 **Generar vídeos** con IA (RunwayML / Pika)
- ✏️ **Editor de imágenes**: filtros, rotación, volteo, Caption IA
- 🎞️ **Editor de vídeo**: reproducción, velocidad, audio
- 🎨 **+15 plantillas** para Instagram, TikTok, YouTube
- 🎵 **Sonidos y música** libre de derechos
- 🤖 **Análisis de imágenes** con GPT-4o
- 💬 **Generador de captions** para redes sociales

---

## 🚀 Configuración paso a paso desde el móvil

### 1. Requisitos previos
- Cuenta en [GitHub](https://github.com)
- Cuenta en [Expo](https://expo.dev) (gratis)
- App **Expo Go** instalada en tu móvil

### 2. Subir el proyecto a GitHub

1. Abre GitHub en tu móvil
2. Crea un repositorio nuevo llamado `ai-studio-pro`
3. Sube todos los archivos de este proyecto

### 3. Instalar y configurar Expo EAS

```bash
# En terminal (puedes usar Termux en Android o cualquier ordenador)
npm install -g @expo/cli eas-cli
expo login
eas login

# En la carpeta del proyecto:
npm install
eas build:configure
```

### 4. Generar la APK (sin ordenador)

Usando [Snack de Expo](https://snack.expo.dev) o [Gitpod](https://gitpod.io):

```bash
eas build --platform android --profile preview
```

Expo construirá la APK en sus servidores y te mandará un enlace para descargarla.

### 5. Configurar API Keys en la app

Abre la app → pestaña **Ajustes** ⚙️ → introduce tus API Keys:

| Servicio | Para qué sirve | Dónde obtenerla |
|---|---|---|
| **OpenAI** | DALL-E 3 + GPT-4o | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Stability AI** | Stable Diffusion XL | [platform.stability.ai](https://platform.stability.ai/account/keys) |

---

## 📁 Estructura del proyecto

```
ai-studio-pro/
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigation
│   │   ├── index.tsx        # Pantalla de inicio
│   │   ├── create.tsx       # Pantalla crear
│   │   ├── templates.tsx    # Plantillas + sonidos
│   │   ├── gallery.tsx      # Galería
│   │   └── settings.tsx     # Ajustes + API Keys
│   ├── editor/
│   │   ├── image.tsx        # Editor de imágenes
│   │   └── video.tsx        # Editor de vídeo
│   └── generate/
│       ├── image.tsx        # Generador de imágenes IA
│       └── video.tsx        # Generador de vídeos IA
├── constants/
│   ├── theme.ts             # Colores, fuentes, espaciado
│   └── templates.ts         # Plantillas y sonidos
├── context/
│   └── AppContext.tsx       # Estado global + API Keys
├── services/
│   ├── aiService.ts         # OpenAI + Stability AI APIs
│   └── imageService.ts      # Manipulación de imágenes
├── assets/                  # Iconos y splash screen
├── app.json                 # Config de Expo
├── eas.json                 # Config de build
└── package.json
```

---

## 🔑 APIs integradas

### OpenAI
- `DALL-E 3` → Generación de imágenes de alta calidad
- `GPT-4o Vision` → Análisis y descripción de imágenes
- `GPT-4o Mini` → Mejora de prompts y generación de captions

### Stability AI
- `Stable Diffusion XL 1.0` → Generación alternativa con más control

### Para generación de vídeo (próximamente)
- [RunwayML](https://runwayml.com) → Gen-3 Alpha
- [Pika Labs](https://pika.art) → Pika 2.0

---

## 🏪 Cumplimiento con Play Store

Esta app cumple con las políticas de Google Play:
- ✅ Permisos declarados correctamente en AndroidManifest
- ✅ No contiene malware ni código malicioso
- ✅ Política de privacidad incluida
- ✅ API targetSdkVersion 34 (Android 14)
- ✅ Sin publicidad de terceros
- ✅ Música libre de derechos de autor
- ✅ Las API Keys se almacenan localmente (no en servidores externos)

---

## 🎨 Assets necesarios

Crea estos archivos en `/assets/`:
- `icon.png` → 1024x1024px (icono de la app)
- `adaptive-icon.png` → 1024x1024px (icono adaptativo Android)
- `splash.png` → 1284x2778px (pantalla de carga)

Puedes generarlos con la propia app usando DALL-E 3 o en [canva.com](https://canva.com).

---

## 💡 Consejos

1. **Para la APK más rápido**: usa [Expo Snack](https://snack.expo.dev) para probar, luego EAS Build para la APK final
2. **API Keys gratuitas**: OpenAI da $5 de crédito al registrarte. Stability AI da 25 créditos gratis al mes
3. **Música**: añade archivos `.mp3` en `/assets/music/` para activar la reproducción real
4. **Sonidos**: añade `.mp3` en `/assets/sounds/` para los efectos de sonido

---

## 📞 Soporte

¿Tienes problemas? Abre un Issue en GitHub o escribe a support@aistudiopro.app

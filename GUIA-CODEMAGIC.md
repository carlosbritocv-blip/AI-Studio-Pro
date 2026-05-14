# 🚀 Guía completa: Compilar AI Studio Pro en Codemagic

## Resumen del proceso
1. Añadir archivos al repositorio de GitHub
2. Crear cuenta en Codemagic y conectar GitHub
3. Generar el keystore de firma (solo una vez)
4. Configurar variables en Codemagic
5. Lanzar el build → descargar APK

---

## PASO 1 — Añadir archivos al repositorio GitHub

Sube estos archivos a la **raíz** de tu repositorio:

```
tu-repo/
├── codemagic.yaml          ← NUEVO
├── app.json                ← Actualizado
├── create-assets.js        ← NUEVO
├── package.json
├── babel.config.js
├── tsconfig.json
├── eas.json
├── app/
├── assets/                 ← Necesitas esta carpeta con imágenes
├── constants/
├── context/
└── services/
```

### ⚠️ La carpeta /assets/ es obligatoria

Necesitas crear la carpeta `assets/` con estos 3 archivos PNG:
- `icon.png` (1024×1024 px) — icono de la app
- `adaptive-icon.png` (1024×1024 px) — icono Android
- `splash.png` (1284×2778 px) — pantalla de carga

**Opción rápida:** ejecuta `node create-assets.js` para crear placeholders y compilar.
Después reemplázalos con tus imágenes reales.

---

## PASO 2 — Crear cuenta en Codemagic

1. Ve a [codemagic.io](https://codemagic.io) desde tu móvil
2. Pulsa **"Sign up for free"**
3. Elige **"Continue with GitHub"**
4. Autoriza el acceso a tu cuenta de GitHub
5. Codemagic detectará automáticamente tu repositorio

---

## PASO 3 — Generar el Keystore de firma Android

El keystore es necesario para firmar la APK. **Sin firma no funciona en dispositivos reales.**

### Opción A: Usando Termux (Android, gratis)

1. Instala [Termux](https://f-droid.org/es/packages/com.termux/) desde F-Droid
2. Ejecuta estos comandos:

```bash
# Instalar Java
pkg update && pkg install openjdk-17

# Generar keystore
keytool -genkey -v \
  -keystore ai-studio-pro.jks \
  -alias ai-studio-pro \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Te pedirá:
# - Contraseña del keystore (guárdala)
# - Nombre, organización, ciudad, país
# - Contraseña de la clave (puede ser la misma)

# Convertir a Base64 (para copiar en Codemagic)
base64 ai-studio-pro.jks
```

3. Copia la salida Base64 (es larga, todo el texto)

### Opción B: Usar APK sin firma (para probar)

En `codemagic.yaml` usa el workflow `android-debug` que no requiere keystore.
La APK debug funciona en tu móvil pero **no se puede subir a Play Store**.

---

## PASO 4 — Configurar variables en Codemagic

1. En Codemagic, ve a tu aplicación → **"Environment variables"**
2. Crea un grupo llamado `keystore_credentials`
3. Añade estas 4 variables:

| Variable | Valor | ¿Segura? |
|---|---|---|
| `CM_KEYSTORE` | El texto Base64 de tu .jks | ✅ Sí |
| `CM_KEYSTORE_PASSWORD` | Contraseña del keystore | ✅ Sí |
| `CM_KEY_ALIAS` | `ai-studio-pro` | No |
| `CM_KEY_PASSWORD` | Contraseña de la clave | ✅ Sí |

> Marca las variables de contraseña como "Secure" para que estén cifradas.

---

## PASO 5 — Lanzar el build

1. En Codemagic, ve a tu app → pestaña **"Workflows"**
2. Verás dos workflows:
   - `android-release` — APK firmada (para Play Store y distribución real)
   - `android-debug` — APK de prueba (sin firma, más rápido)
3. Pulsa **"Start new build"** en el que quieras
4. Selecciona tu rama (normalmente `main`)
5. Pulsa **"Start build"**

⏱ El build tarda entre **10 y 20 minutos**.

---

## PASO 6 — Descargar la APK

Cuando el build termine:
1. Recibirás un email con el enlace
2. O ve a Codemagic → tu build → pestaña **"Artifacts"**
3. Descarga `app-release.apk` (o `app-debug.apk`)
4. Instálala en tu móvil

> Para instalar APKs externas en Android: Ajustes → Seguridad → Fuentes desconocidas → Activar

---

## 🔧 Solución de problemas frecuentes

### Error: "assets/icon.png not found"
→ Ejecuta `node create-assets.js` y sube la carpeta `assets/` a GitHub

### Error: "SDK location not found"
→ Ya está corregido en el `codemagic.yaml` con el script `Set up local.properties`

### Error: "Could not resolve dependency"
→ Borra `node_modules/` y `package-lock.json` del repo, Codemagic hace `npm install` solo

### Error: "Keystore was tampered"
→ El Base64 del keystore está incompleto. Vuelve a copiarlo entero desde Termux

### Build en rojo sin mensaje claro
→ Ve al build → pestaña "Logs" → busca la línea en rojo más arriba

---

## 📧 Dónde poner tu email

En `codemagic.yaml`, línea 37 y 55:
```yaml
recipients:
  - your@email.com   ← Cambia esto por tu email real
```

---

## ✅ Checklist final antes de publicar en Play Store

- [ ] Reemplazar assets placeholder con imágenes reales (1024×1024 icon)
- [ ] Cambiar email en codemagic.yaml
- [ ] Actualizar URLs de privacidad en Settings screen
- [ ] Probar la APK en tu móvil
- [ ] Crear cuenta de Google Play Developer (25$ pago único)
- [ ] Subir el AAB (bundle) en lugar de APK para Play Store
  - En codemagic.yaml cambia `assembleRelease` por `bundleRelease`
  - El artifact será `app-release.aab`

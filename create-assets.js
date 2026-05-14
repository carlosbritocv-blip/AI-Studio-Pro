#!/usr/bin/env node
// create-assets.js
// Crea assets placeholder (PNG simples) para que Codemagic pueda compilar
// sin errores de "archivo no encontrado".
// Ejecútalo con: node create-assets.js

const fs = require('fs');
const path = require('path');

// PNG mínimo válido de 1x1 pixel negro (base64)
const TINY_PNG_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const files = [
  'icon.png',
  'adaptive-icon.png',
  'splash.png',
  'favicon.png',
];

files.forEach(file => {
  const filePath = path.join(assetsDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, Buffer.from(TINY_PNG_B64, 'base64'));
    console.log(`✅ Creado: assets/${file}`);
  } else {
    console.log(`⏭  Ya existe: assets/${file}`);
  }
});

console.log('\n🎨 Assets placeholder creados.');
console.log('Reemplázalos con tus imágenes reales antes de publicar en Play Store.');
console.log('  - icon.png        → 1024x1024 px');
console.log('  - adaptive-icon.png → 1024x1024 px');
console.log('  - splash.png      → 1284x2778 px');

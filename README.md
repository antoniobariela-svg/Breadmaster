# BreadMaster 🍞

Aplikasi baking Android untuk baker pemula hingga profesional.

## Stack
- React Native + Expo (managed workflow)
- Expo SDK 52
- lucide-react-native (icons)
- @expo-google-fonts (Playfair Display + DM Sans)
- AsyncStorage (penyimpanan resep pribadi)

## Cara Install & Jalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan di Expo Go
npx expo start

# 3. Build APK (butuh akun Expo)
eas build -p android --profile preview
```

## Struktur File

```
App.js                    ← Entry point, navigasi, shared state
app.json                  ← Konfigurasi Expo
eas.json                  ← Konfigurasi EAS Build
constants/
  theme.js                ← Warna & font
data/
  index.js                ← TEXT, STAGES_DATA, BAKING_INGREDIENTS, GAS_MARKS
  recipes.js              ← RECIPES + RECIPE_DETAILS (6 resep lengkap)
  glossary.js             ← 37 istilah baking + CAT_COLORS
screens/
  HomeScreen.js           ← Home + bottom nav
  HydrationScreen.js      ← Kalkulator hidrasi
  RecipesScreen.js        ← Resep + mode singkat/lengkap + cek akurasi
  TimerScreen.js          ← Timer fermentasi
  MyBreadScreen.js        ← Buat Roti Anda + prediksi keberhasilan
  ConversionScreen.js     ← Konversi berat & suhu
  GlossaryScreen.js       ← Glosarium baking
```

## Fitur

| Fitur | Keterangan |
|-------|-----------|
| 🍞 Buat Roti Anda | Resep pribadi dengan Baker's %, scale, prediksi keberhasilan |
| 💧 Kalkulator Hidrasi | Hidrasi kasar & efektif, database bahan cair |
| 📖 Resep Aneka Roti | 6 resep + mode singkat/lengkap + troubleshooting + cek akurasi |
| ⏱️ Timer Fermentasi | 6 tahap fermentasi + custom timer |
| ⇄ Konversi | Berat (8 satuan) + suhu (°C/°F/Gas Mark) |
| 📚 Glosarium | 37 istilah baking dengan kategori + search |

## Catatan

- SVG timer menggunakan `react-native-svg`
- Resep tersimpan permanen dengan `AsyncStorage`
- Bilingual ID/EN

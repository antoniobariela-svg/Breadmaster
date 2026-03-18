export const HYDRATION_PRESETS = [
  { name: 'Air', nameEn: 'Water', waterPct: 100, emoji: '💧' },
  { name: 'Susu Cair', nameEn: 'Liquid Milk', waterPct: 87, emoji: '🥛' },
  { name: 'Telur', nameEn: 'Egg', waterPct: 75, emoji: '🥚' },
  { name: 'Susu Kental Manis', nameEn: 'Condensed Milk', waterPct: 27, emoji: '🍯' },
  { name: 'Madu', nameEn: 'Honey', waterPct: 17, emoji: '🍯' },
  { name: 'Mentega', nameEn: 'Butter', waterPct: 15, emoji: '🧈' },
  { name: 'Minyak', nameEn: 'Oil', waterPct: 0, emoji: '🫙' },
  { name: 'Lainnya', nameEn: 'Other', waterPct: 100, emoji: '➕' },
];

export const RECIPES = [
  { name: 'Sourdough', icon: '🥖', hydration: 75, difficulty: 'Hard', time: '24h', tags: ['Artisan', 'Fermentasi'], diffColor: '#C17F3E',
    desc: 'Roti asam khas artisan dengan crumb terbuka dan kulit renyah. Mengandalkan fermentasi alami dari starter.',
    steps: ['Campurkan tepung & air, diamkan 30 menit (autolyse)', 'Tambahkan starter & garam, aduk rata', 'Stretch & fold setiap 30 menit selama 3 jam', 'Bulk fermentasi 4-6 jam di suhu ruang', 'Bentuk adonan, masukkan banneton', 'Cold proof semalam di kulkas (8-12 jam)', 'Panggang di Dutch oven 250°C: 20 menit tutup, 25 menit buka'],
    ingredients: [{ name: 'Tepung Protein Tinggi', pct: 100, unit: 'g', ref: 500 }, { name: 'Air', pct: 75, unit: 'g', ref: 375 }, { name: 'Starter Sourdough', pct: 20, unit: 'g', ref: 100 }, { name: 'Garam', pct: 2, unit: 'g', ref: 10 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 30, idealPct: 100, tolerance: 0, desc: 'Basis 100%' }, { name: 'Hidrasi', key: 'hydration', weight: 30, idealPct: 75, tolerance: 10, desc: 'Target 65-85%' }, { name: 'Starter', key: 'starter', weight: 25, idealPct: 20, tolerance: 10, desc: 'Target 10-30%' }, { name: 'Garam', key: 'salt', weight: 15, idealPct: 2, tolerance: 0.5, desc: 'Target 1.8-2.2%' }] },
  { name: 'Roti Tawar', icon: '🍞', hydration: 65, difficulty: 'Easy', time: '3h', tags: ['Soft', 'Klasik'], diffColor: '#7CB87C',
    desc: 'Roti putih lembut klasik untuk sandwich. Mudah dibuat dan cocok untuk pemula.',
    steps: ['Campur semua bahan kering', 'Tambahkan air hangat & mentega, uleni 10-15 menit', 'Proofing pertama 1 jam hingga 2x lipat', 'Kempiskan, bentuk loaf', 'Proofing kedua 45 menit', 'Panggang 180°C selama 30-35 menit'],
    ingredients: [{ name: 'Tepung Serbaguna', pct: 100, unit: 'g', ref: 500 }, { name: 'Air Hangat', pct: 65, unit: 'g', ref: 325 }, { name: 'Ragi Instan', pct: 1.5, unit: 'g', ref: 7.5 }, { name: 'Garam', pct: 2, unit: 'g', ref: 10 }, { name: 'Gula', pct: 5, unit: 'g', ref: 25 }, { name: 'Mentega', pct: 6, unit: 'g', ref: 30 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 25, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Hidrasi', key: 'hydration', weight: 25, idealPct: 65, tolerance: 8, desc: 'Target 57-73%' }, { name: 'Ragi', key: 'yeast', weight: 20, idealPct: 1.5, tolerance: 0.5, desc: 'Target 1-2%' }, { name: 'Garam', key: 'salt', weight: 15, idealPct: 2, tolerance: 0.4, desc: 'Target 1.6-2.4%' }, { name: 'Lemak', key: 'fat', weight: 10, idealPct: 6, tolerance: 3, desc: 'Target 3-9%' }, { name: 'Gula', key: 'sugar', weight: 5, idealPct: 5, tolerance: 3, desc: 'Target 2-8%' }] },
  { name: 'Croissant', icon: '🥐', hydration: 52, difficulty: 'Expert', time: '48h', tags: ['Laminated', 'French'], diffColor: '#C03030',
    desc: 'Pastri berlapis khas Perancis dengan tekstur flaky dan renyah.',
    steps: ['Buat détrempe, dinginkan semalam', 'Siapkan butter block', 'Laminasi 3x book fold, istirahat 30 menit antar lipatan', 'Potong & bentuk croissant', 'Proofing 2-3 jam', 'Olesi egg wash, panggang 200°C selama 18-22 menit'],
    ingredients: [{ name: 'Tepung Protein Tinggi', pct: 100, unit: 'g', ref: 500 }, { name: 'Air Dingin', pct: 45, unit: 'g', ref: 225 }, { name: 'Susu Cair', pct: 10, unit: 'g', ref: 50 }, { name: 'Ragi Instan', pct: 1.2, unit: 'g', ref: 6 }, { name: 'Garam', pct: 2, unit: 'g', ref: 10 }, { name: 'Gula', pct: 10, unit: 'g', ref: 50 }, { name: 'Mentega Détrempe', pct: 12, unit: 'g', ref: 60 }, { name: 'Butter Laminasi', pct: 50, unit: 'g', ref: 250 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 20, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Butter Laminasi', key: 'butter', weight: 30, idealPct: 50, tolerance: 10, desc: 'KRUSIAL - Target 40-60%' }, { name: 'Hidrasi Total', key: 'hydration', weight: 20, idealPct: 52, tolerance: 8, desc: 'Target 44-60%' }, { name: 'Ragi', key: 'yeast', weight: 15, idealPct: 1.2, tolerance: 0.5, desc: 'Target 0.7-1.7%' }, { name: 'Garam', key: 'salt', weight: 10, idealPct: 2, tolerance: 0.5, desc: 'Target 1.5-2.5%' }, { name: 'Gula', key: 'sugar', weight: 5, idealPct: 10, tolerance: 4, desc: 'Target 6-14%' }] },
  { name: 'Ciabatta', icon: '🫓', hydration: 80, difficulty: 'Medium', time: '12h', tags: ['Italian', 'Crispy'], diffColor: '#E8622A',
    desc: 'Roti Italia dengan crumb sangat terbuka dan kulit tipis renyah.',
    steps: ['Buat biga semalam', 'Campur biga dengan sisa bahan', 'Stretch & fold setiap 20 menit selama 2 jam', 'Bulk fermentasi 2-3 jam', 'Tuang di meja bertabur tepung, potong tanpa deflasi', 'Panggang 230°C selama 25-30 menit dengan uap'],
    ingredients: [{ name: 'Tepung Protein Tinggi', pct: 100, unit: 'g', ref: 500 }, { name: 'Air', pct: 80, unit: 'g', ref: 400 }, { name: 'Ragi Instan', pct: 0.5, unit: 'g', ref: 2.5 }, { name: 'Garam', pct: 2, unit: 'g', ref: 10 }, { name: 'Olive Oil', pct: 5, unit: 'g', ref: 25 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 20, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Hidrasi', key: 'hydration', weight: 40, idealPct: 80, tolerance: 8, desc: 'KRUSIAL - Target 72-88%' }, { name: 'Ragi', key: 'yeast', weight: 20, idealPct: 0.5, tolerance: 0.3, desc: 'Target 0.2-0.8%' }, { name: 'Garam', key: 'salt', weight: 15, idealPct: 2, tolerance: 0.4, desc: 'Target 1.6-2.4%' }, { name: 'Minyak', key: 'fat', weight: 5, idealPct: 5, tolerance: 3, desc: 'Opsional' }] },
  { name: 'Brioche', icon: '🧁', hydration: 50, difficulty: 'Medium', time: '6h', tags: ['Enriched', 'Soft'], diffColor: '#E8622A',
    desc: 'Roti Perancis kaya lemak dengan tekstur sangat lembut.',
    steps: ['Campur tepung, gula, ragi, dan garam', 'Tambahkan telur satu per satu sambil diuleni', 'Masukkan butter dingin sedikit demi sedikit, uleni 15-20 menit', 'Bulk fermentasi 2 jam, cold proof semalam', 'Bentuk, proofing 2-3 jam', 'Olesi egg wash, panggang 175°C selama 25-30 menit'],
    ingredients: [{ name: 'Tepung Serbaguna', pct: 100, unit: 'g', ref: 500 }, { name: 'Telur', pct: 50, unit: 'g', ref: 250 }, { name: 'Mentega Dingin', pct: 50, unit: 'g', ref: 250 }, { name: 'Air/Susu', pct: 10, unit: 'g', ref: 50 }, { name: 'Gula', pct: 10, unit: 'g', ref: 50 }, { name: 'Garam', pct: 2, unit: 'g', ref: 10 }, { name: 'Ragi Instan', pct: 2, unit: 'g', ref: 10 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 20, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Telur', key: 'egg', weight: 30, idealPct: 50, tolerance: 15, desc: 'KRUSIAL - Target 35-65%' }, { name: 'Mentega', key: 'butter', weight: 25, idealPct: 50, tolerance: 15, desc: 'KRUSIAL - Target 35-65%' }, { name: 'Gula', key: 'sugar', weight: 10, idealPct: 10, tolerance: 5, desc: 'Target 5-15%' }, { name: 'Ragi', key: 'yeast', weight: 10, idealPct: 2, tolerance: 0.8, desc: 'Target 1.2-2.8%' }, { name: 'Garam', key: 'salt', weight: 5, idealPct: 2, tolerance: 0.5, desc: 'Target 1.5-2.5%' }] },
  { name: 'Donut', icon: '🍩', hydration: 48, difficulty: 'Medium', time: '3h', tags: ['Fried', 'Sweet'], diffColor: '#E8622A',
    desc: 'Donut lembut dan fluffy dengan tekstur ringan.',
    steps: ['Campur tepung, gula, ragi, garam, dan susu bubuk', 'Tambahkan telur, susu hangat, dan butter', 'Uleni hingga adonan elastis dan halus (10-12 menit)', 'Proofing pertama 1 jam hingga 2x lipat', 'Giling adonan 1cm, cetak donut, proofing 30-45 menit', 'Goreng di minyak 175°C selama 1-1.5 menit tiap sisi', 'Celup ke glazur atau taburi gula halus selagi hangat'],
    ingredients: [{ name: 'Tepung Protein Tinggi', pct: 100, unit: 'g', ref: 500 }, { name: 'Susu Hangat', pct: 45, unit: 'g', ref: 225 }, { name: 'Telur', pct: 20, unit: 'g', ref: 100 }, { name: 'Gula', pct: 15, unit: 'g', ref: 75 }, { name: 'Mentega', pct: 12, unit: 'g', ref: 60 }, { name: 'Ragi Instan', pct: 2, unit: 'g', ref: 10 }, { name: 'Garam', pct: 1.5, unit: 'g', ref: 7.5 }, { name: 'Susu Bubuk', pct: 4, unit: 'g', ref: 20 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 20, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Hidrasi (Susu)', key: 'hydration', weight: 25, idealPct: 48, tolerance: 8, desc: 'Target 40-56%' }, { name: 'Lemak', key: 'fat', weight: 20, idealPct: 12, tolerance: 5, desc: 'Target 7-17%' }, { name: 'Gula', key: 'sugar', weight: 15, idealPct: 15, tolerance: 5, desc: 'Target 10-20%' }, { name: 'Telur', key: 'egg', weight: 10, idealPct: 20, tolerance: 8, desc: 'Target 12-28%' }, { name: 'Ragi', key: 'yeast', weight: 10, idealPct: 2, tolerance: 0.5, desc: 'Target 1.5-2.5%' }] },
  { name: 'Bagel', icon: '🥯', hydration: 58, difficulty: 'Medium', time: '12h', tags: ['Boiled', 'Chewy'], diffColor: '#E8622A',
    desc: 'Roti cincin khas New York dengan tekstur kenyal dan kulit mengkilap.',
    steps: ['Campur semua bahan, uleni 10-12 menit hingga adonan kencang', 'Proofing 1 jam, lalu dinginkan semalam di kulkas', 'Bentuk adonan menjadi cincin, proofing 30 menit', 'Rebus tiap bagel 1 menit/sisi di air + baking soda', 'Taburi wijen atau poppy seed', 'Panggang 220°C selama 20-25 menit'],
    ingredients: [{ name: 'Tepung Protein Tinggi', pct: 100, unit: 'g', ref: 500 }, { name: 'Air', pct: 58, unit: 'g', ref: 290 }, { name: 'Gula/Malt', pct: 3, unit: 'g', ref: 15 }, { name: 'Garam', pct: 2, unit: 'g', ref: 10 }, { name: 'Ragi Instan', pct: 1, unit: 'g', ref: 5 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 25, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Hidrasi', key: 'hydration', weight: 35, idealPct: 58, tolerance: 6, desc: 'KRUSIAL - Target 52-64%' }, { name: 'Garam', key: 'salt', weight: 20, idealPct: 2, tolerance: 0.4, desc: 'Target 1.6-2.4%' }, { name: 'Ragi', key: 'yeast', weight: 15, idealPct: 1, tolerance: 0.4, desc: 'Target 0.6-1.4%' }, { name: 'Gula/Malt', key: 'sugar', weight: 5, idealPct: 3, tolerance: 1.5, desc: 'Target 1.5-4.5%' }] },
  { name: 'Focaccia', icon: '🍕', hydration: 85, difficulty: 'Easy', time: '4h', tags: ['Italian', 'Flat'], diffColor: '#7CB87C',
    desc: 'Roti pipih Italia yang lembut dan beraroma olive oil.',
    steps: ['Campur tepung, air, ragi, garam, dan olive oil', 'Aduk sebentar, tidak perlu diuleni panjang', 'Stretch & fold 4x setiap 30 menit', 'Tuang ke loyang beroles olive oil, proofing 1 jam', 'Tekan jari membuat lubang-lubang, taburi flaky salt & rosemary', 'Panggang 220°C selama 20-25 menit'],
    ingredients: [{ name: 'Tepung Serbaguna', pct: 100, unit: 'g', ref: 500 }, { name: 'Air', pct: 85, unit: 'g', ref: 425 }, { name: 'Olive Oil', pct: 10, unit: 'g', ref: 50 }, { name: 'Garam', pct: 2.5, unit: 'g', ref: 12.5 }, { name: 'Ragi Instan', pct: 0.8, unit: 'g', ref: 4 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 20, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Hidrasi', key: 'hydration', weight: 40, idealPct: 85, tolerance: 8, desc: 'KRUSIAL - Target 77-93%' }, { name: 'Olive Oil', key: 'fat', weight: 20, idealPct: 10, tolerance: 5, desc: 'Target 5-15%' }, { name: 'Garam', key: 'salt', weight: 15, idealPct: 2.5, tolerance: 0.5, desc: 'Target 2-3%' }, { name: 'Ragi', key: 'yeast', weight: 5, idealPct: 0.8, tolerance: 0.4, desc: 'Target 0.4-1.2%' }] },
  { name: 'Pretzel', icon: '🥨', hydration: 60, difficulty: 'Medium', time: '3h', tags: ['Boiled', 'Savory'], diffColor: '#E8622A',
    desc: 'Pretzel Jerman dengan kulit coklat mengkilap dan rasa asin khas.',
    steps: ['Campur semua bahan, uleni 8-10 menit hingga elastis', 'Proofing 45 menit', 'Gulung menjadi tali panjang 60cm, bentuk pretzel', 'Celup ke larutan baking soda mendidih 30 detik', 'Taburi garam kasar', 'Panggang 220°C selama 12-15 menit'],
    ingredients: [{ name: 'Tepung Protein Tinggi', pct: 100, unit: 'g', ref: 500 }, { name: 'Air Hangat', pct: 60, unit: 'g', ref: 300 }, { name: 'Mentega', pct: 4, unit: 'g', ref: 20 }, { name: 'Gula', pct: 2, unit: 'g', ref: 10 }, { name: 'Garam', pct: 2, unit: 'g', ref: 10 }, { name: 'Ragi Instan', pct: 1.5, unit: 'g', ref: 7.5 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 25, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Hidrasi', key: 'hydration', weight: 30, idealPct: 60, tolerance: 6, desc: 'Target 54-66%' }, { name: 'Garam', key: 'salt', weight: 20, idealPct: 2, tolerance: 0.4, desc: 'Target 1.6-2.4%' }, { name: 'Ragi', key: 'yeast', weight: 15, idealPct: 1.5, tolerance: 0.5, desc: 'Target 1-2%' }, { name: 'Lemak', key: 'fat', weight: 10, idealPct: 4, tolerance: 2, desc: 'Target 2-6%' }] },
  { name: 'Cinnamon Roll', icon: '🌀', hydration: 55, difficulty: 'Medium', time: '4h', tags: ['Sweet', 'Rolled'], diffColor: '#C17F3E',
    desc: 'Roti gulung manis dengan isian kayu manis dan glazur krim.',
    steps: ['Buat adonan enriched: tepung, susu, telur, gula, ragi, butter', 'Proofing 1 jam', 'Giling tipis, oles butter + gula + kayu manis', 'Gulung rapat, potong 3-4cm', 'Proofing kedua 45 menit', 'Panggang 180°C selama 20-25 menit', 'Oles cream cheese frosting selagi hangat'],
    ingredients: [{ name: 'Tepung Serbaguna', pct: 100, unit: 'g', ref: 500 }, { name: 'Susu Hangat', pct: 50, unit: 'g', ref: 250 }, { name: 'Telur', pct: 15, unit: 'g', ref: 75 }, { name: 'Gula', pct: 12, unit: 'g', ref: 60 }, { name: 'Mentega', pct: 10, unit: 'g', ref: 50 }, { name: 'Ragi Instan', pct: 2, unit: 'g', ref: 10 }, { name: 'Garam', pct: 1.5, unit: 'g', ref: 7.5 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 20, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Hidrasi', key: 'hydration', weight: 25, idealPct: 55, tolerance: 8, desc: 'Target 47-63%' }, { name: 'Lemak', key: 'fat', weight: 20, idealPct: 10, tolerance: 4, desc: 'Target 6-14%' }, { name: 'Gula', key: 'sugar', weight: 15, idealPct: 12, tolerance: 4, desc: 'Target 8-16%' }, { name: 'Telur', key: 'egg', weight: 10, idealPct: 15, tolerance: 6, desc: 'Target 9-21%' }, { name: 'Ragi', key: 'yeast', weight: 10, idealPct: 2, tolerance: 0.5, desc: 'Target 1.5-2.5%' }] },
  { name: 'Rye Bread', icon: '🌾', hydration: 78, difficulty: 'Hard', time: '18h', tags: ['Rye', 'Dense'], diffColor: '#C17F3E',
    desc: 'Roti gandum hitam padat khas Eropa Utara dengan rasa asam yang dalam.',
    steps: ['Aktifkan rye starter 8-12 jam sebelumnya', 'Campurkan tepung rye, terigu, air, starter, garam', 'Aduk rata, adonan sangat lengket — jangan diuleni', 'Fermentasi bulk 3-4 jam', 'Tuang ke loyang berminyak, ratakan', 'Proofing akhir 1 jam', 'Panggang 230°C 15 menit, turunkan 200°C 45 menit'],
    ingredients: [{ name: 'Tepung Rye', pct: 70, unit: 'g', ref: 350 }, { name: 'Tepung Terigu', pct: 30, unit: 'g', ref: 150 }, { name: 'Air', pct: 78, unit: 'g', ref: 390 }, { name: 'Rye Starter', pct: 25, unit: 'g', ref: 125 }, { name: 'Garam', pct: 2, unit: 'g', ref: 10 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 20, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Hidrasi', key: 'hydration', weight: 30, idealPct: 78, tolerance: 10, desc: 'Target 68-88%' }, { name: 'Rye Starter', key: 'starter', weight: 30, idealPct: 25, tolerance: 10, desc: 'KRUSIAL - Target 15-35%' }, { name: 'Garam', key: 'salt', weight: 20, idealPct: 2, tolerance: 0.5, desc: 'Target 1.5-2.5%' }] },
  { name: 'Pizza Dough', icon: '🍕', hydration: 65, difficulty: 'Easy', time: '24h', tags: ['Italian', 'Thin'], diffColor: '#7CB87C',
    desc: 'Adonan pizza Neapolitan tipis dan crispy. Cold fermentation adalah rahasianya.',
    steps: ["Campur tepung '00', air dingin, ragi sedikit, garam", 'Uleni 8-10 menit hingga smooth', 'Bulk fermentasi 2 jam', 'Bagi bola 250g, cold proof semalam (24-72 jam)', 'Keluarkan 1-2 jam sebelum dipakai', 'Stretch perlahan dengan tangan', 'Panggang suhu tertinggi oven 8-10 menit'],
    ingredients: [{ name: "Tepung '00'", pct: 100, unit: 'g', ref: 500 }, { name: 'Air Dingin', pct: 65, unit: 'g', ref: 325 }, { name: 'Garam', pct: 2.8, unit: 'g', ref: 14 }, { name: 'Ragi Instan', pct: 0.3, unit: 'g', ref: 1.5 }, { name: 'Olive Oil', pct: 3, unit: 'g', ref: 15 }],
    scoring: [{ name: 'Tepung', key: 'flour', weight: 25, idealPct: 100, tolerance: 0, desc: 'Basis utama' }, { name: 'Hidrasi', key: 'hydration', weight: 30, idealPct: 65, tolerance: 8, desc: 'Target 57-73%' }, { name: 'Garam', key: 'salt', weight: 25, idealPct: 2.8, tolerance: 0.5, desc: 'Target 2.3-3.3%' }, { name: 'Ragi', key: 'yeast', weight: 15, idealPct: 0.3, tolerance: 0.2, desc: 'Target 0.1-0.5%' }, { name: 'Olive Oil', key: 'fat', weight: 5, idealPct: 3, tolerance: 2, desc: 'Opsional' }] },
];

export const STAGES_DATA = [
  { name: 'Autolyse', nameEn: 'Autolyse', emoji: '💧', mins: 30, temp: 'Suhu ruang (24–26°C)', tempEn: 'Room temp (24–26°C)', desc: 'Campurkan tepung & air, diamkan tanpa diuleni. Gluten mulai terbentuk secara alami.', descEn: 'Mix flour & water, rest without kneading. Gluten forms naturally.' },
  { name: 'Bulk Fermentasi', nameEn: 'Bulk Fermentation', emoji: '🫧', mins: 240, temp: 'Hangat (26–28°C)', tempEn: 'Warm (26–28°C)', desc: 'Fermentasi utama. Adonan harus mengembang 50–75%. Lakukan stretch & fold tiap 30 menit.', descEn: 'Main fermentation. Dough should rise 50–75%. Do stretch & fold every 30 min.' },
  { name: 'Bench Rest', nameEn: 'Bench Rest', emoji: '😴', mins: 20, temp: 'Suhu ruang (22–24°C)', tempEn: 'Room temp (22–24°C)', desc: 'Istirahatkan adonan setelah dibentuk kasar. Gluten rileks sebelum shaping akhir.', descEn: 'Rest after pre-shaping. Gluten relaxes before final shaping.' },
  { name: 'Final Proof', nameEn: 'Final Proof', emoji: '🌡️', mins: 60, temp: 'Hangat (26–27°C)', tempEn: 'Warm (26–27°C)', desc: 'Proofing akhir setelah shaping. Adonan siap dipanggang saat lulus tes jari.', descEn: 'Final proof after shaping. Ready when it passes the poke test.' },
  { name: 'Cold Proof', nameEn: 'Cold Proof', emoji: '❄️', mins: 480, temp: 'Kulkas (4–6°C)', tempEn: 'Fridge (4–6°C)', desc: 'Retard semalam di kulkas untuk rasa lebih kompleks dan jadwal fleksibel.', descEn: 'Overnight retard in fridge for more complex flavor.' },
  { name: 'Custom', nameEn: 'Custom', emoji: '✏️', mins: 0, temp: '—', tempEn: '—', desc: 'Atur durasi sendiri sesuai kebutuhan.', descEn: 'Set your own custom duration.' },
];

export const BAKING_INGREDIENTS = [
  { name: 'Tepung Serbaguna', nameEn: 'All-Purpose Flour', gPerCup: 125 },
  { name: 'Tepung Protein Tinggi', nameEn: 'Bread Flour', gPerCup: 130 },
  { name: 'Gula Pasir', nameEn: 'Granulated Sugar', gPerCup: 200 },
  { name: 'Gula Bubuk', nameEn: 'Powdered Sugar', gPerCup: 120 },
  { name: 'Gula Merah (padat)', nameEn: 'Brown Sugar (packed)', gPerCup: 220 },
  { name: 'Mentega', nameEn: 'Butter', gPerCup: 227 },
  { name: 'Air / Susu Cair', nameEn: 'Water / Liquid Milk', gPerCup: 240 },
  { name: 'Minyak Goreng', nameEn: 'Vegetable Oil', gPerCup: 218 },
  { name: 'Susu Bubuk', nameEn: 'Milk Powder', gPerCup: 120 },
  { name: 'Cocoa Powder', nameEn: 'Cocoa Powder', gPerCup: 85 },
  { name: 'Oat / Rolled Oats', nameEn: 'Rolled Oats', gPerCup: 90 },
  { name: 'Garam', nameEn: 'Salt', gPerCup: 288 },
];

export const GAS_MARKS = [
  { gas: '¼', celsius: 110, fahrenheit: 225, desc: 'Sangat rendah' },
  { gas: '½', celsius: 130, fahrenheit: 265, desc: 'Sangat rendah' },
  { gas: '1', celsius: 140, fahrenheit: 285, desc: 'Rendah' },
  { gas: '2', celsius: 150, fahrenheit: 300, desc: 'Rendah' },
  { gas: '3', celsius: 170, fahrenheit: 335, desc: 'Sedang rendah' },
  { gas: '4', celsius: 180, fahrenheit: 355, desc: 'Sedang' },
  { gas: '5', celsius: 190, fahrenheit: 375, desc: 'Sedang tinggi' },
  { gas: '6', celsius: 200, fahrenheit: 390, desc: 'Panas' },
  { gas: '7', celsius: 220, fahrenheit: 425, desc: 'Panas' },
  { gas: '8', celsius: 230, fahrenheit: 450, desc: 'Sangat panas' },
  { gas: '9', celsius: 240, fahrenheit: 465, desc: 'Sangat panas' },
];

export const QUICK_PROMPTS = [
  'Kenapa roti saya tidak mengembang?',
  'Berapa suhu ideal untuk proofing?',
  'Cara tahu adonan sudah cukup diuleni?',
  'Perbedaan ragi instan dan ragi aktif?',
  'Kenapa kulit roti saya tidak renyah?',
  'Apa itu windowpane test?',
];

export const SYSTEM_PROMPT = `Kamu adalah BreadMaster AI, seorang ahli roti profesional dengan pengalaman lebih dari 20 tahun di dunia baking. Kamu fasih dalam bahasa Indonesia dan Inggris.

Kemampuanmu:
1. ANALISIS ADONAN — Jika user menyebutkan komposisi bahan, analisis hidrasi dan baker's percentage
2. SARAN PERBAIKAN — Berikan saran konkret jika ada yang kurang tepat
3. DIAGNOSA MASALAH — Diagnosa penyebab dan solusi masalah roti
4. CHAT BEBAS — Jawab pertanyaan seputar baking

Gaya komunikasi:
- Hangat, supportif, dan encouraging seperti mentor yang baik
- Gunakan bahasa yang sama dengan user
- Gunakan emoji secukupnya 🍞
- Jika diagnosa: penyebab → solusi → tips pencegahan`;

export function getBreadType(h) {
  if (h < 60) return { type: 'Roti Padat / Dense Bread', desc: 'Hidrasi rendah menghasilkan adonan yang kencang. Cocok untuk roti toast, bagel, atau pretzel.' };
  if (h < 70) return { type: 'Roti Lunak / Soft Bread', desc: 'Hidrasi seimbang untuk roti tawar, brioche, atau roti sandwich yang empuk.' };
  if (h < 80) return { type: 'Artisan Bread / Sourdough', desc: 'Hidrasi tinggi menghasilkan crumb terbuka dan kulit renyah. Ideal untuk sourdough dan ciabatta.' };
  return { type: 'Slack Dough / Focaccia', desc: 'Hidrasi sangat tinggi. Adonan sangat lembek, sempurna untuk focaccia.' };
}

import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants/theme';

const TEXT = {
  id: {
    greeting: 'Selamat Datang, Baker!',
    heroTitle: 'Buat roti yang lebih ',
    heroSpan: 'sempurna',
    heroDesc: 'Analisis adonan, cek resep, dan jadilah master roti dengan panduan cerdas.',
    totalRecipes: 'Resep', breadTypes: 'Jenis Roti', accuracy: 'Akurasi AI',
    segments: 'Segmen Utama', segmentsSub: 'Pilih fitur yang kamu butuhkan',
  },
  en: {
    greeting: 'Welcome, Baker!',
    heroTitle: 'Bake ',
    heroSpan: 'perfect bread',
    heroDesc: 'Analyze your dough, check recipes, and become a bread master.',
    totalRecipes: 'Recipes', breadTypes: 'Bread Types', accuracy: 'AI Accuracy',
    segments: 'Main Features', segmentsSub: 'Choose the feature you need',
  },
};

const CARDS = [
  { id: 'hydration', emoji: '💧', titleId: 'Kalkulator Hidrasi', titleEn: 'Hydration Calculator', subId: 'Dapatkan % hidrasi & prediksi jenis roti', subEn: 'Get hydration % & bread type prediction', tag: 'Kalkulator', gradient: ['#7C4A1E', '#C17F3E'], featured: true },
  { id: 'recipes', emoji: '📖', titleId: 'Resep Aneka Roti', titleEn: 'Bread Recipes', subId: 'Database 13 resep dengan panduan lengkap', subEn: '13 recipes with complete guide', tag: 'Database', gradient: ['#E8622A', '#F4A461'] },
  { id: 'bakers', emoji: '🧮', titleId: "Baker's %", titleEn: "Baker's %", subId: 'Hitung & konversi rasio bahan', subEn: 'Calculate & convert ingredient ratios', tag: 'Kalkulator', gradient: ['#C17F3E', '#E8D5B0'], darkText: true },
  { id: 'timer', emoji: '⏱️', titleId: 'Timer Fermentasi', titleEn: 'Fermentation Timer', subId: 'Timer & panduan suhu fermentasi', subEn: 'Timer & temperature guide', tag: 'Timer', gradient: ['#A05C2A', '#D4956A'], horizontal: true },
  { id: 'conversion', emoji: '⇄', titleId: 'Konversi', titleEn: 'Converter', subId: 'Konversi satuan berat & suhu', subEn: 'Weight & temperature conversion', tag: 'Konversi', gradient: ['#7C4A1E', '#C17F3E'], horizontal: true },
];

export default function HomeScreen({ lang, setLang, navigate }) {
  const t = TEXT[lang];

  const renderCard = (card) => {
    const isDark = card.darkText;
    const textColor = isDark ? COLORS.brownDark : COLORS.white;
    const subColor = isDark ? 'rgba(59,31,10,0.65)' : 'rgba(255,255,255,0.8)';
    const tagBg = isDark ? 'rgba(59,31,10,0.15)' : 'rgba(255,255,255,0.2)';

    if (card.horizontal) {
      return (
        <TouchableOpacity key={card.id} onPress={() => navigate(card.id)}
          style={[styles.cardHorizontal, { backgroundColor: card.gradient[0] }, SHADOWS.card]}>
          <View style={[styles.cardIconSm, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={styles.cardIconEmoji}>{card.emoji}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.cardTitleSm, { color: textColor }]}>{lang === 'id' ? card.titleId : card.titleEn}</Text>
            <Text style={[styles.cardSubSm, { color: subColor }]} numberOfLines={1}>{lang === 'id' ? card.subId : card.subEn}</Text>
          </View>
          <Text style={[styles.cardArrow, { color: textColor }]}>›</Text>
        </TouchableOpacity>
      );
    }

    if (card.featured) {
      return (
        <TouchableOpacity key={card.id} onPress={() => navigate(card.id)}
          style={[styles.cardFeatured, { backgroundColor: card.gradient[0] }, SHADOWS.card]}>
          {card.aiCard && (
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>✦ Powered by Gemini</Text>
            </View>
          )}
          <View style={[styles.cardIconLg, { backgroundColor: card.aiCard ? 'rgba(248,161,97,0.2)' : 'rgba(255,255,255,0.15)' }]}>
            <Text style={styles.cardIconEmojiLg}>{card.emoji}</Text>
          </View>
          <Text style={[styles.cardTitle, { color: textColor }]}>{lang === 'id' ? card.titleId : card.titleEn}</Text>
          <Text style={[styles.cardSub, { color: subColor }]}>{lang === 'id' ? card.subId : card.subEn}</Text>
          <View style={[styles.cardTag, { backgroundColor: card.aiCard ? 'rgba(248,161,97,0.25)' : tagBg }]}>
            <Text style={[styles.cardTagText, { color: textColor }]}>{card.tag}</Text>
          </View>
          <View style={[styles.cardArrowCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '700' }}>›</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity key={card.id} onPress={() => navigate(card.id)}
        style={[styles.cardSm, { backgroundColor: card.gradient[0] }, SHADOWS.card]}>
        <View style={[styles.cardIconSm, { backgroundColor: isDark ? 'rgba(59,31,10,0.15)' : 'rgba(255,255,255,0.15)' }]}>
          <Text style={styles.cardIconEmoji}>{card.emoji}</Text>
        </View>
        <Text style={[styles.cardTitleSm, { color: textColor }]}>{lang === 'id' ? card.titleId : card.titleEn}</Text>
        <Text style={[styles.cardSubSm, { color: subColor }]} numberOfLines={2}>{lang === 'id' ? card.subId : card.subEn}</Text>
        <View style={[styles.cardTag, { backgroundColor: tagBg, marginTop: 8 }]}>
          <Text style={[styles.cardTagText, { color: textColor }]}>{card.tag}</Text>
        </View>
        <View style={[styles.cardArrowCircleSm, { backgroundColor: isDark ? 'rgba(59,31,10,0.15)' : 'rgba(255,255,255,0.2)' }]}>
          <Text style={{ color: textColor, fontSize: 14, fontWeight: '700' }}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const featuredCards = CARDS.filter(c => c.featured);
  const rowCards = CARDS.filter(c => !c.featured && !c.horizontal);
  const horizontalCards = CARDS.filter(c => c.horizontal);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}><Text style={{ color: COLORS.orangeLight }}>Bread</Text><Text style={{ color: COLORS.cream }}>Master</Text></Text>
          <Text style={styles.logoSub}>YOUR BREAD EXPERT</Text>
        </View>
        <View style={styles.langToggle}>
          <TouchableOpacity onPress={() => setLang('id')} style={[styles.langBtn, lang === 'id' && styles.langBtnActive]}>
            <Text style={[styles.langBtnText, lang === 'id' && styles.langBtnTextActive]}>ID</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLang('en')} style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}>
            <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroGreeting}>{t.greeting}</Text>
          <Text style={styles.heroTitle}>
            {t.heroTitle}<Text style={{ color: COLORS.orangeLight }}>{t.heroSpan}</Text> 🍞
          </Text>
          <Text style={styles.heroDesc}>{t.heroDesc}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[['13', t.totalRecipes], ['12', t.breadTypes], ['96%', t.accuracy]].map(([num, label]) => (
            <View key={label} style={styles.statPill}>
              <Text style={styles.statNum}>{num}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Section title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.segments}</Text>
          <Text style={styles.sectionSub}>{t.segmentsSub}</Text>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          {renderCard(featuredCards[0])}

          <View style={styles.cardsRow}>
            {rowCards.map(renderCard)}
          </View>

          {horizontalCards.map(renderCard)}

          {featuredCards[1] && renderCard(featuredCards[1])}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.brownDark },
  header: { backgroundColor: COLORS.brownDark, paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 26, fontWeight: '900' },
  logoSub: { fontSize: 9, color: COLORS.tanDark, letterSpacing: 3, marginTop: 2 },
  langToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 3, gap: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  langBtnActive: { backgroundColor: COLORS.orange },
  langBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.tanDark },
  langBtnTextActive: { color: COLORS.white },

  hero: { backgroundColor: COLORS.brownMid, paddingHorizontal: 28, paddingVertical: 32 },
  heroGreeting: { fontSize: 11, color: COLORS.orangeLight, fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 },
  heroTitle: { fontSize: 26, fontWeight: '700', color: COLORS.cream, lineHeight: 34, marginBottom: 12 },
  heroDesc: { fontSize: 13, color: COLORS.tanDark, lineHeight: 21 },

  statsRow: { flexDirection: 'row', gap: 10, padding: 20, backgroundColor: COLORS.warmWhite, borderBottomWidth: 1, borderBottomColor: COLORS.tan },
  statPill: { flex: 1, backgroundColor: COLORS.cream, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 14, padding: 14, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '700', color: COLORS.brownMid },
  statLabel: { fontSize: 10, color: COLORS.textLight, fontWeight: '500', letterSpacing: 0.5, marginTop: 4 },

  section: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 10, backgroundColor: COLORS.cream },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.brownDark, marginBottom: 4 },
  sectionSub: { fontSize: 12, color: COLORS.textLight, marginBottom: 4 },

  cardsContainer: { backgroundColor: COLORS.cream, paddingHorizontal: 24, paddingBottom: 8, gap: 12 },
  cardsRow: { flexDirection: 'row', gap: 12 },

  cardFeatured: { borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden' },
  cardSm: { flex: 1, borderRadius: 20, padding: 18, position: 'relative' },
  cardHorizontal: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center' },

  cardIconLg: { width: 52, height: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  cardIconSm: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardIconEmoji: { fontSize: 18 },
  cardIconEmojiLg: { fontSize: 24 },

  cardTitle: { fontSize: 20, fontWeight: '700', color: COLORS.white, marginBottom: 6, lineHeight: 26 },
  cardTitleSm: { fontSize: 13, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  cardSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 18, marginBottom: 18, maxWidth: '85%' },
  cardSubSm: { fontSize: 10, color: 'rgba(255,255,255,0.75)', lineHeight: 14, marginBottom: 0 },

  cardTag: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  cardTagText: { fontSize: 11, fontWeight: '700' },

  cardArrowCircle: { position: 'absolute', right: 24, bottom: 24, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cardArrowCircleSm: { position: 'absolute', right: 14, bottom: 14, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardArrow: { fontSize: 24, fontWeight: '700' },

  aiBadge: { backgroundColor: 'rgba(248,161,97,0.2)', alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 14 },
  aiBadgeText: { fontSize: 10, color: COLORS.orangeLight, fontWeight: '600', letterSpacing: 1 },
});

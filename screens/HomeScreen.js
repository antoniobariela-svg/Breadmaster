import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, LinearGradient,
} from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../constants/theme';

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

// Card data
const FEATURED_CARD = {
  id: 'hydration', emoji: '💧',
  titleId: 'Kalkulator Hidrasi', titleEn: 'Hydration Calculator',
  subId: 'Masukkan komposisi adonanmu, dapatkan % hidrasi & prediksi jenis roti',
  subEn: 'Enter dough composition, get hydration % & bread type prediction',
  tag: 'Kalkulator',
  bg: '#3B1F0A', bgMid: '#7C4A1E', bgLight: '#C17F3E',
};

const ROW_CARDS = [
  { id: 'recipes', emoji: '📖', titleId: 'Resep Aneka Roti', titleEn: 'Bread Recipes', subId: '13 resep lengkap', subEn: '13 complete recipes', tag: 'Database', bg: '#C04A15', bgLight: '#F4A461' },
  { id: 'bakers', emoji: '🧮', titleId: "Baker's %", titleEn: "Baker's %", subId: 'Hitung rasio bahan', subEn: 'Calculate ratios', tag: 'Kalkulator', bg: '#8A5520', bgLight: '#E8C87A', darkText: false },
];

const BOTTOM_CARDS = [
  { id: 'timer', emoji: '⏱️', titleId: 'Timer Fermentasi', titleEn: 'Fermentation Timer', subId: 'Timer & panduan suhu fermentasi', subEn: 'Timer & temperature guide', tag: 'Timer', bg: '#7C3A12', bgLight: '#D4956A' },
  { id: 'conversion', emoji: '⇄', titleId: 'Konversi', titleEn: 'Converter', subId: 'Berat & suhu', subEn: 'Weight & temperature', tag: 'Konversi', bg: '#5A2E0A', bgLight: '#C17F3E' },
];

export default function HomeScreen({ lang, setLang, navigate }) {
  const t = TEXT[lang];

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.logo}>
            <Text style={{ color: COLORS.orangeLight }}>Bread</Text>
            <Text style={{ color: COLORS.cream }}>Master</Text>
          </Text>
          <Text style={s.logoSub}>YOUR BREAD EXPERT</Text>
        </View>
        <View style={s.langToggle}>
          <TouchableOpacity onPress={() => setLang('id')} style={[s.langBtn, lang === 'id' && s.langBtnActive]}>
            <Text style={[s.langBtnText, lang === 'id' && s.langBtnTextActive]}>ID</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLang('en')} style={[s.langBtn, lang === 'en' && s.langBtnActive]}>
            <Text style={[s.langBtnText, lang === 'en' && s.langBtnTextActive]}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.heroGreeting}>{t.greeting}</Text>
          <Text style={s.heroTitle}>
            {t.heroTitle}
            <Text style={{ color: COLORS.orangeLight }}>{t.heroSpan}</Text>
            <Text> 🍞</Text>
          </Text>
          <Text style={s.heroDesc}>{t.heroDesc}</Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[['13', t.totalRecipes], ['12', t.breadTypes], ['96%', t.accuracy]].map(([num, label]) => (
            <View key={label} style={s.statPill}>
              <Text style={s.statNum}>{num}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{t.segments}</Text>
          <Text style={s.sectionSub}>{t.segmentsSub}</Text>
        </View>

        <View style={s.cardsContainer}>
          {/* Featured card */}
          <TouchableOpacity
            onPress={() => navigate(FEATURED_CARD.id)}
            style={[s.featuredCard, { backgroundColor: FEATURED_CARD.bg }, SHADOWS.card]}
            activeOpacity={0.9}>
            <View style={s.featuredDecor1} />
            <View style={s.featuredDecor2} />
            <View style={s.cardIconLg}>
              <Text style={s.cardEmojiLg}>{FEATURED_CARD.emoji}</Text>
            </View>
            <Text style={s.featuredTitle}>{lang === 'id' ? FEATURED_CARD.titleId : FEATURED_CARD.titleEn}</Text>
            <Text style={s.featuredSub}>{lang === 'id' ? FEATURED_CARD.subId : FEATURED_CARD.subEn}</Text>
            <View style={s.cardTag}>
              <Text style={s.cardTagText}>{FEATURED_CARD.tag}</Text>
            </View>
            <View style={s.cardArrow}>
              <Text style={s.cardArrowText}>›</Text>
            </View>
          </TouchableOpacity>

          {/* 2-column row */}
          <View style={s.cardsRow}>
            {ROW_CARDS.map(card => (
              <TouchableOpacity key={card.id} onPress={() => navigate(card.id)}
                style={[s.cardSm, { backgroundColor: card.bg }, SHADOWS.card]}
                activeOpacity={0.9}>
                <View style={s.cardDecorSm} />
                <View style={s.cardIconSm}>
                  <Text style={s.cardEmojiSm}>{card.emoji}</Text>
                </View>
                <Text style={s.cardTitleSm}>{lang === 'id' ? card.titleId : card.titleEn}</Text>
                <Text style={s.cardSubSm} numberOfLines={2}>{lang === 'id' ? card.subId : card.subEn}</Text>
                <View style={[s.cardTag, { marginTop: 8 }]}>
                  <Text style={s.cardTagText}>{card.tag}</Text>
                </View>
                <View style={s.cardArrowSm}>
                  <Text style={s.cardArrowText}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom horizontal cards */}
          {BOTTOM_CARDS.map(card => (
            <TouchableOpacity key={card.id} onPress={() => navigate(card.id)}
              style={[s.cardHorizontal, { backgroundColor: card.bg }, SHADOWS.card]}
              activeOpacity={0.9}>
              <View style={[s.cardIconSm, { marginBottom: 0 }]}>
                <Text style={s.cardEmojiSm}>{card.emoji}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.cardTitleSm}>{lang === 'id' ? card.titleId : card.titleEn}</Text>
                <Text style={[s.cardSubSm, { marginBottom: 0 }]} numberOfLines={1}>{lang === 'id' ? card.subId : card.subEn}</Text>
              </View>
              <Text style={[s.cardArrowText, { fontSize: 26 }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.brownDark },

  // Header
  header: { backgroundColor: COLORS.brownDark, paddingHorizontal: 24, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 28, fontFamily: FONTS.displayBlack },
  logoSub: { fontSize: 9, color: COLORS.tanDark, letterSpacing: 3, marginTop: 2 },
  langToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 3, gap: 2 },
  langBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16 },
  langBtnActive: { backgroundColor: COLORS.orange },
  langBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.tanDark },
  langBtnTextActive: { color: COLORS.white },

  // Hero
  hero: { backgroundColor: COLORS.brownMid, paddingHorizontal: 28, paddingTop: 36, paddingBottom: 32 },
  heroGreeting: { fontSize: 11, color: COLORS.orangeLight, fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 },
  heroTitle: { fontFamily: FONTS.display, fontSize: 28, color: COLORS.cream, lineHeight: 36, marginBottom: 12 },
  heroDesc: { fontSize: 13, color: COLORS.tanDark, lineHeight: 22 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, paddingVertical: 20, backgroundColor: COLORS.warmWhite, borderBottomWidth: 1, borderBottomColor: COLORS.tan },
  statPill: { flex: 1, backgroundColor: COLORS.cream, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center' },
  statNum: { fontFamily: FONTS.display, fontSize: 22, color: COLORS.brownMid, lineHeight: 26 },
  statLabel: { fontSize: 10, color: COLORS.textLight, fontWeight: '500', letterSpacing: 0.5, marginTop: 4 },

  // Section
  section: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 12, backgroundColor: COLORS.cream },
  sectionTitle: { fontFamily: FONTS.display, fontSize: 22, color: COLORS.brownDark, marginBottom: 6 },
  sectionSub: { fontSize: 12, color: COLORS.textLight },

  // Cards container
  cardsContainer: { backgroundColor: COLORS.cream, paddingHorizontal: 24, paddingBottom: 8, gap: 12 },
  cardsRow: { flexDirection: 'row', gap: 12 },

  // Featured card
  featuredCard: { borderRadius: 24, padding: 28, paddingBottom: 32, position: 'relative', overflow: 'hidden' },
  featuredDecor1: { position: 'absolute', right: -30, bottom: -30, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.06)' },
  featuredDecor2: { position: 'absolute', right: 30, bottom: 30, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.04)' },
  featuredTitle: { fontFamily: FONTS.display, fontSize: 22, color: COLORS.white, marginBottom: 8, lineHeight: 28 },
  featuredSub: { fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 20, marginBottom: 20, maxWidth: '85%' },

  // Small card
  cardSm: { flex: 1, borderRadius: 20, padding: 18, position: 'relative', overflow: 'hidden' },
  cardDecorSm: { position: 'absolute', right: -14, top: -14, width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.08)' },
  cardTitleSm: { fontFamily: FONTS.display, fontSize: 14, color: COLORS.white, marginBottom: 4, lineHeight: 18 },
  cardSubSm: { fontSize: 10, color: 'rgba(255,255,255,0.75)', lineHeight: 14, marginBottom: 0 },

  // Horizontal card
  cardHorizontal: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center' },

  // Shared card elements
  cardIconLg: { width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  cardIconSm: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  cardEmojiLg: { fontSize: 26 },
  cardEmojiSm: { fontSize: 20 },
  cardTag: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  cardTagText: { fontSize: 11, fontWeight: '700', color: COLORS.white },
  cardArrow: { position: 'absolute', right: 24, bottom: 24, width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cardArrowSm: { position: 'absolute', right: 14, bottom: 14, width: 28, height: 28, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardArrowText: { color: COLORS.white, fontSize: 20, fontWeight: '700', marginTop: -2 },
});

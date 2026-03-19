import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Droplets, BookOpen, Timer, ArrowLeftRight, Wheat, ChevronRight } from 'lucide-react-native';
import { COLORS, FONTS } from '../constants/theme';
import { TEXT } from '../data/index';

export default function HomeScreen({ lang, setLang, setScreen }) {
  const t = TEXT[lang];
  return (
    <View style={s.wrap}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      {/* Header */}
      <View style={s.header}>
        <Text style={s.logo}>Bread<Text style={s.logoSpan}>Master</Text></Text>
        <View style={s.langWrap}>
          <TouchableOpacity style={[s.langBtn, lang === 'id' && s.langBtnActive]} onPress={() => setLang('id')}>
            <Text style={[s.langTxt, lang === 'id' && s.langTxtActive]}>ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.langBtn, lang === 'en' && s.langBtnActive]} onPress={() => setLang('en')}>
            <Text style={[s.langTxt, lang === 'en' && s.langTxtActive]}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.heroEye}>{t.greeting}</Text>
          <Text style={s.heroTitle}>{t.heroTitle} <Text style={s.heroSpan}>{t.heroTitleSpan}</Text></Text>
          <Text style={s.heroDesc}>{t.heroDesc}</Text>
        </View>

        {/* Stats */}
        <View style={s.stats}>
          {[['13', t.totalRecipes], ['12', t.breadTypes], ['96%', t.accuracy]].map(([num, label]) => (
            <View key={label} style={s.stat}>
              <Text style={s.statNum}>{num}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Cards */}
        <View style={s.cards}>
          <Text style={s.sectionLabel}>{t.segments}</Text>

          {/* Featured — Buat Roti Anda */}
          <TouchableOpacity style={s.featCard} onPress={() => setScreen('bakers')} activeOpacity={0.85}>
            <View style={s.featIconWrap}>
              <Wheat size={28} color={COLORS.orangeLight} />
            </View>
            <Text style={s.featEye}>{lang === 'id' ? 'Resep Pribadi' : 'Personal Recipe'}</Text>
            <Text style={s.featTitle}>{t.card3Title}</Text>
            <Text style={s.featSub}>{t.card3Sub}</Text>
            <View style={s.featCta}>
              <Text style={s.featCtaTxt}>{lang === 'id' ? 'Buat Sekarang' : 'Create Now'}</Text>
              <ChevronRight size={14} color={COLORS.white} />
            </View>
          </TouchableOpacity>

          {/* 2-column */}
          <View style={s.row}>
            <TouchableOpacity style={[s.smCard, s.smCardC1]} onPress={() => setScreen('hydration')} activeOpacity={0.85}>
              <View>
                <View style={s.smIconWrap}><Droplets size={28} color={COLORS.white} /></View>
                <Text style={[s.smTitle, { color: COLORS.white }]}>{t.card1Title}</Text>
                <Text style={[s.smSub, { color: 'rgba(255,255,255,0.75)' }]}>{t.card1Sub}</Text>
              </View>
              <View style={s.smArrow}><ChevronRight size={13} color={COLORS.white} /></View>
            </TouchableOpacity>
            <TouchableOpacity style={[s.smCard, s.smCardC2]} onPress={() => setScreen('recipes')} activeOpacity={0.85}>
              <View>
                <View style={s.smIconWrap}><BookOpen size={28} color={COLORS.brownDark} /></View>
                <Text style={[s.smTitle, { color: COLORS.brownDark }]}>{t.card2Title}</Text>
                <Text style={[s.smSub, { color: COLORS.textMid }]}>{t.card2Sub}</Text>
              </View>
              <View style={s.smArrow}><ChevronRight size={13} color={COLORS.brownDark} /></View>
            </TouchableOpacity>
          </View>

          {/* Wide cards */}
          {[
            { screen: 'timer', icon: <Timer size={22} color={COLORS.white} />, title: t.card4Title, sub: t.card4Sub, bg: COLORS.brownMid },
            { screen: 'conversion', icon: <ArrowLeftRight size={22} color={COLORS.white} />, title: t.card5Title, sub: t.card5Sub, bg: '#5A3010' },
            { screen: 'glossary', icon: <BookOpen size={22} color={COLORS.white} />, title: 'Glosarium Baking', sub: '35+ istilah teknis baking dengan penjelasan lengkap', bg: '#4A6741' },
          ].map((c) => (
            <TouchableOpacity key={c.screen} style={[s.wideCard, { backgroundColor: c.bg }]} onPress={() => setScreen(c.screen)} activeOpacity={0.85}>
              <View style={s.wideIcon}>{c.icon}</View>
              <View style={s.wideInfo}>
                <Text style={s.wideTitle}>{c.title}</Text>
                <Text style={s.wideSub}>{c.sub}</Text>
              </View>
              <View style={s.wideArrow}><ChevronRight size={14} color={COLORS.white} /></View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        {[
          { key: 'home', icon: <Droplets size={20} color={COLORS.orangeLight} />, label: 'Home' },
          { key: 'recipes', icon: <BookOpen size={20} color={COLORS.tanDark} />, label: lang === 'id' ? 'Resep' : 'Recipes' },
          { key: 'timer', icon: <Timer size={20} color={COLORS.tanDark} />, label: 'Timer' },
          { key: 'glossary', icon: <BookOpen size={20} color={COLORS.tanDark} />, label: lang === 'id' ? 'Glosarium' : 'Glossary' },
        ].map((item) => (
          <TouchableOpacity key={item.key} style={s.navBtn} onPress={() => item.key !== 'home' && setScreen(item.key)}>
            {item.icon}
            <Text style={[s.navLabel, item.key === 'home' && { color: COLORS.orangeLight }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20 },
  logo: { fontFamily: FONTS.playfair900, fontSize: 22, color: COLORS.brownDark },
  logoSpan: { color: COLORS.orange },
  langWrap: { flexDirection: 'row', backgroundColor: COLORS.tan, borderRadius: 20, padding: 3, gap: 2 },
  langBtn: { borderRadius: 16, paddingVertical: 4, paddingHorizontal: 10 },
  langBtnActive: { backgroundColor: COLORS.brownDark },
  langTxt: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.textMid },
  langTxtActive: { color: COLORS.white },
  hero: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },
  heroEye: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.orange, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 },
  heroTitle: { fontFamily: FONTS.playfair900, fontSize: 36, color: COLORS.brownDark, lineHeight: 42, marginBottom: 8 },
  heroSpan: { color: COLORS.orange },
  heroDesc: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textLight, lineHeight: 21 },
  stats: { flexDirection: 'row', gap: 10, paddingHorizontal: 24, paddingBottom: 24 },
  stat: { flex: 1, backgroundColor: COLORS.brownDark, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center' },
  statNum: { fontFamily: FONTS.playfair900, fontSize: 24, color: COLORS.orangeLight, lineHeight: 28 },
  statLabel: { fontFamily: FONTS.dmSansBold, fontSize: 9, color: COLORS.tanDark, letterSpacing: 0.5, marginTop: 4, textTransform: 'uppercase' },
  cards: { paddingHorizontal: 24, paddingBottom: 32, gap: 12 },
  sectionLabel: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.textLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  featCard: { backgroundColor: COLORS.brownDark, borderRadius: 28, padding: 28 },
  featIconWrap: { width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  featEye: { fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.orangeLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 },
  featTitle: { fontFamily: FONTS.playfair900, fontSize: 28, color: COLORS.white, lineHeight: 32, marginBottom: 10 },
  featSub: { fontFamily: FONTS.dmSans, fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 19, marginBottom: 20, maxWidth: '80%' },
  featCta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.orange, borderRadius: 50, paddingVertical: 10, paddingHorizontal: 18, alignSelf: 'flex-start' },
  featCtaTxt: { fontFamily: FONTS.dmSansBold, fontSize: 13, color: COLORS.white },
  row: { flexDirection: 'row', gap: 12 },
  smCard: { flex: 1, borderRadius: 24, padding: 20, minHeight: 140, justifyContent: 'space-between' },
  smCardC1: { backgroundColor: COLORS.orange },
  smCardC2: { backgroundColor: '#E8D5B0' },
  smIconWrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  smTitle: { fontFamily: FONTS.playfair900, fontSize: 15, lineHeight: 19, marginBottom: 4 },
  smSub: { fontFamily: FONTS.dmSans, fontSize: 10, lineHeight: 14, opacity: 0.75 },
  smArrow: { position: 'absolute', right: 14, bottom: 14, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.15)', alignItems: 'center', justifyContent: 'center' },
  wideCard: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 16 },
  wideIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  wideInfo: { flex: 1 },
  wideTitle: { fontFamily: FONTS.playfair900, fontSize: 15, color: COLORS.white, marginBottom: 2 },
  wideSub: { fontFamily: FONTS.dmSans, fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  wideArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.brownDark, paddingTop: 14, paddingBottom: 28, paddingHorizontal: 32, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navBtn: { alignItems: 'center', gap: 4 },
  navLabel: { fontFamily: FONTS.dmSansBold, fontSize: 9, color: COLORS.tanDark, letterSpacing: 0.5, textTransform: 'uppercase' },
});

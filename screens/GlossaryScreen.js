import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronDown, Search, X } from 'lucide-react-native';
import { COLORS, FONTS } from '../constants/theme';
import { GLOSSARY, CAT_COLORS } from '../data/glossary';

const CATS = ['Semua', 'Fermentasi', 'Teknik', 'Bahan', 'Peralatan', 'Hasil'];

export default function GlossaryScreen({ lang, onBack }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Semua');
  const [expanded, setExpanded] = useState(null);

  const filtered = GLOSSARY.filter(g => {
    const matchCat = activeCat === 'Semua' || g.cat === activeCat;
    const matchSearch = !search || g.term.toLowerCase().includes(search.toLowerCase()) || g.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}><ChevronLeft size={20} color={COLORS.white} /></TouchableOpacity>
        <Text style={s.title}>Glosarium Baking</Text>
      </View>

      {/* Search + filter */}
      <View style={{ padding: 12, paddingHorizontal: 24, backgroundColor: COLORS.cream, borderBottomWidth: 1.5, borderBottomColor: COLORS.tan }}>
        <View style={s.searchBar}>
          <Search size={16} color={COLORS.textLight} />
          <TextInput style={s.searchInput} placeholder="Cari istilah..." placeholderTextColor={COLORS.tanDark} value={search} onChangeText={setSearch} />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}><X size={14} color={COLORS.textLight} /></TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {CATS.map(c => {
              const isActive = activeCat === c;
              const color = CAT_COLORS[c] || COLORS.brownDark;
              return (
                <TouchableOpacity key={c} onPress={() => setActiveCat(c)}
                  style={{ paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20, borderWidth: 2, borderColor: isActive ? color : COLORS.tan, backgroundColor: isActive ? color : COLORS.white }}>
                  <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 11, color: isActive ? COLORS.white : COLORS.textMid }}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        <Text style={{ fontFamily: FONTS.dmSansSemiBold, fontSize: 11, color: COLORS.textLight, marginBottom: 12 }}>
          {filtered.length} istilah {search ? `untuk "${search}"` : activeCat !== 'Semua' ? `dalam ${activeCat}` : ''}
        </Text>

        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 48 }}>
            <Search size={40} color={COLORS.tanDark} />
            <Text style={{ fontFamily: FONTS.playfair700, fontSize: 18, color: COLORS.brownDark, marginTop: 12, marginBottom: 6 }}>Tidak Ditemukan</Text>
            <Text style={{ fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textLight }}>Coba kata kunci lain</Text>
          </View>
        ) : filtered.map((g, i) => {
          const catColor = CAT_COLORS[g.cat] || COLORS.brownDark;
          const isExpanded = expanded === i;
          return (
            <TouchableOpacity key={i} onPress={() => setExpanded(isExpanded ? null : i)} activeOpacity={0.85}
              style={[s.termCard, { borderColor: isExpanded ? catColor : COLORS.tan }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: catColor }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.brownDark }}>{g.term}</Text>
                    <Text style={{ fontFamily: FONTS.dmSansSemiBold, fontSize: 10, color: catColor, marginTop: 1 }}>{g.cat}</Text>
                  </View>
                </View>
                <ChevronDown size={16} color={COLORS.textLight} style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }} />
              </View>
              {isExpanded && (
                <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1.5, borderTopColor: catColor + '33' }}>
                  <Text style={{ fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMid, lineHeight: 22 }}>{g.desc}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1.5, borderBottomColor: COLORS.tan },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.brownDark, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: FONTS.playfair900, fontSize: 22, color: COLORS.brownDark },
  body: { padding: 24 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontFamily: FONTS.dmSans, fontSize: 14, color: COLORS.textDark },
  termCard: { backgroundColor: COLORS.white, borderWidth: 2, borderRadius: 16, padding: 14, paddingHorizontal: 16, marginBottom: 8 },
});

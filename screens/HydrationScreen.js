import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants/theme';
import { HYDRATION_PRESETS, getBreadType } from '../data/recipes';

export default function HydrationScreen({ lang, onBack }) {
  const [flourGram, setFlourGram] = useState('500');
  const [liquids, setLiquids] = useState([{ id: 1, presetIdx: 0, gram: '325', customName: '', customPct: '100' }]);
  const [result, setResult] = useState(null);
  const [showPicker, setShowPicker] = useState(null);

  const flour = parseFloat(flourGram) || 0;

  const getPreset = (l) => {
    const p = HYDRATION_PRESETS[l.presetIdx];
    if (p.name === 'Lainnya') return { ...p, waterPct: parseFloat(l.customPct) || 0, name: l.customName || p.name };
    return p;
  };

  const calculate = () => {
    if (!flour) return;
    const totalRaw = liquids.reduce((s, l) => s + (parseFloat(l.gram) || 0), 0);
    const effectiveItems = liquids.map(l => {
      const gram = parseFloat(l.gram) || 0;
      const preset = getPreset(l);
      return { ...preset, gram, waterContrib: Math.round(gram * preset.waterPct) / 100 };
    });
    const totalEff = effectiveItems.reduce((s, i) => s + i.waterContrib, 0);
    const effHyd = Math.round((totalEff / flour) * 100);
    setResult({ rawHyd: Math.round((totalRaw / flour) * 100), effHyd, effectiveItems, ...getBreadType(effHyd) });
    setShowPicker(null);
  };

  const updateLiquid = (id, field, value) => {
    setLiquids(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lang === 'id' ? 'Kalkulator Hidrasi' : 'Hydration Calculator'}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Baker's Tip</Text>
          <Text style={styles.infoText}>Hidrasi efektif memperhitungkan kandungan air nyata tiap bahan. Lebih akurat dari sekadar menjumlahkan berat bahan cair.</Text>
        </View>

        <Text style={styles.label}>{lang === 'id' ? 'Tepung (gram)' : 'Flour (grams)'}</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="500" placeholderTextColor={COLORS.tanDark}
          value={flourGram} onChangeText={v => { setFlourGram(v); setResult(null); }} />

        <Text style={styles.label}>Bahan Cair / Liquid Ingredients</Text>
        {liquids.map(l => {
          const preset = getPreset(l);
          return (
            <View key={l.id}>
              <View style={styles.liquidRow}>
                <TouchableOpacity style={styles.presetBtn} onPress={() => setShowPicker(showPicker === l.id ? null : l.id)}>
                  <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                  <Text style={styles.presetName} numberOfLines={1}>{lang === 'id' ? preset.name : preset.nameEn}</Text>
                  <View style={styles.presetPctBadge}><Text style={styles.presetPctText}>{preset.waterPct}%💧</Text></View>
                  <Text style={{ color: COLORS.textLight, fontSize: 12 }}>▾</Text>
                </TouchableOpacity>
                <TextInput style={styles.gramInput} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.tanDark}
                  value={l.gram} onChangeText={v => updateLiquid(l.id, 'gram', v)} />
                <Text style={styles.gramUnit}>g</Text>
                {liquids.length > 1 && (
                  <TouchableOpacity onPress={() => setLiquids(p => p.filter(x => x.id !== l.id))}>
                    <Text style={{ color: COLORS.textLight, fontSize: 20, paddingHorizontal: 4 }}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
              {showPicker === l.id && (
                <View style={styles.picker}>
                  {HYDRATION_PRESETS.map((p, idx) => (
                    <TouchableOpacity key={idx} style={[styles.pickerOption, l.presetIdx === idx && styles.pickerOptionSelected]}
                      onPress={() => { updateLiquid(l.id, 'presetIdx', idx); setShowPicker(null); }}>
                      <Text style={styles.presetEmoji}>{p.emoji}</Text>
                      <Text style={styles.pickerName}>{lang === 'id' ? p.name : p.nameEn}</Text>
                      <Text style={styles.pickerPct}>{p.waterPct}% air</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity style={styles.addBtn} onPress={() => setLiquids(p => [...p, { id: Date.now(), presetIdx: 0, gram: '', customName: '', customPct: '100' }])}>
          <Text style={styles.addBtnText}>+ Tambah Bahan Cair</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} onPress={calculate}>
          <Text style={styles.primaryBtnText}>💧 {lang === 'id' ? 'Hitung Hidrasi' : 'Calculate Hydration'}</Text>
        </TouchableOpacity>

        {result && (
          <>
            <View style={styles.resultRow}>
              <View style={[styles.resultCard, { flex: 1 }]}>
                <Text style={styles.resultLabel}>Hidrasi Kasar</Text>
                <Text style={styles.resultValue}>{result.rawHyd}%</Text>
                <Text style={styles.resultNote}>Total berat cair ÷ tepung</Text>
              </View>
              <View style={[styles.resultCard, { flex: 1, backgroundColor: '#E8622A' }]}>
                <Text style={styles.resultLabel}>Hidrasi Efektif</Text>
                <Text style={styles.resultValue}>{result.effHyd}%</Text>
                <Text style={styles.resultNote}>Kandungan air nyata ÷ tepung</Text>
              </View>
            </View>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Prediksi Jenis Roti</Text>
              <Text style={styles.resultType}>🍞 {result.type}</Text>
              <View style={styles.hydBar}><View style={[styles.hydFill, { width: `${Math.min(result.effHyd, 100)}%` }]} /></View>
              <Text style={styles.resultDesc}>{result.desc}</Text>
            </View>
            <Text style={styles.sectionHeader}>Rincian Kontribusi Hidrasi</Text>
            {result.effectiveItems.map((item, i) => (
              <View key={i} style={styles.breakdownRow}>
                <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.breakdownName}>{lang === 'id' ? item.name : item.nameEn}</Text>
                  <Text style={styles.breakdownDetail}>{item.gram}g × {item.waterPct}% air</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.breakdownWater}>{item.waterContrib}g</Text>
                  <Text style={styles.breakdownWaterLabel}>air efektif</Text>
                </View>
              </View>
            ))}
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  header: { backgroundColor: COLORS.brownDark, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: COLORS.white, fontSize: 22, fontWeight: '700', marginTop: -2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.cream },
  body: { padding: 20 },
  infoBox: { backgroundColor: '#FFF5EE', borderWidth: 1.5, borderColor: COLORS.orangeLight, borderRadius: 14, padding: 14, marginBottom: 16 },
  infoTitle: { fontSize: 12, fontWeight: '700', color: COLORS.orange, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  infoText: { fontSize: 13, color: COLORS.textMid, lineHeight: 19 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textMid, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
  input: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 13, fontSize: 15, color: COLORS.textDark, marginBottom: 16 },
  liquidRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  presetBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 10 },
  presetEmoji: { fontSize: 16 },
  presetName: { flex: 1, fontSize: 12, fontWeight: '500', color: COLORS.textDark },
  presetPctBadge: { backgroundColor: '#FFF0E6', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  presetPctText: { fontSize: 10, fontWeight: '700', color: COLORS.orange },
  gramInput: { width: 60, backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 10, fontSize: 14, fontWeight: '700', color: COLORS.brownMid, textAlign: 'center' },
  gramUnit: { fontSize: 12, color: COLORS.textLight, fontWeight: '500' },
  picker: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 14, overflow: 'hidden', marginBottom: 8, ...SHADOWS.soft },
  pickerOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, borderBottomWidth: 1, borderBottomColor: COLORS.tan },
  pickerOptionSelected: { backgroundColor: '#FFF5EE' },
  pickerName: { flex: 1, fontSize: 13, fontWeight: '500', color: COLORS.textDark },
  pickerPct: { fontSize: 11, fontWeight: '700', color: COLORS.orange },
  addBtn: { borderWidth: 2, borderColor: COLORS.tanDark, borderStyle: 'dashed', borderRadius: 14, padding: 12, alignItems: 'center', marginBottom: 12 },
  addBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.textLight },
  primaryBtn: { backgroundColor: COLORS.orange, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 8 },
  primaryBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  resultRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  resultCard: { backgroundColor: COLORS.brownDark, borderRadius: 20, padding: 18, marginTop: 10 },
  resultLabel: { fontSize: 10, color: COLORS.orangeLight, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  resultValue: { fontSize: 40, fontWeight: '900', color: COLORS.orangeLight, lineHeight: 44 },
  resultNote: { fontSize: 11, color: COLORS.tanDark, marginTop: 4 },
  resultType: { fontSize: 16, color: COLORS.cream, fontWeight: '500', marginBottom: 10 },
  resultDesc: { fontSize: 13, color: COLORS.tanDark, lineHeight: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
  hydBar: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 8, marginVertical: 10, overflow: 'hidden' },
  hydFill: { height: '100%', borderRadius: 8, backgroundColor: COLORS.orangeLight },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: COLORS.brownDark, marginTop: 16, marginBottom: 10 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 14, padding: 12, marginBottom: 8 },
  breakdownName: { fontSize: 13, fontWeight: '700', color: COLORS.brownDark, marginBottom: 2 },
  breakdownDetail: { fontSize: 11, color: COLORS.textLight },
  breakdownWater: { fontSize: 18, fontWeight: '700', color: COLORS.orange },
  breakdownWaterLabel: { fontSize: 10, color: COLORS.textLight, fontWeight: '500' },
});

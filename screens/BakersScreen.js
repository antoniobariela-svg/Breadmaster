// BakersScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default function BakersScreen({ lang, onBack }) {
  const [mode, setMode] = useState('gramToPct');
  const [scale, setScale] = useState(1);
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Tepung', val: '500', isFlour: true },
    { id: 2, name: 'Air', val: '325', isFlour: false },
    { id: 3, name: 'Garam', val: '10', isFlour: false },
    { id: 4, name: 'Ragi', val: '5', isFlour: false },
  ]);

  const flour = parseFloat(ingredients.find(i => i.isFlour)?.val) || 0;

  const getResult = (ing) => {
    const v = parseFloat(ing.val) || 0;
    if (ing.isFlour) return { gram: v, pct: 100, scaled: Math.round(v * scale * 10) / 10 };
    if (mode === 'gramToPct') {
      const pct = flour > 0 ? Math.round((v / flour) * 1000) / 10 : 0;
      return { gram: v, pct, scaled: Math.round(v * scale * 10) / 10 };
    }
    const gram = flour > 0 ? Math.round((v / 100) * flour * 10) / 10 : 0;
    return { gram, pct: v, scaled: Math.round(gram * scale * 10) / 10 };
  };

  const totalGram = ingredients.reduce((sum, i) => sum + (parseFloat(getResult(i).gram) || 0), 0);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}><Text style={s.backArrow}>‹</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Baker's Percentage</Text>
      </View>
      <ScrollView contentContainerStyle={s.body}>
        <View style={s.infoBox}>
          <Text style={s.infoTitle}>💡 Baker's Tip</Text>
          <Text style={s.infoText}>{lang === 'id' ? "Baker's % dihitung dari berat tepung sebagai 100%." : "Baker's % uses flour weight as 100%."}</Text>
        </View>

        {/* Mode Toggle */}
        <View style={s.modeToggle}>
          <TouchableOpacity style={[s.modeBtn, mode === 'gramToPct' && s.modeBtnActive]} onPress={() => setMode('gramToPct')}>
            <Text style={[s.modeBtnText, mode === 'gramToPct' && s.modeBtnTextActive]}>Gram → %</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.modeBtn, mode === 'pctToGram' && s.modeBtnActive]} onPress={() => setMode('pctToGram')}>
            <Text style={[s.modeBtnText, mode === 'pctToGram' && s.modeBtnTextActive]}>% → Gram</Text>
          </TouchableOpacity>
        </View>

        {/* Scale */}
        <View style={s.scaleRow}>
          <Text style={s.scaleLabel}>🔢 {lang === 'id' ? 'Scale Resep' : 'Scale Recipe'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity style={s.scaleCircle} onPress={() => setScale(sc => Math.max(0.25, Math.round((sc - 0.25) * 4) / 4))}>
              <Text style={s.scaleCircleText}>−</Text>
            </TouchableOpacity>
            <Text style={s.scaleVal}>{scale}×</Text>
            <TouchableOpacity style={s.scaleCircle} onPress={() => setScale(sc => Math.round((sc + 0.25) * 4) / 4)}>
              <Text style={s.scaleCircleText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ingredients */}
        {ingredients.map(ing => (
          <View key={ing.id} style={s.ingRow}>
            <TextInput style={[s.ingName, ing.isFlour && { color: COLORS.textLight }]}
              placeholder={ing.isFlour ? (lang === 'id' ? 'Tepung (basis)' : 'Flour (base)') : (lang === 'id' ? 'Nama bahan' : 'Ingredient')}
              placeholderTextColor={COLORS.tanDark} value={ing.name} editable={!ing.isFlour}
              onChangeText={v => setIngredients(p => p.map(i => i.id === ing.id ? { ...i, name: v } : i))} />
            <View style={s.divider} />
            <TextInput style={s.ingVal} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.tanDark}
              value={ing.val} onChangeText={v => setIngredients(p => p.map(i => i.id === ing.id ? { ...i, val: v } : i))} />
            <Text style={s.ingUnit}>{(ing.isFlour || mode === 'gramToPct') ? 'g' : '%'}</Text>
            <Text style={s.ingResult}>{ing.isFlour ? '100%' : mode === 'gramToPct' ? `${getResult(ing).pct}%` : `${getResult(ing).gram}g`}</Text>
            {!ing.isFlour && (
              <TouchableOpacity onPress={() => setIngredients(p => p.filter(i => i.id !== ing.id))}>
                <Text style={{ color: COLORS.textLight, fontSize: 20, paddingLeft: 4 }}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={s.addBtn} onPress={() => setIngredients(p => [...p, { id: Date.now(), name: '', val: '', isFlour: false }])}>
          <Text style={s.addBtnText}>+ {lang === 'id' ? 'Tambah Bahan' : 'Add Ingredient'}</Text>
        </TouchableOpacity>

        {/* Result Table */}
        {flour > 0 && (
          <>
            <Text style={s.sectionHeader}>{lang === 'id' ? 'Tabel Hasil' : 'Result Table'} {scale > 1 ? `(${scale}×)` : ''}</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                {[lang === 'id' ? 'Bahan' : 'Ingredient', 'Gram', 'Scaled', "Baker's %"].map((h, i) => (
                  <Text key={i} style={[s.th, i > 0 && { textAlign: 'right' }]}>{h}</Text>
                ))}
              </View>
              {ingredients.map(ing => {
                const r = getResult(ing);
                return (
                  <View key={ing.id} style={[s.tableRow, ing.isFlour && { backgroundColor: '#FFF5EE' }]}>
                    <Text style={s.td}>{ing.name || '—'}</Text>
                    <Text style={[s.td, { textAlign: 'right' }]}>{r.gram}g</Text>
                    <Text style={[s.td, { textAlign: 'right' }]}>{r.scaled}g</Text>
                    <Text style={[s.td, { textAlign: 'right', color: COLORS.orange, fontWeight: '700' }]}>{r.pct}%</Text>
                  </View>
                );
              })}
              <View style={[s.tableRow, { backgroundColor: COLORS.cream, borderTopWidth: 2, borderTopColor: COLORS.tan }]}>
                <Text style={[s.td, { fontWeight: '700', color: COLORS.brownDark }]}>{lang === 'id' ? 'Total' : 'Total'}</Text>
                <Text style={[s.td, { textAlign: 'right', fontWeight: '700', color: COLORS.brownDark }]}>{Math.round(totalGram)}g</Text>
                <Text style={[s.td, { textAlign: 'right', fontWeight: '700', color: COLORS.brownDark }]}>{Math.round(totalGram * scale)}g</Text>
                <Text style={[s.td, { textAlign: 'right', fontWeight: '700', color: COLORS.brownDark }]}>—</Text>
              </View>
            </View>
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  header: { backgroundColor: COLORS.brownDark, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: COLORS.white, fontSize: 22, fontWeight: '700', marginTop: -2 },
  headerTitle: { fontSize: 20, fontFamily: FONTS.display, color: COLORS.cream },
  body: { padding: 20 },
  infoBox: { backgroundColor: '#FFF5EE', borderWidth: 1.5, borderColor: COLORS.orangeLight, borderRadius: 14, padding: 14, marginBottom: 16 },
  infoTitle: { fontSize: 12, fontWeight: '700', color: COLORS.orange, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  infoText: { fontSize: 13, color: COLORS.textMid, lineHeight: 19 },
  modeToggle: { flexDirection: 'row', backgroundColor: COLORS.tan, borderRadius: 14, padding: 4, gap: 4, marginBottom: 16 },
  modeBtn: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  modeBtnActive: { backgroundColor: COLORS.brownDark },
  modeBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.textMid },
  modeBtnTextActive: { color: COLORS.white },
  scaleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5EE', borderWidth: 1.5, borderColor: COLORS.orangeLight, borderRadius: 14, padding: 14, marginBottom: 16 },
  scaleLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: COLORS.brownMid },
  scaleCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.brownDark, alignItems: 'center', justifyContent: 'center' },
  scaleCircleText: { color: COLORS.white, fontSize: 20, fontWeight: '700', lineHeight: 22 },
  scaleVal: { fontSize: 20, fontWeight: '900', color: COLORS.brownDark, minWidth: 36, textAlign: 'center' },
  ingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 14, padding: 10, marginBottom: 8, gap: 6 },
  ingName: { flex: 1.2, fontSize: 14, fontWeight: '500', color: COLORS.textDark },
  divider: { width: 1, height: 20, backgroundColor: COLORS.tan },
  ingVal: { flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.brownMid, textAlign: 'right' },
  ingUnit: { fontSize: 11, color: COLORS.textLight, fontWeight: '500', width: 18 },
  ingResult: { fontSize: 12, fontWeight: '700', color: COLORS.orange, width: 40, textAlign: 'right' },
  addBtn: { borderWidth: 2, borderColor: COLORS.tanDark, borderStyle: 'dashed', borderRadius: 14, padding: 12, alignItems: 'center', marginBottom: 12 },
  addBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.textLight },
  sectionHeader: { fontSize: 16, fontFamily: FONTS.display, color: COLORS.brownDark, marginBottom: 10 },
  table: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1.5, borderColor: COLORS.tan },
  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.brownDark, padding: 10, paddingHorizontal: 14 },
  th: { flex: 1, fontSize: 10, fontWeight: '700', color: COLORS.tanDark, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', padding: 11, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: COLORS.tan },
  td: { flex: 1, fontSize: 13, color: COLORS.textMid },
});

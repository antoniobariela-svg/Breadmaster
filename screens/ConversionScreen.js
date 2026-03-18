import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/theme';
import { BAKING_INGREDIENTS, GAS_MARKS } from '../data/recipes';

const WEIGHT_UNITS = ['gram', 'kilogram', 'ons (oz)', 'pound (lb)', 'mililiter (ml)', 'tablespoon', 'teaspoon', 'cups'];

function toGram(value, unit, gPerCup) {
  const v = parseFloat(value) || 0;
  switch (unit) {
    case 'gram': return v;
    case 'kilogram': return v * 1000;
    case 'ons (oz)': return v * 28.3495;
    case 'pound (lb)': return v * 453.592;
    case 'mililiter (ml)': return v;
    case 'tablespoon': return v * 14.1748;
    case 'teaspoon': return v * 4.7249;
    case 'cups': return v * (gPerCup || 125);
    default: return v;
  }
}

function fromGram(grams, unit, gPerCup) {
  const g = parseFloat(grams) || 0;
  switch (unit) {
    case 'gram': return Math.round(g * 100) / 100;
    case 'kilogram': return Math.round(g / 10) / 100;
    case 'ons (oz)': return Math.round((g / 28.3495) * 100) / 100;
    case 'pound (lb)': return Math.round((g / 453.592) * 1000) / 1000;
    case 'mililiter (ml)': return Math.round(g * 100) / 100;
    case 'tablespoon': return Math.round((g / 14.1748) * 100) / 100;
    case 'teaspoon': return Math.round((g / 4.7249) * 100) / 100;
    case 'cups': return Math.round((g / (gPerCup || 125)) * 1000) / 1000;
    default: return g;
  }
}

export default function ConversionScreen({ lang, onBack }) {
  const [tab, setTab] = useState('weight');
  const [fromUnit, setFromUnit] = useState('gram');
  const [toUnit, setToUnit] = useState('ons (oz)');
  const [fromVal, setFromVal] = useState('');
  const [ingIdx, setIngIdx] = useState(0);
  const [showIngPicker, setShowIngPicker] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [tempFrom, setTempFrom] = useState('celsius');
  const [tempVal, setTempVal] = useState('');
  const [showGasPicker, setShowGasPicker] = useState(false);

  const ing = BAKING_INGREDIENTS[ingIdx];
  const needsIng = fromUnit === 'cups' || toUnit === 'cups';

  const weightResult = fromVal ? fromGram(toGram(fromVal, fromUnit, ing.gPerCup), toUnit, ing.gPerCup) : null;

  const getTempResult = () => {
    const v = parseFloat(tempVal);
    if (isNaN(v) && tempFrom !== 'gas mark') return null;
    if (tempFrom === 'celsius') return { c: v, f: Math.round(v * 9/5 + 32), gas: GAS_MARKS.reduce((a, b) => Math.abs(b.celsius - v) < Math.abs(a.celsius - v) ? b : a) };
    if (tempFrom === 'fahrenheit') return { f: v, c: Math.round((v - 32) * 5/9), gas: GAS_MARKS.reduce((a, b) => Math.abs(b.fahrenheit - v) < Math.abs(a.fahrenheit - v) ? b : a) };
    return null;
  };

  const tempResult = getTempResult();

  const UnitPicker = ({ visible, onClose, selected, onSelect }) => {
    if (!visible) return null;
    return (
      <View style={s.picker}>
        {WEIGHT_UNITS.map(u => (
          <TouchableOpacity key={u} style={[s.pickerOption, selected === u && s.pickerOptionSelected]} onPress={() => { onSelect(u); onClose(); }}>
            <Text style={[s.pickerText, selected === u && { color: COLORS.orange, fontWeight: '700' }]}>{u.charAt(0).toUpperCase() + u.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}><Text style={s.backArrow}>‹</Text></TouchableOpacity>
        <Text style={s.headerTitle}>{lang === 'id' ? 'Konversi' : 'Converter'}</Text>
      </View>
      <ScrollView contentContainerStyle={s.body}>
        {/* Tab */}
        <View style={s.modeToggle}>
          <TouchableOpacity style={[s.modeBtn, tab === 'weight' && s.modeBtnActive]} onPress={() => setTab('weight')}>
            <Text style={[s.modeBtnText, tab === 'weight' && s.modeBtnTextActive]}>⚖️ {lang === 'id' ? 'Berat' : 'Weight'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.modeBtn, tab === 'temp' && s.modeBtnActive]} onPress={() => setTab('temp')}>
            <Text style={[s.modeBtnText, tab === 'temp' && s.modeBtnTextActive]}>🌡️ {lang === 'id' ? 'Suhu' : 'Temperature'}</Text>
          </TouchableOpacity>
        </View>

        {tab === 'weight' && (
          <>
            <View style={s.infoBox}>
              <Text style={s.infoTitle}>💡 Tips</Text>
              <Text style={s.infoText}>Untuk konversi ke/dari Cups, pilih jenis bahan karena kepadatannya berbeda-beda.</Text>
            </View>

            <Text style={s.label}>{lang === 'id' ? 'Dari' : 'From'}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <TextInput style={[s.input, { flex: 1 }]} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.tanDark} value={fromVal} onChangeText={setFromVal} />
              <TouchableOpacity style={[s.unitBtn, { flex: 1 }]} onPress={() => { setShowFromPicker(!showFromPicker); setShowToPicker(false); }}>
                <Text style={s.unitBtnText}>{fromUnit.charAt(0).toUpperCase() + fromUnit.slice(1)} ▾</Text>
              </TouchableOpacity>
            </View>
            <UnitPicker visible={showFromPicker} onClose={() => setShowFromPicker(false)} selected={fromUnit} onSelect={u => { setFromUnit(u); setFromVal(''); }} />

            {/* Swap */}
            <TouchableOpacity style={s.swapBtn} onPress={() => { const tmp = fromUnit; setFromUnit(toUnit); setToUnit(tmp); setFromVal(''); }}>
              <Text style={s.swapText}>⇄</Text>
            </TouchableOpacity>

            <Text style={s.label}>{lang === 'id' ? 'Ke' : 'To'}</Text>
            <TouchableOpacity style={[s.unitBtn, { marginBottom: 12 }]} onPress={() => { setShowToPicker(!showToPicker); setShowFromPicker(false); }}>
              <Text style={s.unitBtnText}>{toUnit.charAt(0).toUpperCase() + toUnit.slice(1)} ▾</Text>
            </TouchableOpacity>
            <UnitPicker visible={showToPicker} onClose={() => setShowToPicker(false)} selected={toUnit} onSelect={setToUnit} />

            {needsIng && (
              <>
                <Text style={s.label}>{lang === 'id' ? 'Jenis Bahan (untuk Cups)' : 'Ingredient (for Cups)'}</Text>
                <TouchableOpacity style={[s.unitBtn, { marginBottom: 8 }]} onPress={() => setShowIngPicker(!showIngPicker)}>
                  <Text style={s.unitBtnText}>{lang === 'id' ? ing.name : ing.nameEn} — {ing.gPerCup}g/cup ▾</Text>
                </TouchableOpacity>
                {showIngPicker && (
                  <View style={s.picker}>
                    {BAKING_INGREDIENTS.map((b, i) => (
                      <TouchableOpacity key={i} style={[s.pickerOption, ingIdx === i && s.pickerOptionSelected]} onPress={() => { setIngIdx(i); setShowIngPicker(false); }}>
                        <Text style={[s.pickerText, { flex: 1 }]}>{lang === 'id' ? b.name : b.nameEn}</Text>
                        <Text style={{ fontSize: 11, color: COLORS.orange, fontWeight: '700' }}>{b.gPerCup}g/cup</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}

            {weightResult !== null && fromVal && (
              <View style={s.resultCard}>
                <Text style={s.resultLabel}>{lang === 'id' ? 'Hasil Konversi' : 'Result'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                  <Text style={s.resultValue}>{weightResult}</Text>
                  <Text style={{ fontSize: 18, color: COLORS.tanDark }}>{toUnit}</Text>
                </View>
                <Text style={s.resultDesc}>{fromVal} {fromUnit} = {weightResult} {toUnit}{needsIng ? `\n* Berdasarkan ${lang === 'id' ? ing.name : ing.nameEn} (${ing.gPerCup}g/cup)` : ''}</Text>
              </View>
            )}

            <Text style={s.sectionHeader}>Referensi Cepat</Text>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 14, overflow: 'hidden', borderWidth: 1.5, borderColor: COLORS.tan }}>
              {[['1 cup', '≈ 240 ml', '≈ 16 tbsp'], ['1 tbsp', '≈ 14.2g air', '≈ 3 tsp'], ['1 oz', '≈ 28.35g', '≈ 0.063 lb'], ['1 lb', '≈ 453.6g', '≈ 16 oz'], ['1 kg', '= 1000g', '≈ 2.205 lb']].map(([a, b, c], i, arr) => (
                <View key={i} style={{ flexDirection: 'row', padding: 10, paddingHorizontal: 14, backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.cream, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: COLORS.tan }}>
                  <Text style={{ flex: 1, fontSize: 12, fontWeight: '700', color: COLORS.brownDark }}>{a}</Text>
                  <Text style={{ flex: 1, fontSize: 12, color: COLORS.textMid }}>{b}</Text>
                  <Text style={{ flex: 1, fontSize: 12, color: COLORS.textMid }}>{c}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {tab === 'temp' && (
          <>
            <View style={s.infoBox}>
              <Text style={s.infoTitle}>💡 Tips</Text>
              <Text style={s.infoText}>Gas Mark adalah skala oven gas yang umum di Inggris & Eropa.</Text>
            </View>

            <Text style={s.label}>{lang === 'id' ? 'Satuan Asal' : 'From Unit'}</Text>
            <View style={[s.modeToggle, { marginBottom: 16 }]}>
              {['celsius', 'fahrenheit', 'gas mark'].map(u => (
                <TouchableOpacity key={u} style={[s.modeBtn, tempFrom === u && s.modeBtnActive]} onPress={() => { setTempFrom(u); setTempVal(''); }}>
                  <Text style={[s.modeBtnText, tempFrom === u && s.modeBtnTextActive]}>
                    {u === 'celsius' ? '°C' : u === 'fahrenheit' ? '°F' : 'Gas'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {tempFrom === 'gas mark' ? (
              <>
                <TouchableOpacity style={[s.unitBtn, { marginBottom: 8 }]} onPress={() => setShowGasPicker(!showGasPicker)}>
                  <Text style={s.unitBtnText}>{tempVal ? `Gas ${tempVal}` : 'Pilih Gas Mark'} ▾</Text>
                </TouchableOpacity>
                {showGasPicker && (
                  <View style={s.picker}>
                    {GAS_MARKS.map((g, i) => (
                      <TouchableOpacity key={i} style={[s.pickerOption, tempVal === g.gas && s.pickerOptionSelected]}
                        onPress={() => { setTempVal(g.gas); setShowGasPicker(false); }}>
                        <Text style={[s.pickerText, { flex: 1 }]}>Gas {g.gas} — {g.desc}</Text>
                        <Text style={{ fontSize: 11, color: COLORS.orange, fontWeight: '700' }}>{g.celsius}°C</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            ) : (
              <TextInput style={[s.input, { marginBottom: 16 }]} keyboardType="numeric"
                placeholder={tempFrom === 'celsius' ? '180' : '350'} placeholderTextColor={COLORS.tanDark}
                value={tempVal} onChangeText={setTempVal} />
            )}

            {tempResult && tempVal && (
              <>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={[s.resultCard, { flex: 1 }]}>
                    <Text style={s.resultLabel}>Celsius</Text>
                    <Text style={s.resultValue}>{tempResult.c}°</Text>
                  </View>
                  <View style={[s.resultCard, { flex: 1, backgroundColor: COLORS.orange }]}>
                    <Text style={s.resultLabel}>Fahrenheit</Text>
                    <Text style={s.resultValue}>{tempResult.f}°</Text>
                  </View>
                </View>
                <View style={[s.resultCard, { marginTop: 10 }]}>
                  <Text style={s.resultLabel}>Gas Mark Terdekat</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={s.resultValue}>Gas {tempResult.gas.gas}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.tanDark, lineHeight: 19 }}>{tempResult.gas.desc}</Text>
                  </View>
                </View>
              </>
            )}

            <Text style={s.sectionHeader}>Tabel Gas Mark Lengkap</Text>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 14, overflow: 'hidden', borderWidth: 1.5, borderColor: COLORS.tan }}>
              <View style={{ flexDirection: 'row', backgroundColor: COLORS.brownDark, padding: 10, paddingHorizontal: 14 }}>
                {['Gas', '°C', '°F', 'Ket.'].map((h, i) => <Text key={i} style={[s.th, { flex: i === 3 ? 2 : 1 }]}>{h}</Text>)}
              </View>
              {GAS_MARKS.map((g, i) => (
                <View key={i} style={{ flexDirection: 'row', padding: 9, paddingHorizontal: 14, backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.cream, borderBottomWidth: i < GAS_MARKS.length - 1 ? 1 : 0, borderBottomColor: COLORS.tan }}>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: '700', color: COLORS.orange }}>Gas {g.gas}</Text>
                  <Text style={{ flex: 1, fontSize: 13, color: COLORS.textMid }}>{g.celsius}°</Text>
                  <Text style={{ flex: 1, fontSize: 13, color: COLORS.textMid }}>{g.fahrenheit}°</Text>
                  <Text style={{ flex: 2, fontSize: 11, color: COLORS.textLight }}>{g.desc}</Text>
                </View>
              ))}
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.cream },
  body: { padding: 20 },
  infoBox: { backgroundColor: '#FFF5EE', borderWidth: 1.5, borderColor: COLORS.orangeLight, borderRadius: 14, padding: 14, marginBottom: 16 },
  infoTitle: { fontSize: 12, fontWeight: '700', color: COLORS.orange, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  infoText: { fontSize: 13, color: COLORS.textMid, lineHeight: 19 },
  modeToggle: { flexDirection: 'row', backgroundColor: COLORS.tan, borderRadius: 14, padding: 4, gap: 4, marginBottom: 16 },
  modeBtn: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  modeBtnActive: { backgroundColor: COLORS.brownDark },
  modeBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.textMid },
  modeBtnTextActive: { color: COLORS.white },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textMid, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
  input: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 13, fontSize: 15, color: COLORS.textDark },
  unitBtn: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 13 },
  unitBtnText: { fontSize: 14, color: COLORS.textDark, fontWeight: '500' },
  swapBtn: { alignSelf: 'center', width: 40, height: 40, backgroundColor: COLORS.tan, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  swapText: { fontSize: 18, color: COLORS.brownMid, fontWeight: '700' },
  picker: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  pickerOption: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: COLORS.tan },
  pickerOptionSelected: { backgroundColor: '#FFF5EE' },
  pickerText: { fontSize: 13, color: COLORS.textDark },
  resultCard: { backgroundColor: COLORS.brownDark, borderRadius: 20, padding: 18 },
  resultLabel: { fontSize: 10, color: COLORS.orangeLight, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  resultValue: { fontSize: 40, fontWeight: '900', color: COLORS.orangeLight, lineHeight: 44 },
  resultDesc: { fontSize: 13, color: COLORS.tanDark, marginTop: 8, lineHeight: 19 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: COLORS.brownDark, marginTop: 20, marginBottom: 10 },
  th: { flex: 1, fontSize: 10, fontWeight: '700', color: COLORS.tanDark, textTransform: 'uppercase' },
});

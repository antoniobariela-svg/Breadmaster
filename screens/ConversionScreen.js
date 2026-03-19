import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronDown, ArrowLeftRight, Scale, Droplet, Lightbulb } from 'lucide-react-native';
import { COLORS, FONTS } from '../constants/theme';
import { BAKING_INGREDIENTS, GAS_MARKS } from '../data/index';

const UNIT_DATA = [
  { val: 'gram',          label: 'Gram',       sub: 'g',    isVolume: false },
  { val: 'kilogram',      label: 'Kilogram',   sub: 'kg',   isVolume: false },
  { val: 'ons (oz)',      label: 'Ons',        sub: 'oz',   isVolume: false },
  { val: 'pound (lb)',    label: 'Pound',      sub: 'lb',   isVolume: false },
  { val: 'mililiter (ml)',label: 'Mililiter',  sub: 'ml',   isVolume: true },
  { val: 'tablespoon',    label: 'Tablespoon', sub: 'tbsp', isVolume: true },
  { val: 'teaspoon',      label: 'Teaspoon',   sub: 'tsp',  isVolume: true },
  { val: 'cups',          label: 'Cups',       sub: 'cup',  isVolume: true },
];

function toGramFn(v, u, g) {
  const n = parseFloat(v) || 0;
  switch(u) {
    case 'gram': return n; case 'kilogram': return n*1000;
    case 'ons (oz)': return n*28.3495; case 'pound (lb)': return n*453.592;
    case 'mililiter (ml)': return n; case 'tablespoon': return n*14.1748;
    case 'teaspoon': return n*4.7249; case 'cups': return n*(g||125);
    default: return n;
  }
}
function fromGramFn(g, u, gpc) {
  const n = parseFloat(g)||0;
  switch(u) {
    case 'gram': return Math.round(n*100)/100; case 'kilogram': return Math.round(n/10)/100;
    case 'ons (oz)': return Math.round((n/28.3495)*100)/100; case 'pound (lb)': return Math.round((n/453.592)*1000)/1000;
    case 'mililiter (ml)': return Math.round(n*100)/100; case 'tablespoon': return Math.round((n/14.1748)*100)/100;
    case 'teaspoon': return Math.round((n/4.7249)*100)/100; case 'cups': return Math.round((n/(gpc||125))*1000)/1000;
    default: return n;
  }
}

function UnitPicker({ value, onChange, label, show, setShow }) {
  const selected = UNIT_DATA.find(u => u.val === value) || UNIT_DATA[0];
  const SelIcon = selected.isVolume ? Droplet : Scale;
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={s.label}>{label}</Text>
      <TouchableOpacity style={s.presetBadge} onPress={() => setShow(!show)}>
        <View style={{ width: 32, height: 32, backgroundColor: COLORS.cream, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}>
          <SelIcon size={15} color={COLORS.brownMid} />
        </View>
        <Text style={[s.presetName, { fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.brownDark }]}>{selected.label}</Text>
        <View style={{ backgroundColor: '#FFF0E6', borderRadius: 8, paddingVertical: 2, paddingHorizontal: 6 }}>
          <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.orange }}>{selected.sub}</Text>
        </View>
        <ChevronDown size={13} color={COLORS.textLight} style={{ transform: [{ rotate: show ? '180deg' : '0deg' }] }} />
      </TouchableOpacity>
      {show && (
        <View style={s.picker}>
          {UNIT_DATA.map(u => {
            const UIc = u.isVolume ? Droplet : Scale;
            return (
              <TouchableOpacity key={u.val} style={[s.pickOpt, value === u.val && s.pickOptActive]}
                onPress={() => { onChange(u.val); setShow(false); }}>
                <View style={{ width: 30, height: 30, backgroundColor: value === u.val ? '#FFF0E6' : COLORS.cream, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                  <UIc size={14} color={value === u.val ? COLORS.orange : COLORS.brownMid} />
                </View>
                <Text style={[s.pickName, value === u.val && { fontFamily: FONTS.dmSansBold }]}>{u.label}</Text>
                <Text style={s.pickSub}>{u.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
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

  const ing = BAKING_INGREDIENTS[ingIdx];
  const needsIng = fromUnit === 'cups' || toUnit === 'cups';
  const weightResult = fromVal ? fromGramFn(toGramFn(fromVal, fromUnit, ing.gPerCup), toUnit, ing.gPerCup) : null;

  const getTempResult = () => {
    const v = parseFloat(tempVal);
    if (isNaN(v)) return null;
    if (tempFrom === 'celsius') return { c: v, f: Math.round(v*9/5+32), gas: GAS_MARKS.reduce((a,b) => Math.abs(b.celsius-v)<Math.abs(a.celsius-v)?b:a) };
    return { f: v, c: Math.round((v-32)*5/9), gas: GAS_MARKS.reduce((a,b) => Math.abs(b.fahrenheit-v)<Math.abs(a.fahrenheit-v)?b:a) };
  };
  const tempResult = getTempResult();
  const fromSub = UNIT_DATA.find(u => u.val === fromUnit)?.sub || '';
  const toSub = UNIT_DATA.find(u => u.val === toUnit)?.sub || '';

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}><ChevronLeft size={20} color={COLORS.white} /></TouchableOpacity>
        <Text style={s.title}>Konversi</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        {/* Tab toggle */}
        <View style={s.modeToggle}>
          <TouchableOpacity style={[s.modeBtn, tab === 'weight' && s.modeBtnActive]} onPress={() => setTab('weight')}>
            <Text style={[s.modeBtnTxt, tab === 'weight' && s.modeBtnActiveTxt]}>⚖️ Berat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.modeBtn, tab === 'temp' && s.modeBtnActive]} onPress={() => setTab('temp')}>
            <Text style={[s.modeBtnTxt, tab === 'temp' && s.modeBtnActiveTxt]}>🌡️ Suhu</Text>
          </TouchableOpacity>
        </View>

        {tab === 'weight' && (
          <>
            <View style={{ marginBottom: 18 }}>
              <Text style={s.label}>Nilai</Text>
              <TextInput style={s.input} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.tanDark} value={fromVal} onChangeText={setFromVal} />
            </View>

            <UnitPicker label="Dari" value={fromUnit} onChange={v => { setFromUnit(v); setFromVal(''); }} show={showFromPicker}
              setShow={v => { setShowFromPicker(v); if(v) setShowToPicker(false); }} />

            <View style={{ alignItems: 'center', marginVertical: -4, marginBottom: 4 }}>
              <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.brownDark, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => { const t = fromUnit; setFromUnit(toUnit); setToUnit(t); setFromVal(''); setShowFromPicker(false); setShowToPicker(false); }}>
                <ArrowLeftRight size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <UnitPicker label="Ke" value={toUnit} onChange={v => { setToUnit(v); }} show={showToPicker}
              setShow={v => { setShowToPicker(v); if(v) setShowFromPicker(false); }} />

            {needsIng && (
              <View style={{ marginBottom: 18 }}>
                <Text style={s.label}>Jenis Bahan</Text>
                <TouchableOpacity style={s.presetBadge} onPress={() => setShowIngPicker(!showIngPicker)}>
                  <Text style={s.presetName}>{lang === 'id' ? ing.name : ing.nameEn}</Text>
                  <View style={{ backgroundColor: '#FFF0E6', borderRadius: 8, paddingVertical: 2, paddingHorizontal: 6 }}>
                    <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.orange }}>{ing.gPerCup}g/cup</Text>
                  </View>
                  <ChevronDown size={12} color={COLORS.textLight} />
                </TouchableOpacity>
                {showIngPicker && (
                  <View style={s.picker}>
                    {BAKING_INGREDIENTS.map((b, i) => (
                      <TouchableOpacity key={i} style={[s.pickOpt, ingIdx === i && s.pickOptActive]} onPress={() => { setIngIdx(i); setShowIngPicker(false); }}>
                        <Text style={s.pickName}>{b.name}</Text>
                        <Text style={s.pickSub}>{b.gPerCup}g/cup</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {weightResult !== null && fromVal && (
              <View style={s.resultCard}>
                <Text style={s.resultLabel}>Hasil</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                  <Text style={s.resultVal}>{weightResult}</Text>
                  <Text style={{ fontFamily: FONTS.dmSansMedium, fontSize: 18, color: COLORS.tanDark }}>{toSub}</Text>
                </View>
                <Text style={{ fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.tanDark, marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' }}>
                  {fromVal} {fromSub} = <Text style={{ fontFamily: FONTS.dmSansBold, color: COLORS.orangeLight }}>{weightResult} {toSub}</Text>
                </Text>
              </View>
            )}
          </>
        )}

        {tab === 'temp' && (
          <>
            <View style={{ marginBottom: 18 }}>
              <Text style={s.label}>Satuan</Text>
              <View style={s.modeToggle}>
                {['celsius','fahrenheit'].map(u => (
                  <TouchableOpacity key={u} style={[s.modeBtn, tempFrom === u && s.modeBtnActive]} onPress={() => { setTempFrom(u); setTempVal(''); }}>
                    <Text style={[s.modeBtnTxt, tempFrom === u && s.modeBtnActiveTxt]}>{u === 'celsius' ? '°C' : '°F'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ marginBottom: 18 }}>
              <Text style={s.label}>Suhu</Text>
              <TextInput style={s.input} keyboardType="numeric" placeholder={tempFrom === 'celsius' ? '180' : '350'} placeholderTextColor={COLORS.tanDark} value={tempVal} onChangeText={setTempVal} />
            </View>
            {tempResult && tempVal && (
              <>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                  <View style={[s.resultCard, { flex: 1, padding: 16 }]}>
                    <Text style={s.resultLabel}>Celsius</Text>
                    <Text style={[s.resultVal, { fontSize: 36 }]}>{tempResult.c}°</Text>
                  </View>
                  <View style={[s.resultCard, { flex: 1, padding: 16, backgroundColor: COLORS.orange }]}>
                    <Text style={s.resultLabel}>Fahrenheit</Text>
                    <Text style={[s.resultVal, { fontSize: 36 }]}>{tempResult.f}°</Text>
                  </View>
                </View>
                <View style={[s.resultCard, { marginTop: 10, padding: 16 }]}>
                  <Text style={s.resultLabel}>Gas Mark Terdekat</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={[s.resultVal, { fontSize: 36 }]}>Gas {tempResult.gas.gas}</Text>
                    <Text style={{ fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.tanDark }}>{tempResult.gas.desc}</Text>
                  </View>
                </View>
              </>
            )}
          </>
        )}
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
  label: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.textLight, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontFamily: FONTS.dmSans, fontSize: 15, color: COLORS.textDark },
  modeToggle: { flexDirection: 'row', backgroundColor: COLORS.tan, borderRadius: 16, padding: 4, gap: 4, marginBottom: 20 },
  modeBtn: { flex: 1, borderRadius: 12, paddingVertical: 11, alignItems: 'center' },
  modeBtnActive: { backgroundColor: COLORS.brownDark },
  modeBtnTxt: { fontFamily: FONTS.dmSansBold, fontSize: 12, color: COLORS.textMid },
  modeBtnActiveTxt: { color: COLORS.white },
  presetBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, padding: 12, paddingHorizontal: 14 },
  presetName: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textDark, flex: 1 },
  picker: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 14, overflow: 'hidden', marginTop: 6 },
  pickOpt: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: COLORS.tan },
  pickOptActive: { backgroundColor: '#FFF5EE' },
  pickName: { flex: 1, fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textDark },
  pickSub: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.orange },
  resultCard: { backgroundColor: COLORS.brownDark, borderRadius: 22, padding: 24 },
  resultLabel: { fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.orangeLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  resultVal: { fontFamily: FONTS.playfair900, fontSize: 52, color: COLORS.orangeLight, lineHeight: 56 },
});

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import { ChevronLeft, Droplets, Droplet, Flame, FlaskConical, Plus, X, ChevronDown, Lightbulb, HelpCircle, Wheat } from 'lucide-react-native';
import { COLORS, FONTS } from '../constants/theme';
import { TEXT } from '../data/index';

function getBreadType(h) {
  if (h < 60) return { type: 'Roti Padat / Dense Bread', desc: 'Hidrasi rendah, cocok untuk bagel atau pretzel.' };
  if (h < 70) return { type: 'Roti Lunak / Soft Bread', desc: 'Hidrasi seimbang untuk roti tawar atau sandwich.' };
  if (h < 80) return { type: 'Artisan Bread / Sourdough', desc: 'Hidrasi tinggi menghasilkan crumb terbuka.' };
  return { type: 'Slack Dough / Focaccia', desc: 'Hidrasi sangat tinggi, sempurna untuk focaccia.' };
}

export default function HydrationScreen({ lang, onBack, liquidDB, setLiquidDB, importedData, clearImport }) {
  const t = TEXT[lang];
  const [flourGram, setFlourGram] = useState('500');
  const [liquids, setLiquids] = useState([{ id: 1, presetIdx: 0, gram: '325', customName: '', customPct: '' }]);
  const [result, setResult] = useState(null);
  const [showPicker, setShowPicker] = useState(null);
  const [saveModal, setSaveModal] = useState(null);

  useEffect(() => {
    if (!importedData) return;
    setFlourGram(importedData.flourGram);
    const newLiquids = importedData.liquids.map((l, i) => {
      const found = liquidDB.findIndex(p => p.name.toLowerCase() === l.name.toLowerCase() || p.nameEn.toLowerCase() === l.name.toLowerCase());
      return { id: Date.now() + i, presetIdx: found >= 0 ? found : -1, gram: l.gram, customName: found < 0 ? l.name : '', customPct: '' };
    });
    setLiquids(newLiquids.length > 0 ? newLiquids : [{ id: 1, presetIdx: 0, gram: '325', customName: '', customPct: '' }]);
    setResult(null);
    clearImport();
  }, [importedData]);

  const getPreset = (l) => {
    if (l.presetIdx >= 0 && l.presetIdx < liquidDB.length) return liquidDB[l.presetIdx];
    const pct = parseFloat(l.customPct);
    return { name: l.customName || 'Lainnya', nameEn: l.customName || 'Other', waterPct: isNaN(pct) ? null : pct, icon: 'droplet', isCustom: true };
  };

  const calculate = () => {
    const flour = parseFloat(flourGram);
    if (!flour) return;
    const totalRaw = liquids.reduce((s, l) => s + (parseFloat(l.gram) || 0), 0);
    const validItems = liquids.map(l => {
      const p = getPreset(l);
      const gram = parseFloat(l.gram) || 0;
      return p.waterPct !== null ? { ...p, gram, waterContrib: Math.round(gram * p.waterPct) / 100 } : null;
    }).filter(Boolean);
    const totalEff = validItems.reduce((s, i) => s + i.waterContrib, 0);
    const effHyd = Math.round((totalEff / flour) * 100);
    setResult({ rawHyd: Math.round((totalRaw / flour) * 100), effHyd, effectiveItems: validItems, ...getBreadType(effHyd) });
    setShowPicker(null);
  };

  const saveToDB = () => {
    if (!saveModal) return;
    const exists = liquidDB.some(p => p.name.toLowerCase() === saveModal.name.toLowerCase());
    if (!exists) setLiquidDB(prev => [...prev, { name: saveModal.name, nameEn: saveModal.name, waterPct: saveModal.pct, icon: 'droplet', custom: true }]);
    const newIdx = exists ? liquidDB.findIndex(x => x.name.toLowerCase() === saveModal.name.toLowerCase()) : liquidDB.length;
    setLiquids(p => p.map(l => l.id === saveModal.liquidId ? { ...l, presetIdx: newIdx, customName: '', customPct: '' } : l));
    setSaveModal(null);
  };

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}><ChevronLeft size={20} color={COLORS.white} /></TouchableOpacity>
        <Text style={s.title}>{t.hydrationTitle}</Text>
      </View>

      {/* Save Modal */}
      <Modal visible={!!saveModal} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Simpan Bahan Baru?</Text>
            <Text style={s.modalDesc}>Tambahkan <Text style={{ fontWeight: '700' }}>"{saveModal?.name}"</Text> ({saveModal?.pct}% air) ke database?</Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalBtnCancel} onPress={() => setSaveModal(null)}><Text style={s.modalBtnCancelTxt}>Tidak</Text></TouchableOpacity>
              <TouchableOpacity style={s.modalBtnOk} onPress={saveToDB}><Text style={s.modalBtnOkTxt}>Ya, Simpan</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        {/* Info box */}
        <View style={s.infoBox}>
          <View style={s.infoTitle}><Lightbulb size={12} color={COLORS.brownDark} /><Text style={s.infoTitleTxt}>Baker's Tip</Text></View>
          <Text style={s.infoText}>Hidrasi efektif memperhitungkan kandungan air nyata tiap bahan. Bahan baru bisa disimpan ke database.</Text>
        </View>

        {/* Tepung */}
        <View style={s.formGroup}>
          <Text style={s.label}>{t.flourLabel}</Text>
          <TextInput style={s.input} keyboardType="numeric" placeholder="500" placeholderTextColor={COLORS.tanDark} value={flourGram} onChangeText={v => { setFlourGram(v); setResult(null); }} />
        </View>

        <Text style={s.label}>Bahan Cair</Text>
        {liquids.map(l => {
          const preset = getPreset(l);
          const isCustom = l.presetIdx < 0;
          return (
            <View key={l.id} style={{ marginBottom: 10 }}>
              <View style={s.liquidRow}>
                <TouchableOpacity style={s.presetBadge} onPress={() => setShowPicker(showPicker === l.id ? null : l.id)}>
                  {preset.waterPct !== null
                    ? <View style={s.pctBadge}><Text style={s.pctBadgeTxt}>{preset.waterPct}%</Text></View>
                    : <HelpCircle size={14} color={COLORS.orange} />
                  }
                  <Text style={s.presetName} numberOfLines={1}>{lang === 'id' ? preset.name : preset.nameEn}</Text>
                  <ChevronDown size={12} color={COLORS.textLight} />
                </TouchableOpacity>
                <TextInput style={s.gramInput} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.tanDark} value={l.gram}
                  onChangeText={v => { setLiquids(p => p.map(x => x.id === l.id ? { ...x, gram: v } : x)); setResult(null); }} />
                <Text style={s.gramUnit}>g</Text>
                {liquids.length > 1 && <TouchableOpacity onPress={() => setLiquids(p => p.filter(x => x.id !== l.id))}><X size={15} color={COLORS.tanDark} /></TouchableOpacity>}
              </View>

              {showPicker === l.id && (
                <View style={s.picker}>
                  {liquidDB.map((p, idx) => (
                    <TouchableOpacity key={idx} style={[s.pickOpt, l.presetIdx === idx && s.pickOptActive]}
                      onPress={() => { setLiquids(prev => prev.map(x => x.id === l.id ? { ...x, presetIdx: idx, customName: '', customPct: '' } : x)); setShowPicker(null); setResult(null); }}>
                      <Droplet size={14} color={COLORS.brownMid} />
                      <Text style={s.pickName}>{lang === 'id' ? p.name : p.nameEn}</Text>
                      <Text style={s.pickPct}>{p.waterPct}% air</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={[s.pickOpt, l.presetIdx === -1 && s.pickOptActive]}
                    onPress={() => { setLiquids(prev => prev.map(x => x.id === l.id ? { ...x, presetIdx: -1, customName: '', customPct: '' } : x)); setShowPicker(null); }}>
                    <Plus size={14} color={COLORS.brownMid} />
                    <Text style={s.pickName}>Bahan lain...</Text>
                    <Text style={s.pickPct}>—</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isCustom && (
                <View style={s.customBox}>
                  <TextInput style={[s.input, { flex: 1, marginBottom: 0 }]} placeholder="Nama bahan..." placeholderTextColor={COLORS.tanDark} value={l.customName}
                    onChangeText={v => setLiquids(p => p.map(x => x.id === l.id ? { ...x, customName: v } : x))} />
                  <TextInput style={[s.input, { width: 52, marginBottom: 0, textAlign: 'center' }]} keyboardType="numeric" placeholder="%" placeholderTextColor={COLORS.tanDark} value={l.customPct}
                    onChangeText={v => setLiquids(p => p.map(x => x.id === l.id ? { ...x, customPct: v } : x))} />
                  <TouchableOpacity style={s.okBtn}
                    onPress={() => { const pct = parseFloat(l.customPct); if (!l.customName.trim() || isNaN(pct)) return; setSaveModal({ name: l.customName.trim(), pct, liquidId: l.id }); }}>
                    <Text style={s.okBtnTxt}>OK</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity style={s.addBtn} onPress={() => setLiquids(p => [...p, { id: Date.now(), presetIdx: 0, gram: '', customName: '', customPct: '' }])}>
          <Plus size={14} color={COLORS.textLight} />
          <Text style={s.addBtnTxt}>Tambah Bahan Cair</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.primaryBtn} onPress={calculate}>
          <Droplets size={16} color={COLORS.white} />
          <Text style={s.primaryBtnTxt}>{t.calcBtn}</Text>
        </TouchableOpacity>

        {result && (
          <>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <View style={[s.resultCard, { flex: 1, padding: 16 }]}>
                <Text style={s.resultLabel}>Hidrasi Kasar</Text>
                <Text style={[s.resultVal, { fontSize: 36 }]}>{result.rawHyd}%</Text>
              </View>
              <View style={[s.resultCard, { flex: 1, padding: 16, backgroundColor: COLORS.orange }]}>
                <Text style={s.resultLabel}>Hidrasi Efektif</Text>
                <Text style={[s.resultVal, { fontSize: 36 }]}>{result.effHyd}%</Text>
              </View>
            </View>
            <View style={[s.resultCard, { marginTop: 10 }]}>
              <Text style={s.resultLabel}>Prediksi Jenis Roti</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Wheat size={16} color={COLORS.cream} />
                <Text style={s.resultType}>{result.type}</Text>
              </View>
              <View style={s.hydBar}><View style={[s.hydFill, { width: `${Math.min(result.effHyd, 100)}%` }]} /></View>
              <Text style={s.resultDesc}>{result.desc}</Text>
            </View>
            {result.effectiveItems.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text style={s.sectionTitle}>Rincian Kontribusi</Text>
                {result.effectiveItems.map((item, i) => (
                  <View key={i} style={s.hbRow}>
                    <View style={s.hbIcon}><Droplet size={18} color={COLORS.brownMid} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.hbName}>{item.name}</Text>
                      <Text style={s.hbDetail}>{item.gram}g × {item.waterPct}% air</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={s.hbWater}>{item.waterContrib}g</Text>
                      <Text style={s.hbWaterLabel}>air efektif</Text>
                    </View>
                  </View>
                ))}
              </View>
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
  infoBox: { backgroundColor: COLORS.cream, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 16, padding: 14, marginBottom: 16 },
  infoTitle: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  infoTitleTxt: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.brownDark, textTransform: 'uppercase', letterSpacing: 1 },
  infoText: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMid, lineHeight: 20 },
  formGroup: { marginBottom: 18 },
  label: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.textLight, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontFamily: FONTS.dmSans, fontSize: 15, color: COLORS.textDark, marginBottom: 0 },
  liquidRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  presetBadge: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, padding: 10, overflow: 'hidden' },
  pctBadge: { backgroundColor: '#FFF0E6', borderRadius: 8, paddingVertical: 2, paddingHorizontal: 6 },
  pctBadgeTxt: { fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.orange },
  presetName: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textDark, flex: 1 },
  gramInput: { width: 70, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, padding: 10, fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.brownMid, textAlign: 'center' },
  gramUnit: { fontFamily: FONTS.dmSans, fontSize: 12, color: COLORS.textLight },
  picker: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  pickOpt: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: COLORS.tan },
  pickOptActive: { backgroundColor: '#FFF5EE' },
  pickName: { flex: 1, fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textDark },
  pickPct: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.orange },
  customBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF5EE', borderWidth: 1.5, borderColor: COLORS.orangeLight, borderRadius: 12, padding: 10, marginTop: 4 },
  okBtn: { backgroundColor: COLORS.orange, borderRadius: 8, paddingVertical: 7, paddingHorizontal: 11 },
  okBtnTxt: { fontFamily: FONTS.dmSansBold, fontSize: 12, color: COLORS.white },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.tanDark, borderRadius: 16, padding: 13, marginBottom: 16, marginTop: 4 },
  addBtnTxt: { fontFamily: FONTS.dmSansBold, fontSize: 13, color: COLORS.textLight },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.brownDark, borderRadius: 16, padding: 16, marginTop: 8 },
  primaryBtnTxt: { fontFamily: FONTS.dmSansBold, fontSize: 15, color: COLORS.white },
  resultCard: { backgroundColor: COLORS.brownDark, borderRadius: 22, padding: 24 },
  resultLabel: { fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.orangeLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  resultVal: { fontFamily: FONTS.playfair900, fontSize: 52, color: COLORS.orangeLight, lineHeight: 56 },
  resultType: { fontFamily: FONTS.dmSansSemiBold, fontSize: 16, color: COLORS.cream },
  hydBar: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 8, marginVertical: 12, overflow: 'hidden' },
  hydFill: { height: '100%', backgroundColor: COLORS.orangeLight, borderRadius: 8 },
  resultDesc: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.tanDark, lineHeight: 21, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' },
  sectionTitle: { fontFamily: FONTS.playfair700, fontSize: 16, color: COLORS.brownDark, marginBottom: 10 },
  hbRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 18, padding: 14, marginBottom: 8 },
  hbIcon: { width: 36, height: 36, backgroundColor: COLORS.cream, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  hbName: { fontFamily: FONTS.dmSansSemiBold, fontSize: 13, color: COLORS.brownDark, marginBottom: 2 },
  hbDetail: { fontFamily: FONTS.dmSans, fontSize: 11, color: COLORS.textLight },
  hbWater: { fontFamily: FONTS.playfair700, fontSize: 18, color: COLORS.orange, lineHeight: 22 },
  hbWaterLabel: { fontFamily: FONTS.dmSans, fontSize: 10, color: COLORS.textLight },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, width: '100%', maxWidth: 340 },
  modalTitle: { fontFamily: FONTS.playfair700, fontSize: 18, color: COLORS.brownDark, marginBottom: 8 },
  modalDesc: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMid, lineHeight: 21, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', gap: 10 },
  modalBtnCancel: { flex: 1, backgroundColor: COLORS.tan, borderRadius: 12, padding: 13, alignItems: 'center' },
  modalBtnCancelTxt: { fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.brownDark },
  modalBtnOk: { flex: 1, backgroundColor: COLORS.orange, borderRadius: 12, padding: 13, alignItems: 'center' },
  modalBtnOkTxt: { fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.white },
});

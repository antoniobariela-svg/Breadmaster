import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Modal, Alert,
} from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../constants/theme';
import { getBreadType } from '../data/recipes';

export default function HydrationScreen({ lang, onBack, liquidDB, setLiquidDB, importedData, clearImport }) {
  const [flourGram, setFlourGram] = useState('500');
  const [liquids, setLiquids] = useState([{ id: 1, presetIdx: 0, gram: '325', customName: '', customPct: '' }]);
  const [result, setResult] = useState(null);
  const [showPicker, setShowPicker] = useState(null);
  const [saveModal, setSaveModal] = useState(null); // { name, pct, liquidId }
  const [manualPcts, setManualPcts] = useState({}); // { liquidId: pctString }

  const flour = parseFloat(flourGram) || 0;

  // Saat ada data dari Baker's %
  useEffect(() => {
    if (importedData) {
      setFlourGram(importedData.flourGram);
      const newLiquids = importedData.liquids.map((item, i) => {
        const found = findInDB(item.name);
        return {
          id: Date.now() + i,
          presetIdx: found ? liquidDB.indexOf(found) : -1,
          gram: item.gram,
          customName: found ? '' : item.name,
          customPct: found ? '' : '',
          importedName: !found ? item.name : null,
        };
      });
      setLiquids(newLiquids.length > 0 ? newLiquids : [{ id: 1, presetIdx: 0, gram: '325', customName: '', customPct: '' }]);
      setResult(null);
      setManualPcts({});
      clearImport();
    }
  }, [importedData]);

  // Case-insensitive search di database
  const findInDB = (name) => {
    const n = name.trim().toLowerCase();
    return liquidDB.find(p => p.name.toLowerCase() === n || p.nameEn.toLowerCase() === n);
  };

  const getPreset = (l) => {
    // Bahan diimpor tapi tidak ada di DB
    if (l.importedName) {
      const manualPct = parseFloat(manualPcts[l.id]);
      return { name: l.importedName, nameEn: l.importedName, waterPct: isNaN(manualPct) ? null : manualPct, emoji: '💧', unknown: true };
    }
    if (l.presetIdx === -1 || l.presetIdx >= liquidDB.length) {
      return { name: l.customName || 'Lainnya', nameEn: l.customName || 'Other', waterPct: parseFloat(l.customPct) || null, emoji: '➕', custom: true };
    }
    return liquidDB[l.presetIdx];
  };

  const calculate = () => {
    if (!flour) return;
    const totalRaw = liquids.reduce((s, l) => s + (parseFloat(l.gram) || 0), 0);
    const effectiveItems = liquids
      .map(l => {
        const gram = parseFloat(l.gram) || 0;
        const preset = getPreset(l);
        if (preset.waterPct === null || preset.waterPct === undefined) return null;
        return { ...preset, gram, waterContrib: Math.round(gram * preset.waterPct) / 100 };
      })
      .filter(Boolean);
    const totalEff = effectiveItems.reduce((s, i) => s + i.waterContrib, 0);
    const effHyd = Math.round((totalEff / flour) * 100);
    setResult({ rawHyd: Math.round((totalRaw / flour) * 100), effHyd, effectiveItems, ...getBreadType(effHyd) });
    setShowPicker(null);
  };

  const handleSaveToDB = () => {
    if (!saveModal) return;
    const exists = findInDB(saveModal.name);
    if (!exists) {
      setLiquidDB(prev => [...prev, {
        name: saveModal.name,
        nameEn: saveModal.name,
        waterPct: saveModal.pct,
        emoji: '💧',
      }]);
    }
    // Update liquid entry agar tidak unknown lagi
    setLiquids(prev => prev.map(l => l.id === saveModal.liquidId
      ? { ...l, importedName: null, presetIdx: -1, customName: saveModal.name, customPct: String(saveModal.pct) }
      : l
    ));
    setSaveModal(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Modal simpan bahan baru */}
      <Modal visible={!!saveModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>💾 Simpan Bahan Baru?</Text>
            <Text style={styles.modalDesc}>
              Tambahkan <Text style={{ fontWeight: '700', color: COLORS.brownDark }}>"{saveModal?.name}"</Text> ({saveModal?.pct}% air) ke database untuk dipakai lagi nanti?
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalBtnNo} onPress={() => setSaveModal(null)}>
                <Text style={styles.modalBtnNoText}>Tidak</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnYes} onPress={handleSaveToDB}>
                <Text style={styles.modalBtnYesText}>Ya, Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lang === 'id' ? 'Kalkulator Hidrasi' : 'Hydration Calculator'}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body}>

        {/* Banner import dari Baker's % */}
        {liquids.some(l => l.importedName !== undefined && l.importedName !== null) || (importedData === null && liquids[0]?.importedName) ? null : null}
        {liquids.some(l => l.gram && l.presetIdx !== undefined) && flourGram && (
          <View style={[styles.infoBox, { backgroundColor: COLORS.brownDark, borderColor: COLORS.brownMid }]}>
            <Text style={[styles.infoTitle, { color: COLORS.orangeLight }]}>💧 Diimpor dari Baker's %</Text>
            <Text style={[styles.infoText, { color: COLORS.tanDark }]}>Komposisi terisi otomatis. Periksa % air tiap bahan lalu hitung hidrasi!</Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Baker's Tip</Text>
          <Text style={styles.infoText}>Hidrasi efektif memperhitungkan kandungan air nyata tiap bahan. Bahan baru bisa disimpan ke database.</Text>
        </View>

        <Text style={styles.label}>{lang === 'id' ? 'Tepung (gram)' : 'Flour (grams)'}</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="500" placeholderTextColor={COLORS.tanDark}
          value={flourGram} onChangeText={v => { setFlourGram(v); setResult(null); }} />

        <Text style={styles.label}>Bahan Cair / Liquid Ingredients</Text>
        {liquids.map(l => {
          const preset = getPreset(l);
          const isUnknown = preset.unknown || (preset.custom && (preset.waterPct === null || preset.waterPct === undefined));

          return (
            <View key={l.id} style={{ marginBottom: 10 }}>
              <View style={styles.liquidRow}>
                {/* Nama bahan - tap untuk buka picker (atau tampil langsung jika imported) */}
                <TouchableOpacity
                  style={[styles.presetBtn, isUnknown && { borderColor: COLORS.orange }]}
                  onPress={() => setShowPicker(showPicker === l.id ? null : l.id)}>
                  <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                  <Text style={styles.presetName} numberOfLines={1}>{lang === 'id' ? preset.name : preset.nameEn}</Text>
                  {preset.waterPct !== null && preset.waterPct !== undefined
                    ? <View style={styles.presetPctBadge}><Text style={styles.presetPctText}>{preset.waterPct}%💧</Text></View>
                    : <View style={[styles.presetPctBadge, { backgroundColor: '#FFF0E6' }]}><Text style={[styles.presetPctText, { color: COLORS.orange }]}>❓</Text></View>
                  }
                  <Text style={{ color: COLORS.textLight, fontSize: 12 }}>▾</Text>
                </TouchableOpacity>
                <TextInput style={styles.gramInput} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.tanDark}
                  value={l.gram} onChangeText={v => { setLiquids(p => p.map(x => x.id === l.id ? { ...x, gram: v } : x)); setResult(null); }} />
                <Text style={styles.gramUnit}>g</Text>
                {liquids.length > 1 && (
                  <TouchableOpacity onPress={() => setLiquids(p => p.filter(x => x.id !== l.id))}>
                    <Text style={{ color: COLORS.textLight, fontSize: 22, paddingHorizontal: 4 }}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Input manual % jika tidak diketahui */}
              {isUnknown && (
                <View style={styles.unknownRow}>
                  <Text style={styles.unknownText}>
                    "<Text style={{ fontWeight: '700' }}>{preset.name}</Text>" tidak ada di database. Masukkan % air:
                  </Text>
                  <TextInput
                    style={styles.pctInput}
                    keyboardType="numeric"
                    placeholder="0-100"
                    placeholderTextColor={COLORS.tanDark}
                    value={manualPcts[l.id] || ''}
                    onChangeText={v => setManualPcts(p => ({ ...p, [l.id]: v }))}
                  />
                  <Text style={{ fontSize: 11, color: COLORS.textLight }}>%</Text>
                  <TouchableOpacity
                    style={styles.okBtn}
                    onPress={() => {
                      const pct = parseFloat(manualPcts[l.id]);
                      if (isNaN(pct) || pct < 0 || pct > 100) return;
                      // Update liquid
                      setLiquids(p => p.map(x => x.id === l.id
                        ? { ...x, importedName: null, presetIdx: -1, customName: preset.name, customPct: String(pct) }
                        : x
                      ));
                      // Tanya simpan ke DB
                      setSaveModal({ name: preset.name, pct, liquidId: l.id });
                    }}>
                    <Text style={styles.okBtnText}>OK</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Picker dropdown */}
              {showPicker === l.id && (
                <View style={styles.picker}>
                  {liquidDB.map((p, idx) => (
                    <TouchableOpacity key={idx}
                      style={[styles.pickerOption, l.presetIdx === idx && styles.pickerOptionSelected]}
                      onPress={() => {
                        setLiquids(prev => prev.map(x => x.id === l.id
                          ? { ...x, presetIdx: idx, customName: '', customPct: '', importedName: null }
                          : x
                        ));
                        setShowPicker(null);
                        setResult(null);
                      }}>
                      <Text style={styles.presetEmoji}>{p.emoji}</Text>
                      <Text style={styles.pickerName}>{lang === 'id' ? p.name : p.nameEn}</Text>
                      <Text style={styles.pickerPct}>{p.waterPct}% air</Text>
                    </TouchableOpacity>
                  ))}
                  {/* Opsi custom */}
                  <TouchableOpacity
                    style={[styles.pickerOption, l.presetIdx === -1 && styles.pickerOptionSelected]}
                    onPress={() => {
                      setLiquids(prev => prev.map(x => x.id === l.id
                        ? { ...x, presetIdx: -1, customName: '', customPct: '', importedName: null }
                        : x
                      ));
                      setShowPicker(null);
                    }}>
                    <Text style={styles.presetEmoji}>✏️</Text>
                    <Text style={styles.pickerName}>{lang === 'id' ? 'Bahan Kustom...' : 'Custom ingredient...'}</Text>
                    <Text style={styles.pickerPct}>—</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Input custom jika pilih kustom */}
              {l.presetIdx === -1 && !l.importedName && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                  <TextInput
                    style={[styles.input, { flex: 2, marginBottom: 0 }]}
                    placeholder={lang === 'id' ? 'Nama bahan' : 'Ingredient name'}
                    placeholderTextColor={COLORS.tanDark}
                    value={l.customName}
                    onChangeText={v => setLiquids(p => p.map(x => x.id === l.id ? { ...x, customName: v } : x))}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="% air"
                    placeholderTextColor={COLORS.tanDark}
                    keyboardType="numeric"
                    value={l.customPct}
                    onChangeText={v => setLiquids(p => p.map(x => x.id === l.id ? { ...x, customPct: v } : x))}
                  />
                  {l.customName && l.customPct && (
                    <TouchableOpacity style={styles.okBtn}
                      onPress={() => setSaveModal({ name: l.customName, pct: parseFloat(l.customPct), liquidId: l.id })}>
                      <Text style={styles.okBtnText}>💾</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity style={styles.addBtn}
          onPress={() => setLiquids(p => [...p, { id: Date.now(), presetIdx: 0, gram: '', customName: '', customPct: '' }])}>
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
  headerTitle: { fontSize: 20, fontFamily: FONTS.display, color: COLORS.cream },
  body: { padding: 20 },
  infoBox: { backgroundColor: '#FFF5EE', borderWidth: 1.5, borderColor: COLORS.orangeLight, borderRadius: 14, padding: 14, marginBottom: 16 },
  infoTitle: { fontSize: 12, fontWeight: '700', color: COLORS.orange, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  infoText: { fontSize: 13, color: COLORS.textMid, lineHeight: 19 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textMid, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
  input: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 13, fontSize: 15, color: COLORS.textDark, marginBottom: 16 },
  liquidRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  presetBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 10 },
  presetEmoji: { fontSize: 16 },
  presetName: { flex: 1, fontSize: 12, fontWeight: '500', color: COLORS.textDark },
  presetPctBadge: { backgroundColor: '#FFF0E6', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  presetPctText: { fontSize: 10, fontWeight: '700', color: COLORS.orange },
  gramInput: { width: 60, backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 10, fontSize: 14, fontWeight: '700', color: COLORS.brownMid, textAlign: 'center' },
  gramUnit: { fontSize: 12, color: COLORS.textLight, fontWeight: '500' },
  picker: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 14, overflow: 'hidden', marginTop: 4, marginBottom: 4, ...SHADOWS.soft },
  pickerOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, borderBottomWidth: 1, borderBottomColor: COLORS.tan },
  pickerOptionSelected: { backgroundColor: '#FFF5EE' },
  pickerName: { flex: 1, fontSize: 13, fontWeight: '500', color: COLORS.textDark },
  pickerPct: { fontSize: 11, fontWeight: '700', color: COLORS.orange },
  unknownRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF5EE', borderWidth: 1.5, borderColor: COLORS.orangeLight, borderRadius: 12, padding: 10, marginTop: 4 },
  unknownText: { flex: 1, fontSize: 12, color: COLORS.textMid, lineHeight: 17 },
  pctInput: { width: 52, backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 8, padding: 6, fontSize: 13, fontWeight: '700', color: COLORS.brownMid, textAlign: 'center' },
  okBtn: { backgroundColor: COLORS.orange, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  okBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
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
  sectionHeader: { fontSize: 16, fontFamily: FONTS.display, color: COLORS.brownDark, marginTop: 16, marginBottom: 10 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 14, padding: 12, marginBottom: 8 },
  breakdownName: { fontSize: 13, fontWeight: '700', color: COLORS.brownDark, marginBottom: 2 },
  breakdownDetail: { fontSize: 11, color: COLORS.textLight },
  breakdownWater: { fontSize: 18, fontWeight: '700', color: COLORS.orange },
  breakdownWaterLabel: { fontSize: 10, color: COLORS.textLight, fontWeight: '500' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, width: '100%' },
  modalTitle: { fontFamily: FONTS.display, fontSize: 18, color: COLORS.brownDark, marginBottom: 10 },
  modalDesc: { fontSize: 13, color: COLORS.textMid, lineHeight: 20, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', gap: 10 },
  modalBtnNo: { flex: 1, backgroundColor: COLORS.tan, borderRadius: 12, padding: 14, alignItems: 'center' },
  modalBtnNoText: { fontSize: 14, fontWeight: '700', color: COLORS.brownDark },
  modalBtnYes: { flex: 1, backgroundColor: COLORS.orange, borderRadius: 12, padding: 14, alignItems: 'center' },
  modalBtnYesText: { fontSize: 14, fontWeight: '700', color: COLORS.white },
});

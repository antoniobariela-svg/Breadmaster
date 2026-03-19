import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Plus, X, Wheat, ChevronRight, Droplets, Calculator, Lightbulb, Trophy, ThumbsUp, AlertTriangle, ChevronDown, Flame, Layers, Wind, Box, Circle, Clock, FlaskConical, Thermometer, Trash2 } from 'lucide-react-native';
import { COLORS, FONTS } from '../constants/theme';

const DRY = ['garam','salt','ragi','yeast','gula','sugar','bubuk','powder','maizena','baking','soda','cinnamon','vanilla','merica','pepper','aren'];
const isDry = (n) => DRY.some(k => n.toLowerCase().includes(k));

const BREAD_STANDARDS = {
  'Sourdough':  { hydration:[65,85], yeast:[15,25], salt:[1.8,2.2], bulkTime:[4,8], roomTemp:[24,28], ovenTemp:[230,260] },
  'Roti Tawar': { hydration:[58,72], yeast:[1,2],   salt:[1.6,2.4], bulkTime:[1,2], roomTemp:[26,30], ovenTemp:[170,190] },
  'Croissant':  { hydration:[46,58], yeast:[0.8,1.6],salt:[1.5,2.5], bulkTime:[1,2], roomTemp:[20,24], ovenTemp:[195,210] },
  'Ciabatta':   { hydration:[72,90], yeast:[0.3,0.8],salt:[1.6,2.4], bulkTime:[3,6], roomTemp:[22,26], ovenTemp:[220,250] },
  'Focaccia':   { hydration:[77,93], yeast:[0.5,1.2],salt:[2.0,3.0], bulkTime:[2,4], roomTemp:[24,28], ovenTemp:[210,230] },
  'Bagel':      { hydration:[52,64], yeast:[0.6,1.4],salt:[1.6,2.4], bulkTime:[1,2], roomTemp:[24,28], ovenTemp:[210,230] },
};

const OVEN_TYPES = [
  { val: 'konvensional', label: 'Konvensional', sub: 'Oven listrik/gas biasa', Icon: Box },
  { val: 'convection',   label: 'Convection',   sub: 'Ada kipas/fan',          Icon: Wind },
  { val: 'dutch',        label: 'Dutch Oven',   sub: 'Panci besi tutup',       Icon: Circle },
  { val: 'batu',         label: 'Batu/Steel',   sub: 'Baking stone/steel',     Icon: Layers },
  { val: 'tangkring',    label: 'Tangkring',    sub: 'Oven kompor',            Icon: Flame },
];

function RecipeEditor({ initialData, onSave, onDelete, onBack, onSendToHydration, lang }) {
  const [tab, setTab] = useState('bahan');
  const [name, setName] = useState(initialData?.name || '');
  const [emoji, setEmoji] = useState(initialData?.emoji || '🍞');
  const [category, setCategory] = useState(initialData?.category || '');
  const [ingredients, setIngredients] = useState(initialData?.ingredients || [
    { id: 1, name: 'Tepung', val: '500', isFlour: true },
    { id: 2, name: 'Air', val: '325', isFlour: false },
  ]);
  const [steps, setSteps] = useState(initialData?.steps || [{ id: 1, text: '' }]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [scale, setScale] = useState(1);
  const [showPrediksi, setShowPrediksi] = useState(false);
  const [predTarget, setPredTarget] = useState('');
  const [predSuhuRuang, setPredSuhuRuang] = useState('');
  const [predWaktuBulk, setPredWaktuBulk] = useState('');
  const [predJenisOven, setPredJenisOven] = useState('');
  const [predSuhuOven, setPredSuhuOven] = useState('');
  const [predResult, setPredResult] = useState(null);
  const isNew = !initialData;

  const flour = parseFloat(ingredients.find(i => i.isFlour)?.val) || 0;
  const getPct = (ing) => { const v = parseFloat(ing.val) || 0; if (ing.isFlour) return 100; return flour > 0 ? Math.round((v / flour) * 1000) / 10 : 0; };
  const totalGram = ingredients.reduce((s, i) => s + (parseFloat(i.val) || 0), 0);
  const liquidGram = ingredients.filter(i => !i.isFlour && !isDry(i.name)).reduce((s, i) => s + (parseFloat(i.val) || 0), 0);
  const hydration = flour > 0 ? Math.round((liquidGram / flour) * 100) : 0;

  const EMOJIS = ['🍞','🥖','🥐','🫓','🍩','🥯','🧁','🍕','🌾','🧀'];
  const CATEGORIES = ['Soft Bread','Artisan','Enriched','Flatbread','Pastry','Sweet','Savory'];

  const handleSave = () => {
    const recipe = {
      id: initialData?.id || Date.now(),
      name: name || 'Resep Tanpa Nama',
      emoji, category, ingredients, steps, notes, hydration,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    onSave(recipe);
  };

  const hitungPrediksi = () => {
    const std = BREAD_STANDARDS[predTarget];
    if (!std || !flour) return;
    const scoreRange = (val, min, max) => {
      if (val >= min && val <= max) return 100;
      const mid = (min + max) / 2, radius = (max - min) / 2;
      return Math.max(0, Math.round(100 - (Math.abs(val - mid) - radius) / radius * 100));
    };
    const yeastIng = ingredients.find(i => !i.isFlour && (i.name.toLowerCase().includes('ragi') || i.name.toLowerCase().includes('starter')));
    const saltIng = ingredients.find(i => !i.isFlour && i.name.toLowerCase().includes('garam'));
    const yeastPct = yeastIng ? ((parseFloat(yeastIng.val)||0) / flour) * 100 : 0;
    const saltPct = saltIng ? ((parseFloat(saltIng.val)||0) / flour) * 100 : 0;
    const factors = [
      { label: 'Hidrasi',       val: hydration,                       range: std.hydration, weight: 25, unit: '%',  iconKey: 'droplets' },
      { label: 'Ragi/Starter',  val: Math.round(yeastPct*10)/10,      range: std.yeast,     weight: 20, unit: '%',  iconKey: 'flask' },
      { label: 'Garam',         val: Math.round(saltPct*10)/10,       range: std.salt,      weight: 10, unit: '%',  iconKey: 'layers' },
      { label: 'Suhu Ruang',    val: parseFloat(predSuhuRuang)||0,    range: std.roomTemp,  weight: 20, unit: '°C', iconKey: 'therm' },
      { label: 'Waktu Bulk',    val: parseFloat(predWaktuBulk)||0,    range: std.bulkTime,  weight: 15, unit: 'j',  iconKey: 'clock' },
      { label: 'Suhu Oven',     val: parseFloat(predSuhuOven)||0,     range: std.ovenTemp,  weight: 10, unit: '°C', iconKey: 'flame' },
    ];
    const scored = factors.map(f => ({ ...f, score: scoreRange(f.val, f.range[0], f.range[1]) }));
    const total = Math.round(scored.reduce((s,f) => s + f.score * f.weight, 0) / scored.reduce((s,f) => s + f.weight, 0));
    setPredResult({ scored, total });
  };

  const FactorIcon = ({ iconKey }) => {
    const props = { size: 16, color: COLORS.brownMid };
    if (iconKey === 'droplets') return <Droplets {...props} />;
    if (iconKey === 'flask') return <FlaskConical {...props} />;
    if (iconKey === 'layers') return <Layers {...props} />;
    if (iconKey === 'therm') return <Thermometer {...props} />;
    if (iconKey === 'clock') return <Clock {...props} />;
    if (iconKey === 'flame') return <Flame {...props} />;
    return null;
  };

  return (
    <View style={s.screen}>
      <View style={[s.header, { justifyContent: 'space-between' }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}><ChevronLeft size={20} color={COLORS.white} /></TouchableOpacity>
        <Text style={s.title}>{isNew ? 'Resep Baru' : name || 'Edit Resep'}</Text>
        <TouchableOpacity style={s.saveBtn} onPress={handleSave}><Text style={s.saveBtnTxt}>Simpan</Text></TouchableOpacity>
      </View>

      {/* Name & emoji area */}
      <View style={{ padding: 14, paddingHorizontal: 24, backgroundColor: COLORS.cream, borderBottomWidth: 1.5, borderBottomColor: COLORS.tan }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <View style={{ width: 48, height: 48, backgroundColor: COLORS.brownDark, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24 }}>{emoji}</Text>
          </View>
          <TextInput style={[s.input, { flex: 1, marginBottom: 0, fontFamily: FONTS.playfair700, fontSize: 16 }]}
            placeholder="Nama resepmu..." placeholderTextColor={COLORS.tanDark} value={name} onChangeText={setName} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {EMOJIS.map(e => (
              <TouchableOpacity key={e} onPress={() => setEmoji(e)} style={{ width: 36, height: 36, borderRadius: 10, borderWidth: 2, borderColor: emoji === e ? COLORS.orange : COLORS.tan, backgroundColor: emoji === e ? '#FFF0E6' : COLORS.white, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* Tabs */}
        <View style={{ flexDirection: 'row' }}>
          {[['bahan','Bahan'],['langkah','Langkah'],['catatan','Catatan']].map(([key, label]) => (
            <TouchableOpacity key={key} onPress={() => setTab(key)} style={{ flex: 1, paddingVertical: 10, borderBottomWidth: 3, borderBottomColor: tab === key ? COLORS.orange : 'transparent', alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 13, color: tab === key ? COLORS.orange : COLORS.textLight }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">

        {/* TAB BAHAN */}
        {tab === 'bahan' && (
          <>
            {flour > 0 && (
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                <View style={{ flex: 1, backgroundColor: COLORS.brownDark, borderRadius: 14, padding: 12, alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 9, color: COLORS.orangeLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Total</Text>
                  <Text style={{ fontFamily: FONTS.playfair900, fontSize: 20, color: COLORS.orangeLight }}>{Math.round(totalGram * scale)}g</Text>
                  {scale !== 1 && <Text style={{ fontFamily: FONTS.dmSans, fontSize: 9, color: COLORS.tanDark, marginTop: 2 }}>base: {Math.round(totalGram)}g</Text>}
                </View>
                <View style={{ flex: 1, backgroundColor: COLORS.orange, borderRadius: 14, padding: 12, alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 9, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Hidrasi</Text>
                  <Text style={{ fontFamily: FONTS.playfair900, fontSize: 20, color: COLORS.white }}>{hydration}%</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: COLORS.cream, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, padding: 12, alignItems: 'center' }}>
                  <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 9, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Bahan</Text>
                  <Text style={{ fontFamily: FONTS.playfair900, fontSize: 20, color: COLORS.brownDark }}>{ingredients.length}</Text>
                </View>
              </View>
            )}

            {/* Scale */}
            <View style={s.scaleRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                <Calculator size={14} color={COLORS.brownMid} />
                <View>
                  <Text style={s.scaleLabel}>Scale Resep</Text>
                  {scale !== 1 && <Text style={{ fontFamily: FONTS.dmSansSemiBold, fontSize: 10, color: COLORS.orange }}>Takaran berubah jadi {scale}×</Text>}
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity style={s.scaleCircle} onPress={() => setScale(sc => Math.max(0.25, Math.round((sc-0.25)*4)/4))}><Text style={s.scaleCircleTxt}>−</Text></TouchableOpacity>
                <Text style={s.scaleVal}>{scale}×</Text>
                <TouchableOpacity style={s.scaleCircle} onPress={() => setScale(sc => Math.round((sc+0.25)*4)/4)}><Text style={s.scaleCircleTxt}>+</Text></TouchableOpacity>
              </View>
            </View>

            {ingredients.map(ing => {
              const pct = getPct(ing);
              const baseVal = parseFloat(ing.val) || 0;
              const displayVal = scale === 1 ? ing.val : String(Math.round(baseVal * scale * 10) / 10 || '');
              return (
                <View key={ing.id} style={s.ingRow}>
                  <TextInput style={s.ingName} placeholder={ing.isFlour ? 'Tepung (basis)' : 'Nama bahan'} placeholderTextColor={COLORS.tanDark}
                    value={ing.name} editable={!ing.isFlour}
                    onChangeText={v => setIngredients(p => p.map(i => i.id === ing.id ? {...i, name: v} : i))} />
                  <View style={s.ingDivider} />
                  <TextInput style={[s.ingVal, scale !== 1 && { color: COLORS.orange }]} keyboardType="numeric" placeholder="0"
                    placeholderTextColor={COLORS.tanDark} value={displayVal} editable={scale === 1}
                    onChangeText={v => { if (scale === 1) setIngredients(p => p.map(i => i.id === ing.id ? {...i, val: v} : i)); }} />
                  <Text style={s.ingUnit}>g</Text>
                  <Text style={s.ingPct}>{pct}%</Text>
                  {!ing.isFlour && <TouchableOpacity onPress={() => setIngredients(p => p.filter(i => i.id !== ing.id))}><X size={15} color={COLORS.tanDark} /></TouchableOpacity>}
                </View>
              );
            })}
            <TouchableOpacity style={s.addBtn} onPress={() => setIngredients(p => [...p, { id: Date.now(), name: '', val: '', isFlour: false }])}>
              <Plus size={14} color={COLORS.textLight} /><Text style={s.addBtnTxt}>Tambah Bahan</Text>
            </TouchableOpacity>

            {flour > 0 && (
              <TouchableOpacity style={[s.primaryBtn, { backgroundColor: COLORS.brownDark }]} onPress={() => {
                const liq = ingredients.filter(i => !i.isFlour && parseFloat(i.val) > 0 && i.name.trim() && !isDry(i.name)).map(i => ({ name: i.name, gram: i.val }));
                onSendToHydration({ flourGram: String(flour), liquids: liq });
              }}>
                <Droplets size={16} color={COLORS.white} />
                <Text style={s.primaryBtnTxt}>Hitung Hidrasi dari Resep Ini</Text>
              </TouchableOpacity>
            )}

            {/* Prediksi Keberhasilan */}
            {flour > 0 && (
              <View style={{ marginTop: 16 }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: showPrediksi ? COLORS.brownDark : COLORS.white, borderWidth: 2, borderColor: COLORS.brownDark, borderRadius: showPrediksi ? 16 : 16, borderBottomLeftRadius: showPrediksi ? 0 : 16, borderBottomRightRadius: showPrediksi ? 0 : 16, padding: 14, paddingHorizontal: 18 }}
                  onPress={() => { setShowPrediksi(!showPrediksi); setPredResult(null); }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 34, height: 34, backgroundColor: showPrediksi ? 'rgba(255,255,255,0.15)' : COLORS.brownDark, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                      <Trophy size={16} color={showPrediksi ? COLORS.orangeLight : COLORS.white} />
                    </View>
                    <View>
                      <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 14, color: showPrediksi ? COLORS.white : COLORS.brownDark }}>Prediksi Keberhasilan</Text>
                      <Text style={{ fontFamily: FONTS.dmSans, fontSize: 11, color: showPrediksi ? COLORS.tanDark : COLORS.textLight }}>Analisis komposisi + kondisi baking</Text>
                    </View>
                  </View>
                  <ChevronDown size={18} color={showPrediksi ? COLORS.white : COLORS.brownDark} style={{ transform: [{ rotate: showPrediksi ? '180deg' : '0deg' }] }} />
                </TouchableOpacity>

                {showPrediksi && (
                  <View style={{ backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.brownDark, borderTopWidth: 0, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: 16 }}>
                    {/* Target */}
                    <Text style={[s.label, { marginBottom: 8 }]}>Target Jenis Roti</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                      {Object.keys(BREAD_STANDARDS).map(b => (
                        <TouchableOpacity key={b} onPress={() => { setPredTarget(b); setPredResult(null); }}
                          style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 2, borderColor: predTarget === b ? COLORS.orange : COLORS.tan, backgroundColor: predTarget === b ? '#FFF0E6' : COLORS.white }}>
                          <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 12, color: predTarget === b ? COLORS.orange : COLORS.textMid }}>{b}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Inputs */}
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.label}>Suhu Ruang (°C)</Text>
                        <TextInput style={s.input} keyboardType="numeric" placeholder="26" placeholderTextColor={COLORS.tanDark} value={predSuhuRuang} onChangeText={v => { setPredSuhuRuang(v); setPredResult(null); }} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.label}>Bulk (jam)</Text>
                        <TextInput style={s.input} keyboardType="numeric" placeholder="4" placeholderTextColor={COLORS.tanDark} value={predWaktuBulk} onChangeText={v => { setPredWaktuBulk(v); setPredResult(null); }} />
                      </View>
                    </View>
                    <View style={{ marginBottom: 14 }}>
                      <Text style={s.label}>Suhu Oven (°C)</Text>
                      <TextInput style={s.input} keyboardType="numeric" placeholder="230" placeholderTextColor={COLORS.tanDark} value={predSuhuOven} onChangeText={v => { setPredSuhuOven(v); setPredResult(null); }} />
                    </View>

                    {/* Oven Type */}
                    <Text style={[s.label, { marginBottom: 8 }]}>Jenis Oven</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                      {OVEN_TYPES.map(({ val, label, sub, Icon }) => (
                        <TouchableOpacity key={val} onPress={() => setPredJenisOven(predJenisOven === val ? '' : val)}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, borderWidth: 2, borderColor: predJenisOven === val ? COLORS.orange : COLORS.tan, backgroundColor: predJenisOven === val ? '#FFF0E6' : COLORS.white, width: '47%' }}>
                          <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: predJenisOven === val ? COLORS.orange : COLORS.tan, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={15} color={predJenisOven === val ? COLORS.white : COLORS.brownMid} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 12, color: predJenisOven === val ? COLORS.orange : COLORS.brownDark }}>{label}</Text>
                            <Text style={{ fontFamily: FONTS.dmSans, fontSize: 10, color: COLORS.textLight }}>{sub}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity style={[s.primaryBtn, { opacity: (!predTarget || !predSuhuRuang || !predWaktuBulk || !predSuhuOven) ? 0.5 : 1, marginBottom: predResult ? 16 : 0 }]}
                      onPress={hitungPrediksi} disabled={!predTarget || !predSuhuRuang || !predWaktuBulk || !predSuhuOven}>
                      <Trophy size={15} color={COLORS.white} />
                      <Text style={s.primaryBtnTxt}>Prediksi Sekarang</Text>
                    </TouchableOpacity>

                    {predResult && (
                      <>
                        <View style={[s.resultCard, { alignItems: 'center', marginBottom: 12 }]}>
                          <Text style={s.resultLabel}>Prediksi Keberhasilan</Text>
                          <Text style={[s.resultVal, { fontSize: 56, color: predResult.total >= 80 ? COLORS.green : predResult.total >= 55 ? COLORS.amber : COLORS.red }]}>{predResult.total}%</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                            {predResult.total >= 80 ? <Trophy size={16} color={COLORS.white} /> : predResult.total >= 55 ? <ThumbsUp size={16} color={COLORS.white} /> : <AlertTriangle size={16} color={COLORS.white} />}
                            <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 15, color: COLORS.white }}>
                              {predResult.total >= 80 ? 'Sangat Menjanjikan!' : predResult.total >= 55 ? 'Kemungkinan Berhasil' : 'Perlu Diperbaiki'}
                            </Text>
                          </View>
                          <Text style={{ fontFamily: FONTS.dmSans, fontSize: 11, color: COLORS.tanDark, marginTop: 4 }}>vs standar {predTarget}</Text>
                        </View>
                        <View style={{ backgroundColor: COLORS.cream, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 14, overflow: 'hidden' }}>
                          {predResult.scored.map((f, i) => {
                            const color = f.score >= 80 ? COLORS.green : f.score >= 55 ? COLORS.amber : COLORS.red;
                            const hint = f.score >= 80 ? 'Ideal' : f.val < f.range[0] ? `Kurang (min ${f.range[0]}${f.unit})` : `Berlebih (max ${f.range[1]}${f.unit})`;
                            return (
                              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, paddingHorizontal: 14, borderBottomWidth: i < predResult.scored.length - 1 ? 1 : 0, borderBottomColor: COLORS.tan }}>
                                <View style={{ width: 20, alignItems: 'center' }}><FactorIcon iconKey={f.iconKey} /></View>
                                <View style={{ flex: 1 }}>
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 12, color: COLORS.brownDark }}>{f.label}</Text>
                                    <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 12, color }}>{f.val}{f.unit}</Text>
                                  </View>
                                  <View style={{ backgroundColor: COLORS.tan, borderRadius: 4, height: 6, overflow: 'hidden' }}>
                                    <View style={{ width: `${f.score}%`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
                                  </View>
                                  <Text style={{ fontFamily: FONTS.dmSans, fontSize: 10, color: COLORS.textLight, marginTop: 3 }}>{hint} · ideal {f.range[0]}–{f.range[1]}{f.unit}</Text>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                        <Text style={{ fontFamily: FONTS.dmSans, fontSize: 11, color: COLORS.textLight, textAlign: 'center', marginTop: 10, lineHeight: 17 }}>
                          * Prediksi berdasarkan standar umum baking.
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {/* TAB LANGKAH */}
        {tab === 'langkah' && (
          <>
            <View style={s.infoBox}>
              <View style={s.infoTitle}><Lightbulb size={12} color={COLORS.brownDark} /><Text style={s.infoTitleTxt}>Tips</Text></View>
              <Text style={s.infoText}>Tulis langkah-langkah membuat rotimu. Bisa sangat detail atau ringkas.</Text>
            </View>
            {steps.map((step, i) => (
              <View key={step.id} style={{ flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                <View style={{ width: 28, height: 28, backgroundColor: COLORS.orange, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                  <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 12, color: COLORS.white }}>{i + 1}</Text>
                </View>
                <TextInput style={[s.input, { flex: 1, marginBottom: 0, minHeight: 60, textAlignVertical: 'top' }]}
                  placeholder={`Langkah ${i + 1}...`} placeholderTextColor={COLORS.tanDark} multiline
                  value={step.text} onChangeText={v => setSteps(p => p.map(sv => sv.id === step.id ? {...sv, text: v} : sv))} />
                {steps.length > 1 && (
                  <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setSteps(p => p.filter(sv => sv.id !== step.id))}><X size={15} color={COLORS.tanDark} /></TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={s.addBtn} onPress={() => setSteps(p => [...p, { id: Date.now(), text: '' }])}>
              <Plus size={14} color={COLORS.textLight} /><Text style={s.addBtnTxt}>Tambah Langkah</Text>
            </TouchableOpacity>
          </>
        )}

        {/* TAB CATATAN */}
        {tab === 'catatan' && (
          <>
            <View style={{ marginBottom: 14 }}>
              <Text style={s.label}>Kategori</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {CATEGORIES.map(c => (
                  <TouchableOpacity key={c} onPress={() => setCategory(category === c ? '' : c)}
                    style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 2, borderColor: category === c ? COLORS.orange : COLORS.tan, backgroundColor: category === c ? '#FFF0E6' : COLORS.white }}>
                    <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 12, color: category === c ? COLORS.orange : COLORS.textMid }}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={s.label}>Catatan Pribadi</Text>
              <TextInput style={[s.input, { minHeight: 180, textAlignVertical: 'top', lineHeight: 24 }]}
                placeholder="Tulis catatan, tips, atau kenangan..." placeholderTextColor={COLORS.tanDark}
                multiline value={notes} onChangeText={setNotes} />
            </View>
            {!isNew && (
              <TouchableOpacity onPress={() => onDelete(initialData.id)}
                style={{ borderWidth: 2, borderColor: COLORS.red, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
                <Trash2 size={16} color={COLORS.red} />
                <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.red }}>Hapus Resep Ini</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

export default function MyBreadScreen({ lang, onBack, onSendToHydration }) {
  const [myRecipes, setMyRecipes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('myBreadRecipes').then(data => {
      if (data) setMyRecipes(JSON.parse(data));
    }).catch(() => {});
  }, []);

  const saveRecipes = async (recipes) => {
    setMyRecipes(recipes);
    try { await AsyncStorage.setItem('myBreadRecipes', JSON.stringify(recipes)); } catch {}
  };

  const deleteRecipe = (id) => { saveRecipes(myRecipes.filter(r => r.id !== id)); setConfirmDelete(null); };

  if (editing !== null) {
    return <RecipeEditor
      lang={lang}
      initialData={editing === 'new' ? null : myRecipes.find(r => r.id === editing)}
      onSave={(recipe) => {
        const updated = editing === 'new' ? [...myRecipes, recipe] : myRecipes.map(r => r.id === recipe.id ? recipe : r);
        saveRecipes(updated); setEditing(null);
      }}
      onDelete={(id) => { setConfirmDelete(id); setEditing(null); }}
      onBack={() => setEditing(null)}
      onSendToHydration={onSendToHydration}
    />;
  }

  return (
    <View style={s.screen}>
      <View style={[s.header, { justifyContent: 'space-between' }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}><ChevronLeft size={20} color={COLORS.white} /></TouchableOpacity>
        <Text style={s.title}>Buat Roti Anda</Text>
        {myRecipes.length > 0 && (
          <TouchableOpacity style={s.saveBtn} onPress={() => setEditing('new')}>
            <Plus size={14} color={COLORS.white} />
            <Text style={s.saveBtnTxt}>Baru</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Confirm Delete Modal */}
      <Modal visible={!!confirmDelete} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Trash2 size={18} color={COLORS.red} />
              <Text style={s.modalTitle}>Hapus Resep?</Text>
            </View>
            <Text style={s.modalDesc}>Resep <Text style={{ fontWeight: '700' }}>"{myRecipes.find(r => r.id === confirmDelete)?.name || 'ini'}"</Text> akan dihapus permanen.</Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalBtnCancel} onPress={() => setConfirmDelete(null)}><Text style={s.modalBtnCancelTxt}>Batal</Text></TouchableOpacity>
              <TouchableOpacity style={[s.modalBtnOk, { backgroundColor: COLORS.red }]} onPress={() => deleteRecipe(confirmDelete)}><Text style={s.modalBtnOkTxt}>Hapus</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {myRecipes.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 48 }}>
            <Wheat size={64} color={COLORS.tanDark} />
            <Text style={{ fontFamily: FONTS.playfair900, fontSize: 22, color: COLORS.brownDark, marginTop: 16, marginBottom: 8 }}>Resep Kamu Kosong</Text>
            <Text style={{ fontFamily: FONTS.dmSans, fontSize: 14, color: COLORS.textLight, lineHeight: 22, textAlign: 'center', maxWidth: 260, marginBottom: 32 }}>Mulai buat resep rotimu sendiri dengan panduan Baker's %</Text>
            <TouchableOpacity style={[s.primaryBtn, { paddingHorizontal: 32 }]} onPress={() => setEditing('new')}>
              <Plus size={18} color={COLORS.white} />
              <Text style={s.primaryBtnTxt}>Buat Resep Pertamamu</Text>
            </TouchableOpacity>
          </View>
        ) : myRecipes.map(r => (
          <TouchableOpacity key={r.id} style={s.recipeCard} onPress={() => setEditing(r.id)} activeOpacity={0.8}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 52, height: 52, backgroundColor: COLORS.brownDark, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 26 }}>{r.emoji || '🍞'}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: FONTS.playfair900, fontSize: 16, color: COLORS.brownDark, marginBottom: 2 }}>{r.name || 'Tanpa Nama'}</Text>
                <Text style={{ fontFamily: FONTS.dmSans, fontSize: 11, color: COLORS.textLight, marginBottom: 6 }}>
                  {r.ingredients?.length || 0} bahan · {r.steps?.length || 0} langkah · {r.date}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {r.hydration > 0 && (
                    <View style={[s.tag, { flexDirection: 'row', alignItems: 'center', gap: 3 }]}>
                      <Droplets size={9} color={COLORS.textMid} />
                      <Text style={s.tagTxt}>{r.hydration}%</Text>
                    </View>
                  )}
                  {r.category && <View style={s.tag}><Text style={s.tagTxt}>{r.category}</Text></View>}
                </View>
              </View>
              <View style={{ alignItems: 'center', gap: 6 }}>
                <ChevronRight size={16} color={COLORS.textLight} />
                <TouchableOpacity onPress={e => { setConfirmDelete(r.id); }}>
                  <X size={14} color={COLORS.tanDark} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1.5, borderBottomColor: COLORS.tan },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.brownDark, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: FONTS.playfair900, fontSize: 22, color: COLORS.brownDark, flex: 1 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.orange, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14 },
  saveBtnTxt: { fontFamily: FONTS.dmSansBold, fontSize: 13, color: COLORS.white },
  body: { padding: 24 },
  label: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.textLight, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontFamily: FONTS.dmSans, fontSize: 15, color: COLORS.textDark },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.brownDark, borderRadius: 16, padding: 16, marginTop: 8 },
  primaryBtnTxt: { fontFamily: FONTS.dmSansBold, fontSize: 15, color: COLORS.white },
  resultCard: { backgroundColor: COLORS.brownDark, borderRadius: 22, padding: 24 },
  resultLabel: { fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.orangeLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  resultVal: { fontFamily: FONTS.playfair900, fontSize: 52, color: COLORS.orangeLight, lineHeight: 56 },
  scaleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.cream, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 16, padding: 14, marginBottom: 16 },
  scaleLabel: { fontFamily: FONTS.dmSansSemiBold, fontSize: 13, color: COLORS.brownMid },
  scaleCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.brownDark, alignItems: 'center', justifyContent: 'center' },
  scaleCircleTxt: { fontFamily: FONTS.dmSansBold, fontSize: 18, color: COLORS.white, lineHeight: 22 },
  scaleVal: { fontFamily: FONTS.playfair700, fontSize: 20, color: COLORS.brownDark, minWidth: 36, textAlign: 'center' },
  ingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 16, padding: 10, paddingHorizontal: 14 },
  ingName: { flex: 1.2, fontFamily: FONTS.dmSansMedium, fontSize: 14, color: COLORS.textDark, minWidth: 0 },
  ingDivider: { width: 1, height: 20, backgroundColor: COLORS.tan },
  ingVal: { flex: 1, fontFamily: FONTS.dmSansSemiBold, fontSize: 14, color: COLORS.brownMid, textAlign: 'right', minWidth: 0 },
  ingUnit: { fontFamily: FONTS.dmSans, fontSize: 11, color: COLORS.textLight, width: 24 },
  ingPct: { fontFamily: FONTS.dmSansBold, fontSize: 12, color: COLORS.orange, width: 48, textAlign: 'right' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.tanDark, borderRadius: 16, padding: 13, marginBottom: 16 },
  addBtnTxt: { fontFamily: FONTS.dmSansBold, fontSize: 13, color: COLORS.textLight },
  infoBox: { backgroundColor: COLORS.cream, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 16, padding: 14, marginBottom: 16 },
  infoTitle: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  infoTitleTxt: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.brownDark, textTransform: 'uppercase', letterSpacing: 1 },
  infoText: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMid, lineHeight: 20 },
  recipeCard: { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 18, padding: 16, marginBottom: 12 },
  tag: { backgroundColor: COLORS.cream, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 20, paddingVertical: 2, paddingHorizontal: 8 },
  tagTxt: { fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.textMid },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, width: '100%', maxWidth: 340 },
  modalTitle: { fontFamily: FONTS.playfair700, fontSize: 18, color: COLORS.brownDark },
  modalDesc: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMid, lineHeight: 21, marginBottom: 20, marginTop: 8 },
  modalBtns: { flexDirection: 'row', gap: 10 },
  modalBtnCancel: { flex: 1, backgroundColor: COLORS.tan, borderRadius: 12, padding: 13, alignItems: 'center' },
  modalBtnCancelTxt: { fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.brownDark },
  modalBtnOk: { flex: 1, backgroundColor: COLORS.orange, borderRadius: 12, padding: 13, alignItems: 'center' },
  modalBtnOkTxt: { fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.white },
});

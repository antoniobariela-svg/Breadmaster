import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ChevronLeft, Timer, Droplets, Lightbulb, Calculator, Trophy, ThumbsUp, AlertTriangle, Wrench, Construction } from 'lucide-react-native';
import { COLORS, FONTS } from '../constants/theme';
import { TEXT } from '../data/index';
import { RECIPES, RECIPE_DETAILS } from '../data/recipes';

function ScoreBar({ score, label, desc }) {
  const color = score >= 80 ? COLORS.green : score >= 55 ? COLORS.amber : COLORS.red;
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ fontFamily: FONTS.dmSansSemiBold, fontSize: 13, color: COLORS.brownDark, flex: 1, marginRight: 8 }}>{label}</Text>
        <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 13, color }}>{score}%</Text>
      </View>
      <View style={{ backgroundColor: COLORS.tan, borderRadius: 6, height: 8, overflow: 'hidden' }}>
        <View style={{ width: `${score}%`, height: '100%', backgroundColor: color, borderRadius: 6 }} />
      </View>
      <Text style={{ fontFamily: FONTS.dmSans, fontSize: 11, color: COLORS.textLight, marginTop: 3 }}>{desc}</Text>
    </View>
  );
}

function RecipeDetail({ recipe, onBack, lang }) {
  const [mode, setMode] = useState('singkat');
  const [userInputs, setUserInputs] = useState({});
  const [flourGram, setFlourGram] = useState('');
  const [scored, setScored] = useState(null);
  const detail = RECIPE_DETAILS[recipe.name];

  const calcScore = () => {
    const flour = parseFloat(flourGram) || 0;
    if (!flour) return;
    const scores = recipe.scoring.map(s => {
      if (s.key === 'flour') return { ...s, score: 100 };
      const pct = ((parseFloat(userInputs[s.key]) || 0) / flour) * 100;
      const score = Math.max(0, Math.min(100, Math.round(100 - (Math.abs(pct - s.idealPct) / (s.tolerance * 3)) * 100)));
      return { ...s, score, userPct: Math.round(pct * 10) / 10 };
    });
    const total = Math.round(scores.reduce((s, i) => s + i.score * i.weight, 0) / scores.reduce((s, i) => s + i.weight, 0));
    setScored({ scores, total });
  };

  const totalColor = scored ? (scored.total >= 80 ? COLORS.green : scored.total >= 55 ? COLORS.amber : COLORS.red) : COLORS.orange;
  const totalLabel = scored ? (scored.total >= 80 ? 'Sangat Baik!' : scored.total >= 55 ? 'Cukup Baik' : 'Perlu Diperbaiki') : '';
  const TotalIcon = scored ? (scored.total >= 80 ? Trophy : scored.total >= 55 ? ThumbsUp : AlertTriangle) : null;

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}><ChevronLeft size={20} color={COLORS.white} /></TouchableOpacity>
        <Text style={s.title}>{recipe.name}</Text>
      </View>

      {/* Mode toggle */}
      <View style={{ flexDirection: 'row', gap: 8, padding: 12, paddingHorizontal: 24, borderBottomWidth: 1.5, borderBottomColor: COLORS.tan }}>
        <TouchableOpacity style={[s.modeBtn, mode === 'singkat' && s.modeBtnActive]} onPress={() => setMode('singkat')}>
          <Text style={[s.modeBtnTxt, mode === 'singkat' && s.modeBtnActiveTxt]}>Singkat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.modeBtn, mode === 'lengkap' && { backgroundColor: COLORS.orange }]} onPress={() => setMode('lengkap')}>
          <Text style={[s.modeBtnTxt, mode === 'lengkap' && s.modeBtnActiveTxt]}>
            Detail Lengkap{!detail ? ' (segera)' : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Tags */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          <View style={s.tag}><Text style={s.tagTxt}>{recipe.time}</Text></View>
          <View style={[s.tag, { flexDirection: 'row', alignItems: 'center', gap: 3 }]}>
            <Droplets size={9} color={COLORS.textMid} /><Text style={s.tagTxt}>{recipe.hydration}%</Text>
          </View>
          <View style={[s.tag, { backgroundColor: recipe.diffColor, borderWidth: 0 }]}>
            <Text style={[s.tagTxt, { color: COLORS.white }]}>{recipe.difficulty}</Text>
          </View>
        </View>
        <Text style={{ fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMid, lineHeight: 21, marginBottom: 16 }}>{recipe.desc}</Text>

        {/* Komposisi */}
        <Text style={s.sectionTitle}>Komposisi</Text>
        <View style={{ backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', backgroundColor: COLORS.brownDark, padding: 10, paddingHorizontal: 14, gap: 8 }}>
            {['Bahan', "Baker's %", 'Ref'].map((h, i) => (
              <Text key={i} style={{ flex: i === 0 ? 1.5 : 1, fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.tanDark, textTransform: 'uppercase', textAlign: i > 0 ? 'right' : 'left' }}>{h}</Text>
            ))}
          </View>
          {recipe.ingredients.map((ing, i) => (
            <View key={i} style={{ flexDirection: 'row', padding: 11, paddingHorizontal: 14, gap: 8, borderBottomWidth: i < recipe.ingredients.length - 1 ? 1 : 0, borderBottomColor: COLORS.tan, backgroundColor: i === 0 ? '#FFF5EE' : COLORS.white }}>
              <Text style={{ flex: 1.5, fontFamily: FONTS.dmSansSemiBold, fontSize: 13, color: COLORS.brownDark }}>{ing.name}</Text>
              <Text style={{ flex: 1, fontFamily: FONTS.dmSansBold, fontSize: 13, color: COLORS.orange, textAlign: 'right' }}>{ing.pct}%</Text>
              <Text style={{ flex: 1, fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMid, textAlign: 'right' }}>{ing.ref}{ing.unit}</Text>
            </View>
          ))}
        </View>

        {/* Mode Singkat */}
        {mode === 'singkat' && (
          <>
            <Text style={s.sectionTitle}>Cara Membuat</Text>
            {recipe.steps.map((step, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, marginBottom: 8, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, padding: 12 }}>
                <View style={{ width: 24, height: 24, backgroundColor: COLORS.orange, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.white }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textDark, lineHeight: 20 }}>{step}</Text>
              </View>
            ))}
          </>
        )}

        {/* Mode Lengkap */}
        {mode === 'lengkap' && detail && (
          <>
            <Text style={s.sectionTitle}>Panduan Langkah Demi Langkah</Text>
            {detail.stepsDetail.map((step, i) => (
              <View key={i} style={{ backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 18, overflow: 'hidden', marginBottom: 12 }}>
                <View style={{ backgroundColor: COLORS.brownDark, padding: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 28, height: 28, backgroundColor: COLORS.orange, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 12, color: COLORS.white }}>{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONTS.playfair700, fontSize: 14, color: COLORS.cream }}>{step.title}</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                      {step.duration && <Text style={{ fontFamily: FONTS.dmSans, fontSize: 10, color: COLORS.tanDark }}>⏱ {step.duration}</Text>}
                      {step.temp && <Text style={{ fontFamily: FONTS.dmSans, fontSize: 10, color: COLORS.tanDark }}>🌡️ {step.temp}</Text>}
                    </View>
                  </View>
                </View>
                <View style={{ padding: 14, paddingHorizontal: 16, borderBottomWidth: 1.5, borderBottomColor: COLORS.tan }}>
                  <Text style={{ fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textDark, lineHeight: 22 }}>{step.detail}</Text>
                </View>
                <View style={{ padding: 12, paddingHorizontal: 16, backgroundColor: '#FFF8F2' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 5 }}>
                    <Lightbulb size={11} color={COLORS.orange} />
                    <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.orange, textTransform: 'uppercase', letterSpacing: 1 }}>Tips</Text>
                  </View>
                  <Text style={{ fontFamily: FONTS.dmSans, fontSize: 12, color: COLORS.textMid, lineHeight: 20 }}>{step.tips}</Text>
                </View>
              </View>
            ))}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 12 }}>
              <Wrench size={16} color={COLORS.orange} />
              <Text style={s.sectionTitle}>Troubleshooting</Text>
            </View>
            {detail.troubleshooting.map((item, i) => (
              <View key={i} style={{ backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
                <View style={{ backgroundColor: '#FFF0E6', padding: 11, paddingHorizontal: 16, borderBottomWidth: 1.5, borderBottomColor: COLORS.tan }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={13} color={COLORS.orange} />
                    <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 13, color: COLORS.orange, flex: 1 }}>{item.problem}</Text>
                  </View>
                  <Text style={{ fontFamily: FONTS.dmSans, fontSize: 11, color: COLORS.textLight, marginTop: 3 }}>Penyebab: {item.cause}</Text>
                </View>
                <View style={{ padding: 11, paddingHorizontal: 16 }}>
                  <Text style={{ fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textDark, lineHeight: 20 }}>{item.solution}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {mode === 'lengkap' && !detail && (
          <View style={{ backgroundColor: COLORS.cream, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 16, padding: 24, alignItems: 'center' }}>
            <Construction size={32} color={COLORS.tanDark} />
            <Text style={{ fontFamily: FONTS.playfair700, fontSize: 16, color: COLORS.brownDark, marginTop: 10, marginBottom: 6 }}>Segera Hadir</Text>
            <Text style={{ fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMid, textAlign: 'center' }}>Mode lengkap untuk resep ini sedang disiapkan.</Text>
          </View>
        )}

        {/* Cek Akurasi */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 10 }}>
          <Trophy size={16} color={COLORS.orange} />
          <Text style={s.sectionTitle}>Cek Akurasi Resepmu</Text>
        </View>
        <View style={s.infoBox}>
          <View style={s.infoTitle}><Lightbulb size={12} color={COLORS.brownDark} /><Text style={s.infoTitleTxt}>Cara Pakai</Text></View>
          <Text style={s.infoText}>Masukkan komposisi bahan yang kamu gunakan, lihat seberapa akurat resepmu.</Text>
        </View>
        <View style={{ marginBottom: 18 }}>
          <Text style={s.label}>Tepung kamu (gram)</Text>
          <TextInput style={s.input} keyboardType="numeric" placeholder={`contoh: ${recipe.ingredients[0].ref}`} placeholderTextColor={COLORS.tanDark} value={flourGram} onChangeText={v => { setFlourGram(v); setScored(null); }} />
        </View>
        {recipe.scoring.filter(sv => sv.key !== 'flour').map(sv => (
          <View key={sv.key} style={{ marginBottom: 18 }}>
            <Text style={s.label}>{sv.name} (gram)</Text>
            <Text style={{ fontFamily: FONTS.dmSans, fontSize: 10, color: COLORS.textLight, marginBottom: 6 }}>{sv.desc}</Text>
            <TextInput style={s.input} keyboardType="numeric"
              placeholder={`ideal: ${Math.round(parseFloat(flourGram || recipe.ingredients[0].ref) * sv.idealPct / 100)}g`}
              placeholderTextColor={COLORS.tanDark} value={userInputs[sv.key] || ''}
              onChangeText={v => { setUserInputs(p => ({ ...p, [sv.key]: v })); setScored(null); }} />
          </View>
        ))}
        <TouchableOpacity style={s.primaryBtn} onPress={calcScore}>
          <Calculator size={16} color={COLORS.white} />
          <Text style={s.primaryBtnTxt}>Hitung Akurasi</Text>
        </TouchableOpacity>
        {scored && (
          <View style={{ marginTop: 16 }}>
            <View style={[s.resultCard, { alignItems: 'center', marginBottom: 12 }]}>
              <Text style={s.resultLabel}>Total Skor Akurasi</Text>
              <Text style={[s.resultVal, { color: totalColor, fontSize: 56 }]}>{scored.total}%</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {TotalIcon && <TotalIcon size={16} color={COLORS.white} />}
                <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 15, color: COLORS.white }}>{totalLabel}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 16, padding: 16 }}>
              <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.brownDark, marginBottom: 14 }}>Rincian Skor per Bahan</Text>
              {scored.scores.map((sv, i) => <ScoreBar key={i} score={sv.score} label={`${sv.name}${sv.userPct !== undefined ? ` (${sv.userPct}% vs ${sv.idealPct}%)` : ''}`} desc={sv.desc} />)}
            </View>
          </View>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

export default function RecipesScreen({ lang, onBack }) {
  const t = TEXT[lang];
  const [filter, setFilter] = useState('Semua');
  const [selected, setSelected] = useState(null);
  if (selected !== null) return <RecipeDetail recipe={RECIPES[selected]} onBack={() => setSelected(null)} lang={lang} />;
  const filtered = filter === 'Semua' ? RECIPES : RECIPES.filter(r => r.difficulty === filter);

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}><ChevronLeft size={20} color={COLORS.white} /></TouchableOpacity>
        <Text style={s.title}>{t.recipesTitle}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {['Semua', 'Easy', 'Medium', 'Hard', 'Expert'].map(d => (
              <TouchableOpacity key={d} onPress={() => setFilter(d)} style={{ backgroundColor: filter === d ? COLORS.brownDark : COLORS.white, borderWidth: 2, borderColor: filter === d ? COLORS.brownDark : COLORS.tan, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 }}>
                <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 12, color: filter === d ? COLORS.white : COLORS.textMid }}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {filtered.map((r, i) => (
          <TouchableOpacity key={i} style={s.recipeItem} onPress={() => setSelected(RECIPES.indexOf(r))} activeOpacity={0.8}>
            <View style={s.recipeIconBox}><Text style={{ fontSize: 26 }}>{r.icon || '🍞'}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.recipeName}>{r.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 7 }}>
                <Timer size={10} color={COLORS.textLight} />
                <Text style={s.recipeMeta}>{r.time} · </Text>
                <Text style={{ fontFamily: FONTS.dmSansBold, fontSize: 11, color: r.diffColor }}>{r.difficulty}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {r.tags.map((tag, j) => <View key={j} style={s.tag}><Text style={s.tagTxt}>{tag}</Text></View>)}
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.recipeHyd}>{r.hydration}%</Text>
              <Text style={s.recipeHydLabel}>hidrasi</Text>
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
  title: { fontFamily: FONTS.playfair900, fontSize: 22, color: COLORS.brownDark },
  body: { padding: 24 },
  modeBtn: { flex: 1, paddingVertical: 9, borderRadius: 12, backgroundColor: COLORS.tan, alignItems: 'center' },
  modeBtnActive: { backgroundColor: COLORS.brownDark },
  modeBtnTxt: { fontFamily: FONTS.dmSansBold, fontSize: 13, color: COLORS.textMid },
  modeBtnActiveTxt: { color: COLORS.white },
  sectionTitle: { fontFamily: FONTS.playfair700, fontSize: 15, color: COLORS.brownDark, marginBottom: 10 },
  label: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.textLight, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontFamily: FONTS.dmSans, fontSize: 15, color: COLORS.textDark },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.brownDark, borderRadius: 16, padding: 16, marginTop: 8 },
  primaryBtnTxt: { fontFamily: FONTS.dmSansBold, fontSize: 15, color: COLORS.white },
  resultCard: { backgroundColor: COLORS.brownDark, borderRadius: 22, padding: 24 },
  resultLabel: { fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.orangeLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  resultVal: { fontFamily: FONTS.playfair900, fontSize: 52, color: COLORS.orangeLight, lineHeight: 56, marginBottom: 4 },
  infoBox: { backgroundColor: COLORS.cream, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 16, padding: 14, marginBottom: 16 },
  infoTitle: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  infoTitleTxt: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.brownDark, textTransform: 'uppercase', letterSpacing: 1 },
  infoText: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMid, lineHeight: 20 },
  tag: { backgroundColor: COLORS.cream, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 20, paddingVertical: 2, paddingHorizontal: 8 },
  tagTxt: { fontFamily: FONTS.dmSansBold, fontSize: 10, color: COLORS.textMid },
  recipeItem: { backgroundColor: COLORS.white, borderRadius: 18, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 2, borderColor: COLORS.tan },
  recipeIconBox: { width: 54, height: 54, backgroundColor: COLORS.cream, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.tan },
  recipeName: { fontFamily: FONTS.playfair900, fontSize: 16, color: COLORS.brownDark, marginBottom: 3 },
  recipeMeta: { fontFamily: FONTS.dmSans, fontSize: 11, color: COLORS.textLight },
  recipeHyd: { fontFamily: FONTS.playfair900, fontSize: 20, color: COLORS.orange },
  recipeHydLabel: { fontFamily: FONTS.dmSansBold, fontSize: 9, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 0.5 },
});

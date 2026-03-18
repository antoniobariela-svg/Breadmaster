import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants/theme';
import { RECIPES } from '../data/recipes';

const DIFFICULTIES = ['Semua', 'Easy', 'Medium', 'Hard', 'Expert'];

function ScoreBar({ score, label, desc }) {
  const color = score >= 80 ? COLORS.successGreen : score >= 55 ? COLORS.warningOrange : COLORS.errorRed;
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.brownDark, flex: 1 }}>{label}</Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color }}>{score}%</Text>
      </View>
      <View style={{ backgroundColor: COLORS.tan, borderRadius: 6, height: 8, overflow: 'hidden' }}>
        <View style={{ width: `${score}%`, height: '100%', backgroundColor: color, borderRadius: 6 }} />
      </View>
      <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>{desc}</Text>
    </View>
  );
}

function RecipeDetail({ recipe, onBack }) {
  const [userInputs, setUserInputs] = useState({});
  const [flourGram, setFlourGram] = useState('');
  const [scored, setScored] = useState(null);

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

  const totalColor = scored ? (scored.total >= 80 ? COLORS.successGreen : scored.total >= 55 ? COLORS.warningOrange : COLORS.errorRed) : COLORS.orange;
  const totalLabel = scored ? (scored.total >= 80 ? '🏆 Sangat Baik!' : scored.total >= 55 ? '👍 Cukup Baik' : '⚠️ Perlu Diperbaiki') : '';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{recipe.icon} {recipe.name}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <View style={styles.tag}><Text style={styles.tagText}>⏱ {recipe.time}</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>💧 {recipe.hydration}%</Text></View>
          <View style={[styles.tag, { backgroundColor: recipe.diffColor, borderColor: recipe.diffColor }]}>
            <Text style={[styles.tagText, { color: COLORS.white }]}>{recipe.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.desc}>{recipe.desc}</Text>

        <Text style={styles.sectionHeader}>📋 Komposisi Standar</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {['Bahan', "Baker's %", 'Ref'].map((h, i) => (
              <Text key={i} style={[styles.th, i > 0 && { textAlign: 'right' }]}>{h}</Text>
            ))}
          </View>
          {recipe.ingredients.map((ing, i) => (
            <View key={i} style={[styles.tableRow, i === 0 && { backgroundColor: '#FFF5EE' }, i < recipe.ingredients.length - 1 && { borderBottomWidth: 1, borderBottomColor: COLORS.tan }]}>
              <Text style={styles.td}>{ing.name}</Text>
              <Text style={[styles.td, { color: COLORS.orange, fontWeight: '700', textAlign: 'right' }]}>{ing.pct}%</Text>
              <Text style={[styles.td, { textAlign: 'right' }]}>{ing.ref}{ing.unit}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHeader}>👨‍🍳 Cara Membuat</Text>
        {recipe.steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        <Text style={styles.sectionHeader}>🎯 Cek Akurasi Resepmu</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Cara Pakai</Text>
          <Text style={styles.infoText}>Masukkan komposisi bahan yang kamu gunakan, lalu lihat seberapa akurat resepmu dibanding standar.</Text>
        </View>
        <Text style={styles.label}>Tepung kamu (gram)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder={`contoh: ${recipe.ingredients[0].ref}`}
          placeholderTextColor={COLORS.tanDark} value={flourGram} onChangeText={v => { setFlourGram(v); setScored(null); }} />
        {recipe.scoring.filter(s => s.key !== 'flour').map(s => (
          <View key={s.key}>
            <Text style={styles.label}>{s.name} (gram) — <Text style={{ fontWeight: '400', textTransform: 'none' }}>{s.desc}</Text></Text>
            <TextInput style={styles.input} keyboardType="numeric"
              placeholder={`ideal: ${Math.round(parseFloat(flourGram || recipe.ingredients[0].ref) * s.idealPct / 100)}g`}
              placeholderTextColor={COLORS.tanDark} value={userInputs[s.key] || ''}
              onChangeText={v => { setUserInputs(p => ({ ...p, [s.key]: v })); setScored(null); }} />
          </View>
        ))}
        <TouchableOpacity style={styles.primaryBtn} onPress={calcScore}>
          <Text style={styles.primaryBtnText}>🎯 Hitung Akurasi</Text>
        </TouchableOpacity>
        {scored && (
          <>
            <View style={[styles.scoreCard, { borderRadius: 20, alignItems: 'center' }]}>
              <Text style={styles.resultLabel}>Total Skor Akurasi</Text>
              <Text style={[styles.resultValue, { color: totalColor }]}>{scored.total}%</Text>
              <Text style={{ fontSize: 16, color: COLORS.white, fontWeight: '700' }}>{totalLabel}</Text>
            </View>
            <View style={[styles.table, { marginTop: 12, padding: 16 }]}>
              <Text style={{ fontWeight: '700', fontSize: 14, color: COLORS.brownDark, marginBottom: 14 }}>Rincian Skor per Bahan</Text>
              {scored.scores.map((s, i) => (
                <ScoreBar key={i} score={s.score}
                  label={`${s.name}${s.userPct !== undefined ? ` (${s.userPct}% vs ${s.idealPct}%)` : ''}`}
                  desc={s.desc} />
              ))}
            </View>
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function RecipesScreen({ lang, onBack }) {
  const [filter, setFilter] = useState('Semua');
  const [selected, setSelected] = useState(null);

  if (selected !== null) return <RecipeDetail recipe={RECIPES[selected]} onBack={() => setSelected(null)} />;

  const filtered = filter === 'Semua' ? RECIPES : RECIPES.filter(r => r.difficulty === filter);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lang === 'id' ? 'Resep Aneka Roti' : 'Bread Recipes'}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ gap: 8 }}>
          {DIFFICULTIES.map(d => (
            <TouchableOpacity key={d} onPress={() => setFilter(d)}
              style={[styles.filterBtn, filter === d && styles.filterBtnActive]}>
              <Text style={[styles.filterBtnText, filter === d && styles.filterBtnTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {filtered.map((r, i) => (
          <TouchableOpacity key={i} style={styles.recipeItem} onPress={() => setSelected(RECIPES.indexOf(r))}>
            <View style={styles.recipeIconBox}><Text style={{ fontSize: 30 }}>{r.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recipeName}>{r.name}</Text>
              <Text style={styles.recipeMeta}>⏱ {r.time} · <Text style={{ color: r.diffColor, fontWeight: '700' }}>{r.difficulty}</Text></Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {r.tags.map((tag, j) => <View key={j} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.recipeHydration}>{r.hydration}%</Text>
              <Text style={styles.recipeHydrationLabel}>hidrasi</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  filterBtn: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  filterBtnActive: { backgroundColor: COLORS.brownDark, borderColor: COLORS.brownDark },
  filterBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.textMid },
  filterBtnTextActive: { color: COLORS.white },
  recipeItem: { backgroundColor: COLORS.white, borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: COLORS.tan, ...SHADOWS.soft },
  recipeIconBox: { width: 56, height: 56, backgroundColor: COLORS.cream, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  recipeName: { fontSize: 15, fontWeight: '700', color: COLORS.brownDark, marginBottom: 2 },
  recipeMeta: { fontSize: 11, color: COLORS.textLight, marginBottom: 6 },
  recipeHydration: { fontSize: 18, fontWeight: '700', color: COLORS.orange },
  recipeHydrationLabel: { fontSize: 9, color: COLORS.textLight, fontWeight: '500' },
  tag: { backgroundColor: COLORS.cream, borderWidth: 1, borderColor: COLORS.tan, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 10, color: COLORS.textMid, fontWeight: '500' },
  infoBox: { backgroundColor: '#FFF5EE', borderWidth: 1.5, borderColor: COLORS.orangeLight, borderRadius: 14, padding: 14, marginBottom: 16 },
  infoTitle: { fontSize: 12, fontWeight: '700', color: COLORS.orange, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  infoText: { fontSize: 13, color: COLORS.textMid, lineHeight: 19 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textMid, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
  input: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 13, fontSize: 15, color: COLORS.textDark, marginBottom: 14 },
  primaryBtn: { backgroundColor: COLORS.orange, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 8 },
  primaryBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: COLORS.brownDark, marginTop: 20, marginBottom: 10 },
  desc: { fontSize: 13, color: COLORS.textMid, lineHeight: 20, marginBottom: 16 },
  table: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1.5, borderColor: COLORS.tan, marginBottom: 8 },
  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.brownDark, padding: 10, paddingHorizontal: 14 },
  th: { flex: 1, fontSize: 10, fontWeight: '700', color: COLORS.tanDark, textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', padding: 11, paddingHorizontal: 14 },
  td: { flex: 1, fontSize: 13, color: COLORS.textMid },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 10, backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 12 },
  stepNum: { width: 24, height: 24, backgroundColor: COLORS.orange, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: 11, fontWeight: '700', color: COLORS.white },
  stepText: { flex: 1, fontSize: 13, color: COLORS.textDark, lineHeight: 20 },
  scoreCard: { backgroundColor: COLORS.brownDark, borderRadius: 20, padding: 24, marginTop: 12, alignItems: 'center' },
  resultLabel: { fontSize: 10, color: COLORS.orangeLight, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  resultValue: { fontSize: 56, fontWeight: '900', color: COLORS.orangeLight, lineHeight: 60 },
});

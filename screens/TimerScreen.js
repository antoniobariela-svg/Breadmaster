import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { STAGES_DATA } from '../data/recipes';

export default function TimerScreen({ lang, onBack }) {
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [customMins, setCustomMins] = useState('');
  const [customSecs, setCustomSecs] = useState('');
  const intervalRef = useRef(null);

  const remaining = Math.max(0, seconds - elapsed);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          if (e + 1 >= seconds) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setFinished(true);
          }
          return e + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const startTimer = () => { if (remaining > 0) { setFinished(false); setRunning(true); } };
  const pauseTimer = () => { clearInterval(intervalRef.current); setRunning(false); };
  const resetTimer = () => { clearInterval(intervalRef.current); setRunning(false); setElapsed(0); setFinished(false); };
  const selectStage = (s, i) => {
    clearInterval(intervalRef.current);
    setSelected(i); setRunning(false); setFinished(false); setElapsed(0);
    setSeconds(s.name !== 'Custom' ? s.mins * 60 : 0);
  };
  const applyCustom = () => {
    const total = (parseInt(customMins) || 0) * 60 + (parseInt(customSecs) || 0);
    if (total > 0) { resetTimer(); setSeconds(total); }
  };

  const stage = selected !== null ? STAGES_DATA[selected] : null;
  const dM = String(Math.floor(remaining / 60)).padStart(2, '0');
  const dS = String(remaining % 60).padStart(2, '0');
  const progress = seconds > 0 ? Math.min(1, elapsed / seconds) : 0;

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}><Text style={s.backArrow}>‹</Text></TouchableOpacity>
        <Text style={s.headerTitle}>{lang === 'id' ? 'Timer Fermentasi' : 'Fermentation Timer'}</Text>
      </View>
      <ScrollView contentContainerStyle={s.body}>
        {/* Timer Display */}
        <View style={s.timerDisplay}>
          <Text style={s.timerTime}>{dM}:{dS}</Text>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={s.timerLabel}>
            {stage ? `${stage.emoji} ${lang === 'id' ? stage.name : stage.nameEn}` : (lang === 'id' ? 'Pilih tahap' : 'Select a stage')}
          </Text>
          {finished && (
            <View style={s.finishedBadge}>
              <Text style={s.finishedText}>🎉 {lang === 'id' ? 'Timer Selesai!' : 'Timer Done!'}</Text>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={s.btnRow}>
          {!running
            ? <TouchableOpacity style={[s.timerBtn, s.timerBtnStart, remaining === 0 && { opacity: 0.5 }]} onPress={startTimer}>
                <Text style={s.timerBtnText}>▶ {lang === 'id' ? 'Mulai' : 'Start'}</Text>
              </TouchableOpacity>
            : <TouchableOpacity style={[s.timerBtn, s.timerBtnStart]} onPress={pauseTimer}>
                <Text style={s.timerBtnText}>⏸ Pause</Text>
              </TouchableOpacity>
          }
          <TouchableOpacity style={[s.timerBtn, s.timerBtnReset]} onPress={resetTimer}>
            <Text style={[s.timerBtnText, { color: COLORS.brownDark }]}>↺ {lang === 'id' ? 'Reset' : 'Reset'}</Text>
          </TouchableOpacity>
        </View>

        {/* Stage info */}
        {stage && (
          <View style={s.infoBox}>
            <Text style={s.infoTitle}>🌡️ {lang === 'id' ? stage.temp : stage.tempEn}</Text>
            <Text style={s.infoText}>{lang === 'id' ? stage.desc : stage.descEn}</Text>
          </View>
        )}

        {/* Custom input */}
        {selected !== null && STAGES_DATA[selected].name === 'Custom' && (
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, alignItems: 'flex-end' }}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>{lang === 'id' ? 'Menit' : 'Minutes'}</Text>
              <TextInput style={s.input} keyboardType="numeric" placeholder="60" placeholderTextColor={COLORS.tanDark} value={customMins} onChangeText={setCustomMins} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>{lang === 'id' ? 'Detik' : 'Seconds'}</Text>
              <TextInput style={s.input} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.tanDark} value={customSecs} onChangeText={setCustomSecs} />
            </View>
            <TouchableOpacity style={[s.timerBtn, s.timerBtnStart, { flex: 1, marginBottom: 1 }]} onPress={applyCustom}>
              <Text style={s.timerBtnText}>Set</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stage list */}
        <Text style={s.sectionHeader}>{lang === 'id' ? 'Tahap Fermentasi' : 'Fermentation Stages'}</Text>
        {STAGES_DATA.map((st, i) => (
          <TouchableOpacity key={i} style={[s.stageCard, selected === i && s.stageCardActive]} onPress={() => selectStage(st, i)}>
            <View style={[s.stageIcon, selected === i && s.stageIconActive]}>
              <Text style={{ fontSize: 18 }}>{st.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.stageName}>{lang === 'id' ? st.name : st.nameEn}</Text>
              <Text style={s.stageTime}>
                {st.name === 'Custom' ? '✏️ Atur sendiri' : `⏱ ${st.mins >= 60 ? `${Math.floor(st.mins / 60)}j${st.mins % 60 > 0 ? ` ${st.mins % 60}m` : ''}` : `${st.mins} menit`}`}
              </Text>
            </View>
            <Text style={s.stageTemp} numberOfLines={2}>{lang === 'id' ? st.temp : st.tempEn}</Text>
          </TouchableOpacity>
        ))}
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
  timerDisplay: { backgroundColor: COLORS.brownDark, borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 16 },
  timerTime: { fontSize: 64, fontWeight: '900', color: COLORS.orangeLight, letterSpacing: -2 },
  progressBar: { width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 8, marginVertical: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.orangeLight, borderRadius: 8 },
  timerLabel: { fontSize: 12, color: COLORS.tanDark, letterSpacing: 2, textTransform: 'uppercase' },
  finishedBadge: { backgroundColor: COLORS.successGreen, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginTop: 10 },
  finishedText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  timerBtn: { flex: 1, padding: 14, borderRadius: 14, alignItems: 'center' },
  timerBtnStart: { backgroundColor: COLORS.orange },
  timerBtnReset: { backgroundColor: COLORS.tan },
  timerBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  infoBox: { backgroundColor: '#FFF5EE', borderWidth: 1.5, borderColor: COLORS.orangeLight, borderRadius: 14, padding: 14, marginBottom: 16 },
  infoTitle: { fontSize: 12, fontWeight: '700', color: COLORS.orange, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  infoText: { fontSize: 13, color: COLORS.textMid, lineHeight: 19 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textMid, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
  input: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 12, fontSize: 15, color: COLORS.textDark },
  sectionHeader: { fontSize: 16, fontFamily: FONTS.display, color: COLORS.brownDark, marginBottom: 12 },
  stageCard: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  stageCardActive: { borderColor: COLORS.orange, backgroundColor: '#FFF5EE' },
  stageIcon: { width: 36, height: 36, backgroundColor: COLORS.tan, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  stageIconActive: { backgroundColor: COLORS.orange },
  stageName: { fontWeight: '700', fontSize: 14, color: COLORS.brownDark },
  stageTime: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  stageTemp: { fontSize: 10, color: COLORS.textLight, fontWeight: '500', textAlign: 'right', maxWidth: 80 },
});

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ChevronLeft, Play, Pause, RotateCcw, Timer, Thermometer, CheckCircle } from 'lucide-react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { COLORS, FONTS } from '../constants/theme';
import { TEXT, STAGES_DATA } from '../data/index';
import { Droplets, Wind, Moon, Snowflake, Pencil } from 'lucide-react-native';

const STAGE_ICONS = { droplets: Droplets, wind: Wind, moon: Moon, thermometer: Thermometer, snowflake: Snowflake, pencil: Pencil };

export default function TimerScreen({ lang, onBack }) {
  const t = TEXT[lang];
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [customMins, setCustomMins] = useState('');
  const intervalRef = useRef(null);
  const remaining = Math.max(0, seconds - elapsed);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          if (e + 1 >= seconds) { clearInterval(intervalRef.current); setRunning(false); setFinished(true); }
          return e + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const dM = String(Math.floor(remaining / 60)).padStart(2, '0');
  const dS = String(remaining % 60).padStart(2, '0');
  const circumference = 2 * Math.PI * 54;
  const strokeDash = circumference * (1 - (seconds > 0 ? Math.min(1, elapsed / seconds) : 0));
  const stage = selected !== null ? STAGES_DATA[selected] : null;

  const startTimer = () => { if (remaining > 0) { setFinished(false); setRunning(true); } };
  const pauseTimer = () => { clearInterval(intervalRef.current); setRunning(false); };
  const resetTimer = () => { clearInterval(intervalRef.current); setRunning(false); setElapsed(0); setFinished(false); };
  const selectStage = (i) => {
    clearInterval(intervalRef.current); setSelected(i); setRunning(false); setFinished(false); setElapsed(0);
    setSeconds(STAGES_DATA[i].name !== 'Custom' ? STAGES_DATA[i].mins * 60 : 0);
  };

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}><ChevronLeft size={20} color={COLORS.white} /></TouchableOpacity>
        <Text style={s.title}>{t.timerTitle}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Timer display */}
        <View style={s.timerDisplay}>
          <Svg width={140} height={140} style={{ marginBottom: 8 }}>
            <Circle cx={70} cy={70} r={54} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={8} />
            <Circle cx={70} cy={70} r={54} fill="none" stroke={finished ? COLORS.green : COLORS.orangeLight}
              strokeWidth={8} strokeLinecap="round" strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDash} transform="rotate(-90, 70, 70)" />
            <SvgText x={70} y={68} textAnchor="middle" fill={COLORS.orangeLight} fontSize={26} fontFamily={FONTS.playfair900}>{dM}:{dS}</SvgText>
            <SvgText x={70} y={85} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={11}>
              {finished ? 'Selesai!' : running ? 'berjalan...' : 'pilih tahap'}
            </SvgText>
          </Svg>
          <Text style={s.timerLabel}>{stage ? (lang === 'id' ? stage.name : stage.nameEn) : t.selectStage}</Text>
          {finished && (
            <View style={s.finishedBadge}>
              <CheckCircle size={14} color={COLORS.white} />
              <Text style={s.finishedTxt}>Timer Selesai!</Text>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View style={s.timerBtns}>
          {!running
            ? <TouchableOpacity style={[s.timerBtn, s.timerBtnStart, { opacity: remaining === 0 ? 0.5 : 1 }]} onPress={startTimer}>
                <Play size={14} color={COLORS.white} /><Text style={s.timerBtnTxt}>{t.startTimer}</Text>
              </TouchableOpacity>
            : <TouchableOpacity style={[s.timerBtn, s.timerBtnStart]} onPress={pauseTimer}>
                <Pause size={14} color={COLORS.white} /><Text style={s.timerBtnTxt}>Pause</Text>
              </TouchableOpacity>
          }
          <TouchableOpacity style={[s.timerBtn, s.timerBtnReset]} onPress={resetTimer}>
            <RotateCcw size={14} color={COLORS.brownDark} /><Text style={[s.timerBtnTxt, { color: COLORS.brownDark }]}>{t.resetTimer}</Text>
          </TouchableOpacity>
        </View>

        {/* Stage info */}
        {stage && (
          <View style={s.infoBox}>
            <View style={s.infoTitle}><Thermometer size={12} color={COLORS.brownDark} /><Text style={s.infoTitleTxt}>{lang === 'id' ? stage.temp : stage.tempEn}</Text></View>
            <Text style={s.infoText}>{lang === 'id' ? stage.desc : stage.descEn}</Text>
          </View>
        )}

        {/* Custom input */}
        {selected !== null && STAGES_DATA[selected].name === 'Custom' && (
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, alignItems: 'flex-end' }}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Menit</Text>
              <TextInput style={s.input} keyboardType="numeric" placeholder="60" placeholderTextColor={COLORS.tanDark} value={customMins} onChangeText={setCustomMins} />
            </View>
            <TouchableOpacity style={[s.timerBtn, s.timerBtnStart, { flex: 1, marginBottom: 0 }]}
              onPress={() => { const total = (parseInt(customMins) || 0) * 60; if (total > 0) { clearInterval(intervalRef.current); setRunning(false); setElapsed(0); setFinished(false); setSeconds(total); } }}>
              <Text style={s.timerBtnTxt}>Set</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={s.sectionTitle}>{t.proofingStages}</Text>
        {STAGES_DATA.map((sv, i) => {
          const SIcon = STAGE_ICONS[sv.icon] || Droplets;
          const isActive = selected === i;
          return (
            <TouchableOpacity key={i} style={[s.stageCard, isActive && s.stageCardActive]} onPress={() => selectStage(i)} activeOpacity={0.8}>
              <View style={[s.stageIcon, isActive && s.stageIconActive]}>
                <SIcon size={16} color={isActive ? COLORS.white : COLORS.brownMid} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.stageName}>{lang === 'id' ? sv.name : sv.nameEn}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Timer size={10} color={COLORS.textLight} />
                  <Text style={s.stageTime}>
                    {sv.name === 'Custom' ? 'Atur sendiri' : sv.mins >= 60 ? `${Math.floor(sv.mins / 60)}j ${sv.mins % 60 > 0 ? sv.mins % 60 + 'm' : ''}` : `${sv.mins} menit`}
                  </Text>
                </View>
              </View>
              <Text style={s.stageTemp} numberOfLines={2}>{lang === 'id' ? sv.temp : sv.tempEn}</Text>
            </TouchableOpacity>
          );
        })}
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
  timerDisplay: { backgroundColor: COLORS.brownDark, borderRadius: 28, padding: 28, alignItems: 'center', marginBottom: 20 },
  timerLabel: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.tanDark, letterSpacing: 2, textTransform: 'uppercase', marginTop: 10 },
  finishedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.green, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 16, marginTop: 8 },
  finishedTxt: { fontFamily: FONTS.dmSansBold, fontSize: 13, color: COLORS.white },
  timerBtns: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  timerBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 15, borderRadius: 16 },
  timerBtnStart: { backgroundColor: COLORS.orange },
  timerBtnReset: { backgroundColor: COLORS.tan },
  timerBtnTxt: { fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.white },
  infoBox: { backgroundColor: COLORS.cream, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 16, padding: 14, marginBottom: 16 },
  infoTitle: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  infoTitleTxt: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.brownDark, textTransform: 'uppercase', letterSpacing: 1 },
  infoText: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMid, lineHeight: 20 },
  label: { fontFamily: FONTS.dmSansBold, fontSize: 11, color: COLORS.textLight, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontFamily: FONTS.dmSans, fontSize: 15, color: COLORS.textDark },
  sectionTitle: { fontFamily: FONTS.playfair700, fontSize: 16, color: COLORS.brownDark, marginBottom: 12 },
  stageCard: { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.tan, borderRadius: 18, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  stageCardActive: { borderColor: COLORS.orange, backgroundColor: '#FFF8F2' },
  stageIcon: { width: 38, height: 38, backgroundColor: COLORS.tan, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  stageIconActive: { backgroundColor: COLORS.orange },
  stageName: { fontFamily: FONTS.dmSansBold, fontSize: 14, color: COLORS.brownDark },
  stageTime: { fontFamily: FONTS.dmSans, fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  stageTemp: { fontFamily: FONTS.dmSans, fontSize: 10, color: COLORS.textLight, textAlign: 'right', maxWidth: 80 },
});

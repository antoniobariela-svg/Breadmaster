import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants/theme';
import { QUICK_PROMPTS, SYSTEM_PROMPT } from '../data/recipes';

export default function AIScreen({ lang, onBack }) {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: lang === 'id'
      ? 'Halo! Saya BreadMaster AI 🍞 Tanya apa saja soal roti — komposisi adonan, masalah baking, teknik, atau sekadar penasaran. Saya siap bantu!'
      : "Hello! I'm BreadMaster AI 🍞 Ask me anything about bread — dough composition, baking problems, techniques. I'm here to help!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || !savedKey) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      // Hanya kirim pesan user & ai setelah pesan pembuka (skip index 0)
      const history = messages.slice(1).map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      // Tambahkan system prompt sebagai pesan user pertama jika history kosong
      const contents = history.length === 0
        ? [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nUser: ' + userText }] },
          ]
        : [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'Siap! Saya BreadMaster AI, ahli roti siap membantu.' }] },
            ...history,
            { role: 'user', parts: [{ text: userText }] },
          ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${savedKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );
      const data = await res.json();

      // Cek error dari API
      if (data.error) {
        setMessages(prev => [...prev, { role: 'ai', text: `⚠️ Error API: ${data.error.message}` }]);
        setLoading(false);
        return;
      }

      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || 'Maaf, tidak ada respons. Coba lagi ya!';
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: `⚠️ Terjadi kesalahan koneksi: ${err.message}` }]);
    }
    setLoading(false);
  };

  if (!savedKey) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>BreadMaster AI</Text>
        </View>
        <ScrollView contentContainerStyle={styles.setupContainer}>
          <View style={styles.aiIconWrap}>
            <Text style={{ fontSize: 40 }}>🤖</Text>
          </View>
          <Text style={styles.setupTitle}>BreadMaster AI</Text>
          <Text style={styles.setupDesc}>Masukkan Gemini API Key untuk mengaktifkan fitur AI. Key tidak disimpan permanen.</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🔑 Cara Mendapatkan API Key</Text>
            <Text style={styles.infoText}>Daftar di aistudio.google.com → Get API Key → Salin ke sini. Gratis untuk penggunaan normal.</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Masukkan Gemini API Key..."
            placeholderTextColor={COLORS.tanDark}
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.primaryBtn, !apiKey && styles.primaryBtnDisabled]}
            onPress={() => apiKey && setSavedKey(apiKey)}
            disabled={!apiKey}>
            <Text style={styles.primaryBtnText}>🤖 Aktifkan BreadMaster AI</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>BreadMaster AI</Text>
          <Text style={styles.headerSub}>Powered by Gemini ✦</Text>
        </View>
        <TouchableOpacity onPress={() => setSavedKey('')} style={styles.changeKeyBtn}>
          <Text style={styles.changeKeyText}>🔑 Ganti</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} style={styles.messagesArea} contentContainerStyle={{ padding: 16, gap: 12 }}>
          {messages.map((m, i) => (
            <View key={i} style={{ alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.sender, m.role === 'user' ? styles.senderUser : styles.senderAI]}>
                {m.role === 'user' ? 'Kamu' : '🍞 BreadMaster AI'}
              </Text>
              <View style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
                <Text style={[styles.bubbleText, m.role === 'user' && { color: COLORS.white }]}>
                  {m.text}
                </Text>
              </View>
            </View>
          ))}
          {loading && (
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={styles.senderAI}>🍞 BreadMaster AI</Text>
              <View style={[styles.bubble, styles.bubbleAI, { flexDirection: 'row', gap: 6, paddingVertical: 14 }]}>
                <ActivityIndicator size="small" color={COLORS.orange} />
                <Text style={{ color: COLORS.textLight, fontSize: 13 }}>Sedang berpikir...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick prompts */}
        {messages.length === 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsArea} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {QUICK_PROMPTS.map((q, i) => (
              <TouchableOpacity key={i} style={styles.chip} onPress={() => sendMessage(q)}>
                <Text style={styles.chipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.chatInput}
            placeholder="Tanya soal roti kamu..."
            placeholderTextColor={COLORS.tanDark}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}>
            <Text style={styles.sendBtnText}>›</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  header: { backgroundColor: COLORS.brownDark, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: COLORS.white, fontSize: 22, fontWeight: '700', marginTop: -2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.cream },
  headerSub: { fontSize: 10, color: COLORS.orangeLight, letterSpacing: 0.5, marginTop: 1 },
  changeKeyBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  changeKeyText: { fontSize: 11, color: COLORS.tanDark },

  setupContainer: { padding: 24, alignItems: 'center', flexGrow: 1, justifyContent: 'center' },
  aiIconWrap: { width: 80, height: 80, backgroundColor: COLORS.brownDark, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  setupTitle: { fontSize: 24, fontWeight: '700', color: COLORS.brownDark, marginBottom: 8 },
  setupDesc: { fontSize: 13, color: COLORS.textLight, textAlign: 'center', lineHeight: 20, marginBottom: 20 },

  infoBox: { backgroundColor: '#FFF5EE', borderWidth: 1.5, borderColor: COLORS.orangeLight, borderRadius: 14, padding: 14, marginBottom: 16, width: '100%' },
  infoTitle: { fontSize: 12, fontWeight: '700', color: COLORS.orange, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  infoText: { fontSize: 13, color: COLORS.textMid, lineHeight: 19 },

  input: { width: '100%', backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 12, padding: 14, fontSize: 15, color: COLORS.textDark, marginBottom: 12 },
  primaryBtn: { width: '100%', backgroundColor: COLORS.orange, borderRadius: 14, padding: 16, alignItems: 'center' },
  primaryBtnDisabled: { backgroundColor: COLORS.tan },
  primaryBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },

  messagesArea: { flex: 1, backgroundColor: COLORS.cream },
  sender: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  senderUser: { color: COLORS.textLight, textAlign: 'right' },
  senderAI: { color: COLORS.orange },
  bubble: { maxWidth: '85%', borderRadius: 18, padding: 14 },
  bubbleUser: { backgroundColor: COLORS.brownDark, borderBottomRightRadius: 4 },
  bubbleAI: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.tan, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, color: COLORS.textDark, lineHeight: 22 },

  chipsArea: { backgroundColor: COLORS.warmWhite, paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.tan, maxHeight: 52 },
  chip: { backgroundColor: COLORS.cream, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  chipText: { fontSize: 12, color: COLORS.textMid, fontWeight: '500' },

  inputArea: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, backgroundColor: COLORS.white, borderTopWidth: 1.5, borderTopColor: COLORS.tan },
  chatInput: { flex: 1, backgroundColor: COLORS.cream, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: COLORS.textDark, maxHeight: 120 },
  sendBtn: { width: 44, height: 44, backgroundColor: COLORS.orange, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: COLORS.tan },
  sendBtnText: { color: COLORS.white, fontSize: 24, fontWeight: '700', marginTop: -2 },
});

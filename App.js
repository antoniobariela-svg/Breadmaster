import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_900Black } from '@expo-google-fonts/playfair-display';
import HomeScreen from './screens/HomeScreen';
import HydrationScreen from './screens/HydrationScreen';
import RecipesScreen from './screens/RecipesScreen';
import BakersScreen from './screens/BakersScreen';
import TimerScreen from './screens/TimerScreen';
import ConversionScreen from './screens/ConversionScreen';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [lang, setLang] = useState('id');

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>🍞</Text>
      </View>
    );
  }

  const navigate = (s) => setScreen(s);
  const goHome = () => setScreen('home');

  return (
    <>
      <StatusBar style="light" />
      {screen === 'home' && <HomeScreen lang={lang} setLang={setLang} navigate={navigate} />}
      {screen === 'hydration' && <HydrationScreen lang={lang} onBack={goHome} />}
      {screen === 'recipes' && <RecipesScreen lang={lang} onBack={goHome} />}
      {screen === 'bakers' && <BakersScreen lang={lang} onBack={goHome} />}
      {screen === 'timer' && <TimerScreen lang={lang} onBack={goHome} />}
      {screen === 'conversion' && <ConversionScreen lang={lang} onBack={goHome} />}
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#3B1F0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 64,
  },
});

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
import { HYDRATION_PRESETS } from './data/recipes';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [lang, setLang] = useState('id');

  // Shared state: database bahan cair (bisa ditambah user)
  const [liquidDB, setLiquidDB] = useState(HYDRATION_PRESETS);

  // Data yang dikirim dari Baker's % ke Hidrasi
  const [importedFromBakers, setImportedFromBakers] = useState(null);

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

  // Dipanggil dari BakersScreen saat tap "Kirim ke Hidrasi"
  const navigateToHydrationWithData = (data) => {
    setImportedFromBakers(data);
    setScreen('hydration');
  };

  return (
    <>
      <StatusBar style="light" />
      {screen === 'home' && <HomeScreen lang={lang} setLang={setLang} navigate={navigate} />}
      {screen === 'hydration' && (
        <HydrationScreen
          lang={lang}
          onBack={goHome}
          liquidDB={liquidDB}
          setLiquidDB={setLiquidDB}
          importedData={importedFromBakers}
          clearImport={() => setImportedFromBakers(null)}
        />
      )}
      {screen === 'recipes' && <RecipesScreen lang={lang} onBack={goHome} />}
      {screen === 'bakers' && (
        <BakersScreen
          lang={lang}
          onBack={goHome}
          onSendToHydration={navigateToHydrationWithData}
        />
      )}
      {screen === 'timer' && <TimerScreen lang={lang} onBack={goHome} />}
      {screen === 'conversion' && <ConversionScreen lang={lang} onBack={goHome} />}
    </>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#3B1F0A', alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 64 },
});

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_900Black } from '@expo-google-fonts/playfair-display';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { BASE_LIQUID_DB } from './data/index';

import HomeScreen from './screens/HomeScreen';
import HydrationScreen from './screens/HydrationScreen';
import RecipesScreen from './screens/RecipesScreen';
import TimerScreen from './screens/TimerScreen';
import MyBreadScreen from './screens/MyBreadScreen';
import ConversionScreen from './screens/ConversionScreen';
import GlossaryScreen from './screens/GlossaryScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [lang, setLang] = useState('id');
  const [screen, setScreen] = useState('home');
  const [liquidDB, setLiquidDB] = useState(BASE_LIQUID_DB);
  const [importedFromBakers, setImportedFromBakers] = useState(null);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const navigateToHydrationWithData = (data) => {
    setImportedFromBakers(data);
    setScreen('hydration');
  };

  const screenProps = { lang, setLang };

  return (
    <View style={s.container} onLayout={onLayoutRootView}>
      {screen === 'home' && (
        <HomeScreen {...screenProps} setScreen={setScreen} />
      )}
      {screen === 'hydration' && (
        <HydrationScreen
          {...screenProps}
          onBack={() => setScreen('home')}
          liquidDB={liquidDB}
          setLiquidDB={setLiquidDB}
          importedData={importedFromBakers}
          clearImport={() => setImportedFromBakers(null)}
        />
      )}
      {screen === 'recipes' && (
        <RecipesScreen {...screenProps} onBack={() => setScreen('home')} />
      )}
      {screen === 'timer' && (
        <TimerScreen {...screenProps} onBack={() => setScreen('home')} />
      )}
      {screen === 'bakers' && (
        <MyBreadScreen
          {...screenProps}
          onBack={() => setScreen('home')}
          onSendToHydration={navigateToHydrationWithData}
        />
      )}
      {screen === 'conversion' && (
        <ConversionScreen {...screenProps} onBack={() => setScreen('home')} />
      )}
      {screen === 'glossary' && (
        <GlossaryScreen {...screenProps} onBack={() => setScreen('home')} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
});

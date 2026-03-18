import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import HydrationScreen from './screens/HydrationScreen';
import RecipesScreen from './screens/RecipesScreen';
import BakersScreen from './screens/BakersScreen';
import TimerScreen from './screens/TimerScreen';
import ConversionScreen from './screens/ConversionScreen';
import AIScreen from './screens/AIScreen';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [lang, setLang] = useState('id');

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
      {screen === 'ai' && <AIScreen lang={lang} onBack={goHome} />}
    </>
  );
}

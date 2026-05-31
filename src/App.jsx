import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSpeech } from './useSpeech';
import HomeScreen from './components/HomeScreen';
import CookingScreen from './components/CookingScreen';
import DoneScreen from './components/DoneScreen';

// ─── lazy load recipe data ──────────────────────────────────────────────────
let RECIPES = [];
try {
  const mod = await import('./recipeData.js');
  RECIPES = mod.default || mod.recipes || [];
} catch {
  RECIPES = [];
}

// ─── Storage helpers ─────────────────────────────────────────────────────────
function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── Intent matcher (14 intents) ────────────────────────────────────────────
function matchIntent(text) {
  const t = (text || '').toLowerCase().trim();

  // Cooking navigation
  if (/\b(next|continue|proceed|go on|move on|forward)\b/.test(t)) return 'NEXT';
  if (/\b(previous|prev|back|go back|last step)\b/.test(t)) return 'PREV';
  if (/\b(repeat|say again|again|what did you say|once more)\b/.test(t)) return 'REPEAT';
  if (/\b(done|finish|finished|complete|completed|i(?:'m| am) done)\b/.test(t)) return 'DONE';

  // Timer
  if (/\b(set timer|start timer|timer|remind me)\b/.test(t)) return 'SET_TIMER';
  if (/\b(cancel timer|stop timer|clear timer)\b/.test(t)) return 'CANCEL_TIMER';

  // Navigation
  if (/\b(home|go home|recipe list|all recipes|back to recipes)\b/.test(t)) return 'HOME';

  // Info
  if (/\b(ingredients?|what do i need|shopping list)\b/.test(t)) return 'INGREDIENTS';
  if (/\b(how long|total time|cook time|prep time|duration)\b/.test(t)) return 'TIME';
  if (/\b(difficulty|how hard|skill level|level)\b/.test(t)) return 'DIFFICULTY';

  // Favorites
  if (/\b(favorite|save|add to favorite|♥|heart)\b/.test(t)) return 'TOGGLE_FAVORITE';

  // Search (e.g. "find pasta", "search chicken")
  const searchMatch = t.match(/\b(?:find|search|look for|show me|cook)\s+(.+)/);
  if (searchMatch) return { intent: 'SEARCH', query: searchMatch[1].trim() };

  // Open recipe by name — fallback
  if (t.length > 2) return { intent: 'OPEN_BY_NAME', query: t };

  return null;
}

// ─── Timer hook ──────────────────────────────────────────────────────────────
function useTimer() {
  const [timer, setTimer] = useState(null); // { remaining, label, total }
  const intervalRef = useRef(null);

  const startTimer = useCallback((seconds, label = '') => {
    clearInterval(intervalRef.current);
    setTimer({ remaining: seconds, label, total: seconds });
    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (!prev) return null;
        if (prev.remaining <= 1) {
          clearInterval(intervalRef.current);
          return null;
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
  }, []);

  const cancelTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setTimer(null);
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { timer, startTimer, cancelTimer };
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  // Screens: 'home' | 'cooking' | 'done'
  const [screen, setScreen] = useState('home');
  const [recipe, setRecipe] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  // Favorites & history (persisted)
  const [favoriteIds, setFavoriteIds] = useState(() => loadLS('cheffear_favIds', []));
  const [history, setHistory] = useState(() => loadLS('cheffear_history', []));

  // Search & category
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Session tracking
  const sessionStartRef = useRef(null);

  // Persist favorites
  useEffect(() => saveLS('cheffear_favIds', favoriteIds), [favoriteIds]);
  useEffect(() => saveLS('cheffear_history', history), [history]);

  // Timer
  const { timer, startTimer, cancelTimer } = useTimer();

  // Speech
  const {
    isListening, transcript, setTranscript,
    interimTranscript, isSpeaking, supported,
    micError, startListening, stopListening, speak,
  } = useSpeech();

  // Stale-closure ref for screen/recipe/step
  const stateRef = useRef({ screen, recipe, stepIndex });
  useEffect(() => { stateRef.current = { screen, recipe, stepIndex }; }, [screen, recipe, stepIndex]);

  // ── derived ──
  const favorites = useMemo(
    () => RECIPES.filter(r => favoriteIds.includes(r.id)),
    [favoriteIds]
  );

  // ── helpers ──
  const toggleFavorite = useCallback(id => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const openRecipe = useCallback(r => {
    setRecipe(r);
    setStepIndex(0);
    setScreen('cooking');
    sessionStartRef.current = Date.now();
    speak(`Starting ${r.name}. ${r.steps?.[0]?.instruction || ''}`);
  }, [speak]);

  const goHome = useCallback(() => {
    setScreen('home');
    setRecipe(null);
    setStepIndex(0);
    cancelTimer();
  }, [cancelTimer]);

  // ── Session save to history ──
  const saveToHistory = useCallback(r => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== r.id);
      return [{ ...r, cookedAt: Date.now() }, ...filtered].slice(0, 20);
    });
  }, []);

  // ── Nav actions ──
  const goNext = useCallback(() => {
    const { recipe: r, stepIndex: si } = stateRef.current;
    if (!r) return;
    const steps = r.steps || [];
    if (si < steps.length - 1) {
      const next = si + 1;
      setStepIndex(next);
      speak(steps[next].instruction);
    } else {
      saveToHistory(r);
      setScreen('done');
      speak(`Amazing! You've completed ${r.name}. Enjoy your meal!`);
    }
  }, [speak, saveToHistory]);

  const goPrev = useCallback(() => {
    const { stepIndex: si, recipe: r } = stateRef.current;
    if (si > 0) {
      const prev = si - 1;
      setStepIndex(prev);
      speak(r.steps[prev].instruction);
    } else {
      speak('This is the first step.');
    }
  }, [speak]);

  const repeatStep = useCallback(() => {
    const { recipe: r, stepIndex: si } = stateRef.current;
    if (r?.steps?.[si]) speak(r.steps[si].instruction);
  }, [speak]);

  // ── Voice intent handler ──
  const handleIntent = useCallback((raw) => {
    const result = matchIntent(raw);
    const { screen: s, recipe: r } = stateRef.current;
    if (!result) return;

    const intent = typeof result === 'string' ? result : result.intent;

    if (s === 'cooking') {
      switch (intent) {
        case 'NEXT': goNext(); break;
        case 'PREV': goPrev(); break;
        case 'REPEAT': repeatStep(); break;
        case 'DONE':
          saveToHistory(r);
          setScreen('done');
          speak(`Well done! ${r?.name} is complete!`);
          break;
        case 'HOME': goHome(); break;
        case 'INGREDIENTS':
          if (r?.ingredients?.length) speak('You need: ' + r.ingredients.slice(0, 6).join(', '));
          else speak('No ingredient list available.');
          break;
        case 'TIME':
          speak(r?.totalTime ? `This recipe takes about ${r.totalTime} minutes in total.` : 'Total time not specified.');
          break;
        case 'DIFFICULTY':
          speak(r?.difficulty ? `This is a ${r.difficulty} recipe.` : 'Difficulty not specified.');
          break;
        case 'TOGGLE_FAVORITE':
          toggleFavorite(r.id);
          speak(favoriteIds.includes(r.id) ? 'Removed from favorites.' : 'Added to favorites!');
          break;
        case 'SET_TIMER': {
          const step = r?.steps?.[stateRef.current.stepIndex];
          const secs = step?.timerSeconds || 300;
          startTimer(secs, `Step ${stateRef.current.stepIndex + 1}`);
          speak(`Timer set for ${Math.round(secs / 60)} minutes.`);
          break;
        }
        case 'CANCEL_TIMER':
          cancelTimer();
          speak('Timer cancelled.');
          break;
        default: break;
      }
    } else if (s === 'home') {
      if (intent === 'SEARCH' || intent === 'OPEN_BY_NAME') {
        const query = result.query || '';
        setSearchQuery(query);
        // Try to open exact match
        const match = RECIPES.find(rec =>
          rec.name.toLowerCase().includes(query.toLowerCase()) ||
          rec.ingredients?.some(i => i.toLowerCase().includes(query.toLowerCase()))
        );
        if (match) {
          speak(`Opening ${match.name}.`);
          openRecipe(match);
        } else {
          speak(`Searching for ${query}.`);
        }
      }
      if (intent === 'TOGGLE_FAVORITE') speak('Open a recipe first to favorite it.');
    } else if (s === 'done') {
      if (intent === 'HOME') goHome();
      if (intent === 'NEXT' || intent === 'REPEAT') {
        const r = stateRef.current.recipe;
        if (r) openRecipe(r);
      }
    }
  }, [goNext, goPrev, repeatStep, goHome, speak, startTimer, cancelTimer, toggleFavorite, favoriteIds, openRecipe, saveToHistory]);

  // ── Listen for transcript changes ──
  useEffect(() => {
    if (!transcript) return;
    handleIntent(transcript);
    setTranscript('');
  }, [transcript, handleIntent, setTranscript]);

  // ── Mic button toggle ──
  const handleMicPress = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  // ── Session duration ──
  const sessionDuration = screen === 'done' && sessionStartRef.current
    ? Math.round((Date.now() - sessionStartRef.current) / 1000)
    : null;

  const isFavorite = recipe ? favoriteIds.includes(recipe.id) : false;

  // ── Render ──
  if (!supported) {
    return (
      <div style={{ color: '#F5F0EB', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎤</div>
        <h1 style={{ fontSize: '20px', marginBottom: '8px' }}>Voice Not Supported</h1>
        <p style={{ color: '#888' }}>Please use Chrome or Edge for voice features.</p>
      </div>
    );
  }

  if (screen === 'home') {
    return (
      <HomeScreen
        recipes={RECIPES}
        favorites={favorites}
        history={history}
        onSelect={openRecipe}
        onToggleFavorite={toggleFavorite}
        isListening={isListening}
        isSpeaking={isSpeaking}
        interimTranscript={interimTranscript}
        micError={micError}
        onMicPress={handleMicPress}
        timer={timer}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    );
  }

  if (screen === 'cooking') {
    return (
      <CookingScreen
        recipe={recipe}
        stepIndex={stepIndex}
        onNext={goNext}
        onPrev={goPrev}
        onRepeat={repeatStep}
        onHome={goHome}
        onDone={() => { saveToHistory(recipe); setScreen('done'); speak(`Amazing! ${recipe.name} is done!`); }}
        isListening={isListening}
        isSpeaking={isSpeaking}
        interimTranscript={interimTranscript}
        micError={micError}
        onMicPress={handleMicPress}
        timer={timer}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  if (screen === 'done') {
    return (
      <DoneScreen
        recipe={recipe}
        sessionDuration={sessionDuration}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onHome={goHome}
        onRepeat={() => recipe && openRecipe(recipe)}
      />
    );
  }

  return null;
}

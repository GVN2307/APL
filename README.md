# ChefEar — Voice-First Recipe App

ChefEar is a premium, hands-free cooking assistant designed for the "messy kitchen" environment. Built with React 18, Vite, and styled with a high-fidelity obsidian dark-mode system, it leverages advanced voice synthesis and speech recognition to let you cook without ever touching your device.

---

## 🌟 Premium Features

1. **Voice-First Navigation:** Say "next", "back", or "repeat" to control the recipe steps.
2. **Auto-Listening Loop:** The microphone automatically listens for 3 seconds after reading a step—simply speak your next command without tapping anything.
3. **Fuzzy Ingredient Quantity Queries:** Ask "How much butter?" or "How many eggs?" and get instant spoken responses.
4. **Smart Substitution Checker:** Ask "What is a substitute for butter?" to hear alternative options based on built-in culinary mapping.
5. **Kitchen Countdown Timers:** Say "Set timer for 2 minutes" or "remind me in 45 seconds" to create visual countdown badges that play high-frequency chime alerts upon expiration.
6. **Automatic Screen Wake Lock:** Keeps your screen awake while cooking so it never dims or locks while your hands are covered.
7. **Premium Obsidian Aesthetics:** Gorgeous glassmorphic containers, high-contrast text levels, dynamic pulsing microphone indicators, and custom canvas-based completion confetti!

---

## 🎤 Vocal Intent Guide

ChefEar parses natural kitchen speech and routes them into structured state actions:

| Voice Intent | Command Synonyms / Examples | App Action |
|---|---|---|
| **Start Recipe** | *"start scrambled eggs"*, *"make pasta"* | Switches from Home screen directly to selected recipe. |
| **Next Step** | *"next"*, *"continue"*, *"got it"*, *"forward"* | Navigates forward by one step. Transitions to Done on final step. |
| **Back Step** | *"back"*, *"previous"*, *"go back"* | Navigates backward. |
| **Repeat Step** | *"repeat"*, *"again"*, *"say again"* | Re-reads the current instruction and hints. |
| **Reset Recipe** | *"restart"*, *"start over"*, *"reset"* | Returns to the first step of the recipe. |
| **Quantity Query** | *"how much butter"*, *"quantity of eggs"* | Speaks exact measurements for the queried ingredient. |
| **Substitutions** | *"substitute for butter"*, *"swap garlic"* | Speaks compatible ingredient swap-ins. |
| **Timer Setup** | *"set timer 2 minutes"*, *"countdown 30 sec"* | Spawns a floating countdown pill with audio alert on completion. |
| **Stop Engine** | *"stop"*, *"pause"*, *"quit"* | Pauses voice synthesis and stops the auto-listen loop. |
| **Return Home** | *"home"*, *"back to recipes"*, *"main menu"* | Safely exits cooking dashboard to main menu. |

---

## 🛠️ Developer Setup & Architecture

### File Scaffolds
```
cheffear/
├── index.html            # Imports Google Inter fonts and Material Icons
├── package.json          # Package dependencies (React 18, Vite 8, Firebase Hosting)
├── vite.config.js        # Bundles outputs into static files
├── firebase.json         # Firebase Hosting redirects mapping
├── .firebaserc           # Binds to live deployment ID
├── src/
│   ├── main.jsx          # Mounts strict React client context
│   ├── index.css         # PIN-TO-PIN tokens, animations, scrollbars
│   ├── App.jsx           # Core state router, wake-lock coordination, timer ticking
│   ├── useSpeech.js      # SpeechRecognition, SpeechSynthesis & Earcon audio synthetics
│   ├── recipe.js         # Built-in structured database and culinary substitutions
│   └── components/
│       ├── HomeScreen.jsx       # Welcomes user, setting panels, recipe choices
│       ├── CookingScreen.jsx    # Step navigation, progress bars, active timers, transcripts
│       ├── DoneScreen.jsx       # Celebratory canvas-particle confetti, Cook Another redirects
│       ├── MicButton.jsx        # Float capture node supporting desktop mouse holds & touches
│       ├── TimerBadge.jsx       # Formatting countdown MM:SS capsule indicators
│       └── RecipeCard.jsx       # High-fidelity display items with premium imagery
```

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Deploy to Hosting
```bash
npm run deploy
```

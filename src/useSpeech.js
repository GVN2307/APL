import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [micError, setMicError] = useState(null); // 'no-speech' | 'audio-capture' | 'not-allowed' | null

  const recognitionRef = useRef(null);
  const audioCtxRef = useRef(null);
  const startTimeoutRef = useRef(null);

  // Lazy-init AudioContext (must be after user gesture)
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtxRef.current = new AC();
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playEarcon = useCallback((type) => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'listen') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now); osc.stop(now + 0.12);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1320, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now); osc.stop(now + 0.07);
      } else if (type === 'error') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(220, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now); osc.stop(now + 0.22);
      }
    } catch (e) {
      console.warn('Earcon error:', e);
    }
  }, [getAudioCtx]);

  // Setup SpeechRecognition
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;      // live transcript feedback
    rec.lang = 'en-US';
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsListening(true);
      setMicError(null);
      playEarcon('listen');
    };

    rec.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      if (interim) setInterimTranscript(interim);
      if (final) {
        setTranscript(final.trim());
        setInterimTranscript('');
        playEarcon('success');
      }
    };

    rec.onerror = (event) => {
      setIsListening(false);
      setInterimTranscript('');
      const err = event.error;
      setMicError(err);
      if (err !== 'no-speech') {
        playEarcon('error');
      }
    };

    rec.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = rec;
  }, [playEarcon]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    // Cancel ongoing TTS first
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    // Small delay prevents rapid restart errors
    clearTimeout(startTimeoutRef.current);
    startTimeoutRef.current = setTimeout(() => {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started — ignore
      }
    }, 100);
  }, []);

  const stopListening = useCallback(() => {
    clearTimeout(startTimeoutRef.current);
    try { recognitionRef.current?.stop(); } catch (e) {}
  }, []);

  const speak = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) { if (onEnd) onEnd(); return; }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const getBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = ['Google US English', 'Samantha', 'Karen', 'Microsoft Zira', 'Microsoft David'];
      for (const name of preferred) {
        const v = voices.find(v => v.name.includes(name));
        if (v) return v;
      }
      return voices.find(v => v.lang.startsWith('en')) || null;
    };

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    utter.voice = getBestVoice();

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => { setIsSpeaking(false); if (onEnd) onEnd(); };
    utter.onerror = () => { setIsSpeaking(false); if (onEnd) onEnd(); };

    // Chrome bug: voices may not be loaded yet
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        utter.voice = getBestVoice();
        window.speechSynthesis.speak(utter);
      };
    } else {
      window.speechSynthesis.speak(utter);
    }
  }, []);

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    transcript,
    setTranscript,
    interimTranscript,
    isSpeaking,
    supported,
    micError,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    playEarcon,
  };
}

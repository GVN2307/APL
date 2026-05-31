import React, { useState, useEffect, useCallback } from 'react';
import MicButton from './MicButton';
import TimerBadge from './TimerBadge';

export default function CookingScreen({
  recipe,
  stepIndex,
  onNext,
  onPrev,
  onRepeat,
  onHome,
  onDone,
  isListening,
  isSpeaking,
  interimTranscript,
  micError,
  onMicPress,
  timer,
  isFavorite,
  onToggleFavorite,
}) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');

  if (!recipe) return null;
  const steps = recipe.steps || [];
  const step = steps[stepIndex];
  const progress = steps.length > 0 ? ((stepIndex + 1) / steps.length) * 100 : 0;
  const isLast = stepIndex === steps.length - 1;
  const isFirst = stepIndex === 0;

  return (
    <div
      id="cooking-screen"
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '16px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '1px solid #141414',
          background: '#0A0A0A',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Back */}
        <button
          id="cooking-back"
          onClick={onHome}
          style={{
            background: '#1A1A1A',
            border: '1.5px solid #242424',
            borderRadius: '10px',
            color: '#888',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            flexShrink: 0,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#CCC'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.color = '#888'; }}
        >
          ←
        </button>

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: '700',
              color: '#E8E0D8',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {recipe.emoji} {recipe.name}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#555', marginTop: '1px' }}>
            Step {stepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* Favorite */}
        <button
          id="cooking-fav"
          onClick={() => onToggleFavorite(recipe.id)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '22px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        {/* Timer badge */}
        {timer && <TimerBadge seconds={timer.remaining} label={timer.label} compact />}

        {/* Mic */}
        <MicButton
          isListening={isListening}
          isSpeaking={isSpeaking}
          interimTranscript={interimTranscript}
          micError={micError}
          onPress={onMicPress}
          compact
        />
      </header>

      {/* Progress bar */}
      <div style={{ height: '3px', background: '#141414', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #FF6B35, #FF9B35)',
            transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>

      {/* Main content */}
      <main style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Step card */}
        <div
          style={{
            background: '#111',
            border: '1.5px solid #1E1E1E',
            borderRadius: '20px',
            padding: '24px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Step number badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #FF6B35, #FF9B35)',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: '800',
                color: '#000',
                flexShrink: 0,
              }}
            >
              {stepIndex + 1}
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {isLast ? 'Final Step' : `Step ${stepIndex + 1}`}
            </span>
          </div>

          {/* Step instruction */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '17px',
              fontWeight: '500',
              color: '#F5F0EB',
              lineHeight: '1.65',
              flex: 1,
              margin: 0,
            }}
          >
            {step?.instruction || 'No instruction available.'}
          </p>

          {/* Step timer hint */}
          {step?.timerSeconds && (
            <div
              style={{
                background: 'rgba(255,107,53,0.08)',
                border: '1px solid rgba(255,107,53,0.2)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: '#FF9B35',
              }}
            >
              ⏱ This step needs ~{Math.round(step.timerSeconds / 60)} min — say <strong>"set timer"</strong> to start
            </div>
          )}
        </div>

        {/* Interim transcript */}
        {interimTranscript && (
          <div
            style={{
              background: 'rgba(255,107,53,0.07)',
              border: '1px solid rgba(255,107,53,0.2)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              color: '#FF9B35',
              fontStyle: 'italic',
            }}
          >
            🎙️ "{interimTranscript}…"
          </div>
        )}

        {/* Voice commands hint */}
        <div
          style={{
            background: '#0D0D0D',
            border: '1px solid #1A1A1A',
            borderRadius: '14px',
            padding: '12px 16px',
          }}
        >
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#444', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Voice Commands
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['"next"', '"previous"', '"repeat"', '"set timer"', '"ingredients"', '"home"', '"done"'].map(cmd => (
              <span
                key={cmd}
                style={{
                  background: '#161616',
                  border: '1px solid #222',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontFamily: 'Inter, monospace',
                  fontSize: '11px',
                  color: '#666',
                }}
              >
                {cmd}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'grid', gridTemplateColumns: isFirst ? '1fr 1fr' : '1fr 1fr 1fr', gap: '10px' }}>
          {!isFirst && (
            <button
              id="step-prev"
              onClick={onPrev}
              style={navBtnStyle('#1A1A1A', '#888', '#242424')}
            >
              ← Prev
            </button>
          )}
          <button
            id="step-repeat"
            onClick={onRepeat}
            style={navBtnStyle('#1A1A1A', '#888', '#242424')}
          >
            🔁 Repeat
          </button>
          {isLast ? (
            <button
              id="step-done"
              onClick={onDone}
              style={navBtnStyle('linear-gradient(135deg,#FF6B35,#FF9B35)', '#000', 'transparent')}
            >
              ✓ Done!
            </button>
          ) : (
            <button
              id="step-next"
              onClick={onNext}
              style={navBtnStyle('linear-gradient(135deg,#FF6B35,#FF9B35)', '#000', 'transparent')}
            >
              Next →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function navBtnStyle(bg, color, border) {
  return {
    background: bg,
    border: `1.5px solid ${border}`,
    borderRadius: '14px',
    color,
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: '700',
    padding: '14px 10px',
    cursor: 'pointer',
    transition: 'opacity 0.15s, transform 0.1s',
    letterSpacing: '0.01em',
  };
}

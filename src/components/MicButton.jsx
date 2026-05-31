import React from 'react';

export default function MicButton({
  isListening,
  isSpeaking,
  isError,
  onPress,
  onRelease,
  label
}) {
  // Determine state styling
  let bgColor = 'var(--elevated)';
  let borderColor = '#444444';
  let iconName = 'mic';
  let pulseClass = '';
  let activeGlow = false;

  if (isListening) {
    bgColor = 'var(--primary)';
    borderColor = 'var(--primary-hover)';
    iconName = 'mic'; // Filled state handles🎙️ look via font-variation
    pulseClass = 'animate-mic-active';
    activeGlow = true;
  } else if (isSpeaking) {
    bgColor = '#4A90D9';
    borderColor = '#6BA3E0';
    iconName = 'volume_up';
  } else if (isError) {
    bgColor = 'var(--error)';
    borderColor = '#F87171';
    iconName = 'mic_off';
    pulseClass = 'animate-shake';
  }

  // Handle pointer/mouse hold mechanics
  const handleStart = (e) => {
    e.preventDefault();
    if (onPress) onPress();
  };

  const handleEnd = (e) => {
    e.preventDefault();
    if (onRelease) onRelease();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      pointerEvents: 'auto'
    }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        {/* Pulse ring animation behind active mic */}
        {isListening && (
          <div 
            className="animate-pulse-ring" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '80px',
              height: '80px',
              borderRadius: '9999px',
              border: '2px solid var(--primary)',
              zIndex: 1
            }}
          />
        )}

        {/* Floating glow aura */}
        {activeGlow && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '80px',
              height: '80px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary)',
              filter: 'blur(16px)',
              opacity: 0.3,
              zIndex: 1
            }}
          />
        )}

        {/* Main interactive button */}
        <button
          className={`${pulseClass}`}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            backgroundColor: bgColor,
            border: `3px solid ${borderColor}`,
            borderRadius: '9999px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            zIndex: 5,
            outline: 'none',
            boxShadow: activeGlow ? 'var(--glow-shadow)' : 'none'
          }}
        >
          <span 
            className={`material-symbols-outlined ${isListening || isSpeaking ? 'filled' : ''}`}
            style={{ 
              fontSize: '32px',
              transition: 'color 0.2s'
            }}
          >
            {iconName}
          </span>
        </button>
      </div>

      <span style={{
        marginTop: '12px',
        fontFamily: 'Inter',
        fontSize: '12px',
        fontWeight: '500',
        color: isListening ? 'var(--primary)' : 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        animation: isListening ? 'pulse 1.5s infinite' : 'none'
      }}>
        {label || (isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : isError ? 'Try again' : 'HOLD TO SPEAK')}
      </span>
    </div>
  );
}

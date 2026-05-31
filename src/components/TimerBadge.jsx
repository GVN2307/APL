import React from 'react';

export default function TimerBadge({ label, remaining, total, isDone }) {
  // Format seconds to MM:SS
  const formatTime = (secs) => {
    if (secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const bgStyle = isDone ? 'var(--success)' : 'var(--primary)';
  const pulseClass = isDone ? 'animate-pulse-success' : '';

  return (
    <div
      className={`no-scrollbar ${pulseClass}`}
      style={{
        backgroundColor: bgStyle,
        borderRadius: '12px',
        padding: '10px 16px',
        minWidth: '100px',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease-in-out',
        flexShrink: 0,
        userSelect: 'none'
      }}
    >
      <span style={{
        fontFamily: 'Inter',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, 0.8)',
        letterSpacing: '0.5px'
      }}>
        {label}
      </span>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '2px'
      }}>
        <span 
          className="material-symbols-outlined" 
          style={{ 
            fontSize: '18px',
            color: '#FFFFFF' 
          }}
        >
          {isDone ? 'check_circle' : 'timer'}
        </span>
        <span style={{
          fontFamily: 'Inter',
          fontSize: '20px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          lineHeight: '1'
        }}>
          {isDone ? `✓ ${formatTime(0)}` : formatTime(remaining)}
        </span>
      </div>
    </div>
  );
}

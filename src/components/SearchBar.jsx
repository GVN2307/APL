import React, { useRef, useEffect } from 'react';

export default function SearchBar({ value, onChange, onMicSearch, isListening }) {
  const inputRef = useRef(null);

  // Autofocus on mount on desktop
  useEffect(() => {
    const isMobile = 'ontouchstart' in window;
    if (!isMobile && inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div
      id="search-bar"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: '#1A1A1A',
        border: '1.5px solid #2A2A2A',
        borderRadius: '14px',
        padding: '0 14px',
        gap: '10px',
        transition: 'border-color 0.2s',
      }}
      onFocus={e => e.currentTarget.style.borderColor = '#FF6B35'}
      onBlur={e => e.currentTarget.style.borderColor = '#2A2A2A'}
    >
      {/* Search icon */}
      <span style={{ fontSize: '16px', color: '#666', flexShrink: 0 }}>🔍</span>

      <input
        ref={inputRef}
        id="search-input"
        type="text"
        placeholder="Search recipes or say it…"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#F5F0EB',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          padding: '13px 0',
          letterSpacing: '0.01em',
        }}
      />

      {/* Clear button */}
      {value && (
        <button
          id="search-clear"
          onClick={() => onChange('')}
          style={{
            background: '#2A2A2A',
            border: 'none',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            cursor: 'pointer',
            fontSize: '12px',
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      )}

      {/* Mic shortcut */}
      <button
        id="search-mic"
        onClick={onMicSearch}
        title="Voice search"
        style={{
          background: isListening ? '#FF6B35' : '#222',
          border: '1.5px solid #333',
          borderRadius: '9px',
          width: '34px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background 0.2s',
          boxShadow: isListening ? '0 0 10px rgba(255,107,53,0.5)' : 'none',
        }}
      >
        <span style={{ fontSize: '16px' }}>{isListening ? '🎙️' : '🎤'}</span>
      </button>
    </div>
  );
}

import React from 'react';

export default function HistorySection({ history, onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <h2
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: '700',
          color: '#888',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}
      >
        🕐 Recently Cooked
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {history.slice(0, 5).map((entry, idx) => (
          <HistoryRow key={`${entry.id}-${idx}`} entry={entry} onSelect={() => onSelect(entry)} />
        ))}
      </div>
    </div>
  );
}

function timeAgo(ts) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

function HistoryRow({ entry, onSelect }) {
  return (
    <div
      id={`history-${entry.id}`}
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#141414',
        border: '1.5px solid #1E1E1E',
        borderRadius: '12px',
        padding: '11px 14px',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#1A1A1A';
        e.currentTarget.style.borderColor = '#333';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#141414';
        e.currentTarget.style.borderColor = '#1E1E1E';
      }}
    >
      <span style={{ fontSize: '22px', flexShrink: 0 }}>{entry.emoji || '🍽️'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            color: '#E8E0D8',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {entry.name}
        </div>
        <div style={{ fontSize: '11px', color: '#555', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
          {timeAgo(entry.cookedAt)} · {entry.steps?.length || 0} steps
        </div>
      </div>
      <span style={{ fontSize: '16px', color: '#444' }}>›</span>
    </div>
  );
}

import React from 'react';

export default function FavoritesSection({ favorites, onSelect, onRemove }) {
  if (!favorites || favorites.length === 0) {
    return (
      <div style={{ marginBottom: '24px' }}>
        <SectionHeader label="❤️ Favorites" />
        <div
          style={{
            padding: '18px 20px',
            background: '#141414',
            borderRadius: '14px',
            border: '1.5px dashed #2A2A2A',
            textAlign: 'center',
            color: '#555',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          No favorites yet. Cook a recipe and tap ♥ to save it!
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <SectionHeader label={`❤️ Favorites (${favorites.length})`} />
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {favorites.map(recipe => (
          <FavCard
            key={recipe.id}
            recipe={recipe}
            onSelect={() => onSelect(recipe)}
            onRemove={() => onRemove(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ label }) {
  return (
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
      {label}
    </h2>
  );
}

function FavCard({ recipe, onSelect, onRemove }) {
  const diff = recipe.difficulty || 'easy';
  const diffColor = diff === 'easy' ? '#4CAF50' : diff === 'medium' ? '#FF9800' : '#F44336';

  return (
    <div
      style={{
        flex: '0 0 140px',
        background: '#141414',
        border: '1.5px solid #2A2A2A',
        borderRadius: '14px',
        padding: '12px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.18s, box-shadow 0.18s',
      }}
      onClick={onSelect}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,107,53,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Remove */}
      <button
        id={`fav-remove-${recipe.id}`}
        onClick={e => { e.stopPropagation(); onRemove(); }}
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          color: '#FF6B35',
          cursor: 'pointer',
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </button>

      <div style={{ fontSize: '28px', marginBottom: '6px' }}>
        {recipe.emoji || '🍽️'}
      </div>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: '700',
          color: '#F5F0EB',
          lineHeight: '1.3',
          marginBottom: '6px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {recipe.name}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: diffColor,
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: '10px', color: '#666', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}>
          {diff}
        </span>
        <span style={{ marginLeft: '4px', fontSize: '10px', color: '#555' }}>
          ⏱ {recipe.totalTime || '?'}m
        </span>
      </div>
    </div>
  );
}

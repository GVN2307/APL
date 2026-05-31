import React from 'react';

const DIFF_CONFIG = {
  easy:   { color: '#4CAF50', bg: 'rgba(76,175,80,0.12)',   label: 'Easy' },
  medium: { color: '#FF9800', bg: 'rgba(255,152,0,0.12)',   label: 'Medium' },
  hard:   { color: '#F44336', bg: 'rgba(244,67,54,0.12)',   label: 'Hard' },
};

export default function RecipeCard({ recipe, onSelect, isFavorite, onToggleFavorite, small }) {
  if (!recipe) return null;

  const diff = DIFF_CONFIG[recipe.difficulty] || DIFF_CONFIG.easy;
  const totalMins = recipe.totalTime || (recipe.prepTime || 0) + (recipe.cookTime || 0) || null;

  if (small) {
    return (
      <SmallCard
        recipe={recipe}
        diff={diff}
        totalMins={totalMins}
        onSelect={onSelect}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <FullCard
      recipe={recipe}
      diff={diff}
      totalMins={totalMins}
      onSelect={onSelect}
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
    />
  );
}

function FullCard({ recipe, diff, totalMins, onSelect, isFavorite, onToggleFavorite }) {
  return (
    <div
      id={`recipe-card-${recipe.id}`}
      style={{
        background: '#141414',
        borderRadius: '16px',
        border: '1.5px solid #1E1E1E',
        padding: '14px 16px',
        display: 'flex',
        gap: '14px',
        cursor: 'pointer',
        transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s, border-color 0.2s',
        position: 'relative',
        alignItems: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
      onClick={onSelect}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,107,53,0.12)';
        e.currentTarget.style.borderColor = '#FF6B35';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
        e.currentTarget.style.borderColor = '#1E1E1E';
      }}
    >
      {/* Icon/Emoji container */}
      <div
        style={{
          width: '68px',
          height: '68px',
          background: 'linear-gradient(135deg, #1E1E1E 0%, #0F0F0F 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '34px',
          flexShrink: 0,
          border: '1px solid #2A2A2A',
        }}
      >
        {recipe.emoji || '🍽️'}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {/* Category & Difficulty Row */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {recipe.category && (
            <span
              style={{
                background: 'rgba(255,107,53,0.08)',
                color: '#FF6B35',
                border: '1px solid rgba(255,107,53,0.15)',
                borderRadius: '6px',
                padding: '1px 6px',
                fontSize: '9px',
                fontWeight: '700',
                fontFamily: 'Inter, sans-serif',
                textTransform: 'capitalize',
                letterSpacing: '0.02em',
              }}
            >
              {recipe.category}
            </span>
          )}
          <span
            style={{
              background: diff.bg,
              color: diff.color,
              border: `1px solid ${diff.color}25`,
              borderRadius: '6px',
              padding: '1px 6px',
              fontSize: '9px',
              fontWeight: '700',
              fontFamily: 'Inter, sans-serif',
              textTransform: 'capitalize',
            }}
          >
            {diff.label}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '700',
            color: '#FFFFFF',
            lineHeight: '1.3',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {recipe.name}
        </h3>

        {/* Info Row */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#666666', fontFamily: 'Inter, sans-serif', fontSize: '11px' }}>
          {totalMins && <span>⏱ {totalMins}m</span>}
          <span style={{ opacity: 0.3 }}>•</span>
          <span>🔢 {recipe.steps?.length || 0} steps</span>
        </div>
      </div>

      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          id={`fav-star-${recipe.id}`}
          onClick={e => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '8px',
            flexShrink: 0,
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      )}
    </div>
  );
}

function SmallCard({ recipe, diff, totalMins, onSelect, isFavorite, onToggleFavorite }) {
  return (
    <div
      id={`recipe-small-${recipe.id}`}
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#141414',
        borderRadius: '14px',
        border: '1.5px solid #1E1E1E',
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#191919';
        e.currentTarget.style.borderColor = '#FF6B3544';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#141414';
        e.currentTarget.style.borderColor = '#1E1E1E';
      }}
    >
      <span style={{ fontSize: '26px', flexShrink: 0 }}>{recipe.emoji || '🍽️'}</span>
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
            marginBottom: '3px',
          }}
        >
          {recipe.name}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: diff.color, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: '#666', fontFamily: 'Inter, sans-serif' }}>{diff.label}</span>
          {totalMins && <span style={{ fontSize: '11px', color: '#555', fontFamily: 'Inter, sans-serif' }}>· {totalMins}m</span>}
        </div>
      </div>
      {onToggleFavorite && (
        <button
          id={`small-fav-${recipe.id}`}
          onClick={e => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
          style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      )}
      <span style={{ fontSize: '18px', color: '#444', flexShrink: 0 }}>›</span>
    </div>
  );
}

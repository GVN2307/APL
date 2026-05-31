import React from 'react';

const CATS = [
  { id: 'all', label: '✦ All', icon: '🍴' },
  { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { id: 'lunch', label: 'Lunch', icon: '🥗' },
  { id: 'dinner', label: 'Dinner', icon: '🍝' },
  { id: 'snack', label: 'Snacks', icon: '🥜' },
  { id: 'dessert', label: 'Dessert', icon: '🍰' },
  { id: 'vegetarian', label: 'Veggie', icon: '🥦' },
  { id: 'quick', label: 'Quick', icon: '⚡' },
];

export default function CategoryTabs({ active, onChange }) {
  return (
    <div
      id="category-tabs"
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '0 0 4px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {CATS.map(cat => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            id={`cat-tab-${cat.id}`}
            onClick={() => onChange(cat.id)}
            style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 14px',
              borderRadius: '999px',
              border: isActive ? '1.5px solid #FF6B35' : '1.5px solid #2A2A2A',
              background: isActive
                ? 'linear-gradient(135deg, #FF6B35 0%, #FF8B35 100%)'
                : '#1A1A1A',
              color: isActive ? '#000' : '#888',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: isActive ? '700' : '500',
              letterSpacing: '0.02em',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              whiteSpace: 'nowrap',
              boxShadow: isActive ? '0 0 12px rgba(255,107,53,0.35)' : 'none',
            }}
          >
            <span style={{ fontSize: '14px' }}>{cat.icon}</span>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

export { CATS };

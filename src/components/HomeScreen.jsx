import React, { useState, useMemo, useCallback, useEffect } from 'react';
import SearchBar from './SearchBar';
import CategoryTabs from './CategoryTabs';
import FavoritesSection from './FavoritesSection';
import HistorySection from './HistorySection';
import RecipeCard from './RecipeCard';
import MicButton from './MicButton';
import TimerBadge from './TimerBadge';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'time-asc', label: 'Quickest' },
  { value: 'alpha', label: 'A → Z' },
  { value: 'difficulty', label: 'Easiest' },
];

export default function HomeScreen({
  recipes,
  favorites,
  history,
  onSelect,
  onToggleFavorite,
  isListening,
  isSpeaking,
  interimTranscript,
  micError,
  onMicPress,
  timer,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}) {
  const [sort, setSort] = useState('default');
  const [showAll, setShowAll] = useState(false);

  // Reset showAll when filter changes
  useEffect(() => {
    setShowAll(false);
  }, [searchQuery, activeCategory]);

  // Category map for filter
  const catKeywords = {
    breakfast: ['breakfast', 'pancake', 'waffle', 'egg', 'omelette', 'toast', 'oatmeal', 'muffin', 'bagel', 'cereal'],
    lunch: ['lunch', 'sandwich', 'salad', 'soup', 'wrap', 'bowl', 'hummus', 'quesadilla'],
    dinner: ['dinner', 'pasta', 'chicken', 'beef', 'steak', 'roast', 'curry', 'stir fry', 'noodle', 'rice', 'pizza', 'burger'],
    snack: ['snack', 'dip', 'chip', 'popcorn', 'cracker', 'trail mix', 'energy ball', 'guacamole'],
    dessert: ['dessert', 'cake', 'cookie', 'brownie', 'pie', 'pudding', 'ice cream', 'cheesecake', 'chocolate', 'sweet'],
    vegetarian: ['vegetarian', 'vegan', 'veggie', 'tofu', 'tempeh', 'lentil', 'bean', 'chickpea'],
    quick: [],
  };

  const filtered = useMemo(() => {
    let list = [...recipes];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.ingredients?.some(i => i.toLowerCase().includes(q)) ||
        r.category?.toLowerCase().includes(q)
      );
    }

    // Category
    if (activeCategory && activeCategory !== 'all') {
      if (activeCategory === 'quick') {
        list = list.filter(r => (r.totalTime || 999) <= 20);
      } else {
        const kw = catKeywords[activeCategory] || [];
        list = list.filter(r => {
          const haystack = (r.name + ' ' + (r.category || '') + ' ' + (r.description || '')).toLowerCase();
          return r.category === activeCategory || kw.some(k => haystack.includes(k));
        });
      }
    }

    // Sort
    if (sort === 'time-asc') list.sort((a, b) => (a.totalTime || 999) - (b.totalTime || 999));
    else if (sort === 'alpha') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'difficulty') {
      const rank = { easy: 0, medium: 1, hard: 2 };
      list.sort((a, b) => (rank[a.difficulty] ?? 1) - (rank[b.difficulty] ?? 1));
    }

    return list;
  }, [recipes, searchQuery, activeCategory, sort]);

  const INITIAL_COUNT = 12;
  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const favSet = new Set(favorites.map(f => f.id));
  const hasFilters = searchQuery || (activeCategory && activeCategory !== 'all');

  return (
    <div
      id="home-screen"
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '20px 20px 0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'linear-gradient(to bottom, #0A0A0A 80%, transparent)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '22px' }}>👨‍🍳</span>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '18px',
                  fontWeight: '800',
                  background: 'linear-gradient(90deg, #FF6B35, #FF9B35)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                ChefEar
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: '#555',
                marginTop: '1px',
                letterSpacing: '0.04em',
              }}
            >
              Voice-First Cooking · {recipes.length} recipes
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {timer && <TimerBadge seconds={timer.remaining} label={timer.label} />}
            <MicButton
              isListening={isListening}
              isSpeaking={isSpeaking}
              interimTranscript={interimTranscript}
              micError={micError}
              onPress={onMicPress}
              compact
            />
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '10px' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onMicSearch={onMicPress}
            isListening={isListening}
          />
        </div>

        {/* Category tabs */}
        <div style={{ marginBottom: '4px' }}>
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        </div>
      </header>

      {/* Scrollable content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px' }}>
        {/* Interim transcript bubble */}
        {interimTranscript && (
          <div
            style={{
              background: '#1A1A1A',
              border: '1px solid #FF6B3533',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '14px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              color: '#FF6B35',
              fontStyle: 'italic',
            }}
          >
            🎙️ "{interimTranscript}…"
          </div>
        )}

        {/* Favorites — only show when no active filter */}
        {!hasFilters && (
          <FavoritesSection
            favorites={favorites}
            onSelect={onSelect}
            onRemove={id => onToggleFavorite(id)}
          />
        )}

        {/* History — only when no active filter */}
        {!hasFilters && (
          <HistorySection history={history} onSelect={onSelect} />
        )}

        {/* Sort row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: '700',
              color: '#888',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {hasFilters ? `Results (${filtered.length})` : `All Recipes (${filtered.length})`}
          </h2>
          <select
            id="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '8px',
              color: '#888',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              padding: '5px 8px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Recipe grid */}
        {filtered.length === 0 ? (
          <EmptyState query={searchQuery} category={activeCategory} />
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '14px',
                marginBottom: '14px',
              }}
            >
              {displayed.map(r => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  onSelect={() => onSelect(r)}
                  isFavorite={favSet.has(r.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>

            {/* Show more */}
            {!showAll && filtered.length > INITIAL_COUNT && (
              <button
                id="show-more-btn"
                onClick={() => setShowAll(true)}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: '#141414',
                  border: '1.5px solid #2A2A2A',
                  borderRadius: '14px',
                  color: '#888',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#FF6B35';
                  e.currentTarget.style.color = '#FF6B35';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#2A2A2A';
                  e.currentTarget.style.color = '#888';
                }}
              >
                Show {filtered.length - INITIAL_COUNT} more recipes ↓
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState({ query, category }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 20px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#E8E0D8', marginBottom: '6px' }}>
        No recipes found
      </div>
      <div style={{ fontSize: '13px', color: '#555' }}>
        {query
          ? `Nothing matches "${query}". Try a different search.`
          : `No recipes in this category yet.`}
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

export default function DoneScreen({
  recipe,
  sessionDuration,
  isFavorite,
  onToggleFavorite,
  onHome,
  onRepeat,
}) {
  const canvasRef = useRef(null);

  // Confetti burst on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2 + 1.5,
      size: Math.random() * 6 + 3,
      color: ['#FF6B35', '#FF9B35', '#FFD700', '#4CAF50', '#2196F3', '#E91E63'][Math.floor(Math.random() * 6)],
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
    }));

    let raf;
    let active = true;
    const draw = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV; p.vy += 0.04;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const timeout = setTimeout(() => { active = false; }, 3000);
    return () => { active = false; cancelAnimationFrame(raf); clearTimeout(timeout); };
  }, []);

  if (!recipe) return null;

  const mins = sessionDuration ? Math.round(sessionDuration / 60) : null;

  return (
    <div
      id="done-screen"
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Glow backdrop */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '360px', width: '100%' }}>
        {/* Big emoji */}
        <div
          style={{
            fontSize: '72px',
            lineHeight: 1,
            marginBottom: '8px',
            animation: 'pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both',
          }}
        >
          {recipe.emoji || '🍽️'}
        </div>

        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '28px',
            fontWeight: '900',
            background: 'linear-gradient(90deg, #FF6B35, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '6px',
            letterSpacing: '-0.03em',
          }}
        >
          You did it! 🎉
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            color: '#888',
            marginBottom: '28px',
          }}
        >
          {recipe.name} is ready to serve.
        </p>

        {/* Stats row */}
        {(mins || recipe.steps?.length) && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '28px',
            }}
          >
            {mins && (
              <StatChip icon="⏱" label={`${mins} min`} sub="cooking time" />
            )}
            {recipe.steps?.length && (
              <StatChip icon="📋" label={`${recipe.steps.length} steps`} sub="completed" />
            )}
            {recipe.difficulty && (
              <StatChip
                icon={recipe.difficulty === 'easy' ? '⭐' : recipe.difficulty === 'medium' ? '⭐⭐' : '⭐⭐⭐'}
                label={recipe.difficulty}
                sub="difficulty"
              />
            )}
          </div>
        )}

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Favorite CTA */}
          <button
            id="done-fav-btn"
            onClick={() => onToggleFavorite(recipe.id)}
            style={{
              width: '100%',
              padding: '15px',
              background: isFavorite
                ? 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)'
                : 'linear-gradient(135deg, #1A1A1A 0%, #222 100%)',
              border: isFavorite ? 'none' : '1.5px solid #2A2A2A',
              borderRadius: '16px',
              color: isFavorite ? '#FFF' : '#888',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.01em',
            }}
          >
            {isFavorite ? '❤️ Saved to Favorites' : '🤍 Add to Favorites'}
          </button>

          {/* Cook again */}
          <button
            id="done-repeat-btn"
            onClick={onRepeat}
            style={{
              width: '100%',
              padding: '15px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF9B35 100%)',
              border: 'none',
              borderRadius: '16px',
              color: '#000',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: '800',
              cursor: 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            🔁 Cook Again
          </button>

          {/* Home */}
          <button
            id="done-home-btn"
            onClick={onHome}
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              border: '1.5px solid #1E1E1E',
              borderRadius: '16px',
              color: '#555',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#1E1E1E'; }}
          >
            ← Back to Recipes
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function StatChip({ icon, label, sub }) {
  return (
    <div
      style={{
        background: '#141414',
        border: '1.5px solid #1E1E1E',
        borderRadius: '14px',
        padding: '12px 16px',
        minWidth: '80px',
      }}
    >
      <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: '700',
          color: '#E8E0D8',
          textTransform: 'capitalize',
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#555' }}>{sub}</div>
    </div>
  );
}

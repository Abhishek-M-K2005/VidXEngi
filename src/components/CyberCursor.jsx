import React, { useEffect, useState, useRef } from 'react';

/**
 * CyberCursor - Sodium Monochromatic Display (589nm Amber Instrumentation)
 * Replaces high-saturation cyan/neon with a warm, authentic sodium-vapor / amber phosphor display.
 * Characteristics:
 * - Monochromatic sodium amber palette (#f59e0b, #fbbf24, #d97706, #fffbeb)
 * - Compact, low-glare instrument reticle (no oversized neon blur)
 * - Precision hardware crosshairs & tactile click ripples
 */
export const CyberCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState([]);
  const animRef = useRef(null);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if target or parent is interactive
      const target = e.target;
      const isInteractive = Boolean(
        target.closest('button, a, input, select, textarea, [role="button"], label, .interactive')
      );
      setIsHovered(isInteractive);

      // Update card-level CSS custom properties for spotlight effects (sodium tone)
      const card = target.closest('.spotlight-card');
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--card-mouse-x', `${x}%`);
        card.style.setProperty('--card-mouse-y', `${y}%`);
      }
    };

    const handleMouseDown = (e) => {
      setIsClicked(true);
      // Create quick sodium shockwave ripple
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      setRipples((prev) => [...prev.slice(-2), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 450);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isVisible]);

  // Tight, smooth interpolation for instrument reticle ring
  useEffect(() => {
    let currentX = pos.x;
    let currentY = pos.y;

    const followLoop = () => {
      currentX += (targetPos.x - currentX) * 0.4;
      currentY += (targetPos.y - currentY) * 0.4;
      setPos({ x: currentX, y: currentY });
      animRef.current = requestAnimationFrame(followLoop);
    };

    animRef.current = requestAnimationFrame(followLoop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetPos]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      
      {/* 1. Subtle Sodium Ambient Aura (Warm amber phosphor, not neon cyan) */}
      <div
        className="absolute rounded-full transition-opacity duration-300"
        style={{
          width: '160px',
          height: '160px',
          left: `${targetPos.x}px`,
          top: `${targetPos.y}px`,
          transform: 'translate(-50%, -50%)',
          background: isHovered
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.08) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.09) 0%, rgba(217, 119, 6, 0.04) 40%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      {/* 2. Sodium Vapor Click Pulse */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full border border-amber-400/80 animate-ping"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: '40px',
            height: '40px',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.6)'
          }}
        />
      ))}

      {/* 3. Sodium Instrument Reticle (Amber Phosphor CRT / Laser Gauging) */}
      <div
        className="absolute transition-transform duration-150 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicked ? 0.9 : isHovered ? 1.18 : 1}) rotate(${isHovered ? '45deg' : '0deg'})`,
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Subtle inner sodium phosphor glow */}
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="url(#sodium-inner-glow)"
          />

          {/* Primary Sodium Reticle Ring (589nm Warm Amber) */}
          <circle
            cx="20"
            cy="20"
            r="12"
            stroke="#f59e0b"
            strokeWidth="1.4"
            strokeOpacity="0.85"
            style={{
              filter: 'drop-shadow(0 0 3px rgba(245, 158, 11, 0.55))'
            }}
          />

          {/* 4 Precision Diagonal Sodium Ticks (45° angles) */}
          {/* Top-Right Tick */}
          <line
            x1="28.5"
            y1="11.5"
            x2="33.5"
            y2="6.5"
            stroke="#fbbf24"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.6))'
            }}
          />

          {/* Top-Left Tick */}
          <line
            x1="11.5"
            y1="11.5"
            x2="6.5"
            y2="6.5"
            stroke="#fbbf24"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.6))'
            }}
          />

          {/* Bottom-Left Tick */}
          <line
            x1="11.5"
            y1="28.5"
            x2="6.5"
            y2="33.5"
            stroke="#fbbf24"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.6))'
            }}
          />

          {/* Bottom-Right Tick */}
          <line
            x1="28.5"
            y1="28.5"
            x2="33.5"
            y2="33.5"
            stroke="#fbbf24"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.6))'
            }}
          />

          {/* Center Sodium Core Dot */}
          <circle
            cx="20"
            cy="20"
            r="2.2"
            fill="#fffbeb"
            style={{
              filter: 'drop-shadow(0 0 3px rgba(245, 158, 11, 0.9))'
            }}
          />

          <defs>
            <radialGradient
              id="sodium-inner-glow"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(20 20) rotate(90) scale(12)"
            >
              <stop stopColor="#f59e0b" stopOpacity="0.18" />
              <stop offset="0.75" stopColor="#d97706" stopOpacity="0.06" />
              <stop offset="1" stopColor="#b45309" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Instant Precision Tracker Pin (Fine sodium-white pinpoint) */}
      <div
        className="absolute w-1 h-1 rounded-full bg-[#fffbeb]"
        style={{
          left: `${targetPos.x}px`,
          top: `${targetPos.y}px`,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 4px rgba(245, 158, 11, 0.85)'
        }}
      />
    </div>
  );
};

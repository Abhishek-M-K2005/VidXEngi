import React, { useEffect, useState, useRef } from 'react';

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

      // Update card-level CSS custom properties for spotlight effects
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
      // Create shockwave ripple
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
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

  // Smooth lerp (linear interpolation) for cursor ring
  useEffect(() => {
    let currentX = pos.x;
    let currentY = pos.y;

    const followLoop = () => {
      currentX += (targetPos.x - currentX) * 0.35;
      currentY += (targetPos.y - currentY) * 0.35;
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
      {/* 1. Large Atmospheric Glow Aura (Deep Violet & Electric Cyan) matching user image */}
      <div
        className="absolute rounded-full transition-opacity duration-300"
        style={{
          width: '320px',
          height: '320px',
          left: `${targetPos.x}px`,
          top: `${targetPos.y}px`,
          transform: 'translate(-50%, -50%)',
          background: isHovered
            ? 'radial-gradient(circle, rgba(0, 240, 255, 0.22) 0%, rgba(157, 78, 221, 0.18) 35%, rgba(6, 12, 32, 0.08) 65%, transparent 80%)'
            : 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(157, 78, 221, 0.12) 35%, rgba(6, 12, 32, 0.05) 65%, transparent 80%)',
          filter: 'blur(20px)',
        }}
      />

      {/* 2. Click Shockwave Ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full border border-cyan-400 animate-ping opacity-75"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: '60px',
            height: '60px',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.8)'
          }}
        />
      ))}

      {/* 3. The Custom Tactical Cursor HUD Reticle (Exact replica of user reference) */}
      <div
        className="absolute transition-transform duration-150 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicked ? 0.88 : isHovered ? 1.25 : 1}) rotate(${isHovered ? '45deg' : '0deg'})`,
        }}
      >
        {/* SVG Tactical Reticle Ring & 4 Diagonal Amber Ticks */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Inner radial cyan gradient glow */}
          <circle
            cx="24"
            cy="24"
            r="16"
            fill="url(#inner-cyan-glow)"
          />

          {/* Cyan Circular Perimeter Ring */}
          <circle
            cx="24"
            cy="24"
            r="15"
            stroke="#00f0ff"
            strokeWidth="1.8"
            strokeOpacity="0.95"
            className="drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
          />

          {/* 4 Diagonal Amber/Orange Ticks at 45 degree angles (from user's image) */}
          {/* Top-Right Tick (45 deg) */}
          <line
            x1="35"
            y1="13"
            x2="41"
            y2="7"
            stroke="#ffb703"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="drop-shadow-[0_0_6px_rgba(255,183,3,0.8)]"
          />

          {/* Top-Left Tick (135 deg) */}
          <line
            x1="13"
            y1="13"
            x2="7"
            y2="7"
            stroke="#ffb703"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="drop-shadow-[0_0_6px_rgba(255,183,3,0.8)]"
          />

          {/* Bottom-Left Tick (225 deg) */}
          <line
            x1="13"
            y1="35"
            x2="7"
            y2="41"
            stroke="#ffb703"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="drop-shadow-[0_0_6px_rgba(255,183,3,0.8)]"
          />

          {/* Bottom-Right Tick (315 deg) */}
          <line
            x1="35"
            y1="35"
            x2="41"
            y2="41"
            stroke="#ffb703"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="drop-shadow-[0_0_6px_rgba(255,183,3,0.8)]"
          />

          {/* Center glowing white dot */}
          <circle
            cx="24"
            cy="24"
            r="3.2"
            fill="#ffffff"
            className="drop-shadow-[0_0_6px_#ffffff]"
          />

          <defs>
            <radialGradient
              id="inner-cyan-glow"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(24 24) rotate(90) scale(15)"
            >
              <stop stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="0.7" stopColor="#00f0ff" stopOpacity="0.1" />
              <stop offset="1" stopColor="#00f0ff" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Instant Precise Dot Tracker (at exact target coordinates for precision feel) */}
      <div
        className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#00f0ff]"
        style={{
          left: `${targetPos.x}px`,
          top: `${targetPos.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};

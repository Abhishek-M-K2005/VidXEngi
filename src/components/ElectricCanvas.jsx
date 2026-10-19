import React, { useEffect, useRef } from 'react';

export const ElectricCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let nodes = [];
    const initNodes = () => {
      nodes = [];
      const cols = Math.floor(width / 170) + 1;
      const rows = Math.floor(height / 170) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          nodes.push({
            x: i * 170 + Math.sin(j * 3 + i) * 25,
            y: j * 170 + Math.cos(i * 2 + j) * 25,
            connections: [],
            pulse: Math.random() * Math.PI * 2
          });
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180 && nodes[i].connections.length < 3) {
            nodes[i].connections.push(j);
          }
        }
      }
    };

    initNodes();

    // Floating subtle sparks in dark matte space
    const particles = [];
    const particleCount = 28;
    const colors = ['#00e5ff', '#ffffff', '#fbbf24', '#9ca3af'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.35 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let tick = 0;

    const render = () => {
      tick += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Matte circuit traces: neutral charcoal lines, not neon blue
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.pulse += 0.015;

        for (const targetIdx of node.connections) {
          const target = nodes[targetIdx];
          const distToMouse = mouse.active
            ? Math.hypot((node.x + target.x) / 2 - mouse.x, (node.y + target.y) / 2 - mouse.y)
            : 9999;

          const isNearMouse = distToMouse < 160;

          ctx.strokeStyle = isNearMouse ? 'rgba(0, 229, 255, 0.45)' : 'rgba(38, 41, 46, 0.5)';
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();

          // Sporadic spark
          const pulseOffset = (Math.sin(node.pulse + i) + 1) / 2;
          const px = node.x + (target.x - node.x) * pulseOffset;
          const py = node.y + (target.y - node.y) * pulseOffset;

          if (Math.sin(tick * 1.8 + i) > 0.75) {
            ctx.fillStyle = isNearMouse ? '#00e5ff' : 'rgba(255, 255, 255, 0.25)';
            ctx.beginPath();
            ctx.arc(px, py, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.fillStyle = 'rgba(45, 48, 54, 0.6)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mouse interactive circuit reaction (crisp, subtle)
      if (mouse.active) {
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.lineWidth = 1.1;

        for (const node of nodes) {
          const dist = Math.hypot(node.x - mouse.x, node.y - mouse.y);
          if (dist > 30 && dist < 120) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            const midX = (node.x + mouse.x) / 2 + (Math.random() - 0.5) * 8;
            const midY = (node.y + mouse.y) / 2 + (Math.random() - 0.5) * 8;
            ctx.lineTo(midX, midY);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ display: 'block' }}
    />
  );
};

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const isHovering = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<{x: number, y: number, life: number, maxLife: number}>>([]);

  useEffect(() => {
    let reqId: number;
    let lastX = 0;
    let lastY = 0;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
      
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 8) {
        // Spawn particle for the trail
        particles.current.push({ x: e.clientX, y: e.clientY, life: 20, maxLife: 20 });
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .magnetic')) {
        isHovering.current = true;
      } else {
        isHovering.current = false;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (canvas && ctx) {
      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      resize();
      
      const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i];
          p.life--;
          if (p.life <= 0) {
            particles.current.splice(i, 1);
            continue;
          }
          
          const size = (p.life / p.maxLife) * 3;
          const opacity = p.life / p.maxLife;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 204, ${opacity})`;
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#00ffcc';
          ctx.fill();
        }
        reqId = requestAnimationFrame(drawParticles);
      };
      drawParticles();
    }

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(reqId);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-[9998] pointer-events-none" />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#00ffcc] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#00ffcc] rounded-full pointer-events-none z-[9999] shadow-[0_0_10px_#00ffcc]"
        style={{ x: dotX, y: dotY }}
      />
    </>
  );
}

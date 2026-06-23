import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import { CustomCursor } from './components/CustomCursor';
import { SmartBinScene } from './components/SmartBinScene';

gsap.registerPlugin(ScrollTrigger);

// --- NEW AWWWARDS-LEVEL UPGRADES ---

// 1. Hover Sound Context
export const playHoverSound = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.02, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

// 2. Cinematic Film Grain
function FilmGrain() {
  return (
    <div className="fixed inset-0 z-[9990] pointer-events-none opacity-[0.06] mix-blend-overlay">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>
    </div>
  );
}

// 3. HUD Scroll Tracker
function HUDTracker() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div className="fixed bottom-8 right-8 z-[90] pointer-events-none hidden md:flex items-center justify-center">
      <motion.svg width="60" height="60" viewBox="0 0 100 100" style={{ rotate }}>
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <motion.circle 
          cx="50" cy="50" r="45" fill="none" stroke="#00ffcc" strokeWidth="2" 
          strokeDasharray="283" 
          strokeDashoffset={useTransform(scrollYProgress, [0, 1], [283, 0])} 
          strokeLinecap="round"
        />
      </motion.svg>
      <div className="absolute font-mono text-[10px] text-[#00ffcc] tracking-widest">SYS</div>
    </div>
  );
}

// 4. Magnetic Header Physics
function MagneticHeader({ children, className }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      // Subtle repulsion effect
      x.set(distanceX * -0.05);
      y.set(distanceY * -0.05);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- EXISTING COMPONENTS ---

function ScrollPath() {
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <motion.div 
      className="fixed top-0 left-4 md:left-12 w-px h-full bg-white/10 z-[15] pointer-events-none"
      style={{ opacity }}
    >
      <motion.div 
        className="w-full bg-gradient-to-b from-transparent via-[#00ffcc] to-[#00ffcc] origin-top"
        style={{ scaleY: scrollYProgress, height: '100%' }}
      />
      <motion.div
        className="absolute left-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#00ffcc] -translate-x-1/2 -translate-y-1/2"
        style={{ top: yPos }}
      >
        <div className="w-full h-full rounded-full bg-[#00ffcc] animate-ping opacity-50" />
      </motion.div>
    </motion.div>
  );
}

function ParticleBackground() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDB2NDBNNDAgMHY0ME0wIDBoNDBNMCA0MGg0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
      
      <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[10%] w-64 h-64 border border-[#00ffcc]/20 rounded-full animate-[spin_60s_linear_infinite]" />
      <motion.div style={{ y: y2 }} className="absolute top-[40%] right-[5%] w-96 h-96 border border-[#00ffcc]/10 rounded-full animate-[spin_90s_linear_infinite]" />
      <motion.div style={{ y: y3 }} className="absolute top-[70%] left-[20%] w-48 h-48 border border-white/10 rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]" />
      <motion.div style={{ y: y2 }} className="absolute top-[150%] left-[70%] w-[500px] h-[500px] border border-[#00ffcc]/5 rounded-full" />
      
      <motion.div style={{ y: y1 }} className="absolute top-[80%] right-[20%] text-[#00ffcc]/30 font-mono text-4xl animate-pulse">+</motion.div>
      <motion.div style={{ y: y2 }} className="absolute top-[20%] left-[80%] text-[#00ffcc]/30 font-mono text-4xl animate-pulse">+</motion.div>
      <motion.div style={{ y: y3 }} className="absolute top-[50%] right-[5%] text-[#00ffcc]/30 font-mono text-4xl animate-pulse">+</motion.div>
      <motion.div style={{ y: y1 }} className="absolute top-[120%] left-[15%] text-white/30 font-mono text-4xl animate-pulse">+</motion.div>
    </div>
  );
}

function FloatingWidget({ title, value, className = "", delay = 0, yOffset = -50 }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [yOffset, -yOffset]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={playHoverSound}
      className={`absolute z-10 pointer-events-auto liquid-glass p-4 rounded-2xl border border-white/5 shadow-[0_0_30px_rgba(0,255,204,0.05)] backdrop-blur-xl flex flex-col gap-1 hover:border-[#00ffcc]/30 transition-colors duration-300 cursor-default ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 1, delay }}
      style={{ y: yParallax }}
    >
      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono flex items-center gap-2">
        <span className="w-1 h-1 bg-[#00ffcc] rounded-full animate-pulse"></span>
        {title}
      </span>
      <span className="text-lg font-mono text-white tracking-wide">{value}</span>
    </motion.div>
  );
}

function StaggeredReveal({ children, className = "" }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-15%" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.2 }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealItem({ children, className = "" }: any) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loader
    const timer = setTimeout(() => setLoading(false), 1500);

    // Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <>
      <FilmGrain />
      <CustomCursor />
      <HUDTracker />
      <ScrollPath />
      <ParticleBackground />

      {/* Cinematic Loading Screen */}
      <motion.div 
        className="fixed inset-0 z-[1000] bg-black flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 1 : 0, pointerEvents: loading ? 'auto' : 'none' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center">
           <motion.div className="w-12 h-12 border-t-2 border-[#00ffcc] rounded-full animate-spin mb-8" />
           <div className="text-[#00ffcc] tracking-[0.4em] font-mono text-sm uppercase">Optimizing Cinematic Assets</div>
        </div>
      </motion.div>

      <div className="relative w-full bg-black text-white font-sans selection:bg-[#00ffcc]/30">
        
        {/* Fixed 3D Scene Layer */}
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-black">
          <SmartBinScene />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_90%)] pointer-events-none"></div>
        </div>

        {/* Scrolling Chapters Layer */}
        <div id="scroll-trigger" className="h-[800vh]">
          <div id="scroll-story" className="relative z-20 w-full flex flex-col pt-[30vh] pb-[20vh] gap-[40vh] overflow-hidden">
            
            {/* Chapter 1: The Hook */}
            <div className="min-h-screen flex items-center justify-center text-center px-4 relative">
              <StaggeredReveal>
                <RevealItem>
                  <MagneticHeader>
                    <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] inline-block">Waste.</h1>
                  </MagneticHeader>
                </RevealItem>
                <RevealItem>
                  <MagneticHeader>
                    <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] to-blue-500 drop-shadow-2xl inline-block">Reimagined.</h1>
                  </MagneticHeader>
                </RevealItem>
              </StaggeredReveal>
            </div>
            
            {/* Chapter 2: The Problem */}
            <div className="min-h-[80vh] flex items-center justify-start px-12 md:px-32 relative">
              <StaggeredReveal className="liquid-glass p-8 md:p-12 rounded-3xl max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <RevealItem><div className="text-[#00ffcc] font-mono text-sm tracking-widest mb-4 uppercase">The Crisis</div></RevealItem>
                <RevealItem><h2 className="text-5xl md:text-6xl font-medium mb-4 leading-tight">2 Billion Tons.</h2></RevealItem>
                <RevealItem><p className="text-gray-400 text-xl leading-relaxed font-light">Humanity's annual waste. Less than 10% is recycled. The system is broken.</p></RevealItem>
              </StaggeredReveal>
            </div>

            {/* Chapter 3: The Bottleneck */}
            <div className="min-h-[80vh] flex items-center justify-end px-12 md:px-32 relative">
              <StaggeredReveal className="liquid-glass p-8 md:p-12 rounded-3xl max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <RevealItem><div className="text-[#00ffcc] font-mono text-sm tracking-widest mb-4 uppercase">The Bottleneck</div></RevealItem>
                <RevealItem><h2 className="text-5xl md:text-6xl font-medium mb-4 leading-tight">Contamination.</h2></RevealItem>
                <RevealItem><p className="text-gray-400 text-xl leading-relaxed font-light">A single unwashed bottle ruins an entire batch. Solving waste starts at the source.</p></RevealItem>
              </StaggeredReveal>
            </div>

          {/* Chapter 4: The Reveal */}
          <div className="min-h-[80vh] flex items-center justify-center px-4 text-center relative">
            <StaggeredReveal>
              <RevealItem><h2 className="text-3xl md:text-4xl font-light text-gray-400 mb-4 tracking-wide">We didn't need another plastic bin.</h2></RevealItem>
              <RevealItem>
                <MagneticHeader>
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tighter inline-block">We needed a <span className="text-[#00ffcc] drop-shadow-[0_0_20px_rgba(0,255,204,0.4)]">Revolution.</span></h2>
                </MagneticHeader>
              </RevealItem>
            </StaggeredReveal>
          </div>

          {/* Chapter 5: The Hardware */}
          <div className="min-h-[80vh] flex items-center justify-start px-12 md:px-32 relative">
            <StaggeredReveal className="liquid-glass p-8 md:p-12 rounded-[2rem] max-w-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <RevealItem><div className="text-[#00ffcc] font-mono text-sm tracking-widest mb-4 uppercase">The Hardware</div></RevealItem>
              <RevealItem><h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight">The GreenGram Smart Bin.</h2></RevealItem>
              <RevealItem><p className="text-gray-300 text-lg leading-relaxed mb-6">Premium matte-black finishes. Soft-glow LED indicators. But the true beauty is inside: an intelligent, automated dual-chamber system that permanently separates wet organics from dry recyclables.</p></RevealItem>
              <RevealItem>
                <div className="flex gap-4 items-center" onMouseEnter={playHoverSound}>
                  <div className="w-12 h-1 bg-[#00ffcc]/50 shadow-[0_0_10px_#00ffcc] rounded-full"></div>
                  <span className="text-sm tracking-widest font-mono uppercase text-white">Zero Contamination</span>
                </div>
              </RevealItem>
            </StaggeredReveal>

            <FloatingWidget title="Material" value="Brushed Aluminum" className="-top-24 right-[10%] md:right-[20%]" delay={0.5} yOffset={60} />
            <FloatingWidget title="Lid Actuation" value="0.4s Response" className="bottom-12 left-[50%] md:left-[60%]" delay={0.2} yOffset={-40} />
          </div>

          {/* Chapter 6: The Software */}
          <div className="min-h-[80vh] flex items-center justify-center pt-24 relative">
            <StaggeredReveal className="text-center liquid-glass p-12 md:p-16 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl border border-[#00ffcc]/20 mx-4">
              <RevealItem><h2 className="text-5xl md:text-6xl font-medium mb-6">AI-Powered Measurement.</h2></RevealItem>
              <RevealItem><p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8">Internal ultrasonic sensors map the topography of your waste in real-time, transmitting gigabytes of telemetry to the cloud daily.</p></RevealItem>
              <RevealItem>
                <div className="inline-block bg-black/80 px-6 py-3 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,255,204,0.1)]" onMouseEnter={playHoverSound}>
                  <span className="text-[#00ffcc] tracking-[0.4em] font-mono text-sm drop-shadow-[0_0_8px_rgba(0,255,204,0.8)] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse"></div>SENSORS ACTIVE
                  </span>
                </div>
              </RevealItem>
            </StaggeredReveal>
            
            <FloatingWidget title="Ping Rate" value="12ms" className="top-0 left-[10%] md:left-[20%]" delay={0.3} yOffset={150} />
            <FloatingWidget title="Data Upload" value="1.2 GB/Day" className="bottom-10 right-[10%] md:right-[20%]" delay={0.6} yOffset={-90} />
            <FloatingWidget title="System Status" value="ONLINE" className="top-12 left-[5%] md:left-[10%]" delay={0.1} yOffset={80} />
            <FloatingWidget title="Telemetry" value="ACTIVE" className="bottom-12 right-[5%] md:right-[10%]" delay={0.4} yOffset={-80} />
          </div>

          {/* Chapter 7: The Reward */}
          <div className="min-h-[80vh] flex items-center justify-end px-12 md:px-32 relative">
            <StaggeredReveal className="liquid-glass p-8 md:p-12 rounded-[2rem] w-full max-w-lg flex flex-col gap-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <RevealItem><div className="text-[#00ffcc] font-mono text-sm tracking-widest uppercase">The Incentive</div></RevealItem>
              <RevealItem><h2 className="text-4xl font-medium leading-tight">Earn While You Impact.</h2></RevealItem>
              <RevealItem>
                <div className="bg-black/80 border border-white/10 rounded-3xl p-8 shadow-inner relative overflow-hidden group hover:border-[#00ffcc]/30 transition-all duration-300" onMouseEnter={playHoverSound}>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ffcc]/10 blur-[50px] rounded-full group-hover:bg-[#00ffcc]/20 transition-all duration-700"></div>
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <span className="text-gray-400 text-sm font-medium tracking-widest uppercase">App Dashboard</span>
                    <span className="text-[#00ffcc] text-sm flex items-center gap-2 font-mono"><div className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse shadow-[0_0_10px_#00ffcc]"></div> LIVE</span>
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div>
                      <div className="flex justify-between text-sm mb-3"><span className="text-gray-300">Tokens Earned</span><span className="text-[#00ffcc] font-mono font-bold text-2xl drop-shadow-[0_0_10px_rgba(0,255,204,0.5)]">+450 🪙</span></div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-end">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Total CO₂ Diverted</div>
                        <div className="text-4xl font-light">12.4 <span className="text-lg">kg</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealItem>
            </StaggeredReveal>

            <FloatingWidget title="Blockchain Tx" value="0x8F2...A1B" className="-top-12 left-[10%] md:left-[30%]" delay={0.6} yOffset={-100} />
          </div>

          {/* Chapter 8: City Scale */}
          <div className="min-h-[80vh] flex flex-col items-center justify-center relative">
            <StaggeredReveal className="text-center w-full">
              <RevealItem>
                <MagneticHeader>
                  <h2 className="text-6xl md:text-[8rem] font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 px-4 inline-block">One Bin.<br />One City.</h2>
                </MagneticHeader>
              </RevealItem>
              <RevealItem><p className="text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed px-6">Scaling effortlessly from a single household to an interconnected municipal network. True circular economy powered by data.</p></RevealItem>
            </StaggeredReveal>
            
            <FloatingWidget title="Active Nodes" value="14,024" className="-top-32 right-[20%]" delay={0.1} yOffset={80} />
            <FloatingWidget title="Network Health" value="100%" className="bottom-0 left-[20%]" delay={0.4} yOffset={-80} />
          </div>
          
          {/* Chapter 9: Call to Action */}
          <div className="min-h-[90vh] flex flex-col items-center justify-center bg-black/60 backdrop-blur-3xl border-t border-[#00ffcc]/10 rounded-t-[4rem] mt-[10vh] relative z-30 shadow-[0_-20px_50px_rgba(0,255,204,0.05)]">
            <StaggeredReveal className="flex flex-col items-center px-4">
              <RevealItem>
                <MagneticHeader>
                  <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter mb-6 text-white drop-shadow-[0_0_50px_rgba(0,255,204,0.2)] inline-block">GreenGram</h1>
                </MagneticHeader>
              </RevealItem>
              <RevealItem><p className="text-xl md:text-2xl text-[#00ffcc] tracking-[0.4em] font-mono uppercase text-center max-w-2xl mb-16 drop-shadow-[0_0_10px_rgba(0,255,204,0.5)]">Intelligence For The Future</p></RevealItem>
              <RevealItem>
                <div className="flex flex-col sm:flex-row gap-8 pointer-events-auto">
                  <a href="https://greengram.web.app" target="_blank" rel="noopener noreferrer" onMouseEnter={playHoverSound} className="magnetic px-10 py-5 bg-white text-black rounded-full font-bold tracking-wide hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] text-center">
                    Explore The App
                  </a>
                  <button onMouseEnter={playHoverSound} className="magnetic px-10 py-5 liquid-glass text-white rounded-full font-bold tracking-wide hover:scale-110 transition-all duration-300">
                    Join The Pilot
                  </button>
                </div>
              </RevealItem>
            </StaggeredReveal>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

export default App;

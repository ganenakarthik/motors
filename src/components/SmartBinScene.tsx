import { Canvas, useFrame } from '@react-three/fiber';
import { SmartBin } from './SmartBin';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SceneContentProps {
  scrollProgressRef: React.RefObject<number>;
}

function SceneContent({ scrollProgressRef }: SceneContentProps) {
  const binRef = useRef<THREE.Group>(null);
  
  // Local references to track smooth interpolation across frames
  const currentPos = useRef(new THREE.Vector3(0, -0.5, 0.5));
  const currentRot = useRef(new THREE.Euler(0, -Math.PI / 6, 0));
  const currentScale = useRef(new THREE.Vector3(1.3, 1.3, 1.3));
  const currentLid = useRef(0);

  useFrame(() => {
    if (!binRef.current) return;

    const p = scrollProgressRef.current ?? 0;

    // Define target parameters
    const targetPos = new THREE.Vector3(0, -0.5, 0.5);
    const targetRot = new THREE.Euler(0, -Math.PI / 6, 0);
    const targetScale = new THREE.Vector3(1.3, 1.3, 1.3);
    let targetLid = 0;

    // Phase checkpoints based on scrollProgress (0 to 1)
    if (p <= 0.15) {
      // Phase 1: Hero (Center, giant, slightly rotated, closed)
      const t = p / 0.15;
      targetPos.set(0, -0.5, 0.5);
      targetRot.set(0, -Math.PI / 6 + t * (Math.PI / 6), 0);
      targetScale.set(1.3, 1.3, 1.3);
      targetLid = 0;
    } else if (p <= 0.32) {
      // Phase 2: The Crisis (Slide right, scale down slightly for text on the left)
      const t = (p - 0.15) / 0.17;
      const startPos = new THREE.Vector3(0, -0.5, 0.5);
      const endPos = new THREE.Vector3(0.9, -0.6, 0.2);
      targetPos.lerpVectors(startPos, endPos, t);
      
      targetRot.set(0, t * (Math.PI / 6), 0);
      
      const startScale = new THREE.Vector3(1.3, 1.3, 1.3);
      const endScale = new THREE.Vector3(0.95, 0.95, 0.95);
      targetScale.lerpVectors(startScale, endScale, t);
      targetLid = 0;
    } else if (p <= 0.48) {
      // Phase 3: The Bottleneck (Slide left for text on the right)
      const t = (p - 0.32) / 0.16;
      const startPos = new THREE.Vector3(0.9, -0.6, 0.2);
      const endPos = new THREE.Vector3(-0.9, -0.6, 0.2);
      targetPos.lerpVectors(startPos, endPos, t);
      
      targetRot.set(0, Math.PI / 6 - t * (Math.PI / 3), 0);
      
      targetScale.set(0.95, 0.95, 0.95);
      targetLid = 0;
    } else if (p <= 0.64) {
      // Phase 4: The Hardware / Reveal (Center and open lids)
      const t = (p - 0.48) / 0.16;
      const startPos = new THREE.Vector3(-0.9, -0.6, 0.2);
      const endPos = new THREE.Vector3(0, -0.5, 0.3);
      targetPos.lerpVectors(startPos, endPos, t);
      
      targetRot.set(0, -Math.PI / 6 + t * (Math.PI / 6), 0);
      
      const startScale = new THREE.Vector3(0.95, 0.95, 0.95);
      const endScale = new THREE.Vector3(1.2, 1.2, 1.2);
      targetScale.lerpVectors(startScale, endScale, t);
      
      targetLid = t; // Open lid
    } else if (p <= 0.78) {
      // Phase 5: Software & Sensors (Tilt forward & zoom in to show interior/sensors)
      const t = (p - 0.64) / 0.14;
      const startPos = new THREE.Vector3(0, -0.5, 0.3);
      const endPos = new THREE.Vector3(0, -1.1, 1.4);
      targetPos.lerpVectors(startPos, endPos, t);
      
      targetRot.set(t * (Math.PI / 4.5), 0, 0); // Tilt forward
      
      const startScale = new THREE.Vector3(1.2, 1.2, 1.2);
      const endScale = new THREE.Vector3(1.4, 1.4, 1.4);
      targetScale.lerpVectors(startScale, endScale, t);
      
      targetLid = 1.0; // Keep open
    } else if (p <= 0.88) {
      // Phase 6: Reward / Dashboard (Slide left, close lid)
      const t = (p - 0.78) / 0.10;
      const startPos = new THREE.Vector3(0, -1.1, 1.4);
      const endPos = new THREE.Vector3(-0.9, -0.6, 0.4);
      targetPos.lerpVectors(startPos, endPos, t);
      
      targetRot.set(Math.PI / 4.5 - t * (Math.PI / 4.5), t * (Math.PI / 6), 0);
      
      const startScale = new THREE.Vector3(1.4, 1.4, 1.4);
      const endScale = new THREE.Vector3(0.9, 0.9, 0.9);
      targetScale.lerpVectors(startScale, endScale, t);
      
      targetLid = 1.0 - t; // Close lid
    } else if (p <= 0.94) {
      // Phase 7: City Scale (Shrink to background/distance)
      const t = (p - 0.88) / 0.06;
      const startPos = new THREE.Vector3(-0.9, -0.6, 0.4);
      const endPos = new THREE.Vector3(0, -0.2, -2.2);
      targetPos.lerpVectors(startPos, endPos, t);
      
      targetRot.set(0, Math.PI / 6 + t * (Math.PI * 0.8), 0);
      
      const startScale = new THREE.Vector3(0.9, 0.9, 0.9);
      const endScale = new THREE.Vector3(0.4, 0.4, 0.4);
      targetScale.lerpVectors(startScale, endScale, t);
      
      targetLid = 0;
    } else {
      // Phase 8: CTA Backdrop (Majestic size in background center, slowly rotating)
      const t = (p - 0.94) / 0.06;
      const startPos = new THREE.Vector3(0, -0.2, -2.2);
      const endPos = new THREE.Vector3(0, -0.5, -0.8);
      targetPos.lerpVectors(startPos, endPos, t);
      
      targetRot.set(0, Math.PI / 6 + Math.PI * 0.8 + t * (Math.PI * 0.2), 0);
      
      const startScale = new THREE.Vector3(0.4, 0.4, 0.4);
      const endScale = new THREE.Vector3(0.85, 0.85, 0.85);
      targetScale.lerpVectors(startScale, endScale, t);
      
      targetLid = 0;
    }

    // Apply smooth interpolation (lerping)
    currentPos.current.lerp(targetPos, 0.08);
    currentRot.current.x = THREE.MathUtils.lerp(currentRot.current.x, targetRot.x, 0.08);
    currentRot.current.y = THREE.MathUtils.lerp(currentRot.current.y, targetRot.y, 0.08);
    currentRot.current.z = THREE.MathUtils.lerp(currentRot.current.z, targetRot.z, 0.08);
    currentScale.current.lerp(targetScale, 0.08);
    currentLid.current = THREE.MathUtils.lerp(currentLid.current, targetLid, 0.08);

    // Apply properties to the Three.js group
    binRef.current.position.copy(currentPos.current);
    binRef.current.rotation.set(currentRot.current.x, currentRot.current.y, currentRot.current.z);
    binRef.current.scale.copy(currentScale.current);
  });

  return (
    <group ref={binRef}>
      <SmartBin lidOpen={currentLid.current} showLabels={false} />
    </group>
  );
}

export function SmartBinScene() {
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      scrollProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial sync
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        style={{ pointerEvents: 'none', background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.1} />
        
        {/* Strong Key Light for Dramatic Shadow Details */}
        <directionalLight position={[5, 8, 4]} intensity={4.5} />
        
        {/* High-contrast rim lights */}
        <spotLight 
          position={[-6, 5, -5]} 
          intensity={8.0} 
          angle={Math.PI / 4} 
          penumbra={1} 
          color="#00ffcc" 
        />
        <spotLight 
          position={[6, 5, -5]} 
          intensity={4.0} 
          angle={Math.PI / 4} 
          penumbra={1} 
          color="#0055ff" 
        />

        {/* Soft Front Highlight */}
        <pointLight position={[0, 0.5, 2.5]} intensity={1.5} distance={6} color="#00ffcc" />

        <SceneContent scrollProgressRef={scrollProgressRef} />

        {/* Postprocessing Bloom */}
        <EffectComposer>
          <Bloom 
            intensity={1.5} 
            luminanceThreshold={0.15} 
            luminanceSmoothing={0.9} 
            mipmapBlur 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

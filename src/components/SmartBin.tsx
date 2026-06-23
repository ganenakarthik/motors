import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, MeshTransmissionMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

export function SmartBin({ lidOpen = 0, showLabels = false }) {
  const binGroup = useRef<THREE.Group>(null);
  const leftLid = useRef<THREE.Mesh>(null);
  const rightLid = useRef<THREE.Mesh>(null);
  const ledMaterial = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (leftLid.current && rightLid.current) {
      leftLid.current.rotation.z = THREE.MathUtils.lerp(leftLid.current.rotation.z, lidOpen * (Math.PI / 3), 0.1);
      rightLid.current.rotation.z = THREE.MathUtils.lerp(rightLid.current.rotation.z, -lidOpen * (Math.PI / 3), 0.1);
    }
    
    if (ledMaterial.current) {
      const pulse = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2;
      ledMaterial.current.emissiveIntensity = 2 + pulse * 2;
    }
  });

  const bodyMaterial = <meshPhysicalMaterial color="#0a0a0a" metalness={0.9} roughness={0.3} clearcoat={1} clearcoatRoughness={0.2} />;
  const glassMaterial = <MeshTransmissionMaterial thickness={0.5} roughness={0.1} transmission={1} ior={1.5} color="#222222" />;
  const ledColor = new THREE.Color("#00ffcc");

  return (
    <group ref={binGroup} position={[0, -1, 0]}>
      {/* Main Body */}
      <RoundedBox args={[1.6, 2.4, 1.2]} radius={0.1} smoothness={4} position={[0, 1.2, 0]} castShadow receiveShadow>
        {bodyMaterial}
      </RoundedBox>

      {/* Silver Accent Band */}
      <RoundedBox args={[1.62, 0.1, 1.22]} radius={0.02} smoothness={4} position={[0, 2.0, 0]}>
        <meshPhysicalMaterial color="#cccccc" metalness={1} roughness={0.4} />
      </RoundedBox>

      {/* Front Glass Panel / QR Area */}
      <RoundedBox args={[1.0, 1.2, 0.05]} radius={0.05} smoothness={4} position={[0, 1.0, 0.61]}>
        {glassMaterial}
      </RoundedBox>
      
      {/* LED Strip */}
      <mesh position={[0, 2.0, 0.615]}>
        <planeGeometry args={[1.2, 0.02]} />
        <meshStandardMaterial ref={ledMaterial} color={ledColor} emissive={ledColor} emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Split Lids */}
      <group position={[-0.8, 2.4, 0]}>
        <mesh ref={leftLid} position={[0.4, 0.05, 0]} castShadow>
          <boxGeometry args={[0.78, 0.1, 1.18]} />
          {bodyMaterial}
        </mesh>
      </group>
      <group position={[0.8, 2.4, 0]}>
        <mesh ref={rightLid} position={[-0.4, 0.05, 0]} castShadow>
          <boxGeometry args={[0.78, 0.1, 1.18]} />
          {bodyMaterial}
        </mesh>
      </group>

      {/* Inner compartments */}
      <mesh position={[-0.4, 2.3, 0]}>
        <boxGeometry args={[0.7, 0.1, 1.0]} />
        <meshStandardMaterial color="#111111" emissive="#003300" emissiveIntensity={lidOpen * 2} />
      </mesh>
      <mesh position={[0.4, 2.3, 0]}>
        <boxGeometry args={[0.7, 0.1, 1.0]} />
        <meshStandardMaterial color="#111111" emissive="#001144" emissiveIntensity={lidOpen * 2} />
      </mesh>

      {/* HTML Labels */}
      {showLabels && (
        <>
          <Html position={[-0.8, 2.8, 0]} center zIndexRange={[100, 0]}>
            <div className={`transition-opacity duration-1000 ${lidOpen > 0.5 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-black/80 text-white px-4 py-2 rounded-lg border border-white/20 backdrop-blur-md text-sm whitespace-nowrap shadow-xl">
                Wet Segregation
              </div>
            </div>
          </Html>
          <Html position={[0.8, 2.8, 0]} center zIndexRange={[100, 0]}>
            <div className={`transition-opacity duration-1000 ${lidOpen > 0.5 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-black/80 text-white px-4 py-2 rounded-lg border border-white/20 backdrop-blur-md text-sm whitespace-nowrap shadow-xl">
                Dry Segregation
              </div>
            </div>
          </Html>
          <Html position={[0, 1.0, 0.7]} center zIndexRange={[100, 0]}>
             <div className={`transition-opacity duration-1000 ${lidOpen > 0.5 ? 'opacity-100' : 'opacity-0'}`}>
               <div className="bg-black/60 text-[#00ffcc] px-3 py-1 rounded border border-[#00ffcc]/30 backdrop-blur-md text-xs tracking-widest font-mono shadow-[0_0_15px_rgba(0,255,204,0.3)]">
                QR AUTH
              </div>
             </div>
          </Html>
        </>
      )}
    </group>
  );
}

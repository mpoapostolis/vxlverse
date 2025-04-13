import { useEffect, useState, forwardRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface PaintingProps {
  imageUrl: string;
  position: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
  width?: number;
  height?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const Painting = forwardRef<THREE.Group, PaintingProps>(
  (
    {
      imageUrl,
      position,
      rotation = new THREE.Euler(0, 0, 0),
      scale = new THREE.Vector3(1, 1, 1),
      width = 10,
      height = 10,
      isSelected = false,
      onClick,
    },
    ref
  ) => {
    // Load the texture
    const texture = useTexture(imageUrl);
    const [hovered, setHovered] = useState(false);
    const aspectRatio = texture.image.width / texture.image.height;

    // Set texture properties
    useEffect(() => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
      }
    }, [texture]);

    // Calculate frame dimensions (slightly larger than the painting)
    const frameWidth = width + 0.1;
    const frameHeight = height + 0.1;

    // Border padding size (as a percentage of the painting size)
    const borderPadding = 0.05; // 5% padding

    return (
      <group
        position={position}
        rotation={rotation as unknown as THREE.Euler}
        scale={scale as unknown as THREE.Vector3}
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        ref={ref}
      >
        {/* Border/frame mesh (slightly larger and positioned behind) */}
        <mesh position={[0, 0, -0]}>
          <boxGeometry
            args={[10 * aspectRatio * (1 + borderPadding), 10 * (1 + borderPadding), 0.05]}
          />
          <meshStandardMaterial color={"#444"} roughness={0.7} />
        </mesh>

        {/* Canvas/Painting */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[10 * aspectRatio, 10, 0.1]} />
          <meshStandardMaterial
            map={texture}
            emissive="#ffffff"
            emissiveIntensity={0.1}
            emissiveMap={texture}
          />
        </mesh>

        {/* Selection indicator */}
        {isSelected && (
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[frameWidth + 0.05, frameHeight + 0.05, 0.01]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
          </mesh>
        )}
      </group>
    );
  }
);

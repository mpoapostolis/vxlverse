import { Box, useGLTF, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import { useEditorStore } from "../../stores/editorStore";
import * as THREE from "three";
import { GameObject } from "../../types";

function Paint() {
  const texture = useTexture("/textures/canvas.png");

  // Wait until the texture's image is loaded
  if (!texture.image) {
    return null;
  }

  // Compute the aspect ratio (width / height)
  const aspectRatio = texture.image.width / texture.image.height;

  // Border padding size (as a percentage of the painting size)
  const borderPadding = 0.05; // 5% padding

  return (
    <group>
      {/* Border/frame mesh (slightly larger and positioned behind) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry
          args={[10 * aspectRatio * (1 + borderPadding), 10 * (1 + borderPadding), 0.05]}
        />
        <meshStandardMaterial color={"#444"} roughness={0.7} />
      </mesh>

      {/* Main painting mesh */}
      <mesh position={[0, 0, 0]}>
        {/* Optionally, use the aspect ratio to adjust geometry */}
        <boxGeometry args={[10 * aspectRatio, 10, 0.1]} />
        <meshStandardMaterial map={texture} color={"#bbb"} emissive={"#303030"} />
      </mesh>
    </group>
  );
}

export function PhysicsArea() {
  const { scene } = useGLTF("/models/artgallery.glb", true);
  const galleryRef = useRef<THREE.Group>(null);
  const paintingRef = useRef<THREE.Group>(null);

  const { scenes, currentSceneId, addObject, selectedObjectId, gridSnap, brushActive } =
    useEditorStore();
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.position.set(0, 0, 0);
      galleryRef.current.scale.set(1, 1, 1);

      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [clonedScene]);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!paintingRef.current) return;
    const [first] = event.intersections;
    if (!first) return;
    const normal = first.face?.normal;
    const position = first.point;
    if (!normal || !position) return;

    position.add(normal);

    if (gridSnap) {
      position.set(Math.round(position.x), Math.round(position.y), Math.round(position.z));
    }

    paintingRef.current.position.copy(position);

    if (Math.abs(normal.y) > 0.9) {
      paintingRef.current.rotation.set(0, 0, 0);
    } else {
      const lookAtPos = position.clone().sub(normal);
      lookAtPos.y = position.y;
      paintingRef.current.lookAt(lookAtPos);
      paintingRef.current.rotation.x = 0;
      paintingRef.current.rotation.z = 0;
    }
  };

  const addPainting = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!paintingRef.current) return;
    if (!brushActive) return;

    const id = new THREE.Object3D().uuid;

    // Create plain JavaScript objects with x, y, z properties
    // This ensures we're not passing references to THREE objects
    const position = {
      x: paintingRef.current.position.x,
      y: paintingRef.current.position.y,
      z: paintingRef.current.position.z,
    };

    const rotation = {
      x: paintingRef.current.rotation.x,
      y: paintingRef.current.rotation.y,
      z: paintingRef.current.rotation.z,
    };

    const scale = {
      x: 1,
      y: 1,
      z: 1,
    };

    const newPainting = {
      id,
      type: "painting",
      position,
      rotation,
      scale,
      name: `Painting placeholder`,
      imageUrl: "/textures/canvas.png",
    } as GameObject;

    if (!currentSceneId) return;
    addObject(currentSceneId, newPainting);

    console.log("Added new painting:", newPainting);
  };

  return (
    <>
      {brushActive && (
        <group ref={paintingRef}>
          <Paint />
        </group>
      )}
      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[28.074240273245735, 10.320066228859993, -50.53513854087428]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 19.967514259002275, 138.31675726719357]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-28.099190510049553, 10.320066228859993, -50.53513854087428]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 19.967514259002275, 138.31675726719357]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-30.673658891111664, 11.924236094015406, 63.20601066471109]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 23.235346438996714, 91.05860062666117]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[30.573658891111664, 11.924236094015406, 63.20601066471109]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 23.235346438996714, 91.05860062666117]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-0.39954031579897986, 12.809816915989206, 108.43256308749729]}
        rotation={[0, 0, 0]}
        scale={[60.5779367504754, 21.781123064288085, 1.4396012563922178]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[0.39954031579897986, 10.119850165385632, -119.93882746000172]}
        rotation={[0, 0, 0]}
        scale={[60.5779367504754, 21.781123064288085, 1.4396012563922178]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[20.660679450910656, 8.526142687932246, -30.75974006989552]}
        rotation={[0, 0, 0]}
        scale={[17.751554863310194, 14.003651999383852, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-21.753696967218218, 8.526142687932246, -30.75974006989552]}
        rotation={[0, 0, 0]}
        scale={[17.751554863310194, 14.003651999383852, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-18.186416420525397, 8.526142687932246, 18.012148880007576]}
        rotation={[0, 0, 0]}
        scale={[21.496307677764424, 22.826380486218813, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[18.022778670184913, 8.526142687932246, 18.012148880007576]}
        rotation={[0, 0, 0]}
        scale={[21.496307677764424, 22.826380486218813, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-0.3178609843752156, 8.673026543030618, -74.29217556618775]}
        rotation={[0, 0, 0]}
        scale={[23.667055730843213, 13.126795246184962, 0.8699142340470483]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>
    </>
  );
}

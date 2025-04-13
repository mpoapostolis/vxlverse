import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls, Environment } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { Perf } from "r3f-perf";
import { EditorHeader } from "../components/editor/EditorHeader";
import { GalleryPropertiesPanel } from "../components/gallery/GalleryPropertiesPanel";
import { ArtEditor } from "../components/gallery/Editor";
import { SEO } from "../components/shared/SEO";
import { ContentModerationAlert } from "../components/legal/ContentModerationAlert";
import { Toolbar } from "../components/editor/Toolbar";
import { KEYBOARD_MAP } from "./Editor";
import { useEditorStore } from "../stores/editorStore";
import * as THREE from "three";
import gsap from "gsap";

export function ArtGallery() {
  const { createNewScene } = useEditorStore();
  const ref = useRef<boolean>(false);
  useEffect(() => {
    if (!ref.current) {
      createNewScene("Art Gallery");
      ref.current = true;
    }
  }, []);
  return (
    <KeyboardControls map={KEYBOARD_MAP}>
      <_ArtGallery />
    </KeyboardControls>
  );
}

export function _ArtGallery() {
  const [showMetrics, setShowMetrics] = useState(false);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");
  const [showModerationAlert, setShowModerationAlert] = useState(false);
  const [moderationMessage] = useState("");
  const orbitControlsRef = useRef<any>(null);

  // Get selected object from store
  const { selectedObjectId, scenes, currentSceneId } = useEditorStore();

  // Effect to handle keyboard shortcuts
  useEffect(() => {
    // Function to focus on selected object with smooth animation
    const focusOnSelectedObject = () => {
      if (!selectedObjectId || !orbitControlsRef.current || !currentSceneId) return;

      // Find the selected object in the current scene
      const currentScene = scenes.find((scene) => scene.id === currentSceneId);
      if (!currentScene) return;

      const selectedObject = currentScene.objects.find((obj) => obj.id === selectedObjectId);
      if (!selectedObject) return;

      // Create a target position from the selected object's position
      const targetPosition = new THREE.Vector3(
        selectedObject.position.x,
        selectedObject.position.y,
        selectedObject.position.z
      );

      // Use GSAP to smoothly animate the camera target
      gsap.to(orbitControlsRef.current.target, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 0.8,
        ease: "power3.out",
        onUpdate: () => orbitControlsRef.current.update(),
      });

      // Animate camera position to move back for a better view
      const cameraPosition = orbitControlsRef.current.object.position.clone();
      const direction = cameraPosition.clone().sub(targetPosition).normalize();

      // Increase the distance multiplier to position the camera further back
      // Use a fixed minimum distance to ensure we're always far enough back
      const objectSize = Math.max(
        selectedObject.scale.x,
        selectedObject.scale.y,
        selectedObject.scale.z
      );
      const distance = Math.max(objectSize * 10, 15); // Ensure minimum distance of 15 units

      // Calculate new position by moving in the direction away from target
      const newPosition = targetPosition.clone().add(direction.multiplyScalar(distance));

      gsap.to(orbitControlsRef.current.object.position, {
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z,
        duration: 1.2, // Slightly longer duration for smoother movement
        ease: "power2.inOut",
        onUpdate: () => orbitControlsRef.current.update(),
      });
    };

    // Check for F key press
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyF") {
        focusOnSelectedObject();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedObjectId, scenes, currentSceneId]);

  return (
    <div className="flex flex-col w-full h-screen bg-slate-900">
      {/* SEO Optimization */}
      <SEO
        title="Art Gallery Editor"
        description="Create and customize your virtual 3D art gallery. Upload images, arrange paintings, and design your perfect exhibition space."
        keywords="virtual art gallery, 3D gallery editor, art exhibition, digital art space, online gallery creator"
        ogType="website"
      />

      {/* Loading Screen */}
      {/* {isLoading && <Loader message="Loading Art Gallery Editor..." />} */}

      {/* Content Moderation Alert */}
      {showModerationAlert && (
        <ContentModerationAlert
          message={moderationMessage}
          onClose={() => setShowModerationAlert(false)}
        />
      )}

      {/* Main toolbar */}
      <EditorHeader setShowMetrics={setShowMetrics} showMetrics={showMetrics} />
      <img
        className="absolute hidden md:block bottom-4 left-12 w-20 z-40"
        src="/icons/large-logo.png"
        alt="VXLverse"
      />
      <div className="editorLayout">
        <div className="toolbar flex">
          {/* Show PaintingToolbar when a painting is selected, otherwise show regular Toolbar */}
          <Toolbar
            mode="gallery"
            setTransformMode={setTransformMode}
            setShowMetrics={setShowMetrics}
            showMetrics={showMetrics}
          />
        </div>

        <div className="editor-canvas">
          <Canvas
            shadows
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            camera={{ position: [0, 10, -22], fov: 75 }}
            className="w-full relative h-full"
          >
            {showMetrics && <Perf className="absolute z-10 w-80 top-0 left-0" />}

            <ArtEditor transformMode={transformMode} />
            <Environment preset="apartment" background={false} />
            <OrbitControls ref={orbitControlsRef} makeDefault />
          </Canvas>
        </div>
        <GalleryPropertiesPanel />
      </div>
    </div>
  );
}

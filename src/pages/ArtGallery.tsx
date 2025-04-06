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

  // Get the selected object from the editor store
  const { selectedObjectId, scenes, currentSceneId } = useEditorStore();
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus on painting when F key is pressed
      if (e.code === "KeyF") {
        focusOnSelectedPainting();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedObjectId, currentScene]);

  // Function to focus camera on the selected painting
  const focusOnSelectedPainting = () => {
    if (!selectedObjectId || !currentScene || !orbitControlsRef.current) return;

    const selectedObject = currentScene.objects.find((obj) => obj.id === selectedObjectId);

    // Only focus if it's a painting
    if (selectedObject && (selectedObject.type === "painting" || selectedObject.imageUrl)) {
      const { position } = selectedObject;

      // Set orbit controls target to the painting position
      orbitControlsRef.current.target.set(position.x, position.y, position.z);

      // Position camera to face the painting from a good viewing distance
      const cameraDistance = 15; // Adjust this value as needed
      const cameraHeight = position.y + 10.5; // Position camera slightly above the painting center

      // Calculate camera position based on painting rotation
      const { rotation } = selectedObject;
      const angle = rotation.y || 0;

      // Position camera in front of the painting based on its rotation
      const cameraX = position.x - Math.sin(angle) * cameraDistance;
      const cameraZ = position.z - Math.cos(angle) * cameraDistance;

      // Animate camera to new position
      orbitControlsRef.current.object.position.set(cameraX, cameraHeight, cameraZ);
      orbitControlsRef.current.update();
    }
  };

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

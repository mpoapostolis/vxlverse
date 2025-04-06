import React, { useEffect, useState } from "react";
import {
  Box,
  Move,
  RotateCcw,
  ExpandIcon,
  Copy,
  Brush,
  Trash,
  X,
  Magnet,
  Grid3X3,
  Eye,
  Gauge,
  Expand,
  Undo,
  Redo,
  Image,
} from "lucide-react";
import { Tooltip } from "../UI/Tooltip";
import { useEditorStore } from "../../stores/editorStore";
import { useKeyboardControls } from "@react-three/drei";
import { cn } from "../UI";

type ToolbarProps = {
  mode?: "gallery" | "editor";
  setShowMetrics: (show: boolean | ((s: boolean) => boolean)) => void;
  showMetrics: boolean;
  setTransformMode: (mode: "translate" | "rotate" | "scale") => void;
};
export const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  setShowMetrics,
  setTransformMode,
  showMetrics,
}) => {
  // Local state
  const [activeTool, setActiveTool] = useState<string>("move");
  const {
    selectedObjectId,
    toggleBrushMode,
    gridSnap,
    toggleGridSnap,
    showGrid,
    undo,
    redo,
    historyIndex,
    history,
    currentSceneId,
    toggleGrid,
    setSelectedObject,
    duplicateObject,
    removeObject,
    brushActive,
    setFocusOnObject,

    setShowModelSelector,
  } = useEditorStore();

  // Handle brush toggle
  const handleBrushToggle = () => {
    if (selectedObjectId && activeTool === "brush") {
      setActiveTool("move");
      toggleBrushMode(false);
    } else {
      setActiveTool("brush");
      toggleBrushMode(true);
    }
  };

  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    // Translate tool
    const unsubscribeTranslate = subscribeKeys(
      (state) => state.translate,
      (pressed) => {
        if (pressed && selectedObjectId) {
          setActiveTool("move");
          toggleBrushMode(false);
          setTransformMode("translate");
        }
      }
    );
    // Add object tool
    const unsubscribeAddObject = subscribeKeys(
      (state) => state["add object"],
      (pressed) => {
        if (pressed) {
          setShowModelSelector(true);
        }
      }
    );

    // Rotate tool
    const unsubscribeRotate = subscribeKeys(
      (state) => state.rotate,
      (pressed) => {
        if (pressed && selectedObjectId) {
          setActiveTool("rotate");
          toggleBrushMode(false);
          setTransformMode("rotate");
        }
      }
    );

    // Scale tool
    const unsubscribeScale = subscribeKeys(
      (state) => state.scale,
      (pressed) => {
        if (pressed && selectedObjectId) {
          setActiveTool("scale");
          toggleBrushMode(false);
          setTransformMode("scale");
        }
      }
    );

    // Brush tool
    const unsubscribeBrush = subscribeKeys(
      (state) => state.brush,
      (pressed) => {
        if (mode === "gallery" && pressed) {
          toggleBrushMode(pressed);
        }
        if (pressed && selectedObjectId) {
          setActiveTool("brush");
          toggleBrushMode(pressed);
        }
      }
    );

    // Toggle grid visibility
    const unsubscribeGrid = subscribeKeys(
      (state) => state.grid,
      (pressed) => {
        if (pressed) {
          toggleGrid();
          toggleBrushMode(false);
        }
      }
    );

    // Toggle grid snapping
    const unsubscribeSnap = subscribeKeys(
      (state) => state.snap,
      (pressed) => {
        if (pressed) {
          toggleGridSnap();
          toggleBrushMode(false);
        }
      }
    );

    // Focus on selected object
    const unsubscribeFocus = subscribeKeys(
      (state) => state.focus,
      (pressed) => {
        if (pressed && selectedObjectId) {
          setFocusOnObject(true);
          setTimeout(() => setFocusOnObject(false), 100);
        }
      }
    );

    // Fullscreen toggle
    const unsubscribeFullScreen = subscribeKeys(
      (state) => state["full screen"],
      (pressed) => {
        if (pressed) toggleFullscreen();
      }
    );

    // Escape: deselect object
    const unsubscribeEscape = subscribeKeys(
      (state) => state.escape,
      (pressed) => {
        if (pressed) {
          setShowModelSelector(false);
          toggleBrushMode(false);
          setSelectedObject(null);
        }
      }
    );

    // Duplicate object
    const unsubscribeDuplicate = subscribeKeys(
      (state) => state.duplicate,
      (pressed) => {
        if (pressed && selectedObjectId && currentSceneId) {
          console.debug("Duplicate action triggered");
          duplicateObject(currentSceneId, selectedObjectId);
        }
      }
    );

    // Duplicate object
    const metrics = subscribeKeys(
      (state) => state.metrics,
      (pressed) => {
        if (pressed && selectedObjectId && currentSceneId) {
          setShowMetrics((s) => Boolean(!s));
        }
      }
    );

    // Delete object using Delete key
    const unsubscribeDelete = subscribeKeys(
      (state) => state.delete,
      (pressed) => {
        if (pressed && selectedObjectId && currentSceneId) {
          console.debug("Delete action triggered");
          removeObject(currentSceneId, selectedObjectId);
        }
      }
    );

    return () => {
      metrics();
      unsubscribeTranslate();
      unsubscribeRotate();
      unsubscribeScale();
      unsubscribeBrush();
      unsubscribeGrid();
      unsubscribeSnap();
      unsubscribeFocus();
      unsubscribeFullScreen();
      unsubscribeEscape();
      unsubscribeDuplicate();
      unsubscribeDelete();
      unsubscribeAddObject();
    };
  }, [
    mode,
    selectedObjectId,
    currentSceneId,
    subscribeKeys,
    toggleBrushMode,
    toggleGrid,
    toggleGridSnap,
    duplicateObject,
    removeObject,
  ]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen && document.exitFullscreen();
    }
  };

  return (
    <div className="toolbar h-full  overflow-auto no-scrollbar bg-slate-900 backdrop-blur-sm border-r border-slate-600 flex flex-col justify-start ">
      {/* Add Object Tool */}

      {/* Transform Tools Group */}
      <Tooltip position="right" content="Add Object (O)">
        <button
          onClick={() => {
            setShowModelSelector(true);
          }}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${"text-slate-400 hover:bg-green-900/30 hover:text-green-300"}`}
        >
          <Box className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip position="right" content="Move Tool (W)">
        <button
          disabled={!selectedObjectId}
          onClick={() => {
            setActiveTool("move");
            setTransformMode("translate");
            toggleBrushMode(false);
          }}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            selectedObjectId && activeTool === "move"
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          }`}
        >
          <Move className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip position="right" content="Rotate Tool (E)">
        <button
          disabled={!selectedObjectId}
          onClick={() => {
            setActiveTool("rotate");
            setTransformMode("rotate");
            toggleBrushMode(false);
          }}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            selectedObjectId && activeTool === "rotate"
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip position="right" content="Scale Tool (R)">
        <button
          disabled={!selectedObjectId}
          onClick={() => {
            setActiveTool("scale");
            setTransformMode("scale");
            toggleBrushMode(false);
          }}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            selectedObjectId && activeTool === "scale"
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          }`}
        >
          <ExpandIcon className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip position="right" content="Duplicate Object (Meta + D)">
        <button
          disabled={!selectedObjectId}
          onClick={() => {
            if (selectedObjectId && currentSceneId) {
              duplicateObject(currentSceneId, selectedObjectId);
            }
          }}
          className="w-10 h-10 flex items-center justify-center transition-all duration-200 text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
        >
          <Copy className="w-4 h-4" />
        </button>
      </Tooltip>
      {mode === "editor" && (
        <Tooltip position="right" content="Brush Tool (B)">
          <button
            disabled={!selectedObjectId}
            onClick={handleBrushToggle}
            className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
              brushActive
                ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
                : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
            }`}
          >
            <Brush className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
      {mode === "gallery" && (
        <Tooltip position="right" content="Brush Tool (B)">
          <button
            onClick={handleBrushToggle}
            className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
              brushActive
                ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
                : "text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
            }`}
          >
            <Image className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
      <Tooltip position="right" content="Delete Object (Delete)">
        <button
          disabled={!selectedObjectId}
          onClick={() => {
            if (selectedObjectId && currentSceneId) {
              removeObject(currentSceneId, selectedObjectId);
            }
          }}
          className="w-10 h-10 flex items-center justify-center transition-all duration-200 text-slate-400 hover:bg-red-900/30 hover:text-red-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
        >
          <Trash className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip position="right" content="Close (Esc)">
        <button
          disabled={!selectedObjectId}
          onClick={() => {
            setSelectedObject(null);
          }}
          className="w-10 h-10 flex items-center justify-center transition-all duration-200 text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
        >
          <X className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip position="right" content="Toggle Grid Snap (S)">
        <button
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            gridSnap
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white"
          }`}
          onClick={toggleGridSnap}
        >
          <Magnet className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip position="right" content="Toggle Grid (G)">
        <button
          onClick={toggleGrid}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            showGrid
              ? "bg-gradient-to-b from-blue-600/30 to-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white"
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip position="right" content="Focus on Object (F)">
        <button
          disabled={!selectedObjectId}
          onClick={() => {
            if (selectedObjectId) {
              setFocusOnObject(true);
              setTimeout(() => setFocusOnObject(false), 100);
            }
          }}
          className="w-10 h-10 flex items-center justify-center transition-all duration-200 text-slate-400 hover:bg-slate-700/40 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip position="right" content="Undo (Z)">
        <button
          disabled={historyIndex < 0}
          onClick={undo}
          className={cn(
            `w-10  h-10 flex items-center justify-center transition-all duration-200 text-slate-400 hover:bg-slate-700/40 hover:text-white`,
            historyIndex < 0 && "opacity-30 hover:bg-transparent hover:text-slate-400"
          )}
        >
          <Undo className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip position="right" content="Redo (Y)">
        <button
          disabled={historyIndex === history.length - 1}
          onClick={redo}
          className={cn(
            `w-10 h-10 flex items-center justify-center transition-all duration-200 text-slate-400 hover:bg-slate-700/40 hover:text-white`,
            historyIndex === history.length - 1 &&
              "opacity-30 hover:bg-transparent hover:text-slate-400"
          )}
        >
          <Redo className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip position="right" content="Metrics">
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className={`w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            showMetrics
              ? "bg-gradient-to-b from-green-600/30 to-green-500/20 text-green-300 border-l-2 border-green-400 shadow-[0_2px_4px_rgba(74,222,128,0.2)]"
              : "text-slate-400 hover:bg-slate-700/40 hover:text-white"
          }`}
        >
          <Gauge className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip position="right" content="Full screen">
        <button
          onClick={toggleFullscreen}
          className={`w-10 h-10 hidden md:flex  items-center justify-center transition-all duration-200 ${"text-slate-400 hover:bg-slate-700/40 hover:text-white"}`}
        >
          <Expand className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );
};

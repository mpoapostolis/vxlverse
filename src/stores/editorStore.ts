import { create } from "zustand";
import * as THREE from "three";
import { Scene, GameObject } from "../types";
import { pb } from "../lib/pocketbase";
const DEFAULT_SCENES = [] as Scene[];

// Helper function to create a new scene with default values
const createDefaultScene = (name: string, id: string, objects: GameObject[] = []): Scene => ({
  id,
  name,
  showGrid: true,
  gridSize: 1,
  snapPrecision: 0.1,
  objects,
  environment: "sunset",
  background: "environment",
  ambientLight: 0.5,
  fog: {
    color: "#000000",
    near: 1,
    far: 100,
  },
  clouds: {
    enabled: false,
    speed: 1,
    opacity: 0.5,
    count: 20,
  },
  stars: {
    enabled: false,
    count: 5000,
    depth: 50,
    fade: true,
  },
});

// Define a type for actions that can be undone/redone
type HistoryAction = {
  type: string;
  payload: any;
  undo: () => void;
};

export interface EditorState {
  scenes: Scene[];
  currentSceneId: string | null;
  selectedObjectId: string | null;
  showModelSelector: boolean;
  editingSceneName: string | null;
  brushActive: boolean;
  brushTemplate: GameObject | null;
  brushSize: number;
  gridSnap: boolean;
  showGrid: boolean;
  gridSize: number;
  snapPrecision: number;
  isTransforming: boolean;
  focusOnObject: boolean;

  // History tracking for undo/redo
  history: HistoryAction[];
  historyIndex: number;
  isUndoRedoOperation: boolean;

  // Undo/redo methods
  undo: () => void;
  redo: () => void;
  addToHistory: (action: HistoryAction) => void;

  addScene: (scene: Scene) => void;
  removeScene: (id: string) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  setCurrentScene: (id: string) => void;
  addObject: (sceneId: string, object: GameObject) => void;
  updateObject: (sceneId: string, objectId: string, updates: Partial<GameObject>) => void;
  setBrushActive: (active: boolean) => void;
  removeObject: (sceneId: string, objectId: string) => void;
  duplicateObject: (sceneId: string, objectId: string) => void;
  setSelectedObject: (id: string | null) => void;
  setShowModelSelector: (show: boolean) => void;
  setEditingSceneName: (id: string | null) => void;
  updateSceneName: (id: string, name: string) => void;
  toggleBrushMode: (active: boolean) => void;
  setBrushTemplate: (object: GameObject | null) => void;
  setBrushSize: (size: number) => void;
  placeObjectWithBrush: (
    sceneId: string,
    position: THREE.Vector3 | { x: number; y: number; z: number }
  ) => void;
  toggleGridSnap: () => void;
  setGridSnap: (enabled: boolean) => void;
  toggleGrid: () => void;
  setShowGrid: (show: boolean) => void;
  setGridSize: (size: number) => void;
  setSnapPrecision: (precision: number) => void;
  createNewScene: (name: string, objects?: GameObject[]) => void;
  setIsTransforming: (isTransforming: boolean) => void;
  setFocusOnObject: (focus: boolean) => void;
}

export const useEditorStore = create<EditorState>()((set, get) => ({
  scenes: DEFAULT_SCENES,
  currentSceneId: null as string | null,
  selectedObjectId: null as string | null,
  showModelSelector: false,
  editingSceneName: null as string | null,
  brushActive: false,
  brushTemplate: null as GameObject | null,
  brushSize: 1,
  gridSnap: true,
  showGrid: true,
  gridSize: 1,
  snapPrecision: 0.1,
  isTransforming: false,
  focusOnObject: false,

  // History tracking for undo/redo
  history: [] as HistoryAction[],
  historyIndex: -1,
  isUndoRedoOperation: false,

  // Add to history method
  addToHistory: (action) => {
    if (get().isUndoRedoOperation) return;

    const currentIndex = get().historyIndex;
    const newHistory = [...get().history.slice(0, currentIndex + 1), action];

    set({
      history: newHistory,
      historyIndex: currentIndex + 1,
    });
  },

  // Undo method
  undo: () => {
    const { historyIndex, history } = get();

    if (historyIndex >= 0) {
      const action = history[historyIndex];

      set({ isUndoRedoOperation: true });
      action.undo();
      set({
        historyIndex: Math.max(0, historyIndex - 1),
        isUndoRedoOperation: false,
      });
    } else {
    }
  },

  // Redo method
  redo: () => {
    const { historyIndex, history } = get();

    if (historyIndex < history.length - 1) {
      const nextAction = history[historyIndex + 1];

      set({ isUndoRedoOperation: true });
      // For redo, we need to re-apply the action
      if (nextAction.type === "ADD_SCENE") {
        get().addScene(nextAction.payload);
      } else if (nextAction.type === "REMOVE_SCENE") {
        get().removeScene(nextAction.payload);
      } else if (nextAction.type === "UPDATE_SCENE") {
        get().updateScene(nextAction.payload.id, nextAction.payload.updates);
      } else if (nextAction.type === "ADD_OBJECT") {
        get().addObject(nextAction.payload.sceneId, nextAction.payload.object);
      } else if (nextAction.type === "UPDATE_OBJECT") {
        get().updateObject(
          nextAction.payload.sceneId,
          nextAction.payload.objectId,
          nextAction.payload.updates
        );
      } else if (nextAction.type === "REMOVE_OBJECT") {
        get().removeObject(nextAction.payload.sceneId, nextAction.payload.objectId);
      } else if (nextAction.type === "DUPLICATE_OBJECT") {
        get().duplicateObject(nextAction.payload.sceneId, nextAction.payload.objectId);
      } else if (nextAction.type === "CHANGE_SCENE") {
        get().setCurrentScene(nextAction.payload.id);
      }

      set({
        historyIndex: historyIndex + 1,
        isUndoRedoOperation: false,
      });
    } else {
    }
  },

  addScene: (scene) => {
    const prevScenes = [...get().scenes];

    set((state) => {
      const exists = state.scenes.some((s) => s.id === scene.id);
      if (!exists) {
        return {
          brushActive: false,
          brushTemplate: null,
          scenes: [...state.scenes, scene],
          currentSceneId: scene.id,
        };
      }
      return state;
    });

    // Add to history if not an undo/redo operation
    if (!get().isUndoRedoOperation) {
      get().addToHistory({
        type: "ADD_SCENE",
        payload: scene,
        undo: () => {
          set({
            scenes: prevScenes,
            currentSceneId: prevScenes.length > 0 ? prevScenes[prevScenes.length - 1].id : null,
          });
        },
      });
    }
  },
  setBrushActive: (active: boolean) => set(() => ({ brushActive: active })),
  removeScene: (id) => {
    const prevScenes = [...get().scenes];
    const sceneToRemove = prevScenes.find((s) => s.id === id);
    const prevCurrentSceneId = get().currentSceneId;
    const prevSelectedObjectId = get().selectedObjectId;

    set((state) => {
      const newScenes = state.scenes.filter((s) => s.id !== id);

      return {
        brushActive: false,
        brushTemplate: null,
        scenes: newScenes,
        currentSceneId: null,
        selectedObjectId: null,
      };
    });

    // Add to history if not an undo/redo operation
    if (!get().isUndoRedoOperation && sceneToRemove) {
      get().addToHistory({
        type: "REMOVE_SCENE",
        payload: id,
        undo: () => {
          set({
            scenes: prevScenes,
            currentSceneId: prevCurrentSceneId,
            selectedObjectId: prevSelectedObjectId,
          });
        },
      });
    }
  },
  updateScene: (id, updates) => {
    const prevScenes = [...get().scenes];
    const sceneToUpdate = prevScenes.find((s) => s.id === id);

    set((state) => ({
      scenes: state.scenes.map((scene) => (scene.id === id ? { ...scene, ...updates } : scene)),
    }));

    // Add to history if not an undo/redo operation
    if (!get().isUndoRedoOperation && sceneToUpdate) {
      get().addToHistory({
        type: "UPDATE_SCENE",
        payload: { id, updates },
        undo: () => {
          set({
            scenes: prevScenes,
          });
        },
      });
    }
  },
  setCurrentScene: (id) => {
    const prevSceneId = get().currentSceneId;

    set({ currentSceneId: id });

    // Add to history if not an undo/redo operation
    if (!get().isUndoRedoOperation) {
      get().addToHistory({
        type: "CHANGE_SCENE",
        payload: { id, prevId: prevSceneId },
        undo: () => {
          set({ currentSceneId: prevSceneId });
        },
      });
    }
  },
  addObject: (sceneId, object) => {
    const prevScenes = [...get().scenes];
    const prevSelectedObjectId = get().selectedObjectId;

    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, objects: [...scene.objects, object] } : scene
      ),
      selectedObjectId: object.id,
    }));

    // Add to history if not an undo/redo operation
    if (!get().isUndoRedoOperation) {
      get().addToHistory({
        type: "ADD_OBJECT",
        payload: { sceneId, object },
        undo: () => {
          set({
            scenes: prevScenes,
            selectedObjectId: prevSelectedObjectId,
          });
        },
      });
    }
  },
  updateObject: (sceneId, objectId, updates) => {
    const prevScenes = [...get().scenes];

    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              objects: scene.objects.map((obj) =>
                obj.id === objectId ? { ...obj, ...updates } : obj
              ),
            }
          : scene
      ),
    }));

    // Add to history if not an undo/redo operation
    if (!get().isUndoRedoOperation) {
      get().addToHistory({
        type: "UPDATE_OBJECT",
        payload: { sceneId, objectId, updates },
        undo: () => {
          set({
            scenes: prevScenes,
          });
        },
      });
    }
  },
  removeObject: (sceneId, objectId) => {
    const prevScenes = [...get().scenes];
    const prevSelectedObjectId = get().selectedObjectId;
    const scene = prevScenes.find((s) => s.id === sceneId);
    const objectToRemove = scene?.objects.find((o) => o.id === objectId);

    set((state) => ({
      brushActive: false,
      brushTemplate: null,
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              objects: scene.objects.filter((obj) => obj.id !== objectId),
            }
          : scene
      ),
      selectedObjectId: state.selectedObjectId === objectId ? null : state.selectedObjectId,
    }));

    // Add to history if not an undo/redo operation
    if (!get().isUndoRedoOperation && objectToRemove) {
      get().addToHistory({
        type: "REMOVE_OBJECT",
        payload: { sceneId, objectId },
        undo: () => {
          set({
            scenes: prevScenes,
            selectedObjectId: prevSelectedObjectId,
          });
        },
      });
    }
  },
  duplicateObject: (sceneId, objectId) => {
    const prevScenes = [...get().scenes];
    const prevSelectedObjectId = get().selectedObjectId;

    set((state) => {
      const scene = state.scenes.find((s) => s.id === sceneId);
      if (!scene) return state;

      const object = scene.objects.find((obj) => obj.id === objectId);
      if (!object) return state;

      // Deep clone the object
      const newObject = JSON.parse(JSON.stringify(object));

      // Generate a new ID
      newObject.id = new THREE.Object3D().uuid;

      // Offset the position slightly (0.5 units in x and z)
      if (newObject.position) {
        newObject.position.x += 0.5;
        newObject.position.z += 0.5;
      }

      return {
        brushActive: false,
        brushTemplate: null,
        scenes: state.scenes.map((s) =>
          s.id === sceneId ? { ...s, objects: [...s.objects, newObject] } : s
        ),
        selectedObjectId: newObject.id,
      };
    });

    // Add to history if not an undo/redo operation
    if (!get().isUndoRedoOperation) {
      get().addToHistory({
        type: "DUPLICATE_OBJECT",
        payload: { sceneId, objectId },
        undo: () => {
          set({
            scenes: prevScenes,
            selectedObjectId: prevSelectedObjectId,
          });
        },
      });
    }
  },
  setSelectedObject: (id) =>
    set(() => ({
      selectedObjectId: id,
    })),
  setShowModelSelector: (show) => set({ showModelSelector: show }),
  setEditingSceneName: (id) => set({ editingSceneName: id }),
  updateSceneName: (id, name) =>
    set((state) => ({
      scenes: state.scenes.map((scene) => (scene.id === id ? { ...scene, name } : scene)),
      editingSceneName: null,
    })),
  toggleBrushMode: (active) => {
    const selectedId = get().selectedObjectId;
    const currentObject = get()
      .scenes.find((s) => s.id === selectedId)
      ?.objects.find((o) => o.id === selectedId);
    set(() => ({
      brushActive: active,
      // When turning off brush mode, clear the brush template
      brushTemplate: active ? currentObject : null,
    }));
  },
  setBrushTemplate: (object) => {
    set(() => ({
      brushTemplate: object,
    }));
  },
  setBrushSize: (size) =>
    set(() => ({
      brushSize: Math.max(1, size),
    })),
  placeObjectWithBrush: (sceneId, position) => {
    const object = get()
      .scenes.find((s) => s.id === sceneId)
      ?.objects.find((o) => o.id === get().selectedObjectId);
    if (!object) return;
    // Create a new object based on the brush template
    const newObject = {
      id: new THREE.Object3D().uuid,
      name: object.name,
      modelUrl: object.modelUrl,
      position: {
        // Handle both Vector3 and regular position objects
        x: position.x !== undefined ? position.x : 0,
        y: position.y !== undefined ? position.y : 0,
        z: position.z !== undefined ? position.z : 0,
      },
      rotation: object?.rotation ?? { x: 0, y: 0, z: 0 },
      scale: object?.scale ?? { x: 1, y: 1, z: 1 },
    } as GameObject;

    // Add the object to the scene
    get().addObject(sceneId, newObject);

    // Force a state update to trigger a re-render
    set((state) => ({ ...state }));
  },
  toggleGridSnap: () => {
    const newState = !get().gridSnap;
    set({ gridSnap: newState });
  },
  setGridSnap: (enabled) => set({ gridSnap: enabled }),
  toggleGrid: () => {
    const newState = !get().showGrid;
    set({ showGrid: newState });
  },
  setShowGrid: (show) => set({ showGrid: show }),
  setGridSize: (size) => {
    const currentSceneId = get().currentSceneId;
    if (currentSceneId) {
      get().updateScene(currentSceneId, { gridSize: size });
    }
  },
  setSnapPrecision: (precision) => {
    const currentSceneId = get().currentSceneId;
    if (currentSceneId) {
      get().updateScene(currentSceneId, { snapPrecision: precision });
    }
  },
  createNewScene: (name, objects) => {
    const id = crypto.randomUUID();
    const newScene = createDefaultScene(name, id, objects);
    set((state) => ({
      brushActive: false,
      brushTemplate: null,
      scenes: [...state.scenes, newScene],
      currentSceneId: id,
    }));
  },
  setIsTransforming: (isTransforming) => set({ isTransforming }),
  setFocusOnObject: (focus) => set({ focusOnObject: focus }),
}));

// Debounce function to limit how often a function can be called
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

// Debounced function to update game state
const debouncedUpdate = debounce(async (state: EditorState, gameId: string) => {
  try {
    if (!gameId) return;
    console.log("Saving editor state...", gameId);
    await pb.collection("games").update(gameId, {
      gameConf: {
        scenes: state.scenes,
        currentSceneId: state.currentSceneId,
        gridSnap: state.gridSnap,
      },
    });
  } catch (error) {
    console.error("Failed to save editor state:", error);
  }
}, 2_500); // 1 second debounce

// Subscribe to store changes
useEditorStore.subscribe((state) => {
  const gameId = window.location.pathname.split("/").pop();
  if (gameId) {
    debouncedUpdate(state, gameId);
  }
});

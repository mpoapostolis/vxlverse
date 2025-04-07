import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy } from "react";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Lazy load all page components
const Editor = lazy(() => import("./pages/Editor").then((module) => ({ default: module.Editor })));
const Game = lazy(() => import("./pages/Game").then((module) => ({ default: module.Game })));
const Home = lazy(() => import("./pages/Home").then((module) => ({ default: module.Home })));
const Games = lazy(() => import("./pages/Games").then((module) => ({ default: module.Games })));
const Profile = lazy(() =>
  import("./pages/Profile").then((module) => ({ default: module.Profile }))
);
const Favorites = lazy(() =>
  import("./pages/Favorites").then((module) => ({ default: module.Favorites }))
);
const Settings = lazy(() =>
  import("./pages/Settings").then((module) => ({ default: module.Settings }))
);
const Login = lazy(() => import("./pages/Login").then((module) => ({ default: module.Login })));
const NotFound = lazy(() =>
  import("./pages/NotFound").then((module) => ({ default: module.NotFound }))
);
const ArtGallery = lazy(() =>
  import("./pages/ArtGallery").then((module) => ({ default: module.ArtGallery }))
);
const Galleries = lazy(() =>
  import("./pages/Galleries").then((module) => ({ default: module.Galleries }))
);

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen w-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/play/:id" element={<Game />} />
          <Route path="/gallery" element={<Galleries />} />
          <Route path="/gallery/:id" element={<ArtGallery />} />
          <Route path="/gallery/:id/edit" element={<ArtGallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/editor/demo" element={<Editor />} />

          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          {/* 404 Not Found page - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

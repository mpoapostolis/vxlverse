import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, HelpCircle, Heart, Menu, X, Gamepad, Crown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { pb } from "../../lib/pocketbase";
import { useAuthStore } from "../../stores/authStore";
import { LoginModal } from "../auth/LoginModal";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const isAuthenticated = pb.authStore.isValid;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    pb.authStore.clear();
    logout();
    setIsDropdownOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${isScrolled ? "bg-gray-900/95 backdrop-blur-md shadow-xl" : "bg-transparent"}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 9999,
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/98 to-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800/50 -z-10"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/icons/large-logo.png"
                alt="VXLverse"
                className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110"
                width="36"
                height="36"
              />
            </div>
            <span className="text-xl -left-3 relative -bottom-1 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400">
              verse
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/50 backdrop-blur-sm border border-white/5 focus:outline-none transition-all duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Main menu"
            >
              <div className="relative">
                {isMobileMenuOpen ? (
                  <X className="block h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="block h-5 w-5" aria-hidden="true" />
                )}
                <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname === "/"
                    ? "text-white bg-gradient-to-r from-blue-600/80 to-violet-600/80 shadow-lg shadow-blue-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                aria-current={location.pathname === "/" ? "page" : undefined}
              >
                Home
              </Link>
              <Link
                to="/games"
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname === "/games"
                    ? "text-white bg-gradient-to-r from-blue-600/80 to-violet-600/80 shadow-lg shadow-blue-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                aria-current={location.pathname === "/games" ? "page" : undefined}
              >
                <div className="flex items-center gap-1.5">
                  <Gamepad className="w-3.5 h-3.5" />
                  <span>Games</span>
                </div>
              </Link>
              <Link
                to="/gallery"
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname === "/gallery"
                    ? "text-white bg-gradient-to-r from-blue-600/80 to-violet-600/80 shadow-lg shadow-blue-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                aria-current={location.pathname === "/gallery" ? "page" : undefined}
              >
                Galleries
              </Link>
              <Link
                to="/pricing"
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname === "/pricing"
                    ? "text-white bg-gradient-to-r from-blue-600/80 to-violet-600/80 shadow-lg shadow-blue-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                aria-current={location.pathname === "/pricing" ? "page" : undefined}
              >
                <div className="flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Pricing</span>
                </div>
              </Link>
              <Link
                to="/blog"
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname === "/blog" || location.pathname.startsWith("/blog/")
                    ? "text-white bg-gradient-to-r from-blue-600/80 to-violet-600/80 shadow-lg shadow-blue-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                aria-current={
                  location.pathname === "/blog" || location.pathname.startsWith("/blog/")
                    ? "page"
                    : undefined
                }
              >
                <span>Blog</span>
              </Link>
              <Link
                to="/help"
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname === "/help"
                    ? "text-white bg-gradient-to-r from-blue-600/80 to-violet-600/80 shadow-lg shadow-blue-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                aria-current={location.pathname === "/help" ? "page" : undefined}
              >
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Help</span>
                </div>
              </Link>
            </nav>

            <div className="flex items-center">
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex hover:cursor-pointer items-center gap-2 p-1 rounded-full hover:bg-white/5 border border-white/10 transition-all duration-200 focus:outline-none group"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm overflow-hidden ring-2 ring-black/50 shadow-lg">
                      {user.avatar ? (
                        <img
                          src={`${pb.baseUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`}
                          alt={user.name || user.email}
                          className="w-full h-full object-cover"
                          width="32"
                          height="32"
                          loading="lazy"
                        />
                      ) : (
                        <span>{(user.name || user.email || "U").charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute z-50 right-0 mt-2 w-64 bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl py-1 overflow-hidden"
                      >
                        <div className="px-5 py-4 border-b border-gray-800/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 opacity-75 blur-md"></div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white truncate">
                                {user.email || "User"}
                              </p>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                              <div className="mt-1.5 text-xs bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-300 px-2 py-0.5 rounded-full inline-block border border-blue-500/20">
                                {user.type || "Free"} Account
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-2 py-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg w-full text-left transition-all duration-150"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-400" />
                            </div>
                            <span>Profile</span>
                          </Link>

                          <Link
                            to="/favorites"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg w-full text-left transition-all duration-150"
                          >
                            <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center">
                              <Heart className="w-4 h-4 text-pink-400" />
                            </div>
                            <span>Favorites</span>
                          </Link>

                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg w-full text-left transition-all duration-150"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center">
                              <Settings className="w-4 h-4 text-gray-400" />
                            </div>
                            <span>Settings</span>
                          </Link>

                          <Link
                            to="/help"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg w-full text-left transition-all duration-150"
                          >
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                              <HelpCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <span>Help</span>
                          </Link>
                        </div>

                        <div className="border-t border-gray-800/50 mt-1 px-2 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg w-full text-left transition-all duration-150"
                          >
                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                              <LogOut className="w-4 h-4 text-red-400" />
                            </div>
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="relative group overflow-hidden flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 focus:outline-none"
                  aria-label="Sign in to your account"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/30 to-violet-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </div>
                </button>
              )}
            </div>

            {/* Login Modal */}
            <LoginModal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              message="Sign in to access your account"
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-gray-900 border-t border-gray-800"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className={`block px-3 py-2  text-base font-medium ${location.pathname === "/" ? "bg-blue-600/20 text-white border-l-4 border-blue-500" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
                  aria-current={location.pathname === "/" ? "page" : undefined}
                >
                  Home
                </Link>
                <Link
                  to="/games"
                  className={`block px-3 py-2  text-base font-medium ${location.pathname === "/games" ? "bg-blue-600/20 text-white border-l-4 border-blue-500" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
                  aria-current={location.pathname === "/games" ? "page" : undefined}
                >
                  Games
                </Link>
                <Link
                  to="/gallery"
                  className={`block px-3 py-2  text-base font-medium ${location.pathname === "/gallery" ? "bg-blue-600/20 text-white border-l-4 border-blue-500" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
                  aria-current={location.pathname === "/gallery" ? "page" : undefined}
                >
                  Galleries
                </Link>
                <Link
                  to="/pricing"
                  className={`block px-3 py-2  text-base font-medium ${location.pathname === "/pricing" ? "bg-blue-600/20 text-white border-l-4 border-blue-500" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
                  aria-current={location.pathname === "/pricing" ? "page" : undefined}
                >
                  Pricing
                </Link>
                <Link
                  to="/blog"
                  className={`block px-3 py-2  text-base font-medium ${location.pathname === "/blog" || location.pathname.startsWith("/blog/") ? "bg-blue-600/20 text-white border-l-4 border-blue-500" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
                  aria-current={
                    location.pathname === "/blog" || location.pathname.startsWith("/blog/")
                      ? "page"
                      : undefined
                  }
                >
                  Blog
                </Link>
                <Link
                  to="/help"
                  className={`block px-3 py-2  text-base font-medium ${location.pathname === "/help" ? "bg-blue-600/20 text-white border-l-4 border-blue-500" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
                  aria-current={location.pathname === "/help" ? "page" : undefined}
                >
                  Help
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

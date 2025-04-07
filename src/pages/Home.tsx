import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import {
  ArrowRight,
  Box,
  Gamepad2,
  Palette,
  Users,
  Zap,
  Star,
  Trophy,
  Image,
  Eye,
  ChevronLeft,
  ChevronRight,
  Construction,
  Clock,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import "../styles/animations.css";

// Gallery Showcase Component
function GalleryShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const galleries = [
    {
      title: "Abstract Dimensions",
      image:
        "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=70",
      description:
        "A mesmerizing collection of abstract 3D sculptures exploring dimensions and space",
    },
    {
      title: "Neon Dreams",
      image:
        "https://images.unsplash.com/photo-1633193330105-cc49d5e64fca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=70",
      description: "Vibrant neon-inspired 3D artwork that brings cyberpunk aesthetics to life",
    },
    {
      title: "Nature Reimagined",
      image:
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=70",
      description: "Organic 3D forms and structures inspired by natural patterns and growth",
    },
  ];

  // Pause autoplay when user interacts with gallery
  const handleManualNavigation = useCallback((action: () => void) => {
    setIsAutoPlaying(false);
    action();

    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === galleries.length - 1 ? 0 : prev + 1));
  }, [galleries.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? galleries.length - 1 : prev - 1));
  }, [galleries.length]);

  // For better accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleManualNavigation(prevSlide);
      } else if (e.key === "ArrowRight") {
        handleManualNavigation(nextSlide);
      }
    },
    [handleManualNavigation, prevSlide, nextSlide]
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, nextSlide]);

  return (
    <div
      className="relative h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden rounded-lg border border-purple-500/30 shadow-2xl shadow-purple-500/20"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Gallery showcase"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 z-0"></div>

      {/* Gallery images */}
      {galleries.map((gallery, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{
            opacity: currentSlide === index ? 1 : 0,
          }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 ${currentSlide === index ? "z-10" : "z-0"}`}
        >
          <img
            src={gallery.image}
            alt={gallery.title}
            className="w-full h-full object-cover"
            loading="lazy"
            width="800"
            height="600"
            decoding="async"
            fetchPriority="low"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

          {/* Gallery info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-8 z-20"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-white">
              {gallery.title}
            </h3>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl line-clamp-2 sm:line-clamp-none">
              {gallery.description}
            </p>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1 sm:gap-2 mt-2 sm:mt-4 px-2 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition-all duration-300"
            >
              View Gallery
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={() => handleManualNavigation(prevSlide)}
        aria-label="Previous gallery"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-1 sm:p-2 bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-black/70 text-white transition-colors duration-300"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={() => handleManualNavigation(nextSlide)}
        aria-label="Next gallery"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-1 sm:p-2 bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-black/70 text-white transition-colors duration-300"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {galleries.map((_, index) => (
          <button
            key={index}
            onClick={() => handleManualNavigation(() => setCurrentSlide(index))}
            aria-label={`View gallery ${index + 1}`}
            aria-current={currentSlide === index ? "true" : "false"}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${currentSlide === index ? "bg-white w-4" : "bg-white/50"}`}
          />
        ))}
      </div>

      {/* 3D effect overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-t from-transparent to-black/10 mix-blend-overlay"></div>
    </div>
  );
}

export function Home() {
  // Add page title and meta description for better SEO
  useEffect(() => {
    document.title = "VXLVerse - Create 3D Games & Art Galleries Without Coding";

    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Create stunning 3D games and art galleries without coding. VXLVerse is the easiest way to build and share interactive 3D experiences."
      );
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content =
        "Create stunning 3D games and art galleries without coding. VXLVerse is the easiest way to build and share interactive 3D experiences.";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  const { user } = useAuthStore();

  // We don't need the scroll listener yet, so removing it for better performance

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <Helmet>
        <title>VXLVerse - Create 3D Games & Art Galleries Without Coding</title>
        <meta
          name="description"
          content="Create stunning 3D games and art galleries without coding. VXLVerse is the easiest way to build and share interactive 3D experiences."
        />
      </Helmet>
      <Header />

      {/* Under Development Banner */}
      <div className="fixed top-30 -right-10 z-30 w-96 transform rotate-45 translate-x-12 translate-y-10">
        <div className="bg-yellow-500 py-2 text-black font-bold px-16 shadow-lg flex items-center gap-2">
          <Construction className="w-4 h-4" />
          <span>UNDER DEVELOPMENT</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-white z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-gray-900 to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
        <div className="absolute -left-20 top-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 top-40 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-6 px-4 py-1 bg-gradient-to-r from-violet-500/20 to-blue-500/20 backdrop-blur-sm border border-violet-500/30 text-violet-300 text-sm font-medium">
              The easiest way to create 3D games and art galleries
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                <Clock className="w-3 h-3 mr-1" />
                Coming Soon
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-indigo-400">
              <span className="sr-only">VXLVerse - </span>Create, Share, and Play 3D Experiences
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
              VXLVerse is a powerful 3D platform that lets you build immersive games and experiences
              without coding knowledge
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8">
              <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-[8px]">
                  ✓
                </div>
                <span>No coding</span>
              </div>
              <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-[8px]">
                  ✓
                </div>
                <span>Easy to use</span>
              </div>
              <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-[8px]">
                  ✓
                </div>
                <span>Create in minutes</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/editor/demo"
                className="px-8 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Try Editor Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/games"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                aria-label="Browse VXLVerse games"
              >
                Browse Games
                <Gamepad2 className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* 3D Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-12 relative max-w-5xl mx-auto"
          >
            <div className="relative">
              {/* Grid pattern background */}
              <div className="absolute inset-0 bg-grid-white opacity-30 z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-md z-0"></div>

              {/* Editor preview with "No Coding Required" badge */}
              <div className="relative h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden border border-white/20 shadow-2xl shadow-blue-500/10 z-10 bg-gray-900/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-grid-white opacity-20"></div>

                {/* Editor interface mockup - Mobile friendly version */}
                <div className="absolute inset-0 flex flex-col md:flex-row">
                  {/* Left sidebar - models (hidden on mobile) */}
                  <div className="hidden md:block w-36 lg:w-48 border-r border-white/10 bg-black/20 p-3">
                    <div className="text-xs font-semibold text-gray-400 mb-2">3D MODELS</div>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="mb-2 p-2 bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer"
                      >
                        <div className="w-full h-10 lg:h-12 bg-gradient-to-r from-gray-800 to-gray-900"></div>
                        <div className="text-[10px] text-gray-400 mt-1">Model {i}</div>
                      </div>
                    ))}
                  </div>

                  {/* Center - canvas */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-grid-white opacity-30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 shadow-lg shadow-blue-500/10 rotate-45 animate-pulse"></div>
                      <div className="absolute w-16 h-16 md:w-24 md:h-24 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-500/10 rotate-12 animate-pulse"></div>
                    </div>

                    {/* Drag & Drop indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-blue-500/90 text-white text-[10px] sm:text-xs font-medium rounded-full whitespace-nowrap">
                      Drag & drop - No coding!
                    </div>

                    {/* Mobile-only simplified controls */}
                    <div className="absolute top-2 left-2 md:hidden flex space-x-2">
                      <div className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center rounded-full">
                        <Box className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center rounded-full">
                        <Palette className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>
                  </div>

                  {/* Right sidebar - properties (hidden on mobile) */}
                  <div className="hidden md:block w-36 lg:w-56 border-l border-white/10 bg-black/20 p-3">
                    <div className="text-xs font-semibold text-gray-400 mb-2">PROPERTIES</div>
                    {["Position", "Rotation", "Scale"].map((prop) => (
                      <div key={prop} className="mb-2">
                        <div className="text-[10px] text-gray-300 mb-1">{prop}</div>
                        <div className="h-6 bg-white/5 border border-white/10"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toolbar */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800/90 border-b border-white/10 flex items-center px-3">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="text-xs text-gray-400 mx-auto">
                    VXLVerse Editor - Create in Minutes
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg z-20 animate-float-up">
                <Box className="w-6 h-6 text-blue-400" />
              </div>
              <div className="absolute -bottom-6 -left-6 p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg z-20 animate-float-up">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>

              {/* Easy creation badge */}
              <div className="absolute -bottom-3 right-4 sm:right-12 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-green-500/20 z-30 rotate-3">
                Create in minutes!
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-grid-white opacity-10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
              id="features"
            >
              Powerful Features for Creators
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to build amazing 3D experiences in one platform
            </p>
            <div className="inline-block mt-4 px-3 py-1 sm:px-4 sm:py-1 bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm text-blue-300 text-xs sm:text-sm font-medium">
              Create in minutes with intuitive tools
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.1, 0.3) }}
                className="p-6 bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group"
              >
                <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 inline-flex mb-4 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-purple-600 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Art Gallery Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-10 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 z-0"></div>
        <div className="absolute -left-40 top-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-40 bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
                id="galleries"
              >
                Stunning 3D Art Galleries
                <div className="inline-block ml-3 px-2 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded-md">
                  <Construction className="w-3 h-3 inline mr-1" />
                  COMING SOON
                </div>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Create, curate, and showcase your 3D artwork in immersive virtual galleries
              </p>
              <div className="inline-block mt-4 px-3 py-1 sm:px-4 sm:py-1 bg-purple-500/20 border border-purple-500/30 backdrop-blur-sm text-purple-300 text-xs sm:text-sm font-medium">
                Just drag, drop, and design!
              </div>
            </motion.div>
          </div>

          <div className="relative mx-auto max-w-full overflow-hidden">
            <GalleryShowcase />
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 backdrop-blur-sm border border-purple-700/30 hover:border-purple-500/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
            >
              <div className="p-3 bg-gradient-to-br from-purple-800/50 to-purple-900/50 border border-purple-700/50 inline-flex mb-4">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Customizable Spaces</h3>
              <p className="text-gray-300">
                Design your gallery with customizable lighting, textures, and layouts to perfectly
                showcase your artwork
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-gradient-to-br from-pink-900/30 via-pink-800/20 to-pink-900/30 backdrop-blur-sm border border-pink-700/30 hover:border-pink-500/50 shadow-xl hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500"
            >
              <div className="p-3 bg-gradient-to-br from-pink-800/50 to-pink-900/50 border border-pink-700/50 inline-flex mb-4">
                <Eye className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Immersive Viewing</h3>
              <p className="text-gray-300">
                Invite visitors to explore your gallery in first-person view with interactive
                elements and ambient audio
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-gradient-to-br from-indigo-900/30 via-indigo-800/20 to-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 hover:border-indigo-500/50 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
            >
              <div className="p-3 bg-gradient-to-br from-indigo-800/50 to-indigo-900/50 border border-indigo-700/50 inline-flex mb-4">
                <Image className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Multi-Format Support</h3>
              <p className="text-gray-300">
                Display various 3D formats, textures, and animations with detailed information cards
                and descriptions
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
            >
              Explore Galleries
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 relative bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute inset-0 bg-grid-white opacity-50 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
              id="games"
            >
              Featured Games
              <div className="inline-block ml-3 px-2 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded-md">
                <Construction className="w-3 h-3 inline mr-1" />
                COMING SOON
              </div>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Check out these amazing games created with VXLVerse
            </p>
            <div className="inline-block mt-4 px-3 py-1 sm:px-4 sm:py-1 bg-green-500/20 border border-green-500/30 backdrop-blur-sm text-green-300 text-xs sm:text-sm font-medium">
              No coding needed!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGames.map((game, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.1, 0.3) }}
                className="group relative h-[20rem] overflow-hidden backdrop-blur-sm bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 border border-gray-700/30 hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-colors duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <div
                  className="relative h-48 overflow-hidden"
                  style={{ backgroundColor: game.color }}
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    width="400"
                    height="300"
                    decoding="async"
                    fetchPriority="low"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link to={`/play/${game.id}`}>
                      <div className="bg-blue-500 p-3 shadow-lg shadow-blue-500/25 backdrop-blur-sm">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 p-4 flex flex-col">
                  {/* Decorative elements */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-blue-500/10 pointer-events-none" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-500/20 blur-3xl pointer-events-none" />

                  {/* Title */}
                  <div className="relative flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold truncate">{game.title}</h3>
                  </div>

                  {/* Description */}
                  <p className="relative text-gray-300 text-xs line-clamp-2 leading-relaxed mb-2">
                    {game.description}
                  </p>

                  {/* Stats */}
                  <div className="relative flex items-center gap-3 text-[10px] mt-auto">
                    <div className="flex items-center gap-1">
                      <div className="p-1 bg-yellow-500/10 backdrop-blur-sm">
                        <Star className="w-3 h-3 text-yellow-500" />
                      </div>
                      <span className="text-yellow-500 font-medium">{game.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="p-1 bg-blue-500/10 backdrop-blur-sm">
                        <Users className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-blue-400 font-medium">{game.players}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/games"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium transition-all duration-300"
            >
              View All Games
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-grid-white opacity-20 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 z-0"></div>
        <div className="absolute -left-20 bottom-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 bottom-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400"
                id="get-started"
              >
                Ready to Create Your Own 3D Experience?
                <div className="inline-block ml-3 px-2 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded-md">
                  <Clock className="w-3 h-3 inline mr-1" />
                  LAUNCHING SOON
                </div>
              </h2>
              <p className="text-lg text-gray-300 mb-4 max-w-2xl mx-auto">
                Join thousands of creators building amazing games and experiences on VXLVerse
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 text-white text-xs sm:text-sm">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
                    ✓
                  </div>
                  <span>No coding</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 text-white text-xs sm:text-sm">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
                    ✓
                  </div>
                  <span>Quick create</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 text-white text-xs sm:text-sm">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
                    ✓
                  </div>
                  <span>Instant publish</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link
                    to="/editor/new"
                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Start Creating
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Sign Up Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
                <Link
                  to="/how-it-works"
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Features data
const features = [
  {
    icon: Box,
    title: "3D Model Library",
    description: "Access thousands of 3D models to use in your games and experiences",
  },
  {
    icon: Gamepad2,
    title: "Game Creation",
    description: "Build interactive games with our intuitive visual editor - no coding required",
  },
  {
    icon: Palette,
    title: "Art Gallery",
    description: "Showcase your 3D art creations in beautiful virtual galleries",
  },
  {
    icon: Zap,
    title: "Real-time Collaboration",
    description: "Work together with friends and teammates in real-time on your projects",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a thriving community of creators and players to share your work",
  },
  {
    icon: Trophy,
    title: "Competitions",
    description: "Participate in regular competitions and showcase your creative skills",
  },
];

// Featured games data
const featuredGames = [
  {
    id: "1",
    title: "Voxel Adventure",
    description: "Explore a vast voxel world filled with treasures and dangers",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=70",
    color: "#3b82f6",
    rating: "4.8",
    players: "2.3k",
  },
  {
    id: "2",
    title: "Cube Racer",
    description: "Race through challenging tracks in this high-speed voxel racing game",
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=70",
    color: "#8b5cf6",
    rating: "4.5",
    players: "1.8k",
  },
  {
    id: "3",
    title: "Block Battles",
    description: "Strategic multiplayer battles in a destructible voxel environment",
    image:
      "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=70",
    color: "#ec4899",
    rating: "4.7",
    players: "3.1k",
  },
];

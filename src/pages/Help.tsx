import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Gamepad, Palette, Keyboard, Info, Book, Box, Crown, HelpCircle } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function Help() {
  const helpSections: HelpSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Learn the basics of VXLVerse",
      icon: <Info className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Welcome to VXLVerse! This platform allows you to create, share, and explore 3D content
            including games, art galleries, and more.
          </p>
          <h4 className="text-lg font-semibold mt-4">Quick Start Guide:</h4>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Create an account or sign in to access all features</li>
            <li>Explore existing games and galleries for inspiration</li>
            <li>Try the editor demo to get familiar with the tools</li>
            <li>Create your first project using the "Create New" button</li>
            <li>Save and publish your work to share with others</li>
          </ol>
        </div>
      ),
    },
    {
      id: "3d-editor",
      title: "3D Editor",
      description: "How to use the 3D editor effectively",
      icon: <Box className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>The 3D editor is the core tool for creating interactive experiences in VXLVerse.</p>
          <h4 className="text-lg font-semibold mt-4">Editor Interface:</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Scene View: The main 3D viewport where you build your scene</li>
            <li>Object Hierarchy: Lists all objects in your scene</li>
            <li>Properties Panel: Edit properties of selected objects</li>
            <li>Model Library: Browse and add 3D models to your scene</li>
            <li>Toolbar: Access common tools and actions</li>
          </ul>
          <h4 className="text-lg font-semibold mt-4">Basic Operations:</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Add objects by selecting them from the Model Library</li>
            <li>Move, rotate, and scale objects using the transform controls</li>
            <li>Adjust object properties in the Properties Panel</li>
            <li>Save your work frequently using the Save button</li>
          </ul>
        </div>
      ),
    },
    {
      id: "keyboard-shortcuts",
      title: "Keyboard Shortcuts",
      description: "Boost your productivity with shortcuts",
      icon: <Keyboard className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>Use these keyboard shortcuts to work more efficiently in the editor.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <h4 className="text-lg font-semibold mb-2">Navigation</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Orbit Camera</span>
                  <span className="text-gray-400">Right Mouse + Drag</span>
                </li>
                <li className="flex justify-between">
                  <span>Pan Camera</span>
                  <span className="text-gray-400">Middle Mouse + Drag</span>
                </li>
                <li className="flex justify-between">
                  <span>Zoom Camera</span>
                  <span className="text-gray-400">Mouse Wheel</span>
                </li>
                <li className="flex justify-between">
                  <span>Focus Selected</span>
                  <span className="text-gray-400">F</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <h4 className="text-lg font-semibold mb-2">Transformation</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Select Tool</span>
                  <span className="text-gray-400">Q</span>
                </li>
                <li className="flex justify-between">
                  <span>Move Tool</span>
                  <span className="text-gray-400">W</span>
                </li>
                <li className="flex justify-between">
                  <span>Rotate Tool</span>
                  <span className="text-gray-400">E</span>
                </li>
                <li className="flex justify-between">
                  <span>Scale Tool</span>
                  <span className="text-gray-400">R</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <h4 className="text-lg font-semibold mb-2">Editing</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Duplicate</span>
                  <span className="text-gray-400">Ctrl/⌘ + D</span>
                </li>
                <li className="flex justify-between">
                  <span>Delete</span>
                  <span className="text-gray-400">Delete/Backspace</span>
                </li>
                <li className="flex justify-between">
                  <span>Undo</span>
                  <span className="text-gray-400">Ctrl/⌘ + Z</span>
                </li>
                <li className="flex justify-between">
                  <span>Redo</span>
                  <span className="text-gray-400">Ctrl/⌘ + Shift + Z</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
              <h4 className="text-lg font-semibold mb-2">Art Gallery</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Add Painting</span>
                  <span className="text-gray-400">B</span>
                </li>
                <li className="flex justify-between">
                  <span>Toggle Physics</span>
                  <span className="text-gray-400">P</span>
                </li>
                <li className="flex justify-between">
                  <span>Toggle Grid</span>
                  <span className="text-gray-400">G</span>
                </li>
                <li className="flex justify-between">
                  <span>Save Gallery</span>
                  <span className="text-gray-400">Ctrl/⌘ + S</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "art-galleries",
      title: "Art Galleries",
      description: "Create and explore virtual art galleries",
      icon: <Palette className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Art Galleries allow you to create virtual spaces to showcase artwork in a 3D
            environment.
          </p>
          <h4 className="text-lg font-semibold mt-4">Creating a Gallery:</h4>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Navigate to the Galleries page</li>
            <li>Click "Create New Gallery"</li>
            <li>Choose a template or start from scratch</li>
            <li>Use the editor to design your gallery space</li>
            <li>Add paintings using the "B" key or from the toolbar</li>
            <li>Upload your own artwork or use from the library</li>
            <li>Save and publish your gallery</li>
          </ol>
          <h4 className="text-lg font-semibold mt-4">Visiting Galleries:</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Browse galleries on the Galleries page</li>
            <li>Click on a gallery to enter it</li>
            <li>Use WASD keys and mouse to navigate</li>
            <li>Approach paintings to view them in detail</li>
            <li>Leave comments and likes to support creators</li>
          </ul>
        </div>
      ),
    },
    {
      id: "games",
      title: "Games",
      description: "Create and play interactive 3D games",
      icon: <Gamepad className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>VXLVerse allows you to create, share, and play 3D games directly in your browser.</p>
          <h4 className="text-lg font-semibold mt-4">Creating Games:</h4>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Navigate to the Games page</li>
            <li>Click "Create New Game"</li>
            <li>Select a template or start from scratch</li>
            <li>Use the editor to build your game world</li>
            <li>Add game objects, characters, and interactions</li>
            <li>Set up game logic using the visual scripting system</li>
            <li>Test your game frequently using the Play button</li>
            <li>Publish when ready to share with others</li>
          </ol>
          <h4 className="text-lg font-semibold mt-4">Playing Games:</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Browse games on the Games page</li>
            <li>Click on a game to open its details</li>
            <li>Press Play to start the game</li>
            <li>Most games use WASD for movement and mouse for looking/aiming</li>
            <li>Leave ratings and comments to support creators</li>
          </ul>
        </div>
      ),
    },
    {
      id: "account",
      title: "Account & Settings",
      description: "Manage your account and preferences",
      icon: <Crown className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>Learn how to manage your account, subscription, and application settings.</p>
          <h4 className="text-lg font-semibold mt-4">Account Management:</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Update your profile information in the Profile page</li>
            <li>Change your avatar by clicking on your profile picture</li>
            <li>View your created content in the Profile page</li>
            <li>Access your favorite items in the Favorites page</li>
            <li>Manage your subscription in the Settings page</li>
          </ul>
          <h4 className="text-lg font-semibold mt-4">Subscription Plans:</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Free: Basic access with limited storage and features</li>
            <li>Pro: Unlimited projects, premium models, and higher quality rendering</li>
            <li>Enterprise: Team collaboration, API access, and dedicated support</li>
            <li>
              Visit the{" "}
              <Link to="/pricing" className="text-blue-400 hover:text-blue-300 underline">
                Pricing page
              </Link>{" "}
              for more details
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "faq",
      title: "FAQ",
      description: "Frequently asked questions",
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold">What is VXLVerse?</h4>
            <p className="text-gray-300 mt-2">
              VXLVerse is a platform for creating, sharing, and exploring 3D content including
              games, art galleries, and interactive experiences directly in your browser.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Do I need to install anything?</h4>
            <p className="text-gray-300 mt-2">
              No, VXLVerse runs entirely in your web browser. No downloads or installations are
              required.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">What browsers are supported?</h4>
            <p className="text-gray-300 mt-2">
              VXLVerse works best on modern browsers like Chrome, Firefox, Edge, and Safari. We
              recommend keeping your browser updated for the best experience.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Can I use my own 3D models?</h4>
            <p className="text-gray-300 mt-2">
              Yes, Pro and Enterprise users can upload custom 3D models in common formats like GLB,
              GLTF, and OBJ.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">How do I report bugs or request features?</h4>
            <p className="text-gray-300 mt-2">
              You can report bugs and request features through the feedback form in the Settings
              page or by contacting our support team.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Is my content protected?</h4>
            <p className="text-gray-300 mt-2">
              Yes, you retain ownership of all content you create. You can choose to make your
              creations public or private.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Support",
      description: "Get help from our support team",
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>Need additional help? Our support team is ready to assist you.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
              <h4 className="text-lg font-semibold mb-3">Email Support</h4>
              <p className="text-gray-300 mb-4">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@vxlverse.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
              >
                Contact Support
              </a>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
              <h4 className="text-lg font-semibold mb-3">Community Forum</h4>
              <p className="text-gray-300 mb-4">
                Join our community forum to get help from other users and our team.
              </p>
              <a
                href="https://community.vxlverse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
              >
                Visit Forum
              </a>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Help & Documentation - VXLVerse</title>
        <meta
          name="description"
          content="Learn how to use VXLVerse with our comprehensive help guides and documentation"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-950 text-white">
        <Header />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400"
              >
                Help & Documentation
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-gray-300 mb-8"
              >
                Everything you need to know about using VXLVerse to create amazing 3D experiences
              </motion.p>
            </div>

            {/* Help Categories Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            >
              {helpSections.map((section, index) => (
                <motion.a
                  key={section.id}
                  href={`#${section.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  className="group p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-blue-500/30 hover:bg-gray-800/50 transition-all duration-300 flex flex-col"
                >
                  <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 w-fit">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    {section.title}
                  </h3>
                  <p className="text-gray-400">{section.description}</p>
                </motion.a>
              ))}
            </motion.div>

            {/* Help Content Sections */}
            <div className="space-y-16">
              {helpSections.map((section) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24 bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <div className="prose prose-invert max-w-none">{section.content}</div>
                </motion.section>
              ))}
            </div>

            {/* Back to Top Button */}
            <div className="flex justify-center mt-12">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 text-white font-medium transition-all duration-200 hover:bg-gray-700/70"
              >
                <span>Back to Top</span>
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

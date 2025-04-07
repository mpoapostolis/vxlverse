import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Helmet } from "react-helmet-async";
import {
  User,
  Settings,
  Edit,
  LogOut,
  Image as ImageIcon,
  Heart,
  Eye,
  Gamepad,
  Palette,
  Calendar,
  Clock,
  Mail,
  Shield,
  Bell,
  Lock,
  AlertCircle,
} from "lucide-react";
import { pb } from "../lib/pocketbase"; // Assuming PocketBase is configured
import { useAuthStore } from "../stores/authStore";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

// --- Helper Component for Loading Spinner ---
function LoadingSpinner({ size = "h-8 w-8", color = "border-blue-500" }) {
  return (
    <div className="flex justify-center items-center py-8">
      <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}></div>
    </div>
  );
}

// --- Main Profile Component ---
export function Profile() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  // --- State ---
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userGames, setUserGames] = useState([]);
  const [userGalleries, setUserGalleries] = useState([]);

  // Settings Form State
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    likes: true,
    newsletter: false,
  });

  // --- Effects ---

  // Effect for Authentication Check & Redirect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  }, [isAuthenticated, navigate]);

  // Effect for Data Fetching
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setIsLoading(false);
      return; // Don't fetch if not authenticated or user ID is missing
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userId = user.id;
        const gamesPromise = pb.collection("games").getFullList({
          filter: `user = "${userId}"`,
          sort: "-created",
        });
        const galleriesPromise = pb.collection("galleries").getFullList({
          filter: `user = "${userId}"`,
          sort: "-created",
        });

        const [gamesData, galleriesData] = await Promise.all([gamesPromise, galleriesPromise]);

        setUserGames(gamesData);
        setUserGalleries(galleriesData);

        // Update form data with fetched user details
        setFormData({ name: user.name || "", bio: user.bio || "" }); // Assuming 'bio' field exists
        // TODO: Fetch notification preferences if stored in DB
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("Could not load your profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, isAuthenticated]); // Rerun if user ID changes

  // --- Derived State / Constants ---
  const stats = [
    { label: "Games Created", value: userGames.length, icon: Gamepad },
    { label: "Galleries Created", value: userGalleries.length, icon: Palette },
    // TODO: Replace hardcoded values with fetched data
    { label: "Likes Received", value: user?.totalLikes || 124, icon: Heart },
    { label: "Total Views", value: user?.totalViews || 3842, icon: Eye },
  ];

  const recentActivity = [...userGames, ...userGalleries]
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .slice(0, 5);

  // --- Event Handlers ---
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs((prev) => ({ ...prev, [name]: checked }));
    // TODO: Add API call to update notification preferences immediately or on save
    console.log(`Notification ${name} toggled to ${checked}`);
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    console.log("Saving settings:", formData);
    // TODO: Implement API call to update user profile (name, bio)
    // Example: await pb.collection('users').update(user.id, { name: formData.name, bio: formData.bio });
    alert("Settings saved successfully! (Placeholder)");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("New avatar selected:", file);
      // TODO: Implement API call to upload new avatar
      // Example:
      // const avatarData = new FormData();
      // avatarData.append('avatar', file);
      // await pb.collection('users').update(user.id, avatarData);
      alert("Avatar update initiated! (Placeholder)");
    }
  };

  const handleEditProfileClick = () => {
    // Could scroll to settings tab or open a modal
    setActiveTab("settings");
    console.log("Edit Profile clicked");
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/login"); // Redirect after logout
  };

  // --- Render Logic ---
  if (!isAuthenticated) {
    // Although useEffect handles redirect, this prevents rendering flicker
    return null;
  }

  // Display loading state centered if still loading initial user data
  if (!user && isLoading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 min-h-screen bg-gray-900 flex items-center justify-center">
          <LoadingSpinner size="h-12 w-12" />
        </main>
        <Footer />
      </>
    );
  }

  // If user data is available but content is still loading
  const isContentLoading = isLoading && userGames.length === 0 && userGalleries.length === 0;

  return (
    <>
      <Helmet>
        <title>{`${user?.name || "Your"} Profile | VXLVerse`}</title>
        <meta
          name="description"
          content="Manage your VXLVerse profile, view your games and galleries, and update your settings."
        />
      </Helmet>

      <Header />

      <main className="pt-24 pb-16 min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* --- Profile Header --- */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-violet-600/20 rounded-xl blur-xl opacity-50 -z-10"></div>
            <div className="relative overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm bg-gray-900/60 shadow-lg">
              <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-700/40 via-purple-700/40 to-violet-700/40"></div>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20">
                  {/* Avatar */}
                  <div className="relative group shrink-0">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl overflow-hidden ring-4 ring-gray-900 border-2 border-white/20 shadow-xl">
                        {user.avatar ? (
                          <img
                            src={`${pb.baseUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`}
                            alt={user.name || user.email}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.style.display = "none")} // Hide img on error, show initial
                          />
                        ) : (
                          <span>{(user.name || user.email || "U").charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      {/* Edit avatar button */}
                      <div className="absolute bottom-1 right-1 p-2 rounded-full bg-gray-800 border border-white/10 text-white hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </label>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div className="min-w-0">
                        <h1
                          className="text-2xl sm:text-3xl font-bold text-white truncate"
                          title={user.name || "VXLVerse User"}
                        >
                          {user.name || "VXLVerse User"}
                        </h1>
                        <p
                          className="text-gray-400 flex items-center gap-1.5 mt-1 truncate"
                          title={user.email}
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{user.email}</span>
                        </p>
                        <div className="mt-2 text-xs bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-300 px-2.5 py-1 rounded-full inline-block border border-blue-500/30 font-medium">
                          {user.type || "Free"} Account
                        </div>
                      </div>
                      <button
                        onClick={handleEditProfileClick}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Stats --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center mb-3 ring-1 ring-inset ring-white/10">
                  <stat.icon className="w-5 h-5 text-blue-300" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* --- Tabs Navigation --- */}
          <div className="flex overflow-x-auto scrollbar-hide mb-6 border-b border-gray-700/50">
            {["overview", "games", "galleries", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 ${
                  activeTab === tab
                    ? "text-blue-400 border-blue-400"
                    : "text-gray-400 hover:text-gray-200 border-transparent hover:border-gray-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button
              onClick={handleLogoutClick}
              className="ml-auto px-4 py-2.5 text-sm font-medium whitespace-nowrap text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-t-md transition-colors duration-200 flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {/* --- Tab Content --- */}
          <div className="mb-8">
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 mb-6">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {/* --- Overview Tab --- */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                    {isContentLoading ? (
                      <LoadingSpinner />
                    ) : recentActivity.length > 0 ? (
                      <div className="space-y-3">
                        {recentActivity.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                          >
                            <div
                              className={`w-10 h-10 rounded-lg ${item.collectionName === "games" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"} flex items-center justify-center flex-shrink-0 ring-1 ring-inset ring-white/10`}
                            >
                              {item.collectionName === "games" ? (
                                <Gamepad className="w-5 h-5" />
                              ) : (
                                <Palette className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">
                                {item.title || item.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                You{" "}
                                {new Date(item.updated) > new Date(item.created)
                                  ? "updated"
                                  : "created"}{" "}
                                a {item.collectionName === "games" ? "game" : "gallery"}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                {new Date(item.created).toLocaleDateString()} -{" "}
                                {new Date(item.created).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No recent activity to show.</p>
                        <div className="mt-4 flex justify-center gap-4">
                          <Link
                            to="/create/game"
                            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-colors duration-200"
                          >
                            Create Game
                          </Link>
                          <Link
                            to="/create/gallery"
                            className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-400 text-sm transition-colors duration-200"
                          >
                            Create Gallery
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Info */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl font-bold text-white mb-4">Account Info</h2>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-400">
                          <User className="w-4 h-4" />
                          <span>Account Type</span>
                        </div>
                        <span className="text-white font-medium">{user.type || "Free"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>Joined</span>
                        </div>
                        <span className="text-white font-medium">
                          {user.created ? new Date(user.created).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      {/* TODO: Replace with actual storage data */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Shield className="w-4 h-4" />
                          <span>Storage Used</span>
                        </div>
                        <span className="text-white font-medium">?? MB / ?? MB</span>
                      </div>
                    </div>

                    {user.type === "Free" && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg border border-blue-500/30 shadow-inner">
                        <h3 className="text-white font-semibold mb-2">Upgrade to Pro</h3>
                        <p className="text-gray-300 text-sm mb-3">
                          Unlock more storage, advanced features, and support VXLVerse.
                        </p>
                        <Link
                          to="/pricing"
                          className="block w-full py-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg text-white text-center text-sm font-medium hover:opacity-90 transition-opacity duration-200 shadow"
                        >
                          View Plans
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- Games Tab --- */}
            {activeTab === "games" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Your Games ({userGames.length})</h2>
                  <Link
                    to="/create/game"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200 shadow"
                  >
                    Create New Game
                  </Link>
                </div>
                {isContentLoading ? (
                  <LoadingSpinner size="h-10 w-10" />
                ) : userGames.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userGames.map((game) => (
                      <div
                        key={game.id}
                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-gray-800/60 backdrop-blur-sm hover:border-white/20 transition-all duration-200 shadow-md"
                      >
                        <Link
                          to={`/games/${game.id}`}
                          className="block aspect-video w-full overflow-hidden"
                        >
                          {game.thumbnail ? (
                            <img
                              src={`${pb.baseUrl}/api/files/${game.collectionId}/${game.id}/${game.thumbnail}?thumb=300x169`} // Request thumbnail size
                              alt={game.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
                              <Gamepad className="w-10 h-10 text-gray-600" />
                            </div>
                          )}
                        </Link>
                        <div className="p-4">
                          <h3
                            className="text-lg font-semibold text-white truncate mb-1"
                            title={game.title}
                          >
                            {game.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1" title="Views">
                              <Eye className="w-4 h-4" />
                              <span>{game.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1" title="Likes">
                              <Heart className="w-4 h-4" />
                              <span>{game.likes || 0}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Link
                              to={`/games/${game.id}`}
                              className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white text-xs text-center transition-colors duration-200 font-medium"
                            >
                              View
                            </Link>
                            <Link
                              to={`/edit/game/${game.id}`}
                              className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded text-blue-400 text-xs text-center transition-colors duration-200 font-medium"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-800/40 backdrop-blur-sm border border-white/5 rounded-xl shadow-inner">
                    <Gamepad className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No Games Yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6 text-sm">
                      Ready to build something amazing? Create your first game and share it with the
                      VXLVerse community.
                    </p>
                    <Link
                      to="/create/game"
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200 shadow"
                    >
                      Create Your First Game
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* --- Galleries Tab --- */}
            {activeTab === "galleries" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    Your Galleries ({userGalleries.length})
                  </h2>
                  <Link
                    to="/create/gallery"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200 shadow"
                  >
                    Create New Gallery
                  </Link>
                </div>
                {isContentLoading ? (
                  <LoadingSpinner size="h-10 w-10" />
                ) : userGalleries.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userGalleries.map((gallery) => (
                      <div
                        key={gallery.id}
                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-gray-800/60 backdrop-blur-sm hover:border-white/20 transition-all duration-200 shadow-md"
                      >
                        <Link
                          to={`/gallery/${gallery.id}`}
                          className="block aspect-video w-full overflow-hidden"
                        >
                          {gallery.thumbnail ? (
                            <img
                              src={`${pb.baseUrl}/api/files/${gallery.collectionId}/${gallery.id}/${gallery.thumbnail}?thumb=300x169`} // Request thumbnail size
                              alt={gallery.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                              <Palette className="w-10 h-10 text-gray-600" />
                            </div>
                          )}
                        </Link>
                        <div className="p-4">
                          <h3
                            className="text-lg font-semibold text-white truncate mb-1"
                            title={gallery.name}
                          >
                            {gallery.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1" title="Views">
                              <Eye className="w-4 h-4" />
                              <span>{gallery.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1" title="Likes">
                              <Heart className="w-4 h-4" />
                              <span>{gallery.likes || 0}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Link
                              to={`/gallery/${gallery.id}`}
                              className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white text-xs text-center transition-colors duration-200 font-medium"
                            >
                              View
                            </Link>
                            <Link
                              to={`/edit/gallery/${gallery.id}`}
                              className="flex-1 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded text-purple-400 text-xs text-center transition-colors duration-200 font-medium"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-800/40 backdrop-blur-sm border border-white/5 rounded-xl shadow-inner">
                    <Palette className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No Galleries Yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6 text-sm">
                      Showcase your amazing 3D models and artwork. Create your first gallery today!
                    </p>
                    <Link
                      to="/create/gallery"
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200 shadow"
                    >
                      Create Your First Gallery
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* --- Settings Tab --- */}
            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Account Settings Form */}
                  <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
                    <form onSubmit={handleSettingsSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-300 mb-1.5"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={user.email}
                          readOnly
                          className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-500"
                          aria-label="Email Address (read-only)"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                          Email address cannot be changed here.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-300 mb-1.5"
                        >
                          Display Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your display name"
                          className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          maxLength={50}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="bio"
                          className="block text-sm font-medium text-gray-300 mb-1.5"
                        >
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell the community a little about yourself (optional)"
                          className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition"
                          maxLength={200}
                        ></textarea>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200 shadow flex items-center gap-2"
                          // Add disabled state while saving
                        >
                          {/* Add saving indicator here if needed */}
                          <Settings className="w-4 h-4" /> Save Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Notifications & Security */}
                  <div className="space-y-6">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 shadow-md">
                      <h2 className="text-lg font-bold text-white mb-4">Notifications</h2>
                      <div className="space-y-4">
                        {[
                          {
                            id: "email",
                            label: "Email Notifications",
                            icon: Bell,
                            pref: notificationPrefs.email,
                          },
                          {
                            id: "likes",
                            label: "Like Notifications",
                            icon: Heart,
                            pref: notificationPrefs.likes,
                          },
                          {
                            id: "newsletter",
                            label: "Newsletter",
                            icon: Mail,
                            pref: notificationPrefs.newsletter,
                          },
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <item.icon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">{item.label}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name={item.id}
                                checked={item.pref}
                                onChange={handleNotificationChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 shadow-md">
                      <h2 className="text-lg font-bold text-white mb-4">Security</h2>
                      <div className="space-y-3">
                        {/* Add Change Password Button/Link */}
                        <button className="w-full text-left px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-gray-400" /> Change Password
                        </button>
                        {/* Add Delete Account Button */}
                        <button className="w-full text-left px-4 py-2.5 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 rounded-lg text-red-300 text-sm font-medium transition-colors duration-200 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Component can be added here if needed */}
      {/* <Footer /> */}
    </>
  );
}

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Shield,
  Palette,
  Monitor,
  Zap,
  Volume2,
  Globe,
  Lock,
  Save,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { SettingItem } from "../components/settings/SettingItem";
import { ProfileSection } from "../components/settings/ProfileSection";

// Define types for our settings structure
interface SettingItem {
  id: string;
  icon: typeof Bell;
  label: string;
  description: string;
  type: "toggle" | "select";
  value: boolean | string;
  options?: string[];
}

interface SettingGroup {
  id: string;
  title: string;
  description: string;
  settings: SettingItem[];
}

export function Settings() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Group settings by category for better organization
  const settingsGroups = useMemo<SettingGroup[]>(
    () => [
      {
        id: "appearance",
        title: "Appearance",
        description: "Customize how VXLVerse looks and feels",
        settings: [
          {
            id: "theme",
            icon: Palette,
            label: "Theme",
            description: "Choose your preferred color theme",
            type: "select",
            value: "Dark",
            options: ["Dark", "Light", "System"],
          },
          {
            id: "quality",
            icon: Monitor,
            label: "Graphics Quality",
            description: "Adjust 3D rendering quality (affects performance)",
            type: "select",
            value: "High",
            options: ["Low", "Medium", "High", "Ultra"],
          },
          {
            id: "animations",
            icon: Zap,
            label: "UI Animations",
            description: "Enable or disable interface animations",
            type: "toggle",
            value: true,
          },
        ],
      },
      {
        id: "privacy",
        title: "Privacy & Security",
        description: "Control your data and who can see your content",
        settings: [
          {
            id: "profileVisibility",
            icon: Globe,
            label: "Profile Visibility",
            description: "Control who can see your profile",
            type: "select",
            value: "Public",
            options: ["Public", "Private", "Friends Only"],
          },
          {
            id: "contentVisibility",
            icon: Shield,
            label: "Content Visibility",
            description: "Default privacy for your new games and galleries",
            type: "select",
            value: "Public",
            options: ["Public", "Private", "Friends Only", "Unlisted"],
          },
          {
            id: "twoFactorAuth",
            icon: Lock,
            label: "Two-Factor Authentication",
            description: "Add an extra layer of security to your account",
            type: "toggle",
            value: false,
          },
        ],
      },
      {
        id: "notifications",
        title: "Notifications",
        description: "Manage how and when you receive updates",
        settings: [
          {
            id: "emailNotifications",
            icon: Bell,
            label: "Email Notifications",
            description: "Receive email updates about your account",
            type: "toggle",
            value: true,
          },
          {
            id: "likeNotifications",
            icon: Bell,
            label: "Like Notifications",
            description: "Get notified when someone likes your content",
            type: "toggle",
            value: true,
          },
          {
            id: "commentNotifications",
            icon: Bell,
            label: "Comment Notifications",
            description: "Get notified when someone comments on your content",
            type: "toggle",
            value: true,
          },
        ],
      },
      {
        id: "sound",
        title: "Sound",
        description: "Control audio settings for your experience",
        settings: [
          {
            id: "masterVolume",
            icon: Volume2,
            label: "Master Volume",
            description: "Adjust the overall volume of the application",
            type: "select" as const,
            value: "100%",
            options: ["Mute", "25%", "50%", "75%", "100%"],
          },
          {
            id: "uiSounds",
            icon: Volume2,
            label: "UI Sounds",
            description: "Enable or disable interface sound effects",
            type: "toggle",
            value: true,
          },
        ],
      },
    ],
    []
  );

  const handleSettingChange = (groupId: string, settingId: string, value: boolean | string) => {
    console.log(`Setting changed: ${groupId}.${settingId} = ${value}`);
    // Clone the settings groups to update the value
    const updatedGroups = [...settingsGroups];

    // Find the group and setting to update
    const groupIndex = updatedGroups.findIndex((group) => group.id === groupId);
    if (groupIndex !== -1) {
      const settingIndex = updatedGroups[groupIndex].settings.findIndex(
        (setting) => setting.id === settingId
      );
      if (settingIndex !== -1) {
        // Update the setting value
        updatedGroups[groupIndex].settings[settingIndex].value = value;
      }
    }

    // In a real implementation, you would update your state management store
    // or make an API call to save the settings
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Success
      setSaveMessage({
        type: "success",
        text: "Settings saved successfully!",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Helmet>
        <title>Settings | VXLVerse</title>
        <meta
          name="description"
          content="Customize your VXLVerse experience with personalized settings"
        />
      </Helmet>

      <Header />

      <main className="pt-24 pb-16 min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Settings
            </motion.h1>
            <p className="text-gray-400">Customize your VXLVerse experience</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation (on larger screens) */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-2 pr-4">
                {settingsGroups.map((group) => (
                  <a
                    key={group.id}
                    href={`#${group.id}`}
                    className="block px-4 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    {group.title}
                  </a>
                ))}

                <div className="mt-6 pt-6 border-t border-gray-800">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-70 rounded-lg text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-900/20"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>

                  {saveMessage && (
                    <div
                      className={`mt-3 p-2 text-sm rounded-md ${saveMessage.type === "success" ? "bg-green-900/30 text-green-300 border border-green-500/30" : "bg-red-900/30 text-red-300 border border-red-500/30"}`}
                    >
                      {saveMessage.text}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-10">
              {/* Profile Section */}
              <ProfileSection user={user} />

              {/* Settings Groups */}
              {settingsGroups.map((group) => (
                <motion.section
                  key={group.id}
                  id={group.id}
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="border-b border-gray-800 pb-2">
                    <h2 className="text-xl font-bold text-white">{group.title}</h2>
                    <p className="text-gray-400 text-sm">{group.description}</p>
                  </div>

                  <div className="space-y-3 rounded-xl overflow-hidden">
                    {group.settings.map((setting) => (
                      <SettingItem
                        key={setting.id}
                        icon={setting.icon}
                        label={setting.label}
                        description={setting.description}
                        type={setting.type}
                        value={setting.value}
                        options={setting.options}
                        onChange={(value) => handleSettingChange(group.id, setting.id, value)}
                      />
                    ))}
                  </div>
                </motion.section>
              ))}

              {/* Help & Support Section */}
              <section className="mt-12 pt-6 border-t border-gray-800">
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <HelpCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
                      <p className="text-gray-300 mb-4">
                        If you have any questions or need assistance with your settings, our support
                        team is here to help.
                      </p>
                      <a
                        href="#"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-white text-sm transition-colors duration-200"
                      >
                        Contact Support
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Save Button (Mobile) */}
              <div className="lg:hidden mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-70 rounded-lg text-white font-medium transition-all duration-200 shadow-lg shadow-blue-900/20"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>

                {saveMessage && (
                  <div
                    className={`mt-3 p-3 text-sm rounded-md ${saveMessage.type === "success" ? "bg-green-900/30 text-green-300 border border-green-500/30" : "bg-red-900/30 text-red-300 border border-red-500/30"}`}
                  >
                    {saveMessage.text}
                  </div>
                )}
              </div>

              {/* Danger Zone */}
              <section className="mt-12 pt-6 border-t border-gray-800">
                <div className="rounded-xl overflow-hidden border border-red-500/30">
                  <div className="bg-red-900/20 px-6 py-4 border-b border-red-500/30">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <h3 className="text-lg font-semibold text-red-300">Danger Zone</h3>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-900/60">
                    <p className="text-gray-300 mb-4">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                    <div className="space-y-3">
                      <button className="w-full sm:w-auto px-5 py-2.5 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 rounded-lg text-red-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

import { Mail, Edit, Calendar, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { pb } from "../../lib/pocketbase";

interface ProfileSectionProps {
  user: any | null;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  if (!user) return null;

  const joinDate = user.created ? new Date(user.created).toLocaleDateString() : "N/A";
  const accountType = user.type || "Free";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm bg-gray-800/50 shadow-lg"
    >
      {/* Header with gradient background */}
      <div className="p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-violet-600/10 -z-10"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden ring-2 ring-gray-900/80 border border-white/10 shadow-xl">
              {user.avatar ? (
                <img
                  src={`${pb.baseUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`}
                  alt={user.name || user.email}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                  }} // Hide img on error, show initial
                />
              ) : (
                <span>{(user.name || user.email || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white mb-1 truncate">
                  {user.name || "VXLVerse User"}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Joined {joinDate}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="text-xs bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-300 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-blue-500/30">
                    <Crown className="w-3 h-3" />
                    <span>{accountType} Account</span>
                  </div>

                  {accountType === "Free" && (
                    <Link
                      to="/pricing"
                      className="text-xs text-violet-300 hover:text-violet-200 transition-colors duration-200"
                    >
                      Upgrade
                    </Link>
                  )}
                </div>
              </div>

              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs transition-colors duration-200 whitespace-nowrap"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SettingItemProps {
  icon: LucideIcon;
  label: string;
  description: string;
  type: "toggle" | "select";
  value: boolean | string;
  options?: string[];
  onChange: (value: boolean | string) => void;
}

export function SettingItem({
  icon: Icon,
  label,
  description,
  type,
  value,
  options = [],
  onChange,
}: SettingItemProps) {
  return (
    <motion.div
      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-800/50 border border-white/10 backdrop-blur-sm rounded-lg hover:border-white/20 transition-all duration-200 gap-4"
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex gap-4 items-start">
        <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-lg ring-1 ring-white/10 shadow-inner">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-white mb-1">{label}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
        </div>
      </div>

      {type === "toggle" ? (
        <div className="ml-auto sm:ml-0">
          <button
            onClick={() => onChange(!value as boolean)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${value ? "bg-gradient-to-r from-blue-600 to-violet-600" : "bg-gray-700"} focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1 focus:ring-offset-gray-900`}
            aria-checked={value as boolean}
            role="switch"
          >
            <span className="sr-only">{value ? "Enabled" : "Disabled"}</span>
            <motion.div
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md`}
              animate={{
                x: value ? 24 : 0,
                backgroundColor: value ? "#ffffff" : "#d1d5db",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      ) : (
        <div className="w-full sm:w-auto">
          <select
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 bg-gray-900/80 text-white border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 appearance-none cursor-pointer transition-colors duration-200 hover:border-white/20 pr-8"
            style={{
              backgroundImage:
                "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22white%22 viewBox=%220 0 16 16%22><path d=%22M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z%22/></svg>')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "12px",
            }}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </motion.div>
  );
}

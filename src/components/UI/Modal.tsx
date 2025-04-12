import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  return (
    isOpen && (
      <div className="fixed top-0 left-0 h-screen inset-0 flex items-center justify-center z-50">
        {/* Backdrop with blur */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-sm"
        />

        {/* Modal Container with max height and scrolling */}
        <div className="w-full max-w-2xl mx-4 max-h-[90vh] relative">
          {/* Glass background with gradient borders */}
          <div className="relative  overflow-hidden bg-gradient-to-br p-[1px] from-white/20 via-white/0 to-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-purple-500/10 animate-gradient" />

            <div className="relative  overflow-hidden bg-gradient-to-br from-gray-900/95 via-gray-900/98 to-gray-800/95 backdrop-blur-xl">
              {/* Header - Fixed */}
              <div className="p-6 pb-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/95">
                <div className="flex items-center justify-between">
                  <div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-1"
                  >
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 text-transparent bg-clip-text">
                      {title}
                    </h2>
                    <div className="h-px w-full bg-gradient-to-r from-blue-500/50 via-violet-500/50 to-purple-500/50" />
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5  transition-all duration-200 hover:shadow-lg hover:shadow-black/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="overflow-y-auto max-h-[calc(90vh-8rem)] scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                <div className="p-6 relative">
                  <div className="relative z-10">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

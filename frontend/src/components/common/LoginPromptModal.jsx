import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPromptModal({
  open,
  onClose,
  title = "Log in to unlock premium insights",
  message = "Sign in to see your match score, AI resume insights, and instant job alerts.",
}) {
  const navigate = useNavigate();

  // Portal keeps `position: fixed` intact even when the trigger sits inside a
  // transformed ancestor (e.g. a hover-animated card).
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/25">
              <Lock className="h-6 w-6 text-white" />
            </div>

            <h3 className="text-center text-xl font-bold text-slate-900">
              {title}
            </h3>
            <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">
              {message}
            </p>

            <div className="mt-7 space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-600/25"
              >
                Log in
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
              >
                Create free account
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              It only takes a minute — and browsing jobs stays free.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

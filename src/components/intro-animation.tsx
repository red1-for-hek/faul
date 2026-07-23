import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import logo from "@/assets/itc-logo.png.asset.json";

export default function IntroAnimation({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => onDone(), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#03060f]"
      >
        {/* Scanning grid */}
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(56,189,248,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.18)_1px,transparent_1px)] [background-size:48px_48px]" />
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{ duration: 2.4, ease: "easeInOut" }}
          className="pointer-events-none absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent blur-2xl"
        />

        {/* Rotating rings around logo */}
        <div className="relative flex flex-col items-center">
          <div className="relative h-56 w-56 sm:h-72 sm:w-72">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-cyan-400/40 [mask-image:conic-gradient(from_0deg,black,transparent_70%)]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute inset-3 rounded-full border border-blue-500/40 [mask-image:conic-gradient(from_180deg,black,transparent_60%)]"
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-6 rounded-full bg-cyan-500/20 blur-2xl"
            />

            <motion.img
              src={logo.url}
              alt="BNMPC IT Club"
              initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-8 h-[calc(100%-4rem)] w-[calc(100%-4rem)] object-contain drop-shadow-[0_0_35px_rgba(56,189,248,0.55)]"
            />
          </div>

          {/* Typing text */}
          <div className="mt-10 h-8 overflow-hidden text-center">
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.p
                  key="p0"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="font-mono text-xs tracking-[0.5em] text-cyan-300/80 sm:text-sm"
                >
                  &gt; INITIALIZING SYSTEM
                </motion.p>
              )}
              {phase === 1 && (
                <motion.p
                  key="p1"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="font-mono text-xs tracking-[0.5em] text-cyan-300/80 sm:text-sm"
                >
                  &gt; BNMPC · IT · CLUB
                </motion.p>
              )}
              {phase === 2 && (
                <motion.p
                  key="p2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="font-mono text-xs tracking-[0.5em] text-cyan-300 sm:text-sm"
                >
                  &gt; ACCESS GRANTED
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Corner brackets */}
        {[
          "top-6 left-6 border-l-2 border-t-2",
          "top-6 right-6 border-r-2 border-t-2",
          "bottom-6 left-6 border-l-2 border-b-2",
          "bottom-6 right-6 border-r-2 border-b-2",
        ].map((c) => (
          <div key={c} className={`absolute h-10 w-10 border-cyan-400/60 ${c}`} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

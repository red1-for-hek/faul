import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Toaster } from "sonner";
import ShaderBackground from "@/components/ui/shader-background";
import IntroAnimation from "@/components/intro-animation";
import RecruitmentForm from "@/components/recruitment-form";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BNMPC IT Club · Volunteer Recruitment" },
      {
        name: "description",
        content:
          "Apply to join the BNMPC IT Club — a community of student builders, designers and problem solvers at Birshreshtha Noor Mohammad Public College.",
      },
      { property: "og:title", content: "BNMPC IT Club · Volunteer Recruitment" },
      {
        property: "og:description",
        content:
          "Volunteer with the BNMPC IT Club. Apply now to join our next cohort.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03060f] text-white">
      <ShaderBackground />
      {/* Vignette + subtle noise */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,6,15,0.65)_70%,rgba(3,6,15,0.95)_100%)]" />

      {!introDone && <IntroAnimation onDone={() => setIntroDone(true)} />}

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:py-20"
      >
        <RecruitmentForm />

        <footer className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400/70">
          © BNMPC IT Club · Birshreshtha Noor Mohammad Public College
        </footer>
      </motion.main>

      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}

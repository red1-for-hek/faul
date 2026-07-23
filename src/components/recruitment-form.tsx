import { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Hash,
  Users,
  Facebook,
  Send,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/itc-logo.png.asset.json";

const MESSENGER_GROUP_URL = "https://m.me/j/AbYourGroupLinkHere/";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  className: z.string().trim().min(1, "Select your class").max(40),
  roll: z
    .string()
    .trim()
    .min(1, "Enter your roll")
    .max(10)
    .regex(/^[0-9]+$/, "Digits only"),
  section: z.string().trim().min(1, "Select your section").max(2),
  email: z.string().trim().email("Invalid email").max(120),
  contact: z.string().trim().min(6, "Enter a valid phone number").max(20),
  facebook: z
    .string()
    .trim()
    .url("Enter a valid Facebook profile URL")
    .max(200)
    .refine((v) => /facebook\.com|fb\.com|fb\.me/i.test(v), {
      message: "Must be a Facebook URL",
    }),
});

type FormValues = z.infer<typeof schema>;

const CLASSES = ["Class 9", "Class 10", "Class 11", "Class 12", "Alumni"];
const SECTIONS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
);

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/70">
      {children}
    </span>
  );
}

const inputBase =
  "peer w-full rounded-xl border border-cyan-400/20 bg-white/[0.03] py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-400/60 outline-none backdrop-blur-sm transition-all focus:border-cyan-300/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]";

export default function RecruitmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 900));
    console.log("Recruitment submission:", data);
    toast.success("Application received. Welcome to the club!");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto w-full max-w-xl"
      >
        <div className="glow-card p-8 text-center sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/15 ring-1 ring-cyan-400/40">
            <CheckCircle2 className="h-10 w-10 text-cyan-300" strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white">
            You&apos;re in.
          </h2>
          <p className="mt-3 text-sm text-slate-300/80">
            Your application has been recorded. Join the official Messenger
            group to receive onboarding details, meeting invites and your first
            task.
          </p>
          <a
            href={MESSENGER_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8 inline-flex items-center gap-2"
          >
            Join Messenger Group
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-2xl"
    >
      <div className="glow-card p-6 sm:p-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.img
            src={logo.url}
            alt="BNMPC IT Club"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="h-20 w-20 drop-shadow-[0_0_25px_rgba(56,189,248,0.45)] sm:h-24 sm:w-24"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-200">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </span>
            Recruitment · Open
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Join the{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              BNMPC IT Club
            </span>
          </h1>
          <p className="max-w-md text-sm text-slate-300/80">
            An Empirical Deep Dive Into The Tech Realm.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <Field label="Full name" error={errors.fullName?.message}>
            <FieldIcon><User className="h-4 w-4" /></FieldIcon>
            <input
              {...register("fullName")}
              placeholder="Your name"
              className={inputBase}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Class" error={errors.className?.message}>
              <FieldIcon><GraduationCap className="h-4 w-4" /></FieldIcon>
              <select {...register("className")} defaultValue="" className={inputBase + " appearance-none"}>
                <option value="" disabled>Select class</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c} className="bg-[#0a1224]">{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Roll" error={errors.roll?.message}>
              <FieldIcon><Hash className="h-4 w-4" /></FieldIcon>
              <input
                {...register("roll")}
                inputMode="numeric"
                placeholder="e.g. 123"
                className={inputBase}
              />
            </Field>
            <Field label="Section" error={errors.section?.message}>
              <FieldIcon><Users className="h-4 w-4" /></FieldIcon>
              <select {...register("section")} defaultValue="" className={inputBase + " appearance-none"}>
                <option value="" disabled>A–Z</option>
                {SECTIONS.map((s) => (
                  <option key={s} value={s} className="bg-[#0a1224]">{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" error={errors.email?.message}>
              <FieldIcon><Mail className="h-4 w-4" /></FieldIcon>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={inputBase}
              />
            </Field>
            <Field label="Contact no." error={errors.contact?.message}>
              <FieldIcon><Phone className="h-4 w-4" /></FieldIcon>
              <input
                {...register("contact")}
                placeholder="+880 1XXX-XXXXXX"
                className={inputBase}
              />
            </Field>
          </div>

          <Field label="Facebook profile URL" error={errors.facebook?.message}>
            <FieldIcon><Facebook className="h-4 w-4" /></FieldIcon>
            <input
              {...register("facebook")}
              placeholder="https://facebook.com/your.profile"
              className={inputBase}
            />
          </Field>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary group relative mt-2 flex w-full items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <p className="pt-1 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400/70">
            After submitting you&apos;ll get the Messenger group link
          </p>
        </form>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-200/80">
        {label}
      </span>
      <div className="relative">{children}</div>
      {error && (
        <span className="mt-1 block text-xs text-rose-300/90">{error}</span>
      )}
    </label>
  );
}

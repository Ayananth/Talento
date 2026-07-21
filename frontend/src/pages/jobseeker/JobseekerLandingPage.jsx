import { motion } from "framer-motion";
import {
  Search,
  FileText,
  MessageSquare,
  Bookmark,
  Target,
  BellRing,
  Sparkles,
  ArrowRight,
  Filter,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/jobseeker/hero-1.png";

import JobsOfTheDay from "../../components/jobseeker/jobs/JobsOfTheDay";
import TopRecruiters from "../../components/jobseeker/recruiters/TopRecruiters";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const platformFeatures = [
  {
    icon: Search,
    title: "Smart job discovery",
    description:
      "Search by role, city, work mode, experience, and salary — then open roles that actually fit you.",
  },
  {
    icon: Filter,
    title: "Filters that stay with you",
    description:
      "Narrow listings by job type, posted date, and more so you spend time on the right openings.",
  },
  {
    icon: FileText,
    title: "Profile & resume ready",
    description:
      "Upload your resume once, keep your profile current, and apply without starting from scratch.",
  },
  {
    icon: Bookmark,
    title: "Saved & applied tracking",
    description:
      "Bookmark roles to revisit later and follow every application from one place.",
  },
  {
    icon: MessageSquare,
    title: "Direct recruiter chat",
    description:
      "Message hiring teams, get updates, and keep conversations tied to the jobs you care about.",
  },
  {
    icon: ShieldCheck,
    title: "Verified hiring companies",
    description:
      "Browse openings from recruiters on Talento — including top companies actively hiring now.",
  },
];

const proFeatures = [
  {
    icon: Target,
    title: "Job match score",
    description:
      "See how closely your resume aligns with each role before you apply.",
  },
  {
    icon: Sparkles,
    title: "AI job insights",
    description:
      "Get a clear summary of your strengths and gaps against the job description.",
  },
  {
    icon: BellRing,
    title: "Instant job alerts",
    description:
      "Hear about strong matches as soon as relevant roles go live.",
  },
];

const steps = [
  {
    step: "01",
    title: "Discover",
    description: "Explore live openings and companies hiring on Talento.",
  },
  {
    step: "02",
    title: "Match",
    description: "Use filters — and Pro insights — to focus on roles that fit.",
  },
  {
    step: "03",
    title: "Apply",
    description: "Submit with your resume, track status, and chat with recruiters.",
  },
];

export default function JobseekerLandingPage() {
  return (
    <div className="bg-white">
      {/* HERO — full-bleed visual plane */}
      <section className="relative min-h-[min(92vh,880px)] overflow-hidden">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-blue-950/45" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto flex min-h-[min(92vh,880px)] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeUp}
              className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl"
            >
              Talento
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-[2.75rem]"
            >
              Find work that fits — and apply with clarity.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200"
            >
              Search live roles, showcase your resume, and move faster with AI
              match scores and insights when you need them.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/jobsearch"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Explore jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Create free account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 md:text-4xl">
              From search to offer, in three steps
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              A focused path for job seekers — discover roles, decide with
              confidence, and stay organized while you apply.
            </p>
          </motion.div>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-14 grid gap-10 md:grid-cols-3"
          >
            {steps.map((item) => (
              <motion.li key={item.step} variants={fadeUp} className="relative">
                <span className="font-display text-5xl font-extrabold text-blue-100">
                  {item.step}
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Platform
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 md:text-4xl">
              Everything you need to run your job search
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Built for the full journey — not just browsing listings.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={fadeUp}>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* TALENTO PRO */}
      <section className="relative overflow-hidden border-y border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 py-20">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Talento Pro
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 md:text-4xl">
                AI tools that sharpen every application
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Upgrade when you want match scores, JD insights, and alerts —
                so you apply where you have the strongest fit.
              </p>
            </div>
            <Link
              to="/premium"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 lg:self-auto"
            >
              Explore Pro
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-12 grid gap-8 md:grid-cols-3"
          >
            {proFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="border-t border-blue-200/80 pt-6"
                >
                  <Icon className="h-6 w-6 text-blue-600" strokeWidth={1.75} />
                  <h3 className="mt-4 font-display text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* LIVE SOCIAL PROOF */}
      <TopRecruiters />
      <JobsOfTheDay />

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden bg-slate-900 py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #60a5fa 0%, transparent 45%), radial-gradient(circle at 80% 70%, #38bdf8 0%, transparent 40%)",
          }}
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.div
            variants={fadeUp}
            className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300"
          >
            <Briefcase className="h-6 w-6" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl font-bold text-white md:text-4xl"
          >
            Ready to start your next role?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-slate-300"
          >
            Join Talento, set up your profile, and browse openings from
            companies hiring now.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/jobsearch"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse jobs
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

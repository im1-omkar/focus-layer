import { useState } from "react";

/* ---------- data ---------- */

const heatmap = [
  0, 1, 2, 3, 2, 1, 0,
  1, 2, 3, 3, 2, 1, 0,
  2, 3, 3, 2, 1, 0, 1,
  3, 3, 2, 1, 0, 1, 2,
  2, 1, 0, 1, 2, 3, 3,
  1, 0, 1, 2, 3, 2, 1,
  0, 1, 2, 3, 2, 1, 0,
  1, 2, 3, 2, 1, 0, 1,
  2, 3, 2, 1, 0, 1, 2,
  3, 2, 1, 0, 1, 2, 3,
];

const heatColors = [
  "rgba(255,255,255,0.04)",
  "#5C3A24",
  "#B85A2E",
  "#FF8F5C",
];

// One self-rated score per day, out of 10 — the only thing the user actually enters
const dailyScores = [6, 7, 5, 8, 7, 9, 8, 6, 7, 9, 8, 9, 7, 9];
/* ---------- signature visual: daily score line, one point per day ---------- */

function ScoreLine({
  scores,
  height = 220,
}: {
  scores: number[];
  height?: number;
}) {
  const max = 10;
  const padX = 40;
  const w = 1000;
  const innerW = w - padX * 2;
  const step = scores.length > 1 ? innerW / (scores.length - 1) : 0;

  const coords = scores.map((s, i) => {
    const x = padX + i * step;
    const y = height - 30 - (s / max) * (height - 60);
    return { x, y, s };
  });

  const linePoints = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className="w-full block"
      style={{ height }}
      role="img"
      aria-label={`Daily focus score over the last ${scores.length} days, most recent score ${scores[scores.length - 1]} out of 10`}
    >
      <defs>
        <linearGradient id="scoreLineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B85A2E" />
          <stop offset="100%" stopColor="#FF8F5C" />
        </linearGradient>
        <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* guide lines for the score range */}
      {[0, 2.5, 5, 7.5, 10].map((g) => {
        const y = height - 30 - (g / max) * (height - 60);
        return (
          <line
            key={g}
            x1={padX}
            y1={y}
            x2={w - padX}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      <polyline
        points={linePoints}
        fill="none"
        stroke="url(#scoreLineGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {coords.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r={i === coords.length - 1 ? 7 : 4.5}
          fill={i === coords.length - 1 ? "#FF8F5C" : "#1B1310"}
          stroke="#FF8F5C"
          strokeWidth={i === coords.length - 1 ? 0 : 2}
          filter={i === coords.length - 1 ? "url(#dotGlow)" : undefined}
        />
      ))}
    </svg>
  );
}

/* ---------- small ui atoms ---------- */

function DailyScoreDial() {
  const [score, setScore] = useState(8);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <span
          className="text-6xl font-semibold text-white"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {score}
          <span className="text-xl text-[#6B6B70] font-sans ml-1">/10</span>
        </span>
        <span className="text-xs text-[#6B6B70] mb-2">
          {score >= 8 ? "Sharp day" : score >= 5 ? "Decent day" : "Scattered day"}
        </span>
      </div>

      <div className="flex gap-1.5 mb-7" role="group" aria-label="Rate today's focus from 1 to 10">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => {
              setScore(n);
              setSubmitted(false);
            }}
            aria-label={`Rate ${n} out of 10`}
            aria-pressed={score === n}
            className="flex-1 h-10 rounded-md transition-all"
            style={{
              backgroundImage:
                n <= score
                  ? "linear-gradient(180deg, #FF8F5C, #B85A2E)"
                  : undefined,
              backgroundColor: n <= score ? undefined : "rgba(255,255,255,0.06)",
              transform: n === score ? "scaleY(1.15)" : "scaleY(1)",
            }}
          />
        ))}
      </div>

      <button
        onClick={() => setSubmitted(true)}
        className="w-full py-3.5 rounded-xl text-[#0A0A0B] font-semibold text-sm tracking-wide hover:scale-[1.02] transition-transform"
        style={{
          backgroundImage: "linear-gradient(135deg, #FFB088, #FF6B35)",
        }}
      >
        {submitted ? "Saved ✓" : "Log today's score"}
      </button>
    </div>
  );
}

function GlassCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl ${className}`}
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 30px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </div>
  );
}

function FeatureCard({
  index,
  title,
  copy,
}: {
  index: string;
  title: string;
  copy: string;
}) {
  return (
    <GlassCard className="p-8 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group">
      <span className="font-mono text-xs tracking-[0.2em] text-[#FF8F5C]">
        {index}
      </span>
      <h3 className="mt-5 text-2xl font-medium text-white">{title}</h3>
      <p className="mt-3 text-[#9A968D] leading-relaxed">{copy}</p>
      <div className="mt-6 h-px w-0 group-hover:w-full bg-gradient-to-r from-[#FF6B35] to-transparent transition-all duration-500" />
    </GlassCard>
  );
}

/* ---------- page ---------- */

const Home = () => {
  return (
    <div
      className="min-h-screen text-[#E8E6E1] relative overflow-x-hidden"
      style={{
        fontFamily:
          "-apple-system, 'SF Pro Display', system-ui, sans-serif",
        backgroundColor: "#08080A",
      }}
    >
      {/* ambient light blooms */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,53,0.35), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-[1900px] right-0 w-[700px] h-[700px] rounded-full opacity-25 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,53,0.4), transparent 70%)",
        }}
      />

      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 pt-7 pb-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex w-2.5 h-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-gradient-to-br from-[#FF8F5C] to-[#FF6B35]" />
          </span>
          <span className="text-sm tracking-[0.15em] uppercase font-semibold text-white">
            Focus Layer
          </span>
        </div>
        <button className="text-sm text-[#9A968D] hover:text-white transition-colors hidden sm:inline">
          Sign in
        </button>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-0 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8F5C]" />
          <span className="text-xs tracking-wide text-[#9A968D]">
            Takes 10 seconds a day
          </span>
        </div>

        <h1
          className="text-[4rem] md:text-[6.5rem] leading-[0.95] tracking-tight font-semibold"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Attention,
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #FF6B35, #FF8F5C, #FFB088)",
            }}
          >
            measured.
          </span>
        </h1>

        <p className="mt-8 text-xl text-[#9A968D] leading-relaxed max-w-xl mx-auto">
          Most focus apps ask you to trust a feeling. Focus Layer asks
          one honest question at the end of the day — rate your focus,
          1 to 10 — and turns that single number into a history you can
          actually see.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            className="px-8 py-4 rounded-full text-[#0A0A0B] font-semibold text-sm tracking-wide hover:scale-[1.03] transition-transform"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #FFB088, #FF6B35)",
              boxShadow: "0 8px 30px rgba(255,107,53,0.35)",
            }}
          >
            Rate today →
          </button>
          <button className="px-8 py-4 rounded-full border border-white/15 text-white text-sm tracking-wide hover:bg-white/5 transition-colors">
            Watch the demo
          </button>
        </div>

        {/* the actual product moment: a daily self-rating */}
        <div className="mt-20 max-w-md mx-auto">
          <GlassCard className="overflow-hidden p-8">
            <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B6B70] mb-2">
              Today's reading
            </p>
            <p className="text-sm text-[#9A968D] mb-8">
              How focused did today feel?
            </p>
            <DailyScoreDial />
          </GlassCard>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-24 relative z-10">
        <GlassCard className="p-8 md:p-10">
          <div className="flex flex-wrap justify-between items-baseline gap-4 mb-10 border-b border-white/10 pb-6">
            <h2 className="text-xs tracking-[0.18em] uppercase text-[#FF8F5C]">
              Focus dashboard
            </h2>
            <span
              className="text-3xl font-semibold text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {dailyScores[dailyScores.length - 1]}
              <span className="text-sm text-[#6B6B70] ml-1 font-sans">
                / 10 today
              </span>
            </span>
          </div>

          {/* Stats — all derived from a single daily self-rating, nothing implying duration tracking */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.05] transition-colors">
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B6B70]">
                Today's score
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {dailyScores[dailyScores.length - 1]}
                <span className="text-lg text-[#6B6B70]">/10</span>
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.05] transition-colors">
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B6B70]">
                Days logged in a row
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                17
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.05] transition-colors">
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B6B70]">
                14-day average
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {(dailyScores.reduce((a, b) => a + b, 0) / dailyScores.length).toFixed(1)}
                <span className="text-lg text-[#6B6B70]">/10</span>
              </p>
            </div>
          </div>

          {/* Score history — one point per day, entered by hand */}
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-baseline justify-between mb-6">
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B6B70]">
                Daily score — last 14 days
              </p>
              <p className="text-[11px] text-[#6B6B70]">
                1 rating per day, entered by you
              </p>
            </div>
            <ScoreLine scores={dailyScores} height={180} />
          </div>

          {/* Heatmap — colored by the same daily score */}
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B6B70] mb-5">
              Consistency — last 10 weeks
            </p>
            <div className="grid grid-cols-7 gap-1.5 max-w-md">
              {heatmap.map((value, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded-sm hover:scale-125 transition-transform"
                  style={{ backgroundColor: heatColors[value] }}
                />
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Why */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center relative z-10">
        <p className="text-xs tracking-[0.18em] uppercase text-[#FF8F5C] font-semibold mb-6">
          Why a reading matters
        </p>
        <h2
          className="text-4xl md:text-5xl leading-tight font-semibold text-white"
          style={{ fontFamily: "Georgia, serif" }}
        >
          You can't improve what you don't measure.
        </h2>
        <p className="text-[#9A968D] mt-7 text-xl leading-relaxed">
          Modern technology is built to fragment attention. Focus Layer
          gives concentration a number, a shape and a history — so you
          can see exactly where it goes, what protects it, and what
          breaks it.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12 pb-28 relative z-10">
        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard
            index="01 — Rating"
            title="One score, once a day"
            copy="No timers, no session logs. At the end of the day, rate your focus from 1 to 10 — that's the only input the app needs."
          />
          <FeatureCard
            index="02 — Analytics"
            title="Analytics"
            copy="Each rating becomes a point on your history. Watch the line over weeks instead of trusting a vague feeling about 'lately'."
          />
          <FeatureCard
            index="03 — Reflection"
            title="Daily Reflection"
            copy="Right after you rate the day, a short prompt asks what shaped that number — so the score comes with context."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #FF6B35, #FF8F5C 50%, #B85A2E)",
            }}
          />
          <div className="relative px-6 py-24 text-center">
            <p className="text-xs tracking-[0.18em] uppercase font-semibold text-[#1A0E07] mb-6">
              No. 004 — Final reading
            </p>
            <h2
              className="text-5xl md:text-6xl leading-[0.95] font-semibold text-[#0A0A0B]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Stop guessing.
              <br />
              Start measuring.
            </h2>
            <button className="mt-10 px-9 py-5 rounded-full bg-[#0A0A0B] text-white text-sm tracking-wide uppercase font-semibold hover:scale-[1.03] transition-transform shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              Take your first reading →
            </button>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 mt-12 border-t border-white/10 flex justify-between items-center relative z-10">
        <span className="text-xs text-[#6B6B70]">
          © {new Date().getFullYear()} Focus Layer
        </span>
        <span className="text-xs text-[#6B6B70]">NO. 001</span>
      </footer>
    </div>
  );
};

export default Home;
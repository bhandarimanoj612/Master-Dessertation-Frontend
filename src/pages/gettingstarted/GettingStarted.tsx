import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, BarChart3, ShieldCheck,
  Users, Wrench, User, Store, ClipboardCheck, Clock, Smartphone,
  CheckCircle2, Star, Zap, Globe, Award,
  ChevronRight, Play, Package, AlertCircle, ThumbsUp,
  FileText, Bell, Search, MessageSquare, ChevronLeft,
} from "lucide-react";
import DarkModeToggle from "../../global/layout/appbar-component/dark-mode-toggle";
import Logo from "../../global/layout/appbar-component/logo";

type Audience = "shop" | "customer";

/* ─── Animated counter ─── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / (1400 / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Status badge ─── */
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    "Pending":     "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    "In Progress": "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300",
    "Completed":   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "Ready":       "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[status] || ""}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />{status}
    </span>
  );
};

/* ─── Dashboard Preview ─── */
function DashboardPreview({ audience }: { audience: Audience }) {
  const repairs = [
    { id: "RPR-1042", device: "iPhone 14 Pro", issue: "Cracked screen",  status: "In Progress", tech: "Raj K.",  time: "2h ago" },
    { id: "RPR-1041", device: "MacBook Air M2", issue: "Battery replace", status: "Completed",   tech: "Sita M.", time: "4h ago" },
    { id: "RPR-1040", device: "Samsung S23",    issue: "Water damage",    status: "Pending",     tech: "—",       time: "6h ago" },
    { id: "RPR-1039", device: "Dell XPS 15",    issue: "Keyboard fault",  status: "Ready",       tech: "Hari B.", time: "1d ago" },
  ];
  if (audience === "customer") {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] shadow-xl overflow-hidden">
        <div className="h-1 bg-blue-900" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-900/10 flex items-center justify-center">
                <Smartphone size={13} className="text-blue-900 dark:text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">My Repairs</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Live updates</span>
          </div>
          <div className="space-y-2.5 mb-4">
            {repairs.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50/80 dark:bg-white/[0.02] px-3.5 py-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/10 flex items-center justify-center flex-shrink-0">
                  <Wrench size={13} className="text-blue-900 dark:text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">{r.device}</div>
                  <div className="text-[10px] text-gray-400">{r.issue}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <StatusBadge status={r.status} />
                  <div className="text-[10px] text-gray-400 mt-1">{r.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 px-3.5 py-3 flex items-center gap-2.5">
            <Bell size={13} className="text-blue-900 dark:text-blue-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-blue-900 dark:text-blue-300">Update: iPhone 14 Pro</div>
              <div className="text-[10px] text-blue-700/70 dark:text-blue-400/60">Technician started screen replacement</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] shadow-xl overflow-hidden">
      <div className="h-1 bg-blue-900" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-gray-900 dark:text-white">Repair Dashboard</span>
          <div className="flex gap-1.5">
            <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center">
              <Search size={11} className="text-gray-400" />
            </div>
            <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center">
              <Bell size={11} className="text-gray-400" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Active",     value: "24", color: "text-blue-900 dark:text-blue-400" },
            { label: "Done Today", value: "11", color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Pending",    value: "7",  color: "text-amber-600 dark:text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] p-2.5 text-center">
              <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-gray-400 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {repairs.map((r) => (
            <div key={r.id} className="flex items-center gap-2.5 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50/60 dark:bg-white/[0.02] px-3 py-2.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-gray-400">{r.id}</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-white truncate">{r.device}</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">{r.tech !== "—" ? `Tech: ${r.tech}` : "Unassigned"}</div>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Feature card ─── */
const FeatureCard = ({ icon, title, desc, tag }: { icon: React.ReactNode; title: string; desc: string; tag?: string }) => (
  <div className="group relative rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] p-5 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    {tag && (
      <div className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-900/10 dark:bg-blue-400/10 text-blue-900 dark:text-blue-400">{tag}</div>
    )}
    <div className="w-10 h-10 rounded-xl bg-blue-900/8 dark:bg-white/8 border border-blue-900/10 dark:border-white/10 flex items-center justify-center text-blue-900 dark:text-white mb-3">{icon}</div>
    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{title}</h3>
    <p className="text-xs leading-relaxed text-gray-500 dark:text-white/40">{desc}</p>
    <div className="mt-4 h-0.5 w-0 bg-blue-900 group-hover:w-full transition-all duration-500 rounded-full" />
  </div>
);

/* ─── Testimonial Carousel ─── */
const ALL_TESTIMONIALS = [
  { quote: "I used to call the repair shop 3 times a day. Now I just check the app and see exactly what's happening. Total game changer.", name: "Anita S.", role: "Customer, Kathmandu", initial: "A", audience: "Customer" },
  { quote: "We cut our repair turnaround time by 30% in the first month. The live dashboard shows everything at a glance.", name: "Rohan M.", role: "Owner, EverestFixIt", initial: "R", audience: "Shop Owner" },
  { quote: "Finally a platform where I can see exactly what's happening with my laptop without visiting the shop.", name: "Bikram T.", role: "Customer, Pokhara", initial: "B", audience: "Customer" },
  { quote: "No more lost job cards. Every repair is tracked, every customer gets updated automatically. My team loves it.", name: "Sunita B.", role: "Manager, KathmanduTech", initial: "S", audience: "Shop Manager" },
  { quote: "Submitted my request, got a notification when it was done. Couldn't be easier — exactly what I needed.", name: "Renu K.", role: "Customer, Biratnagar", initial: "R", audience: "Customer" },
  { quote: "My technicians know exactly what they're working on each day without asking me. Productivity went up immediately.", name: "Dipesh K.", role: "Owner, PokhreliRepairs", initial: "D", audience: "Shop Owner" },
];

function TestimonialCarousel({ onJoin }: { onJoin: () => void }) {
  const [current, setCurrent] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const visible = 3;
  const max = ALL_TESTIMONIALS.length - visible;

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setCurrent((c) => (c >= max ? 0 : c + 1)), 3800);
  };

  const goTo = (idx: number) => { setCurrent(Math.max(0, Math.min(idx, max))); resetAuto(); };

  useEffect(() => { resetAuto(); return () => { if (autoRef.current) clearInterval(autoRef.current); }; }, []);

  return (
    <div>
      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(calc(-${current} * (33.333% + 5.33px)))` }}
        >
          {ALL_TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[calc(33.333%-11px)] rounded-2xl border bg-white dark:bg-white/[0.03] p-5 relative overflow-hidden transition-all duration-300 ${
                i === current ? "border-blue-900/40 shadow-md" : "border-gray-200 dark:border-white/[0.06] shadow-sm"
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-300 ${i === current ? "bg-blue-900" : "bg-transparent"}`} />
              <div className="absolute top-3 right-4 text-5xl leading-none text-blue-900/10 dark:text-white/10 font-serif select-none">"</div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, si) => <Star key={si} size={11} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-white/55 italic mb-4 min-h-[60px]">"{t.quote}"</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{t.initial}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="text-[10px] text-gray-400">{t.role}</div>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                  t.audience.includes("Owner") || t.audience.includes("Manager")
                    ? "bg-blue-900/10 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                }`}>{t.audience}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1.5 items-center">
          {[...Array(max + 1)].map((_, i) => (
            <button
              key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-1.5 bg-blue-900" : "w-1.5 h-1.5 bg-gray-300 dark:bg-white/20"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => goTo(current - 1)} disabled={current === 0}
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] flex items-center justify-center text-gray-500 hover:bg-blue-900 hover:text-white hover:border-blue-900 disabled:opacity-30 transition">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => goTo(current + 1)} disabled={current >= max}
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] flex items-center justify-center text-gray-500 hover:bg-blue-900 hover:text-white hover:border-blue-900 disabled:opacity-30 transition">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-100 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-5 flex flex-wrap items-center gap-5">
        <div>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white leading-none">4.9</div>
          <div className="flex gap-0.5 mt-1.5">
            {[...Array(5)].map((_, i) => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Average rating</div>
        </div>
        <div className="w-px h-10 bg-gray-100 dark:bg-white/[0.05] hidden sm:block" />
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-white/50">
          <ThumbsUp size={14} className="text-blue-900 dark:text-blue-400" />
          <span className="font-bold text-gray-900 dark:text-white">94%</span> completed tasks faster than before
        </div>
        <div className="w-px h-10 bg-gray-100 dark:bg-white/[0.05] hidden sm:block" />
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-white/50">
          <Clock size={14} className="text-blue-900 dark:text-blue-400" />
          <span className="font-bold text-gray-900 dark:text-white">18 min</span> saved per repair job
        </div>
        <button onClick={onJoin}
          className="ml-auto flex items-center gap-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 border-none cursor-pointer transition shadow-sm">
          Join them <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─── Trusted by infinite marquee ─── */
const SHOPS = [
  { name: "EverestFixIt",    detail: "Itahari, Sunsari",     rating: 4.9, techs: 4, icon: "⚡" },
  { name: "KathmanduTech",   detail: "Thamel, Kathmandu",    rating: 4.8, techs: 6, icon: "🔧" },
  { name: "PokhreliRepairs", detail: "Lakeside, Pokhara",    rating: 5.0, techs: 3, icon: "💻" },
  { name: "SunsariService",  detail: "Dharan, Sunsari",      rating: 4.7, techs: 2, icon: "📱" },
  { name: "BiratnagerFix",   detail: "Traffic Chowk, Brt",  rating: 4.9, techs: 5, icon: "🔌" },
  { name: "ButwalTech",      detail: "Butwal-10, Rupandehi", rating: 4.8, techs: 3, icon: "⚙️" },
  { name: "JanakpurCare",    detail: "Janakpurdham",         rating: 4.6, techs: 2, icon: "🛠️" },
  { name: "ChitawanFix",     detail: "Bharatpur, Chitwan",   rating: 4.9, techs: 4, icon: "💡" },
];

function TrustedByMarquee() {
  const doubled = [...SHOPS, ...SHOPS];
  return (
    <div>
      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/20 mb-6">
        Trusted by repair businesses across Nepal
      </p>
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex w-max" style={{ animation: "marquee 28s linear infinite" }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {doubled.map((s, i) => (
            <div key={i}
              className="flex-shrink-0 flex items-center gap-3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl px-4 py-3 mx-2 min-w-[200px] hover:border-blue-900/30 transition-colors cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center text-base flex-shrink-0">{s.icon}</div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">{s.name}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{s.detail}</div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={8} className={si < Math.floor(s.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"} />
                  ))}
                  <span className="text-[9px] text-gray-400 ml-0.5">{s.rating} · {s.techs} techs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Comparison table ─── */
function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] shadow-sm">
      <div className="h-1 bg-blue-900" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
              <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 dark:text-white/30 uppercase tracking-wider">What you need</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 dark:text-white/20 uppercase tracking-wider">Manual method</th>
              <th className="px-5 py-3.5 text-xs font-bold text-blue-900 dark:text-white uppercase tracking-wider">Sajilo Tayaar</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Track repair status",    "❌ Paper / memory",       "✅ Real-time updates"],
              ["Customer notifications", "❌ Manual phone calls",   "✅ Automatic alerts"],
              ["Repair history",         "❌ Lost or hard to find", "✅ Searchable records"],
              ["Staff management",       "❌ Spreadsheets",         "✅ Role-based access"],
              ["Billing & invoices",     "❌ Manual calculations",  "✅ Built-in POS"],
              ["Access anywhere",        "❌ Office only",          "✅ Web & mobile ready"],
            ].map(([feature, manual, saas], i) => (
              <tr key={i} className="border-b border-gray-50 dark:border-white/[0.03] last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition">
                <td className="px-5 py-3 text-xs font-semibold text-gray-700 dark:text-white/60">{feature}</td>
                <td className="px-5 py-3 text-xs text-center text-gray-400 dark:text-white/25">{manual}</td>
                <td className="px-5 py-3 text-xs text-center font-semibold text-emerald-600 dark:text-emerald-400">{saas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Step card ─── */
const StepCard = ({ step, title, desc, icon, last = false }: { step: string; title: string; desc: string; icon: React.ReactNode; last?: boolean }) => (
  <div className="relative flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-2xl bg-blue-900 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/25">{icon}</div>
      {!last && <div className="w-px flex-1 bg-gradient-to-b from-blue-900/30 to-transparent mt-2" />}
    </div>
    <div className="pb-8">
      <div className="text-[10px] font-bold uppercase tracking-widest text-blue-900 dark:text-blue-400 mb-1">{step}</div>
      <div className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{title}</div>
      <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">{desc}</p>
    </div>
  </div>
);

/* ─── Buttons ─── */
const BtnPrimary = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button onClick={onClick} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 hover:bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white border-none cursor-pointer transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-0.5">
    {children}
  </button>
);
const BtnOutline = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button onClick={onClick} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.08] transition cursor-pointer hover:-translate-y-0.5">
    {children}
  </button>
);

/* ════════════════════════════════════════════════════════ */
export default function GettingStarted() {
  const navigate = useNavigate();
  const [audience, setAudience] = useState<Audience>("customer");

  const copy = useMemo(() => {
    if (audience === "customer") {
      return {
        title: <>Stop wondering about your device. <span className="text-blue-900 dark:text-white">Know exactly where it is.</span></>,
        desc: "Submit a repair request in minutes, get real-time status updates, and collect your device when it's ready — no phone tag, no guessing.",
        pain: "Tired of calling the shop asking 'Is it done yet?'",
        ctaPrimary: "Track My Repair",
        loginPath: "/auth?as=customer",
        featuresHeading: "Everything a customer actually needs",
        featuresSub: "Designed around how real people think about device repairs.",
        features: [
          { icon: <ClipboardCheck size={18} />, title: "Submit repairs in 3 minutes", desc: "Describe your issue, pick a shop, and submit. No forms to mail, no waiting on hold.", tag: "Fast" },
          { icon: <Clock size={18} />,          title: "Live status you can trust",   desc: "See exactly where your repair stands: Submitted → In Progress → Ready for pickup.", tag: "Real-time" },
          { icon: <Bell size={18} />,           title: "Instant notifications",       desc: "Get notified the moment your device status changes. No more chasing updates." },
          { icon: <Smartphone size={18} />,     title: "Works on any device",         desc: "Access your repairs from your phone, tablet, or laptop — anywhere, anytime." },
          { icon: <FileText size={18} />,       title: "Full repair history",         desc: "Every repair, every detail, searchable in one place. Perfect for warranty claims." },
          { icon: <ShieldCheck size={18} />,    title: "Your data stays yours",       desc: "Only you can see your repair records. Bank-grade privacy, always." },
        ],
        steps: [
          { step: "Step 1", title: "Create your free account",   desc: "Sign up in under 2 minutes. No credit card needed.",                                    icon: <User size={16} /> },
          { step: "Step 2", title: "Submit your repair request", desc: "Describe the problem, attach photos if needed, and pick your nearest shop.",             icon: <ClipboardCheck size={16} /> },
          { step: "Step 3", title: "Track & collect",            desc: "Watch every status update in real time. Collect when it says Ready.",                    icon: <CheckCircle2 size={16} /> },
        ],
      };
    }
    return {
      title: <>Run your shop smarter. <span className="text-blue-900 dark:text-white">Not harder.</span></>,
      desc: "Replace paper notes, spreadsheets, and missed calls with one dashboard that manages repairs, staff, customers, and billing from anywhere.",
      pain: "Still tracking repairs on paper and missing customer follow-ups?",
      ctaPrimary: "Set Up My Shop",
      loginPath: "/auth?as=shop",
      featuresHeading: "Built for how repair shops actually work",
      featuresSub: "Every feature maps to a real problem repair shop owners face every day.",
      features: [
        { icon: <Wrench size={18} />,         title: "End-to-end repair workflow",  desc: "Create jobs, assign technicians, update statuses, and close repairs — all in one flow.", tag: "Core" },
        { icon: <Users size={18} />,          title: "Role-based team access",      desc: "Owner, technician, staff — everyone gets the right tools and the right permissions.", tag: "Team" },
        { icon: <BarChart3 size={18} />,      title: "Live performance dashboard",  desc: "See repairs completed today, pending jobs, technician workloads, and revenue at a glance." },
        { icon: <Package size={18} />,        title: "Built-in POS & billing",      desc: "Generate invoices, track payments, and close billing without leaving the platform." },
        { icon: <ClipboardCheck size={18} />, title: "Customer request inbox",      desc: "View, accept, or reject incoming repair requests from customers in real time." },
        { icon: <Globe size={18} />,          title: "Access from anywhere",        desc: "No software to install. Open a browser on any device and your shop is right there." },
      ],
      steps: [
        { step: "Step 1", title: "Register your shop (5 mins)", desc: "Enter your shop details and owner info. You're live instantly.",                         icon: <Store size={16} /> },
        { step: "Step 2", title: "Add your team",               desc: "Invite technicians and staff. Assign roles. Everyone's set up in minutes.",               icon: <Users size={16} /> },
        { step: "Step 3", title: "Start managing repairs",      desc: "Create your first repair job and experience the difference immediately.",                  icon: <Wrench size={16} /> },
      ],
    };
  }, [audience]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060c18] text-gray-900 dark:text-white">

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-blue-500/8 dark:bg-blue-500/[0.05] blur-[130px]" />
        <div className="absolute top-[60%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-900/[0.04] blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[-80px] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[120px]" />
      </div>

      {/* Marquee keyframe */}
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-white/[0.06] bg-white/90 dark:bg-[#060c18]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate("/")}>
            <Logo size={32} rounded />
            <div>
              <div className="text-sm font-extrabold text-gray-900 dark:text-white">Sajilo Tayaar</div>
              <div className="text-[10px] text-gray-400 dark:text-white/30">Repair Shop Platform</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500 dark:text-white/40">
            {[["Features", "features"], ["How it works", "how"], ["Compare", "compare"], ["Reviews", "reviews"]].map(([label, id]) => (
              <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                className="hover:text-gray-900 dark:hover:text-white transition border-none bg-transparent cursor-pointer font-medium">{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(copy.loginPath)} className="hidden sm:inline-flex rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-4 py-2 text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-50 transition cursor-pointer">
              Sign in
            </button>
            <button onClick={() => navigate(copy.loginPath)} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 px-4 py-2 text-sm font-semibold text-white border-none cursor-pointer transition shadow-md shadow-blue-900/20">
              Get started <ArrowRight size={14} />
            </button>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Announcement bar */}
      <div className="bg-blue-900 text-white text-center py-2 px-4 text-xs font-semibold">
        <span className="opacity-75">New →</span>{" "}Built-in POS billing and technician performance reports now available.{" "}
        <button onClick={() => navigate(copy.loginPath)} className="underline underline-offset-2 opacity-90 hover:opacity-100 cursor-pointer bg-transparent border-none text-white">Try it free →</button>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-4">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] px-4 py-2 text-xs font-medium text-gray-500 dark:text-white/40 shadow-sm">
            <BadgeCheck size={14} className="text-blue-900 dark:text-white" />
            SaaS repair management platform — built for Nepal's repair shops
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.04] p-1 rounded-xl border border-gray-200 dark:border-white/[0.06] w-fit">
            {([["shop", <Store size={14} />, "I run a Shop"], ["customer", <User size={14} />, "I'm a Customer"]] as const).map(([val, icon, label]) => (
              <button key={val} onClick={() => setAudience(val)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-semibold transition border-none cursor-pointer ${audience === val ? "bg-blue-900 text-white shadow-sm" : "bg-transparent text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60"}`}>
                {icon}{label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 px-3.5 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-6">
              <AlertCircle size={13} />{copy.pain}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.15] tracking-tight mb-5">{copy.title}</h1>
            <p className="text-base text-gray-500 dark:text-white/40 leading-relaxed max-w-lg mb-8">{copy.desc}</p>
            <div className="flex flex-wrap gap-3 mb-10">
              <BtnPrimary onClick={() => navigate(copy.loginPath)}>{copy.ctaPrimary} <ArrowRight size={15} /></BtnPrimary>
              <BtnOutline onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                <Play size={13} className="fill-current" /> See how it works
              </BtnOutline>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {["Free to get started", "No technical setup", "Live in under 5 minutes"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/30">
                  <CheckCircle2 size={13} className="text-emerald-500" />{t}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-900/5 dark:bg-blue-500/5 rounded-3xl blur-2xl" />
            <div className="relative"><DashboardPreview audience={audience} /></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] shadow-sm grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-white/[0.05]">
          {[
            { label: "Repairs tracked",      value: 2400, suffix: "+",    hint: "across all shops" },
            { label: "Time saved per job",   value: 18,   suffix: " min", hint: "vs. manual process" },
            { label: "Task completion rate", value: 94,   suffix: "%",    hint: "in usability testing" },
            { label: "Setup time",           value: 5,    suffix: " min", hint: "to go live" },
          ].map((s) => (
            <div key={s.label} className="px-6 py-5 text-center">
              <div className="text-2xl font-extrabold text-blue-900 dark:text-white">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-white/60 mt-0.5">{s.label}</div>
              <div className="text-[10px] text-emerald-500 mt-0.5 font-medium">{s.hint}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted by */}
      <section className="mx-auto max-w-7xl px-6 pb-10 border-y border-gray-100 dark:border-white/[0.05] py-10">
        <TrustedByMarquee />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-900/10 dark:bg-white/10 text-blue-900 dark:text-white mb-3">Features</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{copy.featuresHeading}</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-white/40 max-w-lg">{copy.featuresSub}</p>
          </div>
          <BtnOutline onClick={() => navigate(copy.loginPath)}>Explore all features <ChevronRight size={14} /></BtnOutline>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {copy.features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-900/10 dark:bg-white/10 text-blue-900 dark:text-white mb-4">How it works</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">Up and running in 3 steps</h2>
            {copy.steps.map((s, i) => <StepCard key={s.step} {...s} last={i === copy.steps.length - 1} />)}
            <div className="flex flex-wrap gap-3 mt-2">
              <BtnPrimary onClick={() => navigate(copy.loginPath)}>{copy.ctaPrimary} <ArrowRight size={15} /></BtnPrimary>
              <BtnOutline onClick={() => navigate(copy.loginPath)}>Login instead</BtnOutline>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-900/10 flex items-center justify-center">
                  <Zap size={15} className="text-blue-900 dark:text-white" />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Why teams switch to Sajilo Tayaar</span>
              </div>
              <div className="space-y-3">
                {[
                  ["Research-backed design",    "Built using usability studies and efficiency benchmarks from real repair workflow research (UWS MSc project)."],
                  ["SaaS — nothing to install", "Open your browser, log in, manage everything. Works on phones, tablets, and computers."],
                  ["Role-based access control", "Owners, staff, and technicians each see only what they need — no confusion, no data leaks."],
                  ["Faster than manual",        "Structured testing showed 18+ minutes saved per repair job vs. paper-based workflows."],
                ].map(([title, desc]) => (
                  <div key={String(title)} className="flex gap-3">
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-gray-800 dark:text-white/80">{title}</div>
                      <div className="text-[11px] text-gray-500 dark:text-white/35 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={17} className="text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Your data is protected</div>
                <div className="text-[11px] text-emerald-700/70 dark:text-emerald-400/60 leading-relaxed">Secure login, role-based access, and private data isolation — each shop's data is completely separate.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare */}
      <section id="compare" className="mx-auto max-w-7xl px-6 pb-14">
        <div className="mb-8">
          <div className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-900/10 dark:bg-white/10 text-blue-900 dark:text-white mb-3">The difference</div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Stop working around broken tools</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-white/40">See what Sajilo Tayaar replaces in your current workflow.</p>
        </div>
        <ComparisonTable />
      </section>

      {/* Testimonials */}
      <section id="reviews" className="mx-auto max-w-7xl px-6 pb-14">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-3">
            <MessageSquare size={11} /> Testimonials
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Real feedback from real users</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-white/40">What shop owners and customers say after switching to Sajilo Tayaar</p>
        </div>
        <TestimonialCarousel onJoin={() => navigate(copy.loginPath)} />
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="relative rounded-3xl bg-blue-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/[0.04] blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/[0.03] blur-xl" />
          </div>
          <div className="relative px-8 py-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white mb-5">
              <Award size={13} /> MSc Research Project — University of the West of Scotland
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Ready to modernize your repair workflow?</h2>
            <p className="text-blue-200/80 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
              Join repair shops and customers already using Sajilo Tayaar. Free to get started, live in under 5 minutes.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => navigate("/auth?as=shop")}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 px-5 py-2.5 text-sm font-bold border-none cursor-pointer transition shadow-lg">
                <Store size={15} /> Register Your Shop
              </button>
              <button onClick={() => navigate("/auth?as=customer")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 text-sm font-bold cursor-pointer transition">
                <User size={15} /> I'm a Customer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={28} rounded />
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">Sajilo Tayaar</div>
              <div className="text-[10px] text-gray-400 dark:text-white/25">© {new Date().getFullYear()} · All rights reserved</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-gray-400 dark:text-white/20 mr-2 hidden sm:inline">Built as part of MSc Web Development research at UWS</span>
            <button onClick={() => navigate("/auth?as=shop")}
              className="rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-4 py-2 text-xs font-semibold text-gray-600 dark:text-white/50 hover:bg-gray-50 transition cursor-pointer">
              Shop Login
            </button>
            <button onClick={() => navigate("/auth?as=customer")}
              className="rounded-xl bg-blue-900 hover:bg-blue-800 px-4 py-2 text-xs font-semibold text-white border-none cursor-pointer transition shadow-sm">
              Customer Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
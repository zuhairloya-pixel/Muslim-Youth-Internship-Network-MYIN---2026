"use client";

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";

type View = "home" | "auth" | "student" | "organization" | "impact";
type OrgTab = "overview" | "submit" | "matches";
type Filter = "All" | "Internships" | "Volunteer" | "Mentorship";
type AccountRole = "student" | "organization";

type DemoAccount = {
  name: string;
  username: string;
  role: AccountRole;
  initials: string;
  organization?: string;
};

type StoredDemoAccount = DemoAccount & { password: string };

const demoAccounts: Record<string, DemoAccount> = {
  amina_test: { name: "Amina Hassan", username: "amina_test", role: "student", initials: "AH" },
  rayanemployer_test: { name: "Rayan Mahmood", username: "rayanemployer_test", role: "organization", initials: "RM", organization: "Rahma Community Lab" },
};

type ScoreItem = {
  label: string;
  earned: number;
  possible: number;
};

type Opportunity = {
  id: number;
  title: string;
  organization: string;
  organizationMark: string;
  type: "Internship" | "Volunteer" | "Mentorship";
  format: string;
  location: string;
  deadline: string;
  commitment: string;
  description: string;
  skills: string[];
  matchReasons: string[];
  score: number;
  breakdown: ScoreItem[];
  accent: string;
  new?: boolean;
  urgent?: boolean;
  startWindow?: string;
  faithSupport?: string[];
};

type Extraction = {
  title: string;
  type: string;
  date: string;
  commitment: string;
  location: string;
  format: string;
  ageRange: string;
  supervision: string;
  skills: string;
  impact: string;
  prayerSpace: string;
  prayerBreaks: string;
  halalFood: string;
  urgentNeed: string;
};

type OrganizationResearch = {
  name: string;
  summary: string;
  mission: string;
  sectors: string[];
  audiences: string[];
  cultureSignals: string[];
  location: string;
  sourceNote: string;
  website?: string;
};

type StudentProfile = {
  grade: string;
  location: string;
  preferredFormat: string;
  availability: string;
  careerGoal: string;
  narrative: string;
  interests: string[];
  skills: string[];
  causes: string[];
  opportunityTypes: string[];
  languages: string[];
  transportation: string;
  workStyle: string;
  experienceLevel: string;
  weeklyWindows: string;
  prayerPreference: string;
  jumuahPreference: string;
  accommodationNotes: string;
  emergencyAvailability: boolean;
  experienceNarrative: string;
  growthFocus: string;
  homeZip: string;
};

const initialStudentProfile: StudentProfile = {
  grade: "Grade 11",
  location: "Dearborn, MI",
  preferredFormat: "Local or virtual",
  availability: "Saturdays, 10 AM-4 PM",
  careerGoal: "Explore design and technology for social impact",
  narrative:
    "I help our MSA make event flyers and social posts. I enjoy building things, working with younger students, and want to explore technology that helps communities.",
  interests: ["Technology", "Design", "Youth education"],
  skills: ["Canva", "Social media", "Basic web design"],
  causes: ["Education access", "Community service"],
  opportunityTypes: ["Internships", "Volunteer projects"],
  languages: ["English", "Arabic"],
  transportation: "Local rides available",
  workStyle: "Creative team",
  experienceLevel: "Growing portfolio",
  weeklyWindows: "Mon–Thu after 4 PM · Saturday 10 AM–4 PM",
  prayerPreference: "I need a short, flexible break for Zuhr/Asr when shifts overlap.",
  jumuahPreference: "Keep Friday midday open when possible",
  accommodationNotes: "A quiet, clean place to pray is appreciated. I can bring my own prayer mat.",
  emergencyAvailability: true,
  experienceNarrative: "MSA Media Lead | 2025–present | Designed event flyers and social campaigns for 120+ students\nWeekend Tutor | 2024–2025 | Supported middle-school reading and homework sessions\nCommunity Food Drive | Spring 2025 | Organized volunteer check-in and resource tables",
  growthFocus: "Public speaking, HTML/CSS, and leading a project from idea to launch",
  homeZip: "48126",
};

const opportunities: Opportunity[] = [
  {
    id: 0,
    title: "Clinic Welcome Desk — Today",
    organization: "Mercy Health Access Clinic",
    organizationMark: "MH",
    type: "Volunteer",
    format: "In person",
    location: "Dearborn, MI",
    deadline: "Today · 2:30 PM",
    commitment: "Today, 3–6 PM",
    description: "A community clinic needs a calm, bilingual youth volunteer today to welcome families, organize resource packets, and support a busy walk-in evening.",
    skills: ["Communication", "Arabic", "Community service"],
    matchReasons: ["Your Arabic and community service signals", "Immediate availability near Dearborn", "Prayer break and quiet space confirmed"],
    score: 95,
    breakdown: [
      { label: "Interests", earned: 25, possible: 25 }, { label: "Skills", earned: 14, possible: 20 }, { label: "Career goals", earned: 8, possible: 15 }, { label: "Availability", earned: 15, possible: 15 }, { label: "Eligibility", earned: 10, possible: 10 }, { label: "Location & format", earned: 10, possible: 10 }, { label: "Opportunity type", earned: 5, possible: 5 },
    ],
    accent: "urgent",
    new: true,
    urgent: true,
    startWindow: "Starts in 2h 15m",
    faithSupport: ["Prayer-friendly break", "Quiet room available", "Halal snacks nearby"],
  },
  {
    id: 1,
    title: "Youth Digital Media Assistant",
    organization: "Bright Path Learning",
    organizationMark: "BP",
    type: "Volunteer",
    format: "Hybrid",
    location: "Dearborn, MI",
    deadline: "Aug 18",
    commitment: "3–5 hrs/week",
    description:
      "Help a Muslim nonprofit create social media graphics and short-form content for its weekend tutoring program.",
    skills: ["Canva", "Social media", "Design"],
    matchReasons: [
      "Your Canva and social media skills",
      "Your interest in youth education",
      "Your Saturday availability",
    ],
    score: 93,
    breakdown: [
      { label: "Interests", earned: 25, possible: 25 },
      { label: "Skills", earned: 20, possible: 20 },
      { label: "Career goals", earned: 8, possible: 15 },
      { label: "Availability", earned: 15, possible: 15 },
      { label: "Eligibility", earned: 10, possible: 10 },
      { label: "Location & format", earned: 10, possible: 10 },
      { label: "Opportunity type", earned: 5, possible: 5 },
    ],
    accent: "gold",
    new: true,
    faithSupport: ["Prayer break welcomed", "Muslim-led nonprofit"],
  },
  {
    id: 2,
    title: "Junior Web Builder",
    organization: "Ummah Tech Collective",
    organizationMark: "UT",
    type: "Internship",
    format: "Remote",
    location: "Anywhere",
    deadline: "Aug 24",
    commitment: "5 hrs/week",
    description:
      "Work with a small product team to refresh landing pages for community-led projects and learn a real design handoff workflow.",
    skills: ["Web design", "HTML/CSS", "Communication"],
    matchReasons: [
      "Your basic web design experience",
      "Your technology career interest",
      "Your preference for remote work",
    ],
    score: 87,
    breakdown: [
      { label: "Interests", earned: 25, possible: 25 },
      { label: "Skills", earned: 13, possible: 20 },
      { label: "Career goals", earned: 15, possible: 15 },
      { label: "Availability", earned: 10, possible: 15 },
      { label: "Eligibility", earned: 10, possible: 10 },
      { label: "Location & format", earned: 10, possible: 10 },
      { label: "Opportunity type", earned: 4, possible: 5 },
    ],
    accent: "blue",
    new: true,
    faithSupport: ["Flexible breaks", "Remote-friendly"],
  },
  {
    id: 3,
    title: "Youth Leadership Lab",
    organization: "Crescent Civic Network",
    organizationMark: "CC",
    type: "Mentorship",
    format: "In person",
    location: "Detroit, MI",
    deadline: "Sep 02",
    commitment: "2 Saturdays",
    description:
      "Join a small cohort exploring community leadership, public speaking, and how local nonprofits turn ideas into action.",
    skills: ["Leadership", "Communication", "Teamwork"],
    matchReasons: [
      "Your community impact goals",
      "Your weekend availability",
      "Your interest in leadership",
    ],
    score: 79,
    breakdown: [
      { label: "Interests", earned: 15, possible: 25 },
      { label: "Skills", earned: 12, possible: 20 },
      { label: "Career goals", earned: 8, possible: 15 },
      { label: "Availability", earned: 15, possible: 15 },
      { label: "Eligibility", earned: 10, possible: 10 },
      { label: "Location & format", earned: 9, possible: 10 },
      { label: "Opportunity type", earned: 3, possible: 5 },
    ],
    accent: "sage",
  },
  {
    id: 4,
    title: "Community Food Drive Storyteller",
    organization: "Rahma Community Center",
    organizationMark: "RC",
    type: "Volunteer",
    format: "In person",
    location: "Dearborn, MI",
    deadline: "Sep 08",
    commitment: "One Saturday",
    description:
      "Photograph a community food drive and turn the day into a warm, respectful social media story.",
    skills: ["Photography", "Social media", "Writing"],
    matchReasons: [
      "Your social media experience",
      "Your local volunteer preference",
      "Your Saturday availability",
    ],
    score: 76,
    breakdown: [
      { label: "Interests", earned: 15, possible: 25 },
      { label: "Skills", earned: 13, possible: 20 },
      { label: "Career goals", earned: 8, possible: 15 },
      { label: "Availability", earned: 15, possible: 15 },
      { label: "Eligibility", earned: 10, possible: 10 },
      { label: "Location & format", earned: 10, possible: 10 },
      { label: "Opportunity type", earned: 5, possible: 5 },
    ],
    accent: "coral",
  },
];

const defaultDescription =
  "We need youth volunteers to help with our community food drive next Saturday from 10 AM–2 PM. We also need someone to take photos and someone who knows Canva to make a social media flyer. Ages 14–18. An adult volunteer coordinator will supervise the event at Rahma Community Center.";

const candidates = [
  {
    id: 1,
    name: "Amina H.",
    initials: "AH",
    score: 93,
    details: "Canva · Social media · Saturdays",
    reason: "Strong skills, cause, schedule, and format alignment.",
  },
  {
    id: 2,
    name: "Yusuf K.",
    initials: "YK",
    score: 84,
    details: "Photography · Events · Weekends",
    reason: "Excellent event photography fit and fully available.",
  },
  {
    id: 3,
    name: "Layla M.",
    initials: "LM",
    score: 78,
    details: "Writing · Outreach · Canva",
    reason: "Relevant outreach skills with partial schedule overlap.",
  },
];

function normalizeSignal(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function signalMatches(signal: string, corpus: string) {
  const normalized = normalizeSignal(signal);
  if (corpus.includes(normalized)) return true;
  const meaningfulWords = normalized.split(" ").filter((word) => word.length >= 4);
  return meaningfulWords.some((word) => corpus.includes(word));
}

function calculateOpportunityMatch(
  profile: StudentProfile,
  opportunity: Opportunity,
): Opportunity {
  const corpus = normalizeSignal(
    [
      opportunity.title,
      opportunity.description,
      opportunity.skills.join(" "),
      opportunity.type,
      opportunity.format,
      opportunity.location,
      opportunity.commitment,
    ].join(" "),
  );

  const interestHits = [...profile.interests, ...profile.causes].filter((signal) =>
    signalMatches(signal, corpus),
  ).length;
  const interests = interestHits >= 2 ? 25 : interestHits === 1 ? 15 : 5;

  const skillHits = opportunity.skills.filter((requested) =>
    profile.skills.some(
      (skill) => signalMatches(skill, normalizeSignal(requested)) || signalMatches(requested, normalizeSignal(skill)),
    ),
  ).length;
  const skills = opportunity.skills.length
    ? Math.round((skillHits / opportunity.skills.length) * 20)
    : 20;

  const careerWords = normalizeSignal(profile.careerGoal)
    .split(" ")
    .filter((word) => word.length >= 5 && !["explore", "social", "impact"].includes(word));
  const careerHits = careerWords.filter((word) => corpus.includes(word)).length;
  const career = careerHits >= 2 ? 15 : careerHits === 1 ? 8 : 3;

  const availabilityText = normalizeSignal(profile.availability);
  const scheduleText = normalizeSignal(opportunity.commitment);
  const availability =
    (availabilityText.includes("saturday") && scheduleText.includes("saturday")) ||
    scheduleText.includes("hrs week")
      ? 15
      : 10;

  const formatPreference = normalizeSignal(profile.preferredFormat);
  const format = normalizeSignal(opportunity.format);
  const location = normalizeSignal(opportunity.location);
  const profileLocation = normalizeSignal(profile.location);
  const locationAndFormat =
    (format.includes("remote") && formatPreference.includes("virtual")) ||
    format.includes("hybrid") ||
    location.includes("anywhere") ||
    location.split(" ").some((part) => part.length > 4 && profileLocation.includes(part))
      ? 10
      : formatPreference.includes("local")
        ? 7
        : 3;

  const preferredTypes = profile.opportunityTypes.map(normalizeSignal);
  const opportunityType = normalizeSignal(opportunity.type);
  const typePreference = preferredTypes.some((type) => type.includes(opportunityType))
    ? 5
    : preferredTypes.length
      ? 3
      : 0;

  const breakdown: ScoreItem[] = [
    { label: "Interests", earned: interests, possible: 25 },
    { label: "Skills", earned: skills, possible: 20 },
    { label: "Career goals", earned: career, possible: 15 },
    { label: "Availability", earned: availability, possible: 15 },
    { label: "Eligibility", earned: 10, possible: 10 },
    { label: "Location & format", earned: locationAndFormat, possible: 10 },
    { label: "Opportunity type", earned: typePreference, possible: 5 },
  ];

  const reasons = [
    ...(skillHits > 0 ? [`${skillHits} requested skill${skillHits === 1 ? "" : "s"} already in your profile`] : []),
    ...(interestHits > 0 ? ["Connects with your interests and causes"] : []),
    ...(availability === 15 ? ["Fits your stated availability"] : []),
    ...(locationAndFormat === 10 ? ["Matches your location or format preference"] : []),
    ...(career >= 8 ? ["Builds toward your stated career direction"] : []),
    ...(opportunity.urgent && profile.emergencyAvailability ? ["You opted into immediate community opportunities"] : []),
    ...(opportunity.faithSupport?.length && profile.prayerPreference ? ["Prayer and faith-aware accommodations are listed"] : []),
  ];

  return {
    ...opportunity,
    score: breakdown.reduce((total, item) => total + item.earned, 0),
    breakdown,
    matchReasons: reasons.length ? reasons : ["Eligible based on your core profile", "A chance to build new skills"],
  };
}

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button className="brand" onClick={onClick} aria-label="Go to MYIN home">
      <img className="brand-logo" src="/myin-logo.png" alt="" />
      <span>
        <strong>MYIN</strong>
        <small>Muslim Youth Internship Network</small>
      </span>
    </button>
  );
}

function AuthView({
  onBack,
  onLogin,
  customAccounts,
  onCreateAccount,
}: {
  onBack: () => void;
  onLogin: (account: DemoAccount) => void;
  customAccounts: StoredDemoAccount[];
  onCreateAccount: (account: StoredDemoAccount) => string | null;
}) {
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [username, setUsername] = useState("amina_test");
  const [password, setPassword] = useState("whatever");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AccountRole>("student");
  const [error, setError] = useState("");

  const chooseAccount = (account: DemoAccount) => {
    setUsername(account.username);
    setPassword("whatever");
    setError("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedUsername = username.trim().toLowerCase();
    const demoAccount = demoAccounts[normalizedUsername];
    const customAccount = customAccounts.find((account) => account.username === normalizedUsername);
    const account = demoAccount ?? customAccount;
    const validPassword = demoAccount ? password === "whatever" : customAccount?.password === password;
    if (!account || !validPassword) {
      setError("Use one of the demo accounts below with the password “whatever”.");
      return;
    }
    onLogin(account);
  };

  const createAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedUsername = username.trim().toLowerCase();
    if (!name.trim() || !normalizedUsername || password.length < 4) {
      setError("Add your name, a username, and a password with at least 4 characters.");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
      setError("Use letters, numbers, and underscores only for the username.");
      return;
    }
    const initials = name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
    const nextAccount: StoredDemoAccount = {
      name: name.trim(), username: normalizedUsername, password, role,
      initials: initials || "MY",
      organization: role === "organization" ? `${name.trim()} Organization` : undefined,
    };
    const issue = onCreateAccount(nextAccount);
    if (issue) { setError(issue); return; }
    onLogin(nextAccount);
  };

  return (
    <main className="auth-page">
      <div className="auth-atmosphere" aria-hidden="true">
        <span className="auth-crescent">☾</span>
        <span className="auth-orbit auth-orbit-one" />
        <span className="auth-orbit auth-orbit-two" />
        <span className="auth-mosque" />
      </div>
      <section className="auth-card" aria-labelledby="sign-in-title" data-account-flow="self-serve">
        <div className="auth-brand"><Brand onClick={onBack} /></div>
        <span className="auth-kicker"><i /> SECURE DEMO ACCESS</span>
        <h1 id="sign-in-title">{mode === "signin" ? "Your next step starts here." : "Build your MYIN home."}</h1>
        <p>{mode === "signin" ? "Sign in to experience MYIN as a student or a community organization." : "Create a student or organization workspace in seconds."}</p>
        <div className="auth-mode-toggle" role="tablist" aria-label="Account access mode">
          <button className={mode === "signin" ? "active" : ""} onClick={() => { setMode("signin"); setError(""); }} type="button">Sign in</button>
          <button className={mode === "create" ? "active" : ""} onClick={() => { setMode("create"); setError(""); setUsername(""); setPassword(""); }} type="button">Create account</button>
        </div>
        {mode === "signin" && <>
        <div className="demo-account-picker" aria-label="Choose a demo account">
          {Object.values(demoAccounts).map((account) => (
            <button
              className={username === account.username ? "selected" : ""}
              key={account.username}
              onClick={() => chooseAccount(account)}
              type="button"
            >
              <span className="demo-account-avatar">{account.initials}</span>
              <span><strong>{account.role === "student" ? "Student workspace" : "Organization workspace"}</strong><small>{account.name}</small></span>
            </button>
          ))}
        </div>
        <form className="auth-form" onSubmit={submit}>
          <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-gold full-width" type="submit">Enter MYIN <span aria-hidden="true">→</span></button>
        </form>
        <div className="auth-demo-note"><strong>Hackathon demo access</strong><span>Both accounts use password: <code>whatever</code></span></div>
        </>}
        {mode === "create" && <form className="auth-form" onSubmit={createAccount}>
          <div className="role-selector" aria-label="Choose account type">
            <button className={role === "student" ? "selected" : ""} onClick={() => setRole("student")} type="button"><strong>I&apos;m a student</strong><small>Discover opportunities and grow.</small></button>
            <button className={role === "organization" ? "selected" : ""} onClick={() => setRole("organization")} type="button"><strong>I represent an organization</strong><small>Find mission-aligned youth.</small></button>
          </div>
          <label>{role === "student" ? "Your full name" : "Your name"}<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder={role === "student" ? "e.g. Mariam Ali" : "e.g. Rayan Mahmood"} /></label>
          <label>Choose a username<input value={username} onChange={(event) => setUsername(event.target.value.toLowerCase())} autoComplete="username" placeholder="e.g. mariam_ali" /></label>
          <label>Create a password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="At least 4 characters" /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-gold full-width" type="submit">Create {role === "student" ? "student" : "organization"} account <span aria-hidden="true">→</span></button>
          <p className="auth-local-note">For this hackathon demo, your new account is remembered in this browser.</p>
        </form>}
        <button className="auth-back" onClick={onBack}>← Back to MYIN</button>
      </section>
    </main>
  );
}

const heroMoments = [
  "Discover your lane.",
  "Build real confidence.",
  "Serve with purpose.",
  "Lead what comes next.",
];

function HeroMomentum() {
  const [moment, setMoment] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMoment((current) => (current + 1) % heroMoments.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hero-momentum" aria-live="polite">
      <span className="hero-momentum-label">MYIN helps you</span>
      <strong key={heroMoments[moment]}>{heroMoments[moment]}</strong>
      <div className="hero-momentum-dots" aria-hidden="true">
        {heroMoments.map((item, index) => <i key={item} className={index === moment ? "active" : ""} />)}
      </div>
    </div>
  );
}

const warpStarPaths = [
  [-46, -42], [38, -58], [58, 48], [-48, 52],
];

function WarpStarfield() {
  return (
    <div className="warp-starfield" aria-hidden="true">
      {warpStarPaths.map(([x, y], index) => (
        <i
          className="warp-star"
          key={`${x}-${y}`}
          style={{
            "--warp-x": `${x}vw`,
            "--warp-y": `${y}vh`,
            "--warp-angle": `${Math.atan2(y, x) * (180 / Math.PI)}deg`,
            "--warp-delay": `${-(index * 3.4)}s`,
            "--warp-duration": `${15 + (index % 4) * 1.7}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function ScoreRing({ score, small = false }: { score: number; small?: boolean }) {
  return (
    <div
      className={`score-ring ${small ? "score-ring-small" : ""}`}
      style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}
      aria-label={`${score} percent match`}
    >
      <span>{score}</span>
      <small>%</small>
    </div>
  );
}

function PublicHeader({
  onNavigate,
  onStudent,
  onOrganization,
}: {
  onNavigate: (view: View) => void;
  onStudent: () => void;
  onOrganization: () => void;
}) {
  return (
    <header className="public-header">
      <div className="page-width header-inner">
        <Brand onClick={() => onNavigate("home")} />
        <nav className="public-nav" aria-label="Main navigation">
          <button onClick={() => onNavigate("impact")}>Community impact</button>
          <button onClick={onOrganization}>For organizations</button>
        </nav>
        <div className="header-actions">
          <button className="text-button" onClick={onOrganization}>
            Post an opportunity
          </button>
          <button className="button button-dark button-small" onClick={onStudent}>
            Explore matches
          </button>
        </div>
      </div>
    </header>
  );
}

function HomeView({
  onNavigate,
}: {
  onNavigate: (view: View) => void;
}) {
  return (
    <div className="home-view">
      <PublicHeader
        onNavigate={onNavigate}
        onStudent={() => onNavigate("auth")}
        onOrganization={() => onNavigate("auth")}
      />

      <main>
        <section className="hero">
          <div className="hero-noor" aria-hidden="true">
            <div className="hero-crescent">☾</div>
            <i className="star star-a">✦</i>
            <i className="star star-b">✧</i>
            <i className="star star-c">✦</i>
            <i className="star star-d">✧</i>
            <WarpStarfield />
            <div className="hero-mosque">
              <i className="mosque-minaret mosque-minaret-left" />
              <i className="mosque-minaret mosque-minaret-right" />
            </div>
            <div className="hero-arch arch-one" />
            <div className="hero-arch arch-two" />
            <div className="hero-lattice" />
          </div>
          <div className="page-width hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Opportunity, with purpose
              </div>
              <h1>
                Your skills can move
                <br />
                your community <em>forward.</em>
              </h1>
              <HeroMomentum />
              <p className="hero-subtitle">
                MYIN finds opportunities built for who you are—and shows exactly
                why each one belongs on your radar.
              </p>
              <div className="hero-intelligence-line" aria-label="MYIN product strengths">
                <span><b>01</b> Identity-aware profile</span>
                <span><b>02</b> Explainable matching</span>
                <span><b>03</b> Trusted introductions</span>
              </div>
              <div className="hero-actions">
                <button
                  className="button button-gold"
                  onClick={() => onNavigate("auth")}
                >
                  See Amina&apos;s matches <span aria-hidden="true">→</span>
                </button>
                <button
                  className="button button-ghost-light"
                  onClick={() => onNavigate("auth")}
                >
                  I represent an organization
                </button>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack" aria-hidden="true">
                  <span>AH</span>
                  <span>YK</span>
                  <span>LM</span>
                </div>
                <p>
                  <strong>Built with students,</strong>
                  <br />
                  trusted by community partners.
                </p>
              </div>
              <p className="hero-whisper">Every gift has a place to become service.</p>
            </div>

            <div className="hero-product" aria-label="Example MYIN match">
              <div className="hero-system-status">
                <span><i /> MYIN opportunity radar</span>
                <strong>LIVE DEMO</strong>
              </div>
              <div className="product-orbit orbit-one" />
              <div className="product-orbit orbit-two" />
              <div className="floating-note note-top">
                <span className="note-icon">✓</span>
                <p>
                  <strong>Eligibility checked</strong>
                  <small>Age, schedule & format</small>
                </p>
              </div>
              <div className="match-preview-card">
                <div className="preview-topline">
                  <span className="live-pill">NEW MATCH</span>
                  <span className="verified-label">● Verified</span>
                </div>
                <div className="preview-org">
                  <span className="org-logo">BP</span>
                  <div>
                    <strong>Bright Path Learning</strong>
                    <small>Community nonprofit</small>
                  </div>
                </div>
                <h2>Youth Digital Media Assistant</h2>
                <p>
                  Help create social content for a weekend tutoring program.
                </p>
                <div className="preview-score-row">
                  <ScoreRing score={93} />
                  <div className="preview-reasons">
                    <span>Why this fits you</span>
                    <strong>Canva + youth education</strong>
                    <strong>Saturday availability</strong>
                  </div>
                </div>
                <div className="preview-meta">
                  <span>Hybrid</span>
                  <span>3–5 hrs/week</span>
                  <span>Due Aug 18</span>
                </div>
                <button
                  className="button button-dark full-width"
                  onClick={() => onNavigate("auth")}
                >
                  View my match
                </button>
              </div>
              <div className="floating-note note-bottom">
                <span className="spark" aria-hidden="true">
                  ✦
                </span>
                <p>
                  <strong>Clear reasons, not a black box</strong>
                  <small>Every score is explained</small>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="proof-strip">
          <div className="page-width proof-grid">
            <div>
              <strong>42</strong>
              <span>curated opportunities</span>
            </div>
            <div>
              <strong>18</strong>
              <span>community partners</span>
            </div>
            <div>
              <strong>91%</strong>
              <span>of matches explained</span>
            </div>
            <p>Demo cohort · Southeast Michigan</p>
          </div>
        </section>

        <section className="intelligence-section">
          <div className="page-width intelligence-grid">
            <div className="intelligence-copy">
              <span className="kicker">BUILT AROUND THE WHOLE PERSON</span>
              <h2>A profile that sees potential before a resume does.</h2>
              <p>
                Skills are only one signal. MYIN understands goals, causes,
                availability, learning edges, preferred environments, and the
                contribution a student wants to make.
              </p>
              <button className="button button-dark" onClick={() => onNavigate("auth")}>
                Open student mission control
              </button>
            </div>
            <div className="signal-cloud" aria-label="Example student profile signals">
              <div className="signal-core">
                <span>88%</span>
                <strong>Profile signal</strong>
                <small>12 dimensions understood</small>
              </div>
              <span className="signal-chip signal-one">Creative builder</span>
              <span className="signal-chip signal-two">Saturday availability</span>
              <span className="signal-chip signal-three">Youth education</span>
              <span className="signal-chip signal-four">Learning web design</span>
              <span className="signal-chip signal-five">Community impact</span>
              <div className="signal-grid-lines" />
            </div>
          </div>
        </section>

        <section className="how-section">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <span className="kicker">ONE NETWORK, TWO SIDES</span>
                <h2>The right opportunity should find you, too.</h2>
              </div>
              <p>
                MYIN turns scattered community opportunities into clear,
                personalized next steps—without exposing student information.
              </p>
            </div>
            <div className="steps-grid">
              <article>
                <span className="step-number">01</span>
                <div className="step-art profile-art" aria-hidden="true">
                  <div className="mini-avatar">A</div>
                  <span />
                  <span />
                  <span />
                </div>
                <h3>Tell us what lights you up.</h3>
                <p>
                  Add your interests, skills, goals, availability, and the causes
                  you care about in two minutes.
                </p>
              </article>
              <article>
                <span className="step-number">02</span>
                <div className="step-art match-art" aria-hidden="true">
                  <span>93%</span>
                  <i>Skills</i>
                  <i>Goals</i>
                  <i>Time</i>
                </div>
                <h3>Get matches you can understand.</h3>
                <p>
                  Eligibility is checked first. Then every recommendation
                  explains the interests, skills, and schedule behind it.
                </p>
              </article>
              <article>
                <span className="step-number">03</span>
                <div className="step-art impact-art" aria-hidden="true">
                  <b>25</b>
                  <span>verified hours</span>
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <h3>Turn contribution into momentum.</h3>
                <p>
                  Express interest safely, contribute to real work, and grow an
                  impact record that travels with you.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="page-width trust-grid">
            <div>
              <span className="kicker kicker-light">SAFETY BY DESIGN</span>
              <span className="trust-ornament" aria-hidden="true">✦</span>
              <h2>Young people deserve opportunity—and protection.</h2>
              <p>
                Organizations see only what they need to evaluate fit. Contact
                details stay private until a controlled introduction is approved.
              </p>
              <button
                className="button button-ghost-light"
                onClick={() => onNavigate("impact")}
              >
                See our trust model
              </button>
            </div>
            <ul>
              <li>
                <span>✓</span>
                <div>
                  <strong>Verified organizations</strong>
                  <small>Human-reviewed identity and community standing</small>
                </div>
              </li>
              <li>
                <span>✓</span>
                <div>
                  <strong>Age-appropriate listings</strong>
                  <small>Clear supervision, schedule, and eligibility</small>
                </div>
              </li>
              <li>
                <span>✓</span>
                <div>
                  <strong>Controlled introductions</strong>
                  <small>No unrestricted adult-to-minor messaging</small>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="final-cta">
          <div className="page-width final-cta-inner">
            <div>
              <span className="kicker">START WITH ONE CONNECTION</span>
              <h2>Your skills. Your community. Your impact.</h2>
              <p>Let purpose find its next place to grow.</p>
            </div>
            <div>
              <button
                className="button button-dark"
                  onClick={() => onNavigate("auth")}
              >
                Explore as a student
              </button>
              <button
                className="button button-outline"
                  onClick={() => onNavigate("auth")}
              >
                Post an opportunity
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="page-width footer-inner">
          <Brand onClick={() => onNavigate("home")} />
          <p>Built for Muslim youth. Designed for community trust.</p>
          <span>Hackathon MVP · 2026</span>
        </div>
      </footer>
    </div>
  );
}

function AppHeader({
  view,
  onNavigate,
  account,
  onSignOut,
}: {
  view: View;
  onNavigate: (view: View) => void;
  account: DemoAccount;
  onSignOut: () => void;
}) {
  return (
    <header className="app-header">
      <Brand onClick={() => onNavigate("home")} />
      <nav aria-label="Dashboard navigation">
        <button
          className={view === "student" ? "active" : ""}
          onClick={() => onNavigate("student")}
        >
          Student workspace
        </button>
        <button
          className={view === "organization" ? "active" : ""}
          onClick={() => onNavigate("organization")}
        >
          Organization workspace
        </button>
        <button
          className={view === "impact" ? "active" : ""}
          onClick={() => onNavigate("impact")}
        >
          Impact
        </button>
      </nav>
      <div className="app-account">
        <span className="demo-avatar" aria-hidden="true">{account.initials}</span>
        <div><strong>{account.name}</strong><small>{account.role === "student" ? "Student" : account.organization}</small></div>
        <button onClick={onSignOut}>Sign out</button>
      </div>
    </header>
  );
}

function OpportunityCard({
  opportunity,
  saved,
  applied,
  onSave,
  onApply,
  onDismiss,
  onOpen,
}: {
  opportunity: Opportunity;
  saved: boolean;
  applied: boolean;
  onSave: () => void;
  onApply: () => void;
  onDismiss: () => void;
  onOpen: () => void;
}) {
  return (
    <article className={`opportunity-card accent-${opportunity.accent}`}>
      <div className="opportunity-head">
        <div className="org-ident">
          <span className="org-logo">{opportunity.organizationMark}</span>
          <div>
            <strong>{opportunity.organization}</strong>
            <small>
              <span className="verified-dot">●</span> Verified organization
            </small>
          </div>
        </div>
        <button
          className={`save-button ${saved ? "saved" : ""}`}
          onClick={onSave}
          aria-label={saved ? "Remove from saved" : "Save opportunity"}
          title={saved ? "Saved" : "Save"}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>
      <div className="opportunity-title-row">
        <div>
          {opportunity.urgent ? <span className="urgent-label">IMMEDIATE NEED · {opportunity.startWindow}</span> : opportunity.new && <span className="new-label">NEW TODAY</span>}
          <h3>{opportunity.title}</h3>
        </div>
        <ScoreRing score={opportunity.score} small />
      </div>
      <p className="opportunity-description">{opportunity.description}</p>
      <div className="tag-row">
        <span>{opportunity.type}</span>
        <span>{opportunity.format}</span>
        <span>{opportunity.commitment}</span>
      </div>
      {opportunity.faithSupport && <div className="faith-support-row" aria-label="Faith-aware accommodations">{opportunity.faithSupport.slice(0, 2).map((support) => <span key={support}>☾ {support}</span>)}</div>}
      <div className="why-box">
        <strong>Why it matches you</strong>
        <ul>
          {opportunity.matchReasons.slice(0, 2).map((reason) => (
            <li key={reason}>
              <span>✓</span> {reason}
            </li>
          ))}
        </ul>
      </div>
      <div className="deadline-row">
        <span>
          Apply by <strong>{opportunity.deadline}</strong>
        </span>
        <span>{opportunity.location}</span>
      </div>
      <div className="card-actions">
        <button className="button button-outline compact" onClick={onOpen}>
          View details
        </button>
        <button
          className={`button compact ${applied ? "button-success" : "button-dark"}`}
          onClick={onApply}
          disabled={applied}
        >
          {applied ? "Interest sent ✓" : "Express interest"}
        </button>
      </div>
      <button className="dismiss-button" onClick={onDismiss}>
        Not for me
      </button>
    </article>
  );
}

function SkillConstellation({ profile, onProfile }: { profile: StudentProfile; onProfile: () => void }) {
  const signals = [
    { label: "Creative", value: 88 }, { label: "Community", value: 82 }, { label: "Digital", value: 74 },
    { label: "Leadership", value: 61 }, { label: "Communication", value: 68 }, { label: "Career clarity", value: 58 },
  ];
  return (
    <article className="skill-constellation">
      <div className="constellation-head"><div><span>MY GROWTH MAP</span><h3>Skills, proof, and next edges.</h3></div><button onClick={onProfile}>Update signals</button></div>
      <div className="constellation-body">
        <div className="skill-web" aria-label="Six-dimension skill graph">
          <div className="skill-web-ring ring-one" /><div className="skill-web-ring ring-two" /><div className="skill-web-ring ring-three" />
          {signals.map((signal, index) => <div className={`skill-node node-${index + 1}`} key={signal.label}><b style={{ "--signal": `${signal.value}%` } as CSSProperties} /><span>{signal.label}</span><small>{signal.value}</small></div>)}
          <div className="skill-web-core"><strong>{profile.skills.length + 4}</strong><small>signals</small></div>
        </div>
        <div className="constellation-insights"><div><small>ALREADY PROVEN</small><strong>{profile.skills.slice(0, 2).join(" + ")}</strong><p>{(profile.experienceNarrative || "").split("\n").filter(Boolean).length} experiences ready to turn into evidence.</p></div><div><small>NEXT TO BUILD</small><strong>{profile.growthFocus || "Choose a growth focus"}</strong><p>These are used to surface stretch opportunities, not lower your score.</p></div></div>
      </div>
    </article>
  );
}

type RadarPlace = { name: string; type: string; lat: number; lon: number };

function OpportunityRadar({ profile }: { profile: StudentProfile }) {
  const [zip, setZip] = useState(profile.homeZip || "");
  const [field, setField] = useState(profile.interests[0] || "Technology");
  const [places, setPlaces] = useState<RadarPlace[]>([]);
  const [status, setStatus] = useState("Use your ZIP code to discover nearby places to explore.");
  const [loading, setLoading] = useState(false);

  const searchRadar = async () => {
    if (!/^\d{5}$/.test(zip)) { setStatus("Enter a five-digit U.S. ZIP code."); return; }
    setLoading(true); setStatus("Scanning nearby community opportunities…");
    try {
      const response = await fetch(`/api/opportunity-radar?zip=${encodeURIComponent(zip)}&field=${encodeURIComponent(field)}`);
      const result = await response.json() as { results?: RadarPlace[]; error?: string };
      if (!response.ok) throw new Error(result.error || "Radar unavailable");
      setPlaces(result.results || []);
      setStatus(result.results?.length ? `${result.results.length} nearby places found — review them before treating them as confirmed openings.` : "No places found in this area. Try a broader career field.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "The radar could not connect right now."); }
    finally { setLoading(false); }
  };

  const useLocation = () => {
    if (!navigator.geolocation) { setStatus("Location sharing is not available in this browser. Use your ZIP code instead."); return; }
    setStatus("Location permission is requested by your browser; MYIN does not save your precise location.");
    navigator.geolocation.getCurrentPosition(() => setStatus("Location confirmed for this session. Add your ZIP to search partner places."), () => setStatus("Location was not shared. Your ZIP code still works."), { enableHighAccuracy: false, timeout: 7000 });
  };

  return <section className="opportunity-radar-map">
    <div className="radar-map-copy"><span><i /> OPPORTUNITY RADAR</span><h2>See nearby places where your next opportunity could begin.</h2><p>Inspired by real map discovery, then filtered through MYIN&apos;s safety and fit process.</p><div className="radar-controls"><input value={zip} onChange={(event) => setZip(event.target.value)} maxLength={5} inputMode="numeric" aria-label="ZIP code" placeholder="ZIP code" /><input value={field} onChange={(event) => setField(event.target.value)} aria-label="Career field" placeholder="Career field" /><button className="button button-gold compact" onClick={searchRadar} disabled={loading}>{loading ? "Searching…" : "Scan map"}</button></div><button className="map-location-button" onClick={useLocation}>◎ Use my live location privately</button><small>{status}</small></div>
    <div className="radar-map-visual" aria-label="Map-style opportunity radar">
      <div className="map-grid" /><div className="map-route route-one" /><div className="map-route route-two" /><div className="map-user-pin"><i />You</div>
      {(places.length ? places.slice(0, 5) : [{ name: "Mercy Clinic", type: "clinic" }, { name: "Bright Path Learning", type: "education" }, { name: "Ummah Tech", type: "office" }]).map((place, index) => <button className={`map-opportunity-pin pin-${index + 1}`} key={`${place.name}-${index}`} title={place.name}><b>{index + 1}</b><span>{place.name.split(",")[0]}</span></button>)}
      <div className="map-legend"><span><i /> MYIN partner or lead</span><span><b /> Your search center</span></div>
    </div>
  </section>;
}

function StudentView({
  profile,
  createdOpportunities,
  savedIds,
  appliedIds,
  dismissedIds,
  onSave,
  onApply,
  onDismiss,
  onOpen,
  onEmail,
  onProfile,
}: {
  profile: StudentProfile;
  createdOpportunities: Opportunity[];
  savedIds: number[];
  appliedIds: number[];
  dismissedIds: number[];
  onSave: (id: number) => void;
  onApply: (id: number) => void;
  onDismiss: (id: number) => void;
  onOpen: (opportunity: Opportunity) => void;
  onEmail: () => void;
  onProfile: () => void;
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const profileStrength = Math.min(
    100,
    56 + profile.skills.length * 4 + profile.interests.length * 3 + profile.causes.length * 3,
  );
  const matchedOpportunities = useMemo(
    () => [...opportunities, ...createdOpportunities].map((opportunity) => calculateOpportunityMatch(profile, opportunity)),
    [createdOpportunities, profile],
  );

  const filtered = useMemo(() => {
    return matchedOpportunities.filter((opportunity) => {
      if (dismissedIds.includes(opportunity.id)) return false;
      const filterMatches =
        filter === "All" ||
        (filter === "Internships" && opportunity.type === "Internship") ||
        filter === opportunity.type;
      const searchMatches =
        opportunity.title.toLowerCase().includes(search.toLowerCase()) ||
        opportunity.organization.toLowerCase().includes(search.toLowerCase()) ||
        opportunity.skills.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase()),
        );
      return filterMatches && searchMatches;
    });
  }, [dismissedIds, filter, matchedOpportunities, search]);

  return (
    <main className="dashboard-page">
      <aside className="student-sidebar">
        <div className="profile-summary">
          <div className="profile-avatar">AH</div>
          <span className="verified-profile">✓</span>
          <h2>Amina Hassan</h2>
          <p>{profile.grade} / {profile.location}</p>
          <div className="profile-completion">
            <div>
              <span>Profile strength</span>
              <strong>{profileStrength}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${profileStrength}%` }} />
            </div>
          </div>
          <button className="button button-outline full-width" onClick={onProfile}>
            Edit my profile
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">MY FOCUS</span>
          <div className="profile-chips">
            {profile.interests.map((interest) => <span key={interest}>{interest}</span>)}
          </div>
        </div>
        <div className="sidebar-section">
          <span className="sidebar-label">MY SKILLS</span>
          <ul className="simple-list">
            {profile.skills.map((skill, index) => (
              <li key={skill}>
                <span>{skill}</span>
                <small>{index < 2 ? "Confident" : "Developing"}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="privacy-note">
          <span aria-hidden="true">◉</span>
          <p>
            <strong>Your profile is protected.</strong>
            Organizations only see limited information after you express interest.
          </p>
        </div>
      </aside>

      <section className="student-main">
        <section className="student-command-hero">
          <div className="command-hero-copy">
            <div className="command-status"><i /> OPPORTUNITY RADAR ACTIVE</div>
            <h1>Your next level is already in range.</h1>
            <p>
              MYIN understands {profile.skills.length + profile.interests.length + profile.causes.length} signals
              about you and found <strong>4 high-potential moves</strong> worth making now.
            </p>
            <div className="command-actions">
              <button className="button button-gold" onClick={onProfile}>Strengthen my signal</button>
              <button className="button button-ghost-light" onClick={() => document.getElementById("match-feed")?.scrollIntoView({ behavior: "smooth" })}>
                Launch opportunity feed
              </button>
            </div>
          </div>
          <div className="radar-visual" aria-label={`${profileStrength} percent profile strength`}>
            <div className="radar-ring radar-ring-one" />
            <div className="radar-ring radar-ring-two" />
            <div className="radar-sweep" />
            <div className="radar-core">
              <strong>{profileStrength}%</strong>
              <span>signal strength</span>
            </div>
            <i className="radar-point point-one" />
            <i className="radar-point point-two" />
            <i className="radar-point point-three" />
          </div>
        </section>

        <div className="student-welcome">
          <div>
            <span className="kicker">SATURDAY, JULY 25</span>
            <h1>Good morning, Amina.</h1>
            <p>We found 4 opportunities worth your attention.</p>
          </div>
          <button className="email-preview-button" onClick={onEmail}>
            <span aria-hidden="true">✉</span>
            <div>
              <strong>Preview today&apos;s email</strong>
              <small>Your top 3 matches, ready to send</small>
            </div>
            <b aria-hidden="true">→</b>
          </button>
        </div>

        <div className="dashboard-stats">
          <article>
            <span className="stat-symbol">✦</span>
            <div>
              <strong>{matchedOpportunities.length}</strong>
              <small>New matches</small>
            </div>
            <em>+2 today</em>
          </article>
          <article>
            <span className="stat-symbol">☆</span>
            <div>
              <strong>{savedIds.length}</strong>
              <small>Saved</small>
            </div>
          </article>
          <article>
            <span className="stat-symbol">↗</span>
            <div>
              <strong>{appliedIds.length}</strong>
              <small>Interest sent</small>
            </div>
          </article>
          <article>
            <span className="stat-symbol">◷</span>
            <div>
              <strong>25</strong>
              <small>Impact hours</small>
            </div>
          </article>
        </div>

        <section className="rapid-response-panel" aria-label="Immediate community opportunities">
          <div className="rapid-response-copy">
            <span><i /> COMMUNITY RESPONSE RADAR</span>
            <h2>Make yourself available when your community needs help now.</h2>
            <p>MYIN only surfaces urgent, supervised opportunities that fit your location, schedule, and the boundaries you choose.</p>
          </div>
          <div className="rapid-response-actions">
            <strong>{profile.emergencyAvailability ? "On for trusted alerts" : "Urgent alerts paused"}</strong>
            <small>{profile.emergencyAvailability ? profile.weeklyWindows : "Turn this on from your profile whenever you want."}</small>
            <button className="button button-gold compact" onClick={onProfile}>Customize availability</button>
          </div>
        </section>

        <div className="student-growth-grid">
          <SkillConstellation profile={profile} onProfile={onProfile} />
          <article className="proof-resume-card">
            <span>MYIN PROOF PORTFOLIO</span><h3>Your work deserves receipts.</h3>
            <p>Turn experiences inside MYIN into a college- and mentor-ready record. Verified activities are clearly marked; self-entered reflections stay separate.</p>
            <div className="proof-list"><div><b>✓</b><span><strong>{(profile.experienceNarrative || "").split("\n").filter(Boolean).length} experiences logged</strong><small>Impact, role, and dates</small></span></div><div><b>◌</b><span><strong>2 verification requests ready</strong><small>Ask a supervisor or coordinator</small></span></div></div>
            <button className="button button-dark compact" onClick={() => window.print()}>Open printable MYIN resume</button>
          </article>
        </div>

        <OpportunityRadar profile={profile} />

        <section className="student-intelligence-grid">
          <article className="identity-card">
            <div className="intel-card-head">
              <span>IDENTITY SIGNAL</span>
              <button onClick={onProfile}>Tune profile</button>
            </div>
            <h3>{profile.workStyle}</h3>
            <p>{profile.careerGoal}</p>
            <div className="signal-meter-list">
              <div><span>Skills mapped</span><strong>{profile.skills.length}/8</strong><i><b style={{ width: `${Math.min(100, profile.skills.length * 12.5)}%` }} /></i></div>
              <div><span>Interests mapped</span><strong>{profile.interests.length}/6</strong><i><b style={{ width: `${Math.min(100, profile.interests.length * 16.6)}%` }} /></i></div>
              <div><span>Availability clarity</span><strong>Strong</strong><i><b style={{ width: "92%" }} /></i></div>
            </div>
          </article>
          <article className="next-move-card">
            <div className="intel-card-head"><span>YOUR NEXT MOVE</span><em>+6 match points</em></div>
            <h3>Add one project you are proud of.</h3>
            <p>Even an MSA flyer or school project helps organizations see what you can do.</p>
            <button className="text-link" onClick={onProfile}>Add experience now →</button>
          </article>
          <article className="momentum-card">
            <div className="intel-card-head"><span>MOMENTUM</span><em>THIS MONTH</em></div>
            <div className="momentum-number"><strong>+18</strong><span>profile<br />signal gain</span></div>
            <div className="mini-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
            <small>Top 12% of active student profiles</small>
          </article>
        </section>

        <div className="feed-toolbar" id="match-feed">
          <div className="filter-tabs" role="group" aria-label="Filter opportunities">
            {(["All", "Internships", "Volunteer", "Mentorship"] as Filter[]).map(
              (item) => (
                <button
                  key={item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ),
            )}
          </div>
          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search matches"
              aria-label="Search matches"
            />
          </label>
        </div>

        <div className="feed-heading">
          <div>
            <h2>Your best matches</h2>
            <p>Ranked using your interests, skills, goals, availability, and stated accommodations.</p>
          </div>
          <span>Sorted by fit</span>
        </div>

        {filtered.length > 0 ? (
          <div className="opportunity-grid" data-testid="opportunity-grid">
            {filtered.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                saved={savedIds.includes(opportunity.id)}
                applied={appliedIds.includes(opportunity.id)}
                onSave={() => onSave(opportunity.id)}
                onApply={() => onApply(opportunity.id)}
                onDismiss={() => onDismiss(opportunity.id)}
                onOpen={() => onOpen(opportunity)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>⌕</span>
            <h3>No matches in this view</h3>
            <p>Try another filter or clear your search.</p>
            <button
              className="button button-outline"
              onClick={() => {
                setFilter("All");
                setSearch("");
              }}
            >
              Show all matches
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function OrganizationOverview({ onTab }: { onTab: (tab: OrgTab) => void }) {
  return (
    <>
      <div className="org-welcome">
        <div>
          <span className="kicker">ORGANIZATION WORKSPACE</span>
          <h1>Welcome back, Rahma Community Center.</h1>
          <p>Turn a need into a clear opportunity—and meet the right youth.</p>
        </div>
        <button className="button button-gold" onClick={() => onTab("submit")}>
          + Post an opportunity
        </button>
      </div>

      <section className="org-command-strip">
        <div className="org-command-copy">
          <span><i /> TALENT NETWORK ONLINE</span>
          <h2>Your community needs are becoming student pathways.</h2>
          <p>MYIN is actively comparing your roles with 126 permissioned youth profiles across 14 fit signals.</p>
        </div>
        <div className="org-command-metrics">
          <div><small>NETWORK FIT</small><strong>91%</strong><span>High signal</span></div>
          <div><small>AVG. RESPONSE</small><strong>1.8d</strong><span>22% faster</span></div>
          <div><small>PROFILE REACH</small><strong>126</strong><span>Privacy-safe</span></div>
        </div>
      </section>

      <div className="org-stat-grid">
        <article>
          <span>ACTIVE OPPORTUNITIES</span>
          <strong>3</strong>
          <small>1 closing this week</small>
        </article>
        <article>
          <span>STUDENT MATCHES</span>
          <strong>28</strong>
          <small>12 strong matches</small>
        </article>
        <article>
          <span>INTEREST RECEIVED</span>
          <strong>9</strong>
          <small>+4 this week</small>
        </article>
        <article>
          <span>IMPACT HOURS</span>
          <strong>148</strong>
          <small>Verified this summer</small>
        </article>
      </div>

      <div className="org-content-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="kicker">CURRENT NEEDS</span>
              <h2>Your opportunities</h2>
            </div>
            <button className="text-link" onClick={() => onTab("submit")}>
              Add new →
            </button>
          </div>
          <div className="org-opportunity-list">
            <article>
              <span className="opportunity-icon gold">DM</span>
              <div>
                <strong>Youth Digital Media Assistant</strong>
                <small>Published · Closes Aug 18</small>
              </div>
              <div className="list-metric">
                <strong>12</strong>
                <small>matches</small>
              </div>
              <button onClick={() => onTab("matches")}>Review</button>
            </article>
            <article>
              <span className="opportunity-icon sage">FD</span>
              <div>
                <strong>Community Food Drive Team</strong>
                <small>Draft · Needs review</small>
              </div>
              <div className="list-metric">
                <strong>—</strong>
                <small>matches</small>
              </div>
              <button onClick={() => onTab("submit")}>Finish</button>
            </article>
            <article>
              <span className="opportunity-icon blue">TU</span>
              <div>
                <strong>Weekend Math Tutor</strong>
                <small>Published · Closes Sep 04</small>
              </div>
              <div className="list-metric">
                <strong>8</strong>
                <small>matches</small>
              </div>
              <button onClick={() => onTab("matches")}>Review</button>
            </article>
          </div>
        </section>

        <aside className="panel candidate-preview">
          <div className="panel-head">
            <div>
              <span className="kicker">BEST NEW FIT</span>
              <h2>Meet Amina</h2>
            </div>
            <ScoreRing score={93} small />
          </div>
          <div className="candidate-hero">
            <span>AH</span>
            <div>
              <strong>Amina H.</strong>
              <small>Grade 11 · Dearborn area</small>
            </div>
          </div>
          <div className="profile-chips">
            <span>Canva</span>
            <span>Social media</span>
            <span>Saturdays</span>
          </div>
          <p className="candidate-explanation">
            Amina&apos;s skills, interest in youth education, and Saturday
            availability align closely with your digital media role.
          </p>
          <button
            className="button button-dark full-width"
            onClick={() => onTab("matches")}
          >
            View recommended students
          </button>
          <small className="protected-copy">
            Personal contact details remain protected.
          </small>
        </aside>
      </div>
    </>
  );
}

function SubmissionView({
  website,
  setWebsite,
  organizationResearch,
  onResearch,
  researching,
  researchNote,
  description,
  setDescription,
  extraction,
  setExtraction,
  onExtract,
  extracting,
  extractNote,
  onPublish,
  published,
}: {
  website: string;
  setWebsite: (value: string) => void;
  organizationResearch: OrganizationResearch | null;
  onResearch: () => void;
  researching: boolean;
  researchNote: string;
  description: string;
  setDescription: (value: string) => void;
  extraction: Extraction | null;
  setExtraction: (value: Extraction) => void;
  onExtract: () => void;
  extracting: boolean;
  extractNote: string;
  onPublish: () => void;
  published: boolean;
}) {
  const updateField = (field: keyof Extraction, value: string) => {
    if (!extraction) return;
    setExtraction({ ...extraction, [field]: value });
  };

  if (published) {
    return (
      <div className="publish-success">
        <span className="success-mark">✓</span>
        <span className="kicker">READY FOR REVIEW</span>
        <h1>Your opportunity has been structured.</h1>
        <p>
          Community Food Drive Creative Team is saved and ready for an
          administrator to approve before students can see it.
        </p>
        <div className="success-summary">
          <div>
            <small>ELIGIBLE STUDENTS</small>
            <strong>36</strong>
          </div>
          <div>
            <small>STRONG MATCHES</small>
            <strong>11</strong>
          </div>
          <div>
            <small>ESTIMATED REVIEW</small>
            <strong>&lt; 1 day</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-layout">
      <div className="submission-intro">
        <span className="kicker">AI-ASSISTED SUBMISSION</span>
        <h1>From website to perfect youth role.</h1>
        <p>
          Let MYIN understand your organization, then turn a rough need into a
          clear, student-friendly opportunity.
        </p>
      </div>
      <section className="organization-research-card">
        <div className="research-step-mark">01</div>
        <div className="research-copy">
          <span>ORGANIZATION INTELLIGENCE</span>
          <h2>Start with your website. We&apos;ll do the homework.</h2>
          <p>MYIN reads public information to prepare an editable profile. Nothing is verified or published until you confirm it.</p>
          <div className="website-research-input">
            <input value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://yourorganization.org" aria-label="Organization website" />
            <button onClick={onResearch} disabled={researching || !website.trim()}>{researching ? "Understanding organization..." : "Build organization profile"}</button>
          </div>
          {researchNote && <small className="research-note">{researchNote}</small>}
        </div>
        <div className={`research-result ${organizationResearch ? "ready" : ""}`}>
          {organizationResearch ? (
            <>
              <div className="research-result-head"><span>AI DRAFT</span><strong>Ready to confirm</strong></div>
              <h3>{organizationResearch.name}</h3>
              <p>{organizationResearch.summary}</p>
              <div className="research-tags">{[...organizationResearch.sectors, ...organizationResearch.cultureSignals].slice(0, 5).map((item) => <span key={item}>{item}</span>)}</div>
              <small>{organizationResearch.location || "Location needs confirmation"}</small>
            </>
          ) : (
            <div className="research-waiting"><i>✦</i><strong>Organization profile</strong><small>Mission, programs, audience, culture, and location will appear here.</small></div>
          )}
        </div>
      </section>
      <div className="submission-grid">
        <section className="panel submission-source">
          <div className="number-heading">
            <span>2</span>
            <div>
              <h2>Paste your opportunity</h2>
              <p>Plain language is perfect—no formal job description needed.</p>
            </div>
          </div>
          <label>
            Opportunity description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={11}
            />
          </label>
          <div className="input-help">
            <span>✦</span>
            Include dates, ages, location, supervision, and the skills you need
            when you know them.
          </div>
          <button
            className="button button-gold full-width"
            onClick={onExtract}
            disabled={!description.trim() || extracting}
            data-testid="extract-button"
          >
            <span aria-hidden="true">✦</span> {extracting ? "Structuring opportunity..." : "Extract opportunity details"}
          </button>
          <small className="demo-disclosure">
            {extractNote || "Gemini drafts the listing. You confirm every field before publication."}
          </small>
        </section>

        <section
          className={`panel extraction-review ${extraction ? "ready" : ""}`}
          data-testid="extraction-review"
        >
          <div className="number-heading">
            <span>3</span>
            <div>
              <h2>Review what MYIN found</h2>
              <p>You stay in control. Edit anything before submitting.</p>
            </div>
          </div>
          {!extraction ? (
            <div className="waiting-state">
              <div className="waiting-graphic">
                <span>✦</span>
                <i />
                <i />
                <i />
              </div>
              <h3>Your structured listing will appear here.</h3>
              <p>
                MYIN highlights uncertain or missing information instead of
                inventing details.
              </p>
            </div>
          ) : (
            <div className="extraction-form">
              <div className="confidence-banner">
                <span>✓</span>
                <p>
                  <strong>High-confidence extraction</strong>
                  <small>9 fields found · 1 field needs confirmation</small>
                </p>
                <b>92%</b>
              </div>
              <label className="wide-field">
                Opportunity title
                <input
                  value={extraction.title}
                  onChange={(event) => updateField("title", event.target.value)}
                />
              </label>
              <div className="form-grid">
                <label>
                  Type
                  <select
                    value={extraction.type}
                    onChange={(event) => updateField("type", event.target.value)}
                  >
                    <option>Volunteer</option>
                    <option>Internship</option>
                    <option>Mentorship</option>
                  </select>
                </label>
                <label>
                  Date
                  <input
                    value={extraction.date}
                    onChange={(event) => updateField("date", event.target.value)}
                  />
                </label>
                <label>
                  Commitment
                  <input
                    value={extraction.commitment}
                    onChange={(event) =>
                      updateField("commitment", event.target.value)
                    }
                  />
                </label>
                <label>
                  Format
                  <select
                    value={extraction.format}
                    onChange={(event) => updateField("format", event.target.value)}
                  >
                    <option>In person</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </label>
                <label>
                  Age range
                  <input
                    value={extraction.ageRange}
                    onChange={(event) =>
                      updateField("ageRange", event.target.value)
                    }
                  />
                </label>
                <label>
                  Location
                  <input
                    value={extraction.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                  />
                </label>
              </div>
              <label className="wide-field">
                Skills requested
                <input
                  value={extraction.skills}
                  onChange={(event) => updateField("skills", event.target.value)}
                />
              </label>
              <label className="wide-field attention-field">
                Adult supervision
                <input
                  value={extraction.supervision}
                  onChange={(event) =>
                    updateField("supervision", event.target.value)
                  }
                />
                <small>Confirm the supervising adult before publication.</small>
              </label>
              <div className="accommodation-publisher">
                <div><span>☾</span><div><strong>Faith-aware and access details</strong><small>Clear accommodations help the right young people say yes with confidence.</small></div></div>
                <div className="form-grid">
                  <label>Prayer space<select value={extraction.prayerSpace} onChange={(event) => updateField("prayerSpace", event.target.value)}><option value="">Not specified</option><option>Quiet room available</option><option>Nearby space available</option><option>Participants may arrange their own</option></select></label>
                  <label>Prayer breaks<select value={extraction.prayerBreaks} onChange={(event) => updateField("prayerBreaks", event.target.value)}><option value="">Not specified</option><option>Flexible breaks welcomed</option><option>Schedule can be adjusted</option><option>Ask coordinator in advance</option></select></label>
                  <label>Food details<select value={extraction.halalFood} onChange={(event) => updateField("halalFood", event.target.value)}><option value="">Not specified</option><option>Halal food provided</option><option>Halal options nearby</option><option>Bring-your-own welcome</option></select></label>
                  <label>Urgency<select value={extraction.urgentNeed} onChange={(event) => updateField("urgentNeed", event.target.value)}><option>No</option><option>Yes — immediate need</option></select></label>
                </div>
              </div>
              <button
                className="button button-dark full-width"
                onClick={onPublish}
              >
                Submit for safety review
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MatchesView({
  shortlisted,
  onShortlist,
}: {
  shortlisted: number[];
  onShortlist: (id: number) => void;
}) {
  return (
    <div className="matches-view">
      <div className="matches-heading">
        <div>
          <span className="kicker">EXPLAINABLE RECOMMENDATIONS</span>
          <h1>12 students match your digital media role.</h1>
          <p>
            Only students who opted into discovery or expressed interest are
            included.
          </p>
        </div>
        <div className="role-selector">
          <small>SHOWING MATCHES FOR</small>
          <strong>Youth Digital Media Assistant⌄</strong>
        </div>
      </div>
      <div className="match-safety-bar">
        <span>◉</span>
        <p>
          <strong>Privacy-safe view:</strong> Last names, schools, contact
          details, and precise locations are hidden.
        </p>
      </div>
      <section className="candidate-pipeline" aria-label="Candidate pipeline">
        <article><span>Recommended</span><strong>12</strong><small>Best-fit profiles</small></article>
        <article><span>Interested</span><strong>4</strong><small>Student-led signals</small></article>
        <article><span>Shortlisted</span><strong>{shortlisted.length}</strong><small>Ready to review</small></article>
        <article><span>Introductions</span><strong>1</strong><small>Consent in progress</small></article>
      </section>
      <div className="candidate-list">
        {candidates.map((candidate, index) => {
          const isShortlisted = shortlisted.includes(candidate.id);
          return (
            <article key={candidate.id} className="candidate-card">
              <span className="candidate-rank">#{index + 1}</span>
              <div className="candidate-avatar">{candidate.initials}</div>
              <div className="candidate-info">
                <h2>{candidate.name}</h2>
                <p>Student · Southeast Michigan</p>
                <div className="profile-chips">
                  {candidate.details.split(" · ").map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="candidate-fit">
                <ScoreRing score={candidate.score} small />
                <p>{candidate.reason}</p>
              </div>
              <div className="candidate-actions">
                <button
                  className={`button compact ${
                    isShortlisted ? "button-success" : "button-dark"
                  }`}
                  onClick={() => onShortlist(candidate.id)}
                >
                  {isShortlisted ? "Shortlisted ✓" : "Shortlist"}
                </button>
                <button className="button button-outline compact">
                  View safe profile
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <div className="introduction-note">
        <span>Next step</span>
        <p>
          When you select a student, MYIN requests a controlled introduction.
          Guardian or administrator approval is required where applicable.
        </p>
        <button className="button button-gold">Request safe introduction</button>
      </div>
    </div>
  );
}

function OrganizationView({
  onPublishOpportunity,
}: {
  onPublishOpportunity: (opportunity: Opportunity) => void;
}) {
  const [tab, setTab] = useState<OrgTab>("overview");
  const [website, setWebsite] = useState("https://rahmacommunity.example");
  const [organizationResearch, setOrganizationResearch] = useState<OrganizationResearch | null>(null);
  const [researching, setResearching] = useState(false);
  const [researchNote, setResearchNote] = useState("");
  const [description, setDescription] = useState(defaultDescription);
  const [extraction, setExtraction] = useState<Extraction | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractNote, setExtractNote] = useState("");
  const [published, setPublished] = useState(false);
  const [shortlisted, setShortlisted] = useState<number[]>([]);

  const researchOrganization = async () => {
    setResearching(true);
    setResearchNote("");
    try {
      const response = await fetch("/api/organization-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website }),
      });
      if (!response.ok) throw new Error("Research unavailable");
      setOrganizationResearch((await response.json()) as OrganizationResearch);
      setResearchNote("Public website analyzed. Review this AI draft before using it.");
    } catch {
      setOrganizationResearch({
        name: "Rahma Community Center",
        summary: "A fictional community hub supporting families, youth learning, and neighborhood service projects.",
        mission: "Help local families thrive through service, learning, and connection.",
        sectors: ["Community services", "Youth programs"],
        audiences: ["Youth", "Families"],
        cultureSignals: ["Service-led", "Mentorship"],
        location: "Dearborn, MI",
        sourceNote: "Demo profile shown until Gemini is configured.",
        website,
      });
      setResearchNote("Demo profile shown. Add GEMINI_API_KEY to activate live website understanding.");
    } finally {
      setResearching(false);
    }
  };

  const extract = async () => {
    setExtracting(true);
    setExtractNote("");
    try {
      const response = await fetch("/api/opportunity-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          organizationContext: organizationResearch
            ? `${organizationResearch.name}: ${organizationResearch.summary}. Mission: ${organizationResearch.mission}`
            : "",
        }),
      });
      if (!response.ok) throw new Error("Extraction unavailable");
      const result = (await response.json()) as Extraction & { missingFields?: string[] };
      setExtraction(result);
      setExtractNote(`Gemini extraction complete${result.missingFields?.length ? ` — ${result.missingFields.length} field(s) need confirmation` : ""}.`);
      setExtracting(false);
      return;
    } catch {
      setExtractNote("Gemini is not configured yet. Manual fields are open; no details were invented.");
    }
    setExtraction({
      title: "",
      type: "Volunteer",
      date: "",
      commitment: "",
      location: "",
      format: "In person",
      ageRange: "",
      supervision: "",
      skills: "",
      impact: "",
      prayerSpace: "",
      prayerBreaks: "",
      halalFood: "",
      urgentNeed: "No",
    });
    setExtracting(false);
  };

  const toggleShortlist = (id: number) => {
    setShortlisted((current) =>
      current.includes(id)
        ? current.filter((candidateId) => candidateId !== id)
        : [...current, id],
    );
  };

  const publishOpportunity = () => {
    if (!extraction?.title.trim()) return;
    const skills = extraction.skills.split(",").map((item) => item.trim()).filter(Boolean);
    onPublishOpportunity({
      id: 1001,
      title: extraction.title,
      organization: organizationResearch?.name || "Rahma Community Center",
      organizationMark: (organizationResearch?.name || "Rahma Community Center").split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase(),
      type: extraction.type as Opportunity["type"],
      format: extraction.format,
      location: extraction.location || "Location to confirm",
      deadline: extraction.date || "Date to confirm",
      commitment: extraction.commitment || "Commitment to confirm",
      description: extraction.impact || description,
      skills,
      matchReasons: [],
      score: 0,
      breakdown: [],
      accent: "gold",
      new: true,
      urgent: extraction.urgentNeed === "Yes — immediate need",
      faithSupport: [
        extraction.prayerSpace && `Prayer space: ${extraction.prayerSpace}`,
        extraction.prayerBreaks && `Prayer breaks: ${extraction.prayerBreaks}`,
        extraction.halalFood && `Food: ${extraction.halalFood}`,
      ].filter(Boolean) as string[],
    });
    setPublished(true);
  };

  return (
    <main className="org-page">
      <aside className="org-sidebar">
        <div className="org-sidebar-profile">
          <span className="org-large-mark">RC</span>
          <div>
            <strong>Rahma Community Center</strong>
            <small>
              <span>●</span> Verified partner
            </small>
          </div>
        </div>
        <nav aria-label="Organization workspace">
          <button
            className={tab === "overview" ? "active" : ""}
            onClick={() => setTab("overview")}
          >
            <span>⌂</span> Overview
          </button>
          <button
            className={tab === "submit" ? "active" : ""}
            onClick={() => setTab("submit")}
          >
            <span>＋</span> Submit opportunity
          </button>
          <button
            className={tab === "matches" ? "active" : ""}
            onClick={() => setTab("matches")}
          >
            <span>◎</span> Student matches
            <b>12</b>
          </button>
        </nav>
        <div className="org-sidebar-help">
          <span>?</span>
          <strong>Need a hand?</strong>
          <p>Our submission assistant can turn a rough idea into a clear role.</p>
          <button onClick={() => setTab("submit")}>Try it now →</button>
        </div>
      </aside>
      <section className="org-main">
        {tab === "overview" && <OrganizationOverview onTab={setTab} />}
        {tab === "submit" && (
          <SubmissionView
            website={website}
            setWebsite={setWebsite}
            organizationResearch={organizationResearch}
            onResearch={researchOrganization}
            researching={researching}
            researchNote={researchNote}
            description={description}
            setDescription={setDescription}
            extraction={extraction}
            setExtraction={setExtraction}
            onExtract={extract}
            extracting={extracting}
            extractNote={extractNote}
            onPublish={publishOpportunity}
            published={published}
          />
        )}
        {tab === "matches" && (
          <MatchesView shortlisted={shortlisted} onShortlist={toggleShortlist} />
        )}
      </section>
    </main>
  );
}

function ImpactView() {
  return (
    <main className="impact-page">
      <section className="impact-hero">
        <div>
          <span className="kicker kicker-light">COMMUNITY IMPACT</span>
          <h1>One intelligent connection can ripple outward.</h1>
          <p>
            This demo dashboard shows how MYIN can measure opportunity,
            contribution, and trust—not just clicks.
          </p>
        </div>
        <div className="impact-hero-stat">
          <strong>1,284</strong>
          <span>student impact hours</span>
          <small>Across the pilot community</small>
        </div>
      </section>

      <section className="impact-content">
        <div className="impact-metrics">
          <article>
            <small>STUDENTS MATCHED</small>
            <strong>186</strong>
            <span>↑ 24 this month</span>
          </article>
          <article>
            <small>OPPORTUNITIES PUBLISHED</small>
            <strong>42</strong>
            <span>Across 18 partners</span>
          </article>
          <article>
            <small>INTEREST SENT</small>
            <strong>73</strong>
            <span>39% match-to-interest rate</span>
          </article>
          <article>
            <small>SAFE INTRODUCTIONS</small>
            <strong>31</strong>
            <span>100% consent recorded</span>
          </article>
        </div>

        <div className="impact-grid">
          <section className="panel impact-chart-panel">
            <div className="panel-head">
              <div>
                <span className="kicker">OPPORTUNITY FUNNEL</span>
                <h2>From match to contribution</h2>
              </div>
              <span className="period-pill">Summer pilot</span>
            </div>
            <div className="funnel">
              <div>
                <span style={{ width: "100%" }}>
                  <strong>1,420</strong> eligible matches
                </span>
              </div>
              <div>
                <span style={{ width: "76%" }}>
                  <strong>486</strong> opportunity views
                </span>
              </div>
              <div>
                <span style={{ width: "54%" }}>
                  <strong>73</strong> interest signals
                </span>
              </div>
              <div>
                <span style={{ width: "34%" }}>
                  <strong>31</strong> safe introductions
                </span>
              </div>
            </div>
          </section>

          <section className="panel skills-panel">
            <div className="panel-head">
              <div>
                <span className="kicker">SKILLS IN MOTION</span>
                <h2>What students contribute</h2>
              </div>
            </div>
            <ul>
              <li>
                <span>Design & media</span>
                <div>
                  <i style={{ width: "88%" }} />
                </div>
                <strong>38%</strong>
              </li>
              <li>
                <span>Teaching & tutoring</span>
                <div>
                  <i style={{ width: "67%" }} />
                </div>
                <strong>27%</strong>
              </li>
              <li>
                <span>Events & outreach</span>
                <div>
                  <i style={{ width: "52%" }} />
                </div>
                <strong>21%</strong>
              </li>
              <li>
                <span>Technology</span>
                <div>
                  <i style={{ width: "35%" }} />
                </div>
                <strong>14%</strong>
              </li>
            </ul>
          </section>
        </div>

        <section className="trust-dashboard">
          <div>
            <span className="kicker kicker-light">TRUST HEALTH</span>
            <h2>Safety is a product metric.</h2>
            <p>
              Every organization, listing, introduction, and consent decision
              leaves an auditable record.
            </p>
          </div>
          <div className="trust-metrics">
            <article>
              <span>✓</span>
              <strong>100%</strong>
              <small>organizations reviewed</small>
            </article>
            <article>
              <span>✓</span>
              <strong>100%</strong>
              <small>listings include supervision</small>
            </article>
            <article>
              <span>✓</span>
              <strong>0</strong>
              <small>open safety reports</small>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}

function OpportunityModal({
  opportunity,
  applied,
  onApply,
  onClose,
}: {
  opportunity: Opportunity;
  applied: boolean;
  onApply: () => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal opportunity-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="opportunity-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal-opportunity-head">
          <div className="org-ident">
            <span className="org-logo">{opportunity.organizationMark}</span>
            <div>
              <strong>{opportunity.organization}</strong>
              <small>● Verified organization</small>
            </div>
          </div>
          <ScoreRing score={opportunity.score} />
        </div>
        <span className="new-label">{opportunity.type.toUpperCase()}</span>
        <h2 id="opportunity-modal-title">{opportunity.title}</h2>
        <p className="modal-summary">{opportunity.description}</p>
        <div className="modal-meta-grid">
          <div>
            <small>FORMAT</small>
            <strong>{opportunity.format}</strong>
          </div>
          <div>
            <small>LOCATION</small>
            <strong>{opportunity.location}</strong>
          </div>
          <div>
            <small>COMMITMENT</small>
            <strong>{opportunity.commitment}</strong>
          </div>
          <div>
            <small>DEADLINE</small>
            <strong>{opportunity.deadline}</strong>
          </div>
        </div>
        <div className="score-breakdown">
          <div>
            <h3>How your match is calculated</h3>
            <span>Transparent 100-point rubric</span>
          </div>
          {opportunity.breakdown.map((item) => (
            <div className="score-row" key={item.label}>
              <span>{item.label}</span>
              <div>
                <i
                  style={{
                    width: `${Math.round((item.earned / item.possible) * 100)}%`,
                  }}
                />
              </div>
              <strong>
                {item.earned}/{item.possible}
              </strong>
            </div>
          ))}
        </div>
        <div className="safety-checklist">
          <strong>Before you express interest</strong>
          <span>✓ Adult supervision is listed</span>
          <span>✓ Your age range is eligible</span>
          <span>✓ Contact details remain private</span>
        </div>
        <button
          className={`button full-width ${
            applied ? "button-success" : "button-dark"
          }`}
          onClick={onApply}
          disabled={applied}
        >
          {applied ? "Interest sent ✓" : "Express interest safely"}
        </button>
      </section>
    </div>
  );
}

function EmailModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal email-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="email-window-bar">
          <span />
          <span />
          <span />
          <p>MYIN daily opportunity email</p>
        </div>
        <div className="email-envelope">
          <div className="email-metadata">
            <p>
              <strong>From:</strong> MYIN Matches &lt;matches@myin.community&gt;
            </p>
            <p>
              <strong>Subject:</strong> Amina, your best new match is 93% ✦
            </p>
          </div>
          <div className="email-body">
            <div className="email-brand">MYIN</div>
            <span className="kicker">YOUR SATURDAY DIGEST</span>
            <h2 id="email-modal-title">One opportunity is especially worth a look.</h2>
            <p>Good morning, Amina. We ranked today&apos;s new opportunities around what matters to you.</p>
            <article className="email-match-card">
              <div>
                <span className="new-label">93% STRONG MATCH</span>
                <h3>Youth Digital Media Assistant</h3>
                <small>Bright Path Learning · Verified</small>
              </div>
              <p>
                This matches your Canva experience, interest in youth education,
                and Saturday availability.
              </p>
              <div className="preview-meta">
                <span>Hybrid</span>
                <span>3–5 hrs/week</span>
                <span>Due Aug 18</span>
              </div>
              <button className="button button-dark full-width">
                View opportunity
              </button>
            </article>
            <p className="email-footer-copy">
              You&apos;re receiving a daily digest. Change frequency or
              unsubscribe anytime from your profile.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileModal({
  profile,
  onSave,
  onClose,
}: {
  profile: StudentProfile;
  onSave: (profile: StudentProfile) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [analysisNote, setAnalysisNote] = useState("");
  const [suggestedWorkStyle, setSuggestedWorkStyle] = useState("");

  const update = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const analyzeStory = async () => {
    if (!draft.narrative.trim()) return;
    setAnalyzing(true);
    setAnalysisNote("");
    try {
      const response = await fetch("/api/profile-enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ narrative: draft.narrative }),
      });
      if (!response.ok) throw new Error("AI unavailable");
      const result = (await response.json()) as {
        skills: string[];
        interests: string[];
        causes: string[];
        workStyle: string;
        summary: string;
      };
      setSuggestions([...result.skills.slice(0, 3), ...result.interests.slice(0, 2), ...result.causes.slice(0, 1)]);
      setSuggestedWorkStyle(result.workStyle);
      setAnalysisNote(result.summary);
    } catch {
      const text = draft.narrative.toLowerCase();
      const next = [
        text.includes("msa") || text.includes("community") ? "Community leadership" : "Self-directed learner",
        text.includes("flyer") || text.includes("design") ? "Visual communication" : "Clear communication",
        text.includes("student") || text.includes("tutor") ? "Youth mentorship" : "Collaborative work",
      ];
      setSuggestions(next);
      setAnalysisNote("Preview suggestions shown. Add the Gemini key to activate live enrichment.");
    } finally {
      setAnalyzing(false);
    }
  };

  const acceptSuggestions = () => {
    update("skills", Array.from(new Set([...draft.skills, ...suggestions.slice(0, 3)])));
    update("interests", Array.from(new Set([...draft.interests, ...suggestions.slice(3)])));
    if (suggestedWorkStyle) update("workStyle", suggestedWorkStyle);
    setSuggestions([]);
    setSuggestedWorkStyle("");
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <span className="kicker">MYIN IDENTITY STUDIO</span>
        <h2 id="profile-modal-title">Turn who you are into better opportunities.</h2>
        <p>Required basics unlock eligibility. Optional signals make every match sharper.</p>
        <div className="profile-form">
          <div className="profile-form-section-title">
            <span>01</span><div><strong>Eligibility essentials</strong><small>Required for accurate matches</small></div>
          </div>
          <div className="form-grid">
            <label>
              Grade
              <select value={draft.grade} onChange={(event) => update("grade", event.target.value)}>
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
                <option>College</option>
              </select>
            </label>
            <label>
              General location
              <input value={draft.location} onChange={(event) => update("location", event.target.value)} />
            </label>
            <label>
              Preferred format
              <select value={draft.preferredFormat} onChange={(event) => update("preferredFormat", event.target.value)}>
                <option>Local or virtual</option>
                <option>Virtual only</option>
                <option>Local only</option>
              </select>
            </label>
            <label>
              Quick availability summary
              <input value={draft.availability} onChange={(event) => update("availability", event.target.value)} placeholder="e.g. Saturdays, 10 AM–4 PM" />
            </label>
          </div>
          <div className="availability-studio">
            <div><strong>Build your real weekly availability</strong><small>Optional but powerful: include days, time windows, school limits, travel time, and blackout periods.</small></div>
            <textarea value={draft.weeklyWindows} onChange={(event) => update("weeklyWindows", event.target.value)} placeholder="Example: Mon–Thu after 4 PM; Saturday 10 AM–4 PM; unavailable during exams." />
            <label className="discoverable-control emergency-toggle">
              <input type="checkbox" checked={draft.emergencyAvailability} onChange={(event) => update("emergencyAvailability", event.target.checked)} />
              <span><strong>Show me verified immediate-need opportunities</strong><small>Examples: supervised clinic, food pantry, or community-event shifts. You choose when this is on.</small></span>
            </label>
          </div>
          <div className="profile-form-section-title">
            <span>01a</span><div><strong>Faith-aware preferences</strong><small>Private preference signals — only used to find a more respectful fit</small></div>
          </div>
          <div className="profile-option-grid faith-preference-grid">
            <label>Prayer-time preference <small>Optional</small><select value={draft.prayerPreference} onChange={(event) => update("prayerPreference", event.target.value)}><option>I need a short, flexible break for Zuhr/Asr when shifts overlap.</option><option>Flexible; please share the schedule clearly.</option><option>I do not need prayer accommodations listed.</option></select></label>
            <label>Friday / Jumu&apos;ah preference <small>Optional</small><select value={draft.jumuahPreference} onChange={(event) => update("jumuahPreference", event.target.value)}><option>Keep Friday midday open when possible</option><option>I can work Friday with a flexible break</option><option>No Friday preference</option></select></label>
          </div>
          <label>Accommodation note <small>Optional — visible only as a preference, not as personal information</small><input value={draft.accommodationNotes} onChange={(event) => update("accommodationNotes", event.target.value)} placeholder="e.g. A quiet place to pray is appreciated" /></label>
          <div className="profile-form-section-title">
            <span>01b</span><div><strong>Experience and proof portfolio</strong><small>Build the evidence colleges, mentors, and community partners can understand</small></div>
          </div>
          <label>Home ZIP code <small>Optional — used only when you choose to search the Opportunity Radar</small><input value={draft.homeZip} onChange={(event) => update("homeZip", event.target.value.replace(/\D/g, "").slice(0, 5))} inputMode="numeric" placeholder="e.g. 48126" /></label>
          <label>Past experiences <small>One per line: role | dates | what you did or achieved</small><textarea value={draft.experienceNarrative} onChange={(event) => update("experienceNarrative", event.target.value)} placeholder="MSA Media Lead | 2025–present | Designed event flyers for 120+ students" /></label>
          <label>What do you want to get better at? <small>Optional — MYIN uses this to suggest growth opportunities</small><input value={draft.growthFocus} onChange={(event) => update("growthFocus", event.target.value)} placeholder="e.g. public speaking, coding, leadership" /></label>
          <div className="profile-form-section-title">
            <span>02</span><div><strong>Your opportunity signal</strong><small>Specific beats impressive</small></div>
          </div>
          <label>
            Skills <small>Separate each with a comma</small>
            <input value={draft.skills.join(", ")} onChange={(event) => update("skills", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} />
          </label>
          <label>
            Interests <small>Optional</small>
            <input value={draft.interests.join(", ")} onChange={(event) => update("interests", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} />
          </label>
          <label>
            Causes you care about <small>Optional</small>
            <input value={draft.causes.join(", ")} onChange={(event) => update("causes", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} />
          </label>
          <label>
            Career goal
            <input value={draft.careerGoal} onChange={(event) => update("careerGoal", event.target.value)} />
          </label>
          <div className="profile-option-grid">
            <label>Experience level<select value={draft.experienceLevel} onChange={(event) => update("experienceLevel", event.target.value)}><option>Just exploring</option><option>Growing portfolio</option><option>Ready to contribute</option></select></label>
            <label>Best work style<select value={draft.workStyle} onChange={(event) => update("workStyle", event.target.value)}><option>Creative team</option><option>Independent focus</option><option>People-facing</option><option>Research and analysis</option></select></label>
            <label>Transportation <small>Optional</small><select value={draft.transportation} onChange={(event) => update("transportation", event.target.value)}><option>Local rides available</option><option>Public transit</option><option>Remote only</option><option>Flexible</option></select></label>
            <label>Languages <small>Optional</small><input value={draft.languages.join(", ")} onChange={(event) => update("languages", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /></label>
          </div>

          <div className="ai-story-panel">
            <div className="ai-story-head">
              <span className="ai-spark">✦</span>
              <div><strong>Tell MYIN in your own words</strong><small>AI enrichment preview — you approve every suggestion</small></div>
            </div>
            <textarea value={draft.narrative} onChange={(event) => update("narrative", event.target.value)} placeholder="Example: I help my MSA with flyers, enjoy tutoring younger students, and want to learn how technology can help my community..." />
            <div className="ai-story-action">
              <small>Your story stays private and is never shown directly to organizations.</small>
              <button type="button" onClick={analyzeStory} disabled={analyzing || !draft.narrative.trim()}>{analyzing ? "Reading your story..." : "Find hidden strengths"}</button>
            </div>
            {suggestions.length > 0 && (
              <div className="ai-suggestion-box">
                <div><strong>Suggested signals</strong><small>Review before adding</small></div>
                {analysisNote && <p>{analysisNote}</p>}
                <div className="suggestion-chips">{suggestions.map((suggestion) => <span key={suggestion}>{suggestion}</span>)}</div>
                <div className="suggestion-actions"><button type="button" onClick={() => setSuggestions([])}>Dismiss</button><button type="button" onClick={acceptSuggestions}>Add to my profile</button></div>
              </div>
            )}
          </div>
          <label className="discoverable-control">
            <input type="checkbox" defaultChecked />
            <span>
              <strong>Let verified organizations discover my limited profile</strong>
              <small>Contact details and precise location remain hidden.</small>
            </span>
          </label>
          <button
            className={`button full-width ${
              saved ? "button-success" : "button-dark"
            }`}
            onClick={() => {
              setSaved(true);
              onSave(draft);
              window.setTimeout(onClose, 650);
            }}
          >
            {saved ? "Profile updated ✓" : "Save profile"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [account, setAccount] = useState<DemoAccount | null>(null);
  const [customAccounts, setCustomAccounts] = useState<StoredDemoAccount[]>([]);
  const [profile, setProfile] = useState<StudentProfile>(initialStudentProfile);
  const [createdOpportunities, setCreatedOpportunities] = useState<Opportunity[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem("myin-demo-state");
        if (stored) {
          const state = JSON.parse(stored) as {
            savedIds?: number[];
            appliedIds?: number[];
            dismissedIds?: number[];
            profile?: StudentProfile;
            createdOpportunities?: Opportunity[];
          };
          setSavedIds(state.savedIds ?? []);
          setAppliedIds(state.appliedIds ?? []);
          setDismissedIds(state.dismissedIds ?? []);
          setProfile({ ...initialStudentProfile, ...(state.profile ?? {}) });
          setCreatedOpportunities(state.createdOpportunities ?? []);
        }
        const storedAccount = window.localStorage.getItem("myin-demo-account");
        if (storedAccount) setAccount(JSON.parse(storedAccount) as DemoAccount);
        const storedCustomAccounts = window.localStorage.getItem("myin-custom-accounts");
        if (storedCustomAccounts) setCustomAccounts(JSON.parse(storedCustomAccounts) as StoredDemoAccount[]);
      } catch {
        // The demo still works if local storage is unavailable.
      }
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      "myin-demo-state",
      JSON.stringify({ savedIds, appliedIds, dismissedIds, profile, createdOpportunities }),
    );
  }, [appliedIds, createdOpportunities, dismissedIds, hydrated, profile, savedIds]);

  useEffect(() => {
    if (!hydrated) return;
    if (account) window.localStorage.setItem("myin-demo-account", JSON.stringify(account));
    else window.localStorage.removeItem("myin-demo-account");
  }, [account, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("myin-custom-accounts", JSON.stringify(customAccounts));
  }, [customAccounts, hydrated]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const navigate = (nextView: View) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const login = (nextAccount: DemoAccount) => {
    setAccount(nextAccount);
    navigate(nextAccount.role === "student" ? "student" : "organization");
  };

  const createAccount = (nextAccount: StoredDemoAccount) => {
    if (demoAccounts[nextAccount.username] || customAccounts.some((account) => account.username === nextAccount.username)) {
      return "That username is already taken. Try another one.";
    }
    setCustomAccounts((current) => [...current, nextAccount]);
    return null;
  };

  const signOut = () => {
    setAccount(null);
    navigate("home");
  };

  const toggleSave = (id: number) => {
    setSavedIds((current) => {
      const isSaved = current.includes(id);
      setNotice(isSaved ? "Removed from saved opportunities." : "Opportunity saved.");
      return isSaved ? current.filter((item) => item !== id) : [...current, id];
    });
  };

  const apply = (id: number) => {
    if (appliedIds.includes(id)) return;
    setAppliedIds((current) => [...current, id]);
    setNotice("Interest sent safely. Your contact details are still private.");
  };

  const dismiss = (id: number) => {
    setDismissedIds((current) => [...current, id]);
    setNotice("Got it. We’ll use that feedback to improve your matches.");
  };

  return (
    <>
      {view === "home" ? (
        <HomeView onNavigate={navigate} />
      ) : view === "auth" ? (
        <AuthView onBack={() => navigate("home")} onLogin={login} customAccounts={customAccounts} onCreateAccount={createAccount} />
      ) : (
        <div className="app-shell">
          <AppHeader view={view} onNavigate={navigate} account={account ?? demoAccounts.amina_test} onSignOut={signOut} />
          {view === "student" && (
            <StudentView
              profile={profile}
              createdOpportunities={createdOpportunities}
              savedIds={savedIds}
              appliedIds={appliedIds}
              dismissedIds={dismissedIds}
              onSave={toggleSave}
              onApply={apply}
              onDismiss={dismiss}
              onOpen={setSelectedOpportunity}
              onEmail={() => setShowEmail(true)}
              onProfile={() => setShowProfile(true)}
            />
          )}
          {view === "organization" && <OrganizationView onPublishOpportunity={(opportunity) => setCreatedOpportunities((current) => [...current.filter((item) => item.id !== opportunity.id), opportunity])} />}
          {view === "impact" && <ImpactView />}
        </div>
      )}

      {selectedOpportunity && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          applied={appliedIds.includes(selectedOpportunity.id)}
          onApply={() => apply(selectedOpportunity.id)}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
      {showEmail && <EmailModal onClose={() => setShowEmail(false)} />}
      {showProfile && <ProfileModal profile={profile} onSave={setProfile} onClose={() => setShowProfile(false)} />}
      {notice && (
        <div className="toast" role="status">
          <span>✓</span>
          {notice}
        </div>
      )}
    </>
  );
}

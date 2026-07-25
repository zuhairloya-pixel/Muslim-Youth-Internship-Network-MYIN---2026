"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateMatch, type MatchBreakdownItem } from "../lib/matching";

type View = "home" | "student" | "organization" | "impact";
type OrgTab = "overview" | "submit" | "matches";
type Filter = "All" | "Internships" | "Volunteer" | "Mentorship";

type ScoreItem = MatchBreakdownItem;

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
};

type Extraction = {
  title: string;
  type: "Volunteer" | "Internship" | "Mentorship" | "";
  date: string;
  commitment: string;
  location: string;
  format: "In person" | "Remote" | "Hybrid" | "";
  ageRange: string;
  supervision: string;
  skills: string;
  impact: string;
  description: string;
  interests: string;
  deadline: string;
};

const aminaProfile = {
  age: 16,
  interests: [
    "Youth education",
    "Community service",
    "Media",
    "Technology",
    "Design",
  ],
  skills: ["Canva", "Social media", "Web design"],
  careerGoals: ["Technology", "Design", "Media"],
  availability: ["Saturday", "Weekend"],
  location: "Dearborn",
  formats: ["Hybrid", "Remote", "In person"],
  opportunityTypes: ["Volunteer", "Internship", "Mentorship"],
};

const extractionFields = [
  "title",
  "type",
  "date",
  "commitment",
  "location",
  "format",
  "ageRange",
  "supervision",
  "skills",
  "impact",
] as const;

type ExtractionField = (typeof extractionFields)[number];

type ExtractionResult = {
  extraction: Omit<Extraction, "description" | "interests" | "deadline">;
  completeness: number;
  needsConfirmation: ExtractionField[];
};

function summarizeExtraction(extraction: Extraction) {
  const needsConfirmation = extractionFields.filter(
    (field) => !extraction[field].trim(),
  );

  return {
    completeness: Math.round(
      ((extractionFields.length - needsConfirmation.length) /
        extractionFields.length) *
        100,
    ),
    needsConfirmation,
  };
}

const opportunities: Opportunity[] = [
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

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button className="brand" onClick={onClick} aria-label="Go to MYIN home">
      <span className="brand-mark" aria-hidden="true">
        M
      </span>
      <span>
        <strong>MYIN</strong>
        <small>Muslim Youth Internship Network</small>
      </span>
    </button>
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
        onStudent={() => onNavigate("student")}
        onOrganization={() => onNavigate("organization")}
      />

      <main>
        <section className="hero">
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
              <p className="hero-subtitle">
                MYIN finds opportunities built for who you are—and shows exactly
                why each one belongs on your radar.
              </p>
              <div className="hero-actions">
                <button
                  className="button button-gold"
                  onClick={() => onNavigate("student")}
                >
                  See Amina&apos;s matches <span aria-hidden="true">→</span>
                </button>
                <button
                  className="button button-ghost-light"
                  onClick={() => onNavigate("organization")}
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
            </div>

            <div className="hero-product" aria-label="Example MYIN match">
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
                  onClick={() => onNavigate("student")}
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
            </div>
            <div>
              <button
                className="button button-dark"
                onClick={() => onNavigate("student")}
              >
                Explore as a student
              </button>
              <button
                className="button button-outline"
                onClick={() => onNavigate("organization")}
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
}: {
  view: View;
  onNavigate: (view: View) => void;
}) {
  return (
    <header className="app-header">
      <Brand onClick={() => onNavigate("home")} />
      <nav aria-label="Dashboard navigation">
        <button
          className={view === "student" ? "active" : ""}
          onClick={() => onNavigate("student")}
        >
          Student demo
        </button>
        <button
          className={view === "organization" ? "active" : ""}
          onClick={() => onNavigate("organization")}
        >
          Organization demo
        </button>
        <button
          className={view === "impact" ? "active" : ""}
          onClick={() => onNavigate("impact")}
        >
          Impact
        </button>
      </nav>
      <button className="demo-avatar" aria-label="Amina profile">
        AH
      </button>
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
          {opportunity.new && <span className="new-label">NEW TODAY</span>}
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

function StudentView({
  opportunities,
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
  opportunities: Opportunity[];
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

  const filtered = useMemo(() => {
    return opportunities.filter((opportunity) => {
      if (dismissedIds.includes(opportunity.id)) {
        return false;
      }
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
  }, [dismissedIds, filter, opportunities, search]);

  return (
    <main className="dashboard-page">
      <aside className="student-sidebar">
        <div className="profile-summary">
          <div className="profile-avatar">AH</div>
          <span className="verified-profile">✓</span>
          <h2>Amina Hassan</h2>
          <p>Grade 11 · Dearborn, MI</p>
          <div className="profile-completion">
            <div>
              <span>Profile strength</span>
              <strong>88%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: "88%" }} />
            </div>
          </div>
          <button className="button button-outline full-width" onClick={onProfile}>
            Edit my profile
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">MY FOCUS</span>
          <div className="profile-chips">
            <span>Technology</span>
            <span>Design</span>
            <span>Youth education</span>
          </div>
        </div>
        <div className="sidebar-section">
          <span className="sidebar-label">MY SKILLS</span>
          <ul className="simple-list">
            <li>
              <span>Canva</span>
              <small>Experienced</small>
            </li>
            <li>
              <span>Social media</span>
              <small>Experienced</small>
            </li>
            <li>
              <span>Web design</span>
              <small>Learning</small>
            </li>
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
        <div className="student-welcome">
          <div>
            <span className="kicker">SATURDAY, JULY 25</span>
            <h1>Good morning, Amina.</h1>
            <p>
              We found {opportunities.length} opportunities worth your
              attention.
            </p>
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
              <strong>{opportunities.length}</strong>
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

        <div className="feed-toolbar">
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
            <p>Ranked using your interests, skills, goals, and real availability.</p>
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
  description,
  setDescription,
  extraction,
  onUpdateExtraction,
  completeness,
  needsConfirmation,
  isExtracting,
  extractionError,
  onExtract,
  onPublish,
  published,
}: {
  description: string;
  setDescription: (value: string) => void;
  extraction: Extraction | null;
  onUpdateExtraction: (value: Extraction) => void;
  completeness: number;
  needsConfirmation: ExtractionField[];
  isExtracting: boolean;
  extractionError: string | null;
  onExtract: () => void;
  onPublish: () => void;
  published: boolean;
}) {
  const updateField = (field: keyof Extraction, value: string) => {
    if (!extraction) {
      return;
    }
    onUpdateExtraction({ ...extraction, [field]: value } as Extraction);
  };
  const needsReview = (field: ExtractionField) =>
    needsConfirmation.includes(field);
  const completedFields = extractionFields.length - needsConfirmation.length;

  if (published) {
    return (
      <div className="publish-success">
        <span className="success-mark">✓</span>
        <span className="kicker">READY FOR REVIEW</span>
        <h1>Your opportunity is ready for student matching.</h1>
        <p>
          {extraction?.title || "Your opportunity"} is now visible in
          Amina&apos;s demo dashboard. Contact details remain private until a
          controlled introduction is approved.
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
        <h1>Describe the help you need.</h1>
        <p>
          Paste a rough description. MYIN will organize it into a clear,
          student-friendly opportunity for you to review.
        </p>
      </div>
      <div className="submission-grid">
        <section className="panel submission-source">
          <div className="number-heading">
            <span>1</span>
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
              maxLength={5_000}
              aria-describedby="description-limit"
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
            disabled={!description.trim() || isExtracting}
            data-testid="extract-button"
          >
            <span aria-hidden="true">✦</span>{" "}
            {isExtracting
              ? "Extracting details…"
              : "Extract opportunity details"}
          </button>
          <small className="description-limit" id="description-limit">
            {description.length.toLocaleString()} / 5,000 characters
          </small>
          <small className="demo-disclosure">
            Gemini creates an editable draft; it never publishes automatically.
          </small>
        </section>

        <section
          className={`panel extraction-review ${extraction ? "ready" : ""}`}
          data-testid="extraction-review"
          aria-busy={isExtracting}
          aria-live="polite"
        >
          <div className="number-heading">
            <span>2</span>
            <div>
              <h2>Review what MYIN found</h2>
              <p>You stay in control. Edit anything before submitting.</p>
            </div>
          </div>
          {isExtracting ? (
            <div
              className="waiting-state loading-state"
              data-testid="extracting-state"
            >
              <div className="waiting-graphic" aria-hidden="true">
                <span>✦</span>
                <i />
                <i />
                <i />
              </div>
              <h3>Structuring your opportunity…</h3>
              <p>
                MYIN is identifying the details you provided and leaving
                anything uncertain blank for your review.
              </p>
            </div>
          ) : extractionError ? (
            <div className="extraction-error-state" role="alert">
              <span aria-hidden="true">!</span>
              <h3>We couldn&apos;t extract those details.</h3>
              <p>{extractionError}</p>
              <button
                className="button button-outline compact"
                onClick={onExtract}
                disabled={!description.trim()}
              >
                Try again
              </button>
            </div>
          ) : !extraction ? (
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
              <div
                className={`confidence-banner ${
                  needsConfirmation.length ? "needs-review" : ""
                }`}
              >
                <span>{needsConfirmation.length ? "!" : "✓"}</span>
                <p>
                  <strong>Extraction completeness</strong>
                  <small>
                    {completedFields} fields found ·{" "}
                    {needsConfirmation.length
                      ? `${needsConfirmation.length} ${
                          needsConfirmation.length === 1 ? "field" : "fields"
                        } need confirmation`
                      : "all fields are ready to review"}
                  </small>
                </p>
                <b>{completeness}%</b>
              </div>
              <label
                className={`wide-field ${
                  needsReview("title") ? "attention-field" : ""
                }`}
              >
                Opportunity title
                <input
                  value={extraction.title}
                  onChange={(event) => updateField("title", event.target.value)}
                />
              </label>
              <div className="form-grid">
                <label className={needsReview("type") ? "attention-field" : ""}>
                  Type
                  <select
                    value={extraction.type}
                    onChange={(event) => updateField("type", event.target.value)}
                  >
                    <option value="">Needs confirmation</option>
                    <option>Volunteer</option>
                    <option>Internship</option>
                    <option>Mentorship</option>
                  </select>
                </label>
                <label className={needsReview("date") ? "attention-field" : ""}>
                  Date
                  <input
                    value={extraction.date}
                    onChange={(event) => updateField("date", event.target.value)}
                  />
                </label>
                <label
                  className={
                    needsReview("commitment") ? "attention-field" : ""
                  }
                >
                  Commitment
                  <input
                    value={extraction.commitment}
                    onChange={(event) =>
                      updateField("commitment", event.target.value)
                    }
                  />
                </label>
                <label
                  className={needsReview("format") ? "attention-field" : ""}
                >
                  Format
                  <select
                    value={extraction.format}
                    onChange={(event) => updateField("format", event.target.value)}
                  >
                    <option value="">Needs confirmation</option>
                    <option>In person</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </label>
                <label
                  className={needsReview("ageRange") ? "attention-field" : ""}
                >
                  Age range
                  <input
                    value={extraction.ageRange}
                    onChange={(event) =>
                      updateField("ageRange", event.target.value)
                    }
                  />
                </label>
                <label
                  className={needsReview("location") ? "attention-field" : ""}
                >
                  Location
                  <input
                    value={extraction.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                  />
                </label>
              </div>
              <label
                className={`wide-field ${
                  needsReview("skills") ? "attention-field" : ""
                }`}
              >
                Skills requested
                <input
                  value={extraction.skills}
                  onChange={(event) => updateField("skills", event.target.value)}
                />
              </label>
              <label className="wide-field">
                Student-friendly description
                <textarea
                  value={extraction.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  rows={3}
                />
              </label>
              <label
                className={`wide-field ${
                  needsReview("supervision") ? "attention-field" : ""
                }`}
              >
                Adult supervision
                <input
                  value={extraction.supervision}
                  onChange={(event) =>
                    updateField("supervision", event.target.value)
                  }
                />
                {needsReview("supervision") && (
                  <small>
                    Confirm the supervising adult before publication.
                  </small>
                )}
              </label>
              <label
                className={`wide-field ${
                  needsReview("impact") ? "attention-field" : ""
                }`}
              >
                Community impact
                <input
                  value={extraction.impact}
                  onChange={(event) => updateField("impact", event.target.value)}
                />
              </label>
              <button
                className="button button-dark full-width"
                onClick={onPublish}
                disabled={
                  !extraction.title.trim() ||
                  !extraction.description.trim() ||
                  !extraction.type ||
                  !extraction.supervision.trim()
                }
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
  hasInterest,
  opportunityTitle,
}: {
  shortlisted: number[];
  onShortlist: (id: number) => void;
  hasInterest: boolean;
  opportunityTitle: string | null;
}) {
  return (
    <div className="matches-view">
      <div className="matches-heading">
        <div>
          <span className="kicker">EXPLAINABLE RECOMMENDATIONS</span>
          <h1>
            {hasInterest
              ? "Amina expressed interest in your new opportunity."
              : "12 students match your digital media role."}
          </h1>
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
      {hasInterest && (
        <p className="form-success">
          New interest received for {opportunityTitle}. Amina opted in to this
          privacy-safe view.
        </p>
      )}
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
  publishedOpportunities,
  appliedIds,
}: {
  onPublishOpportunity: (opportunity: Opportunity) => void;
  publishedOpportunities: Opportunity[];
  appliedIds: number[];
}) {
  const [tab, setTab] = useState<OrgTab>("overview");
  const [description, setDescription] = useState(defaultDescription);
  const [extraction, setExtraction] = useState<Extraction | null>(null);
  const [completeness, setCompleteness] = useState(0);
  const [needsConfirmation, setNeedsConfirmation] = useState<ExtractionField[]>(
    [],
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [shortlisted, setShortlisted] = useState<number[]>([]);

  const updateExtraction = (value: Extraction) => {
    const summary = summarizeExtraction(value);
    setExtraction(value);
    setCompleteness(summary.completeness);
    setNeedsConfirmation(summary.needsConfirmation);
  };

  const extract = async () => {
    if (isExtracting || !description.trim()) {
      return;
    }

    setIsExtracting(true);
    setExtractionError(null);
    setExtraction(null);
    setCompleteness(0);
    setNeedsConfirmation([]);

    try {
      const response = await fetch("/api/extract-opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const payload = (await response.json()) as
        | ExtractionResult
        | { error?: { message?: string } };

      if (!response.ok || !("extraction" in payload)) {
        throw new Error(
          "error" in payload && payload.error?.message
            ? payload.error.message
            : "MYIN could not extract this opportunity. Please try again.",
        );
      }

      setExtraction({
        ...payload.extraction,
        description,
        interests: "",
        deadline: "",
      });
      setCompleteness(payload.completeness);
      setNeedsConfirmation(payload.needsConfirmation);
    } catch (error) {
      setExtractionError(
        error instanceof Error
          ? error.message
          : "MYIN could not extract this opportunity. Please try again.",
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const toggleShortlist = (id: number) => {
    setShortlisted((current) =>
      current.includes(id)
        ? current.filter((candidateId) => candidateId !== id)
        : [...current, id],
    );
  };

  const publish = () => {
    if (!extraction) {
      return;
    }

    const skills = extraction.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    const interests = extraction.interests
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);
    const match = calculateMatch(aminaProfile, {
      type: extraction.type,
      skills,
      interests,
      careerGoals: interests,
      availability: extraction.date.toLowerCase().includes("saturday")
        ? ["Saturday"]
        : [],
      ageRange: extraction.ageRange,
      location: extraction.location || "Anywhere",
      format: extraction.format,
    });

    onPublishOpportunity({
      id: Date.now(),
      title: extraction.title,
      organization: "Rahma Community Center",
      organizationMark: "RC",
      type: (
        ["Volunteer", "Internship", "Mentorship"].includes(extraction.type)
          ? extraction.type
          : "Volunteer"
      ) as Opportunity["type"],
      format: extraction.format,
      location: extraction.location || "Location to confirm",
      deadline: extraction.deadline || "Date to confirm",
      commitment: extraction.commitment || "Schedule to confirm",
      description: extraction.description,
      skills,
      matchReasons: match.reasons,
      score: match.score,
      breakdown: match.breakdown,
      accent: "coral",
      new: true,
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
            description={description}
            setDescription={setDescription}
            extraction={extraction}
            onUpdateExtraction={updateExtraction}
            completeness={completeness}
            needsConfirmation={needsConfirmation}
            isExtracting={isExtracting}
            extractionError={extractionError}
            onExtract={extract}
            onPublish={publish}
            published={published}
          />
        )}
        {tab === "matches" && (
          <MatchesView
            shortlisted={shortlisted}
            onShortlist={toggleShortlist}
            hasInterest={publishedOpportunities.some((opportunity) =>
              appliedIds.includes(opportunity.id),
            )}
            opportunityTitle={
              publishedOpportunities.find((opportunity) =>
                appliedIds.includes(opportunity.id),
              )?.title ?? null
            }
          />
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

function ProfileModal({ onClose }: { onClose: () => void }) {
  const [saved, setSaved] = useState(false);

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
        <span className="kicker">STUDENT PROFILE</span>
        <h2 id="profile-modal-title">Help MYIN understand you.</h2>
        <p>These details shape your eligibility checks and recommendation score.</p>
        <div className="profile-form">
          <div className="form-grid">
            <label>
              Grade
              <select defaultValue="Grade 11">
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
                <option>College</option>
              </select>
            </label>
            <label>
              General location
              <input defaultValue="Dearborn, MI" />
            </label>
            <label>
              Preferred format
              <select defaultValue="Local or virtual">
                <option>Local or virtual</option>
                <option>Virtual only</option>
                <option>Local only</option>
              </select>
            </label>
            <label>
              Availability
              <input defaultValue="Saturdays, 10 AM–4 PM" />
            </label>
          </div>
          <label>
            Skills
            <input defaultValue="Canva, social media, basic web design" />
          </label>
          <label>
            Interests and causes
            <input defaultValue="Technology, design, youth education" />
          </label>
          <label>
            Career goal
            <input defaultValue="Explore design and technology for social impact" />
          </label>
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
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);
  const [publishedOpportunities, setPublishedOpportunities] = useState<
    Opportunity[]
  >([]);
  const [resetKey, setResetKey] = useState(0);
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
            publishedOpportunities?: Opportunity[];
          };
          setSavedIds(state.savedIds ?? []);
          setAppliedIds(state.appliedIds ?? []);
          setDismissedIds(state.dismissedIds ?? []);
          setPublishedOpportunities(state.publishedOpportunities ?? []);
        }
      } catch {
        // The demo still works if local storage is unavailable.
      }
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        "myin-demo-state",
        JSON.stringify({
          savedIds,
          appliedIds,
          dismissedIds,
          publishedOpportunities,
        }),
      );
    } catch {
      // The demo still works if local storage is unavailable or full.
    }
  }, [
    appliedIds,
    dismissedIds,
    hydrated,
    publishedOpportunities,
    savedIds,
  ]);

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timeout = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const navigate = (nextView: View) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSave = (id: number) => {
    const isSaved = savedIds.includes(id);
    setSavedIds(
      isSaved ? savedIds.filter((item) => item !== id) : [...savedIds, id],
    );
    setNotice(
      isSaved ? "Removed from saved opportunities." : "Opportunity saved.",
    );
  };

  const apply = (id: number) => {
    if (appliedIds.includes(id)) {
      return;
    }
    setAppliedIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
    setNotice("Interest sent safely. Your contact details are still private.");
  };

  const dismiss = (id: number) => {
    setDismissedIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
    setNotice("Got it. We’ll use that feedback to improve your matches.");
  };

  const resetDemo = () => {
    setSavedIds([]);
    setAppliedIds([]);
    setDismissedIds([]);
    setPublishedOpportunities([]);
    setSelectedOpportunity(null);
    setResetKey((value) => value + 1);
    try {
      window.localStorage.removeItem("myin-demo-state");
    } catch {
      // Local storage is optional.
    }
    setNotice("Demo reset. Seeded opportunities are restored.");
  };

  const allOpportunities = [...publishedOpportunities, ...opportunities];

  return (
    <>
      {view === "home" ? (
        <HomeView onNavigate={navigate} />
      ) : (
        <div className="app-shell">
          <AppHeader view={view} onNavigate={navigate} />
          {view === "student" && (
            <StudentView
              opportunities={allOpportunities}
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
          {view === "organization" && (
            <OrganizationView
              key={resetKey}
              onPublishOpportunity={(opportunity) =>
                setPublishedOpportunities((current) => [
                  opportunity,
                  ...current.filter((item) => item.id !== opportunity.id),
                ])
              }
              publishedOpportunities={publishedOpportunities}
              appliedIds={appliedIds}
            />
          )}
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
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {notice && (
        <div className="toast" role="status">
          <span>✓</span>
          {notice}
        </div>
      )}
      {view !== "home" && (
        <button className="reset-demo" onClick={resetDemo}>
          Reset demo
        </button>
      )}
    </>
  );
}

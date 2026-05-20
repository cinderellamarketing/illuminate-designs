// Single source of truth for footage on the site.
//
// Real session clips will replace these entries. Until then, every slot
// except the two hero videos renders the styled placeholder panel
// (see components/SessionVideo.tsx).
//
// When real footage arrives, edit this file only.

export type MediaClip = {
  id: string;
  // If src is null, SessionVideo renders the styled placeholder.
  src: string | null;
  poster?: string;
  // What viewers should see captioned alongside the clip.
  caption: string;
  // Short helper for the placeholder card.
  context: string;
};

// Neutral royalty-free clip (Mixkit, no attribution required) used only
// for the two hero slots so autoplay and unmute are real and testable.
// Replace with real Illuminate training footage when delivered.
const HERO_PLACEHOLDER =
  "https://assets.mixkit.co/videos/preview/mixkit-business-team-having-a-meeting-in-the-office-5006-large.mp4";

export const media = {
  // Full-bleed hero on /session
  sessionHero: {
    id: "session-hero",
    src: HERO_PLACEHOLDER,
    caption: "Live session, MSP cohort",
    context: "Hero footage placeholder. Swap in real session clip.",
  },
  // Full-screen ambient hero on /room
  roomHero: {
    id: "room-hero",
    src: HERO_PLACEHOLDER,
    caption: "You are in the room",
    context: "Hero footage placeholder. Swap in real session clip.",
  },

  // Horizontal scroll on /session — moments of the method
  approachReel: [
    {
      id: "approach-1",
      src: null,
      caption: "A sales director rebuilds her Monday morning around Copilot.",
      context: "Role-specific session, executive cohort",
    },
    {
      id: "approach-2",
      src: null,
      caption: "Engineers stress-test a prompt pattern they will ship next week.",
      context: "Technical training, scenario-led",
    },
    {
      id: "approach-3",
      src: null,
      caption: "Adoption clinic at the 30-day mark. Habits, not headlines.",
      context: "Follow-up clinic, 30 / 60 / 90",
    },
    {
      id: "approach-4",
      src: null,
      caption: "A field engineer dictates a service report between jobs.",
      context: "Real workflow, real device",
    },
    {
      id: "approach-5",
      src: null,
      caption: "Leadership reviews the adoption numbers, in the room.",
      context: "Measurement session, exec sponsor",
    },
  ] satisfies MediaClip[],

  // Case study scene on /session
  caseStudy: {
    id: "case-study",
    src: null,
    caption: "Head of Revenue Operations, MSP channel partner.",
    context: "Case study interview",
  } satisfies MediaClip,

  // Cinematic scenes used on /room
  roomScenes: {
    problem: {
      id: "scene-problem",
      src: null,
      caption: "Every team has the tools.",
      context: "Scene 2 · The problem the room is solving",
    },
    breakthrough: {
      id: "scene-breakthrough",
      src: null,
      caption: "The moment a workflow tilts.",
      context: "Scene 3 · Breakthrough",
    },
    result: {
      id: "scene-result",
      src: null,
      caption: "Eight weeks later.",
      context: "Scene 4 · Result",
    },
  } satisfies Record<string, MediaClip>,

  // Team portraits — placeholders for now.
  team: [
    {
      id: "portrait-jen",
      src: null,
      caption: "Jen Wilson",
      context: "Portrait placeholder",
    },
    {
      id: "portrait-ed",
      src: null,
      caption: "Ed",
      context: "Portrait placeholder",
    },
    {
      id: "portrait-james",
      src: null,
      caption: "James Wilson",
      context: "Portrait placeholder",
    },
  ] satisfies MediaClip[],
} as const;

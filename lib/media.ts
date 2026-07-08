// Single source of truth for footage on the site.
//
// All clips live in /public. Reassign keys here when new footage
// arrives — every consuming component reads from this file, so swaps
// stay a one-file job.

export type MediaClip = {
  id: string;
  // If src is null, SessionVideo renders the styled placeholder.
  src: string | null;
  poster?: string;
  caption: string;
  context: string;
};

// Real session footage in /public. Keys carry editorial intent.
const videos = {
  // Widest, most ambient room shot — used full-bleed behind the heroes.
  heroWide: {
    src: "/8716579-uhd_3840_2160_25fps.mp4",
    poster: "/poster-heroWide.jpg",
  },
  // Engaged faces / reactions in the room.
  facesClose: {
    src: "/7647627-hd_1920_1080_30fps.mp4",
    poster: "/poster-facesClose.jpg",
  },
  // Someone leading the room, vertical framing.
  presenting: {
    src: "/8344225-uhd_2160_3840_25fps.mp4",
    poster: "/poster-presenting.jpg",
  },
  // Detail / texture clip, vertical.
  detail: {
    src: "/7647616-hd_1080_1920_30fps.mp4",
    poster: "/poster-detail.jpg",
  },
} as const;

export const media = {
  // Full-bleed hero on /session
  sessionHero: {
    id: "session-hero",
    src: videos.heroWide.src,
    poster: videos.heroWide.poster,
    caption: "Live session, MSP cohort",
    context: "Hero footage",
  },
  // Full-screen ambient hero on /room
  roomHero: {
    id: "room-hero",
    src: videos.heroWide.src,
    poster: videos.heroWide.poster,
    caption: "You are in the room",
    context: "Hero footage",
  },

  // Horizontal scroll on /session — moments of the method
  approachReel: [
    {
      id: "approach-1",
      src: videos.facesClose.src,
      poster: videos.facesClose.poster,
      caption: "A sales director rebuilds her Monday morning around Copilot.",
      context: "Role-specific session, executive cohort",
    },
    {
      id: "approach-2",
      src: videos.presenting.src,
      poster: videos.presenting.poster,
      caption: "Engineers stress-test a prompt pattern they will ship next week.",
      context: "Technical training, scenario-led",
    },
    {
      id: "approach-3",
      src: videos.detail.src,
      poster: videos.detail.poster,
      caption: "Adoption clinic at the 30-day mark. Habits, not headlines.",
      context: "Follow-up clinic, 30 / 60 / 90",
    },
    {
      id: "approach-4",
      src: videos.facesClose.src,
      poster: videos.facesClose.poster,
      caption: "A field engineer dictates a service report between jobs.",
      context: "Real workflow, real device",
    },
    {
      id: "approach-5",
      src: videos.presenting.src,
      poster: videos.presenting.poster,
      caption: "Leadership reviews the adoption numbers, in the room.",
      context: "Measurement session, exec sponsor",
    },
  ] satisfies MediaClip[],

  // Case study scene on /session — portrait framing.
  // Uses the vertical "presenting" clip so the frame fills cleanly.
  caseStudy: {
    id: "case-study",
    src: videos.presenting.src,
    poster: videos.presenting.poster,
    caption: "Head of Revenue Operations, MSP channel partner.",
    context: "Case study interview",
  } satisfies MediaClip,

  // Cinematic scenes used on /room
  roomScenes: {
    room: {
      id: "scene-room",
      src: videos.heroWide.src,
      poster: videos.heroWide.poster,
      caption: "Wide of the room",
      context: "Scene 1 · Establishing shot",
    },
    problem: {
      id: "scene-problem",
      src: videos.presenting.src,
      poster: videos.presenting.poster,
      caption: "Every team has the tools.",
      context: "Scene 2 · The problem the room is solving",
    },
    breakthrough: {
      id: "scene-breakthrough",
      src: videos.facesClose.src,
      poster: videos.facesClose.poster,
      caption: "The moment a workflow tilts.",
      context: "Scene 3 · Breakthrough",
    },
    result: {
      id: "scene-result",
      src: videos.detail.src,
      poster: videos.detail.poster,
      caption: "Eight weeks later.",
      context: "Scene 4 · Result",
    },
  } satisfies Record<string, MediaClip>,

  // Team portraits — photos to follow, not video.
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
      caption: "Edd",
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

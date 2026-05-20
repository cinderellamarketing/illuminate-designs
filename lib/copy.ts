// Realistic placeholder copy. British English. No em dashes.
// Names and contact details are real. Companies and quotes are kept
// generic so nothing is invented about specific clients.

export const company = {
  name: "Illuminate Learning",
  location: "Pembrokeshire",
  email: "hello@illuminate-learning.co.uk",
} as const;

export const headlineNumber = {
  value: "82%",
  label: "Copilot adoption",
  industry: "Industry norm sits closer to 30%.",
} as const;

// One inline credibility line, no logo wall.
export const credibilityLine =
  "Built by the team that trained the first wave of UK Microsoft Copilot partners.";

export const problemStatement = {
  big: "Every team has the tools.",
  contrast: "Far fewer have the skills.",
  body: "Most Copilot rollouts stall at the licence count. The software is installed, the dashboard says ninety per cent activated, and three months later nothing has changed about how the work gets done.",
} as const;

// Captions for the horizontal scroll of session moments on /session.
export const approachMoments = [
  {
    eyebrow: "Role-specific",
    body: "A finance director and a field engineer do not need the same Copilot session. We build the curriculum around the actual job.",
  },
  {
    eyebrow: "Measured",
    body: "Baseline before, measure after. Adoption, time saved, deal velocity, ticket throughput. The numbers belong to your leadership team.",
  },
  {
    eyebrow: "It sticks",
    body: "Clinics and office hours at 30, 60 and 90 days. Habit beats inspiration. Most providers leave the building too early.",
  },
] as const;

export const caseStudy = {
  number: "82%",
  blurb: "Copilot adoption in eight weeks. The industry average sits around 30%.",
  quote:
    "They did not deliver a training course. They rebuilt how our sales floor starts the morning. The Copilot numbers are the easy part, the cultural change is what stuck.",
  attribution: "Head of Revenue Operations, MSP channel partner",
} as const;

export const team = [
  {
    name: "Jen Wilson",
    role: "Founder",
    bio: "Ex-Microsoft. A decade inside the partner programme before starting Illuminate. Leads strategy and the senior cohort sessions.",
    personality: "Will ask the question your leadership team has been ducking.",
  },
  {
    name: "Ed",
    role: "Partner, adoption lead",
    bio: "Runs the adoption programmes end to end. Specialises in the slow, unglamorous work of making new habits hold.",
    personality: "Believes habit beats inspiration. Has the data to prove it.",
  },
  {
    name: "James Wilson",
    role: "Technical training",
    bio: "Designs and delivers the technical curriculum. Prompt design, governance and the engineering detail that decides whether a pilot ships.",
    personality: "Reads release notes for fun. Saves you from doing the same.",
  },
] as const;

// Scenes for the cinematic /room route.
export const roomScenes = [
  {
    key: "room",
    eyebrow: "Scene 01 · The room",
    title: "Twenty-two people. One Tuesday morning.",
    body: "A live training session in progress. Engineers and sales leads, all in the same room, all using the same tools differently.",
  },
  {
    key: "problem",
    eyebrow: "Scene 02 · The problem the room is solving",
    title: "Every team has the tools. Far fewer have the skills.",
    body: "Licences are easy. Behaviour is hard. The point of a session is to change a Monday morning, not to issue a certificate.",
  },
  {
    key: "breakthrough",
    eyebrow: "Scene 03 · The breakthrough",
    title: "A workflow tilts.",
    body: "Someone rebuilds the rhythm of their morning around Copilot in real time. The room sees it. From there, the cohort moves quickly.",
  },
  {
    key: "result",
    eyebrow: "Scene 04 · The result",
    title: "Eight weeks later.",
    body: "Eighty-two per cent active adoption across the cohort. Industry norm sits closer to thirty.",
  },
  {
    key: "invitation",
    eyebrow: "Scene 05 · The invitation",
    title: "Come and sit in.",
    body: "We run cohorts continuously. The next one has space.",
  },
] as const;

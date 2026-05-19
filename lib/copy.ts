export const clients = [
  "Microsoft",
  "Giacom",
  "TD Synnex",
  "BCN",
  "Dr Martens",
  "ATech",
  "SEC Newgate",
];

export const pillars = [
  {
    number: "01",
    title: "Sales enablement",
    body: "Equip account managers and BDRs to use Copilot in the rhythm of a real sales day. From prospect research to follow-ups, we rebuild the workflow rather than bolt the tool onto it.",
  },
  {
    number: "02",
    title: "Technical training",
    body: "Deep, scenario-led sessions for engineers and service teams. We cover prompt design, governance, integration patterns and the unglamorous detail that decides whether a pilot ships.",
  },
  {
    number: "03",
    title: "AI adoption",
    body: "Programmes that change how a business operates, not what it has installed. Executive alignment, change management, and a measurement plan that gives leaders a real answer at quarter-end.",
  },
] as const;

export const approachPoints = [
  {
    number: "01",
    title: "Role-specific",
    body: "A finance director and a field engineer do not need the same Copilot training. We build the curriculum around the job, the tooling and the day-to-day decisions.",
  },
  {
    number: "02",
    title: "Measured",
    body: "Baseline before, measure after. Adoption, time saved, deal velocity, ticket throughput. The numbers belong to your leadership team, not us.",
  },
  {
    number: "03",
    title: "Sticks",
    body: "We follow up at 30, 60 and 90 days with clinics, office hours and refreshers. Habit beats inspiration. Most providers leave the building too early.",
  },
] as const;

export const team = [
  {
    name: "Jen Wilson",
    role: "Founder",
    bio: "Ex-Microsoft. Spent a decade inside the partner programme before starting Illuminate. Leads strategy and the senior cohort sessions.",
  },
  {
    name: "Ed",
    role: "Partner · Adoption lead",
    bio: "Runs the adoption programmes end to end. Specialises in the slow, unglamorous work of making new habits hold.",
  },
  {
    name: "James Wilson",
    role: "Technical training",
    bio: "Designs and delivers the technical curriculum. Prompt design, governance and the engineering detail that decides whether a pilot ships.",
  },
  {
    name: "TBC",
    role: "Joining soon",
    bio: "A senior facilitator role currently in conversation. Sales enablement and front-line manager coaching across the MSP channel.",
  },
] as const;

export const contact = {
  email: "hello@illuminate-learning.co.uk",
  location: "Pembrokeshire",
  companyNote: "Company no. TBC",
} as const;

export const stat = {
  hero: "47%",
  heroLabel: "of paid Copilot licences go unused after 90 days",
  source: "Internal benchmark, 14 mid-market deployments, 2024 to 2025.",
};

export const caseStudy = {
  number: 82,
  suffix: "%",
  label: "Copilot adoption in 8 weeks",
  quote:
    "Illuminate did not deliver a training course. They rebuilt how our sales floor starts the morning. The Copilot numbers are the easy part, the cultural change is what stuck.",
  attribution: "Head of Revenue Operations, MSP channel partner",
};

// Canonical site copy, lifted from Illuminate_website_copy.docx.
// British English. No em dashes. No paraphrasing. Square-bracket
// placeholders are preserved verbatim and rendered as-is.

export const company = {
  name: "Illuminate Learning",
  location: "Pembrokeshire",
  email: "hello@illuminate-learning.co.uk",
} as const;

// Used by the hero count-up and the various pull-out numbers.
export const headlineNumber = {
  value: "82%",
  label: "Copilot adoption",
  industry: "Industry average sits closer to 30%.",
} as const;

// Tooltip on the 82% number, per the playful microcopy block.
export const statTooltip =
  "Eight weeks. Most rollouts never get past 30%.";

// Shared navigation (per the docx Global section).
export const nav = {
  links: [
    { label: "Home", href: "/" },
    { label: "What we do", href: "/what-we-do" },
    { label: "For MSPs", href: "/for-msps" },
    { label: "Proof", href: "/proof" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ],
  primaryCta: { label: "Book a session", href: "/contact" },
} as const;

export const footer = {
  brand: company.name,
  tagline: "We turn Microsoft licences into skills people actually use.",
  columns: [
    { label: "What we do", href: "/what-we-do" },
    { label: "For MSPs", href: "/for-msps" },
    { label: "Proof", href: "/proof" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ],
  signoff: "Made in Pembrokeshire, delivered across the UK.",
  smallPrint: "Yes, the bulb in the corner does something.",
} as const;

// Playful microcopy block (the bits we want surfaced in UI chrome).
export const microcopy = {
  statTooltip,
  lightsHintHover: "Go on, flick it.",
  lightsHintKeyboard: "Press L for the lights.",
  notFound: "The lights are off. Flip the switch, or head back home.",
  loading: "Switching the lights on.",
  reelCaptionExample: "Finance team, week one. Nobody fell asleep.",
  contactPlaceholder:
    "No pitch, just tell us what your team is stuck on.",
} as const;

export const consoleGreeting =
  "Poking about in here? Good instinct. The bulb in the corner is clickable, and L turns the lights off. We like people who look under the bonnet. If that's you, and you train Microsoft tools for a living, we should probably talk. There's a contact page for that.";

/* ---------------- Homepage A: /session ---------------- */

export const sessionMeta = {
  title: "Copilot training for MSPs and their clients | Illuminate Learning",
  description:
    "We get Microsoft Copilot from a licence to real daily use, 82% adoption in eight weeks against an industry average of 30%. Practical training for MSPs and the teams they support.",
} as const;

export const sessionHero = {
  eyebrow: "Microsoft Copilot training",
  headline: "Every team has the tools. Far fewer have the skills.",
  sub: "Copilot is sitting in your clients' Microsoft 365 right now, mostly unused. We turn it into something people reach for every day.",
  statValue: "82%",
  statCaption:
    "adoption in eight weeks, against an industry average of 30%.",
  primaryCta: { label: "Book a session", href: "/contact" },
  secondaryCta: { label: "See a sample session", href: "/proof" },
} as const;

export const sessionGap = {
  heading: "A licence is not a skill.",
  body: "Most rollouts stop at the switch being flicked. The software is on, the welcome email is sent, and then nothing changes. People carry on exactly as before, because nobody showed them how Copilot fits the job they actually do. The cost is real and recurring. The value only shows up when habits change.",
} as const;

export const sessionWhatWeDo = {
  heading: "We train the role, not the feature list.",
  body: "A sales director, a service desk engineer and a finance manager do not have the same day, so they do not get the same session. We start from the work people already have in front of them and show where Copilot saves them real time. Small groups, real tasks, and follow-up so it sticks.",
  cards: [
    {
      title: "Sales enablement.",
      body: "Confident teams who can talk about Copilot and use it to sell.",
    },
    {
      title: "Technical training.",
      body: "The hands-on skills your engineers need, security included.",
    },
    {
      title: "AI adoption.",
      body: "End users who actually change how they work.",
    },
  ],
  link: { label: "What we do", href: "/what-we-do" },
} as const;

export const sessionQuickWin = {
  heading: "They are already paying for the safe option.",
  body: "There are two Copilots. The paid one lives inside Word, Excel and Teams and reads company data. But Copilot Basic, a secure AI chat under Microsoft's enterprise data protection, comes included with Business Premium and most Microsoft 365 plans at no extra cost. Their people are pasting work into free consumer chatbots because nobody told them there was a safe option already in the licence. That is the easiest place to start.",
} as const;

export const sessionForMsps = {
  heading: "You do not have to become the trainer.",
  body: "You cannot be an expert in everything Microsoft ships, and you do not need to be. Stay the trusted advisor, bring us in for the delivery, and keep the client relationship and the credit. Clients who get proper adoption are far slower to switch provider, which makes this one of the stickiest things you can offer.",
  cta: { label: "Partner with us", href: "/for-msps" },
} as const;

export const sessionProof = {
  heading: "The difference is the delivery.",
  body: "The thing clients ask to see before they commit is what the training is actually like. So that is the thing we make easy to see.",
  pullFigure: "82% adoption in eight weeks.",
  testimonialPlaceholder: "[Testimonial slot, with permission]",
  cta: { label: "See a sample session", href: "/proof" },
} as const;

export const sessionClose = {
  heading: "Let's turn those licences into something useful.",
  body: "Tell us what your team, or your clients' teams, are stuck on. No pitch.",
  primaryCta: { label: "Book a session", href: "/contact" },
} as const;

/* ---------------- Homepage B: /room ---------------- */

export const roomMeta = {
  title: "Step into the room | Illuminate Learning",
  description:
    "What Copilot training actually looks like when it works. Illuminate Learning gets teams to 82% adoption in eight weeks.",
} as const;

// Seven cinematic scenes, copy lifted from the docx.
export const roomScenes = [
  {
    key: "01",
    eyebrow: "Scene 01",
    line: "Most Copilot rollouts happen in the dark.",
    sub: "Everyone has access. Nobody is using it.",
  },
  {
    key: "02",
    eyebrow: "Scene 02",
    line: "Every team has the tools.",
    line2: "Far fewer have the skills.",
  },
  {
    key: "03",
    eyebrow: "Scene 03",
    line: "This is what it looks like when the lights come on.",
    sub: "Real sessions. Real teams. The moment it clicks.",
  },
  {
    key: "04",
    eyebrow: "Scene 04",
    line: "We train the role, not the feature list.",
    sub: "Small groups. Real work. Follow-up so it sticks.",
  },
  {
    key: "05",
    eyebrow: "Scene 05",
    line: "82% adoption in eight weeks.",
    sub: "The industry average is about 30%.",
  },
  {
    key: "06",
    eyebrow: "Scene 06",
    line: "MSPs, you do not have to become the trainer.",
    sub: "Stay the trusted advisor. Bring us in for the delivery.",
  },
  {
    key: "07",
    eyebrow: "Scene 07",
    line: "Ready to switch the lights on?",
    primaryCta: { label: "Book a session", href: "/contact" },
    secondaryCta: { label: "See a sample session", href: "/proof" },
  },
] as const;

/* ---------------- Inner pages ---------------- */

export const whatWeDoMeta = {
  title: "What we do | Copilot and AI training | Illuminate Learning",
  description:
    "Practical Microsoft Copilot and AI training for MSPs and the teams they support. Sales enablement, technical training and end-user adoption.",
} as const;

export const whatWeDo = {
  headline: "Training people want to be in.",
  body: "We do one thing well. We get teams from owning Microsoft Copilot to using it every day. The content matters, but the delivery is what makes it land. No death by PowerPoint, no features dumped on a quiet room. Sessions built around the work people already do, run in small groups, with follow-up so the new habits hold.",
  services: [
    {
      key: "sales-enablement",
      eyebrow: "Service 01",
      title: "Sales enablement",
      headline: "Sell Copilot like you use it.",
      body: "It is hard to sell something convincingly when your own team has barely touched it. We get your sales and account people genuinely fluent, so they can talk about Copilot with confidence, answer the awkward client questions, and use it to do their own jobs faster. Customer zero, done properly.",
      cta: { label: "Book a session", href: "/contact" },
    },
    {
      key: "technical-training",
      eyebrow: "Service 02",
      title: "Technical training",
      headline: "The hands-on skills, security included.",
      body: "Your engineers need more than a demo. We cover the practical setup and day-to-day use, and we fold in the security and data side, because the first question a sensible client asks about AI is where their data goes. Pitched at technical teams, without talking down to them.",
      cta: { label: "Book a session", href: "/contact" },
    },
    {
      key: "ai-adoption",
      eyebrow: "Service 03",
      title: "AI adoption",
      headline: "Where licences become habits.",
      body: "This is the end-user work, and it is where adoption is won or lost. We start from real tasks, Monday-morning jobs people already have, and show where Copilot takes ten minutes off them. We measure usage at two weeks, four weeks and three months, because that is where you see what actually stuck.",
      cta: { label: "Book a session", href: "/contact" },
    },
  ],
} as const;

export const forMspsMeta = {
  title: "For MSPs | Partner with Illuminate Learning",
  description:
    "Offer proper Copilot training to your clients without becoming a training company. Referral, white-label and collaborative partnerships for UK MSPs.",
} as const;

export const forMsps = {
  headline: "Partner with us, don't become us.",
  body: "Clients now expect their MSP to have a view on Copilot, roll it out, train their people and show value, all on top of keeping everything else running. Becoming a genuine training specialist takes months you do not have. The smarter move is to stay the trusted advisor and bring in a specialist for the delivery.",
  modelsIntro: "Three ways to work together:",
  models: [
    {
      key: "referral",
      title: "Referral.",
      body: "Pass the training across and earn on it. We deliver, you keep the relationship.",
    },
    {
      key: "white-label",
      title: "White-label.",
      body: "We deliver under your brand. The client sees you as the expert.",
    },
    {
      key: "collaborative",
      title: "Collaborative.",
      body: "You handle the technical setup, we run the training alongside you.",
    },
  ],
  whyHeading: "Why it pays",
  whyBody:
    "There is direct margin on the training and the setup around it. There is stickiness, because a client who gets real adoption credits you with the outcome and is far slower to move. And depending on your Microsoft programme status, or any co-op or MDF funds you have to spend, some of the cost can often be funded, so it is worth checking what you qualify for.",
  cta: { label: "Partner with us", href: "/contact" },
} as const;

export const proofMeta = {
  title: "Proof | Results and what good looks like | Illuminate Learning",
  description:
    "82% Copilot adoption in eight weeks. See what Illuminate Learning's training delivers and what a session actually looks like.",
} as const;

export const proof = {
  headline: "The proof is in the room.",
  body: "Two things decide whether anyone buys training. The results, and what the training is actually like to be in. So here are both.",
  pullFigure: "82% adoption in eight weeks, against an industry average around 30%.",
  sampleHeading: "Sample block",
  sampleBody:
    "The single most requested thing before anyone commits is a sample of the session.",
  samplePlaceholder: "[Embed sample training clip once produced.]",
  caseStudyPlaceholder:
    "[Case study slots, with permission: client, challenge, result.]",
  testimonialPlaceholder: "[Testimonial slots, with permission.]",
  cta: { label: "See a sample session", href: "/proof" },
  primaryCta: { label: "Book a session", href: "/contact" },
} as const;

export const aboutMeta = {
  title: "About | Illuminate Learning",
  description:
    "Founded by [Jen Wilson], ex-Microsoft, Illuminate Learning makes Microsoft Copilot training that people actually want to be in.",
} as const;

export const about = {
  headline: "We are the bit between the licence and the light bulb going on.",
  body: "Illuminate Learning was founded by [Jen Wilson], who spent [years] inside Microsoft before deciding that the gap worth fixing was not the technology, it was whether anyone used it. We know the channel, we know the pressure MSPs are under, and we know that the difference between training that lands and training that washes over a room is almost always the delivery.",
  personality:
    "We work with big companies, but we are not a stiff one. We are a bit nerdy, we like the people we work with, and we think training should be the opposite of dull.",
  teamIntro: "Team",
  teamNote: "[Confirm bios and titles.]",
  team: [
    {
      name: "[Jen Wilson]",
      role: "Founder",
    },
    {
      name: "[Ed]",
      role: "Adoption and the in-the-room work.",
    },
    {
      name: "[James]",
      role: "Technical and security training.",
    },
  ],
  cta: { label: "Talk to us", href: "/contact" },
} as const;

export const insightsMeta = {
  title: "Insights | Copilot adoption for MSPs | Illuminate Learning",
  description:
    "Practical thinking on Microsoft Copilot adoption, training and the MSP opportunity. Articles and resources from Illuminate Learning.",
} as const;

export const insights = {
  headline:
    "Things worth knowing about Copilot, adoption and the channel.",
  body: "Plain, useful writing on getting Copilot from a licence to real use, the MSP opportunity, and the bits Microsoft does not spell out. No fluff.",
  sections: [
    {
      key: "articles",
      title: "Articles",
      body: "[Article slots to follow.]",
    },
    {
      key: "resources",
      title: "Resources",
      body: '[Resources, including the "5 ways to use Copilot" guide.]',
    },
  ],
  cta: { label: "Read the article", href: "/insights" },
} as const;

export const contactMeta = {
  title: "Contact | Illuminate Learning",
  description:
    "Book a session, see a sample, or talk about a partnership. Practical Copilot training for MSPs and their clients.",
} as const;

export const contact = {
  headline: "Tell us what your team is stuck on.",
  body: "No pitch. Tell us where Copilot is not landing, for your team or your clients', and we will tell you honestly whether we can help.",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Work email", type: "email", required: true },
    { name: "company", label: "Company", type: "text", required: false },
    {
      name: "stuck",
      label: "What you are stuck on",
      type: "textarea",
      required: true,
      placeholder: microcopy.contactPlaceholder,
    },
  ],
  bookingLine: "Or: Book a session directly [booking link]",
  primaryCta: { label: "Book a session", href: "/contact" },
} as const;

/* ---------------- Backwards-compatible exports ---------------- */
// Older components still reference these; keep their shape stable.

export const problemStatement = {
  big: "Every team has the tools.",
  contrast: "Far fewer have the skills.",
  body: sessionGap.body,
} as const;

export const credibilityLine =
  "Built by the team that trained the first wave of UK Microsoft Copilot partners.";

export const caseStudy = {
  number: headlineNumber.value,
  blurb:
    "Copilot adoption in eight weeks. The industry average sits around 30%.",
  quote: "[Testimonial slot, with permission.]",
  attribution: "[Attribution to follow]",
} as const;

export const approachMoments = [
  {
    eyebrow: "Role-specific",
    body: "A finance director and a field engineer do not need the same Copilot session. We build the session around the actual job.",
  },
  {
    eyebrow: "Real work",
    body: "We start from Monday-morning tasks people already have, and show where Copilot takes ten minutes off them.",
  },
  {
    eyebrow: "Follow-up",
    body: "Measured at two weeks, four weeks and three months, because that is where you see what stuck.",
  },
] as const;

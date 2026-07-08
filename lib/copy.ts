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
    { label: "For the channel", href: "/channel" },
    { label: "Proof", href: "/proof" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ],
  primaryCta: { label: "Book a session", href: "/contact" },
} as const;

export const footer = {
  brand: company.name,
  tagline: "We turn Microsoft licences into skills people use.",
  columns: [
    { label: "What we do", href: "/what-we-do" },
    { label: "For MSPs", href: "/for-msps" },
    { label: "For the channel", href: "/channel" },
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
  lightsHintKeyboard: "Press L for the lights.",
} as const;

/* ---------------- Homepage A: /session ---------------- */

export const sessionMeta = {
  title: "Copilot training for MSPs and their clients | Illuminate Learning",
  description:
    "We get Microsoft Copilot from a licence to real daily use, 82% adoption in eight weeks against an industry average of 30%. Practical training for MSPs and the teams they support.",
} as const;

export const sessionHero = {
  eyebrow: "Microsoft Copilot training",
  // Rendered as a two-part heading: lead in plain text, accent in the
  // orange span. Joined they read "Every team has the tools. Far fewer
  // have the skills."
  headline: {
    lead: "Every team has the tools.",
    accent: "Far fewer have the skills.",
  },
  sub: "Copilot is sitting in your clients' Microsoft 365 right now, mostly unused. We turn it into something people reach for every day.",
  statCaption:
    "adoption in eight weeks, against an industry average of 30%.",
  primaryCta: { label: "Book a session", href: "/contact" },
  secondaryCta: { label: "See a sample session", href: "/room" },
} as const;

export const sessionGap = {
  // lead + accent render as one heading, the accent under the hl-underline
  // span: "A licence is not a skill."
  heading: { lead: "A licence is", accent: "not a skill." },
  // The gap section runs sparse, so it carries one strong line and this
  // single quiet line, nothing more.
  pull: "The value only shows up when habits change.",
} as const;

export const sessionWhatWeDo = {
  heading: "We build each session around the role.",
  body: "A sales director, a service desk engineer and a finance manager do not have the same day, so they do not get the same session. We start from the work people already have in front of them and show where Copilot saves them real time. Small groups, real tasks, and follow-up so it sticks.",
  // Each lane is built around a role named verbatim in the body above, so
  // the section can read as role panels rather than three identical cards.
  cards: [
    {
      role: "Sales director",
      title: "Sales enablement.",
      body: "Confident teams who can talk about Copilot and use it to sell.",
    },
    {
      role: "Service desk engineer",
      title: "Technical training.",
      body: "The hands-on skills your engineers need, security included.",
    },
    {
      role: "Finance manager",
      title: "AI adoption.",
      body: "End users who change how they work.",
    },
  ],
  link: { label: "What we do", href: "/what-we-do" },
} as const;

export const sessionQuickWin = {
  heading: "They are already paying for the safe option.",
  // The section renders as an actual two-side comparison. Copilot Basic is
  // the included tier; Copilot Premium is the paid licence. Keep that
  // distinction exact.
  intro: "There are two Copilots.",
  compare: {
    premium: {
      name: "Copilot Premium",
      tag: "The paid licence.",
      body: "Lives inside Word, Excel and Teams and reads company data.",
    },
    basic: {
      name: "Copilot Basic",
      tag: "Included, at no extra cost.",
      body: "A secure AI chat under Microsoft's enterprise data protection, included with Business Premium and most Microsoft 365 plans.",
      flag: "Start here",
    },
  },
  kicker:
    "Their people are pasting work into free consumer chatbots because nobody told them there was a safe option already in the licence. That is the easiest place to start.",
} as const;

export const sessionForMsps = {
  heading: "You do not have to become the trainer.",
  body: "You cannot be an expert in everything Microsoft ships, and you do not need to be. Stay the trusted advisor, bring us in for the delivery, and keep the client relationship and the credit. Clients who get proper adoption are far slower to switch provider, which makes this one of the stickiest things you can offer.",
  cta: { label: "Partner with us", href: "/for-msps" },
} as const;

export const sessionProof = {
  heading: "The difference is the delivery.",
  // The adoption figure renders once, as the gauge on the /session hero.
  // Here the proof section stays visual-led, footage carrying it, so this
  // line speaks to the delivery rather than repeating the number.
  figureLine: "Get the delivery right and the adoption follows.",
  testimonialPlaceholder: "[Testimonial slot, with permission]",
  cta: { label: "See a sample session", href: "/room" },
} as const;

export const sessionClose = {
  heading: "Let's turn those licences into something useful.",
  body: "Tell us what your team, or your clients' teams, are stuck on.",
  primaryCta: { label: "Book a session", href: "/contact" },
} as const;

/* ---------------- Homepage B: /room ---------------- */

export const roomMeta = {
  title: "Step into the room | Illuminate Learning",
  description:
    "What Copilot training looks like when it works. Illuminate Learning gets teams to 82% adoption in eight weeks.",
} as const;

// The /room sample session is authored as ten beats. Its copy — every
// caption, note and CTA — lives with the footage manifest in
// app/room/scenes.ts, so the beats and their words stay in one place. The
// proof beats hold labelled placeholders until real quotes are cleared;
// nothing is invented.

/* ---------------- Inner pages ---------------- */

export const whatWeDoMeta = {
  title: "What we do | Copilot and AI training | Illuminate Learning",
  description:
    "Practical Microsoft Copilot and AI training for MSPs and the teams they support. Sales enablement, technical training and end-user adoption.",
} as const;

export const whatWeDo = {
  // lead + accent render as the two-part hero heading: "Training people
  // want to be in."
  headline: { lead: "Training people", accent: "want to be in." },
  body: "We do one thing well. We get teams from owning Microsoft Copilot to using it every day. The content matters, but the delivery is what makes it land. We keep the room awake, a long way from a slide deck droned at people who have stopped listening. Sessions built around the work people already do, run in small groups, with follow-up so the new habits hold.",
  services: [
    {
      key: "sales-enablement",
      title: "Sales enablement",
      headline: "Sell Copilot like you use it.",
      body: "It is hard to sell something convincingly when your own team has barely touched it. We get your sales and account people fluent, so they can talk about Copilot with confidence, answer the awkward client questions, and use it to do their own jobs faster. Customer zero, done properly.",
      cta: { label: "Book a session", href: "/contact" },
    },
    {
      key: "technical-training",
      title: "Technical training",
      headline: "The hands-on skills, security included.",
      body: "Your engineers need more than a demo. We cover the practical setup and day-to-day use, and we fold in the security and data side, because the first question a sensible client asks about AI is where their data goes. Pitched at technical teams, without talking down to them.",
      cta: { label: "Book a session", href: "/contact" },
    },
    {
      key: "ai-adoption",
      title: "AI adoption",
      headline: "Where licences become habits.",
      body: "This is the end-user work, and it is where adoption is won or lost. We start from real tasks, Monday-morning jobs people already have, and show where Copilot takes ten minutes off them. We measure usage at two weeks, four weeks and three months, because that is where you see what stuck.",
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
  // lead + accent render as the two-part hero heading: "Partner with us,
  // don't become us."
  headline: { lead: "Partner with us,", accent: "don't become us." },
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
  whyBody:
    "There is direct margin on the training and the setup around it. There is stickiness, because a client who gets real adoption credits you with the outcome and is far slower to move. And depending on your Microsoft programme status, or any co-op or MDF funds you have to spend, some of the cost can often be funded, so it is worth checking what you qualify for.",
  cta: { label: "Partner with us", href: "/contact" },
} as const;

/* ---------------- For the channel (Edd's page) ---------------- */
// Audience: Microsoft distributors and resellers, the layer above MSPs
// (the TD SYNNEX kind of relationship). They sell Copilot and the wider
// Microsoft stack to MSPs and end customers. This is not generic sales
// training and is deliberately distinct from /for-msps: /for-msps speaks
// to MSPs directly, /channel speaks to the distributors and resellers who
// enable them. Copy is plain British English, no em dashes, sentence case.

export const channelMeta = {
  title:
    "For the channel | Copilot enablement for Microsoft distributors and resellers",
  description:
    "Sales and technical enablement for Microsoft distributors and resellers. We get partner sales teams fluent in Microsoft 365 Copilot, so they can position it, handle objections and build pipeline.",
} as const;

export const channel = {
  hero: {
    eyebrow: "for the channel",
    headlineLead: "Your partners are selling Copilot",
    headlineAccent: "faster than their teams can learn it.",
    body: "You move Microsoft licences at volume, and Copilot is the line everyone wants to grow. The pressure lands on your partners' sales teams, who are expected to pitch Microsoft 365 Copilot, answer the security and licensing questions and tie it to a business case, often before they have used it much themselves. That distance between the target and the fluency is where deals stall. Edd's enablement is built to close it.",
  },

  // Four distinct strands of what Edd's enablement does for a partner.
  enablement: {
    heading: "What the enablement does for a partner.",
    lead: "Edd works alongside your partners' sales and technical teams, the people who take Copilot to MSPs and end customers. Four strands, shaped to how each partner already goes to market.",
    strands: [
      {
        key: "sales-enablement",
        title: "Sales enablement",
        body: "We get partner sales and account teams fluent in Microsoft 365 Copilot. They learn it by using it on their own accounts, which is what makes them credible when they get in front of a customer.",
      },
      {
        key: "positioning",
        title: "Positioning and objection handling",
        body: "The questions that stall a Copilot deal are consistent: licensing, data security, and whether it earns its cost. We give teams clear answers and a way to frame Copilot around the customer's business outcomes, so a hesitant call keeps moving.",
      },
      {
        key: "technical",
        title: "Technical enablement and certifications",
        body: "For the teams who need depth, we cover the technical side of Copilot and the wider Microsoft stack, including the setup and data questions customers raise first. Where it helps a partner, we line the enablement up with the relevant Microsoft certifications and role-based credentials.",
      },
      {
        key: "webinars",
        title: "End-customer webinars that build pipeline",
        body: "We run Copilot webinars for your partners' end customers, under the partner's name or alongside their team. Each one gives the sales team warm conversations to follow up, so the enablement turns into pipeline they can work.",
      },
    ],
    // Kept strictly conditional: only for partners in the right Microsoft
    // programme or with existing co-op / MDF funds. Never universal.
    funding:
      "Where a partner is in the right Microsoft programme, or has co-op or MDF funds to spend, some of this can often be funded. Worth checking what they qualify for.",
  },

  // Credibility, stated as fact and not embellished.
  credibility: {
    facts: [
      { label: "Microsoft Learning", fact: "Official Microsoft Learning partner." },
      { label: "The team", fact: "Built by an ex-Microsoft team." },
      { label: "Coverage", fact: "Copilot and the wider Microsoft stack." },
    ],
  },

  video: {
    heading: "Meet Edd.",
    body: "Edd leads channel and sales enablement at Illuminate Learning. He works with distributors and their partners on positioning, objection handling and technical depth. Clips to follow once filmed.",
  },

  // TD SYNNEX partnership and the Sabs endorsement. Held as labelled
  // placeholders until Jen and TD SYNNEX have cleared the wording. Nothing
  // here is invented.
  proof: {
    heading: "The TD SYNNEX partnership.",
    body: "This is where the partnership and Sabs's endorsement will sit. We are holding the space until Jen and TD SYNNEX have signed off the wording, so nothing here is invented.",
    endorsementPlaceholder:
      "[Endorsement from Sabs, TD SYNNEX. Added once cleared to share.]",
    partnershipPlaceholder: "[TD SYNNEX partnership detail, pending sign-off.]",
  },

  close: {
    headlineLead: "Let's talk about enabling",
    headlineAccent: "your channel.",
    body: "Tell us how your partners are selling Copilot today, and where their teams get stuck. We will show you what the enablement would add.",
    cta: { label: "Talk about channel enablement", href: "/contact" },
  },
} as const;

export const proofMeta = {
  title: "Proof | Results and what good looks like | Illuminate Learning",
  description:
    "82% Copilot adoption in eight weeks. See what Illuminate Learning's training delivers and what a session looks like.",
} as const;

export const proof = {
  // lead + accent render as the two-part hero heading: "The proof is in
  // the room."
  headline: { lead: "The proof is", accent: "in the room." },
  body: "Two things decide whether anyone buys training: the results, and what the training is like to be in.",
  pullFigure: "Adoption that holds, measured in the weeks after we leave the room.",
  sampleBody:
    "The single most requested thing before anyone commits is a sample of the session.",
  caseStudyPlaceholder:
    "[Case study slots, with permission: client, challenge, result.]",
  testimonialPlaceholder: "[Testimonial slots, with permission.]",
  cta: { label: "See a sample session", href: "/room" },
  primaryCta: { label: "Book a session", href: "/contact" },
} as const;

export const aboutMeta = {
  title: "About | Illuminate Learning",
  description:
    "Founded by [Jen Wilson], ex-Microsoft, Illuminate Learning makes Microsoft Copilot training that people want to be in.",
} as const;

export const about = {
  // lead + accent render as the two-part hero heading: "We are the bit
  // between the licence and the light bulb going on."
  headline: {
    lead: "We are the bit between the licence and",
    accent: "the light bulb going on.",
  },
  body: "Illuminate Learning was founded by [Jen Wilson], who spent [years] inside Microsoft before deciding that the gap worth fixing was adoption: getting people to use the technology they already had. We know the channel, we know the pressure MSPs are under, and we know that the difference between training that lands and training that washes over a room is almost always the delivery.",
  personality:
    "We work with big companies, but we are not a stiff one. We are a bit nerdy, we like the people we work with, and we think training should be the opposite of dull.",
  teamNote: "[Confirm bios and titles.]",
  team: [
    {
      name: "[Jen Wilson]",
      role: "Founder, client-facing and relationships. Does not deliver training.",
    },
    {
      name: "[James]",
      role: "In-the-room training: adoption, technical and security.",
    },
    {
      name: "[Edd]",
      role: "Sales enablement and the channel.",
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
  // lead + accent render as the two-part hero heading: "Things worth
  // knowing about Copilot, adoption and the channel."
  headline: {
    lead: "Things worth knowing about Copilot, adoption",
    accent: "and the channel.",
  },
  body: "Plain, useful writing on getting Copilot from a licence to real use, the MSP opportunity, and the bits Microsoft does not spell out.",
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
  // lead + accent render as the two-part hero heading: "Tell us what your
  // team is stuck on."
  headline: { lead: "Tell us what your team", accent: "is stuck on." },
  body: "No pitch. Tell us where Copilot is not landing, for your team or your clients', and we will tell you whether we can help.",

  // The real enquiry form, posted client-side to Formspree. The `name`
  // values below are the Formspree field keys and must not change: an input
  // named exactly "email" makes Formspree set reply-to to the sender, so a
  // reply lands back with the prospect. "message" is the enquiry field.
  form: {
    message: {
      name: "message",
      label: "Your message",
    },
    name: { name: "name", label: "Name" },
    email: { name: "email", label: "Work email" },
    company: { name: "company", label: "Company", optional: "optional" },
    send: "Send",
    sending: "Sending",
    privacy: "We only use this to reply to you.",
    validation: {
      name: "Add your name so we know who we're talking to.",
      email: "Add a work email so we can reply.",
      message: "Tell us what you're stuck on.",
    },
    error: {
      lead: "Something went wrong. Email us at",
      email: "jen@illuminate-learning.co.uk",
    },
    success: {
      heading: "That's on its way.",
      body: "We'll come back to you.",
      again: "Send another",
    },
  },
} as const;

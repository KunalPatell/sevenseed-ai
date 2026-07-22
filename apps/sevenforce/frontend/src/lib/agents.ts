// The Sevenforce AI workforce: 10 agent groups, 25 tools.
//
// Ported verbatim from the previous hand-written portal (app.html) so no tool,
// endpoint or field is lost in the React rebuild. Each tool is declarative —
// `ep` is the backend route and `f` describes the form — which lets the portal
// render every tool from this one registry instead of bespoke markup.

export type AgentField = {
  k: string;                 // payload key
  l: string;                 // label
  /**
   * How the field renders and how its value is serialised:
   *  text/textarea — string
   *  number        — number
   *  select        — string, chosen from `opts`
   *  csv           — comma-separated -> string[]
   *  lines         — one per line    -> string[]
   *  recipients    — "email,Name" per line -> {email,name}[]
   */
  type?: "text" | "textarea" | "number" | "select" | "csv" | "lines" | "recipients";
  opts?: string[];           // options for type "select"
  def?: string | number;     // default value
  icon?: string;             // Font Awesome class
};

export type AgentTool = {
  t: string;                 // tool title
  ep: string;                // backend endpoint
  icon?: string;
  download?: boolean;        // response is a file (docx) rather than JSON
  f: AgentField[];
};

export type Agent = {
  id: string;
  suite: string;
  em: string;                // emoji badge
  name: string;
  role: string;
  desc: string;
  tools: AgentTool[];
};

export const AGENTS: Agent[] =
[
  {
    id:"dashboard", suite:"Overview", em:"🏠", name:"Workspace Overview", role:"System Administrator",
    desc:"Manage 7 autonomous AI employees wired into your enterprise workspace.",
    tools:[]
  },
  {
    id:"owl", suite:"Orchestrator", em:"🦉", name:"Owl", role:"AI Chief of Staff",
    desc:"State any multi-part goal. Owl orchestrates workflows, distributes tasks to Maya, Vibe, and Wave, and summarizes the delivery lifecycle.",
    tools:[
      {t:"Ask Owl to Orchestrate Workflows", ep:"/api/agent/run", icon:"fa-network-wired", f:[
        {k:"message",l:"What workflow do you need orchestrated? (e.g. 'Draft a blog post about LLM RAG safety and create 3 LinkedIn promotional captions')",type:"textarea",icon:"fa-keyboard"}
      ]}
    ]
  },
  {
    id:"maya", suite:"Growth AI", em:"🖊️", name:"Maya", role:"Content & SEO Director",
    desc:"Autonomous brand analysis, web scrapers, keyword targeting, and SEO article generators.",
    tools:[
      {t:"Extract Brand Profile", ep:"/api/tools/brand-profile", icon:"fa-globe", f:[{k:"url",l:"Website URL",icon:"fa-link"}]},
      {t:"Scrape Site Content", ep:"/api/tools/site-scrape", icon:"fa-spider", f:[{k:"url",l:"Target Scraping URL",icon:"fa-link"}]},
      {t:"Generate SEO Content Topics", ep:"/api/tools/content-topics", icon:"fa-lightbulb", f:[
        {k:"name",l:"Brand Name",icon:"fa-font"},
        {k:"industry",l:"Industry Sector",icon:"fa-briefcase"},
        {k:"audience",l:"Target Audience Persona",icon:"fa-users"},
        {k:"tone",l:"Tone of Voice",icon:"fa-comment-dots"},
        {k:"n",l:"Number of Ideas",type:"number",def:5,icon:"fa-list-ol"}
      ]},
      {t:"Draft Long-form SEO Article", ep:"/api/tools/content-blog", icon:"fa-pen-fancy", f:[
        {k:"name",l:"Brand Name",icon:"fa-font"},
        {k:"industry",l:"Industry",icon:"fa-briefcase"},
        {k:"audience",l:"Audience",icon:"fa-users"},
        {k:"tone",l:"Tone",icon:"fa-comment-dots"},
        {k:"title",l:"Blog Title Target",icon:"fa-heading"},
        {k:"angle",l:"Content Brief & Guidelines",type:"textarea",icon:"fa-keyboard"}
      ]},
    ]
  },
  {
    id:"vibe", suite:"Growth AI", em:"📱", name:"Vibe", role:"Social Media Lead",
    desc:"Tailors viral copy and platform-optimized posts for Twitter/X, LinkedIn, and Instagram.",
    tools:[
      {t:"Generate Multi-Platform Social Captions", ep:"/api/tools/social-captions", icon:"fa-hashtag", f:[
        {k:"topic",l:"Campaign Topic / Product Release Details",type:"textarea",icon:"fa-keyboard"},
        {k:"brand",l:"Brand Name Context",icon:"fa-font"},
        {k:"platforms",l:"Target Channels (comma-separated)",type:"text",def:"instagram, linkedin, x",icon:"fa-share-nodes"}
      ]}
    ]
  },
  {
    id:"wave", suite:"Growth AI", em:"💬", name:"Wave", role:"Sales & CRM Agent",
    desc:"Autonomous lead pipeline, outreach automation, contact validation, and WhatsApp triggers.",
    tools:[
      {t:"Map Ideal Customer Profiles (ICP)", ep:"/api/tools/icp", icon:"fa-bullseye", f:[
        {k:"product",l:"Product / Value Proposition Detail",type:"textarea",icon:"fa-keyboard"},
        {k:"market",l:"Target Industry / Geolocation",icon:"fa-map-marker-alt"}
      ]},
      {t:"Score & Qualify Incoming Leads", ep:"/api/tools/lead-score", icon:"fa-award", f:[
        {k:"lead",l:"Raw Lead Data (Paste email/notes/bio)",type:"textarea",icon:"fa-keyboard"},
        {k:"offer",l:"Proposed Solution/Offer",icon:"fa-gift"}
      ]},
      {t:"Generate Multi-Step Outreach Campaigns", ep:"/api/tools/outreach-sequence", icon:"fa-paper-plane", f:[
        {k:"persona",l:"Target Contact Persona",type:"textarea",icon:"fa-user-tie"},
        {k:"offer",l:"Campaign Message / Core Value Pitch",icon:"fa-gift"},
        {k:"channel",l:"Outreach Channel",type:"select",opts:["email","linkedin","whatsapp"],icon:"fa-route"},
        {k:"steps",l:"Total Campaign Steps",type:"number",def:3,icon:"fa-list-ol"}
      ]},
      {t:"Verify Raw Outbound Email List", ep:"/api/tools/validate-emails", icon:"fa-envelope-circle-check", f:[
        {k:"emails",l:"Emails to audit (one per line)",type:"lines",icon:"fa-list"}
      ]},
      {t:"Deliver Direct WhatsApp Trigger", ep:"/api/notify/whatsapp", icon:"fa-comments", f:[
        {k:"to",l:"Destination Mobile (with country code)",icon:"fa-phone"},
        {k:"body",l:"Message Template Body",type:"textarea",icon:"fa-keyboard"}
      ]},
      {t:"Execute Bulk Email Campaign", ep:"/api/campaigns/send", icon:"fa-paper-plane", f:[
        {k:"subject",l:"Email Subject Line",icon:"fa-heading"},
        {k:"body",l:"Campaign Email Body (supports {name} token)",type:"textarea",icon:"fa-keyboard"},
        {k:"recipients",l:"Recipients (one per line: email,Name)",type:"recipients",icon:"fa-list"}
      ]},
    ]
  },
  {
    id:"nova", suite:"Agency AI", em:"📝", name:"Nova", role:"Lead Business Analyst",
    desc:"Generates discovery matrices, exports requirements to professional Word (.docx) files, and writes test suites.",
    tools:[
      {t:"Generate Discovery & Scoping Questions", ep:"/api/tools/doc-questions", icon:"fa-question-circle", f:[
        {k:"doc_type",l:"Scoping Document Target Type",type:"select",opts:["BRD","SRS","FRS","PRD","CHARTER","BUSINESS_PLAN","SOW"],icon:"fa-file-signature"},
        {k:"requirements",l:"Raw Requirement Notes / Rough Brief",type:"textarea",icon:"fa-keyboard"}
      ]},
      {t:"Draft Document Draft (Markdown)", ep:"/api/tools/doc-generate", icon:"fa-file-word", f:[
        {k:"doc_type",l:"Document Type",type:"select",opts:["BRD","SRS","FRS","PRD","CHARTER","BUSINESS_PLAN","SOW"],icon:"fa-file-signature"},
        {k:"project_name",l:"Project Name Indicator",icon:"fa-font"},
        {k:"requirements",l:"Raw Requirement Notes",type:"textarea",icon:"fa-keyboard"},
        {k:"extra",l:"Compliance / SLA Constraints",type:"textarea",icon:"fa-shield-halved"}
      ]},
      {t:"Export & Download Document as Word (.docx)", ep:"/api/download/docx", download:true, icon:"fa-download", f:[
        {k:"doc_type",l:"Document Type",icon:"fa-file-signature"},
        {k:"project_name",l:"Project Name",icon:"fa-font"},
        {k:"markdown",l:"Markdown Raw Text to Export",type:"textarea",icon:"fa-keyboard"}
      ]},
      {t:"Generate Test Cases & Acceptance Criteria", ep:"/api/tools/test-cases", icon:"fa-bug", f:[
        {k:"feature",l:"Feature Description / User Story",type:"textarea",icon:"fa-keyboard"},
        {k:"context",l:"Existing Tech Stack Constraints",icon:"fa-cube"}
      ]},
      {t:"Audit Figma Web Design Link", ep:"/api/tools/figma-analyze", icon:"fa-figma", f:[
        {k:"url",l:"Figma Design URL",icon:"fa-link"},
        {k:"token",l:"Figma Developer Token (Optional)",icon:"fa-key"},
        {k:"gemini_key",l:"Custom Gemini Key Override (Optional)",icon:"fa-key"}
      ]},
    ]
  },
  {
    id:"echo", suite:"Agency AI", em:"🎙️", name:"Echo", role:"Meeting Assistant",
    desc:"Transforms raw speech-to-text transcripts into clean summaries, decisions, and action plans.",
    tools:[
      {t:"Extract Transcript Deliverables", ep:"/api/tools/summarize-transcript", icon:"fa-audio-description", f:[
        {k:"transcript",l:"Paste Meeting Transcript",type:"textarea",icon:"fa-keyboard"},
        {k:"context",l:"Context / Key Participants List",icon:"fa-circle-info"}
      ]}
    ]
  },
  {
    id:"scout", suite:"Agency AI", em:"🧑‍💼", name:"Scout", role:"AI Talent Acquisition",
    desc:"Generates specialized interview questions, runs 7-dimension scoring audits, and maps CV profiles against JDs.",
    tools:[
      {t:"Create Target Interview Questionnaire", ep:"/api/tools/interview-generate", icon:"fa-comments-question", f:[
        {k:"role",l:"Target Role Title",icon:"fa-user-tie"},
        {k:"level",l:"Seniority Level",type:"select",opts:["junior","mid","senior","lead"],icon:"fa-layer-group"},
        {k:"n",l:"Number of Questions",type:"number",def:10,icon:"fa-list-ol"},
        {k:"jd",l:"Job Description Text",type:"textarea",icon:"fa-keyboard"},
        {k:"resume",l:"Candidate Resume Bio (Optional)",type:"textarea",icon:"fa-address-card"}
      ]},
      {t:"Evaluate & Score Candidate Answers", ep:"/api/tools/interview-evaluate", icon:"fa-star-half-stroke", f:[
        {k:"role",l:"Target Role",icon:"fa-user-tie"},
        {k:"level",l:"Target Level",type:"select",opts:["junior","mid","senior","lead"],icon:"fa-layer-group"},
        {k:"jd",l:"Job Description Text",type:"textarea",icon:"fa-keyboard"},
        {k:"transcript",l:"Interview Transcript (Answers)",type:"textarea",icon:"fa-keyboard"}
      ]},
      {t:"Run Resume vs JD Alignment Audit", ep:"/api/tools/resume-analyze", icon:"fa-chart-pie", f:[
        {k:"resume",l:"Candidate Resume Raw Text",type:"textarea",icon:"fa-address-card"},
        {k:"jd",l:"Job Description Text (Optional)",type:"textarea",icon:"fa-keyboard"}
      ]},
    ]
  },
  {
    id:"sage", suite:"Agency AI", em:"📊", name:"Sage", role:"Strategic SQL Analyst",
    desc:"Connects databases to high-speed NL-to-SQL logic paths to retrieve schema trends using raw English prompts.",
    tools:[
      {t:"Query Workspace Databases", ep:"/api/tools/ask-data", icon:"fa-database", f:[
        {k:"question",l:"Ask about database trends (e.g. 'Show the total registrations from Surat last week')",type:"textarea",icon:"fa-question-circle"}
      ]}
    ]
  },
  {
    id:"atlas", suite:"Game Dev AI", em:"🎮", name:"Atlas, Pixel & Forge", role:"Game Development Trio",
    desc:"Atlas designs mechanics and systems, Pixel generates real concept art via Stable Diffusion, and Forge specs 3D assets for your engine.",
    tools:[
      {t:"Atlas — Game Design Brief", ep:"/api/tools/game-design-brief", icon:"fa-gamepad", f:[
        {k:"concept",l:"Game Concept (e.g. 'roguelike deckbuilder set in a flooded city')",type:"textarea",icon:"fa-lightbulb"},
        {k:"genre",l:"Genre (optional)",icon:"fa-dice-d20"}
      ]},
      {t:"Pixel — Generate Concept Art", ep:"/api/tools/concept-art", icon:"fa-palette", f:[
        {k:"description",l:"Asset / Character / UI Description",type:"textarea",icon:"fa-keyboard"},
        {k:"style",l:"Art Style",def:"digital painting, game concept art",icon:"fa-brush"}
      ]},
      {t:"Forge — 3D Asset Spec & Greybox Plan", ep:"/api/tools/3d-asset-brief", icon:"fa-cube", f:[
        {k:"description",l:"3D Asset Description",type:"textarea",icon:"fa-keyboard"},
        {k:"engine",l:"Target Engine",def:"Unreal Engine",icon:"fa-gear"}
      ]}
    ]
  },
];

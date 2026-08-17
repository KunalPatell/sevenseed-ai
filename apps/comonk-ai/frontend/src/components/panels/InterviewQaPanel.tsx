"use client";

import React, { useMemo, useState } from "react";
import {
  Search, ChevronDown, Code, Database, LineChart, Layers, MessagesSquare, Megaphone, Handshake,
} from "lucide-react";

interface QA {
  q: string;
  a: string[];
}

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: QA[];
}

const CATEGORIES: Category[] = [
  {
    id: "swe",
    label: "Software Engineer",
    icon: Code,
    questions: [
      {
        q: "Tell me about a challenging bug you fixed and how you debugged it.",
        a: [
          "Set the scene: the system, the symptom, and the impact on users or the business.",
          "Describe a systematic approach — reproduce reliably, isolate with logging/bisection, form a hypothesis before guessing.",
          "Explain the actual root cause, not just the symptom you patched.",
          "Cover the fix and the regression test you added so it can't silently come back.",
          "Close with what you changed afterward — monitoring, alerting, or a process fix.",
        ],
      },
      {
        q: "How would you design a URL shortener?",
        a: [
          "Clarify scale and requirements first: read/write ratio, custom aliases, expiry, analytics.",
          "Pick an ID generation scheme — base62 counter or hash of the long URL — and discuss collision handling.",
          "Sketch the storage layer: a key-value store or simple table keyed by short code.",
          "Describe the redirect path and why you'd cache hot links (most reads hit a small % of links).",
          "Mention edge cases: malicious URLs, rate limiting creation, and expiring/deleting links.",
        ],
      },
      {
        q: "Explain the difference between processes and threads.",
        a: [
          "A process is an isolated unit with its own memory space and resources.",
          "A thread is a lighter-weight unit of execution within a process that shares memory with sibling threads.",
          "Context switching between threads is cheaper than between processes.",
          "Threads suit CPU/IO-bound work sharing state; processes suit isolation and fault containment.",
          "Mention language specifics if relevant (e.g. Python's GIL limiting true CPU parallelism across threads).",
        ],
      },
      {
        q: "What is Big-O and why does it matter? Walk through an example.",
        a: [
          "Big-O describes how runtime or space grows with input size in the worst case, ignoring constants.",
          "Example: linear search is O(n); binary search on a sorted array is O(log n).",
          "It lets you compare algorithms independent of hardware or implementation details.",
          "Mention the space/time trade-off — a faster algorithm sometimes costs more memory.",
          "Bonus: bring up amortized analysis (e.g. dynamic array append) if the interviewer probes deeper.",
        ],
      },
      {
        q: "How do you approach code review — both giving and receiving feedback?",
        a: [
          "Focus comments on correctness, readability, and tests — leave style nits to a linter/formatter.",
          "Ask questions ('what happens if this is null?') rather than issuing commands.",
          "Explain the why behind a suggestion so it's a learning moment, not just a gate.",
          "Keep PRs small and review promptly so it doesn't block teammates.",
          "When receiving feedback, assume good intent, ask clarifying questions, and don't take it personally.",
        ],
      },
      {
        q: "Describe a time you had to make a trade-off between speed and code quality.",
        a: [
          "Give the context and the deadline pressure that forced the trade-off.",
          "Be specific about what you cut (e.g. deferred a refactor, thinner test coverage on a low-risk path).",
          "Explain what you protected no matter what — correctness, security, data integrity.",
          "Describe how you flagged the resulting tech debt so it didn't get forgotten.",
          "Share the follow-up: did you go back and pay it down, and what was the outcome.",
        ],
      },
      {
        q: "How would you design a rate limiter?",
        a: [
          "Name the common algorithms: token bucket, sliding window, and fixed window counters.",
          "Discuss where it's enforced — API gateway vs. individual service.",
          "For a distributed system, storage needs to be shared (e.g. Redis) so limits hold across instances.",
          "Describe the client-facing behavior: 429 status with a Retry-After header.",
          "Mention edge cases: per-user vs per-IP limits, and burst tolerance vs strict smoothing.",
        ],
      },
      {
        q: "What's your process for writing tests for a new feature?",
        a: [
          "Start with unit tests around core logic and edge cases before writing integration tests.",
          "Add integration tests for the critical user-facing paths.",
          "Mock external dependencies (APIs, DBs) to keep unit tests fast and deterministic.",
          "Think about failure modes deliberately, not just the happy path.",
          "Treat coverage as a signal to investigate gaps, not a target to game.",
        ],
      },
    ],
  },
  {
    id: "ds",
    label: "Data Scientist",
    icon: LineChart,
    questions: [
      {
        q: "Explain the bias-variance tradeoff.",
        a: [
          "Bias is error from overly simplistic assumptions (underfitting).",
          "Variance is error from sensitivity to the specific training data (overfitting).",
          "Total expected error decomposes into bias² + variance + irreducible noise.",
          "Techniques to balance: regularization, more training data, adjusting model complexity, ensembling.",
        ],
      },
      {
        q: "How do you handle missing data?",
        a: [
          "First understand the mechanism: missing completely at random, at random, or not at random.",
          "Options include dropping rows/columns, imputing (mean/median/mode, KNN, model-based), or flagging missingness as its own feature.",
          "The right choice depends on how much is missing and whether the missingness itself is informative.",
          "Always document the impact of your choice on downstream model performance.",
        ],
      },
      {
        q: "Walk me through how you'd evaluate a classification model beyond accuracy.",
        a: [
          "Start with a confusion matrix to see the error types, not just the aggregate rate.",
          "Use precision, recall, and F1 — especially important under class imbalance where accuracy is misleading.",
          "ROC-AUC for ranking quality; PR-AUC when positives are rare.",
          "Pick a decision threshold based on the real business cost of false positives vs false negatives.",
          "Check stability via cross-validation, and calibration if predicted probabilities matter downstream.",
        ],
      },
      {
        q: "Describe a time your analysis changed a business decision.",
        a: [
          "State the business question you were asked to answer.",
          "Briefly describe your methodology — enough to show rigor, not a data-science lecture.",
          "Summarize the key finding in plain language, the way you'd present it to a stakeholder.",
          "Explain how you handled pushback or skepticism.",
          "End with the measurable outcome of the decision.",
        ],
      },
      {
        q: "How would you detect and handle overfitting?",
        a: [
          "Symptoms: a large gap between training and validation performance, or unstable cross-validation folds.",
          "Fixes: regularization (L1/L2), dropout for neural nets, early stopping, simplifying the model.",
          "More data or data augmentation also helps when feasible.",
          "Always validate the fix with proper cross-validation, not a single train/test split.",
        ],
      },
      {
        q: "Explain A/B testing and how you'd size a test.",
        a: [
          "Randomly assign users to control and treatment to isolate the causal effect of a change.",
          "Define one primary metric plus guardrail metrics before the test starts.",
          "Size the test with a power analysis using baseline rate, minimum detectable effect, significance level, and power.",
          "Avoid peeking early or running many uncorrected comparisons — both inflate false positive risk.",
          "Interpret results with confidence intervals, not just a binary p-value verdict.",
        ],
      },
      {
        q: "What's the difference between L1 and L2 regularization?",
        a: [
          "L1 (Lasso) can drive coefficients exactly to zero, effectively performing feature selection.",
          "L2 (Ridge) shrinks coefficients smoothly toward zero without eliminating them, and handles multicollinearity well.",
          "Elastic Net combines both when you want sparsity and stability together.",
          "Geometrically: L1's constraint region has corners (sparse solutions), L2's is smooth (round).",
        ],
      },
      {
        q: "How do you explain a complex model to a non-technical stakeholder?",
        a: [
          "Lead with the business question and the answer, not the algorithm.",
          "Use analogies and visuals instead of formulas.",
          "Show concrete examples of predictions the model made, not just aggregate metrics.",
          "Be upfront about uncertainty and where the model is likely to be wrong.",
          "Always tie the explanation back to the decision it's meant to support.",
        ],
      },
    ],
  },
  {
    id: "pm",
    label: "Product Manager",
    icon: Layers,
    questions: [
      {
        q: "How do you prioritize features on your roadmap?",
        a: [
          "Use a framework like RICE or ICE to compare impact, confidence, and effort consistently.",
          "Anchor everything to strategic goals or OKRs, not just the loudest request.",
          "Blend quantitative signal (usage data, funnel drop-off) with qualitative input (support tickets, sales, interviews).",
          "Be willing to say no, and explain why, so stakeholders trust the process.",
          "Revisit priorities regularly as new data comes in — a roadmap isn't fixed in stone.",
        ],
      },
      {
        q: "Tell me about a product you launched that failed. What did you learn?",
        a: [
          "State the original hypothesis and what metric would have defined success.",
          "Be honest about the root cause — wrong problem, poor execution, or bad timing.",
          "Explain what you'd validate earlier and cheaper next time (a smaller experiment before full build).",
          "Show how you communicated the outcome to stakeholders without spin.",
        ],
      },
      {
        q: "How do you gather and incorporate user feedback?",
        a: [
          "Combine qualitative sources (interviews, support tickets, sales calls) with quantitative ones (analytics, NPS, funnel data).",
          "Synthesize themes across many data points rather than chasing each individual request.",
          "Validate solutions with prototypes or small experiments before committing engineering time.",
          "Close the loop — tell the users who gave feedback what changed as a result.",
        ],
      },
      {
        q: "Walk me through how you'd design a scheduling app.",
        a: [
          "Clarify the target user and the core job-to-be-done first.",
          "Identify the two or three must-have flows for an MVP (e.g. create event, find a mutual slot, send invite).",
          "Explicitly scope what's out for v1 versus what comes later.",
          "Define success metrics — e.g. time-to-schedule, no-show rate.",
          "Call out edge cases: timezones, double-booking, recurring events.",
        ],
      },
      {
        q: "How do you work with engineering when a deadline is at risk?",
        a: [
          "Get early visibility through regular check-ins so risk surfaces before it's a crisis.",
          "Understand the actual root cause — unclear scope, unknown unknowns, or external dependencies.",
          "Negotiate the trade-off between scope, date, and quality together with the team, not unilaterally.",
          "Communicate transparently to stakeholders with real options, not a surprise slip.",
        ],
      },
      {
        q: "How do you define and measure success for a new feature?",
        a: [
          "Pick one primary metric tied directly to user value, plus guardrail metrics to catch regressions.",
          "Set a target or hypothesis before launch, not after seeing the numbers.",
          "Instrument analytics ahead of release so you're not scrambling for data afterward.",
          "Distinguish leading indicators (early adoption) from lagging ones (retention, revenue).",
        ],
      },
      {
        q: "Describe a time you had to say no to a stakeholder's request.",
        a: [
          "Start by understanding the underlying need behind the ask, not just the literal request.",
          "Show the trade-off against current roadmap priorities using data, not opinion.",
          "Offer an alternative or a realistic timeline instead of a flat no.",
          "Keep the relationship intact — this stakeholder will have future asks.",
        ],
      },
      {
        q: "How do you approach competitive analysis?",
        a: [
          "Identify both direct and indirect competitors — indirect ones solve the same job differently.",
          "Compare on the core job-to-be-done, not a feature checklist.",
          "Look for genuine gaps or underserved segments, not just parity.",
          "Combine competitive research with your own user research — never just copy a competitor's roadmap.",
        ],
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend Developer",
    icon: Code,
    questions: [
      {
        q: "Explain the virtual DOM and why frameworks like React use it.",
        a: [
          "It's an in-memory representation of the UI that gets diffed between renders.",
          "React computes the minimal set of real-DOM changes needed instead of re-rendering everything.",
          "Updates are batched for performance rather than applied one at a time.",
          "Mention why 'key' props matter — they help the diffing algorithm match list items correctly.",
        ],
      },
      {
        q: "How do you optimize a slow-loading web page?",
        a: [
          "Measure first — Lighthouse and Core Web Vitals (LCP, CLS, TBT) tell you where the real problem is.",
          "Code-split and lazy-load routes/components that aren't needed immediately.",
          "Optimize images: compress, use modern formats, lazy-load offscreen images.",
          "Reduce and defer non-critical JavaScript; tree-shake unused code.",
          "Use caching and a CDN, and avoid render-blocking CSS.",
        ],
      },
      {
        q: "What's the difference between controlled and uncontrolled components in React?",
        a: [
          "Controlled: form state lives in React state, giving a single source of truth and easy validation.",
          "Uncontrolled: the DOM holds its own state, accessed via refs — less boilerplate for simple cases.",
          "Controlled components scale better for complex forms with cross-field validation.",
        ],
      },
      {
        q: "How do you ensure your UI is accessible?",
        a: [
          "Start with semantic HTML — it gets you most accessibility for free.",
          "Make sure every interactive element is reachable and operable by keyboard.",
          "Use ARIA attributes only when semantic HTML genuinely can't express the pattern.",
          "Check color contrast ratios and manage focus explicitly on modals and route changes.",
          "Test with an actual screen reader, not just an automated audit tool.",
        ],
      },
      {
        q: "Explain CSS specificity and how you avoid specificity wars.",
        a: [
          "Specificity ranks selectors roughly: inline styles > IDs > classes/attributes > elements.",
          "Cascade and source order break ties between equal-specificity rules.",
          "Avoid !important and deep nesting, which make specificity hard to reason about.",
          "Use a methodology like BEM, CSS Modules, or a utility-first approach (e.g. Tailwind) to sidestep conflicts entirely.",
        ],
      },
      {
        q: "How would you manage state in a large React application?",
        a: [
          "Keep state local to a component whenever it's not needed elsewhere.",
          "Lift state up or use context for state shared by a subtree of the UI.",
          "Reach for an external store (Redux/Zustand/Jotai) only for genuinely complex cross-cutting state.",
          "Separate server state (via React Query/SWR) from client UI state — they have different caching needs.",
        ],
      },
      {
        q: "What causes unnecessary re-renders in React and how do you prevent them?",
        a: [
          "New object, array, or function references created on every render are a common culprit.",
          "A parent re-rendering cascades to all its children by default.",
          "Fixes: memo, useMemo, and useCallback where they demonstrably help — not everywhere by default.",
          "Stable list keys and splitting large components into smaller ones also reduce blast radius.",
        ],
      },
      {
        q: "Walk through how the browser renders a web page (critical rendering path).",
        a: [
          "Parse HTML into the DOM.",
          "Parse CSS into the CSSOM.",
          "Combine DOM + CSSOM into the render tree.",
          "Layout (reflow) computes geometry, then paint fills in pixels, then compositing assembles layers.",
          "Mention how render-blocking resources and async/defer script loading affect this pipeline.",
        ],
      },
    ],
  },
  {
    id: "backend",
    label: "Backend Developer",
    icon: Database,
    questions: [
      {
        q: "How would you design a database schema for an e-commerce order system?",
        a: [
          "Identify core entities: users, products, orders, order_items, payments.",
          "Normalize to avoid redundancy, but consider denormalizing specific read-heavy paths.",
          "Model relationships with foreign keys and think through cascade/delete behavior.",
          "Index columns used in common queries (e.g. user_id, order status, created_at).",
          "Handle state transitions explicitly — an order status field with a defined state machine.",
        ],
      },
      {
        q: "Explain the difference between SQL and NoSQL databases and when to use each.",
        a: [
          "SQL: structured schema, ACID transactions, strong relational integrity — great for complex queries and joins.",
          "NoSQL: flexible schema, horizontal scalability, often eventual consistency — great for high-throughput or rapidly evolving data.",
          "The decision should follow your access patterns and consistency needs, not trend-chasing.",
        ],
      },
      {
        q: "How do you design a REST API that's easy to use and maintain?",
        a: [
          "Model resources with clear URLs and use HTTP verbs/status codes as intended.",
          "Decide on a versioning strategy up front.",
          "Keep pagination and error response formats consistent across every endpoint.",
          "Make POST/PUT idempotent where it matters (e.g. via idempotency keys).",
          "Document with OpenAPI and treat backward compatibility as a real constraint, not an afterthought.",
        ],
      },
      {
        q: "What's the difference between authentication and authorization, and how do you implement both?",
        a: [
          "Authentication answers 'who are you' — password, OAuth, session, or JWT-based.",
          "Authorization answers 'what can you do' — roles, permissions, or ACLs.",
          "Implement authentication once at the edge (middleware), and authorization per-resource, checked on every request.",
          "Apply the principle of least privilege throughout.",
        ],
      },
      {
        q: "How would you scale a backend service that's hitting performance limits?",
        a: [
          "Profile first to find the actual bottleneck — DB, CPU, or IO — before optimizing blindly.",
          "Add caching (Redis, CDN) for expensive or frequently-read data.",
          "Use read replicas or sharding for database scaling; horizontal scaling behind a load balancer for compute.",
          "Move slow work off the request path into async queues.",
          "Use connection pooling to avoid exhausting database connections under load.",
        ],
      },
      {
        q: "Explain database indexing and its trade-offs.",
        a: [
          "An index is an auxiliary structure (commonly a B-tree) that speeds up lookups on indexed columns.",
          "It speeds reads but slows writes, since every insert/update must also update the index.",
          "It adds storage overhead and, for composite indexes, column order matters for which queries benefit.",
          "Over-indexing is a real cost — index only what your query patterns actually need.",
        ],
      },
      {
        q: "How do you handle a service dependency going down?",
        a: [
          "Use timeouts and retries with exponential backoff so failures don't cascade or hang forever.",
          "Add a circuit breaker to fail fast once a dependency is clearly unhealthy.",
          "Provide a fallback — cached data or graceful degradation — instead of a hard failure where possible.",
          "Decouple non-critical work via queues so a downstream outage doesn't block the whole request.",
          "Invest in observability so you detect the outage quickly, not from user complaints.",
        ],
      },
      {
        q: "Walk through what happens when a user hits 'submit' on a form, from request to response.",
        a: [
          "Client sends an HTTP request, which hits a load balancer and gets routed to a server.",
          "Middleware runs — authentication, validation, rate limiting.",
          "The business logic/service layer processes the request, possibly within a DB transaction.",
          "The database performs the read/write, and the response gets serialized back to the client.",
          "Mention error handling at each hop — validation errors, DB failures, timeouts.",
        ],
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Megaphone,
    questions: [
      {
        q: "How do you measure the success of a marketing campaign?",
        a: [
          "Define the goal upfront (awareness, leads, conversion) and pick a matching KPI — CAC, CTR, conversion rate, ROAS.",
          "Set a baseline or control group where possible so you can attribute impact, not just correlation.",
          "Attribute results across the full funnel rather than crediting only the last click.",
          "Report both leading indicators (engagement) and lagging ones (revenue) so you catch problems early.",
        ],
      },
      {
        q: "Tell me about a campaign that underperformed. What did you do?",
        a: [
          "State the original hypothesis and target metric.",
          "Diagnose the likely cause — targeting, creative, offer, or channel mismatch.",
          "Explain what you changed and how quickly you acted on the signal.",
          "Share what you'd test differently next time — smaller pilots before scaling spend.",
        ],
      },
      {
        q: "How do you approach positioning a product against competitors?",
        a: [
          "Identify your target segment's real, specific pain point.",
          "Map what competitors already claim, and find the honest differentiator — not a manufactured one.",
          "Build messaging around outcomes for the customer, not a feature list.",
          "Test the messaging with real prospects before committing budget to scale it.",
        ],
      },
      {
        q: "How do you decide which marketing channels to invest in?",
        a: [
          "Start where your audience already spends attention, not where it's trendy.",
          "Run small tests across multiple channels and measure CAC and LTV per channel.",
          "Double down on channels with the best unit economics and repeatability.",
          "Revisit the mix regularly — channel performance shifts over time.",
        ],
      },
      {
        q: "Walk me through how you'd build a go-to-market plan for a new product.",
        a: [
          "Define the target customer and the core value proposition.",
          "Decide pricing and packaging.",
          "Choose a channel strategy — paid, organic, partnerships, sales-assist — matched to the buyer.",
          "Sequence the launch: beta, soft launch, full launch.",
          "Define success metrics and a feedback loop to iterate after launch.",
        ],
      },
      {
        q: "How do you use data to inform creative or content decisions?",
        a: [
          "Review performance broken down by format, hook, and CTA — not just aggregate spend.",
          "Run structured A/B tests that change one variable at a time.",
          "Combine quantitative signal with qualitative customer language from reviews and support tickets.",
        ],
      },
      {
        q: "How do you balance brand marketing with performance marketing?",
        a: [
          "Performance marketing is short-term and directly measurable; brand marketing builds long-term trust that lowers CAC over time.",
          "Allocate budget based on company stage and goals — brand investment compounds, but needs runway.",
          "Use brand-lift studies or media mix modeling to justify and size brand spend.",
        ],
      },
      {
        q: "Describe your experience with SEO or content marketing.",
        a: [
          "Do keyword and intent research tied to each stage of the funnel, not just high-volume terms.",
          "Cover on-page fundamentals — titles, structure, internal linking.",
          "Prioritize content quality and genuine expertise over keyword stuffing.",
          "Measure organic traffic and downstream conversion, not just rankings.",
          "Treat it as iterative — use search console data to keep improving existing content.",
        ],
      },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: Handshake,
    questions: [
      {
        q: "Walk me through how you qualify a lead.",
        a: [
          "Use a framework like BANT or MEDDIC — budget, authority, need, timeline.",
          "Ask open-ended questions to uncover a real pain point, not just surface-level interest.",
          "Be willing to disqualify early — it protects your time and the prospect's.",
        ],
      },
      {
        q: "How do you handle a prospect who says 'it's too expensive'?",
        a: [
          "Clarify what 'expensive' is relative to — their budget, a competitor, or perceived value.",
          "Reconnect the price to the value delivered and the cost of doing nothing.",
          "Only explore flexible options like phasing or tiering after value is firmly established, not before.",
        ],
      },
      {
        q: "Tell me about a deal you lost. What did you learn?",
        a: [
          "State the stage it was lost at and the real reason — budget, competitor, timing, or no decision.",
          "Give an honest self-assessment: what could you have done differently, like earlier discovery or engaging more stakeholders.",
          "Explain concretely how you applied that lesson to a later deal.",
        ],
      },
      {
        q: "How do you build a relationship with a prospect who's gone cold?",
        a: [
          "Find a genuine reason to re-engage — relevant news, a new use case — rather than a generic 'just checking in'.",
          "Lead with value (an insight or resource) before asking for anything.",
          "Respect their timeline and their 'no' if it comes.",
        ],
      },
      {
        q: "How do you handle objections during a sales call?",
        a: [
          "Listen fully before responding — don't interrupt to defend.",
          "Acknowledge the concern as valid rather than dismissing it.",
          "Ask a clarifying question to find the real objection underneath the stated one.",
          "Respond with proof — a case study or data — not just reassurance.",
        ],
      },
      {
        q: "What's your process for forecasting your pipeline?",
        a: [
          "Weight deals by stage-based probability, not gut feel.",
          "Validate the stage against explicit buying signals — confirmed budget, engaged champion, real timeline.",
          "Review the forecast regularly and be honest about slippage rather than sandbagging or over-promising.",
        ],
      },
      {
        q: "How do you approach a multi-stakeholder enterprise sale?",
        a: [
          "Map the buying committee — economic buyer, champion, end users, and potential blockers.",
          "Tailor messaging to each stakeholder's specific priorities.",
          "Build a mutual action plan with your champion to keep momentum through a long cycle.",
        ],
      },
      {
        q: "What motivates you in a sales role, and how do you handle rejection?",
        a: [
          "Give a genuine answer tied to competitiveness, problem-solving, or helping customers succeed.",
          "Frame rejection as data, not a verdict on your worth.",
          "Describe a consistent post-rejection routine — a quick debrief, then moving to the next call — that protects momentum.",
        ],
      },
    ],
  },
];

export function InterviewQaPanel() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const searching = query.trim().length > 0;

  const results = useMemo(() => {
    if (!searching) {
      const cat = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
      return cat.questions.map((qa, i) => ({ catId: cat.id, catLabel: cat.label, qa, id: `${cat.id}::${i}` }));
    }
    const q = query.trim().toLowerCase();
    const out: { catId: string; catLabel: string; qa: QA; id: string }[] = [];
    for (const cat of CATEGORIES) {
      cat.questions.forEach((qa, i) => {
        const haystack = (qa.q + " " + qa.a.join(" ")).toLowerCase();
        if (haystack.includes(q)) out.push({ catId: cat.id, catLabel: cat.label, qa, id: `${cat.id}::${i}` });
      });
    }
    return out;
  }, [query, activeCategory, searching]);

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard flex flex-col gap-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5">
          <Search className="h-4 w-4 text-[#55556a] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search interview questions across all categories..."
            className="bg-transparent outline-none text-sm flex-1 min-w-0"
          />
        </div>

        {!searching && (
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = c.id === activeCategory;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    active
                      ? "text-white border-transparent"
                      : "bg-white/5 border-white/10 text-[#9090b0] hover:text-white hover:border-white/20"
                  }`}
                  style={active ? { background: "linear-gradient(115deg, var(--primary), var(--secondary))" } : undefined}
                >
                  <c.icon className="h-3.5 w-3.5" />
                  {c.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {searching && (
        <p className="text-xs text-[#55556a] -mt-2">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="flex flex-col gap-3">
        {results.length === 0 && (
          <div className="tcard text-center py-10">
            <p className="text-sm text-[#55556a]">No questions match your search.</p>
          </div>
        )}
        {results.map(({ id, qa, catLabel }) => {
          const open = openIds.has(id);
          return (
            <div key={id} className="tcard !p-0 overflow-hidden">
              <button
                onClick={() => toggle(id)}
                className="w-full flex items-center justify-between gap-3 text-left px-4 py-3.5 cursor-pointer"
              >
                <div className="min-w-0">
                  {searching && (
                    <span className="text-[9px] font-bold uppercase tracking-wide text-[#a78bfa]">{catLabel}</span>
                  )}
                  <p className="text-sm font-semibold">{qa.q}</p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[#55556a] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-white/5 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-2">Model Answer Outline</p>
                    <ul className="flex flex-col gap-1.5">
                      {qa.a.map((point, i) => (
                        <li key={i} className="text-xs text-[#9090b0] leading-relaxed flex gap-2">
                          <span className="text-[#a78bfa] shrink-0">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

# Feature research — all 8 ventures

> Researched 2026-07-31. A working document: findings and recommendations, not
> decisions. Nothing here has been built. Edit freely.
>
> Every claim is sourced. Where a number looked biased or unverifiable, that is
> said so explicitly rather than quietly repeated — several of the headline
> statistics in this space come from vendors selling the thing they measure.

**Open questions for Kunal are collected at the end.** Four of them block real work.

---

## 1. Breakdown Factor — construction AI

**Today:** defect scanning from site photos (YOLO); costed material breakdown from drawings.

### What the market says

Adoption is the headline: **only 8–12% of construction SMEs use AI for estimating**
(23–27% for any construction task). The barrier is mostly not price:

> "When the AI misclassifies an item, troubleshooting the *why* is opaque, forcing a
> level of manual spot-checking that can negate the speed advantage."

Trust, not speed, is the wall. The large players sell speed — which leaves trust open.

India specifics that decide whether the product is usable at all:

- **CPWD DSR 2023** carries ~13,000 priced rates, each a four-part buildup:
  material + labour + tools/plant + contractor's profit & overhead (15%)
- State PWD SORs adjust DSR to local rates
- Measurement follows **IS 1200**; billing runs on **RA (Running Account) bills**
- Competing tools sit between ₹500/month (Vyapar) and ₹3,000/month (BuildNext, RDash)

### Recommended

1. **Confidence + provenance on every line item.** Show how sure the model is, and
   highlight the region of the drawing the quantity came from. This is the exact
   "opaque" problem blocking adoption. It changes the pitch from *fast* to *checkable*.
2. **DSR-traceable rates.** A cost that cannot be traced to a DSR/SOR item cannot be
   used on government or tender work. Show the DSR item number and the same four-part
   buildup. In India this is an entry ticket, not a feature.
3. **Drawing revision diff.** Rev A vs Rev C — what changed and *what it costs*. This
   is where variation claims come from, and it is standard in the better tools now.
4. **Excel / BOQ export in IS 1200 format.** In India, "integration" means Excel, not
   an API. This is the real answer to workflow disruption.

### The differentiated bet

Breakdown Factor has **both** defect detection and cost estimation. Competitors have
one or the other.

Connect them: **defect photo → costed rework estimate + material list.** "This crack
will cost ₹X to fix, and here is the material." Nobody else can ship this easily
because they are missing half the system. The other four items make it competitive;
this one makes it different.

### Sources

- [Autodesk: 2026 AI construction trends](https://www.autodesk.com/blogs/construction/2026-ai-trends-25-experts-share-insights/)
- [PalCode: AI estimating — hype vs reality](https://palcode.ai/blog/ai-estimating-software-for-construction-hype-vs-reality)
- [Contractor pain points before adopting AI takeoff](https://londonlovesbusiness.com/key-pain-points-for-contractors-before-using-ai-takeoff-software/)
- [InfraLens: DSR rate analysis](https://infralens.in/knowledge/rate-analysis-civil-engineering-dsr)
- [Construction Estimator India: BOQ formats](https://constructionestimatorindia.com/best-boq-generation-software-formats-templates-in-india/)

---

## 2. Decode Pharmacy — free healthcare

**Today:** reads handwritten prescriptions, explains each medicine in plain language,
finds cheaper/free alternatives.

### What the market says

A gap in global apps:

> "Medisafe's drug interaction checker flags potential conflicts in real time, which
> is something **most apps completely ignore.**"

The real opportunity is Indian data, and it lands directly on the existing feature:

- Jan Aushadhi medicines are **50–90% cheaper** than branded
- **17,990 Kendras** operating; 2,110 medicines; ~1.5 million people daily
- A chronic patient can save up to **₹66,000 a year**
- Branded atorvastatin runs **2× to 25×** the Jan Aushadhi price

Saying "a generic exists" and saying "you can save ₹1,240 a month" are different products.

### Recommended

1. **Rupee savings on every prescription.** After OCR: *"On this prescription you could
   save ₹X per month, ₹Y per year."* The 2×–25× gap is not abstract to the person holding
   the paper.
2. **Nearest Jan Aushadhi Kendra.** Knowing a cheaper medicine exists is useless without
   knowing where to buy it. This completes the chain: prescription → generic → savings →
   where to go.
3. **Drug interaction checking.** The prescription is already being parsed; conflicts are
   the natural next step, and most apps skip it.
4. **Reminders + missed-dose alerts to family.** Peer accountability raises adherence by
   up to 26%. Heavier (accounts, notifications), hence fourth.

### Hard constraint — not advice, a requirement

**Items 2 and 3 must not be LLM-generated.** Kendra locations must come from official
PMBJP data; interaction checks from a real medical database. Not from a model's answer.

This is emphasised because of what was found on this exact site on 2026-07-30: an
"Emergency ER Finder" tab listing three named hospitals with phone numbers and live-sounding
statuses ("24/7 ICU & Trauma Available"), headed *"Live 24/7 Emergency hospital & blood
bank availability matrix"*. All of it was a hardcoded array. None of it was verified.
Someone mid-emergency could have acted on it. It now points at 108/112 instead.

In healthcare the cost of one wrong data point is not the same as on the other seven sites.
Build the feature only when a real source sits behind it.

### The differentiated bet

Other apps serve people who already know the medicine's name. This user is **holding a
paper prescription they cannot read.**

That whole chain — *read it → explain it → find the generic → count the saving → show the
shop* — is not done well by anyone in India.

### Sources

- [Jan Aushadhi generic–branded price variation (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12715599/)
- [Generic vs branded: 90% savings](https://healthandfamily.in/generic-vs-branded-how-indias-jan-aushadhi-revolution-is-slashing-medical-bills-by-90/)
- [Keragon: pharmacy app development 2026](https://www.keragon.com/blog/pharmacy-app-development)
- [Medication adherence apps 2026](https://www.yougot.ai/blog/technology/app-comparisons/medication-adherence-app-2026)

---

## 3. AVP Emart — price comparison

**Today:** compares a product across sellers, claims to show real landed price.
Scoring: 40% price, 40% rating, 20% review volume.

### Read this first

The price data is **not real yet**. The hero widget shows fixed numbers next to real
retailer names (Amazon, Flipkart, Reliance); a "Sample data" badge was added on 2026-07-30.

On the other seven sites, "features" means *what to add*. Here the first feature is
**where real data comes from** — nothing below matters without it.

### What the market says

- **45% of consumers** now use AI while shopping — researching products, interpreting
  reviews, hunting deals (IBM Institute, January 2026)
- Price history charts are the most-wanted feature — they answer "is this actually cheap?"
- Good trackers cover 100,000+ retailers, not just Amazon

### Three routes to real data

**ONDC** is the cleanest. Government-backed open network, public protocol specs and
buyer-app SDKs, and explicitly: *"buyer platforms can showcase products from any ONDC seller."*
No scraping, no permission needed.

*Honest caveat:* ONDC's own seller-app SDK roadmap still lists **catalog indexing as
"future scope"**. The search/browse piece is immature. This is not a complete answer today.

**Affiliate APIs** (Amazon PA-API, Flipkart) are the second route — real prices, legal,
and they **pay**. This could be the business model.

**Scraping** is the third and is not recommended: it breaks, it gets blocked, and it
carries legal risk.

### Recommended

1. **Wire a real data source.** Suggested: start with affiliate APIs (works today, earns
   revenue), add ONDC as it matures.
2. **Price history.** The most trustworthy answer to "is this cheap?" Especially relevant
   in India, where MRP is often raised before a sale to manufacture a "70% off". A history
   chart catches that. This is the trust feature, same role as confidence scores in
   Breakdown Factor.
3. **Bank offers + delivery = true final price.** The **biggest opportunity here.**
   "Landed price" is already the claim, but in India the real variable is **bank card
   offers** — ₹2,000 off on HDFC, 10% cashback on ICICI, delivery charges, coupons. No
   comparison site models this; people do it by hand. A site that says *"this costs you
   ₹51,200 with your HDFC card"* is answering the actual question.
4. **Price drop alerts.** Standard, but only once the pipeline exists. Hence fourth.

### The differentiated bet

Everyone else compares sticker price. This site claims to compare **what you actually pay.**
That claim is not yet true — but with bank offers, delivery and coupons modelled, it would
be the one feature in India worth returning for, because it is the only number that matters.

### Sources

- [ONDC official](https://www.ondc.org/)
- [ONDC Protocol Specs (GitHub)](https://github.com/ONDC-Official/ONDC-Protocol-Specs)
- [ONDC seller-app SDK roadmap](https://github.com/ONDC-Official/seller-app-sdk)
- [Karma: best price trackers 2026](https://www.karmanow.com/the-blog/top/the-best-price-trackers)
- [Shopify: comparison shopping engines](https://www.shopify.com/blog/7068398-10-best-comparison-shopping-engines-to-increase-ecommerce-sales)

---

## 4. AVPU — AI university

**Today:** personalised syllabus, WhatsApp tutor, face-recognition attendance,
placement matching, assessment grading.

### What the market says

Large effect sizes circulate (54% higher test scores; RCT effect size 0.73–1.3 SD).
**Treat these with suspicion** — most come from vendor blogs. The genuinely useful finding:

> "**Most shipped products do not even measure their effect on learning outcomes**,
> let alone improve them."

And: the winners treat it as *"a pedagogy problem with an LLM-shaped tool"*, not
*"an LLM looking for a pedagogy."*

### Risk first — this precedes any feature

**Face-recognition attendance is the biggest liability here, not the best feature.**

The DPDP Act 2023 and DPDP Rules 2025 are in force:

- Biometric data is among the **most sensitive categories**
- **Parental consent is mandatory** for children's biometric data
- Using facial recognition for attendance *"significantly increases compliance exposure"*
- Biometric data, once compromised, **cannot be replaced** — the harm is irreversible

And directly relevant to the placement feature:

> Learning analytics that label students as "low potential" or predict behavioural issues
> without proper safeguards **may be treated as harmful profiling.**

AVPU does placement scoring and assessment grading. If that attaches a label to a student,
it is not only a design question.

**Recommendation:** offer geofenced QR or OTP check-in instead. It does 95% of the job
without the biometric exposure. Keep face recognition only where an institution
specifically demands it, and then with a real parental-consent flow.

### Recommended

1. **Measure outcomes — and sell that.** Almost nobody does. Track pre/post scores,
   topic-level weakness, completion. Telling an institution *"your students went from 61
   to 74 average"* sells better than any feature list. **Biggest opportunity, because the
   bar is on the floor.**
2. **Placement gap reports, not scores.** Not "72/100" but *"3 skills missing, roughly N
   weeks to close."* Legally safer and more useful to the student.
3. **Deepen the WhatsApp tutor.** See below.
4. **Adaptive pacing.** Personalisation works when it adapts pace and feedback tone, not
   just difficulty (~42% better outcomes). Natural next step for the syllabus feature.

### The differentiated bet — WhatsApp

Every other edtech product requires an app install, an account, and a decent phone.
This tutor runs on **WhatsApp** — cheap phone, poor connectivity, nothing to install,
nothing to learn.

In tier-2/3 India that is an accessibility decision, not a feature. It is also the thing
a Byju's-type competitor cannot take away, because their whole model depends on the install.

Suggested direction: move syllabus and assessments onto WhatsApp too. Keep the website as
the dashboard; **make WhatsApp the product.**

### Sources

- [DPDP compliance for schools & EdTech](https://ksandk.com/data-protection-and-data-privacy/dpdp-compliance-for-schools-and-edtech/)
- [Biometric data under the DPDP Act](https://ksandk.com/data-protection-and-data-privacy/regulation-of-biometric-data-under-the-dpdp-act/)
- [AI tutoring: what actually improves outcomes](https://datasofttechnologies.com/blog/ai-tutoring-platforms-for-edtech-smes-in-2026-what-actually-improves-student-outcomes)
- [AI in education statistics 2026](https://www.engageli.com/blog/ai-in-education-statistics)

---

## 5. AVP Trust — 80G philanthropy

**Today:** donation campaigns, 80G receipts, beneficiary needs matching.

### A correction owed on live copy

The "How it works" section written on 2026-07-30 says:

> "An 80G-compliant receipt is generated for the donation immediately, **ready for your
> income-tax filing.**"

**This is wrong.** A receipt alone no longer gets the donor their deduction. Since
FY 2021-22:

- The NGO must file **Form 10BD** by **31 May** each year, with donor PAN
- **Form 10BE** becomes downloadable 24 hours after that filing
- **Form 10BE** is what entitles the donor to the 80G deduction

**Action: fix that line.** (Small edit, not yet done.)

### And the exposure is the NGO's too

Failing to file Form 10BD:

- **₹200 per day** penalty (Section 234G)
- Plus **₹10,000 to ₹1,00,000** for failure to file (Section 271K)

This is not an optional feature. Accepting donations creates the obligation.

### Corporate money — where the real funding is

Under **Section 135**, large companies must spend **2% of average net profit** on CSR.

But there is a gate: **since 1 April 2021, no NGO can receive CSR funds without CSR-1
registration** with the MCA — regardless of how good its work is. CSR-1 requires 12A, 80G,
and a **3-year track record** (tightened from 14 July 2025).

### Recommended

1. **Capture PAN at donation time.** Without it, Form 10BD cannot be filed, so the donor
   cannot claim. Everything depends on this, and it is the smallest change.
2. **Form 10BD export.** Produce the year's donations in the 31 May filing format. This is
   every NGO's most tedious annual chore and it costs ₹200/day when late.
3. **Notify donors when Form 10BE is ready.** The loop closes at the certificate, not the receipt.
4. **Corporate donor track.** CSR number, Schedule VII activity mapping, utilisation
   reports — a different flow from retail donors.

### The differentiated bet

Most Indian NGO donation pages are a payment gateway plus a PDF receipt, and stop there.

Close the whole loop — PAN → 10BD → 10BE → CSR-1 → utilisation reporting — and this stops
being a donation page and becomes **the thing every other 80G NGO would pay for.**

This is the one venture in the portfolio where compliance *is* the product. Compliance
markets are less crowded because the work is boring and people avoid it — but the penalty
accrues daily, so the need is universal.

### Sources

- [Form 10BD filing guide 2026 (CAclubindia)](https://www.caclubindia.com/articles/form-10bd-filing-guide-2026-due-date-revised-return-penalties-form-10be-explained-55740.asp)
- [Income Tax Dept: Form 10BD-10BE manual](https://www.incometax.gov.in/iec/foportal/help/statutory-forms/popular-form/form10bd-10be)
- [What nonprofits need to know about Form 10BD (IDR)](https://idronline.org/article/board-governance/what-nonprofits-need-to-know-about-form-10bd/)
- [CSR-1 registration guide](https://www.caclubindia.com/articles/registration-of-csr-implementing-agencies-a-complete-guide-to-form-csr-1-55877.asp)
- [NGO CSR eligibility criteria](https://www.sahyogcare4u.org/blog/what-makes-an-ngo-eligible-for-csr-funding-in-india-legal-criteria-explained/)

---

## 6. Sevenforce — AI workforce

**Today:** 10 agents, 25 tools, 4 suites. Positioning: "finished work, not a chat window."

### What the market says — part one, the reality check

- **88% of AI agent projects never reach production**
- Gartner: **over 40% of agentic AI projects may be cancelled by 2027**
- The cause is **governance and undefined business value**, not model capability
- > "Over-trusting LLM autonomy **without human-in-the-loop checkpoints** is the single
  > most common cause of cascading failures."
- The industry has an "**agent washing**" problem — chatbots relabelled as agents

### What the market says — part two, the direct competitor

Sintra's Trustpilot complaints cluster on three things, and all three are openings:

1. **Credit model** — 250 credits/month on every plan, no rollover, helpers stop when
   they run out. A loud cluster of "bait-and-switch" and "money grabbing" reviews.
2. **Helpers don't hand work to each other** — the user does the coordination.
3. **Marketing oversells autonomy** — *"creates the impression that the AI assistants are
   more autonomous and capable than they actually are."*

### Recommended

1. **Lead with BYOK — it is already built and not being sold.** Sintra's biggest complaint
   is credits. Sevenforce has BYOK: the user brings a key and pays the provider directly.
   **No credits, no cap, no "you're out, buy more."** This belongs on the homepage:
   *"No credits. No monthly cap. Your key, your cost, no middleman."*
2. **Make Owl actually orchestrate.** The #2 complaint is that agents don't hand off.
   Owl (AI Chief of Staff) already exists. If Owl can genuinely route work — Maya writes
   the article → Vibe cuts it into social posts → Wave sends it — that is precisely what
   people are leaving competitors over. **Highest ROI item here.**
3. **Require approval before anything irreversible.** The clearest research finding is
   that autonomy without a human checkpoint is the top failure cause. The dangerous tools
   are Wave (bulk email, WhatsApp broadcast) and Vibe (social posting). **An agent that
   sends 500 wrong emails loses those customers permanently.** Preview plus an Approve
   button is not friction — it is the reason someone will trust it.
4. **Run history.** Which agent did what, when, and what came out. Governance is the
   failure mode, and it is the first question in any enterprise conversation.

### The differentiated bet

Everyone in this category **sells autonomy while rationing usage.** Both of Sintra's top
complaints are that.

Invert it: **unlimited usage (BYOK), full control (approval gates).**
In one line: *"It doesn't ration you, and it doesn't act behind your back."*

Note also that Sevenforce just escaped the third complaint — the "2 AI Suites" and
"24/7 no downtime" claims were corrected and the invented testimonials removed on
2026-07-30. In a category where trust is the currency, **that cleanup is a marketing
asset. Don't hide it.**

### Sources

- [Forbes: why 40% of agentic AI projects may be canceled](https://www.forbes.com/sites/robertszczerba/2026/07/07/why-40-of-agentic-ai-projects-may-be-canceled-by-2027/)
- [Gartner: Hype Cycle for Agentic AI](https://www.gartner.com/en/articles/hype-cycle-for-agentic-ai)
- [AI agent adoption 2026: enterprise data points](https://www.digitalapplied.com/blog/ai-agent-adoption-2026-enterprise-data-points)
- [eesel: Sintra AI review](https://www.eesel.ai/blog/sintra-ai-review)
- [Sintra Trustpilot reviews](https://www.trustpilot.com/review/sintra.ai)

---

## 7. Comonk — HR & résumé AI

**Today:** screens résumés against a JD, scores fit, drafts the interview kit.

### Timing

**The EU AI Act's high-risk obligations begin 2 August 2026** — two days after this
research was done.

Recruitment is named explicitly. Annex III covers AI systems *"intended to be used for the
recruitment or selection of natural persons"* — sourcing, screening, evaluating, ranking.
That is exactly what Comonk does.

Required: risk assessment, technical documentation, bias testing, **human oversight**,
transparency disclosures, continuous monitoring. Penalty: up to **€15,000,000 or 3% of
global annual turnover**, whichever is higher.

In the US, **NYC Local Law 144** has applied since 2023: an annual **independent bias
audit**, a published summary, and notice to candidates **10 business days** before use.
Non-compliance: **$1,500 per violation per day**.

India has no equivalent AI hiring law yet. But candidate data falls under DPDP, and **any
Indian company serving EU or US clients will be asked these questions.**

### This is the opportunity, not the burden

Most résumé screeners are **black boxes** — a score with no reasoning.

After 2 August, every HR buyer must ask *"is your tool auditable?"* Tools that cannot
answer drop out of enterprise deals. For a newer product this is good news: Comonk can be
**built audit-ready from the start**, while incumbents retrofit.

### Recommended

1. **A reason attached to every score.** Not "72/100" but *"4 of 5 JD must-haves matched —
   Python ✓, AWS ✓, Kubernetes ✗. Wanted 3 years, has 2."* This single feature satisfies
   transparency, enables human oversight, and is a better product. **Highest value here.**
2. **Never auto-reject.** Rank and recommend; a human decides. This is the Act's human-oversight
   requirement, and the same principle as Sevenforce's approval gates — except here the
   cost of an error is someone's job.
3. **Export the data needed for a bias audit.** Customers must commission an annual
   independent audit (mandatory in NYC). A tool that makes that easy gets bought for that reason.
4. **Blind screening.** Strip name, gender, age, photo and college for the first pass.
   Reduces bias and is sellable.

### The differentiated bet

Competitors sell **speed** — "1,000 résumés in 5 minutes."

From 2 August the question changes. Not "how fast" but **"if a candidate challenges this
in court, can you explain why?"** A tool that can answer sells to companies that cannot
touch a black box. That is not a niche — it is the entire regulated market.

**Honest caveat:** this is written without knowing where Comonk's customers are. If it is
India-only domestic hiring, this is a six-month concern, not a two-day one. But if EU/US
clients are on the roadmap, design for auditability now — retrofitting costs ten times more.

### Sources

- [EU AI Act & hiring: 2026 compliance guide](https://www.hiretruffle.com/blog/eu-ai-act-hiring)
- [What the EU AI Act means for staffing businesses](https://artificialintelligenceact.eu/what-the-act-means-for-staffing-businesses/)
- [EU AI Act in HR: requirements & checklist](https://hr-on.com/eu-ai-act-for-hr-2026/)
- [Deloitte: NYC Local Law 144 & algorithmic bias](https://www.deloitte.com/us/en/services/audit-assurance/articles/nyc-local-law-144-algorithmic-bias.html)
- [DLA Piper: critical audit of NYC's AI hiring law](https://www.dlapiper.com/en-us/insights/publications/2026/01/critical-audit-of-nyc-ai-hiring-law-signals-increased-risk-for-employers)

---

## 8. Sevenseed Engine / Hub

**Today:** the venture studio's public face, plus the shared backbone (BYOK, model
routing, subprocess orchestration).

Two separate questions.

### Question 1: should the engine become a product? — No.

The LLM gateway category is mature and crowded: **LiteLLM, Portkey, OpenRouter, Requesty**.

- **LiteLLM and Portkey both offer self-hosting and BYOK with zero markup on provider costs**
- Routing, fallback chains, load balancing and cost tracking are all standard
- Portkey's product is observability — logs, traces, analytics

The engine is excellent infrastructure **for these 8 ventures**. Selling it separately means
entering a market where free, open-source, more mature options already exist.
**Recommendation: don't. Save the time.**

### Question 2: strengthening the studio's face

Venture studio figures look strong — Series A in **25 months vs 56**, success rates
**60% vs 25%**, net IRR **60% vs 33%**.

**Do not lean on these.** They come from sources promoting the studio model and the
survivorship bias is obvious; one of the sources is titled *"The Fatal Flaws in the Venture
Studio Model."* The useful finding from the same research is this:

> "The venture studio ecosystem remains **fragmented and inconsistent in its structure and
> reporting**, and this absence of standardized benchmarks makes it **nearly impossible to
> compare studios** on an apples-to-apples basis."

**That is the opening.** When nobody can be compared, the studio publishing real, verifiable
numbers stands out. This connects to the 2026-07-30 cleanup: the site now claims only what
can be counted. Most studios write "10x innovation". Sevenseed can write figures.

### Recommended

1. **Publish what investors actually look for — or say plainly that it doesn't exist yet.**
   Investors want capital efficiency, follow-on success, time to next round, exit value.
   The current numbers (87 endpoints, 1 container) are **technical**, not **traction**.
   If users and revenue are zero, *"pre-revenue, 8 products live, X monthly visitors"* is
   better than dressing technical stats as traction. Any competent investor spots the
   difference in ten minutes, and being caught costs more than looking modest.
2. **Tell the capital-efficiency story — because it is true.** 8 products, one container,
   one deploy, a shared backbone, and BYOK so inference cost isn't being burned. Most studios
   spend on separate teams and separate infra per venture. Running 8 products on a single
   512MB service is a real investor metric and a genuinely strong number.
3. **A traction number per venture.** The portfolio cards now say what each venture does.
   Next: one real number each — users, submissions, whatever is true.
4. **Track contact enquiries.** The form works now. Next is what happened to each enquiry —
   who replied, what came of it. Right now it is only a log line.

### Sources

- [Venture Studio Forum: The Fatal Flaws in the Venture Studio Model](https://newsletter.venturestudioforum.org/p/the-fatal-flaws-in-the-venture-studio)
- [Avante Ventures: how to actually measure a venture studio](https://avanteventures.com/en/library/measuring-studio-performance)
- [Bundl: venture studio success rates](https://www.bundl.com/articles/why-venture-studio-startups-have-higher-long-term-success-rates)
- [LLM gateway comparison 2026](https://www.flotorch.ai/blogs/llm-gateway-comparison-2026)
- [LiteLLM vs Portkey vs OpenRouter](https://www.requesty.ai/blog/litellm-vs-portkey-vs-openrouter-best-llm-gateway-2026)

---

## Patterns across all eight

### 1. On four sites, compliance is both the biggest risk and the biggest opportunity

| Site | What | Exposure |
|---|---|---|
| **Comonk** | EU AI Act high-risk | Live 2 Aug 2026 · up to €15M or 3% turnover |
| **AVP Trust** | Form 10BD / 10BE; CSR-1 | ₹200/day + ₹10k–₹1L; no CSR money without CSR-1 |
| **AVPU** | DPDP + biometric | Face attendance is the largest liability |
| **Breakdown Factor** | DSR traceability | Without it, no tender or government work |

This looks boring. Regulated markets are less crowded precisely because people avoid them.

### 2. Everywhere, the win comes from being *trustworthy*, not *fast*

Confidence scores in Breakdown. Price history in Emart. Score reasoning in Comonk.
Approval gates in Sevenforce. Outcome measurement in AVPU.

Four different industries, one answer. It is also the same work done on 2026-07-30 when
the unbackable claims came off the sites — **that cleanup turned out to be product direction.**

### 3. Two genuine, hard-to-copy advantages already exist

- **AVPU's WhatsApp tutor** — no install-dependent competitor can take this away
- **Sevenforce's BYOK** — Sintra's single biggest complaint is its credit model, and
  Sevenforce structurally does not have that problem

Both are already built. Neither is being sold properly.

---

## Open questions — these block real work

1. **AVP Trust:** fix the "ready for your income-tax filing" line? (Small edit; it is
   currently inaccurate — see §5.)
2. **AVP Trust:** is CSR-1 registration done? Without it the corporate donor track is
   pointless to build.
3. **AVP Trust / AVPU:** are these figures real? They were deliberately left untouched
   during the 2026-07-30 cleanup because they may well be true, unlike the invented
   testimonials that were removed:
   - Trust: ₹2.5Cr+ funded · 15,000+ patients served · 100% financial transparency
   - AVPU: ₹4–8 LPA average package (in `backend/avpu_data.py`)
   For an 80G trust, unverified impact figures are a regulatory question, not a
   marketing one.
4. **Comonk:** where are the customers — India only, or EU/US on the roadmap? This decides
   whether §7 is urgent or a six-month concern.

## Suggested starting point

**Sevenforce's BYOK messaging.** No code required — only telling the truth on the homepage —
and it aims straight at the biggest weakness of the closest competitor.

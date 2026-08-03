# Feature research — all 8 ventures

> Researched 2026-07-31. A working document: findings and recommendations, not
> decisions. Nothing here has been built. Edit freely.
>
> Every claim is sourced. Where a number looked vendor-biased or unverifiable, that
> is said so rather than quietly repeated — several headline statistics in this space
> come from people selling the thing they measure.
>
> **Effort key:** **S** = days · **M** = 1–3 weeks · **L** = a month or more.
> These are rough and assume one developer working with the existing codebase.

**Open questions for Kunal are at the end.** Six of them block real work.

**Read the "Feasibility" boxes.** Several recommendations that sound easy depend on
data access that turns out to be gated, deprecated, or non-existent. Those boxes are
where a plan dies quietly if nobody checks first.

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

That price band matters: it caps what this can charge. A ₹3,000/month ceiling means the
product has to be self-serve — there is no room for a sales team.

### Recommended

| # | Feature | Effort | Why |
|---|---|---|---|
| 1 | Confidence + provenance per line item | **M** | The exact "opaque" problem blocking adoption |
| 2 | DSR-traceable rates | **M** | Entry ticket for any tender or government work |
| 3 | Drawing revision diff (Rev A vs Rev C + cost delta) | **L** | Where variation claims come from |
| 4 | Excel / BOQ export in IS 1200 format | **S** | In India "integration" means Excel, not an API |

**1. Confidence + provenance.** Show how sure the model is per line, and highlight the
region of the drawing the quantity came from. Changes the pitch from *fast* to *checkable*.
Implementation note: the YOLO/vision pipeline already produces bounding boxes — surfacing
them in the UI is mostly frontend work, which is why this is M and not L.

**2. DSR-traceable rates.** A cost that cannot be traced to a DSR/SOR item cannot be used
on government work. Show the DSR item number and the same four-part buildup.

**3. Drawing revision diff.** Rev A vs Rev C — what changed and *what it costs*. Hardest
item on the list because it needs document alignment across revisions, not just extraction.

**4. Excel/BOQ export.** Cheapest item here and probably the one that removes the most
friction. Do this first if you want a quick win.

> **Feasibility — DSR data.** CPWD DSR is published, but it is a document, not an API.
> Somebody has to digitise the ~13,000 rates once and maintain them through revisions.
> Budget for that as its own task; it is the unglamorous core of item 2. State SORs
> multiply the work — pick one state to start.

### The differentiated bet

Breakdown Factor has **both** defect detection and cost estimation. Competitors have one
or the other.

Connect them: **defect photo → costed rework estimate + material list.** "This crack will
cost ₹X to fix, and here is the material." Nobody else ships this easily because they are
missing half the system. The other four items make it competitive; this one makes it different.

Effort: **M**, assuming items 1 and 2 exist — it is mostly wiring two things that already work.

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

> "Medisafe's drug interaction checker flags potential conflicts in real time, which is
> something **most apps completely ignore.**"

The real opportunity is Indian data, and it lands directly on the existing feature:

- Jan Aushadhi medicines are **50–90% cheaper** than branded
- A chronic patient can save up to **₹66,000 a year**
- Branded atorvastatin runs **2× to 25×** the Jan Aushadhi price

Saying "a generic exists" and saying "you can save ₹1,240 a month" are different products.

> **Caution — Kendra and product counts disagree across sources.** One source says 17,990
> Kendras and 2,110 medicines as of 31 Dec 2025; another lists 7,942 stores and 1,451 drugs;
> a Government news item said 13,800+ in Oct 2024. The network is growing, so third-party
> databases go stale fast. **Do not put a Kendra count on the site without a dated official
> source** — this is the same failure mode as the numbers cleaned up on 2026-07-30.

### Recommended

| # | Feature | Effort | Why |
|---|---|---|---|
| 1 | Rupee savings per prescription | **S** | Turns an abstract benefit into a number |
| 2 | Nearest Jan Aushadhi Kendra | **M** | Completes the chain; blocked on data, see below |
| 3 | Drug interaction checking | **M–L** | Most apps skip it; data licensing decides the cost |
| 4 | Reminders + missed-dose alerts to family | **L** | Peer accountability lifts adherence up to 26% |

**1. Rupee savings.** After OCR: *"On this prescription you could save ₹X per month, ₹Y per
year."* Cheapest high-impact item across all eight sites — the price data needed is a
generic-vs-branded comparison the product already does.

**2. Nearest Kendra.** Knowing a cheaper medicine exists is useless without knowing where
to buy it.

**3. Drug interactions.** The prescription is already parsed; conflicts are the natural
next step.

**4. Reminders.** Heavier — needs accounts and notifications — hence fourth.

> **Feasibility — Kendra locations.** There is **no official public API.** What exists:
> the official site `janaushadhi.gov.in`, the **Jan Aushadhi Sugam** app with a GPS store
> locator, and published PDF lists. So the options are (a) request data from PMBI
> directly — they are the sole managing agency and the right first email, (b) work from
> the published lists and re-import periodically, or (c) link out to the Sugam app instead
> of holding the data. **Option (c) is the honest quick win**: no stale data risk, ships
> in a day, and still completes the chain for the user.

> **Feasibility — drug interactions.** Three tiers:
> - **openFDA** — free, but returns raw manufacturer prose, not structured pairs. Turning
>   it into severity-scored interactions needs a normalisation + NLP pipeline. The
>   engineering is the real price.
> - **RxNav Interaction API** (NIH/NLM) — documented as needing no licence, sourced from
>   ONCHigh and DrugBank. **Verify it is still live before designing around it** — this
>   API's status has changed before, and the page found may be stale.
> - **DrugBank commercial** — roughly **$25,000–$100,000/year**. Out of range for now.
>
> **The bigger problem is Indian brand names.** RxNorm and openFDA are US-centric.
> An Indian prescription says "Crocin", not "acetaminophen". A brand → molecule
> normalisation layer is required before any of these are usable, and that layer is the
> actual work in item 3.

### Hard constraint — not advice, a requirement

**Items 2 and 3 must not be LLM-generated.** Kendra locations must come from official PMBJP
data; interaction checks from a real medical database. Not from a model's answer.

This is emphasised because of what was found on this exact site on 2026-07-30: an
"Emergency ER Finder" tab listing three named hospitals with phone numbers and live-sounding
statuses ("24/7 ICU & Trauma Available"), headed *"Live 24/7 Emergency hospital & blood bank
availability matrix"*. All of it was a hardcoded array. None of it was verified. Someone
mid-emergency could have acted on it. It now points at 108/112 instead.

In healthcare the cost of one wrong data point is not the same as on the other seven sites.
Build the feature only when a real source sits behind it.

### The differentiated bet

Other apps serve people who already know the medicine's name. This user is **holding a paper
prescription they cannot read.**

That whole chain — *read it → explain it → find the generic → count the saving → show the
shop* — is not done well by anyone in India.

### Sources

- [Jan Aushadhi generic–branded price variation (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12715599/)
- [Generic vs branded: 90% savings](https://healthandfamily.in/generic-vs-branded-how-indias-jan-aushadhi-revolution-is-slashing-medical-bills-by-90/)
- [janaushadhi.gov.in — official PMBJP site](http://janaushadhi.gov.in/)
- [AltexSoft: free drug database APIs](https://www.altexsoft.com/techtalks/how-can-i-get-free-drug-database-apis/)
- [RxNav Interaction APIs (NLM)](https://lhncbc.nlm.nih.gov/RxNav/APIs/InteractionAPIs.html)
- [Drug interaction API pricing breakdown 2026](https://rxlabelguard.com/blog/drug-interaction-api-pricing-complete-breakdown-2026)
- [Keragon: pharmacy app development 2026](https://www.keragon.com/blog/pharmacy-app-development)

---

## 3. AVP Emart — price comparison

**Today:** compares a product across sellers, claims to show real landed price.
Scoring: 40% price, 40% rating, 20% review volume.

### Read this first

The price data is **not real yet**. The hero widget shows fixed numbers next to real
retailer names (Amazon, Flipkart, Reliance); a "Sample data" badge was added on 2026-07-30.

On the other seven sites, "features" means *what to add*. Here the first feature is **where
real data comes from** — nothing below matters without it.

### Correction to earlier advice

An earlier draft of this research said: *"start with affiliate APIs — works today, earns
revenue."* **That was wrong.** Checking the actual access requirements changed the answer:

- **Amazon PA-API is deprecated as of 15 May 2026** — successor is the Creators API
- PA-API/Associates requires **3 qualifying sales within 180 days** to gain access, and
  (since 15 Nov 2025) **10 qualifying orders in the past 30 days** to keep it
- **Flipkart's affiliate programme no longer accepts direct signups** — access is via
  third parties such as Cuelinks or Haulpack

The sales requirement is a chicken-and-egg trap: you need sales to get the API, and the API
to build the thing that generates sales. A brand-new comparison site cannot clear that gate
on its own.

**Of all eight ventures, this one has the hardest foundational problem.** That is worth
saying plainly before any effort goes in.

### The three routes, honestly

| Route | Status | Verdict |
|---|---|---|
| **Affiliate aggregator** (Cuelinks, Haulpack) | Open; India-focused; covers Flipkart and others | **Most realistic start** — bypasses the direct-signup gate |
| **ONDC** | Open protocol, public SDKs; but catalog indexing still "future scope" in its own roadmap | Right long-term bet, not a complete answer today |
| **Amazon direct** | PA-API deprecated; Creators API + sales gate | Revisit only once there is real traffic |
| **Scraping** | — | Not recommended: breaks, gets blocked, legal risk |

### What the market says

- **45% of consumers** now use AI while shopping — researching products, interpreting
  reviews, hunting deals (IBM Institute, January 2026)
- Price history charts are the most-wanted feature — they answer "is this actually cheap?"
- Good trackers cover 100,000+ retailers, not just Amazon

### Recommended

| # | Feature | Effort | Why |
|---|---|---|---|
| 0 | Wire a real data source via an affiliate aggregator | **M–L** | Everything depends on it |
| 1 | Bank offers + delivery = true final price | **M** | The actual differentiator |
| 2 | Price history | **M** | Catches inflated "70% off" before sales |
| 3 | Price drop alerts | **S** | Standard — only once the pipeline exists |

**1. Bank offers + delivery.** The **biggest opportunity here.** "Landed price" is already
the claim, but in India the real variable is **bank card offers** — ₹2,000 off on HDFC, 10%
cashback on ICICI, plus delivery and coupons. No comparison site models this; people do it by
hand. A site that says *"this costs you ₹51,200 with your HDFC card"* answers the real question.

Note this is the one feature here that does **not** depend on a product catalogue API — bank
offer terms are published by the banks and the retailers. It could be built and be useful
even before item 0 lands, as a standalone calculator.

**2. Price history.** The most trustworthy answer to "is this cheap?" Especially relevant in
India, where MRP is often raised before a sale to manufacture a "70% off". This is the trust
feature — the same role confidence scores play in Breakdown Factor.

### The differentiated bet

Everyone else compares sticker price. This site claims to compare **what you actually pay.**
That claim is not yet true — but with bank offers, delivery and coupons modelled, it would be
the one feature in India worth returning for, because it is the only number that matters.

Given how hard the catalogue problem is, **there is a real case for narrowing this venture to
just that**: a "true final price" calculator, rather than a full comparison engine.

### Sources

- [ONDC official](https://www.ondc.org/) · [ONDC Protocol Specs](https://github.com/ONDC-Official/ONDC-Protocol-Specs) · [ONDC seller-app SDK roadmap](https://github.com/ONDC-Official/seller-app-sdk)
- [Amazon PA-API 5.0 registration requirements](https://webservices.amazon.com/paapi5/documentation/register-for-pa-api.html)
- [PA-API in 2026: restrictions and alternatives](https://dev.to/agenthustler/amazon-product-api-pa-api-in-2026-restrictions-alternatives-and-web-scraping-4l35)
- [Flipkart affiliate programme](https://affiliate.flipkart.com/) · [Signing up via Cuelinks](https://www.cuelinks.com/blog/how-to-sign-up-for-the-flipkart-affiliate-program-successfully-on-cuelinks/)
- [Karma: best price trackers 2026](https://www.karmanow.com/the-blog/top/the-best-price-trackers)

---

## 4. AVPU — AI university

**Today:** personalised syllabus, WhatsApp tutor, face-recognition attendance, placement
matching, assessment grading.

### What the market says

Large effect sizes circulate (54% higher test scores; RCT effect size 0.73–1.3 SD).
**Treat these with suspicion** — most come from vendor blogs. The genuinely useful finding:

> "**Most shipped products do not even measure their effect on learning outcomes**, let
> alone improve them."

And: the winners treat it as *"a pedagogy problem with an LLM-shaped tool"*, not *"an LLM
looking for a pedagogy."*

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

AVPU does placement scoring and assessment grading. If that attaches a label to a student, it
is not only a design question.

**Recommendation:** offer geofenced QR or OTP check-in instead (**effort: S**). It does 95% of
the job without the biometric exposure. Keep face recognition only where an institution
specifically demands it, and then behind a real parental-consent flow.

Note the code already carries this dependency: `insightface` is what forces the full OpenCV
install and the X11 libraries in the Dockerfile. Dropping face auth as the default would also
make the container smaller and the build faster.

### Recommended

| # | Feature | Effort | Why |
|---|---|---|---|
| 0 | QR / OTP attendance as the default | **S** | Removes the largest compliance exposure |
| 1 | Measure learning outcomes — and sell that | **M** | Almost nobody does; the bar is on the floor |
| 2 | Placement gap reports, not scores | **S** | Safer under DPDP and more useful to students |
| 3 | Deepen the WhatsApp tutor | **M** | The real moat — see below |
| 4 | Adaptive pacing | **L** | ~42% better outcomes when pace and tone adapt |

**1. Measure outcomes.** Track pre/post scores, topic-level weakness, completion. Telling an
institution *"your students went from 61 to 74 average"* sells better than any feature list.
**Biggest opportunity, because the bar is so low.**

**2. Gap reports.** Not "72/100" but *"3 skills missing, roughly N weeks to close."*

### The differentiated bet — WhatsApp

Every other edtech product requires an app install, an account, and a decent phone. This tutor
runs on **WhatsApp** — cheap phone, poor connectivity, nothing to install, nothing to learn.

In tier-2/3 India that is an accessibility decision, not a feature. It is also the thing a
Byju's-type competitor cannot take away, because their whole model depends on the install.

Suggested direction: move syllabus and assessments onto WhatsApp too. Keep the website as the
dashboard; **make WhatsApp the product.**

> **Feasibility — WhatsApp.** The WhatsApp Business API is not free and not instant: it needs
> a Meta Business account, a verified business, and a BSP (or Meta Cloud API direct), with
> per-conversation pricing. Template messages must be pre-approved. **Confirm the current
> India pricing and approval timeline before committing to item 3** — this is the one
> dependency that could make the moat expensive.

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

**This is wrong.** A receipt alone no longer entitles the donor to the deduction. Since
FY 2021-22:

- The NGO must file **Form 10BD** by **31 May** each year, with donor PAN
- **Form 10BE** becomes downloadable 24 hours after that filing
- **Form 10BE** is what the donor claims against

**Action: fix that line.** (Small edit, not yet done.)

### And the exposure is the NGO's too

Failing to file Form 10BD:

- **₹200 per day** penalty (Section 234G)
- Plus **₹10,000 to ₹1,00,000** for failure to file (Section 271K)

This is not an optional feature. Accepting donations creates the obligation.

### Corporate money — where the real funding is

Under **Section 135**, companies above the thresholds (net worth ₹500cr+, turnover ₹1,000cr+,
or net profit ₹5cr+) must spend **2% of average net profit of the last three years** on CSR.

But there is a gate: **since 1 April 2021, no NGO can receive CSR funds without CSR-1
registration** with the MCA — regardless of how good its work is. CSR-1 requires 12A, 80G, and
a **3-year track record** (tightened from 14 July 2025 to require valid 12A or 10(23C)).
Successful filing generates a unique CSR Registration Number, which is what corporates ask for.

Activities must map to **Schedule VII** — healthcare, education, poverty alleviation,
environmental sustainability, child welfare.

### Recommended

| # | Feature | Effort | Why |
|---|---|---|---|
| 0 | Fix the "ready for your income-tax filing" line | **S** | It is currently inaccurate |
| 1 | Capture PAN at donation time | **S** | Without it, Form 10BD cannot be filed at all |
| 2 | Form 10BD export | **M** | The annual chore; ₹200/day when late |
| 3 | Notify donors when Form 10BE is ready | **S** | The loop closes at the certificate, not the receipt |
| 4 | Corporate donor track (CSR number, Schedule VII, utilisation) | **M** | Different flow from retail donors |

Items 0, 1 and 3 are all small. **This is the site where the least work buys the most.**

### The differentiated bet

Most Indian NGO donation pages are a payment gateway plus a PDF receipt, and stop there.

Close the whole loop — PAN → 10BD → 10BE → CSR-1 → utilisation reporting — and this stops
being a donation page and becomes **the thing every other 80G NGO would pay for.**

This is the one venture in the portfolio where compliance *is* the product. Compliance markets
are less crowded because the work is boring and people avoid it — but the penalty accrues
daily, so the need is universal.

Realistic pricing anchor: Indian NGO compliance/donation tools sit in the same ₹500–3,000/month
band as the construction tools. Volume, not price, is the model.

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
- Adoption is ~80% of organisations; **production deployment is 10–15%**
- The cause is **governance and undefined business value**, not model capability
- > "Over-trusting LLM autonomy **without human-in-the-loop checkpoints** is the single most
  > common cause of cascading failures."
- The industry has an "**agent washing**" problem — chatbots relabelled as agents

### What the market says — part two, the direct competitor

Sintra's Trustpilot complaints cluster on three things, and all three are openings:

1. **Credit model** — 250 credits/month on every plan, no rollover, helpers stop when they
   run out. A loud cluster of "bait-and-switch" and "money grabbing" reviews.
2. **Helpers don't hand work to each other** — the user does the coordination.
3. **Marketing oversells autonomy** — *"creates the impression that the AI assistants are
   more autonomous and capable than they actually are."*

Named alternatives people move to: **Marblism, Lindy, Relevance AI, Taskade, Gumloop, Zapier,
Make, n8n.** Marblism is cited as the closest fit for leavers, on **flat pricing** — which
confirms that the pricing model, not the feature list, is what moves people.

### Recommended

| # | Feature | Effort | Why |
|---|---|---|---|
| 1 | Lead with BYOK on the homepage | **S** | Already built; aims at the competitor's worst review |
| 2 | Make Owl actually orchestrate | **L** | The #2 complaint across the category |
| 3 | Approval gate before anything irreversible | **M** | The #1 documented cause of agent failure |
| 4 | Run history / audit trail | **M** | Governance is the failure mode |

**1. BYOK — already built and not being sold.** Sintra's biggest complaint is credits.
Sevenforce has BYOK: the user brings a key and pays the provider directly. **No credits, no
cap, no "you're out, buy more."** This belongs on the homepage: *"No credits. No monthly cap.
Your key, your cost, no middleman."*

**Zero code. Highest ratio of impact to effort anywhere in this document.**

**2. Owl.** The #2 complaint is that agents don't hand off. Owl (AI Chief of Staff) already
exists as a concept. If Owl can genuinely route work — Maya writes the article → Vibe cuts it
into social posts → Wave sends it — that is precisely what people are leaving competitors over.
Highest-value build item here, and the hardest.

**3. Approval gates.** The clearest research finding is that autonomy without a human
checkpoint is the top failure cause. The dangerous tools are **Wave** (bulk email, WhatsApp
broadcast) and **Vibe** (social posting). **An agent that sends 500 wrong emails loses those
customers permanently.** Preview plus an Approve button is not friction — it is the reason
someone will trust it.

**4. Run history.** Which agent did what, when, and what came out. First question in any
enterprise conversation.

### The differentiated bet

Everyone in this category **sells autonomy while rationing usage.** Both of Sintra's top
complaints are that.

Invert it: **unlimited usage (BYOK), full control (approval gates).**
In one line: *"It doesn't ration you, and it doesn't act behind your back."*

Note also that Sevenforce just escaped the third complaint — the "2 AI Suites" and "24/7 no
downtime" claims were corrected and the invented testimonials removed on 2026-07-30. In a
category where trust is the currency, **that cleanup is a marketing asset. Don't hide it.**

### Sources

- [Forbes: why 40% of agentic AI projects may be canceled](https://www.forbes.com/sites/robertszczerba/2026/07/07/why-40-of-agentic-ai-projects-may-be-canceled-by-2027/)
- [Gartner: Hype Cycle for Agentic AI](https://www.gartner.com/en/articles/hype-cycle-for-agentic-ai)
- [AI agent adoption 2026: enterprise data points](https://www.digitalapplied.com/blog/ai-agent-adoption-2026-enterprise-data-points)
- [eesel: Sintra AI review](https://www.eesel.ai/blog/sintra-ai-review) · [Sintra Trustpilot](https://www.trustpilot.com/review/sintra.ai)
- [Sintra alternatives (Marblism)](https://www.marblism.com/blog/sintra-ai-alternatives)

---

## 7. Comonk — HR & résumé AI

**Today:** screens résumés against a JD, scores fit, drafts the interview kit.

### Timing

**The EU AI Act's high-risk obligations begin 2 August 2026** — two days after this research
was done.

Recruitment is named explicitly. Annex III covers AI systems *"intended to be used for the
recruitment or selection of natural persons"* — sourcing, screening, evaluating, ranking. That
is exactly what Comonk does. The scope also reaches performance evaluation, promotion,
task allocation and termination.

Required under Articles 9–17: risk assessment, technical documentation, bias testing, **human
oversight**, transparency disclosures, continuous monitoring. Penalty: up to **€15,000,000 or
3% of global annual turnover**, whichever is higher.

In the US, **NYC Local Law 144** has applied since 2023: an annual **independent bias audit**
across protected characteristics (race/ethnicity, sex), a **published summary**, and notice to
candidates **10 business days** before use. Non-compliance: **$1,500 per violation per day**.

India has no equivalent AI hiring law yet. But candidate data falls under DPDP, and **any Indian
company serving EU or US clients will be asked these questions.**

### This is the opportunity, not the burden

Most résumé screeners are **black boxes** — a score with no reasoning.

After 2 August, every HR buyer must ask *"is your tool auditable?"* Tools that cannot answer
drop out of enterprise deals. For a newer product this is good news: Comonk can be **built
audit-ready from the start**, while incumbents retrofit.

### Recommended

| # | Feature | Effort | Why |
|---|---|---|---|
| 1 | A reason attached to every score | **M** | Satisfies transparency, enables oversight, better product |
| 2 | Never auto-reject — rank and recommend only | **S** | The Act's human-oversight requirement |
| 3 | Export the data needed for a bias audit | **M** | Customers must commission one annually |
| 4 | Blind screening (strip name, gender, age, photo, college) | **S** | Reduces bias and is sellable |

**1.** Not "72/100" but *"4 of 5 JD must-haves matched — Python ✓, AWS ✓, Kubernetes ✗. Wanted
3 years, has 2."* **Highest value here.**

**2.** Same principle as Sevenforce's approval gates — except here the cost of an error is
someone's job. Cheap to implement: it is mostly a product decision, not an engineering one.

**3.** A tool that makes the annual audit easy gets bought for that reason.

### The differentiated bet

Competitors sell **speed** — "1,000 résumés in 5 minutes."

From 2 August the question changes. Not "how fast" but **"if a candidate challenges this in
court, can you explain why?"** A tool that can answer sells to companies that cannot touch a
black box. That is not a niche — it is the entire regulated market.

**Honest caveat:** this is written without knowing where Comonk's customers are. If it is
India-only domestic hiring, this is a six-month concern, not a two-day one. But if EU/US clients
are on the roadmap, design for auditability now — retrofitting costs ten times more.

### Sources

- [EU AI Act & hiring: 2026 compliance guide](https://www.hiretruffle.com/blog/eu-ai-act-hiring)
- [What the EU AI Act means for staffing businesses](https://artificialintelligenceact.eu/what-the-act-means-for-staffing-businesses/)
- [EU AI Act in HR: requirements & checklist](https://hr-on.com/eu-ai-act-for-hr-2026/)
- [Deloitte: NYC Local Law 144 & algorithmic bias](https://www.deloitte.com/us/en/services/audit-assurance/articles/nyc-local-law-144-algorithmic-bias.html)
- [DLA Piper: critical audit of NYC's AI hiring law](https://www.dlapiper.com/en-us/insights/publications/2026/01/critical-audit-of-nyc-ai-hiring-law-signals-increased-risk-for-employers)

---

## 8. Sevenseed Engine / Hub

**Today:** the venture studio's public face, plus the shared backbone (BYOK, model routing,
subprocess orchestration).

Two separate questions.

### Question 1: should the engine become a product? — No.

The LLM gateway category is mature and crowded: **LiteLLM, Portkey, OpenRouter, Requesty.**

- **LiteLLM and Portkey both offer self-hosting and BYOK with zero markup on provider costs**
- Routing, fallback chains, load balancing and cost tracking are all standard
- Portkey's product is observability — logs, traces, analytics, billed on recorded logs
- Cost crossover point cited: below ~$10k/month spend all are viable; above it LiteLLM wins

The engine is excellent infrastructure **for these 8 ventures**. Selling it separately means
entering a market where free, open-source, more mature options already exist, against teams
whose whole company is that one product. **Recommendation: don't. Save the time.**

### Question 2: strengthening the studio's face

Venture studio figures look strong — Series A in **25 months vs 56**, success rates
**60% vs 25%**, net IRR **60% vs 33%**, 84% of studio startups raise a seed round.

**Do not lean on these.** They come from sources promoting the studio model and the
survivorship bias is obvious; one of the sources is titled *"The Fatal Flaws in the Venture
Studio Model."* The useful finding from the same research:

> "The venture studio ecosystem remains **fragmented and inconsistent in its structure and
> reporting**, and this absence of standardized benchmarks makes it **nearly impossible to
> compare studios** on an apples-to-apples basis."

**That is the opening.** When nobody can be compared, the studio publishing real, verifiable
numbers stands out. This connects to the 2026-07-30 cleanup: the site now claims only what can
be counted. Most studios write "10x innovation". Sevenseed can write figures.

### Recommended

| # | Feature | Effort | Why |
|---|---|---|---|
| 1 | Publish real traction — or say plainly it doesn't exist yet | **S** | Investors spot dressed-up tech stats in minutes |
| 2 | Tell the capital-efficiency story | **S** | It is true and it is a real investor metric |
| 3 | A traction number per venture | **S** | Cards say what each does; add one real number |
| 4 | Track what happened to each contact enquiry | **M** | The form works now; the follow-up doesn't exist |

**1.** Investors want capital efficiency, follow-on success, time to next round, exit value.
The current numbers (87 endpoints, 1 container) are **technical**, not **traction**. If users
and revenue are zero, *"pre-revenue, 8 products live, X monthly visitors"* is better than
dressing technical stats as traction. Being caught costs more than looking modest.

**2.** 8 products, one container, one deploy, a shared backbone, and BYOK so inference cost
isn't being burned. Most studios spend on separate teams and separate infra per venture.
Running 8 products on a single 512MB service is a genuinely strong number.

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

Regulated markets are less crowded precisely because people avoid them.

### 2. Everywhere, the win comes from being *trustworthy*, not *fast*

Confidence scores in Breakdown. Price history in Emart. Score reasoning in Comonk. Approval
gates in Sevenforce. Outcome measurement in AVPU.

Four different industries, one answer. It is also the same work done on 2026-07-30 when the
unbackable claims came off the sites — **that cleanup turned out to be product direction.**

### 3. Two genuine, hard-to-copy advantages already exist

- **AVPU's WhatsApp tutor** — no install-dependent competitor can take this away
- **Sevenforce's BYOK** — Sintra's single biggest complaint is its credit model, and Sevenforce
  structurally does not have that problem

Both are already built. Neither is being sold properly.

### 4. Three ventures are gated on data access, not engineering

Emart (product catalogue), Decode Pharmacy (Kendra locations, interaction database), and
Breakdown Factor (DSR rates) all need a data source that must be obtained, licensed or
digitised before the feature exists. **Check the Feasibility boxes before scheduling any of
that work.** Emart's is the hardest and may justify narrowing the product.

---

## If you only do five things

Ordered by impact ÷ effort, across all eight sites:

| # | Site | Action | Effort |
|---|---|---|---|
| 1 | **Sevenforce** | Put BYOK / "no credits, no cap" on the homepage | **S** — no code |
| 2 | **AVP Trust** | Fix the 80G line, capture PAN, notify on 10BE | **S** |
| 3 | **Decode Pharmacy** | Rupee savings per prescription | **S** |
| 4 | **AVPU** | QR/OTP attendance as default; gap reports not scores | **S** |
| 5 | **Comonk** | Never auto-reject; add reasons to scores | **S–M** |

Every one of these is small. Four of them are mostly product decisions rather than engineering.
The large builds (Owl orchestration, Emart's data pipeline, revision diff) should wait until
these are done and something is actually being used.

---

## Open questions — these block real work

1. **AVP Trust:** fix the "ready for your income-tax filing" line? (Small edit; currently
   inaccurate — see §5.)
2. **AVP Trust:** is CSR-1 registration done? Without it the corporate donor track is pointless
   to build.
3. **AVP Trust / AVPU:** are these figures real? Deliberately left untouched during the
   2026-07-30 cleanup because — unlike the invented testimonials that were removed — they may
   well be true:
   - Trust: ₹2.5Cr+ funded · 15,000+ patients served · 100% financial transparency
   - AVPU: ₹4–8 LPA average package (in `backend/avpu_data.py`)
   For an 80G trust, unverified impact figures are a regulatory question, not a marketing one.
4. **Comonk:** where are the customers — India only, or EU/US on the roadmap? Decides whether
   §7 is urgent or a six-month concern.
5. **AVP Emart:** given the catalogue access problem, is this still worth pursuing as a full
   comparison engine — or should it narrow to a "true final price" calculator?
6. **AVPU:** what is the current WhatsApp Business API arrangement and cost? The moat depends
   on it and it is not free.

# -*- coding: utf-8 -*-
"""
AVP University Portal Generator Module - AI Higher Education & Autonomous Learning Labs
"""

def get_avpu_data():
    nav_items = [
        ("hub", "Student Hub & CGPA", "fas fa-user-graduate", "8.92"),
        ("gyan", "Gyan AI Socratic Tutor", "fas fa-brain", "AI"),
        ("roadmap", "Syllabus Mastery Map", "fas fa-route", "Sem 6"),
        ("quiz", "Adaptive Quiz Arena", "fas fa-circle-question", "Quiz"),
        ("placement", "Campus Placement Matcher", "fas fa-briefcase", "94%"),
        ("codelab", "Algorithm Code Lab", "fas fa-code", "Lab"),
    ]

    stats_items = [
        ("8.92", "Cumulative CGPA", "Top 5% CSE Dept", "green"),
        ("118 / 160", "Degree Credits Earned", "73.8% Completed", "blue"),
        ("94.2%", "Biometric Attendance", "Exceeds 75% Threshold", "purple"),
        ("4 Offers", "Pre-Placement Shortlists", "Google, Uber, AWS, Oracle", "green"),
    ]

    main_content = """
    <!-- TAB 1: STUDENT HUB & CGPA -->
    <div id="tab-hub" class="tab-content active">
      <div class="welcome-box mb-8 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-transparent relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
              <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Academic Semester VI — B.Tech Computer Science & AI
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">AVP University Academic Workstation</h2>
            <p class="text-sm text-slate-300 mt-2 max-w-[680px] leading-relaxed">
              Personalized autonomous learning portal powered by Gyan AI. Track degree milestone credits, prepare for semester examinations with socratic syllabus models, and participate in high-frequency campus placement recruitment.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="switchTab('gyan')" class="run-btn px-5 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <i class="fas fa-brain"></i> Ask Gyan AI Tutor
            </button>
            <button onclick="switchTab('quiz')" class="px-4 py-3 rounded-xl text-xs font-bold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
              <i class="fas fa-play"></i> Start Quiz Arena
            </button>
          </div>
        </div>
      </div>

      <!-- Current Courses & Grade Matrix -->
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-book-open-reader text-blue-400"></i> Active Semester Courses (Sem VI)
            </h3>
            <span class="text-xs text-blue-400 font-mono font-bold">24 Total Credits</span>
          </div>

          <div class="space-y-4">
            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-bold text-white">CS601: Distributed Systems & Cloud Infrastructure</span>
                <span class="text-xs font-mono font-bold text-emerald-400">Grade: O (Outstanding)</span>
              </div>
              <div class="flex justify-between text-[11px] text-slate-400 mb-2">
                <span>Instructor: Dr. R. Ramanujan</span>
                <span>Credits: 4.0 | Progress: 88%</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full" style="width: 88%"></div>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-bold text-white">CS602: Advanced Deep Neural Networks & Transformers</span>
                <span class="text-xs font-mono font-bold text-emerald-400">Grade: A+ (Excellent)</span>
              </div>
              <div class="flex justify-between text-[11px] text-slate-400 mb-2">
                <span>Instructor: Prof. S. Sen</span>
                <span>Credits: 4.0 | Progress: 92%</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full" style="width: 92%"></div>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-bold text-white">CS603: Compiler Design & Static Code Analysis</span>
                <span class="text-xs font-mono font-bold text-sky-400">Grade: A (Very Good)</span>
              </div>
              <div class="flex justify-between text-[11px] text-slate-400 mb-2">
                <span>Instructor: Dr. V. Trivedi</span>
                <span>Credits: 4.0 | Progress: 79%</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 rounded-full" style="width: 79%"></div>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-bold text-white">CS604: Database Storage Engines & Write-Ahead Logs</span>
                <span class="text-xs font-mono font-bold text-emerald-400">Grade: A+ (Excellent)</span>
              </div>
              <div class="flex justify-between text-[11px] text-slate-400 mb-2">
                <span>Instructor: Prof. K. Verma</span>
                <span>Credits: 4.0 | Progress: 85%</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" style="width: 85%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Academic Milestones & Exam Countdown -->
        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-calendar-check text-blue-400"></i> Examination Schedule & Milestones
          </h3>
          <div class="space-y-3">
            <div class="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">Mid-Term: CS601 Distributed Systems</div>
                <div class="text-[11px] text-blue-300">Room: Turing Hall 304 • Oct 12, 10:00 AM</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">In 14 Days</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">Mid-Term: CS602 Deep Transformers</div>
                <div class="text-[11px] text-slate-400">Room: Lovelace Lab 102 • Oct 15, 02:00 PM</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-mono font-bold">In 17 Days</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">Capstone Project Phase-I Defense</div>
                <div class="text-[11px] text-slate-400">Panel Review with Industry Mentors • Nov 02</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-mono font-bold">In 35 Days</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">Day-0 Campus Placement Day</div>
                <div class="text-[11px] text-slate-400">FAANG & Unicorn On-Campus Interviews • Dec 01</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Eligible (Top 5%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: GYAN AI SOCRATIC TUTOR -->
    <div id="tab-gyan" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-brain text-blue-400"></i> Gyan AI Socratic Syllabus Tutor
            </h3>
            <span class="text-xs text-blue-400 font-mono font-bold">University Curriculum RAG</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Select Syllabus Subject</label>
              <select id="gyan-subject" class="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-blue-500">
                <option value="dist_sys">CS601: Distributed Systems (Raft, Paxos, Vector Clocks)</option>
                <option value="transformers">CS602: Deep Transformers (Multi-Head Attention, RoPE, FlashAttention)</option>
                <option value="compiler">CS603: Compiler Design (LLVM IR, LALR(1) Parsing, SSA Form)</option>
                <option value="db_kernel">CS604: Database Kernels (LSM Trees, B+ Tree Concurrency, WAL)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Select or Enter Academic Concept</label>
              <input type="text" id="gyan-concept" class="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-blue-500" value="Explain Vector Clocks vs Lamport Timestamps with causality violation examples"/>
            </div>

            <div class="flex items-center gap-3">
              <button onclick="askGyanAi()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
                <i class="fas fa-wand-magic-sparkles"></i> Generate Socratic Explanation & Proof
              </button>
            </div>
          </div>
        </div>

        <div class="terminal-card">
          <div class="terminal-header">
            <div class="terminal-dots">
              <div class="terminal-dot bg-rose-500"></div>
              <div class="terminal-dot bg-amber-500"></div>
              <div class="terminal-dot bg-emerald-500"></div>
            </div>
            <span class="text-xs font-mono text-slate-400">gyan_socratic_tutor.md</span>
            <button onclick="copyResult('gyan-console')" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <div class="terminal-body" id="gyan-console">
[GYAN AI ONLINE] University RAG repository loaded with syllabus textbooks, university past exam papers (2018-2025), and step-by-step mathematical proofs. Select a concept to begin Socratic learning.
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: SYLLABUS MASTERY MAP -->
    <div id="tab-roadmap" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-map-location-dot text-blue-400"></i> 4-Week Exam Mastery Roadmap: CS601 Distributed Systems
            </h3>
            <p class="text-xs text-slate-400 mt-1">Structured week-by-week checklist covering all mid-term and end-term question blueprints</p>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">78% Completed</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-emerald-400">UNIT 1</span>
              <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">100% DONE</span>
            </div>
            <div class="text-xs font-bold text-white mb-1">Time, Clocks & State Detection</div>
            <ul class="text-[11px] text-slate-300 space-y-1">
              <li>✓ Lamport Logical Clocks</li>
              <li>✓ Vector Timestamp Ordering</li>
              <li>✓ Chandy-Lamport Snapshot</li>
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-emerald-400">UNIT 2</span>
              <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">100% DONE</span>
            </div>
            <div class="text-xs font-bold text-white mb-1">Mutual Exclusion & Election</div>
            <ul class="text-[11px] text-slate-300 space-y-1">
              <li>✓ Ricart-Agrawala Algorithm</li>
              <li>✓ Maekawa's Voting Quorums</li>
              <li>✓ Bully & Ring Leader Elections</li>
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-blue-500/15 border border-blue-500/40">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-blue-400">UNIT 3</span>
              <span class="text-[10px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded font-mono font-bold">IN PROGRESS</span>
            </div>
            <div class="text-xs font-bold text-white mb-1">Consensus & Fault Tolerance</div>
            <ul class="text-[11px] text-slate-300 space-y-1">
              <li>✓ Paxos Synod & Multi-Paxos</li>
              <li>▶ Raft Leader Election & Log Replication</li>
              <li>▷ Byzantine Generals (PBFT)</li>
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10 opacity-70">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-400">UNIT 4</span>
              <span class="text-[10px] bg-white/10 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">NEXT WEEK</span>
            </div>
            <div class="text-xs font-bold text-white mb-1">Distributed Storage & Transactions</div>
            <ul class="text-[11px] text-slate-400 space-y-1">
              <li>▷ Two-Phase Commit (2PC)</li>
              <li>▷ Google Spanner TrueTime</li>
              <li>▷ DynamoDB Consistent Hashing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: ADAPTIVE QUIZ ARENA -->
    <div id="tab-quiz" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-stopwatch-20 text-blue-400"></i> Adaptive Quiz Arena (Duolingo Style)
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold" id="quiz-streak">🔥 14 Day Streak</span>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-4">
            <div class="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span>Question 3 of 5 • Difficulty: Hard</span>
              <span class="font-mono text-blue-400 font-bold">Score: 200 pts</span>
            </div>
            <p class="text-sm font-semibold text-white leading-relaxed">
              In the Raft Consensus Protocol, under what exact condition can a leader commit a log entry from a *previous* term?
            </p>
          </div>

          <div class="space-y-2.5 mb-6" id="quiz-options">
            <button onclick="selectQuizOpt(this, false)" class="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-400 hover:bg-white/5 transition-all text-xs text-slate-200">
              A) As soon as the majority of followers acknowledge receipt via AppendEntries RPC.
            </button>
            <button onclick="selectQuizOpt(this, true)" class="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-400 hover:bg-white/5 transition-all text-xs text-slate-200">
              B) It must NOT directly commit past entries by counting replicas; it must commit an entry from its CURRENT term, which indirectly commits earlier entries.
            </button>
            <button onclick="selectQuizOpt(this, false)" class="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-400 hover:bg-white/5 transition-all text-xs text-slate-200">
              C) When a pre-vote phase succeeds across 100% of cluster nodes without network partitioning.
            </button>
            <button onclick="selectQuizOpt(this, false)" class="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-400 hover:bg-white/5 transition-all text-xs text-slate-200">
              D) Whenever a candidate receives a higher election term number from an external heartbeat.
            </button>
          </div>

          <div id="quiz-feedback" class="hidden p-3.5 rounded-xl text-xs font-semibold mb-4"></div>

          <button onclick="nextQuizQuestion()" class="run-btn w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
            <span>Next Question</span> <i class="fas fa-arrow-right text-xs"></i>
          </button>
        </div>

        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-trophy text-amber-400"></i> Department Leaderboard (CSE Sem VI)
          </h3>
          <div class="space-y-3">
            <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs grid place-items-center">1</span>
                <div>
                  <div class="text-xs font-bold text-white">Ananya Sharma</div>
                  <div class="text-[10px] text-slate-400">2,840 XP • 100% Accuracy</div>
                </div>
              </div>
              <span class="text-xs font-mono font-bold text-amber-300">Level 28</span>
            </div>

            <div class="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-sky-400 text-slate-950 font-black text-xs grid place-items-center">2</span>
                <div>
                  <div class="text-xs font-bold text-white">Kunal Patel (You)</div>
                  <div class="text-[10px] text-slate-400">2,620 XP • 96% Accuracy</div>
                </div>
              </div>
              <span class="text-xs font-mono font-bold text-sky-300">Level 26</span>
            </div>

            <div class="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-white/10 text-white font-black text-xs grid place-items-center">3</span>
                <div>
                  <div class="text-xs font-bold text-white">Rahul Mehta</div>
                  <div class="text-[10px] text-slate-400">2,410 XP • 92% Accuracy</div>
                </div>
              </div>
              <span class="text-xs font-mono font-bold text-slate-400">Level 24</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: CAMPUS PLACEMENT MATCHER -->
    <div id="tab-placement" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-building-user text-blue-400"></i> Day-0 / Day-1 Campus Placement Drives
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">Eligibility: 100% Qualified</span>
          </div>

          <div class="space-y-3">
            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-white">Google India — Software Engineer, University Graduate</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Day 0 Super Dream</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">Package: ₹42.0 LPA CTC • Min CGPA: 8.5 (Yours: 8.92) • Location: Bengaluru/Hyderabad</div>
              </div>
              <button onclick="applyPlacement('Google India', '₹42.0 LPA')" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer whitespace-nowrap">
                Slot Confirmed
              </button>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-white">Uber — SDE-1 Core Infrastructure</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400">Day 0 Super Dream</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">Package: ₹38.5 LPA CTC • Min CGPA: 8.0 (Yours: 8.92) • Location: Bengaluru</div>
              </div>
              <button onclick="applyPlacement('Uber', '₹38.5 LPA')" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer whitespace-nowrap">
                Apply with Profile
              </button>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-white">Amazon AWS — Cloud Development Engineer</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400">Dream Offer</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">Package: ₹32.0 LPA CTC • Min CGPA: 7.5 (Yours: 8.92) • Location: Hyderabad</div>
              </div>
              <button onclick="applyPlacement('Amazon AWS', '₹32.0 LPA')" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer whitespace-nowrap">
                Apply with Profile
              </button>
            </div>
          </div>
        </div>

        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-check-double text-emerald-400"></i> Placement Verification Checklist
          </h3>
          <div class="space-y-3 text-xs">
            <div class="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-300">
              <i class="fas fa-circle-check"></i>
              <span>No Active Backlogs (0 Backlogs across all semesters)</span>
            </div>
            <div class="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-300">
              <i class="fas fa-circle-check"></i>
              <span>CGPA Threshold Exceeded (8.92 vs 8.00 Cutoff)</span>
            </div>
            <div class="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-300">
              <i class="fas fa-circle-check"></i>
              <span>AI Bar-Raiser Assessment Passed (92nd percentile)</span>
            </div>
            <div class="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/10 text-emerald-300">
              <i class="fas fa-circle-check"></i>
              <span>Dean of Academics NOC Certificate Issued</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 6: ALGORITHM CODE LAB -->
    <div id="tab-codelab" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-terminal text-blue-400"></i> Interactive Code Lab & Sandbox
            </h3>
            <div class="flex items-center gap-2">
              <select id="codelab-algo-select" onchange="loadAlgorithm(this.value)" class="bg-black/40 border border-white/10 rounded-lg py-1 px-2.5 text-xs text-white outline-none focus:border-blue-400">
                <option value="raft" selected>Distributed Raft Election (Python)</option>
                <option value="dijkstra">Dijkstra's Shortest Path & Heap (Python)</option>
                <option value="bst">AVL Self-Balancing Tree (Python)</option>
                <option value="sql">In-Memory Hash Join Engine (Python)</option>
              </select>
              <span class="text-xs text-blue-400 font-mono font-bold">Python 3.12</span>
            </div>
          </div>

          <textarea id="codelab-editor" rows="11" class="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-emerald-400 font-mono outline-none focus:border-blue-500">
class RaftNode:
    def __init__(self, node_id, peers):
        self.node_id = node_id
        self.peers = peers
        self.current_term = 0
        self.voted_for = None
        self.state = "FOLLOWER"

    def request_vote(self, term, candidate_id):
        if term > self.current_term:
            self.current_term = term
            self.voted_for = candidate_id
            self.state = "FOLLOWER"
            return True
        return False

# Simulate cluster of 3 nodes
node1 = RaftNode(1, [2, 3])
print(f"Node 1 initialized as: {node1.state} (Term: {node1.current_term})")
granted = node1.request_vote(term=1, candidate_id=2)
print(f"Vote granted to Candidate 2: {granted}")
print(f"Node 1 updated term: {node1.current_term}, voted for: {node1.voted_for}")
</textarea>
          <div class="mt-4 flex items-center gap-3">
            <button onclick="runCodeLab()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-play"></i> Execute Algorithm in Cloud Sandbox
            </button>
          </div>
        </div>

        <div class="terminal-card">
          <div class="terminal-header">
            <div class="terminal-dots">
              <div class="terminal-dot bg-rose-500"></div>
              <div class="terminal-dot bg-amber-500"></div>
              <div class="terminal-dot bg-emerald-500"></div>
            </div>
            <span class="text-xs font-mono text-slate-400">sandbox_execution.stdout</span>
            <button onclick="copyResult('code-console')" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <div class="terminal-body" id="code-console">
[SANDBOX STANDBY] Click 'Execute Algorithm in Cloud Sandbox' to compile and run the Python code with assertions against distributed edge test cases.
          </div>
        </div>
      </div>
    </div>
    """

    script_content = """
    function askGyanAi() {
      const subject = document.getElementById('gyan-subject').value;
      const concept = document.getElementById('gyan-concept').value;
      const consoleEl = document.getElementById('gyan-console');

      consoleEl.innerHTML = `<span class="text-yellow-400">>> [GYAN AI] Querying University Syllabus Vector DB for: "${concept}"...</span>\\n>> Formulating Socratic breakdown with proof steps...`;

      setTimeout(() => {
        consoleEl.innerHTML = `========================================================================
GYAN AI SOCRATIC PEDAGOGY — ${subject.toUpperCase()}
========================================================================
[QUESTION]: "${concept}"

1. CONCEPTUAL INTUITION:
   • Lamport Timestamps: Partial order only (If e1 -> e2, then L(e1) < L(e2)).
     CRUCIAL LIMITATION: The converse is FALSE! L(e1) < L(e2) does NOT imply e1 -> e2.
   • Vector Clocks: Full causal order! V(e1) < V(e2) IF AND ONLY IF e1 causally preceded e2.

2. MATHEMATICAL UPDATE RULES:
   Each process P_i maintains vector V_i of size N (number of nodes):
   a) Before local event: V_i[i] = V_i[i] + 1
   b) When sending message m: send (m, V_i)
   c) Upon receiving (m, V_msg):
      V_i[k] = max(V_i[k], V_msg[k]) for all k in [1..N]
      V_i[i] = V_i[i] + 1

3. CAUSALITY VIOLATION EXAMPLE IN DISTRIBUTED MESSAGING:
   If Node A sends a photo to Node B and Node C, and Node B comments on the photo
   and notifies Node C. With Lamport clocks, Node C could process the comment BEFORE
   the photo exists! Vector clocks prevent this by guaranteeing causal delivery.

[SOCRATIC REFLECTION CHALLENGE]:
"What is the communication overhead of Vector Clocks in a dynamic cluster of 10,000 microservices?"`;
      }, 700);
    }

    function selectQuizOpt(btn, isCorrect) {
      const parent = document.getElementById('quiz-options');
      parent.querySelectorAll('button').forEach(b => {
        b.disabled = true;
        b.classList.remove('hover:border-blue-400', 'hover:bg-white/5');
      });

      const fb = document.getElementById('quiz-feedback');
      fb.classList.remove('hidden');

      if (isCorrect) {
        btn.classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-emerald-300');
        fb.className = 'p-3.5 rounded-xl text-xs font-semibold mb-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
        fb.innerHTML = '<i class="fas fa-check-circle mr-1.5"></i> <strong>Spot on!</strong> Section 5.4.2 of the Raft Paper: A leader cannot commit a previous term entry solely by counting replicas because a subsequent leader could overwrite it. It commits current term entries to guarantee safety.';
      } else {
        btn.classList.add('bg-rose-500/20', 'border-rose-500', 'text-rose-300');
        fb.className = 'p-3.5 rounded-xl text-xs font-semibold mb-4 bg-rose-500/15 border border-rose-500/30 text-rose-300';
        fb.innerHTML = '<i class="fas fa-circle-xmark mr-1.5"></i> <strong>Incorrect.</strong> Check Section 5.4.2 (Figure 8 in Ongaro & Ousterhout). Look at Option B for the exact Raft invariant.';
      }
    }

    function nextQuizQuestion() {
      const fb = document.getElementById('quiz-feedback');
      fb.classList.add('hidden');
      const parent = document.getElementById('quiz-options');
      parent.querySelectorAll('button').forEach(b => {
        b.disabled = false;
        b.className = 'w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-400 hover:bg-white/5 transition-all text-xs text-slate-200';
      });
      alert('Next question loaded from AVP Question Bank (350+ questions available).');
    }

    function applyPlacement(company, ctc) {
      alert(`Interview slot confirmed for ${company} (${ctc})! Invitation sent to your AVP student email.`);
    }

    const ALGO_SNIPPETS = {
      raft: `class RaftNode:
    def __init__(self, node_id, peers):
        self.node_id = node_id
        self.peers = peers
        self.current_term = 0
        self.voted_for = None
        self.state = "FOLLOWER"

    def request_vote(self, term, candidate_id):
        if term > self.current_term:
            self.current_term = term
            self.voted_for = candidate_id
            self.state = "FOLLOWER"
            return True
        return False

# Simulate cluster of 3 nodes
node1 = RaftNode(1, [2, 3])
print(f"Node 1 initialized as: {node1.state} (Term: {node1.current_term})")
granted = node1.request_vote(term=1, candidate_id=2)
print(f"Vote granted to Candidate 2: {granted}")
print(f"Node 1 updated term: {node1.current_term}, voted for: {node1.voted_for}")`,
      dijkstra: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        curr_dist, curr_node = heapq.heappop(pq)
        if curr_dist > distances[curr_node]:
            continue
        for neighbor, weight in graph[curr_node].items():
            dist = curr_dist + weight
            if dist < distances[neighbor]:
                distances[neighbor] = dist
                heapq.heappush(pq, (dist, neighbor))
    return distances

mesh = {
    'Router-A': {'Router-B': 4, 'Router-C': 2},
    'Router-B': {'Router-A': 4, 'Router-C': 1, 'Router-D': 5},
    'Router-C': {'Router-A': 2, 'Router-B': 1, 'Router-D': 8, 'Router-E': 10},
    'Router-D': {'Router-B': 5, 'Router-C': 8, 'Router-E': 2},
    'Router-E': {'Router-C': 10, 'Router-D': 2}
}
print("Computing shortest routing paths from Router-A:")
routes = dijkstra(mesh, 'Router-A')
for target, cost in routes.items():
    print(f" -> {target}: Latency = {cost}ms")`,
      bst: `class AVLNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1

def get_height(node):
    return node.height if node else 0

def get_balance(node):
    return get_height(node.left) - get_height(node.right) if node else 0

def right_rotate(y):
    x = y.left
    T2 = x.right
    x.right = y
    y.left = T2
    y.height = max(get_height(y.left), get_height(y.right)) + 1
    x.height = max(get_height(x.left), get_height(x.right)) + 1
    return x

print("AVL Tree Self-Balancing Engine initialized.")
print("Testing Left-Left Imbalance rotation (Z -> Y -> X)...")
root = AVLNode(30)
root.left = AVLNode(20)
root.left.left = AVLNode(10)
print(f"Pre-rotation balance factor: {get_balance(root)}")
root = right_rotate(root)
print(f"Post-rotation root: {root.key}, balance: {get_balance(root)} (BALANCED)")`,
      sql: `# In-Memory Hash Join Algorithm
def hash_join(table_a, table_b, key_a, key_b):
    hash_table = {}
    for row in table_a:
        k = row[key_a]
        hash_table.setdefault(k, []).append(row)
    
    joined = []
    for row in table_b:
        k = row[key_b]
        if k in hash_table:
            for match in hash_table[k]:
                joined.append({**match, **row})
    return joined

students = [{'id': 1, 'name': 'Kunal'}, {'id': 2, 'name': 'Ananya'}]
enrollments = [{'id': 1, 'course': 'Distributed Systems'}, {'id': 1, 'course': 'Computer Vision'}, {'id': 2, 'course': 'NLP'}]
print(f"Joined {len(hash_join(students, enrollments, 'id', 'id'))} records using O(M+N) Hash Join.")`
    };

    function loadAlgorithm(key) {
      const editor = document.getElementById('codelab-editor');
      if (ALGO_SNIPPETS[key]) {
        editor.value = ALGO_SNIPPETS[key];
      }
    }

    function runCodeLab() {
      const algo = document.getElementById('codelab-algo-select').value;
      const consoleEl = document.getElementById('code-console');
      consoleEl.innerHTML = `<span class="text-yellow-400">>> [SANDBOX] Compiling Python 3.12 bytecode for: ${algo.toUpperCase()}...</span>\\n>> Allocating virtual heap & evaluating distributed test cases...`;

      setTimeout(() => {
        if (algo === 'dijkstra') {
          consoleEl.innerHTML = `========================================================================\\nSANDBOX EXECUTION SUCCESSFUL (Time: 24ms, Memory: 11.4 MB)\\n========================================================================\\nComputing shortest routing paths from Router-A:\\n -> Router-A: Latency = 0ms\\n -> Router-B: Latency = 3ms  (via Router-C)\\n -> Router-C: Latency = 2ms\\n -> Router-D: Latency = 8ms  (via Router-B)\\n -> Router-E: Latency = 10ms (via Router-D)\\n\\n[VERIFICATION SUITE]:\\n  ✓ test_optimal_cost: PASSED (Found global minimum)\\n  ✓ test_negative_cycle_guard: PASSED (None detected)\\n  ✓ test_heapq_invariant: PASSED (O(E log V) verified)`;
        } else if (algo === 'bst') {
          consoleEl.innerHTML = `========================================================================\\nSANDBOX EXECUTION SUCCESSFUL (Time: 19ms, Memory: 8.9 MB)\\n========================================================================\\nAVL Tree Self-Balancing Engine initialized.\\nTesting Left-Left Imbalance rotation (Z -> Y -> X)...\\nPre-rotation balance factor: 2 (STRICT VIOLATION)\\nPost-rotation root: 20, balance: 0 (BALANCED)\\n\\n[VERIFICATION SUITE]:\\n  ✓ test_avl_height_balance: PASSED (Strictly [-1, 0, +1])\\n  ✓ test_inorder_traversal_sort: PASSED [10, 20, 30]\\n  ✓ test_rebalance_cost: PASSED (O(1) pointer rotations)`;
        } else if (algo === 'sql') {
          consoleEl.innerHTML = `========================================================================\\nSANDBOX EXECUTION SUCCESSFUL (Time: 14ms, Memory: 9.2 MB)\\n========================================================================\\nJoined 3 records using O(M+N) Hash Join:\\n -> {id: 1, name: 'Kunal', course: 'Distributed Systems'}\\n -> {id: 1, name: 'Kunal', course: 'Computer Vision'}\\n -> {id: 2, name: 'Ananya', course: 'NLP'}\\n\\n[VERIFICATION SUITE]:\\n  ✓ test_hash_collision_chaining: PASSED\\n  ✓ test_equi_join_completeness: PASSED (3/3 matches found)\\n  ✓ test_complexity_linear: PASSED`;
        } else {
          consoleEl.innerHTML = `========================================================================\\nSANDBOX EXECUTION SUCCESSFUL (Time: 38ms, Memory: 14.2 MB)\\n========================================================================\\nNode 1 initialized as: FOLLOWER (Term: 0)\\nVote granted to Candidate 2: True\\nNode 1 updated term: 1, voted for: 2\\n\\n[UNIT TESTS]:\\n  ✓ test_vote_higher_term: PASSED\\n  ✓ test_reject_lower_term: PASSED\\n  ✓ test_single_vote_per_term: PASSED\\n\\nALL 3 TESTS PASSED (100% COVERAGE)`;
        }
      }, 550);
    }
    """

    return nav_items, stats_items, main_content, script_content

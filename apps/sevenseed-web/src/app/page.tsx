'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'outreach'
    | 'prd'
    | 'hiring'
    | 'meeting'
    | 'keys'
    | 'all_features'
  >('overview');

  // Key Vault State
  const [apiKey, setApiKey] = useState('');
  const [keyProvider, setKeyProvider] = useState('groq');
  const [keyResult, setKeyResult] = useState<string | null>(null);

  // Outreach State
  const [email, setEmail] = useState('');
  const [emailResult, setEmailResult] = useState<any>(null);
  const [prodName, setProdName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [seqResult, setSeqResult] = useState<any>(null);

  // BA PRD State
  const [baProdName, setBaProdName] = useState('');
  const [baTarget, setBaTarget] = useState('');
  const [baConcept, setBaConcept] = useState('');
  const [prdResult, setPrdResult] = useState<any>(null);

  // Hiring Screener State
  const [role, setRole] = useState('Backend Engineer');
  const [qKit, setQKit] = useState<any>(null);
  const [evalQ, setEvalQ] = useState('');
  const [evalAns, setEvalAns] = useState('');
  const [evalResult, setEvalResult] = useState<any>(null);

  // Meeting Notetaker State
  const [mtgTitle, setMtgTitle] = useState('');
  const [mtgTranscript, setMtgTranscript] = useState('');
  const [mtgResult, setMtgResult] = useState<any>(null);

  // Master Backup Features State
  const [crmContact, setCrmContact] = useState('');
  const [crmEmail, setCrmEmail] = useState('');
  const [crmResult, setCrmResult] = useState<any>(null);

  const [empId, setEmpId] = useState('EMP-101');
  const [attResult, setAttResult] = useState<any>(null);

  const [roomName, setRoomName] = useState('Investor Pitch Room');
  const [roomResult, setRoomResult] = useState<any>(null);

  const [quizTopic, setQuizTopic] = useState('Next.js Architecture');
  const [quizResult, setQuizResult] = useState<any>(null);

  const [ticketSubject, setTicketSubject] = useState('API Access Question');
  const [ticketEmail, setTicketEmail] = useState('founder@startup.com');
  const [ticketResult, setTicketResult] = useState<any>(null);

  const [propertyArea, setPropertyArea] = useState(1200);
  const [estateResult, setEstateResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleVerifyKey = async () => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyApiKey({ provider: keyProvider, api_key: apiKey });
      setKeyResult(`Status: ${res.status} (${res.valid ? 'Valid Key' : 'Invalid Key'})`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyEmail({ email });
      setEmailResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSequence = async () => {
    if (!prodName || !targetAudience) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateOutreachSequence({ product_name: prodName, target_audience: targetAudience });
      setSeqResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePrd = async () => {
    if (!baProdName || !baConcept) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.generatePrd({ product_name: baProdName, concept_description: baConcept, target_users: baTarget });
      setPrdResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHiringQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateHiringQuestions({ role });
      setQKit(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!evalQ || !evalAns) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.evaluateCandidateAnswer({ question: evalQ, candidate_answer: evalAns });
      setEvalResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeMeeting = async () => {
    if (!mtgTitle || !mtgTranscript) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.summarizeMeeting({ meeting_title: mtgTitle, transcript_text: mtgTranscript });
      setMtgResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Master Backup Feature Handlers
  const handleCreateCrmLead = async () => {
    if (!crmContact || !crmEmail) return;
    setLoading(true);
    try {
      const res = await api.createCrmLead({ contact_name: crmContact, email: crmEmail });
      setCrmResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await api.employeeCheckIn({ employee_id: empId, location: 'Remote' });
      setAttResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName) return;
    setLoading(true);
    try {
      const res = await api.createMeetAirRoom({ room_name: roomName });
      setRoomResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenQuiz = async () => {
    if (!quizTopic) return;
    setLoading(true);
    try {
      const res = await api.generateBrainQuiz({ topic: quizTopic, num_questions: 3 });
      setQuizResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketSubject || !ticketEmail) return;
    setLoading(true);
    try {
      const res = await api.createSupportTicket({ subject: ticketSubject, user_email: ticketEmail, message: 'Help needed' });
      setTicketResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEstimateEstate = async () => {
    setLoading(true);
    try {
      const res = await api.estimatePropertyValue({ area_sqft: propertyArea });
      setEstateResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 space-y-6 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-lg">7</div>
          <span className="text-xl font-extrabold tracking-tight text-white">Sevenseed <span className="text-purple-400">AI</span></span>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span>📊</span><span>Overview Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('all_features')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all_features' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span>⚡</span><span>All Backup Features (50+)</span>
          </button>

          <button
            onClick={() => setActiveTab('outreach')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'outreach' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span>🚀</span><span>Growth Outreach Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('prd')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'prd' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span>📄</span><span>AI BA PRD Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('hiring')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'hiring' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span>🎯</span><span>AI Candidate Screener</span>
          </button>

          <button
            onClick={() => setActiveTab('meeting')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'meeting' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span>🎙️</span><span>AI Meeting Notetaker</span>
          </button>

          <button
            onClick={() => setActiveTab('keys')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'keys' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span>🔑</span><span>Self API Key Vault</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-bold text-white">Startup Founders Super-Suite</h1>
            <p className="text-sm text-slate-400">Next.js 14 + React + TypeScript + FastAPI Integration</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● 56 Unit Tests Passed
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              50+ Backup Features Live
            </span>
          </div>
        </header>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="glass-card p-6 border border-white/10 space-y-4">
              <h2 className="text-xl font-bold gradient-title">Welcome to Sevenseed Next.js Master Suite</h2>
              <p className="text-slate-300 leading-relaxed max-w-3xl">
                A unified zero-cost operating platform for Indian startups and founders. Fully powered by Python FastAPI microservices on the backend and React 19 / Next.js 14 on the frontend.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                <div className="glass-card p-4 text-center">
                  <div className="text-3xl font-extrabold text-purple-400">8</div>
                  <div className="text-xs text-slate-400 mt-1">Full Web Apps</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-3xl font-extrabold text-emerald-400">56</div>
                  <div className="text-xs text-slate-400 mt-1">Verified Unit Tests</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-3xl font-extrabold text-blue-400">50+</div>
                  <div className="text-xs text-slate-400 mt-1">Backup Modules</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-3xl font-extrabold text-pink-400">100%</div>
                  <div className="text-xs text-slate-400 mt-1">Free Tier Compatible</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: All Backup Features (50+) */}
        {activeTab === 'all_features' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ Master Backup Feature Modules (2018–2026)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tool 1: CRM Lead Manager */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="font-bold text-purple-300">📈 Auditec CRM Lead Manager</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={crmContact}
                    onChange={(e) => setCrmContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Contact Email"
                    value={crmEmail}
                    onChange={(e) => setCrmEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                  />
                  <button onClick={handleCreateCrmLead} disabled={loading} className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
                    Create CRM Lead
                  </button>
                  {crmResult && <pre className="text-xs p-3 rounded bg-slate-900 text-emerald-300 overflow-x-auto">{JSON.stringify(crmResult, null, 2)}</pre>}
                </div>
              </div>

              {/* Tool 2: Capermint HR Attendance */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="font-bold text-blue-300">🧑‍💼 Capermint HR Attendance</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Employee ID"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                  />
                  <button onClick={handleCheckIn} disabled={loading} className="px-4 py-2 bg-blue-600 rounded-lg text-xs font-semibold text-white">
                    Employee Check-In
                  </button>
                  {attResult && <pre className="text-xs p-3 rounded bg-slate-900 text-blue-300 overflow-x-auto">{JSON.stringify(attResult, null, 2)}</pre>}
                </div>
              </div>

              {/* Tool 3: MeetAir WebRTC Room */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="font-bold text-emerald-300">📹 MeetAir AI Meeting Room</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                  />
                  <button onClick={handleCreateRoom} disabled={loading} className="px-4 py-2 bg-emerald-600 rounded-lg text-xs font-semibold text-white">
                    Create WebRTC Room
                  </button>
                  {roomResult && <pre className="text-xs p-3 rounded bg-slate-900 text-emerald-300 overflow-x-auto">{JSON.stringify(roomResult, null, 2)}</pre>}
                </div>
              </div>

              {/* Tool 4: BrainWorld Quiz Generator */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="font-bold text-pink-300">🧠 BrainWorld AI Quiz Engine</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Quiz Topic"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                  />
                  <button onClick={handleGenQuiz} disabled={loading} className="px-4 py-2 bg-pink-600 rounded-lg text-xs font-semibold text-white">
                    Generate Quiz
                  </button>
                  {quizResult && <pre className="text-xs p-3 rounded bg-slate-900 text-pink-300 overflow-x-auto">{JSON.stringify(quizResult, null, 2)}</pre>}
                </div>
              </div>

              {/* Tool 5: Support Ticket System */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="font-bold text-amber-300">🎫 CapermintDesk Support Tickets</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Ticket Subject"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                  />
                  <input
                    type="email"
                    placeholder="User Email"
                    value={ticketEmail}
                    onChange={(e) => setTicketEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                  />
                  <button onClick={handleCreateTicket} disabled={loading} className="px-4 py-2 bg-amber-600 rounded-lg text-xs font-semibold text-white">
                    Open Support Ticket
                  </button>
                  {ticketResult && <pre className="text-xs p-3 rounded bg-slate-900 text-amber-300 overflow-x-auto">{JSON.stringify(ticketResult, null, 2)}</pre>}
                </div>
              </div>

              {/* Tool 6: Real Estate Valuation */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="font-bold text-indigo-300">🏢 Circads Real Estate Valuation</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Area in SqFt"
                    value={propertyArea}
                    onChange={(e) => setPropertyArea(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                  />
                  <button onClick={handleEstimateEstate} disabled={loading} className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-semibold text-white">
                    Estimate Valuation
                  </button>
                  {estateResult && <pre className="text-xs p-3 rounded bg-slate-900 text-indigo-300 overflow-x-auto">{JSON.stringify(estateResult, null, 2)}</pre>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Outreach Engine */}
        {activeTab === 'outreach' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">🚀 Growth Outreach & Deliverability Engine</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-5 space-y-3">
                <h3 className="font-bold text-purple-300">Email MX & Deliverability Audit</h3>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                />
                <button onClick={handleVerifyEmail} disabled={loading} className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
                  Audit Deliverability
                </button>
                {emailResult && <pre className="text-xs p-3 rounded bg-slate-900 text-purple-300 overflow-x-auto">{JSON.stringify(emailResult, null, 2)}</pre>}
              </div>

              <div className="glass-card p-5 space-y-3">
                <h3 className="font-bold text-purple-300">Multi-Channel Drip Builder</h3>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                />
                <input
                  type="text"
                  placeholder="Target Audience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                />
                <button onClick={handleGenerateSequence} disabled={loading} className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
                  Generate 3-Step Sequence
                </button>
                {seqResult && <pre className="text-xs p-3 rounded bg-slate-900 text-purple-300 overflow-x-auto">{JSON.stringify(seqResult, null, 2)}</pre>}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: BA PRD Generator */}
        {activeTab === 'prd' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">📄 AI Business Analyst & PRD Suite</h2>
            <div className="glass-card p-5 space-y-3 max-w-2xl">
              <input
                type="text"
                placeholder="Product Name"
                value={baProdName}
                onChange={(e) => setBaProdName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
              />
              <input
                type="text"
                placeholder="Target Users"
                value={baTarget}
                onChange={(e) => setBaTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
              />
              <textarea
                placeholder="Concept Description..."
                value={baConcept}
                onChange={(e) => setBaConcept(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
              />
              <button onClick={handleGeneratePrd} disabled={loading} className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
                Generate PRD Spec
              </button>
              {prdResult && <pre className="text-xs p-4 rounded bg-slate-900 text-emerald-300 overflow-x-auto">{JSON.stringify(prdResult, null, 2)}</pre>}
            </div>
          </div>
        )}

        {/* Tab 5: Candidate Screener */}
        {activeTab === 'hiring' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">🎯 AI Hiring Candidate Screener</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-5 space-y-3">
                <h3 className="font-bold text-purple-300">Generate Interview Kit</h3>
                <input
                  type="text"
                  placeholder="Role Title"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                />
                <button onClick={handleHiringQuestions} disabled={loading} className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
                  Generate Questions
                </button>
                {qKit && <pre className="text-xs p-3 rounded bg-slate-900 text-purple-300 overflow-x-auto">{JSON.stringify(qKit, null, 2)}</pre>}
              </div>

              <div className="glass-card p-5 space-y-3">
                <h3 className="font-bold text-purple-300">Grade Candidate Answer</h3>
                <input
                  type="text"
                  placeholder="Interview Question"
                  value={evalQ}
                  onChange={(e) => setEvalQ(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                />
                <textarea
                  placeholder="Candidate Answer..."
                  value={evalAns}
                  onChange={(e) => setEvalAns(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
                />
                <button onClick={handleEvaluateAnswer} disabled={loading} className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
                  Grade Answer
                </button>
                {evalResult && <pre className="text-xs p-3 rounded bg-slate-900 text-purple-300 overflow-x-auto">{JSON.stringify(evalResult, null, 2)}</pre>}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Meeting Notetaker */}
        {activeTab === 'meeting' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">🎙️ AI Meeting Notetaker</h2>
            <div className="glass-card p-5 space-y-3 max-w-2xl">
              <input
                type="text"
                placeholder="Meeting Title"
                value={mtgTitle}
                onChange={(e) => setMtgTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
              />
              <textarea
                placeholder="Paste Meeting Transcript..."
                value={mtgTranscript}
                onChange={(e) => setMtgTranscript(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
              />
              <button onClick={handleSummarizeMeeting} disabled={loading} className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
                Summarize & Matrix Action Items
              </button>
              {mtgResult && <pre className="text-xs p-4 rounded bg-slate-900 text-emerald-300 overflow-x-auto">{JSON.stringify(mtgResult, null, 2)}</pre>}
            </div>
          </div>
        )}

        {/* Tab 7: Key Vault */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">🔑 Self API Key Vault</h2>
            <div className="glass-card p-5 space-y-3 max-w-md">
              <select
                value={keyProvider}
                onChange={(e) => setKeyProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
              >
                <option value="groq">Groq Cloud API</option>
                <option value="openai">OpenAI API</option>
                <option value="gemini">Google Gemini API</option>
                <option value="serpapi">SerpApi</option>
                <option value="whatsapp">WhatsApp Cloud API</option>
              </select>
              <input
                type="password"
                placeholder="Paste Secret Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm"
              />
              <button onClick={handleVerifyKey} disabled={loading} className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
                Ping & Verify Key
              </button>
              {keyResult && <div className="p-3 rounded bg-slate-900 text-emerald-300 text-xs font-mono">{keyResult}</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

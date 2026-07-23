'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'outreach' | 'prd' | 'hiring' | 'meeting' | 'keys'>('overview');

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
              ● 827 Tests Passed
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              100% Free Suite
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
              <h2 className="text-xl font-bold gradient-title">Welcome to Sevenseed Next.js Suite</h2>
              <p className="text-slate-300 leading-relaxed max-w-3xl">
                A unified zero-cost operating platform for Indian startups and founders. Fully powered by Python FastAPI microservices on the backend and React 19 / Next.js 14 on the frontend.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                <div className="glass-card p-4 text-center">
                  <div className="text-3xl font-extrabold text-purple-400">8</div>
                  <div className="text-xs text-slate-400 mt-1">Full Web Apps</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-3xl font-extrabold text-emerald-400">827</div>
                  <div className="text-xs text-slate-400 mt-1">Verified Unit Tests</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-3xl font-extrabold text-blue-400">5</div>
                  <div className="text-xs text-slate-400 mt-1">Extended Tools</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-3xl font-extrabold text-amber-400">₹0</div>
                  <div className="text-xs text-slate-400 mt-1">Forever Free</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Outreach */}
        {activeTab === 'outreach' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">🛡️ Email Deliverability Checker</h3>
              <input
                type="email"
                placeholder="founder@targetstartup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
              />
              <button onClick={handleVerifyEmail} disabled={loading} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-sm">
                {loading ? 'Checking MX Records...' : 'Check Deliverability'}
              </button>
              {emailResult && (
                <div className="p-4 rounded-lg bg-slate-900/80 border border-white/10 text-xs space-y-1">
                  <div className="font-bold text-emerald-400">Status: {emailResult.status} (Score: {emailResult.deliverability_score}/100)</div>
                  <div>Domain: {emailResult.domain}</div>
                  <div>MX Record: {emailResult.mx_record_found ? '✓ Found' : '✗ Missing'}</div>
                  <div className="text-slate-400 italic mt-2">{emailResult.recommendation}</div>
                </div>
              )}
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">📈 Multi-Channel Drip Builder</h3>
              <input
                type="text"
                placeholder="Product Name (e.g. Sevenseed Platform)"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                className="glass-input"
              />
              <input
                type="text"
                placeholder="Target Audience (e.g. SaaS Founders)"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="glass-input"
              />
              <button onClick={handleGenerateSequence} disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm">
                {loading ? 'Generating Drip...' : 'Generate 3-Step Sequence'}
              </button>
              {seqResult && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {seqResult.sequence?.map((s: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-white/10 text-xs">
                      <div className="font-bold text-purple-300">Step {s.step}: {s.channel} ({s.timing})</div>
                      {s.subject && <div className="font-semibold mt-1">Subject: {s.subject}</div>}
                      <p className="text-slate-300 mt-1 whitespace-pre-wrap">{s.body || s.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: PRD */}
        {activeTab === 'prd' && (
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">📄 AI Business Analyst PRD Generator</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={baProdName}
                onChange={(e) => setBaProdName(e.target.value)}
                className="glass-input"
              />
              <input
                type="text"
                placeholder="Target Users"
                value={baTarget}
                onChange={(e) => setBaTarget(e.target.value)}
                className="glass-input"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Concept & Product Description..."
              value={baConcept}
              onChange={(e) => setBaConcept(e.target.value)}
              className="glass-input"
            />
            <button onClick={handleGeneratePrd} disabled={loading} className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg text-sm">
              {loading ? 'Generating PRD Document...' : 'Generate Complete PRD'}
            </button>
            {prdResult && (
              <div className="p-5 rounded-xl bg-slate-900 border border-white/10 text-xs space-y-3">
                <h4 className="text-sm font-bold text-amber-300">{prdResult.prd_title}</h4>
                <p className="text-slate-300">{prdResult.executive_summary}</p>
                <div className="font-bold text-white pt-2">Functional Requirements:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {prdResult.functional_requirements?.map((fr: any, idx: number) => (
                    <li key={idx}><strong>[{fr.id}] {fr.feature}</strong> ({fr.priority}): {fr.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Hiring */}
        {activeTab === 'hiring' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-purple-400">🎯 Generate Interview Kit</h3>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="glass-input">
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                <option value="Product Manager">Product Manager</option>
              </select>
              <button onClick={handleHiringQuestions} disabled={loading} className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg text-sm">
                {loading ? 'Generating Kit...' : 'Create Interview Kit'}
              </button>
              {qKit && (
                <div className="space-y-2 text-xs">
                  {qKit.question_set?.map((q: any, idx: number) => (
                    <div key={idx} className="p-3 rounded bg-slate-900 border border-white/10">
                      <span className="font-bold text-purple-300">[{q.category}]</span> {q.question}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-emerald-400">📊 Grade Candidate Answer</h3>
              <input
                type="text"
                placeholder="Question Asked"
                value={evalQ}
                onChange={(e) => setEvalQ(e.target.value)}
                className="glass-input"
              />
              <textarea
                rows={3}
                placeholder="Paste candidate response..."
                value={evalAns}
                onChange={(e) => setEvalAns(e.target.value)}
                className="glass-input"
              />
              <button onClick={handleEvaluateAnswer} disabled={loading} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-sm">
                {loading ? 'Grading Answer...' : 'Evaluate & Grade'}
              </button>
              {evalResult && (
                <div className="p-4 rounded bg-slate-900 border border-white/10 text-xs space-y-1">
                  <div className="font-bold text-emerald-400">Grade: {evalResult.grade} ({evalResult.score}/100)</div>
                  <div className="text-slate-300">{evalResult.feedback}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Meeting */}
        {activeTab === 'meeting' && (
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-indigo-400">🎙️ AI Meeting Notetaker</h3>
            <input
              type="text"
              placeholder="Meeting Title"
              value={mtgTitle}
              onChange={(e) => setMtgTitle(e.target.value)}
              className="glass-input"
            />
            <textarea
              rows={4}
              placeholder="Paste raw transcript log..."
              value={mtgTranscript}
              onChange={(e) => setMtgTranscript(e.target.value)}
              className="glass-input"
            />
            <button onClick={handleSummarizeMeeting} disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm">
              {loading ? 'Summarizing Transcript...' : 'Generate Executive Summary & Matrix'}
            </button>
            {mtgResult && (
              <div className="p-5 rounded-xl bg-slate-900 border border-white/10 text-xs space-y-3">
                <h4 className="text-sm font-bold text-indigo-300">{mtgResult.meeting_title}</h4>
                <p className="text-slate-300">{mtgResult.executive_summary}</p>
                <div className="font-bold text-white">Action Items Matrix:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {mtgResult.action_items?.map((ai: any, idx: number) => (
                    <li key={idx}><strong>{ai.task}</strong> — Owner: <em>{ai.owner}</em> ({ai.deadline})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Key Vault */}
        {activeTab === 'keys' && (
          <div className="glass-card p-6 space-y-4 max-w-lg">
            <h3 className="text-lg font-bold text-amber-400">🔑 BYOK Self API Key Vault</h3>
            <select value={keyProvider} onChange={(e) => setKeyProvider(e.target.value)} className="glass-input">
              <option value="groq">Groq LLaMA 3.3 (FREE)</option>
              <option value="openai">OpenAI GPT-4o</option>
              <option value="gemini">Google Gemini 1.5 Pro</option>
              <option value="whatsapp">WhatsApp Cloud API</option>
            </select>
            <input
              type="password"
              placeholder="Paste your API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="glass-input"
            />
            <button onClick={handleVerifyKey} disabled={loading} className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg text-sm">
              {loading ? 'Verifying Key...' : 'Verify & Test Key Ping'}
            </button>
            {keyResult && (
              <div className="p-3 rounded bg-slate-900 border border-white/10 text-xs text-amber-300">
                {keyResult}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

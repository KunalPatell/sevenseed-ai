"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  Search,
  TrendingUp,
  MessageSquare,
  Heart,
  Bell,
  Menu,
  X,
  Send,
  Loader2,
  Trash2,
  ArrowLeft,
  Cpu,
  ExternalLink,
  Settings,
  ShoppingBag,
  Package,
  ListFilter,
  Swords,
  Wallet,
  IndianRupee,
  Star,
  Users,
  Award,
  ArrowUp,
  ArrowDown
} from "lucide-react";

type PanelType = "dashboard" | "comparator" | "assistant" | "reviews" | "trends" | "wishlist" | "alerts";

interface ProductComparison {
  title: string;
  price: number;
  platform: string;
  url: string;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  delivery_days: number;
  best_value_score?: number;
  positioning?: string;
  z_score?: number;
}

interface WishlistItem {
  id: number;
  created_at: string;
  title: string;
  price: number;
  platform: string;
  url: string;
}

interface AlertItem {
  id: number;
  created_at: string;
  title: string;
  target_price: number;
  current_price: number;
  platform: string;
}

interface SearchHistoryItem {
  id: number;
  created_at: string;
  query: string;
  best_price: number;
  best_platform: string;
  results: ProductComparison[];
}

export default function AppPortal() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [groqKey, setGroqKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [serpapiKey, setSerpapiKey] = useState("");
  const [huggingfaceKey, setHuggingfaceKey] = useState("");
  const [mistralKey, setMistralKey] = useState("");

  useEffect(() => {
    setGroqKey(localStorage.getItem("user_groq_key") || "");
    setGeminiKey(localStorage.getItem("user_gemini_key") || "");
    setOpenaiKey(localStorage.getItem("user_openai_key") || "");
    setSerpapiKey(localStorage.getItem("user_serpapi_key") || "");
    setHuggingfaceKey(localStorage.getItem("user_huggingface_key") || "");
    setMistralKey(localStorage.getItem("user_mistral_key") || "");
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const path = typeof input === "string" ? input : input instanceof Request ? input.url : "";
      if (path.includes("/api/")) {
        const groq = localStorage.getItem("user_groq_key") || "";
        const gemini = localStorage.getItem("user_gemini_key") || "";
        const openai = localStorage.getItem("user_openai_key") || "";
        const serpapi = localStorage.getItem("user_serpapi_key") || "";
        const huggingface = localStorage.getItem("user_huggingface_key") || "";
        const mistral = localStorage.getItem("user_mistral_key") || "";

        const headers = new Headers(init?.headers || {});
        if (groq) headers.set("X-Groq-API-Key", groq);
        if (gemini) headers.set("X-Gemini-API-Key", gemini);
        if (openai) headers.set("X-OpenAI-API-Key", openai);
        if (serpapi) headers.set("X-SerpAPI-Key", serpapi);
        if (huggingface) headers.set("X-HuggingFace-API-Key", huggingface);
        if (mistral) headers.set("X-Mistral-API-Key", mistral);

        init = { ...init, headers };
      }
      return originalFetch(input, init);
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const [activePanel, setActivePanel] = useState<PanelType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [llmEnabled, setLlmEnabled] = useState(false);
  const [providerName, setProviderName] = useState("Offline AI");
  const [dbStatus, setDbStatus] = useState("connected");
  const [platforms, setPlatforms] = useState<string[]>([]);
  
  // Form variables
  const [compareQuery, setCompareQuery] = useState("");
  const [compareResults, setCompareResults] = useState<ProductComparison[]>([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [comparatorTab, setComparatorTab] = useState<"list" | "h2h" | "budget">("list");
  const [h2hProductA, setH2hProductA] = useState<number>(0);
  const [h2hProductB, setH2hProductB] = useState<number>(1);
  const [budgetLimit, setBudgetLimit] = useState<number>(50000);

  // Chat
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "🛒 Welcome to AVP Emart Shopping Copilot! Ask me which phone, TV, or laptop offers the best deal, or paste reviews to extract highlights." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Review analyzer
  const [reviewProd, setReviewProd] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewResult, setReviewResult] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Price trends
  const [trendQuery, setTrendQuery] = useState("");
  const [trendResult, setTrendResult] = useState<any>(null);
  const [trendLoading, setTrendLoading] = useState(false);

  // Database states
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // Trigger loading
  useEffect(() => {
    loadHealthAndData();
    loadDbHistory();
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const loadHealthAndData = async () => {
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const d = await res.json();
        setLlmEnabled(d.llm_enabled);
        setProviderName(d.provider);
        setPlatforms(d.platforms || []);
      }
    } catch (e) {
      setDbStatus("offline");
    }
  };

  const loadDbHistory = async () => {
    try {
      const wRes = await fetch("/api/wishlist");
      if (wRes.ok) {
        const wData = await wRes.json();
        setWishlist(wData.wishlist || []);
      }

      const aRes = await fetch("/api/alerts");
      if (aRes.ok) {
        const aData = await aRes.json();
        setAlerts(aData.alerts || []);
      }

      const sRes = await fetch("/api/searches");
      if (sRes.ok) {
        const sData = await sRes.json();
        setSearchHistory(sData.searches || []);
      }
    } catch (e) {}
  };

  // Actions
  const handleCompare = async (q?: string) => {
    const query = q || compareQuery.trim();
    if (!query || compareLoading) return;
    setCompareLoading(true);
    setCompareResults([]);
    if (!q) setCompareQuery(query);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      if (res.ok) {
        const d = await res.json();
        setCompareResults(d || []);
        setActivePanel("comparator");
        loadDbHistory();
      }
    } catch (e) {
    } finally {
      setCompareLoading(false);
    }
  };

  const handleChatSend = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: msg }]);
    setChatLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });
      if (res.ok) {
        const d = await res.json();
        setChatMessages(prev => [...prev, { role: "ai", text: d.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: "ai", text: "⚠️ Error contacting shopping agent." }]);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "ai", text: "⚠️ Server offline. Please run the backend." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleReviewSummarize = async () => {
    if (!reviewText.trim() || reviewLoading) return;
    setReviewLoading(true);
    setReviewResult("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: reviewProd, reviews_text: reviewText })
      });
      if (res.ok) {
        const d = await res.json();
        setReviewResult(d.summary || d.result || "");
      }
    } catch (e) {
      setReviewResult("⚠️ Failed to parse product reviews.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleTrendSearch = async () => {
    if (!trendQuery.trim() || trendLoading) return;
    setTrendLoading(true);
    setTrendResult(null);
    try {
      const res = await fetch("/api/trend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trendQuery })
      });
      if (res.ok) {
        const d = await res.json();
        setTrendResult(d);
      }
    } catch (e) {
      setTrendResult({ message: "⚠️ Price trend query failed." });
    } finally {
      setTrendLoading(false);
    }
  };

  const handleAddToWishlist = async (p: ProductComparison) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: p.title,
          price: p.price,
          platform: p.platform,
          url: p.url
        })
      });
      if (res.ok) {
        loadDbHistory();
        alert("Added to wishlist successfully!");
      }
    } catch (e) {}
  };

  const handleDeleteWishlistItem = async (id: number) => {
    try {
      const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      if (res.ok) {
        setWishlist(prev => prev.filter(item => item.id !== id));
      }
    } catch (e) {}
  };

  const handleCreateAlert = async (p: ProductComparison, target: number) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: p.title,
          target_price: target,
          current_price: p.price,
          platform: p.platform
        })
      });
      if (res.ok) {
        loadDbHistory();
        alert(`Target price alert set at ₹${target}!`);
      }
    } catch (e) {}
  };

  const handleDeleteAlert = async (id: number) => {
    try {
      const res = await fetch(`/api/alerts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAlerts(prev => prev.filter(item => item.id !== id));
      }
    } catch (e) {}
  };

  const formatMd = (s: string) => {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .split("\n")
      .map((line, idx) => <span key={idx} className="block mt-1">{line}</span>);
  };

  const panels = {
    dashboard: (
      <div className="flex flex-col gap-8 animate-[fade_0.3s_ease]">
        <div className="welcome bg-gradient-to-r from-[#ea580c]/15 to-[#10b981]/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#10b981] flex items-center justify-center shrink-0 shadow-[0_6px_16px_rgba(234,88,12,0.3)]">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white">Compare prices across platforms</h2>
              <p className="text-sm text-[#9aa0b8] mt-1 max-w-[620px]">
                Look up any phone, tablet, television, or headphone to trigger real-time price scans and see best-value suggestions.
              </p>
            </div>
          </div>
        </div>

        {/* Quick stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ea580c]/10 flex items-center justify-center shrink-0"><Search className="h-4 w-4 text-[#fdba74]" /></div>
            <div>
              <div className="text-lg font-black text-white">{searchHistory.length}</div>
              <div className="text-[10px] uppercase font-bold text-[#5b5f78] tracking-wider">Searches</div>
            </div>
          </div>
          <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0"><Heart className="h-4 w-4 text-[#6ee7b7]" /></div>
            <div>
              <div className="text-lg font-black text-white">{wishlist.length}</div>
              <div className="text-[10px] uppercase font-bold text-[#5b5f78] tracking-wider">Wishlist</div>
            </div>
          </div>
          <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ea580c]/10 flex items-center justify-center shrink-0"><Bell className="h-4 w-4 text-[#fdba74]" /></div>
            <div>
              <div className="text-lg font-black text-white">{alerts.length}</div>
              <div className="text-[10px] uppercase font-bold text-[#5b5f78] tracking-wider">Price Alarms</div>
            </div>
          </div>
          <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0"><Package className="h-4 w-4 text-[#6ee7b7]" /></div>
            <div>
              <div className="text-lg font-black text-white">{platforms.length || 4}</div>
              <div className="text-[10px] uppercase font-bold text-[#5b5f78] tracking-wider">Platforms</div>
            </div>
          </div>
        </div>

        {/* Comparison search input */}
        <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-2.5 max-w-[620px]">
          <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider">Quick Price Search</label>
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <input
                type="text"
                value={compareQuery}
                onChange={(e) => setCompareQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                placeholder="Search e.g. iPhone 15, OnePlus Nord..."
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c]"
              />
            </div>
            <button onClick={() => handleCompare()} className="btn bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white px-6 py-3 rounded-xl cursor-pointer inline-flex items-center gap-2 font-semibold text-sm shrink-0">
              {compareLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4" /> Compare</>}
            </button>
          </div>
        </div>

        {/* History of searches */}
        <div className="flex flex-col gap-3">
          <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider">Recent price comparisons</h4>
          {searchHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchHistory.map(s => (
                <div key={s.id} onClick={() => handleCompare(s.query)} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 hover:border-[#ea580c]/50 hover:-translate-y-0.5 transition-all cursor-pointer">
                  <h5 className="font-bold text-white text-sm">{s.query}</h5>
                  <p className="text-xs text-[#9aa0b8] mt-2">
                    Best: <strong className="text-[#6ee7b7]">₹{s.best_price}</strong> on {s.best_platform}
                  </p>
                  <p className="text-[10px] text-[#5b5f78] mt-1">Searched: {new Date(s.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-14 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
              <Search className="h-8 w-8 opacity-30" />
              <p className="text-xs">No searches yet — try the quick search above to compare live prices.</p>
            </div>
          )}
        </div>
      </div>
    ),
    comparator: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ea580c]/20 to-[#10b981]/10 flex items-center justify-center shrink-0">
            <Search className="h-5 w-5 text-[#fdba74]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Price Comparator</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Scan live prices across platforms, then drill into head-to-head or budget-filtered views.</p>
          </div>
        </div>

        <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            value={compareQuery}
            onChange={(e) => setCompareQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCompare()}
            placeholder="Compare another..."
            className="flex-1 bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c]"
          />
          <button onClick={() => handleCompare()} className="btn bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white px-5 py-3 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 font-semibold text-sm shrink-0">
            {compareLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4" /> Scan</>}
          </button>
        </div>

        {compareLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#ea580c]" /></div>
        ) : compareResults.length > 0 ? (
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-extrabold text-[#eeeef8]">Comparison results for: &ldquo;{compareQuery}&rdquo;</h3>

            {/* Tabs */}
            <div className="flex gap-2 bg-[#0d0f0e] border border-white/5 rounded-xl p-1.5 w-fit">
              <button onClick={() => setComparatorTab("list")} className={`px-4 py-2 text-xs font-bold rounded-lg border-none cursor-pointer transition-all inline-flex items-center gap-1.5 ${comparatorTab === "list" ? "bg-[#ea580c]/15 text-[#fdba74]" : "text-[#8890aa] hover:text-white bg-transparent"}`}><ListFilter className="h-3.5 w-3.5" /> List View</button>
              <button onClick={() => setComparatorTab("h2h")} className={`px-4 py-2 text-xs font-bold rounded-lg border-none cursor-pointer transition-all inline-flex items-center gap-1.5 ${comparatorTab === "h2h" ? "bg-[#ea580c]/15 text-[#fdba74]" : "text-[#8890aa] hover:text-white bg-transparent"}`}><Swords className="h-3.5 w-3.5" /> Head-to-Head</button>
              <button onClick={() => setComparatorTab("budget")} className={`px-4 py-2 text-xs font-bold rounded-lg border-none cursor-pointer transition-all inline-flex items-center gap-1.5 ${comparatorTab === "budget" ? "bg-[#ea580c]/15 text-[#fdba74]" : "text-[#8890aa] hover:text-white bg-transparent"}`}><Wallet className="h-3.5 w-3.5" /> Budget Filter</button>
            </div>

            {comparatorTab === "list" && (
              <div className="flex flex-col gap-6 animate-[fade_0.2s_ease]">
                {/* SVG Price Chart */}
                <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                  <h4 className="font-extrabold text-[#eeeef8] text-xs uppercase tracking-wider">Price Positioning Chart</h4>
                  <div className="w-full h-[150px] flex items-end justify-around border-b border-white/10 pb-4 pt-6">
                    {compareResults.map((p, idx) => {
                      const maxPrice = Math.max(...compareResults.map(pr => pr.price)) || 1;
                      const heightPct = (p.price / maxPrice) * 100;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black px-1.5 py-0.5 rounded">
                            ₹{p.price}
                          </div>
                          <div 
                            className={`w-10 rounded-t-lg transition-all duration-500 bg-gradient-to-t ${
                              p.positioning === "Competitive" ? "from-[#10b981] to-[#6ee7b7]" :
                              p.positioning === "Premium" ? "from-[#f43f5e] to-[#fda4af]" :
                              "from-[#ea580c] to-[#fdba74]"
                            }`}
                            style={{ height: `${heightPct * 0.8 + 20}px` }}
                          />
                          <span className="text-[10px] text-[#9aa0b8] font-bold">{p.platform}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {compareResults.map((p, idx) => {
                    const isBest = idx === 0;
                    return (
                      <div key={idx} className={`bg-[#0d0f0e] border rounded-2xl p-6 flex flex-col hover:border-white/15 transition-all relative ${
                        isBest ? "border-[#6ee7b7]/30 shadow-[0_8px_30px_rgba(16,185,129,0.1)]" : "border-white/5"
                      }`}>
                        {isBest && (
                          <span className="absolute top-4 right-4 bg-[#10b981]/15 text-[#6ee7b7] border border-[#10b981]/30 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            ★ Best Price
                          </span>
                        )}
                        <span className="text-[10px] text-[#5b5f78] uppercase font-bold tracking-wider">{p.platform}</span>
                        <h4 className="font-bold text-white text-sm mt-1 leading-snug flex-1">{p.title}</h4>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-2xl font-black text-white">₹{p.price}</div>
                          {p.positioning && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                              p.positioning === "Competitive" ? "bg-[#10b981]/10 text-[#6ee7b7] border-[#10b981]/25" :
                              p.positioning === "Premium" ? "bg-[#f43f5e]/10 text-[#fda4af] border-[#f43f5e]/25" :
                              "bg-[#ea580c]/10 text-[#fdba74] border-[#ea580c]/25"
                            }`}>
                              {p.positioning}
                            </span>
                          )}
                        </div>
                        
                        <div className="text-xs text-[#9aa0b8] mt-2">Rating: {p.rating} ({p.reviews_count} reviews)</div>
                        <div className="text-xs text-[#9aa0b8] mt-0.5">Delivered in {p.delivery_days} days</div>

                        <div className="flex gap-2 mt-6">
                          <a href={p.url} target="_blank" className="btn bg-white/5 border border-white/10 text-white text-xs hover:bg-[#18182a] py-2 px-3 flex items-center gap-1">
                            Buy <ExternalLink className="h-3 w-3" />
                          </a>
                          <button onClick={() => handleAddToWishlist(p)} className="btn border-none bg-[#ea580c]/10 text-[#fdba74] text-xs hover:bg-[#ea580c]/20 py-2 px-3 flex items-center gap-1 cursor-pointer">
                            <Heart className="h-3.5 w-3.5" /> Wishlist
                          </button>
                          <button onClick={() => {
                            const target = prompt(`Enter target alert price for ${p.title} (current: ₹${p.price}):`);
                            if (target && !isNaN(parseFloat(target))) {
                              handleCreateAlert(p, parseFloat(target));
                            }
                          }} className="btn border-none bg-[#10b981]/10 text-[#6ee7b7] text-xs hover:bg-[#10b981]/20 py-2 px-3 flex items-center gap-1 cursor-pointer">
                            <Bell className="h-3.5 w-3.5" /> Alert
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {comparatorTab === "h2h" && (
              <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-6 animate-[fade_0.2s_ease]">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Swords className="h-4 w-4 text-[#fdba74]" />
                  <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider">Head-to-Head Product Battle</h4>
                </div>
                {compareResults.length < 2 ? (
                  <div className="text-sm text-[#9aa0b8]">Need at least 2 products to compare. Try another search query.</div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Product A</label>
                        <select
                          value={h2hProductA}
                          onChange={(e) => setH2hProductA(Number(e.target.value))}
                          className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                        >
                          {compareResults.map((p, idx) => (
                            <option key={idx} value={idx}>{p.title} (₹{p.price})</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> Product B</label>
                        <select
                          value={h2hProductB}
                          onChange={(e) => setH2hProductB(Number(e.target.value))}
                          className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                        >
                          {compareResults.map((p, idx) => (
                            <option key={idx} value={idx}>{p.title} (₹{p.price})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {h2hProductA === h2hProductB ? (
                      <div className="text-sm text-[#ea580c] font-bold">Please select two different products to compare.</div>
                    ) : (() => {
                      const a = compareResults[h2hProductA];
                      const b = compareResults[h2hProductB];
                      if (!a || !b) return null;

                      const metrics = [
                        { label: "Price", icon: IndianRupee, valA: a.price, valB: b.price, rawA: `₹${a.price}`, rawB: `₹${b.price}`, prefer: "lower" },
                        { label: "Rating", icon: Star, valA: a.rating, valB: b.rating, rawA: `${a.rating}★`, rawB: `${b.rating}★`, prefer: "higher" },
                        { label: "Reviews", icon: Users, valA: a.reviews_count, valB: b.reviews_count, rawA: `${a.reviews_count.toLocaleString()}`, rawB: `${b.reviews_count.toLocaleString()}`, prefer: "higher" },
                        { label: "Value Score", icon: Award, valA: a.best_value_score || 0, valB: b.best_value_score || 0, rawA: `${a.best_value_score || 0}`, rawB: `${b.best_value_score || 0}`, prefer: "higher" }
                      ];

                      let aWins = 0, bWins = 0;
                      metrics.forEach(m => {
                        if (m.prefer === "lower") {
                          if (m.valA < m.valB) aWins++;
                          else if (m.valB < m.valA) bWins++;
                        } else {
                          if (m.valA > m.valB) aWins++;
                          else if (m.valB > m.valA) bWins++;
                        }
                      });

                      const overallWinner = aWins >= bWins ? a : b;

                      return (
                        <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
                          <div className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 font-bold text-xs uppercase tracking-wider text-[#9aa0b8] border-b border-white/5 pb-2">
                            <div>Metric</div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Product A</div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> Product B</div>
                          </div>
                          {metrics.map((m, idx) => {
                            const aBetter = m.prefer === "lower" ? (m.valA < m.valB) : (m.valA > m.valB);
                            const bBetter = m.prefer === "lower" ? (m.valB < m.valA) : (m.valB > m.valA);
                            return (
                              <div key={idx} className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 text-xs border-b border-white/5 py-2.5 items-center">
                                <div className="text-white font-medium flex items-center gap-2"><m.icon className="h-3.5 w-3.5 text-[#9aa0b8]" /> {m.label}</div>
                                <div className={aBetter ? "text-[#6ee7b7] font-black" : "text-[#9aa0b8]"}>
                                  {m.rawA} {aBetter && "✓"}
                                </div>
                                <div className={bBetter ? "text-[#6ee7b7] font-black" : "text-[#9aa0b8]"}>
                                  {m.rawB} {bBetter && "✓"}
                                </div>
                              </div>
                            );
                          })}
                          <div className="bg-[#10b981]/10 border border-[#10b981]/25 p-4 rounded-xl flex items-center justify-center gap-2 mt-3 text-xs text-[#6ee7b7]">
                            <Award className="h-4 w-4" /> <strong>Winner: {overallWinner.title}</strong> — won {Math.max(aWins, bWins)} of {metrics.length} categories!
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {comparatorTab === "budget" && (
              <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-6 animate-[fade_0.2s_ease]">
                <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider">💰 Budget Mode filter</h4>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-xs text-[#9aa0b8] mb-1 font-bold">Max Budget (₹)</label>
                    <input 
                      type="number" 
                      value={budgetLimit} 
                      onChange={(e) => setBudgetLimit(Number(e.target.value) || 0)}
                      className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                </div>

                {(() => {
                  const within = compareResults.filter(p => p.price <= budgetLimit);
                  if (within.length === 0) {
                    return <div className="text-sm text-[#ea580c] font-bold">No products found under ₹{budgetLimit.toLocaleString()}. Try increasing your budget.</div>;
                  }
                  const sorted = [...within].sort((a, b) => (b.best_value_score || 0) - (a.best_value_score || 0));
                  const best = sorted[0];

                  return (
                    <div className="flex flex-col gap-4">
                      <div className="bg-[#10b981]/15 border border-[#10b981]/30 p-5 rounded-2xl relative shadow-[0_8px_30px_rgba(16,185,129,0.15)]">
                        <span className="absolute top-4 right-4 bg-[#10b981] text-[#0d0f0e] rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          Best Value Match
                        </span>
                        <span className="text-[10px] text-[#6ee7b7] uppercase font-bold tracking-wider">{best.platform}</span>
                        <h4 className="font-bold text-white text-base mt-1 leading-snug">{best.title}</h4>
                        <div className="text-2xl font-black text-white mt-3">₹{best.price}</div>
                        <div className="text-xs text-[#9aa0b8] mt-2">Value score: {best.best_value_score || 0} · {best.rating}★ ({best.reviews_count.toLocaleString()} reviews)</div>
                        <div className="flex gap-2 mt-4">
                          <a href={best.url} target="_blank" className="btn bg-[#10b981] text-[#0d0f0e] text-xs hover:bg-[#6ee7b7] py-2 px-4 rounded-lg font-bold">
                            Buy Now
                          </a>
                          <button onClick={() => handleAddToWishlist(best)} className="btn border-none bg-white/10 text-white text-xs hover:bg-white/20 py-2 px-3 flex items-center gap-1 cursor-pointer">
                            <Heart className="h-3.5 w-3.5" /> Wishlist
                          </button>
                        </div>
                      </div>

                      <h5 className="font-bold text-[#eeeef8] text-xs uppercase tracking-wider mt-4">Other products under ₹{budgetLimit.toLocaleString()} ({within.length - 1})</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sorted.slice(1).map((p, idx) => (
                          <div key={idx} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col hover:border-white/15 transition-all">
                            <span className="text-[10px] text-[#5b5f78] uppercase font-bold tracking-wider">{p.platform}</span>
                            <h4 className="font-bold text-white text-sm mt-1 leading-snug flex-1">{p.title}</h4>
                            <div className="text-lg font-black text-white mt-4">₹{p.price}</div>
                            <div className="flex gap-2 mt-4">
                              <a href={p.url} target="_blank" className="btn bg-white/5 border border-white/10 text-white text-xs hover:bg-[#18182a] py-2 px-3 flex items-center gap-1">
                                Buy <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
            <Search className="h-8 w-8 opacity-30" />
            <p className="text-xs">Compare a product above to display live deals.</p>
          </div>
        )}
      </div>
    ),
    assistant: (
      <div className="chat-wrap flex flex-col h-[calc(100vh-170px)] max-w-[840px] animate-[fade_0.3s_ease]">
        <div ref={chatScrollRef} className="chat-scroll flex-1 overflow-y-auto flex flex-col gap-4 p-2">
          {chatMessages.map((m, i) => (
            <div key={i} className={`msg flex gap-3 max-w-[90%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
              <div className={`msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 text-white ${
                m.role === "user" ? "bg-white/10" : "bg-gradient-to-r from-[#ea580c] to-[#10b981]"
              }`}>
                {m.role === "user" ? <X className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`msg-body text-sm px-4 py-3 rounded-2xl border ${
                m.role === "user" ? "bg-[#ea580c]/10 border-[#ea580c]/25" : "bg-[#12121e] border-white/5"
              }`}>
                {formatMd(m.text)}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="msg flex gap-3 self-start">
              <div className="msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="msg-body text-sm bg-[#12121e] border border-white/5 px-4 py-3 rounded-2xl flex items-center gap-2">
                Scanning platforms...
              </div>
            </div>
          )}
        </div>
        <div className="chat-input flex gap-2 border-t border-white/5 pt-4 mt-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
            placeholder="e.g. Find the best price for iPhone 15 Pro Max under 1.2 Lakhs" 
            className="flex-1 bg-[#0d0f0e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c]"
          />
          <button onClick={handleChatSend} className="btn bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white px-5 rounded-xl cursor-pointer">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    ),
    reviews: (
      <div className="flex flex-col gap-6 max-w-[760px] animate-[fade_0.3s_ease]">
        <div className="tool-intro text-sm text-[#9aa0b8] leading-relaxed">
          Paste review text blocks from any platform (Amazon, Flipkart) to extract pros, cons, consensus ratings, and buy/skip recommendations.
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8]">Product name</label>
          <input 
            type="text"
            value={reviewProd}
            onChange={(e) => setReviewProd(e.target.value)}
            placeholder="e.g. Sony WH-1000XM5"
            className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c]"
          />
          <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8]">Product Reviews Text</label>
          <textarea 
            rows={8}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Paste reviews here..."
            className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c] resize-y"
          />
          <button onClick={handleReviewSummarize} disabled={reviewLoading} className="btn w-full bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 cursor-pointer">
            {reviewLoading ? <span className="flex items-center gap-2 justify-center"><Loader2 className="h-4 w-4 animate-spin" /> Analyzing ratings...</span> : "Analyze Reviews"}
          </button>
        </div>
        {reviewResult && (
          <div className="result-text bg-[#12121e] border border-white/5 rounded-2xl p-6 text-sm leading-relaxed">
            {formatMd(reviewResult)}
          </div>
        )}
      </div>
    ),
    trends: (
      <div className="flex flex-col gap-6 max-w-[760px] animate-[fade_0.3s_ease]">
        <div className="tool-intro text-sm text-[#9aa0b8] leading-relaxed">
          Forecast product price trends over the next 12 weeks based on past historical aggregates.
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8]">Product keyword</label>
          <input 
            type="text"
            value={trendQuery}
            onChange={(e) => setTrendQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrendSearch()}
            placeholder="e.g. Samsung Galaxy S24 Ultra"
            className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c]"
          />
          <button onClick={handleTrendSearch} disabled={trendLoading} className="btn w-full bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white font-semibold py-3.5 rounded-xl cursor-pointer">
            {trendLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Check Price Trends"}
          </button>
        </div>
        {trendResult && (
          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider">Price trend report</h4>
            {trendResult.trend ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-[#9aa0b8]">{trendResult.message}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5b5f78]">Historical Low</span>
                    <div className="text-xl font-black text-white mt-1">₹{trendResult.low}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5b5f78]">Historical High</span>
                    <div className="text-xl font-black text-white mt-1">₹{trendResult.high}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#5b5f78]">Forecasted Trend</span>
                  <div className="w-full bg-[#18182a] h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#10b981] to-[#ea580c]" style={{ width: trendResult.trend === "downward" ? "30%" : "70%" }} />
                  </div>
                  <span className="text-xs text-[#6ee7b7] font-semibold mt-1">Status: {trendResult.trend.toUpperCase()} TREND EXPECTED</span>
                </div>
              </div>
            ) : (
              <div className="text-rose-400 text-sm">{trendResult.message}</div>
            )}
          </div>
        )}
      </div>
    ),
    wishlist: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="tool-intro text-sm text-[#9aa0b8] leading-relaxed">
          Your saved items wishlist. All records are stored locally in the database.
        </div>
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map(item => (
              <div key={item.id} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col">
                <span className="text-[10px] text-[#5b5f78] uppercase font-bold tracking-wider">{item.platform}</span>
                <h4 className="font-bold text-white text-sm mt-1 leading-snug flex-1">{item.title}</h4>
                <div className="text-2xl font-black text-white mt-4">₹{item.price}</div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-white/5">
                  <a href={item.url} target="_blank" className="btn bg-white/5 border border-white/10 text-white text-xs hover:bg-[#18182a] py-2 px-3 flex items-center gap-1">
                    Buy <ExternalLink className="h-3 w-3" />
                  </a>
                  <button onClick={() => handleDeleteWishlistItem(item.id)} className="btn border-none bg-rose-500/10 text-rose-400 text-xs hover:bg-rose-500/20 py-2 px-3 flex items-center gap-1 cursor-pointer ml-auto">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#5b5f78] py-20 text-sm">No items in your wishlist yet. Add items from comparator page.</div>
        )}
      </div>
    ),
    alerts: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="tool-intro text-sm text-[#9aa0b8] leading-relaxed">
          Your active target price alarms. You will be notified the moment the current price dips below your target.
        </div>
        {alerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alerts.map(alert => (
              <div key={alert.id} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col">
                <span className="text-[10px] text-[#5b5f78] uppercase font-bold tracking-wider">{alert.platform}</span>
                <h4 className="font-bold text-white text-sm mt-1 leading-snug flex-1">{alert.title}</h4>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-[10px] text-[#5b5f78] uppercase font-bold">Current Price</span>
                    <div className="text-lg font-black text-white mt-1">₹{alert.current_price}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5b5f78] uppercase font-bold">Target Price</span>
                    <div className="text-lg font-black text-[#6ee7b7] mt-1">₹{alert.target_price}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                  <span className="text-[10px] text-[#5b5f78]">{new Date(alert.created_at).toLocaleDateString()}</span>
                  <button onClick={() => handleDeleteAlert(alert.id)} className="btn border-none bg-rose-500/10 text-rose-400 text-xs hover:bg-rose-500/20 py-2 px-3 flex items-center gap-1 cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#5b5f78] py-20 text-sm">No price alerts set. Setup price alerts on comparator page.</div>
        )}
      </div>
    )
  };

  return (
    <div className="app-shell flex min-h-screen">
      {/* Sidebar */}
      <aside className={`sidebar w-[255px] shrink-0 bg-[#0d0f0e] border-r border-white/5 flex flex-col p-[18px_14px] fixed top-0 bottom-0 z-50 h-screen transition-transform duration-300 md:sticky ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="side-logo flex items-center gap-3 font-extrabold text-[15px] tracking-tight">
            <span className="logo-icon w-[34px] h-[34px] rounded-[10px] grid place-items-center text-white bg-gradient-to-br from-[#ea580c] to-[#10b981] shadow-[0_6px_16px_rgba(234,88,12,0.3)]">
              <ShoppingCartIcon className="h-4 w-4" />
            </span>
            <span className="text-white">AVP <span className="text-[#fdba74]">Emart</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white transition-all cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="side-nav flex flex-col gap-1.5 flex-1">
          <button onClick={() => { setActivePanel("dashboard"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "dashboard" ? "bg-[#ea580c]/15 text-[#fdba74]" : "text-[#8890aa] hover:bg-[#12121e] hover:text-white"}`}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          <button onClick={() => { setActivePanel("comparator"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "comparator" ? "bg-[#ea580c]/15 text-[#fdba74]" : "text-[#8890aa] hover:bg-[#12121e] hover:text-white"}`}>
            <Search className="h-4 w-4" /> Price Comparator
          </button>
          <button onClick={() => { setActivePanel("assistant"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "assistant" ? "bg-[#ea580c]/15 text-[#fdba74]" : "text-[#8890aa] hover:bg-[#12121e] hover:text-white"}`}>
            <Bot className="h-4 w-4" /> Shopping Copilot
          </button>
          <button onClick={() => { setActivePanel("reviews"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "reviews" ? "bg-[#ea580c]/15 text-[#fdba74]" : "text-[#8890aa] hover:bg-[#12121e] hover:text-white"}`}>
            <MessageSquare className="h-4 w-4" /> Review Intelligence
          </button>
          <button onClick={() => { setActivePanel("trends"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "trends" ? "bg-[#ea580c]/15 text-[#fdba74]" : "text-[#8890aa] hover:bg-[#12121e] hover:text-white"}`}>
            <TrendingUp className="h-4 w-4" /> Price Trends
          </button>
          <button onClick={() => { setActivePanel("wishlist"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "wishlist" ? "bg-[#ea580c]/15 text-[#fdba74]" : "text-[#8890aa] hover:bg-[#12121e] hover:text-white"}`}>
            <Heart className="h-4 w-4" /> Wishlist ({wishlist.length})
          </button>
          <button onClick={() => { setActivePanel("alerts"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "alerts" ? "bg-[#ea580c]/15 text-[#fdba74]" : "text-[#8890aa] hover:bg-[#12121e] hover:text-white"}`}>
            <Bell className="h-4 w-4" /> Price Alarms ({alerts.length})
          </button>
        </nav>

        <div className="side-foot flex flex-col gap-3 pt-4 border-t border-white/5 mt-auto"><button onClick={() => setSettingsOpen(true)} className="nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all text-[#8890aa] hover:bg-[#12121e] hover:text-white"> <Settings className="h-4 w-4" /> API Settings </button>
          <div className={`sysbadge flex items-center gap-2 text-[10.5px] font-mono rounded-lg border p-2.5 transition-all duration-300 ${
            llmEnabled ? "text-[#ea580c] border-[#ea580c]/30 bg-[#ea580c]/5" : "text-[#8890aa] border-white/5 bg-[#12121e]"
          }`}>
            <i className={`fas fa-circle ${llmEnabled ? "text-[#ea580c]" : "text-[#5b5f78]"} text-[6px]`}></i>
            {llmEnabled ? "LLM Ready" : "Offline Mode"}
          </div>
          <Link href="/" className="side-back flex items-center gap-2 text-xs text-[#8890aa] hover:text-white py-1 transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to landing page
          </Link>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="main flex-1 flex flex-col min-w-0">
        <header className="topbar sticky top-0 bg-[#060609]/95 backdrop-blur-md border-b border-white/5 z-20 flex items-center gap-4 px-6 md:px-12 py-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden w-10 h-10 rounded-lg bg-[#12121e] border border-white/10 flex items-center justify-center text-white cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-white capitalize">{activePanel}</h1>
            <p className="text-xs text-[#9aa0b8] mt-0.5">AI Smart Shopping Portal</p>
          </div>
          <div className="ml-auto hidden md:block">
            <span className="prov-chip font-mono text-[11px] font-semibold text-[#fdba74] bg-[#ea580c]/10 border border-[#ea580c]/25 px-3 py-1.5 rounded-full">
              <Cpu className="h-3 w-3 inline mr-1.5" />
              {llmEnabled ? providerName : "Offline AI Engine"} · 4 Platforms compared
            </span>
          </div>
        </header>

        <main className="panels p-6 md:p-12 max-w-[1180px] w-full flex-1">
          {panels[activePanel]}
        </main>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0f0e] border border-white/10 rounded-2xl p-6 max-w-md w-full flex flex-col gap-4 animate-[fade_0.2s_ease]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure API Keys</h3>
              <button onClick={() => setSettingsOpen(false)} className="text-white/50 hover:text-white transition-all cursor-pointer bg-transparent border-none">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3 text-xs text-[#9aa0b8]">
              <p>Keys are stored locally in your browser (localStorage) and sent only in the request headers.</p>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">Groq API Key</label>
                <input type="password" value={groqKey} onChange={(e) => setGroqKey(e.target.value)} placeholder="gsk_..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">Gemini API Key</label>
                <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">OpenAI API Key</label>
                <input type="password" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} placeholder="sk-proj-..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">SerpAPI Key</label>
                <input type="password" value={serpapiKey} onChange={(e) => setSerpapiKey(e.target.value)} placeholder="..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">HuggingFace Token</label>
                <input type="password" value={huggingfaceKey} onChange={(e) => setHuggingfaceKey(e.target.value)} placeholder="hf_..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">Mistral API Key</label>
                <input type="password" value={mistralKey} onChange={(e) => setMistralKey(e.target.value)} placeholder="..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
            </div>
            <div className="flex gap-3 justify-end border-t border-white/5 pt-4">
              <button onClick={() => setSettingsOpen(false)} className="btn bg-white/5 border border-white/10 text-xs text-white px-4 py-2 rounded-lg hover:bg-[#18182a] cursor-pointer">
                Cancel
              </button>
              <button onClick={() => {
                localStorage.setItem("user_groq_key", groqKey);
                localStorage.setItem("user_gemini_key", geminiKey);
                localStorage.setItem("user_openai_key", openaiKey);
                localStorage.setItem("user_serpapi_key", serpapiKey);
                localStorage.setItem("user_huggingface_key", huggingfaceKey);
                localStorage.setItem("user_mistral_key", mistralKey);
                setSettingsOpen(false);
                window.location.reload();
              }} className="btn bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer border-none">
                Save & Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon fallback
function ShoppingCartIcon({ className }: { className?: string }) {
  return <i className={`fas fa-cart-shopping ${className || ""}`} style={{ fontSize: "inherit" }}></i>;
}

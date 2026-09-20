"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, Circle, Clock, ExternalLink, Play, BookOpen, ChevronRight, Layers, Sparkles } from "lucide-react";

export interface DAGNode {
  id: string;
  label: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "completed" | "in-progress" | "locked";
  x: number;
  y: number;
  prerequisites: string[];
  summary: string;
  resources: { title: string; type: "video" | "article" | "exercise"; url: string; duration: string }[];
}

interface KnowledgeDAGProps {
  initialNodes?: DAGNode[];
  onNodeSelect?: (node: DAGNode) => void;
  className?: string;
}

const defaultNodes: DAGNode[] = [
  {
    id: "python-core",
    label: "Python Core & Modern Syntax",
    category: "Foundations",
    difficulty: "Beginner",
    status: "completed",
    x: 120,
    y: 180,
    prerequisites: [],
    summary: "Variables, list comprehensions, type hinting, generators, and async/await fundamentals.",
    resources: [
      { title: "Python 3.12 Deep Dive", type: "video", url: "#", duration: "45m" },
      { title: "Asynchronous Concurrency in Python", type: "article", url: "#", duration: "15m" }
    ]
  },
  {
    id: "math-linear-algebra",
    label: "Vectors, Matrices & Tensors",
    category: "Foundations",
    difficulty: "Beginner",
    status: "completed",
    x: 120,
    y: 380,
    prerequisites: [],
    summary: "Dot products, matrix multiplication, eigenvalues, and dimensional reduction.",
    resources: [
      { title: "Essence of Linear Algebra", type: "video", url: "#", duration: "1h 10m" }
    ]
  },
  {
    id: "ml-numpy-pandas",
    label: "Data Wrangling (NumPy & Pandas)",
    category: "Data Engineering",
    difficulty: "Beginner",
    status: "completed",
    x: 360,
    y: 280,
    prerequisites: ["python-core", "math-linear-algebra"],
    summary: "Array broadcasting, vectorization, dataframe transforms, and handling missing telemetry.",
    resources: [
      { title: "Vectorized Operations in NumPy", type: "article", url: "#", duration: "25m" }
    ]
  },
  {
    id: "neural-networks",
    label: "Neural Network Architectures",
    category: "Deep Learning",
    difficulty: "Intermediate",
    status: "in-progress",
    x: 620,
    y: 200,
    prerequisites: ["ml-numpy-pandas"],
    summary: "Backpropagation, gradient descent, loss functions, activation curves (ReLU, GELU).",
    resources: [
      { title: "Building Micrograd from Scratch", type: "video", url: "#", duration: "2h 15m" },
      { title: "Backprop Calculus Explained", type: "article", url: "#", duration: "30m" }
    ]
  },
  {
    id: "transformer-attention",
    label: "Self-Attention & Transformers",
    category: "GenAI",
    difficulty: "Advanced",
    status: "locked",
    x: 880,
    y: 200,
    prerequisites: ["neural-networks"],
    summary: "Scaled dot-product attention, multi-head mechanisms, positional encodings (RoPE).",
    resources: [
      { title: "Attention Is All You Need Paper Teardown", type: "article", url: "#", duration: "40m" }
    ]
  },
  {
    id: "langgraph-agents",
    label: "Autonomous Multi-Agent DAGs (LangGraph)",
    category: "Agentic Systems",
    difficulty: "Advanced",
    status: "locked",
    x: 1140,
    y: 280,
    prerequisites: ["transformer-attention"],
    summary: "Cyclic state graphs, checkpointing memory, tool call arbitration, and multi-agent consensus.",
    resources: [
      { title: "Production Agent Workflows with LangGraph", type: "video", url: "#", duration: "1h 30m" }
    ]
  },
  {
    id: "vector-databases",
    label: "Embeddings & Vector Databases (ChromaDB)",
    category: "Information Retrieval",
    difficulty: "Intermediate",
    status: "in-progress",
    x: 620,
    y: 380,
    prerequisites: ["ml-numpy-pandas"],
    summary: "Cosine distance, HNSW indexing, chunking strategies, hybrid BM25 + dense retrieval.",
    resources: [
      { title: "Vector Search Foundations", type: "article", url: "#", duration: "20m" }
    ]
  },
  {
    id: "rag-reranking",
    label: "Advanced RAG & ColBERT Rerankers",
    category: "Information Retrieval",
    difficulty: "Advanced",
    status: "locked",
    x: 880,
    y: 380,
    prerequisites: ["vector-databases"],
    summary: "Contextual compression, reciprocal rank fusion, cross-encoder reranking, HyDE prompts.",
    resources: [
      { title: "Production RAG Architecture", type: "article", url: "#", duration: "35m" }
    ]
  }
];

export function KnowledgeDAG({
  initialNodes = defaultNodes,
  onNodeSelect,
  className = "",
}: KnowledgeDAGProps) {
  const [nodes, setNodes] = useState<DAGNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<DAGNode>(initialNodes[0]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".dag-node") || (e.target as HTMLElement).closest(".dag-panel")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const toggleNodeStatus = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id !== nodeId) return n;
      const nextStatus = n.status === "completed" ? "in-progress" : n.status === "in-progress" ? "completed" : "in-progress";
      return { ...n, status: nextStatus };
    }));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => {
        const nextStatus = prev.status === "completed" ? "in-progress" : prev.status === "in-progress" ? "completed" : "in-progress";
        return { ...prev, status: nextStatus };
      });
    }
  };

  return (
    <div className={`relative w-full h-[650px] bg-[#050814] border border-slate-800/80 rounded-2xl overflow-hidden select-none ${className}`}>
      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-slate-300">
        <span className="flex items-center gap-2 text-sky-400">
          <Layers className="w-4 h-4" />
          <span>Interactive Knowledge DAG (learn-anything.xyz engine)</span>
        </span>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> In Progress</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-600" /> Locked</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
          className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-mono text-sm"
        >
          +
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
          className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-mono text-sm"
        >
          -
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="px-2.5 h-8 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs"
        >
          Reset
        </button>
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 0.1s ease-out"
          }}
          className="absolute inset-0 pointer-events-auto"
        >
          {/* SVG Connections */}
          <svg className="absolute inset-0 w-[2000px] h-[1000px] pointer-events-none">
            <defs>
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            {nodes.map(node => {
              return node.prerequisites.map(prereqId => {
                const source = nodes.find(n => n.id === prereqId);
                if (!source) return null;
                const sx = source.x + 100;
                const sy = source.y + 25;
                const tx = node.x;
                const ty = node.y + 25;
                const mx = (sx + tx) / 2;
                return (
                  <path
                    key={`${source.id}->${node.id}`}
                    d={`M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`}
                    fill="none"
                    stroke={node.status === "completed" ? "#10b981" : "url(#edgeGradient)"}
                    strokeWidth={node.status === "completed" ? 2.5 : 1.8}
                    strokeDasharray={node.status === "locked" ? "4 4" : "none"}
                    opacity={node.status === "locked" ? 0.35 : 0.85}
                  />
                );
              });
            })}
          </svg>

          {/* Node Cards */}
          {nodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                  onNodeSelect?.(node);
                }}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className={`dag-node absolute w-56 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 border-sky-400 shadow-lg shadow-sky-500/20 scale-105 z-10"
                    : node.status === "completed"
                    ? "bg-slate-950/90 border-emerald-500/40 hover:border-emerald-400"
                    : node.status === "in-progress"
                    ? "bg-slate-950/90 border-amber-500/40 hover:border-amber-400"
                    : "bg-slate-950/60 border-slate-800/60 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {node.category}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    node.difficulty === "Beginner" ? "text-emerald-400" : node.difficulty === "Intermediate" ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {node.difficulty}
                  </span>
                </div>
                <div className="font-semibold text-xs text-slate-100 line-clamp-1">{node.label}</div>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    {node.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {node.status === "in-progress" && <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
                    {node.status === "locked" && <Circle className="w-3.5 h-3.5 text-slate-600" />}
                    <span className="capitalize">{node.status}</span>
                  </span>
                  <span className="text-[10px] text-sky-400 hover:underline">Inspect →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="dag-panel absolute bottom-4 right-4 z-20 w-80 max-h-[380px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl p-4 shadow-2xl overflow-y-auto text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-[10px] uppercase text-sky-400 tracking-wider">
              {selectedNode.category} · {selectedNode.difficulty}
            </span>
            <button
              onClick={() => toggleNodeStatus(selectedNode.id)}
              className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                selectedNode.status === "completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {selectedNode.status === "completed" ? "✓ Mastered" : "Mark Complete"}
            </button>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-100">{selectedNode.label}</h4>
            <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">{selectedNode.summary}</p>
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Curated Learning Resources</span>
            </div>
            <div className="space-y-1.5">
              {selectedNode.resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-sky-500/40 transition-colors group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {res.type === "video" ? (
                      <Play className="w-3 h-3 text-rose-400 shrink-0" />
                    ) : (
                      <ExternalLink className="w-3 h-3 text-sky-400 shrink-0" />
                    )}
                    <span className="text-[11px] text-slate-300 truncate group-hover:text-sky-300">
                      {res.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{res.duration}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

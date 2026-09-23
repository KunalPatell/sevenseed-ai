/* ============================================================
   AVPU shared topic graph + search catalogue.

   Single source of truth for two pages:
     - learn-dag.html     consumes AVPU_TOPICS.nodes (canvas DAG)
     - topic-search.html  consumes both nodes and catalogue

   Keep it here rather than inline so the two pages can't drift apart.
   Node fields x/y are canvas coordinates used only by learn-dag.html.
   ============================================================ */
(function (root) {
  'use strict';

  /* Prerequisite DAG for AI engineering. `next` lists downstream topics,
     so prerequisites are derived by reversing the edges.

     `searchAliases` exists because titles are not what people type: it carries
     spelling variants (quantisation/quantization), tool names, and the plain
     words a learner would actually search for. topic-search.html indexes them;
     learn-dag.html ignores them. */
  var nodes = [
    { id: 'py', title: 'Python for AI', emoji: '🐍', x: 120, y: 120, cat: 'foundation', tier: 'Beginner', time: '14 Hours', desc: 'Core language syntax, vectorized computing, asynchronous I/O, and typing for AI pipelines.', prereqs: ['Basic Logic'], resources: ['Python 3 Official Docs', 'RealPython NumPy Tutorial'], next: ['math', 'numpy'], searchAliases: ['python', 'programming', 'coding basics', 'syntax', 'async', 'type hints'] },
    { id: 'math', title: 'Linear Algebra & Calculus', emoji: '📐', x: 340, y: 120, cat: 'foundation', tier: 'Beginner', time: '20 Hours', desc: 'Matrix multiplication, eigenvalues, dot products, partial derivatives, and gradient descent mechanics.', prereqs: ['Python for AI'], resources: ['3Blue1Brown Essence of LinAlg', 'Khan Academy Multivariable Calculus'], next: ['pytorch'], searchAliases: ['linear algebra', 'calculus', 'matrix', 'matrices', 'gradient descent', 'eigenvalues', 'vectors', 'derivatives', 'maths', 'math'] },
    { id: 'numpy', title: 'NumPy & Pandas Vectorization', emoji: '📊', x: 120, y: 280, cat: 'foundation', tier: 'Beginner', time: '12 Hours', desc: 'Multi-dimensional array slicing, broadcasting rules, memory buffers, and DataFrame transformations.', prereqs: ['Python for AI'], resources: ['100 NumPy Exercises', 'Pandas Cookbook'], next: ['pytorch'], searchAliases: ['numpy', 'pandas', 'dataframe', 'arrays', 'broadcasting', 'vectorisation', 'vectorization', 'data wrangling'] },
    { id: 'pytorch', title: 'PyTorch & AutoGrad Engine', emoji: '🔥', x: 340, y: 280, cat: 'deep-learning', tier: 'Intermediate', time: '28 Hours', desc: 'Dynamic computational graphs, tensor GPU allocation, backpropagation with autograd, and custom nn.Module architectures.', prereqs: ['Linear Algebra', 'NumPy'], resources: ['PyTorch 60-Minute Blitz', 'Karpathy: Micrograd from Scratch'], next: ['transformers', 'cv'], searchAliases: ['pytorch', 'torch', 'autograd', 'backpropagation', 'backprop', 'neural network', 'deep learning', 'tensors', 'training', 'gpu'] },
    { id: 'cv', title: 'Computer Vision & YOLOv8', emoji: '👁️', x: 120, y: 440, cat: 'deep-learning', tier: 'Intermediate', time: '22 Hours', desc: 'Convolutional kernels, spatial convolutions, bounding box regression, and YOLO real-time inference.', prereqs: ['PyTorch & AutoGrad'], resources: ['Ultralytics YOLO Docs', 'CS231n Stanford Notes'], next: ['prod'], searchAliases: ['yolo', 'yolov8', 'computer vision', 'object detection', 'image recognition', 'opencv', 'cnn', 'convolution', 'bounding box'] },
    { id: 'transformers', title: 'Attention & Transformers', emoji: '⚡', x: 560, y: 200, cat: 'deep-learning', tier: 'Intermediate', time: '32 Hours', desc: 'Self-attention math: softmax(Q*K^T / sqrt(d))*V, multi-head projection, positional embeddings, and encoder-decoder stacks.', prereqs: ['PyTorch & AutoGrad'], resources: ['Illustrated Transformer by Jay Alammar', 'Attention Is All You Need (Original Paper)'], next: ['rag', 'llm'], searchAliases: ['attention', 'self attention', 'transformer', 'transformers', 'multi head', 'positional encoding', 'bert', 'gpt architecture', 'encoder decoder'] },
    { id: 'rag', title: 'Vector DBs & RAG Architecture', emoji: '🗄️', x: 560, y: 380, cat: 'llm-agents', tier: 'Intermediate', time: '24 Hours', desc: 'Dense passage retrieval, HNSW cosine index, embedding chunking strategies, hybrid keyword-vector search, and ChromaDB.', prereqs: ['Attention & Transformers'], resources: ['Pinecone Vector Search Handbook', 'LangChain Retrieval Strategies'], next: ['agents'], searchAliases: ['rag', 'retrieval', 'vector database', 'vector db', 'embeddings', 'chromadb', 'pinecone', 'hnsw', 'chunking', 'semantic search'] },
    { id: 'llm', title: 'Fine-Tuning & Quantization (LoRA)', emoji: '🎛️', x: 780, y: 160, cat: 'llm-agents', tier: 'Advanced', time: '30 Hours', desc: 'Parameter-efficient fine-tuning (PEFT), LoRA adapter rank matrices, 4-bit / 8-bit QLoRA, and vLLM serving.', prereqs: ['Attention & Transformers'], resources: ['HuggingFace PEFT Guide', 'Unsloth Fast Fine-Tuning'], next: ['prod'], searchAliases: ['lora', 'qlora', 'quantisation', 'quantization', 'quantize', 'fine tuning', 'finetune', 'peft', 'adapter', 'vllm', '4 bit', 'training a model'] },
    { id: 'agents', title: 'LangGraph & Multi-Agent Systems', emoji: '🤖', x: 780, y: 340, cat: 'llm-agents', tier: 'Advanced', time: '35 Hours', desc: 'Cyclic state machines, supervisor routers, tool execution sandboxes, episodic memory buffers, and human-in-the-loop validation.', prereqs: ['RAG Architecture'], resources: ['LangGraph Conceptual Guides', 'CrewAI Production Patterns'], next: ['eval'], searchAliases: ['agents', 'agent', 'langgraph', 'langchain', 'crewai', 'multi agent', 'supervisor', 'tool calling', 'autonomous', 'state machine'] },
    { id: 'eval', title: 'LLM Evaluation & Guardrails', emoji: '🛡️', x: 980, y: 340, cat: 'llm-agents', tier: 'Advanced', time: '18 Hours', desc: 'Ragas evaluation framework (Faithfulness, Answer Relevance), prompt injection defenses, and semantic validation guardrails.', prereqs: ['LangGraph & Multi-Agent Systems'], resources: ['Ragas Metrics Guide', 'NeMo Guardrails'], next: ['prod'], searchAliases: ['evaluation', 'evals', 'guardrails', 'ragas', 'prompt injection', 'hallucination', 'faithfulness', 'testing llms', 'safety'] },
    { id: 'prod', title: 'High-Throughput Serving & Docker', emoji: '🚀', x: 980, y: 180, cat: 'mlops', tier: 'Advanced', time: '25 Hours', desc: 'FastAPI async streaming, continuous batching with vLLM, TensorRT-LLM, Docker multi-stage builds, and Render / AWS deployment.', prereqs: ['LLM Fine-Tuning', 'Multi-Agent Systems'], resources: ['vLLM Architecture Paper', 'Docker for ML Best Practices'], next: [], searchAliases: ['deployment', 'deploy', 'docker', 'serving', 'fastapi', 'inference', 'throughput', 'production', 'mlops', 'scaling', 'batching'] }
  ];

  /* Everything else on AVPU that a search should be able to resolve.
     `aliases` carry the words people actually type; `weight` is a popularity
     prior so common intents win ties. */
  var catalogue = [
    // --- Interactive labs / tools ---
    { title: 'Interactive Knowledge DAG Graph', kind: 'Lab', page: 'learn-dag.html', weight: 0.9, aliases: ['dag', 'knowledge graph', 'prerequisites', 'roadmap', 'learning path', 'dependency tree', 'topic graph'], blurb: 'Pan and zoom the full prerequisite tree for AI engineering.' },
    { title: 'Spaced Repetition Review Queue', kind: 'Lab', page: 'review-queue.html', weight: 0.9, aliases: ['flashcards', 'spaced repetition', 'srs', 'anki', 'revision', 'memorise', 'memorize', 'review', 'sm-2', 'recall'], blurb: 'SM-2 scheduling across every AVPU deck — grade recall, the algorithm picks the next date.' },
    { title: 'In-Browser Code Lab', kind: 'Lab', page: 'code-lab.html', weight: 0.85, aliases: ['code', 'coding', 'editor', 'practice', 'exercises', 'freecodecamp', 'tests', 'assertions', 'ide'], blurb: 'Write code against real assertion tests and earn a verifiable certificate.' },
    { title: 'Duolingo AI Mastery League', kind: 'Lab', page: 'duo-league.html', weight: 0.8, aliases: ['league', 'streak', 'xp', 'gamification', 'leaderboard', 'duolingo', 'hearts', 'compete'], blurb: 'Streaks, XP, hearts and weekly promotion across Bronze to Diamond.' },
    { title: 'Laws of UX Cognitive Lab', kind: 'Lab', page: 'laws-of-ux.html', weight: 0.85, aliases: ['ux', 'design', 'usability', 'fitts', 'hicks', 'miller', 'jakob', 'psychology', 'laws of ux', 'interface', 'ui'], blurb: 'All 21 laws with interactive benches — Fitts stopwatch, Hick choice simulator.' },
    { title: 'Mental Models Decision Engine', kind: 'Lab', page: 'mental-models.html', weight: 0.85, aliases: ['mental models', 'thinking', 'decisions', 'inversion', 'first principles', 'farnam street', 'bias', 'reasoning'], blurb: 'Apply a model to a real decision and record the reasoning.' },
    { title: 'AI Learning Path Generator', kind: 'Tool', page: 'ai-learning-path.html', weight: 0.9, aliases: ['generate', 'custom path', 'plan', 'syllabus', 'curriculum', 'schedule', 'goal', 'personalised', 'personalized'], blurb: 'State a goal and an hours-per-week budget, get a generated multi-week plan.' },
    { title: '24/7 Personal AI Study Assistant', kind: 'Tool', page: 'ai-tutor.html', weight: 0.8, aliases: ['tutor', 'ask', 'help', 'explain', 'chatbot', 'socratic', 'doubt', 'question'], blurb: 'Socratic tutoring that asks back instead of handing over the answer.' },
    { title: '100-Day AI Challenge', kind: 'Program', page: '100-day-challenge.html', weight: 0.8, aliases: ['100 days', 'challenge', 'habit', 'daily', 'streak calendar', 'consistency', 'no-code'], blurb: 'One task a day for 100 days, with a streak calendar and progress ring.' },
    { title: 'Marketing & Growth Teardowns', kind: 'Lab', page: 'marketing-teardowns.html', weight: 0.7, aliases: ['marketing', 'growth', 'teardown', 'copywriting', 'funnel', 'acquisition', 'flywheel'], blurb: 'Screenshot-led teardowns tagged by tactic.' },

    // --- Curriculum / credentials ---
    { title: 'Varsity Module Library', kind: 'Curriculum', page: 'modules.html', weight: 0.85, aliases: ['varsity', 'modules', 'chapters', 'finance', 'stocks', 'trading', 'markets', 'investing', 'options', 'zerodha'], blurb: 'Chaptered, depth-ordered, paywall-free curriculum.' },
    { title: 'Course Catalogue', kind: 'Curriculum', page: 'courses.html', weight: 0.9, aliases: ['courses', 'catalogue', 'catalog', 'enroll', 'enrol', 'browse', 'subjects', 'swayam', 'all courses'], blurb: 'Every AVPU course with level and provider filters.' },
    { title: 'Certifications', kind: 'Credential', page: 'certifications.html', weight: 0.8, aliases: ['certificate', 'certification', 'credential', 'badge', 'exam', 'proof'], blurb: 'Free certification tracks gated on real project completion.' },
    { title: 'Verify a Certificate', kind: 'Credential', page: 'verify.html', weight: 0.6, aliases: ['verify', 'validate', 'check certificate', 'authenticity', 'employer'], blurb: 'Public verification for any certificate ID AVPU has issued.' },
    { title: 'Scholarships', kind: 'Program', page: 'scholarships.html', weight: 0.7, aliases: ['scholarship', 'financial aid', 'free', 'fee waiver', 'grant', 'credits'], blurb: 'Scholarship and credit routes — everything on AVPU is free regardless.' },
    { title: 'Aceternity Evervault Code Lab', kind: 'Lab', page: 'evervault-lab.html', weight: 0.5, aliases: ['evervault', 'aceternity', 'effects', 'animation', 'matrix', 'showcase'], blurb: 'The motion and effects showcase built on the shared design layer.' }
  ];

  /* Deck-level cards live in review-queue.html; these are the concept entries a
     search should resolve straight into a study action. */
  var concepts = [
    { title: "Fitt's Law", page: 'laws-of-ux.html', kind: 'Concept', weight: 0.6, aliases: ['fitts', 'target size', 'button size', 'pointing'] },
    { title: "Hick's Law", page: 'laws-of-ux.html', kind: 'Concept', weight: 0.6, aliases: ['hicks', 'choice', 'too many options', 'decision time'] },
    { title: "Miller's Law", page: 'laws-of-ux.html', kind: 'Concept', weight: 0.5, aliases: ['miller', 'working memory', 'chunking', '7 plus minus 2'] },
    { title: "Jakob's Law", page: 'laws-of-ux.html', kind: 'Concept', weight: 0.5, aliases: ['jakob', 'convention', 'familiarity'] },
    { title: 'Peak-End Rule', page: 'laws-of-ux.html', kind: 'Concept', weight: 0.5, aliases: ['peak end', 'memory of experience'] },
    { title: 'Doherty Threshold', page: 'laws-of-ux.html', kind: 'Concept', weight: 0.5, aliases: ['doherty', 'response time', '400ms', 'latency'] },
    { title: "Tesler's Law", page: 'laws-of-ux.html', kind: 'Concept', weight: 0.45, aliases: ['tesler', 'conservation of complexity'] },
    { title: 'Inversion', page: 'mental-models.html', kind: 'Concept', weight: 0.55, aliases: ['invert', 'work backwards', 'avoid failure'] },
    { title: 'Second-Order Thinking', page: 'mental-models.html', kind: 'Concept', weight: 0.55, aliases: ['second order', 'consequences', 'and then what'] },
    { title: 'Circle of Competence', page: 'mental-models.html', kind: 'Concept', weight: 0.5, aliases: ['competence', 'know your limits'] },
    { title: 'Margin of Safety', page: 'mental-models.html', kind: 'Concept', weight: 0.5, aliases: ['margin of safety', 'buffer', 'slack', 'runway'] },
    { title: 'Bayesian Updating', page: 'mental-models.html', kind: 'Concept', weight: 0.5, aliases: ['bayes', 'base rate', 'priors', 'probability'] },
    { title: "Hanlon's Razor", page: 'mental-models.html', kind: 'Concept', weight: 0.4, aliases: ['hanlon', 'malice', 'incompetence'] },
    { title: "Occam's Razor", page: 'mental-models.html', kind: 'Concept', weight: 0.45, aliases: ['occam', 'simplest explanation', 'parsimony'] },
    { title: 'P/E Ratio', page: 'modules.html', kind: 'Concept', weight: 0.5, aliases: ['pe ratio', 'price to earnings', 'valuation'] },
    { title: 'Return on Equity (DuPont)', page: 'modules.html', kind: 'Concept', weight: 0.45, aliases: ['roe', 'dupont', 'leverage', 'return on equity'] },
    { title: 'Option Theta & Time Decay', page: 'modules.html', kind: 'Concept', weight: 0.45, aliases: ['theta', 'time decay', 'options', 'greeks', 'expiry'] },
    { title: 'Free Cash Flow', page: 'modules.html', kind: 'Concept', weight: 0.45, aliases: ['fcf', 'cash flow', 'capex'] }
  ];

  root.AVPU_TOPICS = { nodes: nodes, catalogue: catalogue, concepts: concepts };
})(typeof window !== 'undefined' ? window : this);

"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Layers, ChevronLeft, ChevronRight, Shuffle, RotateCcw } from "lucide-react";

interface Card {
  front: string;
  back: string;
}

const DECKS: Record<string, Card[]> = {
  Python: [
    { front: "What is a list comprehension?", back: "A concise way to build a list: [expr for x in iterable if cond]. Faster and more readable than an equivalent for-loop." },
    { front: "Difference between a list and a tuple?", back: "Lists are mutable and use []. Tuples are immutable and use (). Tuples are hashable (can be dict keys/set members) if their contents are." },
    { front: "What is a decorator?", back: "A function that wraps another function to extend its behavior without modifying its code, applied with @decorator syntax." },
    { front: "What does GIL stand for?", back: "Global Interpreter Lock — a mutex in CPython that allows only one thread to execute Python bytecode at a time, limiting true CPU-bound multithreading." },
    { front: "What is a generator?", back: "A function using 'yield' that produces a lazy iterator, computing values on demand instead of building a full list in memory." },
    { front: "*args vs **kwargs?", back: "*args collects extra positional arguments into a tuple; **kwargs collects extra keyword arguments into a dict." },
    { front: "What is PEP 8?", back: "Python's official style guide covering naming conventions, indentation (4 spaces), line length, and other formatting standards." },
    { front: "Shallow copy vs deep copy?", back: "A shallow copy (copy.copy) duplicates the outer object but shares nested references; a deep copy (copy.deepcopy) recursively duplicates everything." },
    { front: "What is a context manager?", back: "An object implementing __enter__/__exit__ (or used via 'with'), used to reliably acquire and release resources like files or locks." },
    { front: "What are Python's built-in mutable types?", back: "list, dict, set, and bytearray. Strings, tuples, int, float, and frozenset are immutable." },
  ],
  "Machine Learning": [
    { front: "Bias-variance tradeoff?", back: "High bias underfits (too simple); high variance overfits (too sensitive to training data). Good models balance both to generalize well." },
    { front: "What is overfitting?", back: "When a model learns noise/specifics of training data instead of general patterns, performing well on train data but poorly on unseen data." },
    { front: "L1 vs L2 regularization?", back: "L1 (Lasso) adds |weights|, encourages sparsity (some weights become 0). L2 (Ridge) adds weights², shrinks weights smoothly without zeroing them." },
    { front: "What is cross-validation?", back: "A technique to evaluate model generalization by splitting data into k folds, training on k-1 and validating on the remaining fold, rotating through all folds." },
    { front: "Precision vs Recall?", back: "Precision = TP/(TP+FP), how many predicted positives are correct. Recall = TP/(TP+FN), how many actual positives were found." },
    { front: "What is gradient descent?", back: "An iterative optimization algorithm that updates parameters in the direction of the negative gradient of a loss function to minimize it." },
    { front: "What is a confusion matrix?", back: "A table showing true positives, false positives, true negatives, and false negatives — used to evaluate classification performance." },
    { front: "What is feature scaling and why does it matter?", back: "Normalizing/standardizing feature ranges so no single feature dominates due to scale — critical for distance-based and gradient-based algorithms." },
    { front: "What is an ensemble method?", back: "Combining multiple models (e.g. bagging, boosting, stacking) to produce better predictive performance than any single model alone." },
    { front: "What is the curse of dimensionality?", back: "As feature count grows, data becomes sparse in high-dimensional space, making distance metrics less meaningful and models harder to generalize." },
  ],
  SQL: [
    { front: "INNER JOIN vs LEFT JOIN?", back: "INNER JOIN returns only matching rows in both tables. LEFT JOIN returns all rows from the left table plus matches from the right (NULL if no match)." },
    { front: "What is a primary key?", back: "A column (or set of columns) that uniquely identifies each row in a table; cannot be NULL and must be unique." },
    { front: "What is normalization?", back: "Organizing tables to reduce redundancy and dependency, typically through normal forms (1NF, 2NF, 3NF) by splitting data into related tables." },
    { front: "WHERE vs HAVING?", back: "WHERE filters rows before grouping/aggregation. HAVING filters groups after a GROUP BY, often used with aggregate functions like COUNT() or SUM()." },
    { front: "What is an index?", back: "A data structure (often B-tree) that speeds up row lookups on a column at the cost of extra storage and slower writes." },
    { front: "What is a foreign key?", back: "A column that references the primary key of another table, enforcing referential integrity between related tables." },
    { front: "What does GROUP BY do?", back: "Groups rows sharing the same values in specified columns so aggregate functions (COUNT, SUM, AVG) can be applied per group." },
    { front: "What is a transaction and ACID?", back: "A transaction is a unit of work that is Atomic, Consistent, Isolated, and Durable — either fully applied or fully rolled back." },
    { front: "What is a subquery?", back: "A query nested inside another query, usable in SELECT, WHERE, or FROM clauses to compute intermediate results." },
    { front: "UNION vs UNION ALL?", back: "UNION merges result sets and removes duplicates. UNION ALL merges them and keeps all duplicates, making it faster." },
  ],
  "System Design": [
    { front: "What is horizontal vs vertical scaling?", back: "Horizontal scaling adds more machines (scale out). Vertical scaling adds more resources (CPU/RAM) to one machine (scale up)." },
    { front: "What is a load balancer?", back: "A component that distributes incoming traffic across multiple servers to improve availability, reliability, and throughput." },
    { front: "What is caching and where is it used?", back: "Storing frequently accessed data in fast storage (memory) to reduce latency and database load — e.g. CDN, Redis, browser cache." },
    { front: "CAP theorem?", back: "A distributed system can only guarantee two of three: Consistency, Availability, Partition tolerance — at the same time." },
    { front: "What is database sharding?", back: "Splitting a database horizontally across multiple servers by a shard key, so each server holds a subset of the data." },
    { front: "What is a message queue used for?", back: "Decoupling producers and consumers, enabling asynchronous processing, buffering load spikes, and improving system resilience (e.g. Kafka, RabbitMQ)." },
    { front: "What is eventual consistency?", back: "A consistency model where replicas may be temporarily out of sync but converge to the same state over time, given no new updates." },
    { front: "What is a CDN?", back: "Content Delivery Network — a distributed set of edge servers that cache and serve static content closer to users, reducing latency." },
    { front: "What is rate limiting?", back: "Restricting the number of requests a client can make in a time window to protect a service from overload or abuse." },
    { front: "SQL vs NoSQL — when to pick which?", back: "SQL for structured data with strong relationships and ACID needs. NoSQL for flexible schemas, massive scale, or high write throughput." },
  ],
  JavaScript: [
    { front: "var vs let vs const?", back: "var is function-scoped and hoisted; let/const are block-scoped. const prevents reassignment (but not mutation of objects/arrays)." },
    { front: "What is a closure?", back: "A function that retains access to variables from its enclosing lexical scope even after that outer function has returned." },
    { front: "What is the event loop?", back: "The mechanism that lets JS run non-blocking async code by processing the call stack, then microtasks (Promises), then the macrotask queue." },
    { front: "== vs ===?", back: "== compares values with type coercion. === compares both value and type strictly, without coercion — generally preferred." },
    { front: "What is 'this' in JavaScript?", back: "A reference that depends on how a function is called — object method, standalone call, arrow function (lexical), or explicit bind/call/apply." },
    { front: "Promise vs async/await?", back: "async/await is syntactic sugar over Promises, letting async code read like synchronous code while still being non-blocking under the hood." },
    { front: "What is hoisting?", back: "JS moves variable and function declarations to the top of their scope during compilation; var is hoisted as undefined, let/const are hoisted but stay in a 'temporal dead zone'." },
    { front: "What is the difference between null and undefined?", back: "undefined means a variable was declared but not assigned. null is an explicit assignment representing 'no value'." },
    { front: "What is destructuring?", back: "A syntax to unpack values from arrays or properties from objects into distinct variables: const {a, b} = obj." },
    { front: "What is debouncing?", back: "A technique that delays a function call until a pause in triggering events, preventing excessive calls (e.g. on keystrokes or resize)." },
  ],
  DSA: [
    { front: "Time complexity of binary search?", back: "O(log n) — it halves the search space on each comparison, requiring a sorted array." },
    { front: "What is a hash map's average lookup time?", back: "O(1) average case, using a hash function to map keys to buckets; O(n) worst case with many collisions." },
    { front: "BFS vs DFS?", back: "BFS explores level by level using a queue, good for shortest paths. DFS explores as deep as possible using a stack/recursion, good for exhaustive search." },
    { front: "What is dynamic programming?", back: "Solving problems by breaking them into overlapping subproblems, storing (memoizing) results to avoid redundant computation." },
    { front: "What is Big O notation?", back: "A way to describe an algorithm's growth rate in time/space relative to input size, focusing on the dominant term as n grows large." },
    { front: "Stack vs Queue?", back: "Stack is LIFO (last in, first out) — push/pop from the same end. Queue is FIFO (first in, first out) — enqueue at back, dequeue from front." },
    { front: "What is a balanced binary search tree?", back: "A BST (e.g. AVL, Red-Black) that keeps height O(log n) via rotations, guaranteeing O(log n) search/insert/delete." },
    { front: "What is the two-pointer technique?", back: "Using two indices moving through a data structure (often from both ends or at different speeds) to solve problems in O(n) instead of O(n²)." },
    { front: "What makes an algorithm 'greedy'?", back: "It makes the locally optimal choice at each step, hoping to reach a global optimum — works for problems with optimal substructure like Dijkstra's." },
    { front: "What is a trie used for?", back: "A tree structure storing strings by shared prefixes, enabling fast prefix search/autocomplete in O(length of word)." },
  ],
  React: [
    { front: "What is the virtual DOM?", back: "An in-memory representation of the real DOM. React diffs it against the previous version to compute the minimal set of real DOM updates." },
    { front: "useState vs useRef?", back: "useState triggers a re-render when updated. useRef persists a mutable value across renders without causing a re-render." },
    { front: "What is useEffect for?", back: "Running side effects (data fetching, subscriptions, DOM manipulation) after render, with a dependency array controlling when it re-runs." },
    { front: "Controlled vs uncontrolled components?", back: "Controlled components have their value driven by React state (via onChange). Uncontrolled components manage their own state internally, read via refs." },
    { front: "What are keys used for in lists?", back: "Keys help React identify which items changed, were added, or removed, enabling efficient re-rendering and preserving component state correctly." },
    { front: "What is prop drilling?", back: "Passing data through many nested layers of components that don't need it themselves, just to reach a deeply nested child — often solved with Context." },
    { front: "What is memoization in React (useMemo/React.memo)?", back: "Caching a computed value or component render output so it's only recalculated when its dependencies actually change, avoiding wasted work." },
    { front: "What is a custom hook?", back: "A reusable function starting with 'use' that encapsulates stateful logic (built from other hooks) shareable across components." },
    { front: "What is the difference between state and props?", back: "Props are read-only data passed from a parent. State is local, mutable data managed within a component via useState/useReducer." },
    { front: "What is React reconciliation?", back: "The algorithm React uses to diff the new virtual DOM tree against the old one and determine the minimal real DOM mutations needed." },
  ],
  Kubernetes: [
    { front: "What is a Pod?", back: "The smallest deployable unit in Kubernetes — one or more containers that share networking and storage, scheduled together on a node." },
    { front: "What is a Deployment?", back: "A controller that manages a set of replica Pods, handling rolling updates, rollbacks, and self-healing to match a desired state." },
    { front: "What is a Service?", back: "A stable network endpoint (with its own IP/DNS name) that load-balances traffic to a dynamic set of Pods matching a label selector." },
    { front: "What is a ConfigMap vs a Secret?", back: "ConfigMap stores non-sensitive configuration as key-value pairs. Secret stores sensitive data (base64-encoded) like passwords or tokens." },
    { front: "What does kubectl apply do?", back: "Applies a declarative configuration file to the cluster, creating or updating resources to match the desired state described in the YAML." },
    { front: "What is a Namespace?", back: "A virtual cluster within a Kubernetes cluster used to isolate and organize resources for different teams, environments, or projects." },
    { front: "What is an Ingress?", back: "An API object that manages external HTTP/HTTPS access to Services, typically providing routing rules, TLS termination, and a single entry point." },
    { front: "What is a StatefulSet?", back: "Like a Deployment but for stateful applications — provides stable network identities and persistent storage per Pod, with ordered scaling." },
    { front: "What is a liveness vs readiness probe?", back: "Liveness probes restart a container if it's unhealthy. Readiness probes determine if a Pod should receive traffic at all." },
    { front: "What is horizontal pod autoscaling?", back: "Automatically adjusting the number of Pod replicas based on observed metrics like CPU or memory utilization." },
  ],
  AWS: [
    { front: "What is EC2?", back: "Elastic Compute Cloud — resizable virtual server instances in the cloud, billed by usage, forming the compute backbone of AWS." },
    { front: "What is S3?", back: "Simple Storage Service — durable, scalable object storage organized into buckets, commonly used for files, backups, and static hosting." },
    { front: "What is IAM?", back: "Identity and Access Management — controls who (users/roles) can do what (permissions) on which AWS resources." },
    { front: "What is a VPC?", back: "Virtual Private Cloud — an isolated virtual network within AWS where you control IP ranges, subnets, routing, and security." },
    { front: "What is Lambda?", back: "A serverless compute service that runs code in response to events without provisioning servers, billed per invocation/duration." },
    { front: "What is an Auto Scaling Group?", back: "A collection of EC2 instances managed together to automatically scale in/out based on demand, replacing unhealthy instances." },
    { front: "What is RDS?", back: "Relational Database Service — a managed service for running relational databases (MySQL, PostgreSQL, etc.) with automated backups and patching." },
    { front: "What is CloudFront?", back: "AWS's CDN service that caches content at edge locations worldwide to reduce latency for end users." },
    { front: "What is the difference between S3 and EBS?", back: "S3 is object storage accessed over HTTP, decoupled from any instance. EBS is block storage attached directly to a single EC2 instance." },
    { front: "What is a Security Group?", back: "A virtual firewall attached to EC2 instances that controls inbound/outbound traffic at the instance level via allow rules." },
  ],
  Git: [
    { front: "git merge vs git rebase?", back: "Merge combines branches with a merge commit, preserving history. Rebase replays commits onto a new base, producing a linear history." },
    { front: "What is a detached HEAD state?", back: "When HEAD points directly to a commit instead of a branch — commits made here aren't tracked by any branch unless you create one." },
    { front: "git fetch vs git pull?", back: "fetch downloads remote changes without merging them. pull is fetch + merge (or rebase) into your current branch in one step." },
    { front: "What does git stash do?", back: "Temporarily shelves uncommitted changes so you can switch branches cleanly, then reapply them later with git stash pop." },
    { front: "What is a git cherry-pick?", back: "Applies the changes from a specific commit onto your current branch, without merging the entire branch it came from." },
    { front: "What is the difference between git reset and git revert?", back: "reset moves the branch pointer (rewriting history, dangerous if pushed). revert creates a new commit that undoes changes, safe for shared history." },
    { front: "What is a .gitignore file for?", back: "Lists file/directory patterns Git should not track (e.g. node_modules, .env), keeping the repo clean of build artifacts and secrets." },
    { front: "What is a fast-forward merge?", back: "When the target branch has no divergent commits, Git simply moves the branch pointer forward instead of creating a merge commit." },
    { front: "What does git blame show?", back: "Shows which commit and author last modified each line of a file, useful for tracing the origin of a change." },
    { front: "What is a remote tracking branch?", back: "A local reference (e.g. origin/main) that represents the state of a branch on a remote repository as of the last fetch." },
  ],
  Docker: [
    { front: "Image vs container?", back: "An image is a read-only template/blueprint. A container is a running (or stopped) instance of an image with its own writable layer." },
    { front: "What is a Dockerfile?", back: "A text file with instructions (FROM, RUN, COPY, CMD, etc.) that Docker uses to build an image layer by layer." },
    { front: "What is a Docker layer?", back: "Each instruction in a Dockerfile creates a cached, immutable filesystem layer; unchanged layers are reused on rebuilds for speed." },
    { front: "What is a volume?", back: "A Docker-managed persistent storage mechanism that exists outside a container's writable layer, surviving container removal." },
    { front: "CMD vs ENTRYPOINT?", back: "ENTRYPOINT defines the fixed executable for the container. CMD supplies default arguments, which can be overridden at 'docker run' time." },
    { front: "What is docker-compose used for?", back: "Defining and running multi-container applications via a single YAML file, managing networks, volumes, and service dependencies together." },
    { front: "What is a multi-stage build?", back: "A Dockerfile pattern using multiple FROM stages to compile/build in one stage and copy only the final artifacts into a slim runtime image." },
    { front: "How do containers communicate on a Docker network?", back: "Containers on the same user-defined bridge network can reach each other by service/container name via Docker's internal DNS." },
    { front: "What does docker exec do?", back: "Runs a new command inside an already-running container — commonly used to open a shell for debugging (docker exec -it <id> sh)." },
    { front: "Why keep images small?", back: "Smaller images pull faster, deploy faster, and have a smaller attack surface — achieved via slim base images and multi-stage builds." },
  ],
  OS: [
    { front: "Process vs thread?", back: "A process is an independent program with its own memory space. A thread is a lightweight unit within a process, sharing memory with other threads in it." },
    { front: "What is a deadlock?", back: "A state where two or more processes/threads wait indefinitely for resources held by each other, forming a circular wait with no progress." },
    { front: "What is virtual memory?", back: "An abstraction giving each process its own address space, mapped to physical memory (and disk) by the OS, enabling isolation and overcommit." },
    { front: "What is a race condition?", back: "A bug where the outcome depends on the unpredictable timing/interleaving of concurrent operations accessing shared data without proper synchronization." },
    { front: "What is a context switch?", back: "The OS saving the state of a running process/thread and loading another's, enabling multitasking on a limited number of CPU cores." },
    { front: "What is paging?", back: "A memory management scheme that divides memory into fixed-size pages, allowing non-contiguous physical allocation and virtual memory support." },
    { front: "Mutex vs semaphore?", back: "A mutex allows only one thread to hold a lock at a time (ownership-based). A semaphore allows a set number of concurrent accesses via a counter." },
    { front: "What is a system call?", back: "A controlled entry point through which user-space programs request services (file I/O, process control) from the kernel." },
    { front: "What is thrashing?", back: "When a system spends more time swapping pages in/out of memory than executing actual work, due to insufficient physical memory." },
    { front: "What is the difference between a monolithic and microkernel?", back: "A monolithic kernel runs most OS services in kernel space for speed. A microkernel keeps the kernel minimal, running most services in user space for isolation." },
  ],
};

const TOPICS = Object.keys(DECKS);

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardsPanel() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [order, setOrder] = useState<number[]>(() => DECKS[TOPICS[0]].map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = DECKS[topic];
  const card = useMemo(() => deck[order[index] ?? 0], [deck, order, index]);

  function selectTopic(t: string) {
    setTopic(t);
    setOrder(DECKS[t].map((_, i) => i));
    setIndex(0);
    setFlipped(false);
  }

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1) % deck.length);
  }
  function prev() {
    setFlipped(false);
    setIndex((i) => (i - 1 + deck.length) % deck.length);
  }
  function shuffle() {
    setOrder(shuffleArr(deck.map((_, i) => i)));
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard flex items-center gap-2 flex-wrap">
        <Layers className="h-4 w-4 text-[#a78bfa] shrink-0" />
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mr-1">Deck</p>
        <div className="flex flex-wrap gap-1.5">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => selectTopic(t)}
              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                topic === t ? "bg-[#7c3aed]/20 text-white border border-[#7c3aed]/40" : "bg-white/5 text-[#9090b0] border border-white/5 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-xs text-[#55556a] font-semibold">
          Card {index + 1} / {deck.length}
        </p>

        <div className="w-full max-w-lg h-64" style={{ perspective: 1200 }}>
          <motion.div
            className="relative w-full h-full cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.45 }}
            onClick={() => setFlipped((f) => !f)}
          >
            <div
              className="tcard absolute inset-0 flex items-center justify-center text-center p-8"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-base font-bold leading-relaxed">{card.front}</p>
            </div>
            <div
              className="tcard absolute inset-0 flex items-center justify-center text-center p-8 overflow-y-auto"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderColor: "rgba(124,58,237,0.35)" }}
            >
              <p className="text-sm text-[#9090b0] leading-relaxed">{card.back}</p>
            </div>
          </motion.div>
        </div>

        <p className="text-[11px] text-[#55556a]">Click the card to flip</p>

        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>
          <button
            onClick={shuffle}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:text-white cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5" /> Shuffle
          </button>
          <button
            onClick={() => {
              setFlipped(false);
            }}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:text-white cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            onClick={next}
            className="flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-lg text-white cursor-pointer"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

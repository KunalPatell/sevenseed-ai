# Comonk AI — Hard Aptitude Question Bank
# 150+ questions — Application/Code-output level, not definitions

QUESTIONS = {
  "python": [
    {"id":"py01","q":"What does this print?\ndef f(x=[]):\n    x.append(1)\n    return x\nprint(f(),f(),f())","opts":["[1] [1] [1]","[1] [1,1] [1,1,1]","[] [] []","Error"],"ans":1},
    {"id":"py02","q":"What is the output?\nx=1\ndef foo():\n    x+=1\n    return x\nprint(foo())","opts":["2","1","None","UnboundLocalError"],"ans":3},
    {"id":"py03","q":"Which prints True?\na=[1,2,3]\nb=a\nc=a[:]\nprint(a is b, a is c)","opts":["True True","True False","False True","False False"],"ans":1},
    {"id":"py04","q":"Output of:\nprint(type(1)==type(1.0))","opts":["True","False","None","TypeError"],"ans":1},
    {"id":"py05","q":"What does yield from do that yield cannot do directly?","opts":["Yields multiple values at once","Delegates to a sub-generator and propagates send/throw","Creates an async generator","Returns a generator object"],"ans":1},
    {"id":"py06","q":"class A:\n    def __init__(self):\n        print('A')\nclass B(A):\n    pass\nclass C(A):\n    def __init__(self):\n        print('C')\nclass D(B,C):\n    pass\nD() — what prints?","opts":["A","C","A then C","Nothing"],"ans":1},
    {"id":"py07","q":"Output:\nprint(0.1+0.2==0.3)","opts":["True","False","None","TypeError"],"ans":1},
    {"id":"py08","q":"What is __slots__ used for?","opts":["Restrict attribute creation and reduce memory per instance","Allow dynamic attribute creation","Enable multiple inheritance","Create class-level constants"],"ans":0},
    {"id":"py09","q":"Output:\na=(1,)\nb=(1)\nprint(type(a),type(b))","opts":["tuple tuple","tuple int","int tuple","int int"],"ans":1},
    {"id":"py10","q":"What does @staticmethod differ from @classmethod?","opts":["staticmethod gets cls, classmethod doesn't","classmethod gets cls as first arg, staticmethod gets no implicit arg","Both get self","staticmethod is faster"],"ans":1},
    {"id":"py11","q":"Output:\nx=[1,2,3]\ny=x\ny+=[4]\nprint(x)","opts":["[1,2,3]","[1,2,3,4]","[1,2,3,[4]]","Error"],"ans":1},
    {"id":"py12","q":"Which is correct about Python GIL?","opts":["Allows true parallel execution of threads","Only one thread executes Python bytecode at a time","Affects multiprocessing too","Can be disabled with threading.release()"],"ans":1},
    {"id":"py13","q":"Output:\ndef gen():\n    yield 1\n    return 2\ng=gen()\nnext(g)\nnext(g)","opts":["2","StopIteration with value 2","1","RuntimeError"],"ans":1},
    {"id":"py14","q":"What does functools.lru_cache require about its arguments?","opts":["Must be integers","Must be hashable","Must be positional","Must be keyword-only"],"ans":1},
    {"id":"py15","q":"Output:\nprint(bool([]),bool([0]),bool(''))","opts":["False True False","False False False","True True False","False True True"],"ans":0},
    {"id":"py16","q":"What does __enter__ return in a context manager used as 'with cm() as x'?","opts":["The context manager itself always","Whatever __enter__ returns","None always","The __exit__ return value"],"ans":1},
    {"id":"py17","q":"Output:\na='hello'\nb='hello'\nprint(a is b)","opts":["Always False","Always True","True (string interning for small strings)","Depends on Python version only"],"ans":2},
    {"id":"py18","q":"Which correctly creates a dataclass with a mutable default?","opts":["@dataclass\nclass A:\n    x: list = []","@dataclass\nclass A:\n    x: list = field(default_factory=list)","@dataclass\nclass A:\n    x = list()","@dataclass\nclass A:\n    x: list = None"],"ans":1},
    {"id":"py19","q":"Output:\nprint(list(map(lambda x:x**2, filter(lambda x:x%2==0, range(5)))))","opts":["[0,4,16]","[1,4,9,16]","[0,1,4,9,16]","[4,16]"],"ans":0},
    {"id":"py20","q":"What is the time complexity of 'in' operator for a Python dict?","opts":["O(n)","O(log n)","O(1) average","O(1) worst case always"],"ans":2},
    {"id":"py21","q":"Output:\ntry:\n    1/0\nexcept ZeroDivisionError:\n    pass\nfinally:\n    print('done')","opts":["Nothing","done","Error then done","ZeroDivisionError"],"ans":1},
    {"id":"py22","q":"What does collections.defaultdict(list) do when accessing a missing key?","opts":["Raises KeyError","Returns None","Creates an empty list for that key","Returns []  without storing it"],"ans":2},
    {"id":"py23","q":"Output:\nx=5\ndef foo():\n    global x\n    x=10\nfoo()\nprint(x)","opts":["5","10","None","Error"],"ans":1},
    {"id":"py24","q":"Which is true about Python's asyncio?","opts":["Uses multiple threads","Uses multiple processes","Single-threaded event loop with cooperative multitasking","Requires GIL to be disabled"],"ans":2},
    {"id":"py25","q":"Output:\nprint(1<2<3, 3>2>1, 1<3>2)","opts":["True True True","True True False","True False True","False True True"],"ans":0},
  ],
  "ml": [
    {"id":"ml01","q":"L1 regularization produces sparse weights because:","opts":["It adds a quadratic penalty","Its gradient is constant magnitude regardless of weight size","It prevents overfitting more than L2","It scales weights proportionally"],"ans":1},
    {"id":"ml02","q":"Batch normalization during inference:","opts":["Uses batch statistics from current inference batch","Uses running mean/variance computed during training","Is disabled completely","Recomputes statistics on the full training set"],"ans":1},
    {"id":"ml03","q":"Why does dropout NOT work at inference time?","opts":["It makes the model non-deterministic","We scale activations by (1-p) instead, or scale during training, to maintain expected values","Dropout is applied but with p=0.1","Inference needs all neurons for accuracy"],"ans":1},
    {"id":"ml04","q":"The vanishing gradient problem in RNNs occurs because:","opts":["Too many layers","Repeated multiplication of gradients through sigmoid/tanh causes them to shrink exponentially","The learning rate is too high","The batch size is too small"],"ans":1},
    {"id":"ml05","q":"In a confusion matrix, if your model predicts all positives as negative to avoid false positives, precision is:","opts":["0","Undefined (division by zero)","1","0.5"],"ans":1},
    {"id":"ml06","q":"Self-attention complexity with sequence length n:","opts":["O(n)","O(n log n)","O(n²)","O(n³)"],"ans":2},
    {"id":"ml07","q":"Which optimizer adapts learning rate per parameter based on gradient history?","opts":["SGD","Momentum SGD","Adam","Gradient Descent"],"ans":2},
    {"id":"ml08","q":"PCA finds directions of:","opts":["Maximum variance in data","Minimum reconstruction error only","Maximum class separability","Minimum correlation"],"ans":0},
    {"id":"ml09","q":"SVM with RBF kernel maps data to:","opts":["2D space always","Infinite-dimensional feature space implicitly","A polynomial feature space","The original space"],"ans":1},
    {"id":"ml10","q":"When should you use cross-entropy loss instead of MSE for classification?","opts":["When output is continuous","Because cross-entropy penalizes confident wrong predictions more heavily","MSE and cross-entropy are interchangeable","When classes are balanced"],"ans":1},
    {"id":"ml11","q":"Random forest reduces variance compared to a single decision tree by:","opts":["Using deeper trees","Averaging predictions over many trees trained on different data/feature subsets","Using smaller trees","Boosting weak learners"],"ans":1},
    {"id":"ml12","q":"What does the forgetting gate in LSTM control?","opts":["How much new input to accept","How much of previous cell state to retain","Gradient flow direction","Output activation"],"ans":1},
    {"id":"ml13","q":"ROC AUC = 0.5 means:","opts":["Perfect classifier","Model performs at random chance","Worst possible classifier","Model is 50% accurate"],"ans":1},
    {"id":"ml14","q":"Word2Vec Skip-gram vs CBOW: which works better for rare words?","opts":["CBOW","Skip-gram","Both the same","Depends on vocabulary size"],"ans":1},
    {"id":"ml15","q":"In XGBoost, each new tree is fit to:","opts":["Original targets","Residuals of previous trees","Random subset of data","Normalized targets"],"ans":1},
    {"id":"ml16","q":"Increasing batch size typically:","opts":["Reduces training time per epoch, may reduce generalization","Improves generalization always","Has no effect on convergence","Requires lower learning rate always"],"ans":0},
    {"id":"ml17","q":"Why add positional encoding in Transformers?","opts":["To reduce computation","Self-attention is permutation-invariant so position info must be injected","To improve gradient flow","To reduce parameter count"],"ans":1},
    {"id":"ml18","q":"Class imbalance: which metric is most informative?","opts":["Accuracy","F1-score or AUC-PR","MSE","R²"],"ans":1},
    {"id":"ml19","q":"ResNet skip connections solve:","opts":["Overfitting","Vanishing gradients — gradients can flow directly through skip connections","Slow training","High memory usage"],"ans":1},
    {"id":"ml20","q":"KL Divergence D(P||Q) is zero when:","opts":["P and Q have same mean","P = Q everywhere","P and Q have same variance","Their supports don't overlap"],"ans":1},
    {"id":"ml21","q":"t-SNE is NOT suitable for:","opts":["Visualization","Dimensionality reduction for ML features (distances not preserved globally)","Cluster discovery","2D plotting"],"ans":1},
    {"id":"ml22","q":"Gradient boosting builds trees:","opts":["In parallel","Sequentially, each correcting errors of previous","Randomly selected","All at once"],"ans":1},
    {"id":"ml23","q":"The kernel trick in SVM allows:","opts":["Faster training","Computing dot products in high-dimensional space without explicit transformation","Handling missing values","Multi-class classification"],"ans":1},
    {"id":"ml24","q":"In transfer learning, which layers are typically frozen first?","opts":["Last layers (task-specific)","First layers (general features)","Batch norm layers","Attention layers"],"ans":1},
    {"id":"ml25","q":"A model has 99% accuracy on imbalanced data (99% class A, 1% class B). This is a problem because:","opts":["Accuracy is too high","Predicting all class A achieves 99% while never detecting class B","The model overfit","Accuracy is not a valid metric"],"ans":1},
  ],
  "dsa": [
    {"id":"dsa01","q":"Quicksort worst-case time complexity and when it occurs:","opts":["O(n log n) always","O(n²) when pivot is always min or max (sorted/reverse sorted array)","O(n²) when array has duplicates","O(n log n) when pivot is median"],"ans":1},
    {"id":"dsa02","q":"Why does Dijkstra's algorithm fail with negative edge weights?","opts":["It doesn't support directed graphs","Once a node is marked visited, its distance is considered final — negative edges can invalidate this","It uses BFS which doesn't support weights","It requires a min-heap"],"ans":1},
    {"id":"dsa03","q":"Time complexity of heapify (build heap from array)?","opts":["O(n log n)","O(n)","O(log n)","O(n²)"],"ans":1},
    {"id":"dsa04","q":"BFS vs DFS for shortest path in unweighted graph:","opts":["DFS always finds shortest path","BFS finds shortest path, DFS does not guarantee it","Both guarantee shortest path","Neither guarantees shortest path"],"ans":1},
    {"id":"dsa05","q":"What is amortized O(1) for dynamic array append?","opts":["Each append is exactly O(1)","Occasional O(n) resize is spread across all appends, averaging O(1)","Only the first append is O(1)","Applies only when array is pre-allocated"],"ans":1},
    {"id":"dsa06","q":"HashMap with chaining: worst-case lookup complexity?","opts":["O(1)","O(n) — all keys hash to same bucket","O(log n)","O(n log n)"],"ans":1},
    {"id":"dsa07","q":"Which sorting algorithm is stable and O(n log n) worst case?","opts":["Quicksort","Heapsort","Merge sort","Introsort"],"ans":2},
    {"id":"dsa08","q":"Two pointers approach requires the array to be:","opts":["Sorted always","Sorted for many problems (two-sum, container water)","Unsorted","Of even length"],"ans":1},
    {"id":"dsa09","q":"Detect cycle in directed graph:","opts":["BFS with visited set","DFS with recursion stack (not just visited)","Union-Find","Topological sort check"],"ans":1},
    {"id":"dsa10","q":"LRU cache: optimal data structure combination?","opts":["Array + binary search","HashMap + Doubly linked list (O(1) get and put)","Heap + HashMap","BST + HashMap"],"ans":1},
    {"id":"dsa11","q":"Knapsack 0/1 vs unbounded: key difference?","opts":["0/1 is faster","Unbounded allows taking same item multiple times","0/1 needs more memory","They have same complexity"],"ans":1},
    {"id":"dsa12","q":"Trie vs HashMap for prefix search:","opts":["HashMap is always faster","Trie enables O(L) prefix search and is more efficient for large prefix-heavy datasets","Trie is always worse","They have identical complexity"],"ans":1},
    {"id":"dsa13","q":"Find the kth largest element — optimal average complexity:","opts":["O(n log n) sort","O(n) using quickselect","O(n log k) heap","O(k log n)"],"ans":1},
    {"id":"dsa14","q":"In Union-Find, path compression makes find():","opts":["O(log n)","Nearly O(1) amortized","O(n)","O(1) worst case"],"ans":1},
    {"id":"dsa15","q":"Sliding window maximum — optimal approach:","opts":["For each window iterate: O(nk)","Deque maintaining decreasing order: O(n)","Segment tree: O(n log n)","Heap: O(n log k)"],"ans":1},
    {"id":"dsa16","q":"Graph with V vertices, E edges — BFS time complexity:","opts":["O(V)","O(E)","O(V+E)","O(V*E)"],"ans":2},
    {"id":"dsa17","q":"Counting sort is NOT comparison-based. Its time complexity is:","opts":["O(n log n)","O(n+k) where k is the range of values","O(n)","O(k)"],"ans":1},
    {"id":"dsa18","q":"Segment tree supports range queries in:","opts":["O(n)","O(log n)","O(1)","O(n log n)"],"ans":1},
    {"id":"dsa19","q":"Boyer-Moore majority vote algorithm finds:","opts":["Any element appearing more than once","Element appearing more than n/2 times in O(n) time O(1) space","Median element","Most frequent element always"],"ans":1},
    {"id":"dsa20","q":"Dynamic programming requires:","opts":["Greedy choice property","Optimal substructure AND overlapping subproblems","Only optimal substructure","Only overlapping subproblems"],"ans":1},
    {"id":"dsa21","q":"What does AVL tree guarantee that BST doesn't?","opts":["Faster insertion","O(log n) height (balanced), ensuring O(log n) search","O(1) deletion","Sorted output"],"ans":1},
    {"id":"dsa22","q":"Matrix chain multiplication — DP approach complexity:","opts":["O(n²)","O(n³)","O(2^n)","O(n log n)"],"ans":1},
    {"id":"dsa23","q":"When does DFS use less memory than BFS?","opts":["Never","When tree is wide (BFS queue grows large)","When tree is deep","Always"],"ans":1},
    {"id":"dsa24","q":"String 'abcba' — minimum palindrome insertions using DP:","opts":["0","2","1","3"],"ans":0},
    {"id":"dsa25","q":"Topological sort is only possible when graph is:","opts":["Connected","Directed and acyclic (DAG)","Undirected","Weighted"],"ans":1},
  ],
  "sql": [
    {"id":"sql01","q":"ROW_NUMBER() vs RANK() vs DENSE_RANK(): which skips numbers after ties?","opts":["ROW_NUMBER","RANK (skips numbers)","DENSE_RANK","All skip"],"ans":1},
    {"id":"sql02","q":"SELECT * FROM A LEFT JOIN B ON A.id=B.id WHERE B.id IS NULL returns:","opts":["All matching rows","Rows in A with no match in B","All rows from B","Inner join result"],"ans":1},
    {"id":"sql03","q":"Which executes first: WHERE or HAVING?","opts":["HAVING then WHERE","WHERE (filters rows before grouping), HAVING filters groups after","Both simultaneously","ORDER BY first"],"ans":1},
    {"id":"sql04","q":"A covering index means:","opts":["Index covers all tables","Query can be answered from index alone without accessing the table","Index covers all columns","Index is on primary key"],"ans":1},
    {"id":"sql05","q":"NULL = NULL evaluates to:","opts":["TRUE","FALSE","NULL (use IS NULL)","1"],"ans":2},
    {"id":"sql06","q":"UNION vs UNION ALL difference:","opts":["UNION is faster","UNION ALL includes duplicates, UNION removes them (slower)","UNION ALL removes duplicates","No difference"],"ans":1},
    {"id":"sql07","q":"READ COMMITTED isolation level prevents:","opts":["Phantom reads","Dirty reads (reading uncommitted data)","Non-repeatable reads","All anomalies"],"ans":1},
    {"id":"sql08","q":"EXISTS vs IN: when is EXISTS faster?","opts":["Always","When subquery returns large result set (EXISTS short-circuits)","When subquery returns small result set","Never"],"ans":1},
    {"id":"sql09","q":"What does a recursive CTE require?","opts":["Only a base case","A base case AND recursive case with UNION ALL, must have termination condition","Only the recursive case","At least 2 base cases"],"ans":1},
    {"id":"sql10","q":"A non-clustered index on a table with many writes:","opts":["Always speeds up queries","Speeds up reads but slows writes (index must be updated)","Has no effect on writes","Locks the table"],"ans":1},
    {"id":"sql11","q":"ROWS BETWEEN vs RANGE BETWEEN in window functions:","opts":["Identical","ROWS is physical (by count), RANGE is logical (by value ties)","RANGE is always faster","ROWS is deprecated"],"ans":1},
    {"id":"sql12","q":"In a deadlock, what does the DB do?","opts":["Waits indefinitely","Kills one transaction (victim) and rolls it back","Kills both transactions","Pauses all transactions"],"ans":1},
    {"id":"sql13","q":"EXPLAIN shows 'full table scan'. To fix this you should:","opts":["Add ORDER BY","Add an index on the filtered/joined column","Increase memory","Split the table"],"ans":1},
    {"id":"sql14","q":"ON DELETE CASCADE means:","opts":["Parent deletion blocked if children exist","Deleting parent automatically deletes all child rows","Child rows set to NULL","Error on delete"],"ans":1},
    {"id":"sql15","q":"SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 50000 — what does HAVING filter?","opts":["Individual rows","Groups (departments) whose average salary > 50000","NULL salaries","Duplicate departments"],"ans":1},
    {"id":"sql16","q":"What is a phantom read?","opts":["Reading NULL values","A transaction re-executes a query and finds new rows inserted by another committed transaction","Reading dirty data","Reading the same row twice"],"ans":1},
    {"id":"sql17","q":"Horizontal partitioning splits data by:","opts":["Columns into separate tables","Rows into separate partitions/tables","Joins across multiple servers","Index type"],"ans":1},
    {"id":"sql18","q":"SELECT 1 FROM table is faster than SELECT * because:","opts":["It always returns 1","No column data fetched from heap — just checks row existence","The optimizer optimizes it","Indexes work differently"],"ans":1},
    {"id":"sql19","q":"CROSS JOIN between tables of 100 and 50 rows returns:","opts":["100 rows","50 rows","150 rows","5000 rows"],"ans":3},
    {"id":"sql20","q":"Normalized DB vs denormalized: when is denormalization preferred?","opts":["Always for OLTP","Read-heavy analytics (OLAP) where JOIN cost outweighs redundancy","Never","When storage is expensive"],"ans":1},
  ],
  "system_design": [
    {"id":"sd01","q":"CAP theorem: when network partition occurs, you must choose between:","opts":["Consistency and Performance","Consistency and Availability","Availability and Performance","None — all can be maintained"],"ans":1},
    {"id":"sd02","q":"Consistent hashing advantage over modular hashing:","opts":["Faster lookups","Adding/removing nodes only remaps adjacent keys — minimal redistribution","Less memory usage","Simpler implementation"],"ans":1},
    {"id":"sd03","q":"Write-through vs write-behind cache:","opts":["Write-through is faster","Write-through writes to cache and DB synchronously (safe but slower), write-behind delays DB write","Write-behind is safer","No consistency difference"],"ans":1},
    {"id":"sd04","q":"Token bucket rate limiting: what happens when bucket is empty?","opts":["Requests queue indefinitely","Requests are rejected/rate-limited until tokens refill","Server crashes","All users are blocked"],"ans":1},
    {"id":"sd05","q":"The circuit breaker pattern in microservices prevents:","opts":["Memory leaks","Cascading failures by stopping calls to a failing service after threshold","API versioning issues","Database overload"],"ans":1},
    {"id":"sd06","q":"Kafka maintains message order:","opts":["Globally across all partitions","Within a partition only","Across topics","Globally when replication factor=1"],"ans":1},
    {"id":"sd07","q":"Two-phase commit (2PC) problem in distributed systems:","opts":["Too slow","Coordinator single point of failure — if coordinator fails after Phase 1, participants hang","Cannot handle more than 2 nodes","Only works with SQL databases"],"ans":1},
    {"id":"sd08","q":"Horizontal scaling vs vertical scaling for stateful services:","opts":["Horizontal is always better","Horizontal scaling stateful services requires session sharing/sticky sessions — more complex","Vertical scaling is always limited","Both are identical in complexity"],"ans":1},
    {"id":"sd09","q":"A Bloom filter can:","opts":["Definitively say if an element is present","Definitively say if an element is ABSENT (no false negatives), but may have false positives","Store the actual elements","Replace a hash table"],"ans":1},
    {"id":"sd10","q":"Idempotent API operation means:","opts":["Calling it once or multiple times produces same result","It's always fast","It doesn't modify data","It requires authentication"],"ans":0},
    {"id":"sd11","q":"Read replica helps with:","opts":["Write scalability","Read scalability — offload read queries, but has replication lag","Both reads and writes equally","Reducing storage"],"ans":1},
    {"id":"sd12","q":"Event sourcing vs traditional CRUD:","opts":["Event sourcing is simpler","Event sourcing stores events (immutable log) not current state — full audit trail, time travel, more complex","CRUD gives full history","Event sourcing uses less storage"],"ans":1},
    {"id":"sd13","q":"GraphQL N+1 problem solution:","opts":["Use REST instead","DataLoader/batching — batch child queries into single request","Add more resolvers","Use caching only"],"ans":1},
    {"id":"sd14","q":"JWT vs server-side sessions: JWT disadvantage is:","opts":["JWT is stateless","Cannot invalidate a JWT before expiry without maintaining a denylist (loses stateless benefit)","JWT is too large","Sessions scale better always"],"ans":1},
    {"id":"sd15","q":"CDN cache invalidation hardest problem is:","opts":["Bandwidth cost","Ensuring cached content is stale immediately when origin changes — push vs TTL tradeoff","CDN pricing","SSL certificates"],"ans":1},
    {"id":"sd16","q":"WebSocket vs SSE (Server-Sent Events): key difference?","opts":["WebSocket is one-way","WebSocket is bidirectional, SSE is server-to-client only (one-way)","SSE is faster","WebSocket requires more ports"],"ans":1},
    {"id":"sd17","q":"Database sharding by user_id range vs hash: hash sharding advantage?","opts":["Simpler to implement","Uniform distribution avoids hotspots — range sharding can create hot partitions","Better for range queries","Easier to rebalance"],"ans":1},
    {"id":"sd18","q":"Service mesh sidecar proxy (like Envoy) handles:","opts":["Business logic","Cross-cutting concerns: load balancing, retries, circuit breaking, observability — without app code changes","Database connections","API authentication only"],"ans":1},
    {"id":"sd19","q":"CQRS pattern separates:","opts":["Frontend and backend","Command (write) and Query (read) models — allows separate scaling and optimization","REST and GraphQL","SQL and NoSQL"],"ans":1},
    {"id":"sd20","q":"To design a URL shortener handling 1000 writes/sec and 100K reads/sec, you would:","opts":["Use a single MySQL instance","Use write DB + Redis cache for reads + base62 encoding — reads hit cache not DB","Use NoSQL only","Shard only by URL length"],"ans":1},
  ],
}

import random

ROLE_MAP = {
    "ai/ml engineer": ["python", "ml", "dsa"],
    "ml engineer": ["python", "ml", "dsa"],
    "software engineer": ["python", "dsa", "sql"],
    "data engineer": ["python", "sql", "dsa"],
    "data scientist": ["python", "ml", "sql"],
    "backend engineer": ["python", "sql", "system_design"],
    "full stack": ["python", "sql", "system_design"],
    "devops": ["system_design", "dsa", "sql"],
    "default": ["python", "dsa", "sql"],
}

def get_questions_for_role(role: str, count: int = 20) -> list:
    role_lower = role.lower().strip()
    categories = None
    for key in ROLE_MAP:
        if key in role_lower:
            categories = ROLE_MAP[key]
            break
    if not categories:
        categories = ROLE_MAP["default"]

    pool = []
    per_cat = count // len(categories)
    extra = count % len(categories)
    for i, cat in enumerate(categories):
        qs = QUESTIONS.get(cat, [])
        take = per_cat + (1 if i < extra else 0)
        pool.extend(random.sample(qs, min(take, len(qs))))

    random.shuffle(pool)
    result = []
    for q in pool:
        opts = list(enumerate(q["opts"]))
        random.shuffle(opts)
        new_ans = next(i for i, (orig_i, _) in enumerate(opts) if orig_i == q["ans"])
        result.append({
            "id": q["id"],
            "q": q["q"],
            "opts": [o for _, o in opts],
            "ans": new_ans,
        })
    return result

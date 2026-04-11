# ai-ml-visual-notes

An interactive visualization website for an AI/ML university course.
Each algorithm covered in the course gets its own self-contained HTML page
with a step-by-step interactive visualizer. Deployed on GitHub Pages.

**Live site:** `https://yourusername.github.io/ai-ml-visual-notes`
**Stack:** Vanilla HTML + CSS + JavaScript. No frameworks, no build tools, no npm.

---

## Project structure

```
ai-ml-visual-notes/
│
├── index.html                        ← Homepage gallery (card grid)
├── style.css                         ← Shared base styles
├── components/
│   └── nav.js                        ← Shared navbar injected via JS
│
├── algorithms/
│   ├── ai/
│   │   ├── search/
│   │   │   └── bfs-dfs-astar.html    ← DONE
│   │   ├── constraint/
│   │   │   └── nqueens.html
│   │   ├── games/
│   │   │   └── minimax.html
│   │   ├── neural-nets/
│   │   │   ├── perceptron.html
│   │   │   └── backprop.html
│   │   ├── clustering/
│   │   │   └── kmeans.html
│   │   └── reinforcement/
│   │       └── qlearning.html
│   │
│   └── ml/
│       ├── regression/
│       │   ├── linear-regression.html
│       │   └── logistic-regression.html
│       ├── classification/
│       │   ├── decision-tree.html
│       │   ├── knn.html
│       │   └── svm.html
│       ├── ensemble/
│       │   ├── random-forest.html
│       │   └── gradient-boosting.html
│       └── unsupervised/
│           ├── pca.html
│           └── kmeans.html
│
└── assets/
    └── icons/
```

---

## Core rules — follow these for every visualizer

1. **Every algorithm page is fully self-contained.** All CSS and JS must be inline
   in the single `.html` file. Never depend on external files except `nav.js`.
   This means you can open any `.html` file directly in a browser without a server.

2. **No frameworks, no npm, no bundlers.** Vanilla JS only. If a chart library is
   needed (e.g. for loss curves), load it from `cdnjs.cloudflare.com` via a
   `<script src="...">` tag — nothing else.

3. **Each page must have three clearly labelled sections, in this order:**

   ```
   ┌─ THEORY ──────────────────────────────────────────┐
   │  Plain-English explanation                        │
   │  Key insight callout                              │
   │  Properties table (Complete, Optimal, Time, Space)│
   └───────────────────────────────────────────────────┘
   ┌─ ALGORITHM ───────────────────────────────────────┐
   │  Pseudocode (monospace, keyword-highlighted)      │
   └───────────────────────────────────────────────────┘
   ┌─ SIMULATION ──────────────────────────────────────┐
   │  Controls: [▶ Run] [Step] [Reset]                 │
   │  Color legend                                     │
   │  SVG graph / canvas                               │
   │  Step log bar (narrates each action)              │
   └───────────────────────────────────────────────────┘
   ```

   Plus a top navbar (injected by `components/nav.js`) above all sections.

   **Multi-algorithm pages** (e.g. the Search page covering BFS, DFS, UCS, IDS, A*)
   use a **left sidebar** to switch between algorithms. Clicking a sidebar entry
   swaps all three sections simultaneously — Theory, Algorithm, and Simulation all
   update to reflect the selected algorithm. The simulation resets on every switch.

4. **Visualizer color conventions (use consistently across all pages):**
   - `#3B8BD4` blue — frontier / candidates
   - `#EF9F27` amber — currently expanding / active
   - `#63992A` green — visited / settled
   - `#E24B4A` red — goal found / error state
   - `#8F8F8F` gray — unvisited / inactive
   - `#9B59B6` purple — neural net weights / activations
   - `#1ABC9C` teal — decision boundaries / regression lines

5. **Controls layout (standard across all pages):**
   ```
   [Algorithm selector?]  [▶ Run]  [Step]  [Reset]  [Speed slider?]
   ```
   Run plays through all steps automatically. Step goes one step at a time.
   Reset restores the initial state. Speed slider is optional but nice to have.

6. **Difficulty badges:** Every page and index card must tag the algorithm as
   `Beginner`, `Intermediate`, or `Advanced`.

7. **Mobile-friendly.** The SVG viewBox must be `0 0 680 H`. Use `width="100%"`
   on the SVG so it scales on small screens.

---

## Homepage (`index.html`) algorithm registry

The homepage reads from a JS array called `algorithms`. When you finish a new
visualizer, add its entry here — the card grid renders automatically.

```javascript
const algorithms = [

  // ── AI ──────────────────────────────────────────────────────────────
  {
    title: "BFS / DFS / UCS / IDS / A*",
    topic: "Search",
    category: "ai",
    file: "algorithms/ai/search/bfs-dfs-astar.html",
    description: "Uninformed and informed graph search algorithms, step by step.",
    difficulty: "Beginner",
    week: "1–2",
    done: true,
    // ── Page format note ──────────────────────────────────────────────
    // MULTI-ALGORITHM PAGE. All 5 algorithms live in one HTML file.
    // Layout: left sidebar (algorithm selector) + main content area.
    // Sidebar pills: BFS | DFS | UCS | IDS | A*
    // Selecting a pill swaps all three sections — Theory / Algorithm /
    // Simulation — to show that algorithm. Simulation resets on switch.
    // Each algorithm has its own accent color:
    //   BFS → #4A9EF8 blue   DFS → #A78BFA purple  UCS → #FBBF24 amber
    //   IDS → #34D399 green  A*  → #F87171 red
    // Sidebar active pill + section tag colors update to match.
    // ─────────────────────────────────────────────────────────────────
  },
  {
    title: "N-Queens",
    topic: "Constraint Satisfaction",
    category: "ai",
    file: "algorithms/ai/constraint/nqueens.html",
    description: "Backtracking with constraint propagation on the N-Queens problem.",
    difficulty: "Intermediate",
    week: "3",
    done: false
  },
  {
    title: "Minimax + Alpha-Beta Pruning",
    topic: "Game Theory",
    category: "ai",
    file: "algorithms/ai/games/minimax.html",
    description: "Adversarial search on a game tree with pruning visualization.",
    difficulty: "Intermediate",
    week: "4",
    done: false
  },
  {
    title: "Perceptron",
    topic: "Neural Networks",
    category: "ai",
    file: "algorithms/ai/neural-nets/perceptron.html",
    description: "Single-layer perceptron learning rule with decision boundary animation.",
    difficulty: "Intermediate",
    week: "8",
    done: false
  },
  {
    title: "Backpropagation",
    topic: "Neural Networks",
    category: "ai",
    file: "algorithms/ai/neural-nets/backprop.html",
    description: "Forward pass, loss, and gradient flow through a small network.",
    difficulty: "Advanced",
    week: "8",
    done: false
  },
  {
    title: "K-Means Clustering",
    topic: "Clustering",
    category: "ai",
    file: "algorithms/ai/clustering/kmeans.html",
    description: "Centroid updates and cluster assignments animated per iteration.",
    difficulty: "Beginner",
    week: "9",
    done: false
  },
  {
    title: "Q-Learning Grid World",
    topic: "Reinforcement Learning",
    category: "ai",
    file: "algorithms/ai/reinforcement/qlearning.html",
    description: "Agent learning a policy in a grid world via Q-table updates.",
    difficulty: "Advanced",
    week: "10",
    done: false
  },

  // ── ML ──────────────────────────────────────────────────────────────
  {
    title: "Gradient Descent",
    topic: "Optimization",
    category: "ml",
    file: "algorithms/ml/regression/gradient-descent.html",
    description: "Ball rolling down a loss surface. Drag the learning rate slider.",
    difficulty: "Beginner",
    week: "5–6",
    done: false
  },
  {
    title: "Linear Regression",
    topic: "Regression",
    category: "ml",
    file: "algorithms/ml/regression/linear-regression.html",
    description: "Least squares fit with animated gradient descent on scatter data.",
    difficulty: "Beginner",
    week: "5–6",
    done: false
  },
  {
    title: "Logistic Regression",
    topic: "Regression",
    category: "ml",
    file: "algorithms/ml/regression/logistic-regression.html",
    description: "Sigmoid output and decision boundary on a 2-class dataset.",
    difficulty: "Beginner",
    week: "5–6",
    done: false
  },
  {
    title: "Decision Tree",
    topic: "Classification",
    category: "ml",
    file: "algorithms/ml/classification/decision-tree.html",
    description: "Tree growing step by step — splitting criterion and information gain shown.",
    difficulty: "Intermediate",
    week: "7",
    done: false
  },
  {
    title: "K-Nearest Neighbours",
    topic: "Classification",
    category: "ml",
    file: "algorithms/ml/classification/knn.html",
    description: "Click to place a point, watch the k nearest neighbours vote.",
    difficulty: "Beginner",
    week: "7",
    done: false
  },
  {
    title: "Support Vector Machine",
    topic: "Classification",
    category: "ml",
    file: "algorithms/ml/classification/svm.html",
    description: "Margin maximization and support vectors on a linearly separable dataset.",
    difficulty: "Advanced",
    week: "7",
    done: false
  },
  {
    title: "Random Forest",
    topic: "Ensemble",
    category: "ml",
    file: "algorithms/ml/ensemble/random-forest.html",
    description: "Multiple decision trees voting — shows how bagging reduces variance.",
    difficulty: "Intermediate",
    week: "–",
    done: false
  },
  {
    title: "PCA",
    topic: "Dimensionality Reduction",
    category: "ml",
    file: "algorithms/ml/unsupervised/pca.html",
    description: "Principal components shown as eigenvectors on a 2D point cloud.",
    difficulty: "Intermediate",
    week: "–",
    done: false
  },

];
```

---

## Multi-algorithm page spec

Some topic pages group several related algorithms into one file with a sidebar
navigator. The Search page (`bfs-dfs-astar.html`) is the reference implementation.
Use this pattern whenever a course topic covers multiple algorithms that share the
same problem domain and the same graph/canvas.

### Layout

```
┌─ navbar (nav.js) ─────────────────────────────────────────┐
├──────────┬────────────────────────────────────────────────┤
│ Sidebar  │  Content                                       │
│          │                                                │
│  ● BFS   │  ┌─ THEORY ──────────────────────────────┐   │
│  ○ DFS   │  │  Title + subtitle                     │   │
│  ○ UCS   │  │  Key insight callout (accent border)  │   │
│  ○ IDS   │  │  Properties table                     │   │
│  ○ A*    │  └───────────────────────────────────────┘   │
│          │                                                │
│          │  ┌─ ALGORITHM ───────────────────────────┐   │
│          │  │  Pseudocode (JetBrains Mono / similar)│   │
│          │  │  Keyword highlighting via CSS spans   │   │
│          │  └───────────────────────────────────────┘   │
│          │                                                │
│          │  ┌─ SIMULATION ──────────────────────────┐   │
│          │  │  [▶ Run] [Step] [Reset]               │   │
│          │  │  Color legend                         │   │
│          │  │  SVG graph  (viewBox 0 0 680 H)       │   │
│          │  │  Step log bar                         │   │
│          │  └───────────────────────────────────────┘   │
└──────────┴────────────────────────────────────────────────┘
```

### Rules for multi-algorithm pages

- **Sidebar pill click** → swap Theory + Algorithm + Simulation content simultaneously,
  reset the simulation to its initial state, update the accent color CSS variable.
- **Accent color** drives: sidebar active pill background/border, section tag color,
  insight callout border, key insight background, step log highlight color.
- **Simulation is shared** — same graph/canvas rendering function for all algorithms
  on the page. Only `buildSteps(algo)` differs per algorithm.
- **Theory properties table** must include rows for: Complete, Optimal, Time, Space.
  Use ✅ / ❌ for boolean cells and monospace for complexity expressions.
- **Pseudocode** uses a `<pre>` block with manually highlighted `<span>` tags:
  keywords (`if`, `while`, `for`, `return`) one color, function names another,
  variables a third. Keep pseudocode language-agnostic (not Python, not JS).
- Section headers (`THEORY`, `ALGORITHM`, `SIMULATION`) use small-caps uppercase
  tags with a horizontal rule extending to the right edge.

### Per-algorithm accent colors (Search page reference)

| Algorithm | Accent | Hex |
|-----------|--------|-----|
| BFS | Blue | `#4A9EF8` |
| DFS | Purple | `#A78BFA` |
| UCS | Amber | `#FBBF24` |
| IDS | Emerald | `#34D399` |
| A* | Red | `#F87171` |

---

## Course roadmap

### AI algorithms

| Week | Topic | Algorithm | File | Status |
|------|-------|-----------|------|--------|
| 1–2 | Search | BFS, DFS, UCS, IDS, A* | `ai/search/bfs-dfs-astar.html` | ✅ Done |
| 3 | Constraint Satisfaction | N-Queens (backtracking) | `ai/constraint/nqueens.html` | ⬜ Todo |
| 4 | Game Theory | Minimax + Alpha-Beta | `ai/games/minimax.html` | ⬜ Todo |
| 8 | Neural Networks | Perceptron | `ai/neural-nets/perceptron.html` | ⬜ Todo |
| 8 | Neural Networks | Backpropagation | `ai/neural-nets/backprop.html` | ⬜ Todo |
| 9 | Clustering | K-Means | `ai/clustering/kmeans.html` | ⬜ Todo |
| 10 | Reinforcement Learning | Q-Learning Grid World | `ai/reinforcement/qlearning.html` | ⬜ Todo |

### ML algorithms

| Week | Topic | Algorithm | File | Status |
|------|-------|-----------|------|--------|
| 5–6 | Optimization | Gradient Descent | `ml/regression/gradient-descent.html` | ⬜ Todo |
| 5–6 | Regression | Linear Regression | `ml/regression/linear-regression.html` | ⬜ Todo |
| 5–6 | Regression | Logistic Regression | `ml/regression/logistic-regression.html` | ⬜ Todo |
| 7 | Classification | Decision Tree | `ml/classification/decision-tree.html` | ⬜ Todo |
| 7 | Classification | K-Nearest Neighbours | `ml/classification/knn.html` | ⬜ Todo |
| 7 | Classification | SVM | `ml/classification/svm.html` | ⬜ Todo |
| – | Ensemble | Random Forest | `ml/ensemble/random-forest.html` | ⬜ Todo |
| – | Unsupervised | PCA | `ml/unsupervised/pca.html` | ⬜ Todo |

---

## How to add a new visualizer

1. Create the `.html` file in the correct `algorithms/` subfolder.
2. Build it as a **fully self-contained page** following the core rules above.
3. Add its entry to the `algorithms` array in `index.html`.
4. Update the status column in this file from `⬜ Todo` to `✅ Done`.
5. Commit and push — GitHub Pages rebuilds automatically in ~30 seconds.

```bash
git add .
git commit -m "add: gradient descent visualizer"
git push
```

---

## Deployment

- **Host:** GitHub Pages
- **Branch:** `main`, root `/`
- **URL:** `https://yourusername.github.io/ai-ml-visual-notes`
- No build step. Every push to `main` is live immediately.

---

## Prompt template — use this when asking Claude to build a new visualizer

```
Build a fully self-contained HTML visualizer for [ALGORITHM NAME].

Context:
- Project: ai-ml-visual-notes (GitHub Pages, vanilla JS only)
- File location: algorithms/[category]/[topic]/[filename].html
- Difficulty: [Beginner | Intermediate | Advanced]

Requirements:
- Self-contained single HTML file, all CSS and JS inline
- Controls: Run / Step / Reset buttons, optional speed slider
- Step log bar narrating each action
- Color scheme from CLAUDE.md (blue=frontier, amber=active, green=visited, red=goal)
- SVG viewBox 0 0 680 [H], width="100%", mobile-friendly
- Nodes/cells clickable where it makes sense (sendPrompt or state change)
- Plain-English explanation paragraph at the top of the page

Algorithm-specific notes:
[add any specific details about what the visualizer should show]
```

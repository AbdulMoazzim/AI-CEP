# AI-CEP: N-Queens Solver

This repository contains implementations of **CSP (Constraint Satisfaction Problem) with Constraint Propagation** and **DFS (Depth-First Search) Backtracking** algorithms for solving the N-Queens problem with an interactive visualization interface.

## 🎯 Features

- **Two Algorithm Implementations**
  - CSP with Constraint Propagation
  - DFS Backtracking
  
- **Interactive Visualization**
  - Step-by-step animation of the solving process
  - Adjustable board size (4-16 queens)
  - Variable animation speed
  - Pause/Resume/Stop controls

- **Performance Comparison**
  - Side-by-side algorithm benchmarking
  - Metrics: Success rate, iterations, runtime
  - Test configurations: N=4, 8, 12
  - Detailed analysis and insights

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (v6.0.0 or higher) or [yarn](https://yarnpkg.com/)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/AI-CEP.git
cd AI-CEP
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Start the Development Server

Using npm:
```bash
npm start
```

Or using yarn:
```bash
yarn start
```

The application will automatically open in your default browser at `http://localhost:3000`

## 📦 Project Structure

```
AI-CEP/
├── src/
│   ├── NQueensVisualizer.jsx    # Main component with algorithms
│   ├── App.js                        # Root component
│   └── index.js                      # Entry point
├── public/
│   └── index.html
├── package.json
└── README.md
```

## 🎮 How to Use

### Single Algorithm Execution
1. Select the number of queens (4-16) using the slider
2. Choose an algorithm (CSP or DFS)
3. Set animation speed
4. Click **"Solve"** to watch the algorithm work step-by-step
5. Use **Pause/Resume** to control playback
6. Click **Reset** to clear the board

### Algorithm Comparison
1. Click **"Compare Algorithms"** button
2. View performance metrics in the comparison table
3. Analyze success rates, iterations, and runtime
4. Review the analysis section for insights

## 🧮 Algorithm Details

### CSP with Constraint Propagation
- Places queens column by column
- Maintains domain of possible positions
- Prunes invalid choices using constraint propagation
- More efficient due to intelligent search space reduction
- Typically requires fewer iterations

### DFS Backtracking
- Places queens row by row
- Checks safety constraints after each placement
- Uses pure backtracking when conflicts detected
- Simpler implementation but more iterations
- Explores more possibilities before finding solution

## 📊 Performance Metrics

The comparison feature evaluates both algorithms on:
- **Success Rate**: Whether a solution was found
- **Iterations**: Number of steps/moves taken
- **Runtime**: Execution time in milliseconds

## 🛠️ Technologies Used

- **React** - Frontend framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **JavaScript** - Algorithm implementation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- N-Queens problem and classical AI algorithms
- React and Tailwind CSS communities
- Constraint Satisfaction Problem research

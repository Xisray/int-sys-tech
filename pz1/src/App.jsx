import React, { useState } from "react";
import "./App.css";

const INF = Infinity;

// const initialMatrix = [
//   [INF, 4, 6, 1, 6],
//   [7, INF, 3, 9, 7],
//   [1, 3, INF, 5, 2],
//   [6, 5, 6, INF, 8],
//   [2, 3, 9, 6, INF]
// ];

const initialMatrix = [
  [INF, 9, 4, 3, 3],
  [9, INF, 2, 3, 6],
  [4, 2, INF, 2, 3],
  [3, 3, 2, INF, 9],
  [3, 6, 3, 9, INF],
];

// Функция для случайного изменения матрицы
const randomizeMatrix = (matrix) => {
  const size = matrix.length;
  const newMatrix = JSON.parse(JSON.stringify(matrix));

  // Гарантируем, что в строках и столбцах нет одинаковых значений (кроме диагонали)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i !== j) {
        // Добавляем случайное число от -2 до +2 к исходному значению
        const randomChange = Math.floor(Math.random() * 5) - 2;
        newMatrix[i][j] = Math.max(1, matrix[i][j] + randomChange);

        // Гарантируем, что в строке и столбце нет дубликатов
        let attempts = 0;
        while (attempts < 10) {
          const rowValues = newMatrix[i].filter((val, idx) => idx !== i && idx !== j);
          const colValues = newMatrix.map((row, idx) => (idx !== i && idx !== j ? row[j] : null)).filter(Boolean);

          if (rowValues.includes(newMatrix[i][j]) || colValues.includes(newMatrix[i][j])) {
            newMatrix[i][j] = Math.max(1, newMatrix[i][j] + 1);
            attempts++;
          } else {
            break;
          }
        }
      } else {
        newMatrix[i][j] = INF;
      }
    }
  }

  return newMatrix;
};

function App() {
  const [matrix, _setMatrix] = useState(randomizeMatrix(initialMatrix));
  const [method, setMethod] = useState("bruteForce");
  const [result, setResult] = useState(null);
  const [iterations, setIterations] = useState(0);

  // Полный перебор
  const bruteForceTSP = () => {
    let minPath = [];
    let minCost = INF;
    let iter = 0;

    const n = matrix.length;
    const cities = Array.from({ length: n }, (_, i) => i);

    const permute = (arr, start) => {
      if (start === arr.length - 1) {
        iter++;
        const currentPath = [...arr, arr[0]];
        let currentCost = 0;

        for (let i = 0; i < currentPath.length - 1; i++) {
          const from = currentPath[i];
          const to = currentPath[i + 1];
          currentCost += matrix[from][to];
        }

        if (currentCost < minCost) {
          minCost = currentCost;
          minPath = currentPath;
        }
        return;
      }

      for (let i = start; i < arr.length; i++) {
        [arr[start], arr[i]] = [arr[i], arr[start]];
        permute([...arr], start + 1);
        [arr[start], arr[i]] = [arr[i], arr[start]];
      }
    };

    permute(cities, 0);
    setIterations(iter);
    return { path: minPath, cost: minCost };
  };

  // Метод ближайшего соседа
  const nearestNeighborTSP = () => {
    let iter = 0;
    const n = matrix.length;
    const visited = new Array(n).fill(false);
    const path = [0]; // Начинаем с города 0
    visited[0] = true;
    let cost = 0;

    for (let i = 0; i < n - 1; i++) {
      iter++;
      let last = path[path.length - 1];
      let min = INF;
      let nextCity = -1;

      for (let j = 0; j < n; j++) {
        iter++;
        if (!visited[j] && matrix[last][j] < min) {
          min = matrix[last][j];
          nextCity = j;
        }
      }

      path.push(nextCity);
      visited[nextCity] = true;
      cost += min;
    }

    // Возвращаемся в начальный город
    cost += matrix[path[path.length - 1]][path[0]];
    path.push(path[0]);

    setIterations(iter);
    return { path, cost };
  };

  // Метод ветвей и границ
  const branchAndBoundTSP = () => {
    let iter = 0;
    const n = matrix.length;
    let finalPath = new Array(n + 1).fill(-1);
    let finalCost = INF;
    let visited = new Array(n).fill(false);

    // Кэш для хранения минимальных рёбер
    const minEdges = new Array(n).fill(INF);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && matrix[i][j] < minEdges[i]) {
          minEdges[i] = matrix[i][j];
        }
      }
    }

    const calculateBound = (path, level) => {
      let bound = 0;
      // Добавляем уже пройденные рёбра
      for (let i = 0; i < level - 1; i++) {
        bound += matrix[path[i]][path[i + 1]];
      }
      // Добавляем минимальные рёбра для оставшихся городов
      for (let i = 0; i < n; i++) {
        if (!visited[i] || i === path[level - 1]) {
          bound += minEdges[i];
        }
      }
      return bound;
    };

    const TSPRec = (currPath, level) => {
      iter++;

      if (level === n) {
        const currentCost = calculateBound(currPath, level) - minEdges[currPath[level - 1]] + matrix[currPath[level - 1]][currPath[0]];
        if (currentCost < finalCost) {
          finalCost = currentCost;
          finalPath = [...currPath, currPath[0]];
        }
        return;
      }

      for (let i = 0; i < n; i++) {
        if (!visited[i]) {
          const newPath = [...currPath, i];
          const newBound = calculateBound(newPath, level + 1);

          if (newBound < finalCost) {
            visited[i] = true;
            TSPRec(newPath, level + 1);
            visited[i] = false;
          }
        }
      }
    };

    // Начинаем с города 0
    visited[0] = true;
    TSPRec([0], 1);

    setIterations(iter);
    return { path: finalPath, cost: finalCost };
  };

  const solveTSP = () => {
    let solution;

    switch (method) {
      case "bruteForce":
        solution = bruteForceTSP();
        break;
      case "nearestNeighbor":
        solution = nearestNeighborTSP();
        break;
      case "branchAndBound":
        solution = branchAndBoundTSP();
        break;
      default:
        solution = { path: [], cost: 0 };
    }

    setResult(solution);
  };

  return (
    <div className="App">
      <h1>Решение задачи коммивояжера</h1>

      <div className="matrix">
        <h2>Матрица расстояний:</h2>
        <table style={{ margin: "0 auto" }}>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell === INF ? "∞" : cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="controls">
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="bruteForce">Полный перебор</option>
          <option value="nearestNeighbor">Метод ближайшего соседа</option>
          <option value="branchAndBound">Метод ветвей и границ</option>
        </select>

        <button onClick={solveTSP}>Решить</button>
      </div>

      {result && (
        <div className="result">
          <h2>Результат:</h2>
          <p>Маршрут: {result.path.join(" → ")}</p>
          <p>Минимальная стоимость: {result.cost}</p>
          <p>Количество итераций: {iterations}</p>
        </div>
      )}
    </div>
  );
}

export default App;

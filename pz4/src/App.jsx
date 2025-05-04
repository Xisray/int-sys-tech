import React, { useState } from "react";
import "./App.css";
import ArrayManager from "./components/ArrayManager";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import MembershipChart from "./components/MembershipChart";
import MembershipChart2 from "./components/MembershipChart2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function multiplyMatrixByVector(matrix, vector) {
  if (matrix[0].length !== vector.length) {
    throw new Error("Количество столбцов матрицы должно совпадать с длиной вектора");
  }

  return matrix.map((row) => {
    return row.reduce((sum, val, j) => sum + val * vector[j], 0);
  });
}

function sumVectorElements(vector) {
  return vector.reduce((sum, val) => sum + val, 0);
}

function divideVectorByNumber(vector, num) {
  if (num === 0) throw new Error("Деление на ноль невозможно");
  return vector.map((val) => val / num);
}

function subtractVectors(vec1, vec2) {
  // Проверяем одинаковую длину векторов
  if (vec1.length !== vec2.length) {
    throw new Error("Векторы должны быть одинаковой длины");
  }

  // Вычитаем соответствующие элементы
  return vec1.map((val, i) => val - vec2[i]);
}

function findMaxAbsolute(vector) {
  if (!vector.length) {
    throw new Error("Вектор не может быть пустым");
  }

  let maxAbs = Math.abs(vector[0]);

  for (let i = 1; i < vector.length; i++) {
    const currentAbs = Math.abs(vector[i]);
    if (currentAbs > maxAbs) {
      maxAbs = currentAbs;
    }
  }

  return maxAbs;
}
const matrixAPreset = [
  [1, 1 / 2, 1 / 4, 1 / 6, 1 / 8, 1 / 9],
  [2, 1, 1 / 3, 1 / 5, 1 / 7, 1 / 8],
  [4, 3, 1, 1 / 4, 1 / 4, 1 / 5],
  [6, 5, 4, 1, 1 / 3, 1 / 3],
  [8, 7, 4, 3, 1, 1],
  [9, 8, 5, 3, 1, 1],
];
const uSetPreset = ["[160,165)", "[165,170)", "[170,175)", "[175,180)", "[180,185)", "[185,190)", "[190,195)", "[195,200)"];
const lSetPreset = ["Низкий", "Средний", "Высокий"];
const expertDataPreset = {
  0: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  1: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  2: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  3: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 1],
  ],
  4: [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
};

const App = () => {
  const [matrixA, setMatrixA] = useState([]);
  const [pairResultData, setPairResultData] = useState(null);
  const [uSet, setUSet] = useState([]);
  const [lSet, setLSet] = useState([]);
  const [expertCount, setExpertCount] = useState(0);
  const [expertData, setExpertData] = useState([]);
  const [resultData, setResultData] = useState(null);

  const fillPreset = () => {
    setUSet(uSetPreset);
    setLSet(lSetPreset);
    setExpertCount(5);
    setExpertData(expertDataPreset);
    setMatrixA(matrixAPreset);
  };

  const handleUSetChange = (updatedItems) => {
    setUSet(updatedItems);
  };

  const handleLSetChange = (updatedItems) => {
    setLSet(updatedItems);
  };

  const calculateMembership2 = () => {
    let vectorW = Array.from({ length: matrixA.length }).map((_) => 1 / matrixA.length);
    let curVector;
    while (true) {
      curVector = multiplyMatrixByVector(matrixA, vectorW);
      curVector = divideVectorByNumber(curVector, sumVectorElements(curVector));
      const dif = findMaxAbsolute(subtractVectors(curVector, vectorW));
      vectorW = curVector;
      if (dif <= 0.0000001) break;
    }
    const max = findMaxAbsolute(vectorW);
    setPairResultData([
      vectorW,
      divideVectorByNumber(vectorW, max),
    ]);
    console.log([
      vectorW,
      divideVectorByNumber(vectorW, max),
    ])
  };

  const calculateMembership = () => {
    const membershipMatrix = Array(uSet.length)
      .fill()
      .map(() => Array(lSet.length).fill(0));
    console.log(expertCount);
    for (let expert = 0; expert < expertCount; expert++) {
      const expertVotes = expertData[expert];
      for (let u = 0; u < uSet.length; u++) {
        for (let l = 0; l < lSet.length; l++) {
          membershipMatrix[u][l] += expertVotes[u][l];
        }
      }
    }
    console.log(membershipMatrix);
    const result = {};
    for (let u = 0; u < uSet.length; u++) {
      result[uSet[u]] = {};
      for (let l = 0; l < lSet.length; l++) {
        result[uSet[u]][lSet[l]] = {};
        result[uSet[u]][lSet[l]].count = membershipMatrix[u][l];
        result[uSet[u]][lSet[l]].percent = membershipMatrix[u][l] / expertCount;
      }
    }
    console.log(result);
    setResultData(result);
    calculateMembership2();
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Определение степени принадлежности</h1>
      <div className="button-group">
        <button onClick={fillPreset}>Заполнить данными из примера</button>
        <button>Заполнить данными из варианта</button>
        <button onClick={calculateMembership}>HZ</button>
      </div>
      <div>
        <h2>Множества</h2>
        <div class="form">
          <h3>Множество U</h3>
          <ArrayManager items={uSet} onItemsChange={handleUSetChange} />
        </div>
        <div class="form">
          <h3>Множество L</h3>
          <ArrayManager items={lSet} onItemsChange={handleLSetChange} />
        </div>
        <div class="form">
          <h3>
            Количество экспертов:
            <input type="number" min="1" value={expertCount} onChange={(e) => setExpertCount(parseInt(e.target.value) || 1)} />
          </h3>
        </div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "100px" }}></th>
              <th>Терм</th>
              {uSet.map((u, uIndex) => (
                <th key={uIndex}>{u}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: expertCount }).map((_, arrIndex) => (
              <tr key={arrIndex}>
                <td
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    fontWeight: "bold",
                    border: "none",
                    padding: "8px",
                  }}
                >
                  Эксперт {arrIndex + 1}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {lSet.join("\n")}
                </td>
                {expertData[arrIndex].map((val, index) => (
                  <td
                    key={index}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {val.join("\n")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <h1>Статистическая обработка мнений группы экспертов</h1>
        {resultData ? (
          <>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    whiteSpace: "pre-line",
                  }}>Терм</th>
                  {uSet.map((u, uIndex) => (
                    <th style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      whiteSpace: "pre-line",
                    }} key={uIndex}>{u}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lSet.map((l) => (
                  <>
                    <tr>
                      <td style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    whiteSpace: "pre-line",
                  }} rowSpan={2}>{l}</td>
                      {uSet.map((u) => (
                        <td style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          whiteSpace: "pre-line",
                        }}
                        >{resultData[u][l].count}</td>
                      ))}
                    </tr>
                    <tr>
                      {uSet.map((u) => (
                        <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          whiteSpace: "pre-line",
                        }}
                        >{resultData[u][l].percent}</td>
                      ))}
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <MembershipChart uSet={uSet} lSet={lSet} resultData={resultData} />
          </>
        ) : (
          <></>
        )}
        <h1>Парные сравнения</h1>
        {pairResultData ? (
          <>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  {matrixA.map(() => (
                    <th></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    whiteSpace: "pre-line",
                  }}>Для субнормального нечеткого множества</td>
                  {pairResultData[0].map((val) => (
                    <td style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      whiteSpace: "pre-line",
                    }}>{`${val.toFixed(4)}`}</td>
                  ))}
                </tr>
                <tr>
                  <td style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    whiteSpace: "pre-line",
                  }}>Для нормального нечеткого множества</td>
                  {pairResultData[1].map((val) => (
                    <td style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      whiteSpace: "pre-line",
                    }}>{val.toFixed(4)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
            <MembershipChart2 oXLabels ={['170', '175', '180', '185', '190', '195']} legendLabels={['субнормального нечеткого множества', 'нормального нечеткого множества']} resultData={pairResultData} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default App;

import "./App.css";
import React, { useState, useEffect } from "react";
import { GenerateRandomPoints, calculateCentroids, checkConvergence, clusterize, initCentroids } from "./utils/utils";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

function App() {
  const [numPoints, setNumPoints] = useState(100);
  const [numClusters, setNumClusters] = useState(3);
  const [points, setPoints] = useState([]);
  const [pointsHistory, setPointsHistory] = useState(null);
  const [curPointsIndex, setCurPointsIndex] = useState(-1);

  useEffect(() => {
    setPoints(GenerateRandomPoints(numPoints));
  }, [numPoints]);

  function handleClustering() {
    const newHistory = [];
    let centroids = initCentroids(numClusters);
    let clusteredPoints = clusterize(points, centroids);

    newHistory.push({ points: clusteredPoints, centroids });

    do {
      const newCentroids = calculateCentroids(clusteredPoints);
      clusteredPoints = clusterize(clusteredPoints, newCentroids);
      newHistory.push({ points: clusteredPoints, centroids: newCentroids });

      if (checkConvergence(centroids, newCentroids)) break;
      centroids = newCentroids;
    } while (true);

    setPointsHistory(newHistory);
    setCurPointsIndex(0);
  }

  return (
    <div>
      <h1>Кластеризация методом K-Means</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Количество точек:
          <input
            type="number"
            value={numPoints}
            onChange={(e) => setNumPoints(parseInt(e.target.value))}
            min="10"
            max="500"
          />
        </label>

        <label style={{ marginLeft: "10px" }}>
          Количество кластеров:
          <input
            type="number"
            value={numClusters}
            onChange={(e) => setNumClusters(parseInt(e.target.value))}
            min="2"
            max="10"
          />
        </label>

        <button onClick={handleClustering} style={{ marginLeft: "10px" }}>
          Выполнить кластеризацию
        </button>
      </div>

      <div>
        <div style={{ marginBottom: "40px" }}>
          <h3>{curPointsIndex === -1 ? "Исходные точки" : `Шаг ${curPointsIndex+1}`}</h3>
          <Scatter
            data={{
              datasets: !pointsHistory || curPointsIndex === -1 ? [
                {
                  label: "Исходные точки",
                  data: points,
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                  pointRadius: 6,
                  animation: false
                }
              ] : [
                ...pointsHistory[curPointsIndex].centroids.map((centroid, index) => ({
                  label: `Центроид ${index + 1}`,
                  data: [{ x: centroid.x, y: centroid.y }],
                  backgroundColor: `hsl(${(index * 360) / pointsHistory[curPointsIndex].centroids.length}, 70%, 30%)`,
                  pointStyle: "rectRot",
                  pointRadius: 10,
                  borderWidth: 2,
                  borderColor: "#fff",
                })),
                ...pointsHistory[curPointsIndex].centroids.map((centroid, index) => ({
                  label: `Кластер ${index + 1}`,
                  data: pointsHistory[curPointsIndex].points.filter((point) => point.clusterId === index),
                  backgroundColor: `hsl(${(index * 360) / pointsHistory[curPointsIndex].centroids.length}, 70%, 50%)`,
                  pointRadius: 6,
                  animation: false
                })),
              ],
            }}
            options={{
              scales: {
                x: {
                  beginAtZero: true
                },
                y: {
                  beginAtZero: true
                }
              },
              plugins: {
                legend: {
                  labels: {
                    filter: (item) => !item.text.includes("Центроид"),
                  },
                },
                tooltip: {
                  callbacks: {
                    title: (items) => {
                      const dataset = items[0].dataset;
                      return dataset.label.includes("Центроид")
                        ? dataset.label
                        : `${dataset.label} (${dataset.count || dataset.data.length} точек)`;
                    },
                    label: (item) => {
                      return `X: ${item.parsed.x}, Y: ${item.parsed.y}`;
                    }
                  }
                }
              },
            }}
          />
        </div>

        {pointsHistory && (
          <div className="input-group">
            <button
              onClick={() => setCurPointsIndex(curPointsIndex-1)}
              disabled={curPointsIndex <= -1}
            >
              Пред
            </button>
            <button
              onClick={() => setCurPointsIndex(curPointsIndex+1)}
              disabled={curPointsIndex === pointsHistory.length-1}
            >
              След
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

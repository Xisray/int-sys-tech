import { useEffect, useState } from "react";
import "./App.css";
import { GenerateWeightMatrix, GetTrainingData } from "./utils/Utils";
import Settings from "./core/Settings";
import TrainingDataFunctions from "./utils/TrainingDataFunctions";
import ActivationFunctions from "./core/ActivationFunctions";

function getVectorS(vector, weightMatrix, debug) {
  const vectorS = new Array(weightMatrix[0].length).fill(0);
  for (let i = 0; i < vectorS.length; i++) {
    const actions = [];
    for (let j = 0; j < weightMatrix.length; j++) {
      vectorS[i] += vector[j] * weightMatrix[j][i];
      actions.push(`${vector[j]} * ${weightMatrix[j][i]}`);
    }
    debug.str += `S${i + 1} = ${actions.join(" + ")} = ${vectorS[i]}\n`;
  }
  return vectorS;
}

function getVectorY(vector, weightMatrix, k, debug) {
  const vectorS = getVectorS(vector, weightMatrix, debug);
  return Array.from({ length: vectorS.length }).map((_, index) => ActivationFunctions.Sigmoid.func(vectorS[index], k));
}

function forwardStep(vectorX, inputWeights, outputWeights, k, debug) {
  debug.str += "Прямой ход\n";
  debug.str += `k = ${k}\n`;
  debug.str += `Вектор S для входного слоя: \n`;
  const vectorY = getVectorY(vectorX, inputWeights, k, debug);
  debug.str += `Вектор Y: [ ${vectorY.join(", ")} ]\n`;

  debug.str += `Вектор S для выходного слоя: \n`;
  const vectorSForY = getVectorS(vectorY, outputWeights, debug);

  const y = ActivationFunctions.Sigmoid.func(
    vectorSForY.reduce((prev, cur) => prev * cur),
    k
  );
  debug.str += `Y = ${y}\n`;
  return [vectorY, y];
}

function backwardStep(vectorX, d, inputWeights, outputWeights, k, speedRatio) {
  const debug = {
    str: "",
  };
  const [vectorY, y] = forwardStep(vectorX, inputWeights, outputWeights, k, debug);

  debug.str += "Обратный ход\n";
  const deltaSqr = (d - y) * y * (1 - y);
  debug.str += `η = ${speedRatio}\n`;
  debug.str += `δ² = (${d} - ${y}) * ${y} * (1 - ${y}) = ${deltaSqr}\n`;

  const newOutputWeights = outputWeights.map((row, rowIndex) =>
    row.map((cell) => {
      const result = cell + speedRatio * deltaSqr * vectorY[rowIndex];
      debug.str += `w${rowIndex + 1} = ${cell} + ${speedRatio} * ${deltaSqr} * ${vectorY[rowIndex]} = ${result}\n`;
      return result;
    })
  );
  const vectorDelta = vectorY.map((y, index) => {
    const result = y * (1 - y) * deltaSqr * outputWeights[index][0];
    debug.str += `δ${index + 1} = ${y} * (1 - ${y}) * ${deltaSqr} * ${outputWeights[index][0]} = ${result}\n`;
    return result;
  });
  const newInputWeights = inputWeights.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const result = cell + speedRatio * vectorDelta[colIndex] * vectorX[rowIndex];
      debug.str += `w${rowIndex + 1}${colIndex + 1} = ${cell} + ${speedRatio} * ${vectorDelta[colIndex]} * ${vectorX[rowIndex]} = ${result}\n`;
      return result;
    })
  );
  const e = getEpsilon(d, y);
  return {
    inputWeights: newInputWeights,
    outputWeights: newOutputWeights,
    e: e,
    debug: debug.str,
  };
}

function getEpsilon(expected, fact) {
  let e = 0;
  for (let i = 0; i < expected.length; i++) {
    e += Math.pow(expected[i] - fact[i], 2);
  }
  return e;
}

function App() {
  const [trainingDataFunction, setTrainingDataFunction] = useState("Implication");
  const [trainingData, setTrainingData] = useState(Settings.preset.trainingData.matrixX);
  const [resultTrainingData, setResultTrainingData] = useState(Settings.preset.trainingData.vectorD);

  const [selectedVector, setSelectedVector] = useState(0);

  const [inputWeightMatrix, setInputWeightMatrix] = useState(Settings.preset.inputWeights);
  const [outputWeightMatrix, setOutputWeightMatrix] = useState(Settings.preset.outputWeights);

  const [result, setResult] = useState("");

  // const test = () => {
  //   backwardStep(trainingData.matrixX[2], trainingData.vectorD[2], inputWeightMatrix, outputWeightMatrix, Settings.preset.k, Settings.preset.speedRatio);
  // };

  // const regenerateWeights = () => {
  //   setInputWeightMatrix(GenerateWeightMatrix(Settings.countInputNeurons, Settings.countInputNeurons));
  //   setOutputWeightMatrix(GenerateWeightMatrix(Settings.countOutputNeurons, Settings.countInputNeurons));
  // };

  useEffect(() => {
    const hz = GetTrainingData(2, 1, TrainingDataFunctions[trainingDataFunction]);
    setTrainingData(hz[0]);
    setResultTrainingData(hz[1]);
    setSelectedVector(0);
  }, [trainingDataFunction]);

  const changeInputWeights = (rowIndex, colIndex, value) => {
    setInputWeightMatrix((prev) => prev.map((row, i) => (i === rowIndex ? row.map((val, j) => (j === colIndex ? value : val)) : row)));
  };
  const changeOutputWeights = (rowIndex, colIndex, value) => {
    setOutputWeightMatrix((prev) => prev.map((row, i) => (i === rowIndex ? row.map((val, j) => (j === colIndex ? value : val)) : row)));
  };
  const run = () => {
    const result = backwardStep(
      trainingData[selectedVector],
      resultTrainingData[selectedVector],
      inputWeightMatrix,
      outputWeightMatrix,
      Settings.preset.k,
      Settings.preset.speedRatio
    );
    setResult(result.debug);
  };

  return (
    <div className="column">
      <div className="row">
        <label>
          Функция
          <select
            style={{ marginLeft: "5px" }}
            value={trainingDataFunction}
            onChange={(e) => setTrainingDataFunction(e.target.value)}
            name="training-function"
            id="training-function"
          >
            {Object.keys(TrainingDataFunctions).map((key, index) => (
              <option key={index} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <label>
          Вектор
          <select
            style={{ marginLeft: "5px" }}
            value={selectedVector}
            onChange={(e) => {
              setSelectedVector(Number(e.target.value));
              console.log(selectedVector);
            }}
            name="training-function"
            id="training-function"
          >
            {trainingData.map((row, rowIndex) => (
              <option key={rowIndex} value={rowIndex}>
                {`${row.join(" ")} ${resultTrainingData[rowIndex]}`}
              </option>
              //   <option key={rowIndex} value={[...row, resultTrainingData[rowIndex]]}>
              //   {`${row.join(" ")} ${resultTrainingData[rowIndex]}`}
              // </option>
            ))}
          </select>
        </label>
      </div>

      <div className="row">
        {trainingData && trainingData[0] ? (
          <table className="table">
            <thead>
              <tr>
                {Array.from({ length: trainingData[0].length }).map((_, index) => (
                  <th>x{index}</th>
                ))}
                <th>D</th>
              </tr>
            </thead>
            <tbody>
              {trainingData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>{cell}</td>
                  ))}
                  <td>{resultTrainingData[rowIndex]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <></>
        )}
      </div>

      <div className="row">
        <table className="table">
          <thead>
            <tr>
              <th>Wij(1)</th>
              {Array.from({ length: Settings.countInputNeurons }).map((_, index) => (
                <th>x{index}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inputWeightMatrix.map((row, index) => (
              <tr key={index}>
                <td key={-1}>x{index}</td>
                {row.map((val, colIndex) => (
                  <td key={colIndex}>
                    <input type="number" value={val} step={0.1} onChange={(e) => changeInputWeights(index, colIndex, Number(e.target.value))} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={inputWeightMatrix[0].length + 1}>
                <button onClick={() => setInputWeightMatrix(GenerateWeightMatrix(Settings.countInputNeurons, Settings.countInputNeurons))}>Случайные</button>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="table">
          <thead>
            <tr>
              <th>Wg(1)</th>
              {Array.from({ length: Settings.countOutputNeurons }).map((_, index) => (
                <th>y{index}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {outputWeightMatrix.map((row, index) => (
              <tr key={index}>
                <td key={-1}>{index}</td>
                {row.map((val, colIndex) => (
                  <td key={colIndex}>
                    <input type="number" value={val} step={0.1} onChange={(e) => changeOutputWeights(index, colIndex, Number(e.target.value))} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={outputWeightMatrix[0].length + 1}>
                <button onClick={() => setOutputWeightMatrix(GenerateWeightMatrix(Settings.countInputNeurons, Settings.countOutputNeurons))}>Случайные</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button style={{ margin: "0 auto" }} onClick={run}>
        Выполнить
      </button>
      <div className="row">
        <pre>{result}</pre>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";
import { GenerateWeightMatrix, GetTrainingData } from "./utils/Utils";
import Settings from "./core/Settings";
import TrainingDataFunctions from "./utils/TrainingDataFunctions";
import ActivationFunctions from "./core/ActivationFunctions";

function getVectorS(vector, weightMatrix) {
  const vectorS = new Array(weightMatrix[0].length).fill(0);
  for (let i = 0; i < vectorS.length; i++) {
    const actions = [];
    for (let j = 0; j < weightMatrix.length; j++) {
      vectorS[i] += vector[j] * weightMatrix[j][i];
      actions.push(`${vector[j]} * ${weightMatrix[j][i]}`);
    }
    console.log(`S${i + 1} = ${actions.join(" + ")} = ${vectorS[i]}`);
  }
  return vectorS;
}

function getVectorY(vector, weightMatrix, k) {
  const vectorS = getVectorS(vector, weightMatrix);
  return Array.from({ length: vectorS.length }).map((_, index) => ActivationFunctions.Sigmoid.func(vectorS[index], k));
}

function forwardStep(vectorX, inputWeights, outputWeights, k) {
  console.log("Прямой ход");
  console.log(`k = ${k}`);
  console.log(`Вектор S для входного слоя: `);
  const vectorY = getVectorY(vectorX, inputWeights, k);
  console.log(`Вектор Y: [ ${vectorY.join(", ")} ]`);

  console.log(`Вектор S для выходного слоя: `);
  const vectorSForY = getVectorS(vectorY, outputWeights);

  const y = ActivationFunctions.Sigmoid.func(
    vectorSForY.reduce((prev, cur) => prev * cur),
    k
  );
  // const y = vectorSForY.reduce((prev, cur) => prev * cur) * speedRatio;
  console.log(`Y = ${y}`);
  return [vectorY, y];
}

function backwardStep(vectorX, d, inputWeights, outputWeights, k, speedRatio) {
  const [vectorY, y] = forwardStep(vectorX, inputWeights, outputWeights, k);

  console.log("Обратный ход");
  const deltaSqr = (d - y) * y * (1 - y);
  console.log(`η = ${speedRatio}`);
  console.log(`δ² = (${d} - ${y}) * ${y} * (1 - ${y}) = ${deltaSqr}`);

  const newOutputWeights = outputWeights.map((row, rowIndex) =>
    row.map((cell) => {
      const result = cell + speedRatio * deltaSqr * vectorY[rowIndex];
      console.log(`w${rowIndex + 1} = ${cell} + ${speedRatio} * ${deltaSqr} * ${vectorY[rowIndex]} = ${result}`);
      return result;
    })
  );
  const vectorDelta = vectorY.map((y, index) => {
    const result = y * (1 - y) * deltaSqr * outputWeights[index][0];
    console.log(`δ${index + 1} = ${y} * (1 - ${y}) * ${deltaSqr} * ${outputWeights[index][0]} = ${result}`);
    return result;
  });
  const newInputWeights = inputWeights.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const result = cell + speedRatio * vectorDelta[colIndex] * vectorX[rowIndex];
      console.log(`w${rowIndex + 1}${colIndex + 1} = ${cell} + ${speedRatio} * ${vectorDelta[colIndex]} * ${vectorX[rowIndex]} = ${result}`);
      return result;
    })
  );
  const e = getEpsilon(d, y);
  return {
    inputWeights: newInputWeights,
    outputWeights: newOutputWeights,
    e: e,
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
  const [trainingData, setTrainingData] = useState(Settings.preset.trainingData);
  const [inputWeightMatrix, setInputWeightMatrix] = useState(Settings.preset.inputWeights);
  const [outputWeightMatrix, setOutputWeightMatrix] = useState(Settings.preset.outputWeights);

  // const test = () => {
  //   backwardStep(trainingData.matrixX[2], trainingData.vectorD[2], inputWeightMatrix, outputWeightMatrix, Settings.preset.k, Settings.preset.speedRatio);
  // };

  // const regenerateWeights = () => {
  //   setInputWeightMatrix(GenerateWeightMatrix(Settings.countInputNeurons, Settings.countInputNeurons));
  //   setOutputWeightMatrix(GenerateWeightMatrix(Settings.countOutputNeurons, Settings.countInputNeurons));
  // };

  useEffect(() => {
    setTrainingData(GetTrainingData(2, 1, ActivationFunctions[trainingDataFunction]));
  }, [trainingDataFunction]);

  return (
    <div>
      <label>
        Функция
        <select
          style={{ marginLeft: "5px" }}
          value={trainingDataFunction}
          onChange={(e) => setTrainingDataFunction(e.target.value)}
          name="training-function"
          id="training-function"
        >
          {Object.keys(TrainingDataFunctions).map((key) => (
            <option value={key}>{key}</option>
          ))}
        </select>
      </label>
      {trainingData && trainingData[0] ? (
        <table>
          <thead>
            <tr>
              {Array.from({ length: trainingData[0].length }).map((_, index) => (
                <th>x{index}</th>
              ))}
            </tr>
          </thead>
        </table>
      ) : (
        <></>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Wij(1)</th>
            {Array.from({ length: Settings.countInputNeurons }).map((_, index) => (
              <th>{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {inputWeightMatrix.map((row, index) => (
            <tr>
              <td>{index + 1}</td>
              {row.map((val) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <table className="table">
        <thead>
          <tr>
            <th>Wg(1)</th>
            {Array.from({ length: Settings.countInputNeurons }).map((_, index) => (
              <th>{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {outputWeightMatrix.map((row, index) => (
            <tr>
              <td>{index + 1}</td>
              {row.map((val) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

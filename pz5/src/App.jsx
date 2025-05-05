import { useEffect, useState } from "react";
import "./App.css";
import { GenerateWeightMatrix, GetTrainingData } from "./utils/Utils";
import Settings from "./core/Settings";
import TrainingDataFunctions from "./utils/TrainingDataFunctions";
import ActivationFunctions from "./core/ActivationFunctions"

const hz = (trainingVector, inputWeightMatrix, outputWeightMatrix, k) => {
  const vectorS = new Array(inputWeightMatrix.length).fill(0);
  for(let i = 0; i < vectorS.length; i++) {
    for(let j = 0; j < vectorS.length; j++) {
      vectorS[i] += trainingVector[j]*inputWeightMatrix[j][i];
    }
  }
  const vectorY = Array.from({length: vectorS.length}).map((_, index) => ActivationFunctions.Sigmoid.func(vectorS[index], k));
  console.log(vectorY);
}

function App() {
  const [trainingDataFunction, setTrainingDataFunction] = useState("Implication");
  const [trainingData, setTrainingData] = useState(GetTrainingData(Settings.countInputNeurons, Settings.countOutputNeurons, TrainingDataFunctions.Implication));
  const [inputWeightMatrix, setInputWeightMatrix] = useState(GenerateWeightMatrix(Settings.countInputNeurons, Settings.countInputNeurons));
  const [outputWeightMatrix, setOutputWeightMatrix] = useState(GenerateWeightMatrix(Settings.countOutputNeurons, Settings.countInputNeurons));

  useEffect(() => {
    setTrainingData(GetTrainingData(Settings.countInputNeurons, Settings.countOutputNeurons, TrainingDataFunctions[trainingDataFunction]))
  }, [trainingDataFunction]);

  const regenerateWeights = () => {
    setInputWeightMatrix(GenerateWeightMatrix(Settings.countInputNeurons, Settings.countInputNeurons));
    setOutputWeightMatrix(GenerateWeightMatrix(Settings.countOutputNeurons, Settings.countInputNeurons));

  }

  return (
    <div>
      <button onClick={() => hz([0,1,1], [[0.6, 0.9],[0.1,0.5]], [[0.3, 0.8]], 0.9)}>Тест</button>
      {/* <button onClick={() => hz(trainingData[1], inputWeightMatrix, outputWeightMatrix, Settings.k)}>Тест</button> */}
      <label>
        Функция
        <select value={trainingDataFunction} onChange={e => setTrainingDataFunction(e.target.value)} name="training-function" id="training-function">
          {Object.keys(TrainingDataFunctions).map((key => (
            <option value={key}>{key}</option>
          )))}
        </select>
      </label>
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: Settings.countInputNeurons }).map((_, index) => (
              <th>X{index + 1}</th>
            ))}
            {Settings.countOutputNeurons == 1 ? <th>D</th> : Array.from({ length: Settings.countOutputNeurons }).map((_, index) => <th>D{index + 1}</th>)}
          </tr>
        </thead>
        <tbody>
          {trainingData.map((row) => (
            <tr>
              {row.map((val) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>


      <button onClick={regenerateWeights}>Перегенерировать веса</button>

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

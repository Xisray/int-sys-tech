import TrainingDataFunctions from "./TrainingDataFunctions";

export function GetTrainingData(countInputNeurons, countOutputNeurons, func = TrainingDataFunctions.AND) {
  const colCount = countInputNeurons + countOutputNeurons;
  const rowCount = 1 << countInputNeurons;
  const result = new Array(rowCount);

  for (let i = 0; i < rowCount; i++) {
    const vector = new Array(colCount).fill(0);
    for (let j = 0; j < countInputNeurons; j++) {
      vector[j] = (i >> (countInputNeurons - 1 - j)) & 1;
    }
    vector[colCount - 1] = func(vector[0], vector[1]);
    result[rowCount - 1 - i] = vector;
  }
  return result;
}

export function GenerateWeightMatrix(rows, cols, round = 1) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => Number(Math.random().toFixed(round))));
}

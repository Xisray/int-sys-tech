import TrainingDataFunctions from "./TrainingDataFunctions";

export function GetTrainingData(countInputNeurons, countOutputNeurons, func = TrainingDataFunctions.AND) {
  const rowCount = 1 << countInputNeurons;
  const trainingData = new Array(rowCount);
  const resultTrainingData = new Array(rowCount);

  for (let i = 0; i < rowCount; i++) {
    const vector = new Array(countInputNeurons).fill(0);
    for (let j = 0; j < countInputNeurons; j++) {
      vector[j] = (i >> (countInputNeurons - 1 - j)) & 1;
    }
    // vector[colCount - 1] = func(vector[0], vector[1]);
    trainingData[rowCount - 1 - i] = vector;
    resultTrainingData[rowCount - 1 - i] = func(vector[0], vector[1]);
  }
  return [trainingData, resultTrainingData];
}

export function GenerateWeightMatrix(rows, cols, round = 1) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => Number(Math.random().toFixed(round))));
}

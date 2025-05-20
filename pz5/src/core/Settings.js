export default {
  countInputNeurons: 2,
  countOutputNeurons: 1,
  k: 0.6,
  preset: {
    trainingData: {
      matrixX: [
        [1, 1],
        [1, 0],
        [0, 1],
        [0, 0],
      ],
      vectorD: [0, 1, 1, 1],
    },
    inputWeights: [
      [0.6, 0.9],
      [0.4, 0.6],
    ],
    outputWeights: [[0.9], [0.8]],
    k: 0.9,
    speedRatio: 0.7,
  },
};

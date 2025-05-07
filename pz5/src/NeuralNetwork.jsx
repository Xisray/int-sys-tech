import React, { useState } from 'react';

const NeuralNetwork = () => {
  // Инициализация весов случайными значениями
  const [weights, setWeights] = useState({
    w1: [0.5, 0.8], // Веса для первого нейрона скрытого слоя
    w2: [0.4, 0.6], // Веса для второго нейрона скрытого слоя
    w3: [0.2, 0.7]  // Веса для выходного нейрона
  });

  // Обучающая выборка (импликация, без первой строки)
  const trainingData = [
    // { input: [0, 1], target: 1 },
    { input: [1, 0], target: 1 },
    // { input: [1, 1], target: 1 }
  ];

  // Функции активации (можно заменить на другие)
  const activationFunctions = {
    sigmoid: (x, k = 1) => 1 / (1 + Math.exp(-k * x)),
    sigmoidDerivative: (x, k = 1) => {
      const sig = activationFunctions.sigmoid(x, k);
      return k * sig * (1 - sig);
    },
    // Можно добавить другие функции активации
  };

  const [currentActivation, setCurrentActivation] = useState('sigmoid');
  const [learningRate, setLearningRate] = useState(0.5);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [logs, setLogs] = useState([]);

  // Прямое распространение
  const forwardPropagation = (input) => {
    const { w1, w2, w3 } = weights;

    // Активация скрытого слоя (2 нейрона)
    const h1Input = w1[0] * input[0] + w1[1] * input[1];
    const h1Output = activationFunctions[currentActivation](h1Input);

    const h2Input = w2[0] * input[0] + w2[1] * input[1];
    const h2Output = activationFunctions[currentActivation](h2Input);

    // Активация выходного слоя (1 нейрон)
    const o1Input = w3[0] * h1Output + w3[1] * h2Output;
    const o1Output = activationFunctions[currentActivation](o1Input);

    return {
      h1Input, h1Output,
      h2Input, h2Output,
      o1Input, o1Output
    };
  };

  // Обратное распространение ошибки
  const backPropagation = (input, target) => {
    const { h1Input, h1Output, h2Input, h2Output, o1Input, o1Output } = forwardPropagation(input);

    // Вычисление ошибки выходного слоя
    const outputError = o1Output - target;
    const outputDelta = outputError * activationFunctions.sigmoidDerivative(o1Input);

    // Вычисление ошибки скрытого слоя
    const h1Error = outputDelta * weights.w3[0];
    const h1Delta = h1Error * activationFunctions.sigmoidDerivative(h1Input);

    const h2Error = outputDelta * weights.w3[1];
    const h2Delta = h2Error * activationFunctions.sigmoidDerivative(h2Input);

    // Обновление весов
    const newWeights = { ...weights };

    // Обновление весов выходного нейрона
    newWeights.w3[0] -= learningRate * outputDelta * h1Output;
    newWeights.w3[1] -= learningRate * outputDelta * h2Output;

    // Обновление весов скрытых нейронов
    newWeights.w1[0] -= learningRate * h1Delta * input[0];
    newWeights.w1[1] -= learningRate * h1Delta * input[1];

    newWeights.w2[0] -= learningRate * h2Delta * input[0];
    newWeights.w2[1] -= learningRate * h2Delta * input[1];

    setWeights(newWeights);

    return {
      outputError,
      newWeights,
      output: o1Output
    };
  };

  // Выполнение одной итерации обучения
  const trainOneIteration = () => {
    const iterationLogs = [];
    let totalError = 0;

    // Проходим по всем примерам обучающей выборки
    trainingData.forEach((data, index) => {
      const { input, target } = data;
      const result = backPropagation(input, target);

      totalError += Math.pow(result.outputError, 2);

      iterationLogs.push({
        input,
        target,
        output: result.output,
        error: result.outputError
      });
    });

    const meanError = totalError / trainingData.length;
    setLogs([...logs, { iteration: currentIteration, meanError, details: iterationLogs }]);
    setCurrentIteration(currentIteration + 1);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Нейронная сеть для импликации</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Параметры сети</h2>
        <div>
          <label>
            Функция активации:
            <select
              value={currentActivation}
              onChange={(e) => setCurrentActivation(e.target.value)}
            >
              <option value="sigmoid">Сигмоида</option>
              {/* Можно добавить другие функции активации */}
            </select>
          </label>
        </div>
        <div>
          <label>
            Скорость обучения:
            <input
              type="number"
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Текущие веса</h2>
        <pre>{JSON.stringify(weights, null, 2)}</pre>
      </div>

      <button onClick={trainOneIteration} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Выполнить одну итерацию обучения
      </button>

      <div style={{ marginTop: '20px' }}>
        <h2>Результаты обучения</h2>
        <div>
          <h3>Текущая итерация: {currentIteration}</h3>
          {logs.length > 0 && (
            <div>
              <p>Средняя квадратичная ошибка: {logs[logs.length - 1].meanError.toFixed(6)}</p>
              <h4>Детали последней итерации:</h4>
              <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Вход</th>
                    <th>Цель</th>
                    <th>Выход</th>
                    <th>Ошибка</th>
                  </tr>
                </thead>
                <tbody>
                  {logs[logs.length - 1].details.map((detail, idx) => (
                    <tr key={idx}>
                      <td>{detail.input.join(', ')}</td>
                      <td>{detail.target}</td>
                      <td>{detail.output.toFixed(4)}</td>
                      <td>{detail.error.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeuralNetwork;

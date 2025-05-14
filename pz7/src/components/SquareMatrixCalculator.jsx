import React, { useState } from 'react';
import './MatrixCalculator.css';
import { calculateRelativeAssessment } from '../core/RelativeAssessment';

const MatrixCalculator = ({def}) => {
  const [size, setSize] = useState(def.length);
  const [matrix, setMatrix] = useState(def);
  const [results, setResults] = useState(null);

  const initMatrix = (size) => {
    const newMatrix = Array(size).fill().map(() => Array(size).fill(0));
    setMatrix(newMatrix);
  };

  const handleDimensionChange = (e) => {
    const numValue = parseInt(e.target.value) || 1;
    setSize(numValue);
    initMatrix(numValue);
  };

  const handleMatrixChange = (e, row, col) => {
    const newValue = parseFloat(e.target.value) || 0;
    const newMatrix = [...matrix];
    newMatrix[row][col] = newValue;
    setMatrix(newMatrix);
  };

  const calculateResults = () => {
    setResults(calculateRelativeAssessment(matrix));
  };
  const setDefault = () => {
    setSize(def.length);
    setMatrix(def);
  };

  return (
    <div className="matrix-container">
      <h2>Калькулятор групповых оценок</h2>
      <button onClick={setDefault}>Пресет</button>
      <div className="dimension-controls">
        <h3>Задайте размерность матрицы:</h3>
        <div className="dimension-inputs">
          <div>
            <label>Кол-во экспертов: </label>
            <input
              type="number"
              name="rows"
              min="1"
              onChange={handleDimensionChange}
              className="dimension-input"
              value={size}
            />
          </div>
        </div>
      </div>

      <div className="matrix-editor">
        <h3>Введите матрицу оценок:</h3>
        <div className="row center">
          <table className="matrix-table">
            <tbody>
              {matrix.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, colIndex) => (
                    <td key={`cell-${rowIndex}-${colIndex}`} className="matrix-cell">
                      <input
                        type="number"
                        step="0.01"
                        value={cell}
                        onChange={(e) => handleMatrixChange(e, rowIndex, colIndex)}
                        className="matrix-input"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={calculateResults}
        className="calculate-button"
      >
        Вычислить
      </button>

      {results && (
        <div className="results-container">
          <h3>Результаты:</h3>
          <pre>
            {results}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MatrixCalculator;

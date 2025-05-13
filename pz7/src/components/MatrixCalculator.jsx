import React, { useState } from 'react';
import './MatrixCalculator.css';
import { calculateRelativeAssessment } from '../core/RelativeAssessment';

const MatrixCalculator = () => {
  const [size, setSize] = useState(5);
  const [matrix, setMatrix] = useState(Array(5).fill().map(() => Array(5).fill(0)));
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
    // Здесь должна быть ваша логика вычислений
    setResults(calculateRelativeAssessment(matrix));
  };

  return (
    <div className="matrix-container">
      <h2>Калькулятор групповых оценок</h2>

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
            />
          </div>
        </div>
      </div>

      <div className="matrix-editor">
        <h3>Введите матрицу оценок:</h3>
        <div style={{ overflowX: 'auto' }}>
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
        className="calculate-button"
      >
        Вычислить
      </button>

      {results && (
        <div className="results-container">
          <h3>Результаты:</h3>
          <div className="results-list">
            <strong>Групповые оценки:</strong>
            <ul>
              {results.groupAssessment.map((res, index) => (
                <li key={`res-${index}`}>{res}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Количество итераций:</strong> {results.iterations}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatrixCalculator;
